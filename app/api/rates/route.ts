import { RATES_REVALIDATE_SECONDS, getLatestRate } from '@/lib/rates'

/**
 * Latest published exchange rate for one currency pair.
 *
 * GET /api/rates?base=USD&quote=EUR
 *   -> { "base": "USD", "quote": "EUR", "rate": 0.8726, "date": "2026-09-18" }
 *
 * Thin on purpose: validation, fetching and shaping all live in `lib/rates`,
 * which is where the tests exercise them. Caching happens twice over — Next
 * caches the upstream fetch for an hour, and the response carries an s-maxage
 * so the CDN serves the same pair without waking a function.
 */
/**
 * Next only reads a segment config it can see statically, so this has to be a
 * literal rather than the shared constant. A test holds the two in step.
 */
export const revalidate = 3600

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams
  const outcome = await getLatestRate(params.get('base'), params.get('quote'))

  if (!outcome.ok) {
    return Response.json({ error: outcome.error }, { status: outcome.status })
  }

  return Response.json(outcome.payload, {
    headers: {
      'cache-control': `public, s-maxage=${RATES_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    },
  })
}
