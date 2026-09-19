import { CURRENCIES } from './calculations/currency.ts'

/**
 * Exchange rates for the currency converter.
 *
 * Rates come from Frankfurter (https://frankfurter.dev), a free, key-less API
 * over the European Central Bank reference rates. The ECB publishes those once
 * per working day, so what this returns is the latest *available* rate rather
 * than a live market quote — the calculator says so, and the date is carried
 * through to the page for the same reason.
 *
 * The fetching lives here rather than in the route handler so the whole path —
 * validation, upstream failure, malformed payloads — is testable with
 * `node --test` and no Next runtime.
 */

export const FRANKFURTER_LATEST_URL = 'https://api.frankfurter.dev/v1/latest'

/** One hour. Long enough to be quiet, short enough to pick up a new fixing. */
export const RATES_REVALIDATE_SECONDS = 3600

/** Only the codes the converter offers, so the route cannot be used as a proxy. */
const SUPPORTED = new Set(CURRENCIES.map((currency) => currency.code))

export interface RatePayload {
  base: string
  quote: string
  rate: number
  /**
   * The day the rate was published, as `YYYY-MM-DD`. Null only when base and
   * quote match, where the 1:1 rate is a definition rather than a published
   * figure.
   */
  date: string | null
}

export type RateOutcome =
  | { ok: true; payload: RatePayload }
  | { ok: false; status: number; error: string }

/** Uppercases and checks a raw query parameter. Null when unusable. */
export function normalizeCurrency(raw: string | null | undefined): string | null {
  if (!raw) return null
  const code = raw.trim().toUpperCase()
  return SUPPORTED.has(code) ? code : null
}

export function isSupportedCurrency(code: string): boolean {
  return SUPPORTED.has(code)
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

/**
 * The latest published rate for one pair.
 *
 * `fetchImpl` is injectable so tests can drive the upstream responses; in
 * production it is the caching `fetch` Next provides.
 */
export async function getLatestRate(
  rawBase: string | null | undefined,
  rawQuote: string | null | undefined,
  fetchImpl: FetchLike = fetch,
): Promise<RateOutcome> {
  const base = normalizeCurrency(rawBase)
  const quote = normalizeCurrency(rawQuote)

  if (!base || !quote) {
    return { ok: false, status: 400, error: 'Unsupported or missing currency code.' }
  }

  // A currency against itself is 1:1 by definition, so there is nothing to ask
  // upstream for — and nothing that can fail.
  if (base === quote) {
    return { ok: true, payload: { base, quote, rate: 1, date: null } }
  }

  const url = `${FRANKFURTER_LATEST_URL}?base=${base}&symbols=${quote}`

  let response: Response
  try {
    response = await fetchImpl(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: RATES_REVALIDATE_SECONDS },
    } as RequestInit)
  } catch {
    return { ok: false, status: 502, error: 'Could not reach the exchange rate service.' }
  }

  if (!response.ok) {
    return { ok: false, status: 502, error: 'The exchange rate service returned an error.' }
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    return { ok: false, status: 502, error: 'The exchange rate service returned an error.' }
  }

  return toPayload(body, base, quote)
}

/**
 * Reads only the three fields the page needs out of the upstream response, and
 * refuses anything that does not look like a usable rate. Nothing else from
 * upstream is passed on.
 */
function toPayload(body: unknown, base: string, quote: string): RateOutcome {
  const malformed: RateOutcome = {
    ok: false,
    status: 502,
    error: 'The exchange rate service returned an unexpected response.',
  }

  if (typeof body !== 'object' || body === null) return malformed

  const { rates, date } = body as { rates?: unknown; date?: unknown }
  if (typeof rates !== 'object' || rates === null) return malformed

  const rate = (rates as Record<string, unknown>)[quote]
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) return malformed
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return malformed

  return { ok: true, payload: { base, quote, rate, date } }
}
