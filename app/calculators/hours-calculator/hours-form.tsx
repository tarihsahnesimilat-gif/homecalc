'use client'

import { useMemo, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
  TimeInput,
} from '@/components/calculator'
import { evaluateHours } from '@/lib/calculations/hours'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULT_ENTRIES = [
  { start: '09:00', end: '17:00' },
  { start: '09:00', end: '12:30' },
]

interface EntryRow {
  /** Stable key so removing a row does not shuffle React state between inputs. */
  id: number
  start: string
  end: string
}

export function HoursForm() {
  const nextId = useRef(DEFAULT_ENTRIES.length)
  const [rows, setRows] = useState<EntryRow[]>(() =>
    DEFAULT_ENTRIES.map((entry, index) => ({ id: index, ...entry })),
  )
  const [hourlyRate, setHourlyRate] = useState('')

  const outcome = useMemo(
    () => evaluateHours(rows.map(({ start, end }) => ({ start, end })), hourlyRate),
    [rows, hourlyRate],
  )
  const result = outcomeValue(outcome)

  function updateRow(id: number, key: 'start' | 'end', value: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [key]: value } : row)))
  }

  function addRow() {
    setRows((current) => [...current, { id: nextId.current++, start: '', end: '' }])
  }

  function removeRow(id: number) {
    setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <fieldset className="grid gap-4">
        <legend className="text-sm font-semibold text-primary">Time entries</legend>
        {rows.map((row, index) => (
          <div key={row.id} className="flex items-end gap-2">
            <TimeInput
              className="flex-1"
              label={`Start ${index + 1}`}
              value={row.start}
              onChange={(value) => updateRow(row.id, 'start', value)}
            />
            <TimeInput
              className="flex-1"
              label={`End ${index + 1}`}
              value={row.end}
              onChange={(value) => updateRow(row.id, 'end', value)}
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              disabled={rows.length === 1}
              aria-label={`Remove entry ${index + 1}`}
              className="mb-0 rounded-md border border-border p-2.5 text-muted-foreground transition hover:border-accent hover:text-primary disabled:pointer-events-none disabled:opacity-40"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </fieldset>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-primary transition hover:border-accent hover:bg-muted"
      >
        <Plus className="size-4" />
        Add entry
      </button>

      <div className="mt-5">
        <NumberInput
          label="Hourly rate (optional)"
          hint="Leave blank to see hours only."
          min="0"
          value={hourlyRate}
          onChange={setHourlyRate}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Total hours' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.hours)} hours ${formatNumber(result.minutes)} minutes`
        }
        hint={
          result
            ? `${formatNumber(result.decimalHours, 2)} decimal hours across ${formatNumber(result.entries.length)} entr${result.entries.length === 1 ? 'y' : 'ies'}.${result.pay === null ? '' : ` That is ${formatAmount(result.pay)} of pay.`}`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          {
            term: 'Total time',
            value:
              result && `${formatNumber(result.hours)} h ${formatNumber(result.minutes)} m`,
          },
          { term: 'Decimal hours', value: result && formatNumber(result.decimalHours, 2) },
          {
            term: 'Pay',
            value: result && (result.pay === null ? '—' : formatAmount(result.pay)),
          },
        ]}
      />

      <CalculatorReset
        onReset={() => {
          nextId.current = 2
          setRows([
            { id: 0, start: '', end: '' },
            { id: 1, start: '', end: '' },
          ])
          setHourlyRate('')
        }}
      />
    </div>
  )
}
