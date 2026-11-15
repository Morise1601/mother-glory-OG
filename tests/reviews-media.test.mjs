import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadTs } from './module-loader.mjs';

test('media validator accepts MP4 for server-side WebM conversion and rejects empty files', () => {
  const { validateMediaUpload } = loadTs('lib/data/media.ts');
  assert.equal(validateMediaUpload({ name: 'campus.mp4', type: 'video/mp4', size: 1024 }).valid, true);
  assert.equal(validateMediaUpload({ name: 'empty.png', type: 'image/png', size: 0 }).valid, false);
  assert.equal(validateMediaUpload({ name: 'script.svg', type: 'image/svg+xml', size: 1024 }).valid, false);
});

test('reviews endpoint uses the persisted campus Place ID', async () => {
  const requested = [];
  const { GET } = loadTs('app/api/reviews/route.ts', {
    '@/lib/data/settings': { getSiteSettings: async () => ({ puducherryPlaceId: 'saved-puducherry', karaikalPlaceId: 'saved-karaikal' }) },
    '@/lib/google/places': { fetchGooglePlaceReviews: async (id, campus) => { requested.push(id); return { configured: true, campus, placeId: id, reviews: [] }; } },
  });
  const response = await GET(new Request('https://example.test/api/reviews?campus=karaikal'));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).placeId, 'saved-karaikal');
  assert.deepEqual(requested, ['saved-karaikal']);
});

test('Google service denial reports the upstream reason without exposing the key', async () => {
  const oldKey = process.env.GOOGLE_PLACES_API_KEY;
  const oldFetch = globalThis.fetch;
  process.env.GOOGLE_PLACES_API_KEY = 'private-test-key';
  globalThis.fetch = async () => Response.json({ error: { status: 'PERMISSION_DENIED', message: 'Permission denied', details: [{ reason: 'ACCESS_DENIED' }] } }, { status: 403 });
  try {
    const { fetchGooglePlaceReviews } = loadTs('lib/google/places.ts');
    const result = await fetchGooglePlaceReviews('saved-place', 'Campus');
    assert.match(result.error, /ACCESS_DENIED/);
    assert.doesNotMatch(JSON.stringify(result), /private-test-key/);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.GOOGLE_PLACES_API_KEY;
    else process.env.GOOGLE_PLACES_API_KEY = oldKey;
  }
});

test('Google payload mapping never invents a five-star rating or returns unsafe media links', async () => {
  const oldKey = process.env.GOOGLE_PLACES_API_KEY;
  const oldFetch = globalThis.fetch;
  process.env.GOOGLE_PLACES_API_KEY = 'private-test-key';
  globalThis.fetch = async () => Response.json({ reviews: [{ name: 'review-one', authorAttribution: { photoUri: 'javascript:alert(1)' } }], googleMapsUri: 'javascript:alert(1)' });
  try {
    const { fetchGooglePlaceReviews } = loadTs('lib/google/places.ts');
    const result = await fetchGooglePlaceReviews('saved-place', 'Campus');
    assert.equal(result.reviews[0].rating, 0);
    assert.equal(result.reviews[0].authorPhotoUrl, undefined);
    assert.equal(result.googleMapsUrl, undefined);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.GOOGLE_PLACES_API_KEY;
    else process.env.GOOGLE_PLACES_API_KEY = oldKey;
  }
});

test('PNG and JPEG uploads produce genuine WebP bytes with preserved dimensions', async () => {
  const { convertMedia } = loadTs('lib/media/convert.ts');
  for (const format of ['png', 'jpeg']) {
    const input = await sharp({ create: { width: 23, height: 17, channels: 3, background: '#12aabb' } })[format]().toBuffer();
    const output = await convertMedia(new File([input], `sample.${format}`, { type: `image/${format}` }));
    assert.equal(output.mimeType, 'image/webp');
    assert.equal(output.extension, 'webp');
    assert.equal(output.bytes.subarray(0, 4).toString(), 'RIFF');
    assert.equal(output.bytes.subarray(8, 12).toString(), 'WEBP');
    const metadata = await sharp(output.bytes).metadata();
    assert.equal(metadata.width, 23);
    assert.equal(metadata.height, 17);
  }
});

test('video conversion rejects image bytes renamed to MP4 before invoking FFmpeg', async () => {
  const { convertMedia } = loadTs('lib/media/convert.ts', {
    'node:child_process': { execFile: () => { throw new Error('FFmpeg must not run for a forged video'); } },
  });
  const input = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#ffffff' } }).png().toBuffer();
  await assert.rejects(convertMedia(new File([input], 'forged.mp4', { type: 'video/mp4' })), /valid video container/);
});

test('missing FFmpeg returns actionable 503 instead of claiming video conversion succeeded', async () => {
  const { convertMedia } = loadTs('lib/media/convert.ts', {
    'node:child_process': { execFile: (_binary, _args, _options, callback) => callback(Object.assign(new Error('not found'), { code: 'ENOENT' })) },
  });
  const header = Buffer.alloc(32);
  header.write('ftyp', 4);
  await assert.rejects(convertMedia(new File([header], 'campus.mp4', { type: 'video/mp4' })), error => error.status === 503 && /FFMPEG_PATH/.test(error.message));
});

test('video work is bounded to two concurrent conversions per server process', async () => {
  const { convertMedia } = loadTs('lib/media/convert.ts', {
    'node:child_process': { execFile: (_binary, args, _options, callback) => { if (args[0] === '-version') callback(null, 'ffmpeg version 9.0.2-test-build\n'); else setTimeout(() => callback(new Error('invalid test video')), 60); } },
  });
  const header = Buffer.alloc(32);
  header.write('ftyp', 4);
  const outcomes = await Promise.allSettled([1, 2, 3].map(() => convertMedia(new File([header], 'campus.mp4', { type: 'video/mp4' }))));
  assert.equal(outcomes.filter(result => result.status === 'rejected' && result.reason.status === 503 && /busy/i.test(result.reason.message)).length, 1);
});

test('outdated bundled FFmpeg is rejected and its failed version probe is cached before decoding uploads', async () => {
  let probes = 0;
  let decodes = 0;
  const { convertMedia } = loadTs('lib/media/convert.ts', {
    'node:child_process': { execFile: (_binary, args, _options, callback) => {
      if (args[0] === '-version') { probes++; callback(null, 'ffmpeg version 6.1.1-full_build\n'); }
      else { decodes++; callback(new Error('decoder must not run')); }
    } },
  });
  const header = Buffer.alloc(32);
  header.write('ftyp', 4);
  for (let attempt = 0; attempt < 2; attempt++) {
    await assert.rejects(convertMedia(new File([header], 'campus.mp4', { type: 'video/mp4' })), error => error.status === 503 && /9\.0\.2/.test(error.message) && /FFMPEG_PATH/.test(error.message));
  }
  assert.equal(probes, 1);
  assert.equal(decodes, 0);
});

test('validated release version checks are cached separately for each configured executable', async () => {
  const oldPath = process.env.FFMPEG_PATH;
  const probes = [];
  let decodes = 0;
  const { convertMedia } = loadTs('lib/media/convert.ts', {
    'node:child_process': { execFile: (binary, args, _options, callback) => {
      if (args[0] === '-version') { probes.push(binary); callback(null, 'ffmpeg version 9.0.2-full_build-www.gyan.dev\n'); }
      else { decodes++; callback(new Error('invalid synthetic input')); }
    } },
  });
  const header = Buffer.alloc(32);
  header.write('ftyp', 4);
  try {
    for (const binary of ['first-ffmpeg', 'first-ffmpeg', 'second-ffmpeg']) {
      process.env.FFMPEG_PATH = binary;
      await assert.rejects(convertMedia(new File([header], 'campus.mp4', { type: 'video/mp4' })), error => error.status === 422);
    }
    assert.deepEqual(probes, ['first-ffmpeg', 'second-ffmpeg']);
    assert.equal(decodes, 3);
  } finally {
    if (oldPath === undefined) delete process.env.FFMPEG_PATH;
    else process.env.FFMPEG_PATH = oldPath;
  }
});

test('older maintained branches and unverifiable development builds cannot bypass the current release floor', async () => {
  const header = Buffer.alloc(32);
  header.write('ftyp', 4);
  for (const version of ['6.1.3', '8.1.2', '9.0.1', '9.0.2-rc1', 'N-123456-git']) {
    let decodes = 0;
    const { convertMedia } = loadTs('lib/media/convert.ts', {
      'node:child_process': { execFile: (_binary, args, _options, callback) => {
        if (args[0] === '-version') callback(null, `ffmpeg version ${version}\n`);
        else { decodes++; callback(new Error('decoder must not run')); }
      } },
    });
    await assert.rejects(convertMedia(new File([header], 'campus.mp4', { type: 'video/mp4' })), error => error.status === 503, version);
    assert.equal(decodes, 0, version);
  }
});

test('an actual MP4 is transcoded to a decodable VP9 WebM', { timeout: 30_000 }, async context => {
  const execute = promisify(execFile);
  const binary = process.env.FFMPEG_PATH || ffmpegPath;
  const version = await execute(binary, ['-version'], { windowsHide: true, timeout: 5000 });
  const release = /^ffmpeg version (\d+)\.(\d+)(?:\.(\d+))?/.exec(version.stdout);
  const [major, minor, patch] = release ? release.slice(1).map(part => Number(part || 0)) : [];
  const currentRelease = major > 9 || (major === 9 && (minor > 0 || (minor === 0 && patch >= 2)));
  if (!process.env.FFMPEG_PATH && !currentRelease) {
    const { convertMedia } = loadTs('lib/media/convert.ts');
    const header = Buffer.alloc(32);
    header.write('ftyp', 4);
    await assert.rejects(convertMedia(new File([header], 'campus.mp4', { type: 'video/mp4' })), error => error.status === 503 && /FFMPEG_PATH/.test(error.message));
    context.skip('Real WebM conversion requires maintained FFmpeg >=9.0.2 through FFMPEG_PATH; outdated bundled binary was correctly rejected.');
    return;
  }
  const directory = await mkdtemp(path.join(tmpdir(), 'mother-glory-video-test-'));
  try {
    const sourcePath = path.join(directory, 'input.mp4');
    await execute(binary, ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=blue:s=32x24:d=0.3', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=0.3', '-c:v', 'libx264', '-c:a', 'aac', '-pix_fmt', 'yuv420p', '-shortest', sourcePath], { windowsHide: true, timeout: 10_000 });
    const { convertMedia } = loadTs('lib/media/convert.ts');
    const result = await convertMedia(new File([await readFile(sourcePath)], 'campus.mp4', { type: 'video/mp4' }));
    assert.equal(result.extension, 'webm');
    assert.equal(result.mimeType, 'video/webm');
    assert.equal(result.bytes.readUInt32BE(0), 0x1a45dfa3);
    const outputPath = path.join(directory, 'output.webm');
    await writeFile(outputPath, result.bytes);
    const decoded = await execute(binary, ['-hide_banner', '-i', outputPath, '-f', 'null', '-'], { windowsHide: true, timeout: 10_000 });
    assert.match(decoded.stderr, /Video: vp9/);
    assert.match(decoded.stderr, /32x24/);
    assert.match(decoded.stderr, /Audio: opus/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

function mediaDatabase() {
  const rows = [];
  const objects = new Map();
  const refs = { promotions: [], gallery_items: [], testimonials: [], app_settings: [] };
  let insertFailure = false;
  let beforeMutation = () => {};
  const client = {
    storage: { from: bucket => ({
      getPublicUrl: key => ({ data: { publicUrl: `https://storage.example.test/storage/v1/object/public/${bucket}/${key}` } }),
      upload: async (key, bytes, options) => { objects.set(key, { bytes, options }); return { error: null }; },
      remove: async keys => { keys.forEach(key => objects.delete(key)); return { error: null }; },
    }) },
    from(table) {
      if (table !== 'media_assets') return { select: async () => ({ data: refs[table], error: null }) };
      let mode = 'select';
      let row;
      let id;
      const query = {
        select: () => query, order: () => query,
        eq: (key, value) => { if (key === 'id') id = value; return query; },
        insert: value => { mode = 'insert'; row = value; return query; },
        update: value => { mode = 'update'; row = value; return query; },
        delete: () => { mode = 'delete'; return query; },
        maybeSingle: async () => ({ data: rows.find(value => value.id === id) || null, error: null }),
        single: async () => {
          if (insertFailure) return { data: null, error: new Error('insert failed') };
          const stored = { id: 'asset-one', created_at: '2026-01-01T00:00:00Z', ...row };
          rows.push(stored);
          return { data: stored, error: null };
        },
        then(resolve) {
          if (mode === 'delete' || mode === 'update') beforeMutation();
          if (mode === 'delete') { const position = rows.findIndex(value => value.id === id); if (position >= 0) rows.splice(position, 1); }
          if (mode === 'update') { const stored = rows.find(value => value.id === id); if (stored) Object.assign(stored, row); }
          return Promise.resolve({ data: [...rows], error: null }).then(resolve);
        },
      };
      return query;
    },
  };
  return { client, rows, objects, refs, failInsert: () => { insertFailure = true; }, onMutation: callback => { beforeMutation = callback; } };
}

test('converted uploads persist and library removal archives unused assets while preserving stored files', async () => {
  const database = mediaDatabase();
  const mocks = { '@/lib/supabase/admin': { getAdminClient: () => database.client } };
  const first = loadTs('lib/media/server.ts', mocks);
  const source = await sharp({ create: { width: 19, height: 13, channels: 3, background: '#12aabb' } }).png().toBuffer();
  const uploaded = await first.uploadMedia(new File([source], 'campus.png', { type: 'image/png' }), { purpose: 'Campus', altText: 'Campus building', actorId: 'actor-one' });
  assert.equal(uploaded.mimeType, 'image/webp');
  const saved = database.rows[0];
  assert.equal(saved.bucket_id, 'site-media');
  assert.equal(saved.uploaded_by, 'actor-one');
  assert.equal(saved.checksum_sha256.length, 64);
  assert.equal((await sharp(database.objects.get(saved.object_path).bytes).metadata()).format, 'webp');
  const reloaded = loadTs('lib/media/server.ts', mocks);
  assert.equal((await reloaded.getAllMedia())[0].id, uploaded.id);
  database.refs.app_settings.push({ setting_key: 'public_cms.banners', setting_value: [{ desktopImageUrl: uploaded.url }] });
  assert.equal((await reloaded.getAllMedia())[0].referencesCount, 1);
  await assert.rejects(reloaded.deleteMediaAsset(uploaded.id), error => error.status === 409);
  assert.equal(database.objects.size, 1);
  database.refs.app_settings.length = 0;
  await reloaded.deleteMediaAsset(uploaded.id);
  assert.equal(database.objects.size, 1);
  assert.equal(database.rows.length, 1);
  assert.equal(typeof database.rows[0].crop_data.archivedAt, 'string');
  assert.equal((await reloaded.getAllMedia()).length, 0);
});

test('a content reference added during library removal keeps its file and metadata valid', async () => {
  const database = mediaDatabase();
  const { uploadMedia, getAllMedia, deleteMediaAsset, downloadMedia } = loadTs('lib/media/server.ts', { '@/lib/supabase/admin': { getAdminClient: () => database.client } });
  const source = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#ffffff' } }).png().toBuffer();
  const asset = await uploadMedia(new File([source], 'campus.png', { type: 'image/png' }), { purpose: 'Campus', altText: '', actorId: 'actor-one' });
  database.onMutation(() => {
    database.refs.app_settings.push({ setting_key: 'public_cms.banners', setting_value: [{ desktopImageUrl: asset.url }] });
  });
  await deleteMediaAsset(asset.id);
  assert.equal(database.objects.size, 1);
  assert.equal(database.rows.length, 1);
  assert.equal(database.refs.app_settings[0].setting_value[0].desktopImageUrl, asset.url);
  assert.equal((await getAllMedia()).length, 0);
  assert.equal((await sharp(database.objects.get(asset.objectPath).bytes).metadata()).format, 'webp');
  await assert.rejects(downloadMedia(asset.id), error => error.status === 404);
});

test('failed media metadata writes remove the already uploaded object', async () => {
  const database = mediaDatabase();
  database.failInsert();
  const { uploadMedia } = loadTs('lib/media/server.ts', { '@/lib/supabase/admin': { getAdminClient: () => database.client } });
  const source = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#ffffff' } }).png().toBuffer();
  await assert.rejects(uploadMedia(new File([source], 'campus.png', { type: 'image/png' }), { purpose: 'Campus', altText: '', actorId: 'actor-one' }), error => error.status === 503);
  assert.equal(database.objects.size, 0);
  assert.equal(database.rows.length, 0);
});

test('media deletion recognizes URL query, fragment, encoded path, and signed/transform aliases', async () => {
  const database = mediaDatabase();
  const { uploadMedia, getAllMedia, deleteMediaAsset } = loadTs('lib/media/server.ts', { '@/lib/supabase/admin': { getAdminClient: () => database.client } });
  const source = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#ffffff' } }).png().toBuffer();
  const asset = await uploadMedia(new File([source], 'campus.png', { type: 'image/png' }), { purpose: 'Campus', altText: '', actorId: 'actor-one' });
  const variants = [
    `${asset.url}?v=1`, `${asset.url}#crop`,
    asset.url.replace('storage.example.test', 'STORAGE.EXAMPLE.TEST'),
    asset.url.replace('/uploads/', '/%75ploads/'),
    `${asset.url.replace('/object/public/', '/object/sign/')}?token=private-token`,
    `${asset.url.replace('/object/public/', '/render/image/public/')}?width=300`,
  ];
  for (const variant of variants) {
    database.refs.app_settings.push({ setting_key: 'public_cms.banners', setting_value: [{ desktopImageUrl: variant }] });
    assert.equal((await getAllMedia())[0].referencesCount, 1, variant);
    await assert.rejects(deleteMediaAsset(asset.id), error => error.status === 409);
    assert.equal(database.objects.size, 1);
    database.refs.app_settings.length = 0;
  }
  database.refs.app_settings.push({ setting_key: 'public_cms.banners', setting_value: [{ desktopImageUrl: asset.url.replace('storage.example.test', 'storage.example.test.attacker.test') }] });
  assert.equal((await getAllMedia())[0].referencesCount, 0);
});

test('unauthenticated media upload stops before reading the file or accessing storage', async () => {
  const { POST } = loadTs('app/api/admin/media/route.ts', {
    '@/lib/auth/server': {
      requirePermission: async () => { throw Object.assign(new Error('sign in'), { status: 401 }); },
      authErrorResponse: error => Response.json({ error: error.message }, { status: error.status }),
    },
    '@/lib/media/server': { uploadMedia: () => { throw new Error('storage must not be accessed'); } },
  });
  const response = await POST({ formData: () => { throw new Error('body must not be parsed'); } });
  assert.equal(response.status, 401);
});

test('review admin connection test queries the submitted Place ID with the hourly cache bypassed', async () => {
  const requests = [];
  const { POST } = loadTs('app/api/admin/reviews/route.ts', {
    '@/lib/auth/server': { requirePermission: async () => ({ id: 'admin', role: 'admin' }), authErrorResponse: () => Response.json({}, { status: 500 }) },
    '@/lib/data/settings': { getSiteSettings: async () => ({}) },
    '@/lib/google/places': { fetchGooglePlaceReviews: async (...args) => { requests.push(args); return { configured: true, reviews: [], placeId: args[0] }; } },
  });
  const response = await POST(new Request('https://example.test/api/admin/reviews', { method: 'POST', body: JSON.stringify({ campus: 'karaikal', placeId: 'edited-place-id' }), headers: { 'Content-Type': 'application/json' } }));
  assert.equal(response.status, 200);
  assert.deepEqual(requests, [['edited-place-id', 'Karaikal Campus', { fresh: true }]]);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('review admin saves only validated campus IDs through the durable settings adapter', async () => {
  let stored;
  const { PUT } = loadTs('app/api/admin/reviews/route.ts', {
    'next/cache': { revalidatePath: () => {} },
    '@/lib/data/audit': { logAuditAction: async () => {} },
    '@/lib/auth/server': { requirePermission: async () => ({ id: 'admin', role: 'admin' }), authErrorResponse: () => Response.json({}, { status: 500 }) },
    '@/lib/data/settings': { updateSiteSettings: async settings => { stored = settings; return settings; } },
  });
  const response = await PUT(new Request('https://example.test/api/admin/reviews', { method: 'PUT', body: JSON.stringify({ puducherryPlaceId: ' place-one ', karaikalPlaceId: 'place-two', updatedAt: '2026-11-14T12:00:00.000Z', siteTitle: 'injected' }), headers: { 'Content-Type': 'application/json' } }));
  assert.equal(response.status, 200);
  assert.deepEqual(stored, { puducherryPlaceId: 'place-one', karaikalPlaceId: 'place-two', updatedAt: '2026-11-14T12:00:00.000Z' });
});

test('review configuration rejects missing revisions before writing settings', async () => {
  class AuthError extends Error {}
  let writes = 0;
  const { PUT } = loadTs('app/api/admin/reviews/route.ts', {
    '@/lib/auth/server': { AuthError, requirePermission: async () => ({ role: 'admin' }), authErrorResponse: () => Response.json({}, { status: 500 }) },
    '@/lib/data/settings': { updateSiteSettings: async value => { writes++; return value; } },
  });
  const response = await PUT(new Request('https://example.test/api/admin/reviews', { method: 'PUT', body: JSON.stringify({ puducherryPlaceId: 'one', karaikalPlaceId: 'two' }), headers: { 'Content-Type': 'application/json' } }));
  assert.equal(response.status, 400);
  assert.equal(writes, 0);
});

test('concurrent review editors cannot overwrite the first saved campus configuration', async () => {
  class AuthError extends Error {}
  let current = { puducherryPlaceId: 'original-one', karaikalPlaceId: 'original-two', updatedAt: '2026-11-14T12:00:00.000Z' };
  const { GET, PUT } = loadTs('app/api/admin/reviews/route.ts', {
    'next/cache': { revalidatePath: () => {} },
    '@/lib/data/audit': { logAuditAction: async () => {} },
    '@/lib/auth/server': { AuthError, requirePermission: async () => ({ role: 'admin' }), authErrorResponse: () => Response.json({}, { status: 500 }) },
    '@/lib/data/content-store': {
      readContent: async () => ({ ...current }),
      updateContent: async (_key, _fallback, update) => { current = update(current); return { ...current }; },
    },
  });
  const original = await (await GET()).json();
  assert.equal(original.updatedAt, '2026-11-14T12:00:00.000Z');
  const save = value => PUT(new Request('https://example.test/api/admin/reviews', { method: 'PUT', body: JSON.stringify({ puducherryPlaceId: value, karaikalPlaceId: 'updated-two', updatedAt: original.updatedAt }), headers: { 'Content-Type': 'application/json' } }));
  const results = await Promise.all([save('first-editor'), save('stale-editor')]);
  assert.deepEqual(results.map(response => response.status).sort(), [200, 409]);
  assert.equal(current.puducherryPlaceId, 'first-editor');
  const saved = await results[0].json();
  assert.equal(saved.updatedAt, current.updatedAt);
  assert.notEqual(saved.updatedAt, original.updatedAt);
});

test('media downloads are authenticated attachments with the converted MIME type', async () => {
  const { GET } = loadTs('app/api/admin/media/[id]/download/route.ts', {
    '@/lib/auth/server': { requirePermission: async () => ({ id: 'admin' }), authErrorResponse: () => Response.json({}, { status: 500 }) },
    '@/lib/media/server': { downloadMedia: async id => ({ data: new Blob(['RIFF-test-WEBP']), filename: `${id}.webp`, mimeType: 'image/webp' }) },
  });
  const response = await GET(new Request('https://example.test/download'), { params: Promise.resolve({ id: 'asset-one' }) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/webp');
  assert.match(response.headers.get('content-disposition'), /attachment;.*asset-one\.webp/);
});

test('a saved media upload reports an audit warning without falsely reporting upload failure', async () => {
  const file = new File(['image'], 'sample.png', { type: 'image/png' });
  const form = new FormData();
  form.set('file', file);
  const { POST } = loadTs('app/api/admin/media/route.ts', {
    '@/lib/auth/server': { requirePermission: async () => ({ id: 'admin', name: 'Admin' }), authErrorResponse: () => Response.json({}, { status: 500 }) },
    '@/lib/media/server': { uploadMedia: async () => ({ id: 'stored-asset', filename: 'sample.webp', bytes: 3, mimeType: 'image/webp' }) },
    '@/lib/data/audit': { logAuditAction: async () => { throw new Error('audit unavailable'); } },
  });
  const originalConsole = console.error;
  console.error = () => {};
  try {
    const response = await POST(new Request('https://example.test/api/admin/media', { method: 'POST', body: form }));
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.success, true);
    assert.equal(payload.asset.id, 'stored-asset');
    assert.match(payload.auditWarning, /audit/i);
  } finally { console.error = originalConsole; }
});

function renderReviews(data) {
  const states = [data, false, 'puducherry'];
  const { default: Reviews } = loadTs('components/public/GoogleReviewsSection.tsx', {
    react: { ...React, useEffect: () => {}, useState: () => [states.shift(), () => {}] },
  });
  return renderToStaticMarkup(React.createElement(Reviews));
}

test('a failed campus leaves both campus controls available', () => {
  const output = renderReviews({ configured: true, reviews: [], error: 'upstream denied' });
  assert.match(output, /<button[^>]*>Puducherry<\/button>/);
  assert.match(output, /<button[^>]*>Karaikal<\/button>/);
  assert.match(output, /Google reviews are temporarily unavailable/);
});

test('Google review author photos render without an unconfigured-host exception', () => {
  const output = renderReviews({ configured: true, rating: 4.7, userRatingCount: 20, reviews: [{ id: 'review-one', authorName: 'Parent', authorPhotoUrl: 'https://lh3.googleusercontent.com/fixture', rating: 5, text: 'Helpful teaching', relativeTimeDescription: 'a week ago' }] });
  assert.match(output, /src="https:\/\/lh3\.googleusercontent\.com\/fixture"/);
  assert.match(output, /Helpful teaching/);
});
