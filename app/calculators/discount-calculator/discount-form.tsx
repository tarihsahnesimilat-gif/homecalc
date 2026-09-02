'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateDiscount } from '@/lib/calculations/discount'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { price: '100', discountPercent: '20' }

export function DiscountForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateDiscount(inputs.price, inputs.discountPercent),
    [inputs],
  )
  const breakdown = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <AmountInput
          label="Original price"
          hint="The full price before any reduction."
          value={inputs.price}
          onChange={(value) => update('price', value)}
        />
        <NumberInput
          label="Discount percentage"
          hint="How many percent comes off."
          min="0"
          max="100"
          value={inputs.discountPercent}
          onChange={(value) => update('discountPercent', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={
          breakdown
            ? `Final price after ${formatNumber(breakdown.discountPercent)}% off`
            : 'Your result'
        }
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : breakdown === null
              ? '—'
              : formatAmount(breakdown.finalPrice)
        }
        hint={breakdown ? `You save ${formatAmount(breakdown.saved)}.` : undefined}
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Discount amount', value: breakdown && formatAmount(breakdown.discountAmount) },
          { term: 'Final price', value: breakdown && formatAmount(breakdown.finalPrice) },
          { term: 'Amount saved', value: breakdown && formatAmount(breakdown.saved) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ price: '', discountPercent: '' })} />
    </div>
  )
}
