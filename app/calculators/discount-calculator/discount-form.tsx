'use client'

import { useId, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { CalculatorResult } from '@/components/calculator/calculator-result'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { price: '100', discountPercent: '20' } as const

interface DiscountInputs {
  price: string
  discountPercent: string
}

interface DiscountBreakdown {
  discountAmount: number
  finalPrice: number
  /** Identical to `discountAmount` — shown separately because users look for both. */
  saved: number
  discountPercent: number
}

type DiscountOutcome =
  | { state: 'empty' }
  | { state: 'invalid'; message: string }
  | { state: 'ok'; breakdown: DiscountBreakdown }

/** Pure calculation: currency-neutral plain numbers. */
export function calculateDiscount(price: number, discountPercent: number): DiscountBreakdown {
  const discountAmount = price * (discountPercent / 100)

  return {
    discountAmount,
    finalPrice: price - discountAmount,
    saved: discountAmount,
    discountPercent,
  }
}

export function evaluateDiscount({ price, discountPercent }: DiscountInputs): DiscountOutcome {
  if (price.trim() === '' || discountPercent.trim() === '') return { state: 'empty' }

  const priceValue = Number(price)
  const percentValue = Number(discountPercent)

  if (!Number.isFinite(priceValue) || !Number.isFinite(percentValue)) {
    return { state: 'invalid', message: 'Please enter numbers only.' }
  }
  if (priceValue < 0) {
    return { state: 'invalid', message: 'The original price cannot be negative.' }
  }
  if (percentValue < 0) {
    return { state: 'invalid', message: 'The discount percentage cannot be negative.' }
  }
  if (percentValue > 100) {
    return {
      state: 'invalid',
      message: 'A discount cannot be more than 100% — that would mean being paid to take the item.',
    }
  }

  return { state: 'ok', breakdown: calculateDiscount(priceValue, percentValue) }
}

export function DiscountForm() {
  const [inputs, setInputs] = useState<DiscountInputs>({ ...DEFAULTS })
  const priceId = useId()
  const percentId = useId()

  const outcome = useMemo(() => evaluateDiscount(inputs), [inputs])

  const fields = [
    {
      id: priceId,
      key: 'price' as const,
      label: 'Original price',
      min: '0',
      max: undefined,
      hint: 'The full price before any reduction.',
    },
    {
      id: percentId,
      key: 'discountPercent' as const,
      label: 'Discount percentage',
      min: '0',
      max: '100',
      hint: 'How many percent comes off.',
    },
  ]

  const breakdown = outcome.state === 'ok' ? outcome.breakdown : null

  const resultValue =
    outcome.state === 'invalid'
      ? outcome.message
      : breakdown === null
        ? '—'
        : formatAmount(breakdown.finalPrice)

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <label htmlFor={field.id} className="text-sm font-semibold text-primary">
              {field.label}
            </label>
            <input
              id={field.id}
              type="number"
              inputMode="decimal"
              min={field.min}
              max={field.max}
              step="any"
              value={inputs[field.key]}
              onChange={(event) => {
                const next = event.target.value
                setInputs((current) => ({ ...current, [field.key]: next }))
              }}
              className="h-12 rounded-md border border-input bg-background px-3 text-lg outline-none ring-accent focus:ring-2"
            />
            <p className="text-xs text-muted-foreground">{field.hint}</p>
          </div>
        ))}
      </div>

      <CalculatorResult
        className="mt-7"
        label={breakdown ? `Final price after ${formatNumber(breakdown.discountPercent)}% off` : 'Your result'}
        value={resultValue}
        hint={breakdown ? `You save ${formatAmount(breakdown.saved)}.` : undefined}
        isError={outcome.state === 'invalid'}
      />

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { term: 'Discount amount', value: breakdown && formatAmount(breakdown.discountAmount) },
          { term: 'Final price', value: breakdown && formatAmount(breakdown.finalPrice) },
          { term: 'Amount saved', value: breakdown && formatAmount(breakdown.saved) },
        ].map((item) => (
          <div key={item.term} className="rounded-lg border border-border bg-background p-4">
            <dt className="text-xs font-medium text-muted-foreground">{item.term}</dt>
            <dd className="mt-1 text-xl font-bold text-primary">{item.value ?? '—'}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => setInputs({ price: '', discountPercent: '' })}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="size-4" />
        Reset values
      </button>
    </div>
  )
}
