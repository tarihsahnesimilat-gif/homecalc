'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluatePercentageDifference } from '@/lib/calculations/percentage-difference'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { first: '40', second: '60' }

export function PercentageDifferenceForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluatePercentageDifference(inputs.first, inputs.second),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput
          label="Number A"
          hint="Order does not matter."
          value={inputs.first}
          onChange={(value) => update('first', value)}
        />
        <NumberInput
          label="Number B"
          hint="Neither value is the baseline."
          value={inputs.second}
          onChange={(value) => update('second', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Percentage difference' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.percentDifference)}%`
        }
        hint={
          result
            ? `A gap of ${formatNumber(result.absoluteDifference)} against an average of ${formatNumber(result.average)}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          {
            term: 'Percentage difference',
            value: result && `${formatNumber(result.percentDifference)}%`,
          },
          { term: 'Absolute difference', value: result && formatNumber(result.absoluteDifference) },
          { term: 'Average of the two', value: result && formatNumber(result.average) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ first: '', second: '' })} />
    </div>
  )
}
