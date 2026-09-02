'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateSquareRoot } from '@/lib/calculations/square-root'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

export function SquareRootForm() {
  const [value, setValue] = useState('144')

  const outcome = useMemo(() => evaluateSquareRoot(value), [value])
  const result = outcomeValue(outcome)

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <NumberInput
        label="Number"
        hint="Any value of zero or above."
        min="0"
        value={value}
        onChange={setValue}
      />

      <CalculatorResult
        className="mt-7"
        label={result ? `Square root of ${formatNumber(result.value)}` : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatNumber(result.root, 10)
        }
        hint={
          result
            ? result.isPerfectSquare
              ? `${formatNumber(result.value)} is a perfect square, so the root is exact.`
              : 'This root is irrational — the decimal never ends or repeats.'
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Square root', value: result && formatNumber(result.root, 10) },
          {
            term: 'Perfect square',
            value: result && (result.isPerfectSquare ? 'Yes' : 'No'),
          },
          {
            term: 'Check: root × root',
            value: result && formatNumber(result.root * result.root, 6),
          },
        ]}
      />

      <CalculatorReset onReset={() => setValue('')} label="Reset value" />
    </div>
  )
}
