import 'server-only';
import { AuthError, requireStaff, requirePermission, type StaffActor } from './server';
import { enquiryAccessPermission, type EnquiryAccessMode } from './enquiry-access';

export { canViewEnquiries } from './enquiry-access';

/** Read and mutation scopes remain independent, so view-all cannot widen update-assigned. */
export function enquiryScope(actor: StaffActor, mode: EnquiryAccessMode = 'read'): { id: string; role: 'admin' | 'staff' } {
  const permission = enquiryAccessPermission(actor, mode);
  if (!permission) throw new AuthError('You do not have permission to access admission enquiries.', 403);
  return { id: actor.id, role: permission.endsWith('_all') || mode === 'assign' ? 'admin' : 'staff' };
}

export async function requireEnquiryAccess(mode: EnquiryAccessMode = 'read'): Promise<StaffActor> {
  const actor = await requireStaff();
  const permission = enquiryAccessPermission(actor, mode);
  if (!permission) throw new AuthError('You do not have permission to access admission enquiries.', 403);
  // The authenticated RPC enforces the current role grants and any assurance requirements.
  return requirePermission(permission);
}
