-- Add admission-specific grants to the existing RBAC catalog.
-- Content permissions and admission permissions are independent, including combined roles.
BEGIN;

INSERT INTO public.permissions (id, permission_key, module, action, description)
VALUES
  (gen_random_uuid(), 'enquiries.view_assigned', 'enquiries', 'view_assigned', 'View only admission enquiries assigned to this staff member.'),
  (gen_random_uuid(), 'enquiries.view_all', 'enquiries', 'view_all', 'View all admission enquiries.'),
  (gen_random_uuid(), 'enquiries.update_assigned', 'enquiries', 'update_assigned', 'Update status and counselling notes only on assigned admission enquiries.'),
  (gen_random_uuid(), 'enquiries.update_all', 'enquiries', 'update_all', 'Update status and counselling notes on all admission enquiries.'),
  (gen_random_uuid(), 'enquiries.assign', 'enquiries', 'assign', 'Assign admission enquiries to staff members.')
ON CONFLICT (permission_key) DO NOTHING;

-- Preserve all existing role grants. The standard staff role receives assigned access only.
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.slug = 'staff' AND r.is_system = true
  AND p.permission_key IN ('enquiries.view_assigned', 'enquiries.update_assigned')
ON CONFLICT (role_id, permission_id) DO NOTHING;

COMMIT;
