import { NextResponse } from 'next/server';
import { requirePermission, authErrorResponse } from '@/lib/auth/server';
import { getAuditLogs } from '@/lib/data/audit';

export async function GET() {
  try {
    await requirePermission('logs.view');
    return NextResponse.json({ logs: await getAuditLogs('admin') }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return authErrorResponse(error); }
}
