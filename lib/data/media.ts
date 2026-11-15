import { MediaAsset } from '@/types/content.types';

export type { MediaAsset };

export const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: 'media-logo',
    filename: 'logo_mg.webp',
    bucket: 'site-media',
    objectPath: 'branding/logo_mg.webp',
    mimeType: 'image/webp',
    bytes: 250880,
    width: 600,
    height: 600,
    altText: 'Mother Glory Coaching & Tutorial Centre official seal',
    purpose: 'Logo & branding',
    uploadedBy: 'system',
    isPublic: true,
    referencesCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    url: '/images/logo_mg.webp',
  },
  {
    id: 'media-founder',
    filename: 'founder-final.webp',
    bucket: 'site-media',
    objectPath: 'leadership/founder-final.webp',
    mimeType: 'image/webp',
    bytes: 56320,
    width: 800,
    height: 1000,
    altText: 'M. Antoine@Prabhu, Founder & Managing Director',
    purpose: 'Founder portrait',
    uploadedBy: 'system',
    isPublic: true,
    referencesCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    url: '/images/founder-final.webp',
  },
  {
    id: 'media-cofounder',
    filename: 'cofounder-final.webp',
    bucket: 'site-media',
    objectPath: 'leadership/cofounder-final.webp',
    mimeType: 'image/webp',
    bytes: 60416,
    width: 800,
    height: 1000,
    altText: 'Mr. Robert Clyive, Chairman & Managing Trustee',
    purpose: 'Co-founder portrait',
    uploadedBy: 'system',
    isPublic: true,
    referencesCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    url: '/images/cofounder-final.webp',
  },
  {
    id: 'media-hero',
    filename: 'hero_banner_mg.webp',
    bucket: 'site-media',
    objectPath: 'banners/hero_banner_mg.webp',
    mimeType: 'image/webp',
    bytes: 217088,
    width: 1920,
    height: 900,
    altText: 'Medical coaching aspirants in classroom',
    purpose: 'Hero banner',
    uploadedBy: 'system',
    isPublic: true,
    referencesCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    url: '/images/hero_banner_mg.webp',
  },
  {
    id: 'media-campus-pondy',
    filename: 'campus_pondicherry.webp',
    bucket: 'site-media',
    objectPath: 'campuses/campus_pondicherry.webp',
    mimeType: 'image/webp',
    bytes: 222208,
    width: 1200,
    height: 800,
    altText: 'Mother Glory Puducherry campus building exterior',
    purpose: 'Campus facility',
    uploadedBy: 'system',
    isPublic: true,
    referencesCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    url: '/images/campus_pondicherry.webp',
  },
  {
    id: 'media-campus-karaikal',
    filename: 'campus_karaikal.webp',
    bucket: 'site-media',
    objectPath: 'campuses/campus_karaikal.webp',
    mimeType: 'image/webp',
    bytes: 209920,
    width: 1200,
    height: 800,
    altText: 'Mother Glory Karaikal campus building exterior',
    purpose: 'Campus facility',
    uploadedBy: 'system',
    isPublic: true,
    referencesCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    url: '/images/campus_karaikal.webp',
  },
  {
    id: 'media-ach-1',
    filename: '1.webp',
    bucket: 'site-media',
    objectPath: 'achievements/1.webp',
    mimeType: 'image/webp',
    bytes: 1550520,
    width: 1200,
    height: 1600,
    altText: 'NEET 2024 top rank achievement poster',
    purpose: 'Achievement poster',
    uploadedBy: 'system',
    isPublic: true,
    referencesCount: 2,
    createdAt: '2024-06-01T00:00:00Z',
    url: '/images/achievements/1.webp',
  },
];

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function validateMediaUpload(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
  if (!Number.isFinite(file.size) || file.size <= 0) return { valid: false, error: 'Choose a nonempty media file.' };
  const isVideo = file.type.startsWith('video/');
  if (file.size > (isVideo ? MAX_VIDEO_BYTES : MAX_FILE_BYTES)) return { valid: false, error: `File size exceeds the ${isVideo ? '100 MB video' : '10 MB image'} limit.` };
  const ext = file.name.split('.').pop()?.toLowerCase();
  const formats: Record<string, string[]> = { 'image/jpeg': ['jpg', 'jpeg'], 'image/png': ['png'], 'image/webp': ['webp'], 'video/mp4': ['mp4', 'm4v'], 'video/webm': ['webm'], 'video/quicktime': ['mov'] };
  if (!formats[file.type]?.includes(ext || '')) return { valid: false, error: 'Allowed formats: JPG, PNG, WebP, MP4, MOV, and WebM. File extension must match its media type.' };
  return { valid: true };
}
