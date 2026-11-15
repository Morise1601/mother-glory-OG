import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/types/database.types';
import type { Role } from '@/types/content.types';

export interface StaffActor {
  id: string;
  profileId: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
  isSuperAdmin: boolean;
}

export class AuthError extends Error {
  constructor(message: string, public readonly status: number = 403) {
    super(message);
    this.name = 'AuthError';
  }
}

/** Verify identity with Auth, then load the existing staff/role relationship. */
export async function getStaffActor(client: SupabaseClient<Database>): Promise<StaffActor> {
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError || !user) throw new AuthError('Please sign in to continue.', 401);

  let admin: ReturnType<typeof getAdminClient>;
  try {
    admin = getAdminClient();
  } catch {
    throw new AuthError('Staff access is not configured. Please contact the administrator.', 503);
  }
  const { data: profile, error: profileError } = await admin.from('staff_profiles')
    .select('id,full_name,email,status').eq('id', user.id).maybeSingle();
  if (profileError) throw new AuthError('Unable to verify staff access. Please try again.', 503);
  if (!profile || profile.status !== 'active') throw new AuthError('An active staff account is required.', 403);

  const { data: assignments, error: assignmentError } = await admin.from('staff_roles')
    .select('role_id').eq('staff_id', profile.id);
  if (assignmentError) throw new AuthError('Unable to verify staff roles.', 503);
  if (!assignments?.length) throw new AuthError('No active role is assigned to this account.', 403);
  const { data: roles, error: roleError } = await admin.from('roles')
    .select('id,slug,is_active').in('id', assignments.map(row => row.role_id)).eq('is_active', true);
  if (roleError) throw new AuthError('Unable to verify staff roles.', 503);
  if (!roles?.length) throw new AuthError('No active role is assigned to this account.', 403);

  const { data: superAdmin, error: superError } = await client.rpc('is_super_admin');
  if (superError) throw new AuthError('Unable to verify administrative permissions.', 503);
  const { data: grants, error: grantError } = await admin.from('role_permissions')
    .select('permission_id').in('role_id', roles.map(row => row.id));
  if (grantError) throw new AuthError('Unable to verify staff permissions.', 503);
  let permissions: string[] = [];
  if (grants?.length || superAdmin) {
    let query = admin.from('permissions').select('id,permission_key');
    if (!superAdmin) query = query.in('id', grants!.map(row => row.permission_id));
    const { data, error } = await query;
    if (error) throw new AuthError('Unable to verify staff permissions.', 503);
    permissions = [...new Set((data ?? []).map(row => row.permission_key))];
  }
  return {
    id: user.id,
    profileId: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: superAdmin ? 'admin' : permissions.some(key => /^(gallery|promotions|testimonials)\./.test(key)) ? 'editor' : 'staff',
    permissions,
    isSuperAdmin: superAdmin === true,
  };
}

export async function requireStaff(allowedRoles?: Role[]): Promise<StaffActor> {
  let client: SupabaseClient<Database>;
  try {
    client = await createClient();
  } catch {
    throw new AuthError('Staff sign-in is not configured. Please contact the administrator.', 503);
  }
  const actor = await getStaffActor(client);
  if (allowedRoles && !allowedRoles.includes(actor.role)) throw new AuthError('You do not have access to this area.', 403);
  return actor;
}

export async function requirePermission(permission: string): Promise<StaffActor> {
  const actor = await requireStaff();
  const client = await createClient();
  const { data, error } = await client.rpc('has_permission', { p_permission_key: permission });
  if (error) throw new AuthError('Unable to verify staff permissions.', 503);
  if (data !== true) throw new AuthError('You do not have permission to perform this action.', 403);
  return actor;
}

export function authErrorResponse(error: unknown) {
  if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 });
  return NextResponse.json({ error: error instanceof AuthError ? error.message : 'Unable to complete the request. Please try again.' }, {
    status: error instanceof AuthError ? error.status : 500,
    headers: { 'Cache-Control': 'no-store' },
  });
}
