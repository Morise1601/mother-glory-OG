import { requirePermission } from '@/lib/auth/server';
import { welcomePopupSchema } from '@/lib/validation/schemas';
import { getWelcomePopup, updateWelcomePopup } from '@/lib/data/popup';
import { contentErrorResponse, contentJson, contentMutationResult } from '@/lib/data/content-api';
import type { WelcomePopupSettings } from '@/types/content.types';

export async function GET() {
  try {
    await requirePermission('promotions.view');
    const popup = await getWelcomePopup();
    return contentJson({ popup });
  } catch (error) {
    return contentErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requirePermission('promotions.publish');
    const body = (await request.json()) ?? {};
    const parsed = welcomePopupSchema.parse(body.popup) as WelcomePopupSettings;
    const popup = await updateWelcomePopup(parsed);
    return contentMutationResult({ popup }, actor, 'welcome_popup', 'popup.saved');
  } catch (error) {
    return contentErrorResponse(error);
  }
}
