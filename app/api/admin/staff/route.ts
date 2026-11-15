import { NextResponse } from 'next/server';
import { AuthError, authErrorResponse, requirePermission } from '@/lib/auth/server';
import { getAllStaff, inviteStaff, updateStaffRoles, toggleStaffStatus, resendStaffInvitation } from '@/lib/data/staff';
import { createStaffSchema, updateStaffSchema } from '@/lib/validation/staff';

export async function GET() {
  try {
    return NextResponse.json(await getAllStaff(), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return authErrorResponse(error); }
}

export async function POST(request: Request) {
  try {
    await requirePermission('staff.create');
    const parsed = createStaffSchema.safeParse(await request.json());
    if (!parsed.success) throw new AuthError('Enter a valid name, email address, and role.', 400);
    return NextResponse.json({ success: true, ...await inviteStaff(parsed.data) }, { status: 201 });
  } catch (error) { return authErrorResponse(error instanceof SyntaxError ? new AuthError('Invalid JSON body.', 400) : error); }
}

export async function PATCH(request: Request) {
  try {
    await requirePermission('staff.edit');
    const parsed = updateStaffSchema.safeParse(await request.json());
    if (!parsed.success) throw new AuthError('Select a valid staff account, action, role, and status.', 400);
    const data = parsed.data;
    let result: { warning?: string } = {};
    if (data.action === 'update_roles') result = await updateStaffRoles(data.id, data.roleIds);
    if (data.action === 'toggle_status') result = await toggleStaffStatus(data.id, data.status);
    if (data.action === 'resend_invite') await resendStaffInvitation(data.id);
    return NextResponse.json({ success: true, ...result });
  } catch (error) { return authErrorResponse(error instanceof SyntaxError ? new AuthError('Invalid JSON body.', 400) : error); }
}
