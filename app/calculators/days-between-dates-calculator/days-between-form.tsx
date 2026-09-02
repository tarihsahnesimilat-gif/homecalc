'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  DateInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateDaysBetween } from '@/lib/calculations/days-between'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { start: '2024-05-05', end: '2024-05-12' }

export function DaysBetweenForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluateDaysBetween(inputs.start, inputs.end), [inputs])
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <DateInput
          label="Start date"
          value={inputs.start}
          onChange={(value) => update('start', value)}
        />
        <DateInput
          label="End date"
          hint="May be earlier than the start date."
          value={inputs.end}
          onChange={(value) => update('end', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Days between' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.totalDays)} day${result.totalDays === 1 ? '' : 's'}`
        }
        hint={
          result
            ? `${formatNumber(result.inclusiveDays)} days counting both dates.${result.reversed ? ' The dates were entered in reverse order.' : ''}`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Total days', value: result && formatNumber(result.totalDays) },
          {
            term: 'Weeks and days',
            value:
              result &&
              `${formatNumber(result.weeks)} weeks, ${formatNumber(result.remainingDays)} days`,
          },
          { term: 'Including both dates', value: result && formatNumber(result.inclusiveDays) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ start: '', end: '' })} />
    </div>
  )
}
