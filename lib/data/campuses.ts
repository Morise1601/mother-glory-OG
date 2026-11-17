import 'server-only';
import type { Campus } from '@/types/content.types';
import { VERIFIED_CAMPUSES } from '@/lib/data/content-defaults';
import { getAdminClient } from '@/lib/supabase/admin';
import { getSiteSettings } from '@/lib/data/settings';
export async function getCampuses(): Promise<Campus[]> {
  try {
    const [{ data, error }, settings] = await Promise.all([
      getAdminClient().from('branches').select('*').eq('is_active', true).order('sort_order'),
      getSiteSettings(),
    ]);
    if (error || !data || data.length === 0) return VERIFIED_CAMPUSES;
    return data.map(branch => {
      const known = VERIFIED_CAMPUSES.find(c => c.slug === branch.slug) || VERIFIED_CAMPUSES.find(c => (branch.city || branch.name).toLowerCase().includes(c.slug));
      const phones = settings?.contactPhones || ['+91 98428 23195', '+91 98944 23195'];
      return {
        ...(known || {}),
        id: branch.id,
        slug: branch.slug,
        name: branch.name,
        address: [branch.address_line1, branch.address_line2].filter(Boolean).join(', ') || known?.address || '',
        city: branch.city || known?.city || '',
        state: branch.state || known?.state || '',
        postalCode: branch.postal_code || known?.postalCode || '',
        phone: phones[branch.slug === 'karaikal' ? 1 : 0] || branch.phone || known?.phone || '',
        email: settings?.contactEmail || known?.email || 'admissions@motherglory.edu',
        hours: settings?.workingHours || known?.hours || 'Mon–Sat 8:00 AM–5:00 PM IST',
        altPhone: phones[branch.slug === 'karaikal' ? 0 : 1] || known?.altPhone || '',
        mapsUrl: known?.mapsUrl || 'https://maps.google.com/?q=' + encodeURIComponent(branch.name),
        embedMapUrl: known?.embedMapUrl || '',
        imageUrl: known?.imageUrl || '/images/hero_banner_mg.webp',
        googlePlaceId: branch.slug === 'karaikal' ? settings?.karaikalPlaceId : settings?.puducherryPlaceId,
        isPublished: true,
      };
    });
  } catch {
    return VERIFIED_CAMPUSES;
  }
}
export async function getCampusBySlug(slug: string): Promise<Campus | undefined> {
  return (await getCampuses()).find(c => c.slug.toLowerCase() === slug.toLowerCase());
}
