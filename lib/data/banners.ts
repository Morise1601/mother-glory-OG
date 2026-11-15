import 'server-only';
import { randomUUID } from 'node:crypto';
import type { BannerSlide } from '@/types/content.types';
import { INITIAL_BANNERS } from '@/lib/data/content-defaults';
import { readContent, updateContent } from '@/lib/data/content-store';
import { assertVersion, ContentError } from '@/lib/data/content-errors';

export async function getActiveBanners(): Promise<BannerSlide[]> {
  const now = Date.now();
  return (await getAllBannersAdmin()).filter(b => b.status === 'visible'
    && (!b.startsAt || Date.parse(b.startsAt) <= now)
    && (!b.endsAt || Date.parse(b.endsAt) >= now));
}

export async function getAllBannersAdmin(): Promise<BannerSlide[]> {
  return (await readContent<BannerSlide[]>('banners', [])).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function createBanner(data: Partial<BannerSlide> = {}): Promise<BannerSlide> {
  let created!: BannerSlide;
  await updateContent<BannerSlide[]>('banners', [], current => {
    created = {
      id: randomUUID(), title: data.title || 'New Highlight Banner',
      description: data.description || 'Focused guidance and disciplined preparation for medical entrance success.',
      desktopImageUrl: data.desktopImageUrl || '/images/hero_banner_mg.webp',
      mobileImageUrl: data.mobileImageUrl, focalPoint: data.focalPoint || 'center',
      ctaLabel: data.ctaLabel || 'Explore Programs', ctaUrl: data.ctaUrl || '/programs',
      secondaryCtaLabel: data.secondaryCtaLabel, secondaryCtaUrl: data.secondaryCtaUrl,
      startsAt: data.startsAt, endsAt: data.endsAt, status: data.status || 'visible',
      sortOrder: current.length + 1, version: 1, updatedAt: new Date().toISOString(),
    };
    return [...current, created];
  });
  return created;
}

export async function updateBanner(id: string, updates: Partial<BannerSlide>): Promise<BannerSlide> {
  let updated!: BannerSlide;
  await updateContent<BannerSlide[]>('banners', [], current => {
    const existing = current.find(b => b.id === id);
    if (!existing) throw new ContentError('Banner not found', 404);
    assertVersion(existing, updates.version);
    updated = { ...existing, ...updates, id, version: existing.version + 1, updatedAt: new Date().toISOString() };
    return current.map(b => b.id === id ? updated : b);
  });
  return updated;
}

export async function deleteBanner(id: string, version?: number): Promise<boolean> {
  let removed = false;
  await updateContent<BannerSlide[]>('banners', [], current => {
    const existing = current.find(b => b.id === id);
    if (!existing) return current;
    if (version !== undefined) assertVersion(existing, version);
    removed = true;
    return current.filter(b => b.id !== id).map((b, index) => ({ ...b, sortOrder: index + 1 }));
  });
  return removed;
}

export async function saveAllBanners(banners: BannerSlide[]): Promise<BannerSlide[]> {
  if (new Set(banners.map(b => b.id)).size !== banners.length) throw new ContentError('Duplicate banner IDs are not allowed.');
  return updateContent<BannerSlide[]>('banners', [], current => {
    if (current.length !== banners.length) throw new ContentError('Conflict: Banner list changed. Refresh and try again.', 409);
    for (const banner of banners) {
      const existing = current.find(b => b.id === banner.id);
      if (!existing) throw new ContentError('Conflict: Banner no longer exists. Refresh and try again.', 409);
      assertVersion(existing, banner.version);
    }
    return banners.map((b, index) => ({ ...b, sortOrder: index + 1, version: b.version + 1, updatedAt: new Date().toISOString() }));
  });
}

export async function reorderBanners(ids: string[]): Promise<BannerSlide[]> {
  const all = await getAllBannersAdmin();
  if (ids.length !== all.length || new Set(ids).size !== ids.length || ids.some(id => !all.some(b => b.id === id))) {
    throw new ContentError('Provide each banner exactly once.');
  }
  return saveAllBanners(ids.map(id => all.find(b => b.id === id)!));
}
