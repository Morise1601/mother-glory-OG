import { requirePermission } from '@/lib/auth/server';
import { bannerSchema } from '@/lib/validation/schemas';
import { getAllBannersAdmin, createBanner, deleteBanner, saveAllBanners } from '@/lib/data/banners';
import { contentErrorResponse, contentJson, contentMutationResult } from '@/lib/data/content-api';
import { ContentError } from '@/lib/data/content-errors';
import type { BannerSlide } from '@/types/content.types';
import { INITIAL_BANNERS } from '@/lib/data/content-defaults';
export async function GET() {
  try { await requirePermission('promotions.view'); return contentJson({ banners: await getAllBannersAdmin() }); }
  catch (error) { return contentErrorResponse(error); }
}
export async function POST(request: Request) {
  try {
    const body = (await request.json()) ?? {};
    if (body.action === 'save_all') {
      const actor = await requirePermission('promotions.edit');
      const parsed = bannerSchema.array().max(30).parse(body.banners) as BannerSlide[];
      if (parsed.some(banner => banner.status === 'visible')) await requirePermission('promotions.publish');
      const banners = await saveAllBanners(parsed);
      return contentMutationResult({ banners }, actor, 'banners', 'banner.saved');
    }
    if (body.action !== 'create') throw new ContentError('Unknown banner action.');
    const actor = await requirePermission('promotions.create');
    const parsed = bannerSchema.parse({ ...INITIAL_BANNERS[0], id: undefined, updatedAt: undefined, status: 'hidden', ...body.banner });
    if (parsed.status === 'visible') await requirePermission('promotions.publish');
    const banner = await createBanner({ ...parsed, achievementId: parsed.achievementId || undefined, status: parsed.status || 'hidden' });
    return contentMutationResult({ banner }, actor, 'banners', 'banner.created', banner.id);
  } catch (error) { return contentErrorResponse(error); }
}
export async function DELETE(request: Request) {
  try {
    const actor = await requirePermission('promotions.delete');
    const { id, version } = (await request.json()) ?? {};
    if (typeof id !== 'string' || !Number.isInteger(version)) throw new ContentError('Banner ID and version are required.');
    if (!await deleteBanner(id, version)) throw new ContentError('Banner not found.', 404);
    return contentMutationResult({ success: true }, actor, 'banners', 'banner.deleted', id);
  } catch (error) { return contentErrorResponse(error); }
}
