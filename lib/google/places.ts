import 'server-only';
import { GooglePlaceReviewsResponse, GoogleReviewItem } from '@/types/content.types';

function googleUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && ['google.com', 'googleusercontent.com'].some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`)) ? url.href : undefined;
  } catch { return undefined; }
}

/**
 * Server-only Google Places API (New) integration
 * Fetches verified place details and reviews without exposing API secrets to the browser.
 */
export async function fetchGooglePlaceReviews(placeId: string, campusName: string, options: { fresh?: boolean } = {}): Promise<GooglePlaceReviewsResponse> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  placeId = typeof placeId === 'string' ? placeId.trim() : '';

  if (!apiKey || !apiKey.trim() || apiKey === 'REPLACE_LOCALLY_SERVER_ONLY') {
    return {
      configured: false,
      campus: campusName,
      placeId,
      reviews: [],
      error: 'Google Places API key is not configured.',
    };
  }

  if (!placeId || !placeId.trim() || placeId === 'VERIFY_AND_SET') {
    return {
      configured: false,
      campus: campusName,
      placeId: placeId || '',
      reviews: [],
      error: 'Google Place ID is not configured for this campus.',
    };
  }

  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
    const fieldMask = 'id,displayName,rating,userRatingCount,reviews,googleMapsUri';

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      signal: controller.signal,
      ...(options.fresh ? { cache: 'no-store' as const } : { next: { revalidate: 3600 } }),
    });

    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      const errStatus = res.status;
      const payload = await res.json().catch(() => ({}));
      // Only expose bounded diagnostic codes; upstream messages can include project/key details.
      const reason = payload.error?.details?.find((item: { reason?: string }) => item.reason)?.reason;
      const code = typeof reason === 'string' && /^[A-Z_]{1,80}$/.test(reason) ? reason : payload.error?.status;
      const diagnostic = typeof code === 'string' && /^[A-Z_]{1,80}$/.test(code) ? ` (${code})` : '';
      const help = errStatus === 403
        ? 'Check Places API (New) enablement, billing, and API key project/API/application restrictions. Server requests need a key authorized for Places API (New).'
        : errStatus === 404 ? 'Verify this campus Place ID with Google Maps Place ID Finder.'
        : errStatus === 429 ? 'Google Places quota is exhausted. Check project quotas and billing.'
        : 'Check the Google Cloud project and campus Place ID.';
      return {
        configured: true,
        campus: campusName,
        placeId,
        reviews: [],
        latencyMs,
        error: `Google Places API returned HTTP ${errStatus}${diagnostic}. ${help}`,
      };
    }

    const data = await res.json();

    const googleMapsUrl = googleUrl(data.googleMapsUri);
    const formattedReviews: GoogleReviewItem[] = (Array.isArray(data.reviews) ? data.reviews : []).map((r: {
      name?: string;
      relativePublishTimeDescription?: string;
      rating?: number;
      text?: { text?: string };
      originalText?: { text?: string };
      authorAttribution?: {
        displayName?: string;
        uri?: string;
        photoUri?: string;
      };
      publishTime?: string;
    }, index: number) => ({
      id: r.name || `rev-${index}`,
      authorName: r.authorAttribution?.displayName || 'Google Reviewer',
      authorPhotoUrl: googleUrl(r.authorAttribution?.photoUri),
      authorProfileUrl: googleUrl(r.authorAttribution?.uri),
      rating: typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5 ? r.rating : 0,
      relativeTimeDescription: r.relativePublishTimeDescription || '',
      text: r.text?.text || r.originalText?.text || '',
      publishTime: r.publishTime || '',
      sourceUrl: googleMapsUrl,
    }));

    return {
      configured: true,
      campus: campusName,
      placeId,
      rating: data.rating,
      userRatingCount: data.userRatingCount,
      reviews: formattedReviews,
      googleMapsUrl,
      latencyMs,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const msg = err instanceof Error && err.name === 'AbortError' ? 'Request timed out after 6 seconds.' : 'Network request failed.';
    return {
      configured: true,
      campus: campusName,
      placeId,
      reviews: [],
      latencyMs,
      error: `Failed to contact Google Places API: ${msg}`,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

