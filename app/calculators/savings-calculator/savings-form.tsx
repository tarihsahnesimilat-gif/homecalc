'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateSavings } from '@/lib/calculations/savings'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { starting: '1000', monthly: '200', rate: '4', years: '10' }

export function SavingsForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateSavings(inputs.starting, inputs.monthly, inputs.rate, inputs.years),
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
          label="Starting balance"
          hint="What is already saved."
          value={inputs.starting}
          onChange={(value) => update('starting', value)}
        />
        <AmountInput
          label="Monthly deposit"
          hint="Added at the end of each month."
          value={inputs.monthly}
          onChange={(value) => update('monthly', value)}
        />
        <NumberInput
          label="Annual interest rate (%)"
          hint="The rate the account pays."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
        <NumberInput
          label="Time period (years)"
          hint="Rounded to whole months."
          min="0"
          value={inputs.years}
          onChange={(value) => update('years', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Final balance' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.finalBalance)
        }
        hint={
          result
            ? `${formatAmount(result.totalContributions)} paid in over ${formatNumber(result.months)} months, plus ${formatAmount(result.interestEarned)} of interest. Assumes a fixed rate, before tax.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Total paid in', value: result && formatAmount(result.totalContributions) },
          { term: 'Interest earned', value: result && formatAmount(result.interestEarned) },
          { term: 'Final balance', value: result && formatAmount(result.finalBalance) },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ starting: '', monthly: '', rate: '', years: '' })}
      />
    </div>
  )
}
