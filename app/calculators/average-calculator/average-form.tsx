'use client'

import { useMemo, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'

import { CalculatorReset, CalculatorResult, ResultBreakdown } from '@/components/calculator'
import { evaluateAverage } from '@/lib/calculations/average'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULT_VALUES = ['10', '20', '30', '40']

interface ValueRow {
  /** Stable key so removing a row does not shuffle React state between inputs. */
  id: number
  value: string
}

export function AverageForm() {
  const nextId = useRef(DEFAULT_VALUES.length)
  const [rows, setRows] = useState<ValueRow[]>(() =>
    DEFAULT_VALUES.map((value, index) => ({ id: index, value })),
  )

  const outcome = useMemo(() => evaluateAverage(rows.map((row) => row.value)), [rows])
  const summary = outcomeValue(outcome)

  function updateRow(id: number, value: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, value } : row)))
  }

  function addRow() {
    setRows((current) => [...current, { id: nextId.current++, value: '' }])
  }

  function removeRow(id: number) {
    setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      {/*
        Repeating rows keep a bare input on purpose: each row is one value in a
        list rather than a distinct labelled field, so NumberInput's label and
        hint layout does not apply here.
      */}
      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-primary">Your numbers</legend>
        {rows.map((row, index) => (
          <div key={row.id} className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              step="any"
              aria-label={`Value ${index + 1}`}
              value={row.value}
              onChange={(event) => updateRow(row.id, event.target.value)}
              className="h-12 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-lg outline-none ring-accent focus:ring-2"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              disabled={rows.length === 1}
              aria-label={`Remove value ${index + 1}`}
              className="rounded-md border border-border p-2.5 text-muted-foreground transition hover:border-accent hover:text-primary disabled:pointer-events-none disabled:opacity-40"
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
        Add value
      </button>

      <CalculatorResult
        className="mt-7"
        label={summary ? 'Average (mean)' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : summary === null
              ? '—'
              : formatNumber(summary.average)
        }
        hint={
          outcome.state === 'empty'
            ? 'Enter at least one number to see the average.'
            : summary === null
              ? undefined
              : `From ${formatNumber(summary.count)} value${summary.count === 1 ? '' : 's'} totalling ${formatNumber(summary.sum)}.`
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Sum', value: summary && formatNumber(summary.sum) },
          { term: 'Count', value: summary && formatNumber(summary.count) },
          { term: 'Average', value: summary && formatNumber(summary.average) },
        ]}
      />

      <CalculatorReset
        onReset={() => {
          nextId.current = 2
          setRows([
            { id: 0, value: '' },
            { id: 1, value: '' },
          ])
        }}
      />
    </div>
  )
}
