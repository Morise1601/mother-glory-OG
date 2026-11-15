import { NextResponse } from 'next/server';
import { requireStaff, authErrorResponse } from '@/lib/auth/server';

export async function GET() {
  try {
    const actor = await requireStaff();
    return NextResponse.json({ actor }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return authErrorResponse(error);
  }
}
