'use client'

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { CalculatorResult } from '@/components/calculator/calculator-result'
import { formatNumber } from '@/lib/format'

type Mode = 'of' | 'what' | 'change' | 'increase' | 'decrease'

interface ModeConfig {
  id: Mode
  label: string
  /** Field labels, in the same order the formula consumes them. */
  fields: [string, string]
  helper: string
  /** True when the answer is itself a percentage. */
  resultIsPercent: boolean
}

const modes: readonly ModeConfig[] = [
  {
    id: 'of',
    label: 'What is X% of Y?',
    fields: ['Percentage', 'Number'],
    helper: 'Find a percentage of a number.',
    resultIsPercent: false,
  },
  {
    id: 'what',
    label: 'X is what % of Y?',
    fields: ['First number', 'Second number'],
    helper: 'Find what percentage one number is of another.',
    resultIsPercent: true,
  },
  {
    id: 'change',
    label: 'Percentage change',
    fields: ['Original value', 'New value'],
    helper: 'Calculate the percentage change between two values.',
    resultIsPercent: true,
  },
  {
    id: 'increase',
    label: 'Increase by X%',
    fields: ['Original value', 'Increase percentage'],
    helper: 'Add a percentage to a number.',
    resultIsPercent: false,
  },
  {
    id: 'decrease',
    label: 'Decrease by X%',
    fields: ['Original value', 'Decrease percentage'],
    helper: 'Subtract a percentage from a number.',
    resultIsPercent: false,
  },
]

interface Calculation {
  label: string
  /** `null` when the calculation is undefined, e.g. division by zero. */
  value: number | null
  error?: string
}

/**
 * `a` is always the first field, `b` the second — matching the field labels
 * for every mode.
 */
function calculate(mode: Mode, a: number, b: number): Calculation {
  switch (mode) {
    case 'of':
      return { label: `${formatNumber(a)}% of ${formatNumber(b)}`, value: (a / 100) * b }
    case 'what':
      return b === 0
        ? {
            label: `${formatNumber(a)} is what % of ${formatNumber(b)}`,
            value: null,
            error: 'The second number cannot be zero — nothing can be a percentage of zero.',
          }
        : { label: `${formatNumber(a)} is what % of ${formatNumber(b)}`, value: (a / b) * 100 }
    case 'change':
      return a === 0
        ? {
            label: `Change from ${formatNumber(a)} to ${formatNumber(b)}`,
            value: null,
            error: 'The original value cannot be zero — percentage change needs a baseline.',
          }
        : { label: `Change from ${formatNumber(a)} to ${formatNumber(b)}`, value: ((b - a) / a) * 100 }
    case 'increase':
      return {
        label: `${formatNumber(a)} increased by ${formatNumber(b)}%`,
        value: a * (1 + b / 100),
      }
    case 'decrease':
      return {
        label: `${formatNumber(a)} decreased by ${formatNumber(b)}%`,
        value: a * (1 - b / 100),
      }
  }
}

export function PercentageForm() {
  const [mode, setMode] = useState<Mode>('of')
  const [values, setValues] = useState<[string, string]>(['15', '240'])

  const active = modes.find((item) => item.id === mode) ?? modes[0]

  const calculation = useMemo<Calculation | null>(() => {
    const [rawA, rawB] = values
    if (rawA.trim() === '' || rawB.trim() === '') return null

    const a = Number(rawA)
    const b = Number(rawB)
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null

    return calculate(mode, a, b)
  }, [mode, values])

  const hasError = calculation?.value === null
  const displayValue =
    calculation === null
      ? '—'
      : calculation.value === null
        ? 'Cannot divide by zero'
        : `${formatNumber(calculation.value)}${active.resultIsPercent ? '%' : ''}`

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div
        role="tablist"
        aria-label="Calculation mode"
        className="flex flex-wrap gap-2 border-b border-border pb-5"
      >
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            onClick={() => setMode(item.id)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              mode === item.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-primary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{active.helper}</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {active.fields.map((label, index) => (
          <label key={`${mode}-${label}`} className="grid gap-2 text-sm font-semibold text-primary">
            {label}
            <input
              type="number"
              inputMode="decimal"
              value={values[index]}
              onChange={(event) => {
                const next = event.target.value
                setValues((current) =>
                  index === 0 ? [next, current[1]] : [current[0], next],
                )
              }}
              className="h-12 rounded-md border border-input bg-background px-3 text-lg font-normal outline-none ring-accent focus:ring-2"
            />
          </label>
        ))}
      </div>

      <CalculatorResult
        className="mt-7"
        label={calculation?.label ?? 'Your result'}
        value={displayValue}
        hint={calculation?.error}
        isError={hasError}
      />

      <button
        type="button"
        onClick={() => setValues(['', ''])}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="size-4" />
        Reset values
      </button>
    </div>
  )
}
