import type { StaffActor } from './server';

export type EnquiryAccessMode = 'read' | 'update' | 'assign';

/** Page visibility is safe to compute in the browser; server actions recheck RPC grants. */
export function enquiryAccessPermission(actor: StaffActor, mode: EnquiryAccessMode): string | null {
  if (mode === 'assign') return actor.isSuperAdmin || actor.permissions.includes('enquiries.assign') ? 'enquiries.assign' : null;
  const prefix = mode === 'read' ? 'view' : 'update';
  const all = `enquiries.${prefix}_all`;
  const assigned = `enquiries.${prefix}_assigned`;
  if (actor.isSuperAdmin || actor.permissions.includes(all)) return all;
  return actor.permissions.includes(assigned) ? assigned : null;
}

export function canViewEnquiries(actor: StaffActor): boolean {
  return enquiryAccessPermission(actor, 'read') !== null;
}
