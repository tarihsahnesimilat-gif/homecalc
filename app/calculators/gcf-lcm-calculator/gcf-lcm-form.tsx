'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateGcfLcm } from '@/lib/calculations/gcf-lcm'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { first: '12', second: '18' }

export function GcfLcmForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluateGcfLcm(inputs.first, inputs.second), [inputs])
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput
          label="Number 1"
          hint="A whole number above zero."
          min="1"
          integer
          value={inputs.first}
          onChange={(value) => update('first', value)}
        />
        <NumberInput
          label="Number 2"
          hint="A whole number above zero."
          min="1"
          integer
          value={inputs.second}
          onChange={(value) => update('second', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={
          result
            ? `Greatest common factor of ${formatNumber(result.first)} and ${formatNumber(result.second)}`
            : 'Your result'
        }
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatNumber(result.gcf)
        }
        hint={
          result
            ? result.gcf === 1
              ? `They share no common factor, so the least common multiple is ${formatNumber(result.lcm)}.`
              : `The least common multiple is ${formatNumber(result.lcm)}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Greatest common factor', value: result && formatNumber(result.gcf) },
          { term: 'Least common multiple', value: result && formatNumber(result.lcm) },
          {
            term: 'GCF × LCM',
            value: result && formatNumber(result.gcf * result.lcm),
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ first: '', second: '' })} />
    </div>
  )
}
