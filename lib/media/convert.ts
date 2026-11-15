import 'server-only';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, readFile, stat, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateMediaUpload } from '@/lib/data/media';

export class MediaError extends Error {
  constructor(message: string, public readonly status = 400) { super(message); this.name = 'MediaError'; }
}

let activeVideoConversions = 0;
const verifiedFfmpeg = new Map<string, Promise<void>>();

function requireMaintainedFfmpeg(binary: string): Promise<void> {
  const cached = verifiedFfmpeg.get(binary);
  if (cached) return cached;
  const verification = new Promise<void>((resolve, reject) => {
    // Conservative release floor from https://ffmpeg.org/download.html (2026-11-14).
    // npm audit does not cover the native ffmpeg-static executable.
    execFile(binary, ['-version'], { timeout: 5000, maxBuffer: 64 * 1024, windowsHide: true }, (error, stdout) => {
      if (error) return reject(new MediaError('Video conversion is unavailable. Set FFMPEG_PATH to a maintained FFmpeg 9.0.2 or newer release with libvpx-vp9 and libopus support, then restart the server.', 503));
      const version = /^ffmpeg version (\d+)\.(\d+)(?:\.(\d+))?([^\s]*)/m.exec(String(stdout));
      const numbers = version ? [Number(version[1]), Number(version[2]), Number(version[3] || 0)] : [];
      const stable = version && !/^[-.]?(?:rc|pre|dev|git)(?:\d|[-.]|$)/i.test(version[4]);
      const current = numbers[0] > 9 || (numbers[0] === 9 && (numbers[1] > 0 || (numbers[1] === 0 && numbers[2] >= 2)));
      if (!stable || !current) return reject(new MediaError('Video conversion requires FFmpeg 9.0.2 or newer stable release. The selected binary is outdated or its release cannot be verified. Set FFMPEG_PATH to a maintained executable and restart the server.', 503));
      resolve();
    });
  });
  verifiedFfmpeg.set(binary, verification);
  return verification;
}

async function runFfmpeg(args: string[]) {
  const binary = process.env.FFMPEG_PATH?.trim() || ffmpegPath || 'ffmpeg';
  await requireMaintainedFfmpeg(binary);
  if (activeVideoConversions >= 2) return Promise.reject(new MediaError('Video conversion is busy. Please retry after the current uploads finish.', 503));
  activeVideoConversions++;
  return new Promise<void>((resolve, reject) => {
    execFile(binary, args, { timeout: 180_000, maxBuffer: 2 * 1024 * 1024, windowsHide: true }, (error) => {
      if (!error) return resolve();
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return reject(new MediaError('Video conversion is unavailable. Install FFmpeg with libvpx-vp9 and libopus support and set FFMPEG_PATH on the server.', 503));
      reject(new MediaError('Unable to convert this video. The file may be corrupt, unsupported, or exceed the server conversion time limit.', 422));
    });
  }).finally(() => { activeVideoConversions--; });
}

export async function convertMedia(file: File): Promise<{ bytes: Buffer; mimeType: string; extension: 'webp' | 'webm'; kind: 'image' | 'video'; width?: number; height?: number }> {
  const validation = validateMediaUpload(file);
  if (!validation.valid) throw new MediaError(validation.error!);
  const input = Buffer.from(await file.arrayBuffer());
  if (!file.type.startsWith('video/')) {
    try {
      const image = sharp(input, { limitInputPixels: 40_000_000, failOn: 'warning' });
      const source = await image.metadata();
      if (!['jpeg', 'png', 'webp'].includes(source.format || '')) throw new Error('Unsupported image');
      const { data, info } = await image.rotate().webp({ quality: 85, effort: 4 }).toBuffer({ resolveWithObject: true });
      return { bytes: data, mimeType: 'image/webp', extension: 'webp', kind: 'image', width: info.width, height: info.height };
    } catch { throw new MediaError('The file is not a valid supported image, or exceeds the 40 megapixel limit.', 422); }
  }
  const isWebm = input.length >= 16 && input.readUInt32BE(0) === 0x1a45dfa3;
  const isIsoVideo = input.length >= 16 && ['ftyp', 'moov', 'mdat', 'wide', 'free'].includes(input.subarray(4, 8).toString('ascii'));
  if (!(file.type === 'video/webm' ? isWebm : isIsoVideo)) throw new MediaError('The file does not contain a valid video container.', 422);
  const directory = await mkdtemp(path.join(tmpdir(), 'mother-glory-media-'));
  try {
    const inputPath = path.join(directory, 'input');
    const outputPath = path.join(directory, 'converted.webm');
    await writeFile(inputPath, input);
    // Shell-free invocation and file-only input protocols prevent uploaded playlists from fetching URLs.
    await runFfmpeg(['-hide_banner', '-loglevel', 'error', '-nostdin', '-protocol_whitelist', 'file,pipe', '-max_pixels', '40000000', '-threads', '2', '-i', inputPath, '-map', '0:v:0', '-map', '0:a:0?', '-map_metadata', '-1', '-vf', "scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2", '-pix_fmt', 'yuv420p', '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-deadline', 'realtime', '-cpu-used', '6', '-threads', '2', '-c:a', 'libopus', '-b:a', '96k', '-fs', String(101 * 1024 * 1024), '-f', 'webm', outputPath]);
    // The file cap sits above the accepted limit so capped/truncated output is always rejected.
    if ((await stat(outputPath)).size > 100 * 1024 * 1024) throw new MediaError('The converted video exceeds 100 MB. Shorten or compress the source and retry.', 422);
    const output = await readFile(outputPath);
    if (output.length < 16 || output.readUInt32BE(0) !== 0x1a45dfa3) throw new MediaError('Video conversion produced an invalid WebM file.', 422);
    return { bytes: output, mimeType: 'video/webm', extension: 'webm', kind: 'video' };
  } finally { await rm(directory, { recursive: true, force: true }); }
}
