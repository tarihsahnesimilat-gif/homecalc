'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { type ChangeDirection, evaluatePercentageChange } from '@/lib/calculations/percentage-change'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { original: '100', updated: '120' }

const DIRECTION_LABEL: Readonly<Record<ChangeDirection, string>> = {
  increase: 'Increase',
  decrease: 'Decrease',
  none: 'No change',
}

export function PercentageChangeForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluatePercentageChange(inputs.original, inputs.updated),
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
          label="Original value"
          hint="Where you started — the baseline."
          value={inputs.original}
          onChange={(value) => update('original', value)}
        />
        <NumberInput
          label="New value"
          hint="Where you ended up."
          value={inputs.updated}
          onChange={(value) => update('updated', value)}
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
              : `${formatNumber(Math.abs(result.percentChange))}%`
        }
        hint={
          result
            ? result.direction === 'none'
              ? 'The two values are the same.'
              : `A ${formatNumber(Math.abs(result.difference))} ${result.direction} on the original value.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          {
            term: 'Percentage change',
            value: result && `${formatNumber(result.percentChange)}%`,
          },
          { term: 'Direction', value: result && DIRECTION_LABEL[result.direction] },
          {
            term: 'Absolute difference',
            value: result && formatNumber(Math.abs(result.difference)),
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ original: '', updated: '' })} />
    </div>
  )
}
