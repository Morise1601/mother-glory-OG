import { NextResponse } from 'next/server';
import { requirePermission, authErrorResponse } from '@/lib/auth/server';
import { getPrograms } from '@/lib/data/programs';
import { getAchievements } from '@/lib/data/achievements';
import { getEnquiriesForStaff } from '@/lib/data/enquiries';
import { getAuditLogs } from '@/lib/data/audit';
import { getAdminClient } from '@/lib/supabase/admin';
import { canViewEnquiries, enquiryScope } from '@/lib/auth/enquiries';

export async function GET() {
  try {
    const actor = await requirePermission('dashboard.view');
    const can = (permission: string) => actor.isSuperAdmin || actor.permissions.includes(permission);
    const [programs, achievements, enquiries, staff, activity] = await Promise.all([
      can('settings.manage') ? getPrograms() : null,
      can('gallery.view') ? getAchievements() : null,
      canViewEnquiries(actor) ? getEnquiriesForStaff(enquiryScope(actor)) : null,
      can('staff.view') ? getAdminClient().from('staff_profiles').select('id', { head: true, count: 'exact' }) : null,
      can('logs.view') ? getAuditLogs('admin') : [],
    ]);
    if (staff?.error) throw new Error('Unable to load staff count');
    return NextResponse.json({ stats: { programs: programs?.length ?? null, achievements: achievements?.length ?? null, staff: staff?.count ?? null, enquiriesTotal: enquiries?.length ?? null, enquiriesNew: enquiries?.filter(item => item.status === 'new').length ?? null }, activity: activity.slice(0, 8), permissions: actor.permissions, isSuperAdmin: actor.isSuperAdmin }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return authErrorResponse(error); }
}
