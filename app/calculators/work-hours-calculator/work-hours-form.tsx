'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
  TimeInput,
} from '@/components/calculator'
import { evaluateWorkHours } from '@/lib/calculations/work-hours'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { start: '09:00', end: '17:30', breakMinutes: '60' }

export function WorkHoursForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateWorkHours(inputs.start, inputs.end, inputs.breakMinutes),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        <TimeInput
          label="Shift start"
          value={inputs.start}
          onChange={(value) => update('start', value)}
        />
        <TimeInput
          label="Shift end"
          hint="An earlier time means an overnight shift."
          value={inputs.end}
          onChange={(value) => update('end', value)}
        />
        <NumberInput
          label="Unpaid break (minutes)"
          hint="Enter 0 if breaks are paid."
          min="0"
          integer
          value={inputs.breakMinutes}
          onChange={(value) => update('breakMinutes', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Hours worked' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.net.hours)} hours ${formatNumber(result.net.minutes)} minutes`
        }
        hint={
          result
            ? `${formatNumber(result.net.totalMinutes / 60, 2)} decimal hours, from a ${formatNumber(result.gross.hours)} h ${formatNumber(result.gross.minutes)} m shift less a ${formatNumber(result.breakMinutes)} minute break.${result.gross.crossesMidnight ? ' This shift runs overnight.' : ''}`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          {
            term: 'Gross shift',
            value:
              result &&
              `${formatNumber(result.gross.hours)} h ${formatNumber(result.gross.minutes)} m`,
          },
          { term: 'Break deducted', value: result && `${formatNumber(result.breakMinutes)} m` },
          {
            term: 'Net hours worked',
            value:
              result && `${formatNumber(result.net.hours)} h ${formatNumber(result.net.minutes)} m`,
          },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ start: '', end: '', breakMinutes: '' })}
      />
    </div>
  )
}
