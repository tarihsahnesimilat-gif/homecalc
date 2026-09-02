'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateExponent } from '@/lib/calculations/exponent'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { base: '2', exponent: '10' }

export function ExponentForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluateExponent(inputs.base, inputs.exponent), [inputs])
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput
          label="Base"
          hint="The number being raised."
          value={inputs.base}
          onChange={(value) => update('base', value)}
        />
        <NumberInput
          label="Exponent"
          hint="Whole, negative or fractional."
          value={inputs.exponent}
          onChange={(value) => update('exponent', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={
          result
            ? `${formatNumber(result.base)} to the power of ${formatNumber(result.exponent)}`
            : 'Your result'
        }
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatNumber(result.value, 10)
        }
        hint={
          result && result.exponent < 0
            ? `A negative power means 1 ÷ ${formatNumber(result.base)}^${formatNumber(Math.abs(result.exponent))}.`
            : result && !Number.isInteger(result.exponent)
              ? 'A fractional power is a root of the base.'
              : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Base', value: result && formatNumber(result.base) },
          { term: 'Exponent', value: result && formatNumber(result.exponent) },
          { term: 'Result', value: result && formatNumber(result.value, 10) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ base: '', exponent: '' })} />
    </div>
  )
}
