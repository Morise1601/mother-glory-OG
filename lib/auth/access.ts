import type { StaffActor } from './server';
import { canViewEnquiries } from './enquiry-access';

/** Permission names come from the project's existing permissions catalog. */
export function adminPagePermission(pathname: string): string | null {
  const section = pathname.split('/')[2];
  switch (section) {
    case 'dashboard': return 'dashboard.view';
    case 'achievements':
    case 'media': return 'gallery.view';
    case 'banners':
    case 'popup': return 'promotions.view';
    case 'staff': return 'staff.view';
    case 'audit': return 'logs.view';
    case 'founders':
    case 'programs':
    case 'reviews':
    case 'settings': return 'settings.manage';
    default: return null;
  }
}

export function canAccessAdminPage(actor: StaffActor, pathname: string): boolean {
  if (pathname === '/admin/enquiries') return canViewEnquiries(actor);
  const permission = adminPagePermission(pathname);
  return permission !== null && (actor.isSuperAdmin || actor.permissions.includes(permission));
}

export function firstAccessibleAdminPage(actor: StaffActor): string {
  return ['/admin/dashboard', '/admin/achievements', '/admin/banners', '/admin/media', '/admin/founders', '/admin/programs', '/admin/staff', '/admin/settings', '/admin/audit', '/admin/enquiries']
    .find(path => canAccessAdminPage(actor, path)) || '/admin?error=access_denied';
}
