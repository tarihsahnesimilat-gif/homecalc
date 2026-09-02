'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateInvestment } from '@/lib/calculations/investment'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { initial: '1000', monthly: '200', rate: '5', years: '10' }

export function InvestmentForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateInvestment(inputs.initial, inputs.monthly, inputs.rate, inputs.years),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <AmountInput
          label="Initial investment"
          hint="What you are starting with."
          value={inputs.initial}
          onChange={(value) => update('initial', value)}
        />
        <AmountInput
          label="Monthly contribution"
          hint="Added at the end of each month."
          value={inputs.monthly}
          onChange={(value) => update('monthly', value)}
        />
        <NumberInput
          label="Annual rate of return (%)"
          hint="An assumption, not a forecast."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
        <NumberInput
          label="Time period (years)"
          hint="Decimals are rounded to whole months."
          min="0"
          value={inputs.years}
          onChange={(value) => update('years', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Projected final value' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.finalValue)
        }
        hint={
          result
            ? `${formatAmount(result.totalContributions)} paid in over ${formatNumber(result.months)} months, plus ${formatAmount(result.growth)} of growth. A projection at a fixed rate, not a prediction.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Total contributions', value: result && formatAmount(result.totalContributions) },
          { term: 'Growth earned', value: result && formatAmount(result.growth) },
          { term: 'Final value', value: result && formatAmount(result.finalValue) },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ initial: '', monthly: '', rate: '', years: '' })}
      />
    </div>
  )
}
