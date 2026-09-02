'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateRatioToPercentage } from '@/lib/calculations/ratio-to-percentage'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { first: '2', second: '3' }

export function RatioToPercentageForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateRatioToPercentage(inputs.first, inputs.second),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-primary">Your ratio</legend>
        <div className="flex items-end gap-3">
          <NumberInput
            className="flex-1"
            label="First part"
            labelSize="compact"
            min="0"
            value={inputs.first}
            onChange={(value) => update('first', value)}
          />
          <span aria-hidden="true" className="pb-3 text-2xl font-bold text-accent">
            :
          </span>
          <NumberInput
            className="flex-1"
            label="Second part"
            labelSize="compact"
            min="0"
            value={inputs.second}
            onChange={(value) => update('second', value)}
          />
        </div>
      </fieldset>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Share of the whole' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.percentA, 2)}% and ${formatNumber(result.percentB, 2)}%`
        }
        hint={
          result
            ? result.aAsPercentOfB === null
              ? `Across ${formatNumber(result.total)} parts in total.`
              : `Across ${formatNumber(result.total)} parts. Measured against each other, the first is ${formatNumber(result.aAsPercentOfB, 2)}% of the second.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'First part', value: result && `${formatNumber(result.percentA, 2)}%` },
          { term: 'Second part', value: result && `${formatNumber(result.percentB, 2)}%` },
          {
            term: 'First as % of second',
            value:
              result &&
              (result.aAsPercentOfB === null
                ? 'Not applicable'
                : `${formatNumber(result.aAsPercentOfB, 2)}%`),
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ first: '', second: '' })} />
    </div>
  )
}
