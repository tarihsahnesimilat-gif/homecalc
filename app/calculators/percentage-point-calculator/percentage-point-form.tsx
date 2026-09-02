'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluatePercentagePoints } from '@/lib/calculations/percentage-point'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { from: '5', to: '6' }

const DIRECTION_LABEL = {
  increase: 'Increase',
  decrease: 'Decrease',
  none: 'No change',
} as const

export function PercentagePointForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluatePercentagePoints(inputs.from, inputs.to), [inputs])
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput
          label="Starting percentage (%)"
          hint="The rate before the change."
          value={inputs.from}
          onChange={(value) => update('from', value)}
        />
        <NumberInput
          label="New percentage (%)"
          hint="The rate afterwards."
          value={inputs.to}
          onChange={(value) => update('to', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? DIRECTION_LABEL[result.direction] : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(Math.abs(result.pointChange))} percentage point${Math.abs(result.pointChange) === 1 ? '' : 's'}`
        }
        hint={
          result
            ? result.relativeChange === null
              ? 'There is no relative change to report from a starting rate of zero.'
              : `The same move is a ${formatNumber(Math.abs(result.relativeChange), 2)}% relative ${result.direction === 'none' ? 'change' : result.direction}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          {
            term: 'Percentage point change',
            value: result && formatNumber(result.pointChange),
          },
          {
            term: 'Relative change',
            value:
              result && (result.relativeChange === null
                ? 'Not applicable'
                : `${formatNumber(result.relativeChange, 2)}%`),
          },
          {
            term: 'Basis points',
            value: result && formatNumber(result.pointChange * 100),
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ from: '', to: '' })} />
    </div>
  )
}
