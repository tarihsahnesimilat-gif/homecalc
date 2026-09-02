'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluatePercentageOf } from '@/lib/calculations/percentage-of-number'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { percent: '15', number: '200' }

export function PercentageOfNumberForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluatePercentageOf(inputs.percent, inputs.number),
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
          label="Percentage"
          hint="The share you want, such as 15 for 15%."
          value={inputs.percent}
          onChange={(value) => update('percent', value)}
        />
        <NumberInput
          label="Number"
          hint="What you are taking the percentage of."
          value={inputs.number}
          onChange={(value) => update('number', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={
          result
            ? `${formatNumber(result.percent)}% of ${formatNumber(result.number)}`
            : 'Your result'
        }
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatNumber(result.amount)
        }
        hint={
          result
            ? `${formatNumber(result.percent)} ÷ 100 = ${formatNumber(result.percent / 100, 6)}, then × ${formatNumber(result.number)}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Percentage', value: result && `${formatNumber(result.percent)}%` },
          {
            term: 'Decimal multiplier',
            value: result && formatNumber(result.percent / 100, 6),
          },
          { term: 'Result', value: result && formatNumber(result.amount) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ percent: '', number: '' })} />
    </div>
  )
}
