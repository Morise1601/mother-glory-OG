import { requirePermission } from '@/lib/auth/server';
import { siteSettingsSchema } from '@/lib/validation/schemas';
import { getSiteSettings, updateSiteSettings } from '@/lib/data/settings';
import { contentErrorResponse, contentJson, contentMutationResult } from '@/lib/data/content-api';
export async function GET() {
  try { await requirePermission('settings.manage'); return contentJson({ settings: await getSiteSettings() }); }
  catch (error) { return contentErrorResponse(error); }
}
export async function POST(request: Request) {
  try {
    const actor = await requirePermission('settings.manage');
    const body = (await request.json()) ?? {};
    const settings = await updateSiteSettings(siteSettingsSchema.parse(body.settings));
    return contentMutationResult({ settings }, actor, 'settings', 'settings.updated');
  } catch (error) { return contentErrorResponse(error); }
}
