"use client";
import { useEffect, useState } from 'react';
import type { MediaAsset } from '@/types/content.types';
import { adminRequest } from '@/lib/admin/api';
import { isSafeDestination } from '@/lib/validation/schemas';

export default function ImageAssetField({ value, onChange, label = 'Image asset' }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [draft, setDraft] = useState({ value, text: value });
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    adminRequest<{ media: MediaAsset[] }>('/api/admin/media').then(result => setMedia(result.media.filter(asset => asset.mimeType.startsWith('image/') && asset.isPublic))).catch(() => {});
  }, []);
  return <label className="block text-xs font-semibold text-[#122452] space-y-2">
    <span>{label}</span>
    <select aria-label={`${label} from media library`} value={media.some(asset => asset.url === value) ? value : ''} onChange={event => { if (event.target.value) onChange(event.target.value); }} className="w-full p-2.5 rounded-xl border border-[#DFE3EA] bg-[#FAF8F3]">
      <option value="">Choose an uploaded public image</option>
      {media.map(asset => <option key={asset.id} value={asset.url}>{asset.filename || asset.altText}</option>)}
    </select>
    <input aria-label={`${label} URL`} value={draft.value === value ? draft.text : value} onChange={event => setDraft({ value, text: event.target.value })} onBlur={() => {
      const url = (draft.value === value ? draft.text : value).trim();
      if (isSafeDestination(url)) { setError(null); onChange(url); }
      else setError('Enter an image path beginning with / or a secure HTTPS URL.');
    }} placeholder="/images/photo.webp or https://…" className="w-full p-2.5 rounded-xl border border-[#DFE3EA] bg-[#FAF8F3] font-normal" />
    {error && <span role="alert" className="block text-red-700">{error}</span>}
  </label>;
}
