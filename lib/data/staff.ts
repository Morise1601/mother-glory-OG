import 'server-only';
import type { Json } from '@/types/database.types';
import type { StaffDirectory } from '@/types/staff.types';
import { AuthError, requirePermission, type StaffActor } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { logAuditAction } from './audit';

async function recordStaffAudit(params: Parameters<typeof logAuditAction>[0]): Promise<{ warning?: string }> {
  try { await logAuditAction(params); return {}; }
  catch { return { warning: 'Changes were saved, but the audit event could not be recorded.' }; }
}

type StaffRpcName = 'mg_staff_security_ready' | 'mg_manage_staff' | 'mg_manage_role';
type StaffRpc = (name: StaffRpcName, args?: Record<string, Json | undefined>) => Promise<{ data: Json; error: { code?: string; message: string } | null }>;

async function callStaffRpc(name: StaffRpcName, args?: Record<string, Json | undefined>) {
  const client = await createClient();
  const { data, error } = await (client.rpc as unknown as StaffRpc)(name, args);
  if (error) {
    if (error.code === 'PGRST202' || error.code === '42883') throw new AuthError('Staff security setup is required. Apply the staff security migration before making changes.', 503);
    if (error.message.includes('final active super administrator')) throw new AuthError('The final active super administrator cannot be deactivated or have their administrator role removed.', 409);
    if (error.code === '42501') throw new AuthError('You do not have permission to perform this action.', 403);
    if (error.code === '23505') throw new AuthError('A staff account or role with these details already exists.', 409);
    if (error.code === 'P0002') throw new AuthError('Staff account or role not found.', 404);
    throw new AuthError('Unable to save staff access. Please check the account and role settings.', 400);
  }
  return data;
}

function can(actor: StaffActor, permission: string) {
  return actor.isSuperAdmin || actor.permissions.includes(permission);
}

export async function getAllStaff(): Promise<StaffDirectory> {
  const actor = await requirePermission('staff.view');
  const admin = getAdminClient();
  const results = await Promise.all([
    admin.from('staff_profiles').select('id,employee_id,full_name,email,status,created_at,updated_at,last_login_at').order('created_at', { ascending: false }),
    admin.from('staff_roles').select('staff_id,role_id'),
    admin.from('roles').select('id,name,slug,description,is_system,is_active').order('name'),
    admin.from('role_permissions').select('role_id,permission_id'),
    admin.from('permissions').select('id,permission_key,module,action,description').order('permission_key'),
  ]);
  if (results.some(result => result.error)) throw new AuthError('Unable to load the staff directory.', 503);
  const [profiles, assignments, roles, grants, permissions] = results;
  return {
    staff: (profiles.data ?? []).map(row => ({ id: row.id, name: row.full_name, email: row.email, employeeId: row.employee_id, status: row.status, roleIds: (assignments.data ?? []).filter(assignment => assignment.staff_id === row.id).map(assignment => assignment.role_id), createdAt: row.created_at, updatedAt: row.updated_at, lastLoginAt: row.last_login_at })),
    roles: (roles.data ?? []).map(row => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, isSystem: row.is_system, isActive: row.is_active, permissionIds: (grants.data ?? []).filter(grant => grant.role_id === row.id).map(grant => grant.permission_id) })),
    permissions: (permissions.data ?? []).map(row => ({ id: row.id, key: row.permission_key, module: row.module, action: row.action, description: row.description })),
    canCreateStaff: can(actor, 'staff.create'), canEditStaff: can(actor, 'staff.edit'),
    canManageRoles: can(actor, 'roles.manage'), canManagePermissions: can(actor, 'permissions.manage'),
    isSuperAdmin: actor.isSuperAdmin,
  };
}

function setupRedirect() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) throw new AuthError('Set NEXT_PUBLIC_SITE_URL before sending staff invitations.', 503);
  const target = new URL('/admin/reset-password', origin);
  if (target.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && target.hostname === 'localhost')) throw new AuthError('Staff invitations require a secure site URL.', 503);
  return target.href;
}

export async function inviteStaff(params: { name: string; email: string; roleId: string }) {
  const actor = await requirePermission('staff.create');
  const admin = getAdminClient();
  const { data: role, error: roleError } = await admin.from('roles').select('id,slug,is_active').eq('id', params.roleId).maybeSingle();
  if (roleError) throw new AuthError('Unable to verify the selected role.', 503);
  if (!role?.is_active) throw new AuthError('Select an active role.', 400);
  if (role.slug !== 'staff') await requirePermission('roles.manage');
  if (role.slug === 'super-admin' && !actor.isSuperAdmin) throw new AuthError('Only a super administrator can assign this role.', 403);
  const redirectTo = setupRedirect();
  await callStaffRpc('mg_staff_security_ready');

  // Create identity without emailing first so its role is saved before the link is usable.
  const { data, error } = await admin.auth.admin.createUser({ email: params.email, email_confirm: false, user_metadata: { full_name: params.name } });
  if (error || !data.user) throw new AuthError('Unable to create this account. Check whether the email is already registered.', 409);
  const userId = data.user.id;
  try {
    await callStaffRpc('mg_manage_staff', { p_staff_id: userId, p_full_name: params.name, p_email: params.email, p_employee_id: `MG-${userId.slice(0, 8).toUpperCase()}`, p_role_ids: [params.roleId], p_status: 'active', p_create: true });
  } catch (saveError) {
    // Roll back only the new identity created by this request; never an existing account.
    await admin.auth.admin.deleteUser(userId);
    throw saveError;
  }
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(params.email, { redirectTo });
  const audit = await recordStaffAudit({ actorId: actor.id, actorName: actor.name, action: 'staff.created', module: 'staff', entityType: 'staff_profiles', entityId: userId, severity: 'info', summary: 'Created a staff account and assigned its role.' });
  return { id: userId, ...audit, invitationSent: !inviteError, message: inviteError ? 'Staff account created, but the setup email could not be sent. Use Send setup link to retry.' : 'Staff account created. A secure setup link has been sent.' };
}

export async function updateStaffRoles(id: string, roleIds: string[]) {
  const actor = await requirePermission('staff.edit');
  await requirePermission('roles.manage');
  await callStaffRpc('mg_manage_staff', { p_staff_id: id, p_role_ids: [...new Set(roleIds)] });
  return recordStaffAudit({ actorId: actor.id, actorName: actor.name, action: 'staff.roles_updated', module: 'staff', entityType: 'staff_profiles', entityId: id, severity: 'warning', summary: 'Updated staff role assignments.' });
}

export async function toggleStaffStatus(id: string, status: string) {
  const actor = await requirePermission('staff.edit');
  await callStaffRpc('mg_manage_staff', { p_staff_id: id, p_status: status });
  return recordStaffAudit({ actorId: actor.id, actorName: actor.name, action: 'staff.status_updated', module: 'staff', entityType: 'staff_profiles', entityId: id, severity: 'warning', summary: `Changed staff account status to ${status}.` });
}

export async function resendStaffInvitation(id: string) {
  const actor = await requirePermission('staff.create');
  const admin = getAdminClient();
  if (!actor.isSuperAdmin) {
    const { data: assignments, error: assignmentError } = await admin.from('staff_roles').select('role_id').eq('staff_id', id);
    if (assignmentError) throw new AuthError('Unable to verify staff roles.', 503);
    if (assignments?.length) {
      const { data: superRoles, error: roleError } = await admin.from('roles').select('id').in('id', assignments.map(row => row.role_id)).eq('slug', 'super-admin');
      if (roleError) throw new AuthError('Unable to verify staff roles.', 503);
      if (superRoles?.length) throw new AuthError('Only a super administrator can manage this account.', 403);
    }
  }
  const { data: profile, error } = await admin.from('staff_profiles').select('email,status').eq('id', id).maybeSingle();
  if (error) throw new AuthError('Unable to load the staff account.', 503);
  if (!profile || profile.status !== 'active') throw new AuthError('An active staff account is required.', 400);
  const { data: identity, error: identityError } = await admin.auth.admin.getUserById(id);
  if (identityError || !identity.user) throw new AuthError('Staff identity not found.', 404);
  if (!identity.user.email || identity.user.email.toLowerCase() !== profile.email.toLowerCase()) throw new AuthError('The staff profile email does not match the sign-in identity. Correct the account before sending a setup link.', 409);
  if (identity.user.email_confirmed_at) throw new AuthError('This account is already set up. The staff member can use Forgot password to recover access.', 409);
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(identity.user.email, { redirectTo: setupRedirect() });
  if (inviteError) throw new AuthError('Unable to send the setup email. Please try again.', 502);
}

export async function saveStaffRole(params: { id?: string; name: string; slug: string; description: string; permissionIds?: string[]; isActive: boolean }) {
  const actor = await requirePermission('roles.manage');
  if (params.permissionIds) await requirePermission('permissions.manage');
  const result = await callStaffRpc('mg_manage_role', { p_role_id: params.id, p_name: params.name, p_slug: params.slug, p_description: params.description, p_permission_ids: params.permissionIds ? [...new Set(params.permissionIds)] : undefined, p_is_active: params.isActive });
  const audit = await recordStaffAudit({ actorId: actor.id, actorName: actor.name, action: 'role.saved', module: 'staff', entityType: 'roles', severity: 'warning', summary: 'Saved an access role and its permission grants.' });
  return { role: result, ...audit };
}
