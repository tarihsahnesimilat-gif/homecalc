/**
 * The exchange rate lookup behind /api/rates.
 *
 * Every upstream response the converter can meet is driven through a stub
 * fetch, so none of these tests touch the network. What matters is that a good
 * response is narrowed to the four fields the page needs, and that every other
 * case fails loudly rather than producing a number.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

import { CURRENCIES } from '../lib/calculations/currency.ts'
import {
  FRANKFURTER_LATEST_URL,
  RATES_REVALIDATE_SECONDS,
  getLatestRate,
  isSupportedCurrency,
  normalizeCurrency,
} from '../lib/rates.ts'

/** A fetch that answers once, and records how it was called. */
function stubFetch(responder: (url: string) => Response | Promise<Response>) {
  const calls: string[] = []
  const impl = async (url: string) => {
    calls.push(url)
    return responder(url)
  }
  return { impl, calls }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const frankfurterOk = (rate: number, date = '2026-09-18') =>
  json({ amount: 1.0, base: 'USD', date, rates: { EUR: rate } })

// ------------------------------------------------------------- Validation
test('rates: currency codes are normalized and checked against the offered list', () => {
  assert.equal(normalizeCurrency('usd'), 'USD')
  assert.equal(normalizeCurrency(' eur '), 'EUR')
  assert.equal(normalizeCurrency('USD'), 'USD')

  assert.equal(normalizeCurrency('XXX'), null)
  assert.equal(normalizeCurrency(''), null)
  assert.equal(normalizeCurrency(null), null)
  assert.equal(normalizeCurrency(undefined), null)
  assert.equal(normalizeCurrency('US'), null)
  assert.equal(normalizeCurrency('../../etc/passwd'), null)
})

test('rates: every currency the converter offers is one the route accepts', () => {
  for (const currency of CURRENCIES) {
    assert.ok(isSupportedCurrency(currency.code), `${currency.code} is not accepted`)
  }
})

test('rates: an invalid currency is refused without calling upstream', async () => {
  const { impl, calls } = stubFetch(() => frankfurterOk(0.87))

  for (const [base, quote] of [
    ['XXX', 'EUR'],
    ['USD', 'ZZZ'],
    [null, 'EUR'],
    ['USD', null],
  ] as const) {
    const outcome = await getLatestRate(base, quote, impl)
    assert.equal(outcome.ok, false)
    if (!outcome.ok) {
      assert.equal(outcome.status, 400)
      assert.match(outcome.error, /currency/i)
    }
  }

  assert.deepEqual(calls, [], 'a rejected pair should never reach Frankfurter')
})

// ------------------------------------------------------------ Happy path
test('rates: a valid response is narrowed to base, quote, rate and date', async () => {
  const { impl, calls } = stubFetch(() => frankfurterOk(0.8726, '2026-09-18'))
  const outcome = await getLatestRate('usd', 'eur', impl)

  assert.equal(outcome.ok, true)
  if (!outcome.ok) return

  assert.deepEqual(outcome.payload, {
    base: 'USD',
    quote: 'EUR',
    rate: 0.8726,
    date: '2026-09-18',
  })

  // Nothing else from upstream travels to the client.
  assert.deepEqual(Object.keys(outcome.payload).sort(), ['base', 'date', 'quote', 'rate'])

  assert.equal(calls.length, 1)
  assert.ok(calls[0].startsWith(FRANKFURTER_LATEST_URL), `called ${calls[0]}`)
  assert.match(calls[0], /base=USD/)
  assert.match(calls[0], /symbols=EUR/)
})

test('rates: the upstream request asks for hourly revalidation', async () => {
  let init: RequestInit | undefined
  const impl = async (_url: string, options?: RequestInit) => {
    init = options
    return frankfurterOk(0.87)
  }

  await getLatestRate('USD', 'EUR', impl)

  assert.equal(RATES_REVALIDATE_SECONDS, 3600)
  const next = (init as { next?: { revalidate?: number } } | undefined)?.next
  assert.equal(next?.revalidate, RATES_REVALIDATE_SECONDS)
})

test('rates: the same currency resolves at 1:1 without a lookup', async () => {
  const { impl, calls } = stubFetch(() => frankfurterOk(0.87))
  const outcome = await getLatestRate('USD', 'USD', impl)

  assert.equal(outcome.ok, true)
  if (!outcome.ok) return

  assert.equal(outcome.payload.rate, 1)
  assert.equal(outcome.payload.base, 'USD')
  assert.equal(outcome.payload.quote, 'USD')
  // No published figure stands behind an identity, so no date is claimed.
  assert.equal(outcome.payload.date, null)
  assert.deepEqual(calls, [], 'a same-currency conversion should not call upstream')
})

// --------------------------------------------------------- Upstream faults
test('rates: an upstream error status becomes a 502, not a rate', async () => {
  for (const status of [404, 429, 500, 503]) {
    const { impl } = stubFetch(() => json({ message: 'not found' }, status))
    const outcome = await getLatestRate('USD', 'EUR', impl)

    assert.equal(outcome.ok, false, `status ${status} should not produce a rate`)
    if (!outcome.ok) assert.equal(outcome.status, 502)
  }
})

test('rates: a network failure is reported rather than swallowed', async () => {
  const impl = async () => {
    throw new Error('ECONNREFUSED')
  }

  const outcome = await getLatestRate('USD', 'EUR', impl)
  assert.equal(outcome.ok, false)
  if (!outcome.ok) {
    assert.equal(outcome.status, 502)
    // The user-facing message says what happened, not what threw.
    assert.match(outcome.error, /exchange rate service/i)
    assert.doesNotMatch(outcome.error, /ECONNREFUSED/)
  }
})

test('rates: a malformed or unusable payload never becomes a number', async () => {
  const bad: unknown[] = [
    null,
    'not json at all',
    {},
    { date: '2026-09-18' },
    { rates: {}, date: '2026-09-18' },
    { rates: { GBP: 0.8 }, date: '2026-09-18' }, // the wrong pair
    { rates: { EUR: '0.87' }, date: '2026-09-18' }, // a string, not a number
    { rates: { EUR: 0 }, date: '2026-09-18' },
    { rates: { EUR: -1 }, date: '2026-09-18' },
    { rates: { EUR: Number.POSITIVE_INFINITY }, date: '2026-09-18' },
    { rates: { EUR: 0.87 } }, // no date
    { rates: { EUR: 0.87 }, date: 'yesterday' },
  ]

  for (const body of bad) {
    const { impl } = stubFetch(() => json(body))
    const outcome = await getLatestRate('USD', 'EUR', impl)
    assert.equal(outcome.ok, false, `${JSON.stringify(body)} should be refused`)
    if (!outcome.ok) assert.equal(outcome.status, 502)
  }
})

test('rates: a response that is not JSON at all is refused', async () => {
  const { impl } = stubFetch(
    () => new Response('<html>502 Bad Gateway</html>', { headers: { 'content-type': 'text/html' } }),
  )

  const outcome = await getLatestRate('USD', 'EUR', impl)
  assert.equal(outcome.ok, false)
  if (!outcome.ok) assert.equal(outcome.status, 502)
})

test('rates: no fallback rate exists anywhere in the module', async () => {
  // The old converter shipped a default of 0.92. Nothing may stand in for a
  // failed lookup now, so a failure must carry no rate of any kind.
  const { impl } = stubFetch(() => json({ message: 'not found' }, 500))
  const outcome = await getLatestRate('USD', 'EUR', impl)

  assert.equal(outcome.ok, false)
  assert.equal('payload' in outcome, false, 'a failed lookup carried a payload')
})

// ------------------------------------------------------- The wiring itself
const source = (relative: string) =>
  fs.readFileSync(path.join(process.cwd(), relative), 'utf8')

test('converter: the form takes its rate from the API and nothing else', () => {
  const form = source('app/calculators/currency-converter/currency-form.tsx')

  assert.match(form, /fetch\(`\/api\/rates\?base=/, 'the form should fetch the rate')
  assert.match(form, /evaluateCurrency\(amount, from, to, rate\?\.rate \?\? null\)/)

  // The converter used to open on a hard-coded 0.92. Nothing may seed a rate.
  assert.doesNotMatch(form, /useState\(['"]0\.92['"]\)/, 'a default rate is back')
  assert.doesNotMatch(
    form,
    /useState<[^>]*>\(\s*\d+(\.\d+)?\s*\)/,
    'a numeric rate is seeded into state',
  )
})

test('converter: only the currency pair triggers a lookup, never the amount', () => {
  const form = source('app/calculators/currency-converter/currency-form.tsx')
  const effect = /useEffect\(\(\) => \{[\s\S]*?\}, \[([^\]]*)\]\)/.exec(form)

  assert.ok(effect, 'the rate lookup should live in a useEffect')
  assert.equal(effect![1].trim(), 'from, to', `the lookup depends on [${effect![1]}]`)
})

test('converter: the route exposes the pair endpoint and caches it', () => {
  const route = source('app/api/rates/route.ts')

  assert.match(route, /export async function GET/)
  assert.match(route, /params\.get\('base'\)/)
  assert.match(route, /params\.get\('quote'\)/)
  // Next needs a literal here, so check it against the shared constant.
  const revalidate = /export const revalidate = (\d+)/.exec(route)
  assert.ok(revalidate, 'the route should export a revalidate window')
  assert.equal(Number(revalidate![1]), RATES_REVALIDATE_SECONDS)
  assert.match(route, /s-maxage=\$\{RATES_REVALIDATE_SECONDS\}/)
})
