import { NextResponse } from 'next/server';
import { requirePermission, authErrorResponse } from '@/lib/auth/server';
import { downloadMedia } from '@/lib/media/server';
import { MediaError } from '@/lib/media/convert';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('gallery.view');
    const { id } = await context.params;
    const file = await downloadMedia(id);
    return new NextResponse(file.data, { headers: {
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    } });
  } catch (error) {
    return error instanceof MediaError ? NextResponse.json({ error: error.message }, { status: error.status }) : authErrorResponse(error);
  }
}
