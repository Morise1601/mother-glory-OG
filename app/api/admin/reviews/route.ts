import { NextResponse } from 'next/server';
import { requirePermission, authErrorResponse } from '@/lib/auth/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/data/settings';
import { fetchGooglePlaceReviews } from '@/lib/google/places';
import { contentErrorResponse, contentJson, contentMutationResult } from '@/lib/data/content-api';
import { z } from 'zod';

const placeIdSchema = z.string().trim().regex(/^[A-Za-z0-9_-]{1,256}$/, 'Enter a valid Google Place ID for each campus.');
const configurationSchema = z.object({
  puducherryPlaceId: placeIdSchema,
  karaikalPlaceId: placeIdSchema,
  updatedAt: z.iso.datetime({ message: 'Reload the saved configuration before saving changes.' }),
});

export async function GET() {
  try {
    await requirePermission('settings.manage');
    const settings = await getSiteSettings();
    return contentJson({ puducherryPlaceId: settings.puducherryPlaceId, karaikalPlaceId: settings.karaikalPlaceId, updatedAt: settings.updatedAt, keyConfigured: !!process.env.GOOGLE_PLACES_API_KEY?.trim() });
  } catch (error) { return contentErrorResponse(error); }
}

export async function PUT(request: Request) {
  try {
    const actor = await requirePermission('settings.manage');
    const updates = configurationSchema.parse(await request.json());
    const settings = await updateSiteSettings(updates);
    return contentMutationResult({ puducherryPlaceId: settings.puducherryPlaceId, karaikalPlaceId: settings.karaikalPlaceId, updatedAt: settings.updatedAt }, actor, 'settings', 'reviews.updated');
  } catch (error) { return contentErrorResponse(error); }
}

export async function POST(request: Request) {
  try {
    await requirePermission('settings.manage');
    const body = (await request.json()) ?? {};
    if (!['puducherry', 'karaikal'].includes(body.campus) || typeof body.placeId !== 'string' || !/^[A-Za-z0-9_-]{1,256}$/.test(body.placeId.trim())) {
      return NextResponse.json({ error: 'Select a campus and enter a valid Google Place ID.' }, { status: 400 });
    }
    const result = await fetchGooglePlaceReviews(body.placeId.trim(), body.campus === 'karaikal' ? 'Karaikal Campus' : 'Puducherry Campus', { fresh: true });
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return authErrorResponse(error); }
}
