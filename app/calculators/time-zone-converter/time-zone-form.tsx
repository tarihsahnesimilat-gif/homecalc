'use client'

import { useMemo, useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'

import {
  CalculatorReset,
  CalculatorResult,
  CalculatorSelect,
  DateInput,
  ResultBreakdown,
  TimeInput,
  type SelectOption,
} from '@/components/calculator'
import { TIME_ZONES, evaluateTimeZone } from '@/lib/calculations/timezone'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const ZONE_OPTIONS: readonly SelectOption[] = TIME_ZONES.map((zone) => ({
  value: zone.id,
  label: zone.label,
}))

/** Turns an offset in minutes into the familiar UTC+1:30 form. */
function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? '−' : '+'
  const total = Math.abs(minutes)
  const hours = Math.floor(total / 60)
  const rest = total % 60

  return `UTC${sign}${hours}${rest ? `:${String(rest).padStart(2, '0')}` : ''}`
}

export function TimeZoneForm() {
  const [date, setDate] = useState('2024-06-01')
  const [time, setTime] = useState('09:00')
  const [from, setFrom] = useState('UTC')
  const [to, setTo] = useState('America/New_York')

  const outcome = useMemo(
    () => evaluateTimeZone(date, time, from, to),
    [date, time, from, to],
  )
  const result = outcomeValue(outcome)

  function swap() {
    setFrom(to)
    setTo(from)
  }

  const dayNote =
    result && result.dayShift !== 0
      ? result.dayShift > 0
        ? ' That is the next day.'
        : ' That is the previous day.'
      : ''

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <DateInput
          label="Date"
          hint="Needed because offsets change with daylight saving."
          value={date}
          onChange={setDate}
        />
        <TimeInput label="Time" value={time} onChange={setTime} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <CalculatorSelect label="From" value={from} onChange={setFrom} options={ZONE_OPTIONS} />
        <div className="flex items-end gap-3">
          <CalculatorSelect
            className="flex-1"
            label="To"
            value={to}
            onChange={setTo}
            options={ZONE_OPTIONS}
          />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap the two time zones"
            className="h-12 rounded-md border border-border px-3 text-muted-foreground transition hover:border-accent hover:text-primary"
          >
            <ArrowRightLeft className="size-4" />
          </button>
        </div>
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Converted time' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${result.time} on ${result.date}`
        }
        hint={
          result
            ? `${result.abbreviation}, ${formatOffset(result.offsetMinutes)}.${dayNote}`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Local time', value: result && result.time },
          { term: 'Local date', value: result && result.date },
          {
            term: 'Zone offset',
            value: result && `${result.abbreviation} (${formatOffset(result.offsetMinutes)})`,
          },
        ]}
      />

      <CalculatorReset
        onReset={() => {
          setDate('')
          setTime('')
        }}
      />
    </div>
  )
}
