'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateProfitMargin } from '@/lib/calculations/profit-margin'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { revenue: '1000', cost: '600' }

export function ProfitMarginForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluateProfitMargin(inputs.revenue, inputs.cost), [inputs])
  const result = outcomeValue(outcome)
  const isLoss = result !== null && result.profit < 0

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <AmountInput
          label="Revenue (selling price)"
          hint="What you receive. Must be above zero."
          value={inputs.revenue}
          onChange={(value) => update('revenue', value)}
        />
        <AmountInput
          label="Cost"
          hint="What the item cost you. Zero is allowed."
          value={inputs.cost}
          onChange={(value) => update('cost', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? (isLoss ? 'Negative margin (a loss)' : 'Profit margin') : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.margin)}%`
        }
        hint={
          result
            ? isLoss
              ? `Cost exceeds revenue by ${formatAmount(Math.abs(result.profit))}.`
              : `A profit of ${formatAmount(result.profit)} on ${formatAmount(result.revenue)} of revenue.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Revenue', value: result && formatAmount(result.revenue) },
          {
            term: isLoss ? 'Loss' : 'Profit',
            value: result && formatAmount(result.profit),
            negative: isLoss,
          },
          {
            term: 'Profit margin',
            value: result && `${formatNumber(result.margin)}%`,
            negative: isLoss,
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ revenue: '', cost: '' })} />
    </div>
  )
}
