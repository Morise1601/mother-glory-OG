import 'server-only';
import type { SiteSettings } from '@/types/content.types';
import { DEFAULT_SETTINGS } from '@/lib/data/content-defaults';
import { readContent, updateContent } from '@/lib/data/content-store';
import { ContentError } from '@/lib/data/content-errors';
import { requirePermission } from '@/lib/auth/server';
export async function getSiteSettings(): Promise<SiteSettings> {
  const loaded = await readContent<SiteSettings>('settings', DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...(loaded || {}),
    contactPhones:
      Array.isArray(loaded?.contactPhones) && loaded.contactPhones.length >= 2
        ? loaded.contactPhones
        : DEFAULT_SETTINGS.contactPhones,
    contactEmail: loaded?.contactEmail || DEFAULT_SETTINGS.contactEmail,
    workingHours: loaded?.workingHours || DEFAULT_SETTINGS.workingHours,
  };
}
export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  await requirePermission('settings.manage');
  return updateContent('settings', DEFAULT_SETTINGS, current => {
    if (!updates.updatedAt || updates.updatedAt !== current.updatedAt) throw new ContentError('Conflict: Settings changed. Refresh and try again.', 409);
    return { ...current, ...updates, updatedAt: new Date(Math.max(Date.now(), Date.parse(current.updatedAt) + 1)).toISOString() };
  });
}
