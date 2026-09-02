'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  CalculatorToggle,
  DateInput,
  NumberInput,
  ResultBreakdown,
  type ToggleOption,
} from '@/components/calculator'
import { type DateDirection, evaluateDateCalculator } from '@/lib/calculations/date-calculator'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { startDate: '2024-01-01', days: '30' }

const DIRECTIONS: readonly ToggleOption<DateDirection>[] = [
  { id: 'add', label: 'Add days' },
  { id: 'subtract', label: 'Subtract days' },
]

export function DateCalculatorForm() {
  const [direction, setDirection] = useState<DateDirection>('add')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateDateCalculator(inputs.startDate, inputs.days, direction),
    [inputs, direction],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <DateInput
          label="Start date"
          value={inputs.startDate}
          onChange={(value) => update('startDate', value)}
        />
        <NumberInput
          label="Number of days"
          hint="Whole days, entered as a positive number."
          min="0"
          integer
          value={inputs.days}
          onChange={(value) => update('days', value)}
        />
      </div>

      <fieldset className="mt-5 grid gap-2">
        <legend className="text-sm font-semibold text-primary">Direction</legend>
        <CalculatorToggle
          label="Direction"
          value={direction}
          onChange={setDirection}
          options={DIRECTIONS}
        />
      </fieldset>

      <CalculatorResult
        className="mt-7"
        label={result ? `${formatNumber(result.days)} days ${result.direction === 'add' ? 'after' : 'before'}` : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : result.formatted
        }
        hint={
          result
            ? `That is a ${result.weekday}. The start date was a ${result.startWeekday}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Result date', value: result && result.formatted },
          { term: 'Day of the week', value: result && result.weekday },
          {
            term: 'Days counted',
            value:
              result &&
              `${result.direction === 'add' ? '+' : '−'}${formatNumber(result.days)}`,
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ startDate: '', days: '' })} />
    </div>
  )
}
