'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateMarkup } from '@/lib/calculations/markup'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { cost: '100', markup: '50' }

export function MarkupForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluateMarkup(inputs.cost, inputs.markup), [inputs])
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <AmountInput
          label="Cost"
          hint="What the item costs you."
          value={inputs.cost}
          onChange={(value) => update('cost', value)}
        />
        <NumberInput
          label="Markup (%)"
          hint="Added on top of the cost."
          min="0"
          value={inputs.markup}
          onChange={(value) => update('markup', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Selling price' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.sellingPrice)
        }
        hint={
          result
            ? `A profit of ${formatAmount(result.profit)}. That is a ${formatNumber(result.markupPercent)}% markup but only a ${formatNumber(result.equivalentMarginPercent, 2)}% margin.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Selling price', value: result && formatAmount(result.sellingPrice) },
          { term: 'Profit', value: result && formatAmount(result.profit) },
          {
            term: 'Equivalent margin',
            value: result && `${formatNumber(result.equivalentMarginPercent, 2)}%`,
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ cost: '', markup: '' })} />
    </div>
  )
}
