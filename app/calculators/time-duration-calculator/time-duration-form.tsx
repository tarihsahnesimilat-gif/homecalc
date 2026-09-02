'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  ResultBreakdown,
  TimeInput,
} from '@/components/calculator'
import { evaluateTimeDuration } from '@/lib/calculations/time-duration'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { start: '09:00', end: '17:30' }

export function TimeDurationForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluateTimeDuration(inputs.start, inputs.end), [inputs])
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <TimeInput
          label="Start time"
          value={inputs.start}
          onChange={(value) => update('start', value)}
        />
        <TimeInput
          label="End time"
          hint="An earlier time is treated as the next day."
          value={inputs.end}
          onChange={(value) => update('end', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Elapsed time' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.hours)} hours ${formatNumber(result.minutes)} minutes`
        }
        hint={
          result
            ? `${formatNumber(result.totalMinutes)} minutes in total, or ${formatNumber(result.totalMinutes / 60, 2)} decimal hours.${result.crossesMidnight ? ' This span crosses midnight.' : ''}`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          {
            term: 'Hours and minutes',
            value: result && `${formatNumber(result.hours)} h ${formatNumber(result.minutes)} m`,
          },
          { term: 'Total minutes', value: result && formatNumber(result.totalMinutes) },
          {
            term: 'Decimal hours',
            value: result && formatNumber(result.totalMinutes / 60, 2),
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ start: '', end: '' })} />
    </div>
  )
}
