import 'server-only';
import { randomUUID, createHash } from 'node:crypto';
import { getAdminClient } from '@/lib/supabase/admin';
import { convertMedia, MediaError } from '@/lib/media/convert';
import type { MediaAsset } from '@/types/content.types';
import type { Database, Json } from '@/types/database.types';

type MediaRow = Database['public']['Tables']['media_assets']['Row'];

function mediaMetadata(row: Pick<MediaRow, 'crop_data'>) {
  return row.crop_data && typeof row.crop_data === 'object' && !Array.isArray(row.crop_data) ? row.crop_data : {};
}

function isArchived(row: Pick<MediaRow, 'crop_data'>): boolean {
  return typeof mediaMetadata(row).archivedAt === 'string' && !!mediaMetadata(row).archivedAt;
}

function decodePath(value: string): string {
  try { return decodeURIComponent(value); } catch { return value; }
}

function referenceIdentity(value: string): string {
  const input = value.trim();
  try {
    const url = new URL(input);
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      // Query tokens and transformations do not change the underlying stored object.
      // Keep the origin and case-sensitive object path so another host cannot alias an asset.
      const pathname = decodePath(url.pathname).replace(/^\/storage\/v1\/(?:object|render\/image)\/(?:public|sign|authenticated)\//, '/storage/v1/object/public/');
      return `${url.origin}${pathname}`;
    }
  } catch { /* IDs and object paths are also valid stored references. */ }
  return `path:${decodePath(input.split(/[?#]/, 1)[0])}`;
}

function containsReference(value: unknown, needles: Set<string>): boolean {
  if (typeof value === 'string') return needles.has(referenceIdentity(value));
  if (Array.isArray(value)) return value.some(item => containsReference(item, needles));
  if (value && typeof value === 'object') return Object.values(value).some(item => containsReference(item, needles));
  return false;
}

async function referenceRows(): Promise<unknown[]> {
  const client = getAdminClient();
  const results = await Promise.all([
    client.from('promotions').select('id,media_asset_id'),
    client.from('gallery_items').select('id,asset_id'),
    client.from('testimonials').select('id,person_image_asset_id,video_asset_id'),
    client.from('app_settings').select('setting_key,setting_value'),
  ]);
  if (results.some(result => result.error)) throw new MediaError('Unable to verify media references. Please try again.', 503);
  return results.reduce<unknown[]>((rows, result) => rows.concat(result.data || []), []);
}

async function mapAsset(row: MediaRow, references: unknown[]): Promise<MediaAsset> {
  const storage = getAdminClient().storage.from(row.bucket_id);
  const publicUrl = storage.getPublicUrl(row.object_path).data.publicUrl;
  let url = publicUrl;
  if (!row.is_public) {
    const { data, error } = await storage.createSignedUrl(row.object_path, 3600);
    if (error || !data) throw new MediaError('Unable to create a private media preview.', 503);
    url = data.signedUrl;
  }
  const needles = new Set([row.id, row.object_path, publicUrl].map(referenceIdentity));
  const metadata = mediaMetadata(row);
  return {
    id: row.id, filename: row.object_path.split('/').pop() || row.id,
    bucket: row.bucket_id === 'cms-media' ? 'cms-media' : 'site-media', objectPath: row.object_path,
    mimeType: row.mime_type, bytes: row.file_size_bytes || 0, width: row.width || undefined, height: row.height || undefined,
    kind: row.kind, durationSeconds: row.duration_seconds || undefined,
    altText: row.alt_text || '', purpose: typeof metadata.purpose === 'string' ? metadata.purpose : 'Media library',
    uploadedBy: row.uploaded_by || '', isPublic: row.is_public, createdAt: row.created_at, url,
    referencesCount: references.filter(item => containsReference(item, needles)).length,
  };
}

export async function getAllMedia(filter?: { kind?: string; search?: string }): Promise<MediaAsset[]> {
  let query = getAdminClient().from('media_assets').select('*').order('created_at', { ascending: false });
  if (filter?.kind === 'image' || filter?.kind === 'video') query = query.eq('kind', filter.kind);
  const [{ data, error }, references] = await Promise.all([query, referenceRows()]);
  if (error) throw new MediaError('Unable to load the media library.', 503);
  const assets = await Promise.all((data || []).filter(row => !isArchived(row)).map(row => mapAsset(row, references)));
  const search = filter?.search?.trim().toLowerCase();
  return search ? assets.filter(asset => `${asset.filename} ${asset.altText}`.toLowerCase().includes(search)) : assets;
}

export async function uploadMedia(file: File, options: { purpose: string; altText: string; actorId: string }): Promise<MediaAsset> {
  const converted = await convertMedia(file);
  const client = getAdminClient();
  const base = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80).toLowerCase() || 'media';
  const objectPath = `uploads/${randomUUID()}-${base}.${converted.extension}`;
  const storage = client.storage.from('site-media');
  const { error: uploadError } = await storage.upload(objectPath, converted.bytes, { contentType: converted.mimeType, cacheControl: '31536000', upsert: false });
  if (uploadError) {
    console.error('Storage upload error in site-media:', uploadError);
    throw new MediaError(
      uploadError.message
        ? `Unable to store the converted file: ${uploadError.message}. Verify the site-media bucket and storage limits.`
        : 'Unable to store the converted file. Verify the site-media bucket and storage limits.',
      503
    );
  }
  const { data, error } = await client.from('media_assets').insert({
    kind: converted.kind, bucket_id: 'site-media', object_path: objectPath,
    mime_type: converted.mimeType, file_size_bytes: converted.bytes.length,
    width: converted.width || null, height: converted.height || null,
    alt_text: options.altText.slice(0, 500), crop_data: { purpose: options.purpose.slice(0, 200) } as Json,
    checksum_sha256: createHash('sha256').update(converted.bytes).digest('hex'), is_public: true, uploaded_by: options.actorId,
  }).select('*').single();
  if (error || !data) {
    await storage.remove([objectPath]);
    throw new MediaError('Unable to save media metadata. The uploaded file was rolled back.', 503);
  }
  return mapAsset(data, []);
}

export async function deleteMediaAsset(id: string): Promise<void> {
  const client = getAdminClient();
  const { data: asset, error } = await client.from('media_assets').select('*').eq('id', id).maybeSingle();
  if (error) throw new MediaError('Unable to load the asset.', 503);
  if (!asset) throw new MediaError('Asset not found.', 404);
  if (isArchived(asset)) return;
  const mapped = await mapAsset(asset, await referenceRows());
  if (mapped.referencesCount) throw new MediaError('This asset is used by saved content. Replace or detach every reference before removing it from the library.', 409);
  // Preserve both the object and its FK target. A content save can add a reference after
  // the scan; archiving must never break that newly published image or video.
  const { error: archiveError } = await client.from('media_assets').update({ crop_data: { ...mediaMetadata(asset), archivedAt: new Date().toISOString() } }).eq('id', id);
  if (archiveError) throw new MediaError('Unable to remove this asset from the library. Please try again.', 503);
}

export async function downloadMedia(id: string): Promise<{ data: Blob; filename: string; mimeType: string }> {
  const client = getAdminClient();
  const { data: asset, error } = await client.from('media_assets').select('bucket_id,object_path,mime_type,crop_data').eq('id', id).maybeSingle();
  if (error) throw new MediaError('Unable to load the asset.', 503);
  if (!asset || isArchived(asset)) throw new MediaError('Asset not found in the media library.', 404);
  const { data, error: downloadError } = await client.storage.from(asset.bucket_id).download(asset.object_path);
  if (downloadError || !data) throw new MediaError('Unable to download this file. Please try again.', 503);
  return { data, filename: asset.object_path.split('/').pop() || 'media', mimeType: asset.mime_type };
}
