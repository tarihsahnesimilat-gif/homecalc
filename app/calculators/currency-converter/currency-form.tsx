'use client'

import { useMemo, useState } from 'react'
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

const CURRENCY_OPTIONS: readonly SelectOption[] = CURRENCIES.map((currency) => ({
  value: currency.code,
  label: `${currency.code} — ${currency.name}`,
}))

export function CurrencyForm() {
  const [amount, setAmount] = useState('100')
  const [rate, setRate] = useState('0.92')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')

  const outcome = useMemo(
    () => evaluateCurrency(amount, from, to, rate),
    [amount, from, to, rate],
  )
  const result = outcomeValue(outcome)

  function swap() {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="rounded-md border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
        This converter uses no live or stored exchange rates. Enter the rate from a source you
        trust — the figure your bank or card provider quotes usually differs from the mid-market
        rate you find online.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberInput
          label="Amount"
          min="0"
          value={amount}
          onChange={setAmount}
        />
        <NumberInput
          label="Exchange rate"
          hint={
            from === to
              ? 'Not needed while both currencies match.'
              : `How much 1 ${from} buys in ${to}.`
          }
          min="0"
          value={rate}
          onChange={setRate}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <CalculatorSelect label="From" value={from} onChange={setFrom} options={CURRENCY_OPTIONS} />
        <div className="flex items-end gap-3">
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
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? `${formatNumber(result.amount, 2)} ${result.from} in ${result.to}` : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.convertedAmount, 2)} ${result.to}`
        }
        hint={
          result
            ? result.sameCurrency
              ? 'Both currencies are the same, so the amount is unchanged.'
              : `1 ${result.to} is about ${formatNumber(result.inverseRate, 6)} ${result.from}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
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

      <CalculatorReset
        onReset={() => {
          setAmount('')
          setRate('')
        }}
      />
    </div>
  )
}
