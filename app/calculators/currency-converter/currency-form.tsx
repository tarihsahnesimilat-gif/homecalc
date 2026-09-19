'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'

import {
  CalculatorReset,
  CalculatorResult,
  CalculatorSelect,
  NumberInput,
  ResultBreakdown,
  type SelectOption,
} from '@/components/calculator'
import { CURRENCIES, evaluateCurrency } from '@/lib/calculations/currency'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'
import type { RatePayload } from '@/lib/rates'

const CURRENCY_OPTIONS: readonly SelectOption[] = CURRENCIES.map((currency) => ({
  value: currency.code,
  label: `${currency.code} — ${currency.name}`,
}))

/**
 * Rates already fetched this session, keyed by pair.
 *
 * Typing in the amount field must not touch the network, and neither should
 * swapping back to a pair that was just looked up. The published date travels
 * with the rate and is always shown, so a reused figure can never pass for a
 * fresher one than it is.
 */
const rateCache = new Map<string, RatePayload>()

type RateStatus = 'loading' | 'ready' | 'error'

/** 2026-09-18 -> 18 September 2026. */
function formatRateDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function CurrencyForm() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [rate, setRate] = useState<RatePayload | null>(null)
  const [status, setStatus] = useState<RateStatus>('loading')
  const [rateError, setRateError] = useState('')

  useEffect(() => {
    // Same currency is 1:1 by definition, so there is nothing to ask for.
    if (from === to) {
      setRate({ base: from, quote: to, rate: 1, date: null })
      setStatus('ready')
      setRateError('')
      return
    }

    const key = `${from}:${to}`
    const cached = rateCache.get(key)
    if (cached) {
      setRate(cached)
      setStatus('ready')
      setRateError('')
      return
    }

    const controller = new AbortController()
    setStatus('loading')
    setRate(null)
    setRateError('')

    async function load() {
      try {
        const response = await fetch(`/api/rates?base=${from}&quote=${to}`, {
          signal: controller.signal,
        })
        const body = await response.json()

        if (!response.ok) {
          throw new Error(
            typeof body?.error === 'string' ? body.error : 'The rate could not be loaded.',
          )
        }

        rateCache.set(key, body as RatePayload)
        setRate(body as RatePayload)
        setStatus('ready')
      } catch (error) {
        if (controller.signal.aborted) return
        // No rate means no result. Nothing is substituted here.
        setRate(null)
        setRateError(
          error instanceof Error && error.message
            ? error.message
            : 'The rate could not be loaded.',
        )
        setStatus('error')
      }
    }

    void load()
    return () => controller.abort()
  }, [from, to])

  const outcome = useMemo(
    () => evaluateCurrency(amount, from, to, rate?.rate ?? null),
    [amount, from, to, rate],
  )
  const result = outcomeValue(outcome)
  const isError = status === 'error' || outcome.state === 'invalid'

  function swap() {
    setFrom(to)
    setTo(from)
  }

  function resultValue(): string {
    if (status === 'error') return rateError
    if (outcome.state === 'invalid') return outcome.message
    if (status === 'loading') return 'Fetching the latest rate…'
    return result ? `${formatNumber(result.convertedAmount, 2)} ${result.to}` : '—'
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput label="Amount" min="0" value={amount} onChange={setAmount} />
        <CalculatorSelect label="From" value={from} onChange={setFrom} options={CURRENCY_OPTIONS} />
      </div>

      <div className="mt-5 flex items-end gap-3">
        <CalculatorSelect
          className="flex-1"
          label="To"
          value={to}
          onChange={setTo}
          options={CURRENCY_OPTIONS}
        />
        <button
          type="button"
          onClick={swap}
          aria-label="Swap the two currencies"
          className="h-12 rounded-md border border-border px-3 text-muted-foreground transition hover:border-accent hover:text-primary"
        >
          <ArrowRightLeft className="size-4" />
        </button>
      </div>

      <CalculatorResult
        className="mt-7"
        label={
          result
            ? `${formatNumber(result.amount, 2)} ${result.from} in ${result.to}`
            : 'Your result'
        }
        value={resultValue()}
        hint={
          result && !result.sameCurrency
            ? `1 ${result.to} is about ${formatNumber(result.inverseRate, 6)} ${result.from}.`
            : result?.sameCurrency
              ? 'Both currencies are the same, so the amount is unchanged.'
              : undefined
        }
        isError={isError}
      />

      <ResultBreakdown
        items={[
          {
            term: 'Converted amount',
            value: result && `${formatNumber(result.convertedAmount, 2)} ${result.to}`,
          },
          { term: 'Rate used', value: result && formatNumber(result.rate, 6) },
          { term: 'Inverse rate', value: result && formatNumber(result.inverseRate, 6) },
        ]}
      />

      <div
        aria-live="polite"
        className="mt-5 rounded-md border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground"
      >
        {status === 'loading' && <p>Fetching the latest published rate…</p>}

        {status === 'error' && (
          <p>
            {rateError} No rate has been applied — nothing is substituted when the lookup fails.
            Try again in a moment, or pick a different pair.
          </p>
        )}

        {status === 'ready' && rate && rate.date === null && (
          <p>
            {from} to {to} is 1:1, so no exchange rate is involved.
          </p>
        )}

        {status === 'ready' && rate && rate.date !== null && (
          <>
            <p className="font-medium text-primary">
              1 {rate.base} = {formatNumber(rate.rate, 6)} {rate.quote}
              <span className="font-normal text-muted-foreground">
                {' '}
                · published {formatRateDate(rate.date)}
              </span>
            </p>
            <p className="mt-2">
              This is the latest available rate from Frankfurter, which publishes European Central
              Bank reference rates on working days. It is not a live market quote, and banks, card
              providers and exchange offices apply their own rates and fees — what you actually pay
              will differ.
            </p>
          </>
        )}
      </div>

      <CalculatorReset onReset={() => setAmount('')} />
    </div>
  )
}
