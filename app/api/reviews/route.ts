import { NextResponse } from 'next/server';
import { fetchGooglePlaceReviews } from '@/lib/google/places';
import { VERIFIED_CAMPUSES } from '@/lib/data/content-defaults';
import { getSiteSettings } from '@/lib/data/settings';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campusParam = searchParams.get('campus')?.toLowerCase() || 'puducherry';

    const campus =
      VERIFIED_CAMPUSES.find((c) => c.slug.toLowerCase() === campusParam) || VERIFIED_CAMPUSES[0];

    const settings = await getSiteSettings();
    const placeId = campus.slug === 'karaikal' ? settings.karaikalPlaceId : settings.puducherryPlaceId;
    const result = await fetchGooglePlaceReviews(placeId, campus.name);

    return NextResponse.json(result);
  } catch {
    const msg = 'Reviews are temporarily unavailable. Please try again later.';
    return NextResponse.json(
      {
        configured: false,
        campus: 'Unknown',
        placeId: '',
        reviews: [],
        error: msg,
      },
      { status: 500 }
    );
  }
}

