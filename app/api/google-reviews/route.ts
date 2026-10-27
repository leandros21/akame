import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const PLACE_ID = 'ChIJ-7LAevF15xQRdRmg6YUwm5Q';
const GOOGLE_URL = 'https://places.googleapis.com/v1/places/' + PLACE_ID;
export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return NextResponse.json({ error: 'Reviews unavailable', diagnostic: 'missing_server_key' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  try {
    const response = await fetch(GOOGLE_URL, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri' },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      let googleStatus = 'UNKNOWN';
      let googleReason = 'unspecified';
      let googleMessage = 'No details returned';
      try {
        const body = await response.json();
        const candidate = body?.error?.status;
        if (typeof candidate === 'string' && /^[A-Z_]{2,40}$/.test(candidate)) googleStatus = candidate;
        const message = body?.error?.message;
        if (typeof message === 'string') googleMessage = message.slice(0, 500).replace(/AIza[0-9A-Za-z_-]+/g, '[REDACTED]');
        const reasons = body?.error?.details;
        if (Array.isArray(reasons)) {
          const reason = reasons.find((d: any) => typeof d?.reason === 'string')?.reason;
          if (typeof reason === 'string' && /^[A-Z_]{2,60}$/.test(reason)) googleReason = reason;
        }
      } catch {}
      return NextResponse.json({ error: 'Reviews unavailable', diagnostic: 'google_api_error', googleHttpStatus: response.status, googleStatus, googleReason, googleMessage }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
    const place = await response.json();
    const reviews = Array.isArray(place.reviews) ? place.reviews.slice(0, 5).map((review: any) => ({
      name: String(review.authorAttribution?.displayName || 'Google guest').slice(0, 100),
      authorUrl: typeof review.authorAttribution?.uri === 'string' ? review.authorAttribution.uri : null,
      rating: Number(review.rating) || 0,
      text: String(review.text?.text || review.originalText?.text || '').slice(0, 1500),
      relativeTime: String(review.relativePublishTimeDescription || '').slice(0, 80),
      url: typeof review.googleMapsUri === 'string' ? review.googleMapsUri : null,
    })).filter((review: { text: string }) => review.text) : [];
    return NextResponse.json({ rating: Number(place.rating) || null, total: Number(place.userRatingCount) || 0, reviews, googleUrl: place.googleMapsUri || 'https://www.google.com/maps/place/?q=place_id:' + PLACE_ID }, { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' } });
  } catch {
    return NextResponse.json({ error: 'Reviews unavailable', diagnostic: 'network_or_timeout' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
