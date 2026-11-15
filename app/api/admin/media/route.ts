import { NextResponse } from 'next/server';
import { requirePermission, authErrorResponse } from '@/lib/auth/server';
import { getAllMedia, deleteMediaAsset, uploadMedia } from '@/lib/media/server';
import { MediaError } from '@/lib/media/convert';
import { MAX_VIDEO_BYTES } from '@/lib/data/media';
import { logAuditAction } from '@/lib/data/audit';

export const runtime = 'nodejs';
export const maxDuration = 240;

function failure(error: unknown) {
  return error instanceof MediaError ? NextResponse.json({ error: error.message }, { status: error.status }) : authErrorResponse(error);
}

async function recordAudit(params: Parameters<typeof logAuditAction>[0]) {
  try { await logAuditAction(params); return undefined; }
  catch { console.error('Media mutation succeeded but its audit entry could not be recorded.'); return 'The change was saved, but the audit entry could not be recorded. Please contact an administrator.'; }
}

export async function GET(request: Request) {
  try {
    await requirePermission('gallery.view');
    const { searchParams } = new URL(request.url);
    const media = await getAllMedia({ search: searchParams.get('search') || undefined, kind: searchParams.get('kind') || undefined });
    return NextResponse.json({ media }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  try {
    const actor = await requirePermission('gallery.create');
    const length = Number(request.headers.get('content-length'));
    if (length > MAX_VIDEO_BYTES + 1024 * 1024) return NextResponse.json({ error: 'Upload exceeds the 100 MB video limit.' }, { status: 413 });
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Choose a media file to upload.' }, { status: 400 });
    const asset = await uploadMedia(file, { purpose: String(formData.get('purpose') || 'Media library'), altText: String(formData.get('altText') || file.name), actorId: actor.id });
    const auditWarning = await recordAudit({ actorId: actor.id, actorName: actor.name, action: 'media.uploaded', module: 'media', entityType: 'media_assets', entityId: asset.id, summary: `Uploaded converted ${asset.mimeType}: ${asset.filename}` });
    return NextResponse.json({ success: true, asset, auditWarning, convertedToWebp: asset.mimeType === 'image/webp', convertedToWebm: asset.mimeType === 'video/webm', compressionRatio: `${Math.round((1 - asset.bytes / file.size) * 100)}%` });
  } catch (error) { return failure(error); }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requirePermission('gallery.delete');
    const { id } = (await request.json()) ?? {};
    if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'A valid asset ID is required.' }, { status: 400 });
    await deleteMediaAsset(id);
    const auditWarning = await recordAudit({ actorId: actor.id, actorName: actor.name, action: 'media.archived', module: 'media', entityType: 'media_assets', entityId: id, summary: 'Archived an unused media library entry; its stored file is retained for content safety.' });
    return NextResponse.json({ success: true, archived: true, auditWarning });
  } catch (error) { return failure(error); }
}
