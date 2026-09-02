'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  DateInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateDateDifference } from '@/lib/calculations/date-difference'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { start: '2024-01-01', end: '2024-12-25' }

export function DateDifferenceForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluateDateDifference(inputs.start, inputs.end), [inputs])
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
        label={result ? 'Difference' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.span.years)} years, ${formatNumber(result.span.months)} months, ${formatNumber(result.span.days)} days`
        }
        hint={
          result
            ? `${formatNumber(result.totalDays)} days between the two dates, or ${formatNumber(result.inclusiveDays)} counting both.${result.reversed ? ' The dates were entered in reverse order.' : ''}`
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
              `${formatNumber(result.totalWeeks)} weeks, ${formatNumber(result.remainingDays)} days`,
          },
          { term: 'Including both dates', value: result && formatNumber(result.inclusiveDays) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ start: '', end: '' })} />
    </div>
  )
}
