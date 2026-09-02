'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateBreakEven } from '@/lib/calculations/break-even'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { fixedCosts: '10000', variableCost: '6', sellingPrice: '10' }

export function BreakEvenForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateBreakEven(inputs.fixedCosts, inputs.variableCost, inputs.sellingPrice),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        <AmountInput
          label="Fixed costs"
          hint="Costs you pay whatever you sell."
          value={inputs.fixedCosts}
          onChange={(value) => update('fixedCosts', value)}
        />
        <AmountInput
          label="Variable cost per unit"
          hint="What one extra sale costs you."
          value={inputs.variableCost}
          onChange={(value) => update('variableCost', value)}
        />
        <AmountInput
          label="Selling price per unit"
          hint="Must be above the variable cost."
          value={inputs.sellingPrice}
          onChange={(value) => update('sellingPrice', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Break-even point' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.unitsRoundedUp)} units`
        }
        hint={
          result
            ? `${formatAmount(result.revenue)} of revenue, at a contribution margin of ${formatAmount(result.contributionMargin)} per unit (${formatNumber(result.contributionMarginRatio)}%).`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Break-even units', value: result && formatNumber(result.units) },
          { term: 'Break-even revenue', value: result && formatAmount(result.revenue) },
          {
            term: 'Contribution margin',
            value: result && formatAmount(result.contributionMargin),
          },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ fixedCosts: '', variableCost: '', sellingPrice: '' })}
      />
    </div>
  )
}
