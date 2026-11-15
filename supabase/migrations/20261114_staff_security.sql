-- Additive security functions for the existing staff_profiles/staff_roles RBAC schema.
-- This migration does not replace tables or rewrite existing staff/role records.
BEGIN;

CREATE OR REPLACE FUNCTION public.mg_staff_security_ready()
RETURNS boolean LANGUAGE sql STABLE SET search_path = public, pg_temp
AS $$ SELECT true; $$;

CREATE OR REPLACE FUNCTION public.mg_guard_last_super_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  target_id uuid;
  removing_admin boolean := false;
  remaining_count integer;
BEGIN
  -- All role/status removals share a lock, including direct table writes through RLS.
  PERFORM pg_advisory_xact_lock(hashtext('mother-glory-final-super-admin'));
  IF TG_TABLE_NAME = 'staff_profiles' THEN
    IF TG_OP = 'UPDATE' AND NEW.id <> OLD.id THEN
      RAISE EXCEPTION 'Staff identities cannot be changed.' USING ERRCODE = '42501';
    END IF;
    target_id := OLD.id;
    IF TG_OP = 'DELETE' THEN
      removing_admin := OLD.status::text = 'active';
    ELSE
      removing_admin := OLD.status::text = 'active' AND NEW.status::text <> 'active';
    END IF;
    removing_admin := removing_admin AND EXISTS (
      SELECT 1 FROM public.staff_roles sr JOIN public.roles r ON r.id = sr.role_id
      WHERE sr.staff_id = target_id AND r.slug = 'super-admin' AND r.is_active
    );
  ELSIF TG_TABLE_NAME = 'staff_roles' THEN
    target_id := OLD.staff_id;
    IF TG_OP = 'DELETE' THEN
      removing_admin := true;
    ELSE
      removing_admin := NEW.staff_id <> OLD.staff_id OR NEW.role_id <> OLD.role_id;
    END IF;
    removing_admin := removing_admin AND EXISTS (
      SELECT 1 FROM public.roles r JOIN public.staff_profiles sp ON sp.id = target_id
      WHERE r.id = OLD.role_id AND r.slug = 'super-admin' AND r.is_active AND sp.status::text = 'active'
    );
  END IF;
  IF removing_admin THEN
    SELECT count(DISTINCT sp.id) INTO remaining_count
    FROM public.staff_profiles sp JOIN public.staff_roles sr ON sr.staff_id = sp.id
    JOIN public.roles r ON r.id = sr.role_id
    WHERE sp.status::text = 'active' AND r.is_active AND r.slug = 'super-admin';
    IF remaining_count <= 1 THEN
      RAISE EXCEPTION 'The final active super administrator cannot be removed.' USING ERRCODE = 'P0001';
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS mg_staff_profile_last_admin ON public.staff_profiles;
CREATE TRIGGER mg_staff_profile_last_admin BEFORE UPDATE OR DELETE ON public.staff_profiles
FOR EACH ROW EXECUTE FUNCTION public.mg_guard_last_super_admin();
DROP TRIGGER IF EXISTS mg_staff_role_last_admin ON public.staff_roles;
CREATE TRIGGER mg_staff_role_last_admin BEFORE UPDATE OR DELETE ON public.staff_roles
FOR EACH ROW EXECUTE FUNCTION public.mg_guard_last_super_admin();

CREATE OR REPLACE FUNCTION public.mg_guard_system_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('mother-glory-final-super-admin'));
  IF TG_OP = 'UPDATE' AND NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'Role identities cannot be changed.' USING ERRCODE = '42501';
  END IF;
  IF OLD.slug = 'super-admin' THEN
    RAISE EXCEPTION 'The system super administrator role is protected.' USING ERRCODE = '42501';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.is_system AND NEW.slug <> OLD.slug THEN
    RAISE EXCEPTION 'System role identifiers cannot be changed.' USING ERRCODE = '42501';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS mg_protect_system_roles ON public.roles;
CREATE TRIGGER mg_protect_system_roles BEFORE UPDATE OR DELETE ON public.roles
FOR EACH ROW EXECUTE FUNCTION public.mg_guard_system_role();

CREATE OR REPLACE FUNCTION public.mg_manage_staff(
  p_staff_id uuid,
  p_full_name text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_employee_id text DEFAULT NULL,
  p_role_ids uuid[] DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_create boolean DEFAULT false
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  caller_id uuid := auth.uid();
  assigned_role_id uuid;
  target_email text;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('mother-glory-final-super-admin'));
  IF caller_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.staff_profiles WHERE id = caller_id AND status::text = 'active') THEN
    RAISE EXCEPTION 'Active staff access is required.' USING ERRCODE = '42501';
  END IF;
  IF NOT public.has_permission(CASE WHEN p_create THEN 'staff.create' ELSE 'staff.edit' END) THEN
    RAISE EXCEPTION 'Staff management permission is required.' USING ERRCODE = '42501';
  END IF;
  IF NOT public.is_super_admin() AND EXISTS (
    SELECT 1 FROM public.staff_roles sr JOIN public.roles r ON r.id = sr.role_id
    WHERE sr.staff_id = p_staff_id AND r.slug = 'super-admin'
  ) THEN
    RAISE EXCEPTION 'Only a super administrator can change this account.' USING ERRCODE = '42501';
  END IF;
  IF p_staff_id IS NULL OR (p_status IS NOT NULL AND p_status NOT IN ('active', 'inactive', 'on_leave', 'suspended')) THEN
    RAISE EXCEPTION 'Invalid staff account or status.' USING ERRCODE = '22023';
  END IF;
  IF p_role_ids IS NOT NULL THEN
    IF cardinality(p_role_ids) < 1 OR cardinality(p_role_ids) > 20 OR
      (SELECT count(*) FROM public.roles WHERE id = ANY(p_role_ids) AND is_active) <> cardinality(p_role_ids) THEN
      RAISE EXCEPTION 'Select active, distinct role assignments.' USING ERRCODE = '22023';
    END IF;
    IF NOT public.has_permission('roles.manage') AND NOT (
      p_create AND cardinality(p_role_ids) = 1 AND EXISTS (SELECT 1 FROM public.roles WHERE id = p_role_ids[1] AND slug = 'staff' AND is_active)
    ) THEN
      RAISE EXCEPTION 'Role management permission is required.' USING ERRCODE = '42501';
    END IF;
    IF EXISTS (SELECT 1 FROM public.roles WHERE id = ANY(p_role_ids) AND slug = 'super-admin') AND NOT public.is_super_admin() THEN
      RAISE EXCEPTION 'Only a super administrator can assign this role.' USING ERRCODE = '42501';
    END IF;
  ELSIF p_create THEN
    RAISE EXCEPTION 'A role is required for a new staff account.' USING ERRCODE = '22023';
  END IF;
  IF p_create THEN
    IF EXISTS (SELECT 1 FROM public.staff_profiles WHERE id = p_staff_id) AND NOT public.has_permission('staff.edit') THEN
      RAISE EXCEPTION 'Editing an existing profile requires staff edit access.' USING ERRCODE = '42501';
    END IF;
    IF p_full_name IS NULL OR char_length(btrim(p_full_name)) NOT BETWEEN 2 AND 100 OR p_employee_id IS NULL OR char_length(btrim(p_employee_id)) NOT BETWEEN 1 AND 50 THEN
      RAISE EXCEPTION 'Invalid staff details.' USING ERRCODE = '22023';
    END IF;
    SELECT email INTO target_email FROM auth.users WHERE id = p_staff_id;
    IF p_email IS NULL OR target_email IS NULL OR lower(target_email) <> lower(p_email) THEN
      RAISE EXCEPTION 'The staff email must match its authenticated identity.' USING ERRCODE = '22023';
    END IF;
    INSERT INTO public.staff_profiles (id, employee_id, full_name, email, status, created_by, updated_by)
    VALUES (p_staff_id, p_employee_id, btrim(p_full_name), lower(p_email), COALESCE(p_status, 'active')::public.staff_status, caller_id, caller_id)
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, updated_by = caller_id, updated_at = now();
  ELSE
    IF NOT EXISTS (SELECT 1 FROM public.staff_profiles WHERE id = p_staff_id) THEN
      RAISE EXCEPTION 'Staff account not found.' USING ERRCODE = 'P0002';
    END IF;
    IF p_status IS NOT NULL THEN
      UPDATE public.staff_profiles SET status = p_status::public.staff_status, updated_by = caller_id, updated_at = now() WHERE id = p_staff_id;
    END IF;
  END IF;
  IF p_role_ids IS NOT NULL THEN
    -- Preserve retained grants so the last-admin trigger sees no temporary demotion.
    DELETE FROM public.staff_roles WHERE staff_id = p_staff_id AND NOT (role_id = ANY(p_role_ids));
    UPDATE public.staff_roles SET is_primary = false WHERE staff_id = p_staff_id;
    FOREACH assigned_role_id IN ARRAY p_role_ids LOOP
      INSERT INTO public.staff_roles (staff_id, role_id, is_primary, assigned_by)
      VALUES (p_staff_id, assigned_role_id, assigned_role_id = p_role_ids[1], caller_id)
      ON CONFLICT (staff_id, role_id) DO UPDATE SET is_primary = EXCLUDED.is_primary, assigned_by = caller_id, assigned_at = now();
    END LOOP;
    UPDATE public.staff_profiles SET updated_by = caller_id, updated_at = now() WHERE id = p_staff_id;
  END IF;
  RETURN jsonb_build_object('id', p_staff_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.mg_manage_role(
  p_role_id uuid DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_slug text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_permission_ids uuid[] DEFAULT NULL,
  p_is_active boolean DEFAULT true
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
  caller_id uuid := auth.uid();
  target_id uuid := COALESCE(p_role_id, gen_random_uuid());
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('mother-glory-final-super-admin'));
  IF caller_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.staff_profiles WHERE id = caller_id AND status::text = 'active') OR NOT public.has_permission('roles.manage') THEN
    RAISE EXCEPTION 'Role management permission is required.' USING ERRCODE = '42501';
  END IF;
  IF p_permission_ids IS NOT NULL AND NOT public.has_permission('permissions.manage') THEN
    RAISE EXCEPTION 'Permission management access is required.' USING ERRCODE = '42501';
  END IF;
  IF p_name IS NULL OR char_length(btrim(p_name)) NOT BETWEEN 2 AND 80 OR p_slug IS NULL OR p_slug !~ '^[a-z][a-z0-9-]{1,59}$' OR char_length(COALESCE(p_description, '')) > 500 OR p_slug = 'super-admin' THEN
    RAISE EXCEPTION 'Invalid or protected role details.' USING ERRCODE = '22023';
  END IF;
  IF p_permission_ids IS NOT NULL AND (cardinality(p_permission_ids) > 200 OR (SELECT count(*) FROM public.permissions WHERE id = ANY(p_permission_ids)) <> cardinality(p_permission_ids)) THEN
    RAISE EXCEPTION 'Select valid, distinct permissions.' USING ERRCODE = '22023';
  END IF;
  IF p_role_id IS NULL THEN
    INSERT INTO public.roles (id, name, slug, description, is_system, is_active, created_by)
    VALUES (target_id, btrim(p_name), p_slug, NULLIF(btrim(p_description), ''), false, COALESCE(p_is_active, true), caller_id);
  ELSE
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE id = target_id) THEN
      RAISE EXCEPTION 'Role not found.' USING ERRCODE = 'P0002';
    END IF;
    UPDATE public.roles SET name = btrim(p_name), slug = p_slug, description = NULLIF(btrim(p_description), ''), is_active = COALESCE(p_is_active, true), updated_at = now()
    WHERE id = target_id;
  END IF;
  IF p_permission_ids IS NOT NULL THEN
    DELETE FROM public.role_permissions WHERE role_id = target_id AND NOT (permission_id = ANY(p_permission_ids));
    INSERT INTO public.role_permissions (role_id, permission_id, created_by)
    SELECT target_id, item, caller_id FROM unnest(p_permission_ids) item
    ON CONFLICT (role_id, permission_id) DO NOTHING;
  END IF;
  RETURN jsonb_build_object('id', target_id);
END;
$$;

REVOKE ALL ON FUNCTION public.mg_staff_security_ready() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mg_manage_staff(uuid,text,text,text,uuid[],text,boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mg_manage_role(uuid,text,text,text,uuid[],boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mg_guard_last_super_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.mg_guard_system_role() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mg_staff_security_ready() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mg_manage_staff(uuid,text,text,text,uuid[],text,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mg_manage_role(uuid,text,text,text,uuid[],boolean) TO authenticated;

-- Reserved website documents include unpublished content and admission PII.
-- Restrictive policies intersect all existing permissive policies without replacing them.
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mg_private_cms_documents ON public.app_settings;
CREATE POLICY mg_private_cms_documents ON public.app_settings AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (left(setting_key, 11) <> 'public_cms.')
WITH CHECK (left(setting_key, 11) <> 'public_cms.');

-- App audit writes use the service role after server authorization; clients cannot forge them.
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mg_audit_insert_server_only ON public.audit_logs;
CREATE POLICY mg_audit_insert_server_only ON public.audit_logs AS RESTRICTIVE
FOR INSERT TO anon, authenticated WITH CHECK (false);
DROP POLICY IF EXISTS mg_audit_update_server_only ON public.audit_logs;
CREATE POLICY mg_audit_update_server_only ON public.audit_logs AS RESTRICTIVE
FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS mg_audit_delete_server_only ON public.audit_logs;
CREATE POLICY mg_audit_delete_server_only ON public.audit_logs AS RESTRICTIVE
FOR DELETE TO anon, authenticated USING (false);
DROP POLICY IF EXISTS mg_audit_read_scope ON public.audit_logs;
CREATE POLICY mg_audit_read_scope ON public.audit_logs AS RESTRICTIVE
FOR SELECT TO anon, authenticated USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM public.staff_profiles WHERE id = auth.uid() AND status::text = 'active') AND
  public.has_permission('logs.view')
);

COMMIT;
