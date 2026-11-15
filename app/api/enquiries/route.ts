import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enquirySchema } from '@/lib/validation/schemas';
import { submitEnquiry, checkRateLimit, getEnquiriesForStaff, updateEnquiryStatus, addEnquiryNote, assignEnquiry } from '@/lib/data/enquiries';
import { logAuditAction } from '@/lib/data/audit';
import { authErrorResponse } from '@/lib/auth/server';
import { requireEnquiryAccess, enquiryScope } from '@/lib/auth/enquiries';
import { enquiryAccessPermission } from '@/lib/auth/enquiry-access';
import { getAdminClient } from '@/lib/supabase/admin';
import { ContentStoreError } from '@/lib/data/content-store';

function enquiryErrorResponse(error: unknown) {
  if (error instanceof ContentStoreError) return NextResponse.json({ error: error.message }, { status: error.status });
  return authErrorResponse(error);
}

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 16_384) return NextResponse.json({ error: 'Request is too large' }, { status: 413 });
    const raw = await request.text();
    if (raw.length > 16_384) return NextResponse.json({ error: 'Request is too large' }, { status: 413 });
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Please check your enquiry details.', details: parsed.error.flatten() }, { status: 400 });
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    if (!(await checkRateLimit(clientIp))) return NextResponse.json({ error: 'Too many submissions. Please try again in ten minutes.' }, { status: 429 });
    const { enquiry, isDuplicate } = await submitEnquiry(parsed.data);
    if (!isDuplicate) {
      try { await logAuditAction({ actorId: 'system-public', actorName: 'Website Visitor', action: 'enquiry.submitted', module: 'admissions', entityType: 'enquiries', entityId: enquiry.id, summary: 'Admission enquiry received', metadata: { campus: enquiry.campus } }); }
      catch { console.error('Admission enquiry saved, but audit event could not be recorded.'); }
    }
    return NextResponse.json({ success: true, id: enquiry.id, isDuplicate });
  } catch (error) { return enquiryErrorResponse(error); }
}

export async function GET() {
  try {
    const actor = await requireEnquiryAccess('read');
    const canAssign = !!enquiryAccessPermission(actor, 'assign');
    const assignees = canAssign ? await getAdminClient().from('staff_profiles').select('id,full_name').eq('status', 'active').order('full_name') : null;
    if (assignees?.error) throw new Error('Unable to load enquiry assignees');
    return NextResponse.json({ enquiries: await getEnquiriesForStaff(enquiryScope(actor)), canAssign, canUpdate: !!enquiryAccessPermission(actor, 'update'), assignees: assignees?.data?.map(item => ({ id: item.id, name: item.full_name })) || [] }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return enquiryErrorResponse(error); }
}

const updateSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('status'), id: z.string().uuid(), status: z.enum(['new', 'contacted', 'in_progress', 'closed']) }),
  z.object({ action: z.literal('note'), id: z.string().uuid(), note: z.string().trim().min(1).max(2000) }),
  z.object({ action: z.literal('assign'), id: z.string().uuid(), staffId: z.string().uuid() }),
]);

export async function PATCH(request: Request) {
  try {
    await requireEnquiryAccess('read');
    const parsed = updateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid enquiry update' }, { status: 400 });
    const update = parsed.data;
    const mode = update.action === 'assign' ? 'assign' : 'update';
    const actor = await requireEnquiryAccess(mode);
    const scope = enquiryScope(actor, mode);
    if (update.action === 'status') await updateEnquiryStatus(update.id, update.status, scope);
    else if (update.action === 'note') await addEnquiryNote(update.id, update.note, { ...scope, name: actor.name });
    else {
      const { data, error } = await getAdminClient().from('staff_profiles').select('id,full_name,status').eq('id', update.staffId).eq('status', 'active').maybeSingle();
      if (error || !data) return NextResponse.json({ error: 'Choose an active staff member' }, { status: 400 });
      await assignEnquiry(update.id, data.id, data.full_name, scope);
    }
    let warning: string | undefined;
    try { await logAuditAction({ actorId: actor.id, actorName: actor.name, action: `enquiry.${update.action}`, module: 'admissions', entityType: 'enquiries', entityId: update.id, summary: `Enquiry ${update.action} updated` }); }
    catch { warning = 'Changes saved, but the activity log could not be recorded.'; }
    return NextResponse.json({ success: true, enquiries: await getEnquiriesForStaff(enquiryScope(actor)), warning });
  } catch (error) { return enquiryErrorResponse(error); }
}
