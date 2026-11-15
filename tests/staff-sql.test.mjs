import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const admin1 = '00000000-0000-4000-8000-000000000001';
const admin2 = '00000000-0000-4000-8000-000000000002';
const staff = '00000000-0000-4000-8000-000000000003';
const adminRole = '10000000-0000-4000-8000-000000000001';
const staffRole = '10000000-0000-4000-8000-000000000002';
const dashboardPermission = '20000000-0000-4000-8000-000000000001';
const settingsPermission = '20000000-0000-4000-8000-000000000002';

async function fixture() {
  const db = new PGlite();
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE TABLE auth.users(id uuid PRIMARY KEY,email text NOT NULL);
    CREATE TYPE public.staff_status AS ENUM('active','inactive','on_leave','suspended');
    CREATE TABLE public.staff_profiles(id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,employee_id text UNIQUE NOT NULL,full_name text NOT NULL,email text UNIQUE NOT NULL,status public.staff_status NOT NULL DEFAULT 'active',created_by uuid,updated_by uuid,created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now());
    CREATE TABLE public.roles(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name text NOT NULL,slug text UNIQUE NOT NULL,description text,is_system boolean DEFAULT false,is_active boolean DEFAULT true,created_by uuid,created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now());
    CREATE TABLE public.permissions(id uuid PRIMARY KEY,permission_key text UNIQUE NOT NULL);
    CREATE TABLE public.staff_roles(staff_id uuid REFERENCES public.staff_profiles(id) ON DELETE CASCADE,role_id uuid REFERENCES public.roles(id),is_primary boolean DEFAULT false,assigned_by uuid,assigned_at timestamptz DEFAULT now(),PRIMARY KEY(staff_id,role_id));
    CREATE TABLE public.role_permissions(role_id uuid REFERENCES public.roles(id),permission_id uuid REFERENCES public.permissions(id),created_by uuid,PRIMARY KEY(role_id,permission_id));
    CREATE TABLE public.app_settings(setting_key text PRIMARY KEY,setting_value jsonb,is_public boolean DEFAULT false);
    CREATE TABLE public.audit_logs(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),summary text);
    CREATE POLICY legacy_settings_permissive ON public.app_settings FOR ALL USING(true) WITH CHECK(true);
    CREATE POLICY legacy_audit_permissive ON public.audit_logs FOR ALL USING(true) WITH CHECK(true);
    INSERT INTO auth.users VALUES('${admin1}','first@example.com'),('${admin2}','second@example.com'),('${staff}','staff@example.com');
    INSERT INTO public.staff_profiles(id,employee_id,full_name,email) VALUES('${admin1}','A1','First Admin','first@example.com'),('${admin2}','A2','Second Admin','second@example.com'),('${staff}','S1','Staff Member','staff@example.com');
    INSERT INTO public.roles(id,name,slug,is_system) VALUES('${adminRole}','Super Admin','super-admin',true),('${staffRole}','Staff','staff',true);
    INSERT INTO public.staff_roles(staff_id,role_id) VALUES('${admin1}','${adminRole}'),('${admin2}','${adminRole}'),('${staff}','${staffRole}');
    INSERT INTO public.permissions VALUES('${dashboardPermission}','dashboard.view'),('${settingsPermission}','settings.manage');
    INSERT INTO public.role_permissions(role_id,permission_id) VALUES('${staffRole}','${dashboardPermission}');
    CREATE FUNCTION public.is_super_admin() RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM staff_profiles sp JOIN staff_roles sr ON sr.staff_id=sp.id JOIN roles r ON r.id=sr.role_id WHERE sp.id=auth.uid() AND sp.status='active' AND r.slug='super-admin' AND r.is_active) $$;
    CREATE FUNCTION public.has_permission(p_permission_key text) RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path=public AS $$ SELECT public.is_super_admin() OR EXISTS(SELECT 1 FROM staff_profiles sp JOIN staff_roles sr ON sr.staff_id=sp.id JOIN roles r ON r.id=sr.role_id JOIN role_permissions rp ON rp.role_id=r.id JOIN permissions p ON p.id=rp.permission_id WHERE sp.id=auth.uid() AND sp.status='active' AND r.is_active AND p.permission_key=p_permission_key) $$;
    GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
    GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO anon,authenticated,service_role;
  `);
  await db.exec(fs.readFileSync('supabase/migrations/20261114_staff_security.sql', 'utf8'));
  return db;
}

async function actingAs(db, id, role = 'authenticated') {
  await db.exec(`RESET ROLE; SELECT set_config('request.jwt.claim.sub','${id || ''}',false); SET ROLE ${role};`);
}

test('staff migration executes twice and atomically saves actual role grants and staff creation', async () => {
  const db = await fixture();
  try {
    await db.exec(fs.readFileSync('supabase/migrations/20261114_staff_security.sql', 'utf8'));
    await actingAs(db, admin1);
    const result = await db.query(`SELECT public.mg_manage_role(p_name:='Site Editor',p_slug:='site-editor',p_permission_ids:=ARRAY['${dashboardPermission}'::uuid,'${settingsPermission}'::uuid]) AS role`);
    const id = result.rows[0].role.id;
    assert.equal((await db.query(`SELECT count(*)::int AS count FROM public.role_permissions WHERE role_id='${id}'`)).rows[0].count, 2);
    await db.query(`SELECT public.mg_manage_role(p_role_id:='${id}',p_name:='Site Editor',p_slug:='site-editor',p_permission_ids:=ARRAY['${dashboardPermission}'::uuid])`);
    assert.equal((await db.query(`SELECT count(*)::int AS count FROM public.role_permissions WHERE role_id='${id}'`)).rows[0].count, 1);
    await db.exec(`RESET ROLE; INSERT INTO auth.users VALUES('00000000-0000-4000-8000-000000000004','new@example.com');`);
    await actingAs(db, admin1);
    await assert.rejects(db.query(`SELECT public.mg_manage_staff(p_staff_id:='00000000-0000-4000-8000-000000000004',p_full_name:='New Staff',p_email:='other@example.com',p_employee_id:='S2',p_role_ids:=ARRAY['${staffRole}'::uuid],p_status:='active',p_create:=true)`), /email must match/i);
    await db.query(`SELECT public.mg_manage_staff(p_staff_id:='00000000-0000-4000-8000-000000000004',p_full_name:='New Staff',p_email:='new@example.com',p_employee_id:='S2',p_role_ids:=ARRAY['${staffRole}'::uuid],p_status:='active',p_create:=true)`);
    const profile = await db.query(`SELECT sp.full_name,sr.role_id FROM public.staff_profiles sp JOIN public.staff_roles sr ON sr.staff_id=sp.id WHERE sp.employee_id='S2'`);
    assert.deepEqual(profile.rows[0], { full_name: 'New Staff', role_id: staffRole });
  } finally { await db.close(); }
});

test('staff migration blocks unauthorized access and final admin removal through RPC and direct multirow writes', async () => {
  const db = await fixture();
  try {
    await actingAs(db, null, 'anon');
    await assert.rejects(db.query(`SELECT public.mg_manage_staff(p_staff_id:='${staff}',p_status:='inactive')`), /permission denied/i);
    await actingAs(db, staff);
    await assert.rejects(db.query(`SELECT public.mg_manage_staff(p_staff_id:='${admin1}',p_status:='inactive')`), /permission/i);
    await actingAs(db, admin1);
    await assert.rejects(db.query(`UPDATE public.staff_profiles SET id='00000000-0000-4000-8000-000000000099' WHERE id='${admin2}'`), /staff identities cannot be changed/i);
    await assert.rejects(db.query(`UPDATE public.roles SET id='10000000-0000-4000-8000-000000000099' WHERE id='${staffRole}'`), /role identities cannot be changed/i);
    await assert.rejects(db.query(`UPDATE public.staff_profiles SET status='inactive' WHERE id IN('${admin1}','${admin2}')`), /final active super administrator/i);
    assert.equal((await db.query(`SELECT count(*)::int AS count FROM public.staff_profiles WHERE status='active' AND id IN('${admin1}','${admin2}')`)).rows[0].count, 2);
    await assert.rejects(db.query(`DELETE FROM public.staff_roles WHERE role_id='${adminRole}'`), /final active super administrator/i);
    await db.query(`SELECT public.mg_manage_staff(p_staff_id:='${admin2}',p_status:='inactive')`);
    await assert.rejects(db.query(`SELECT public.mg_manage_staff(p_staff_id:='${admin1}',p_status:='inactive')`), /final active super administrator/i);
    await assert.rejects(db.query(`SELECT public.mg_manage_staff(p_staff_id:='${admin1}',p_role_ids:=ARRAY['${staffRole}'::uuid])`), /final active super administrator/i);
    await assert.rejects(db.query(`UPDATE public.roles SET is_active=false WHERE id='${adminRole}'`), /protected/i);
  } finally { await db.close(); }
});

test('admissions migration preserves role grants and grants only assigned access to the existing staff system role', async () => {
  const db = await fixture();
  try {
    await db.exec(`
      ALTER TABLE public.permissions ADD COLUMN module text NOT NULL DEFAULT 'test', ADD COLUMN action text NOT NULL DEFAULT 'test', ADD COLUMN description text;
      INSERT INTO public.roles(id,name,slug,is_system) VALUES('10000000-0000-4000-8000-000000000003','Content Editor','content-editor',false);
      INSERT INTO public.permissions(id,permission_key) VALUES('20000000-0000-4000-8000-000000000003','gallery.view');
      INSERT INTO public.role_permissions(role_id,permission_id) VALUES('10000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000003');
      INSERT INTO public.staff_roles(staff_id,role_id) VALUES('${staff}','10000000-0000-4000-8000-000000000003');
    `);
    const migration = fs.readFileSync('supabase/migrations/20261114_enquiry_permissions.sql', 'utf8');
    await db.exec(migration);
    await db.exec(migration);
    const standardGrants = await db.query(`SELECT p.permission_key FROM public.role_permissions rp JOIN public.permissions p ON p.id=rp.permission_id WHERE rp.role_id='${staffRole}' ORDER BY p.permission_key`);
    assert.deepEqual(standardGrants.rows.map(row => row.permission_key), ['dashboard.view', 'enquiries.update_assigned', 'enquiries.view_assigned']);
    const customGrants = await db.query(`SELECT p.permission_key FROM public.role_permissions rp JOIN public.permissions p ON p.id=rp.permission_id WHERE rp.role_id='10000000-0000-4000-8000-000000000003'`);
    assert.deepEqual(customGrants.rows.map(row => row.permission_key), ['gallery.view']);
    assert.equal((await db.query(`SELECT count(*)::int AS count FROM public.permissions WHERE module='enquiries'`)).rows[0].count, 5);
    await actingAs(db, staff);
    const combined = await db.query(`SELECT public.has_permission('gallery.view') AS gallery, public.has_permission('enquiries.view_assigned') AS view_assigned, public.has_permission('enquiries.update_assigned') AS update_assigned, public.has_permission('enquiries.view_all') AS view_all, public.has_permission('enquiries.update_all') AS update_all, public.has_permission('enquiries.assign') AS assign`);
    assert.deepEqual(combined.rows[0], { gallery: true, view_assigned: true, update_assigned: true, view_all: false, update_all: false, assign: false });
    await actingAs(db, admin1);
    assert.equal((await db.query(`SELECT public.has_permission('enquiries.assign') AS allowed`)).rows[0].allowed, true);
    await db.exec(`RESET ROLE; UPDATE public.roles SET is_active=false WHERE id='${staffRole}';`);
    await actingAs(db, staff);
    assert.equal((await db.query(`SELECT public.has_permission('enquiries.view_assigned') AS allowed`)).rows[0].allowed, false);
  } finally { await db.close(); }
});

test('restrictive policies hide private CMS documents and prevent forged audit writes despite permissive legacy policies', async () => {
  const db = await fixture();
  try {
    await db.exec(`INSERT INTO public.app_settings VALUES('public_cms.enquiries','{"private":true}',false),('ordinary.setting','{}',true); INSERT INTO public.audit_logs(summary) VALUES('Server audit');`);
    for (const [id, role] of [[null,'anon'],[staff,'authenticated'],[admin1,'authenticated']]) {
      await actingAs(db, id, role);
      assert.deepEqual((await db.query('SELECT setting_key FROM public.app_settings')).rows, [{ setting_key: 'ordinary.setting' }]);
      await assert.rejects(db.query(`INSERT INTO public.app_settings VALUES('public_cms.injected','{}',false)`), /row-level security/i);
      await assert.rejects(db.query(`UPDATE public.app_settings SET setting_key='public_cms.injected' WHERE setting_key='ordinary.setting'`), /row-level security/i);
      await assert.rejects(db.query(`INSERT INTO public.audit_logs(summary) VALUES('Forged actor')`), /row-level security/i);
      assert.equal((await db.query(`UPDATE public.audit_logs SET summary='Changed' RETURNING id`)).rows.length, 0);
      assert.equal((await db.query(`DELETE FROM public.audit_logs RETURNING id`)).rows.length, 0);
    }
    await actingAs(db, null, 'service_role');
    assert.equal((await db.query(`SELECT setting_key FROM public.app_settings WHERE setting_key='public_cms.enquiries'`)).rows.length, 1);
    await db.query(`INSERT INTO public.audit_logs(summary) VALUES('Real server audit')`);
    assert.equal((await db.query('SELECT count(*)::int AS count FROM public.audit_logs')).rows[0].count, 2);
  } finally { await db.close(); }
});
