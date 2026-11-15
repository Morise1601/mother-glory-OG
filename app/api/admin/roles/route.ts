import { NextResponse } from 'next/server';
import { AuthError, authErrorResponse, requirePermission } from '@/lib/auth/server';
import { saveStaffRole } from '@/lib/data/staff';
import { saveRoleSchema } from '@/lib/validation/staff';

export async function POST(request: Request) {
  try {
    await requirePermission('roles.manage');
    const parsed = saveRoleSchema.safeParse(await request.json());
    if (!parsed.success) throw new AuthError('Enter a valid role name, slug, and permissions.', 400);
    const result = await saveStaffRole(parsed.data);
    return NextResponse.json({ success: true, ...result });
  } catch (error) { return authErrorResponse(error instanceof SyntaxError ? new AuthError('Invalid JSON body.', 400) : error); }
}
