import 'server-only';
import type { Campus } from '@/types/content.types';
import { VERIFIED_CAMPUSES } from '@/lib/data/content-defaults';
import { getAdminClient } from '@/lib/supabase/admin';
import { getSiteSettings } from '@/lib/data/settings';
export async function getCampuses(): Promise<Campus[]> {
  const [{ data, error }, settings] = await Promise.all([
    getAdminClient().from('branches').select('*').eq('is_active', true).order('sort_order'), getSiteSettings(),
  ]);
  if (error) throw new Error('Could not load campus information. Please retry.');
  return (data || []).map(branch => {
    const known = VERIFIED_CAMPUSES.find(c => c.slug === branch.slug) || VERIFIED_CAMPUSES.find(c => (branch.city || branch.name).toLowerCase().includes(c.slug));
    const phones = settings?.contactPhones || ['+91 98428 23195', '+91 98944 23195'];
    return {
      ...(known || {}), id: branch.id, slug: branch.slug, name: branch.name,
      address: [branch.address_line1, branch.address_line2].filter(Boolean).join(', '),
      city: branch.city || '', state: branch.state || '', postalCode: branch.postal_code || '',
      phone: phones[branch.slug === 'karaikal' ? 1 : 0] || branch.phone || '',
      email: settings?.contactEmail || 'admissions@motherglory.edu', hours: settings?.workingHours || 'Mon–Sat 8:00 AM–5:00 PM IST',
      altPhone: phones[branch.slug === 'karaikal' ? 0 : 1] || '',
      mapsUrl: known?.mapsUrl || 'https://maps.google.com/?q=' + encodeURIComponent(branch.name),
      embedMapUrl: known?.embedMapUrl || '', imageUrl: known?.imageUrl || '/images/hero_banner_mg.webp',
      googlePlaceId: branch.slug === 'karaikal' ? settings?.karaikalPlaceId : settings?.puducherryPlaceId, isPublished: true,
    };
  });
}
export async function getCampusBySlug(slug: string): Promise<Campus | undefined> {
  return (await getCampuses()).find(c => c.slug.toLowerCase() === slug.toLowerCase());
}
