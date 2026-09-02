'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  CalculatorToggle,
  NumberInput,
  ResultBreakdown,
  type ToggleOption,
} from '@/components/calculator'
import { type TimeValueDirection, evaluateFutureValue } from '@/lib/calculations/future-value'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { amount: '1000', rate: '5', years: '10' }

const DIRECTIONS: readonly ToggleOption<TimeValueDirection>[] = [
  { id: 'future', label: 'Future value' },
  { id: 'present', label: 'Present value' },
]

export function FutureValueForm() {
  const [direction, setDirection] = useState<TimeValueDirection>('future')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateFutureValue(direction, inputs.amount, inputs.rate, inputs.years),
    [direction, inputs],
  )
  const result = outcomeValue(outcome)
  const isForward = direction === 'future'

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorToggle
        label="Direction"
        value={direction}
        onChange={setDirection}
        options={DIRECTIONS}
        bordered
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <AmountInput
          label={isForward ? 'Amount today' : 'Amount in the future'}
          hint={isForward ? 'The sum you have now.' : 'The sum you expect later.'}
          value={inputs.amount}
          onChange={(value) => update('amount', value)}
        />
        <NumberInput
          label={isForward ? 'Annual growth rate (%)' : 'Annual discount rate (%)'}
          hint="Compounded once a year."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
        <NumberInput
          label="Years"
          hint="How far apart the two dates are."
          min="0"
          value={inputs.years}
          onChange={(value) => update('years', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? (isForward ? 'Value in the future' : 'Value today') : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.result)
        }
        hint={
          result
            ? isForward
              ? `Growth of ${formatAmount(result.difference)} over ${formatNumber(result.years)} years.`
              : `Discounted by ${formatAmount(result.difference)} to reach today's value.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: isForward ? 'Value in the future' : 'Value today', value: result && formatAmount(result.result) },
          {
            term: isForward ? 'Growth' : 'Discount',
            value: result && formatAmount(result.difference),
          },
          { term: 'Factor', value: result && formatNumber(result.factor, 6) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ amount: '', rate: '', years: '' })} />
    </div>
  )
}
