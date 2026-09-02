'use client'

import { useId, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { CalculatorResult } from '@/components/calculator/calculator-result'
import { formatNumber } from '@/lib/format'

export type ChangeDirection = 'increase' | 'decrease' | 'none'

interface ChangeInputs {
  original: string
  updated: string
}

interface ChangeResult {
  /** Signed percentage: negative for a decrease. */
  percentChange: number
  /** Signed absolute difference between the two values. */
  difference: number
  direction: ChangeDirection
}

interface ChangeOutcome {
  state: 'empty' | 'invalid' | 'ok'
  message?: string
  result?: ChangeResult
}

const DEFAULTS: ChangeInputs = { original: '100', updated: '120' }

const DIRECTION_LABEL: Readonly<Record<ChangeDirection, string>> = {
  increase: 'Increase',
  decrease: 'Decrease',
  none: 'No change',
}

export function evaluatePercentageChange(inputs: ChangeInputs): ChangeOutcome {
  const { original, updated } = inputs
  if (original.trim() === '' || updated.trim() === '') return { state: 'empty' }

  const originalValue = Number(original)
  const updatedValue = Number(updated)

  if (!Number.isFinite(originalValue) || !Number.isFinite(updatedValue)) {
    return { state: 'invalid', message: 'Please enter numbers only.' }
  }
  if (originalValue === 0) {
    return {
      state: 'invalid',
      message:
        'The original value cannot be zero — percentage change needs a non-zero baseline to divide by.',
    }
  }

  const difference = updatedValue - originalValue
  const percentChange = (difference / originalValue) * 100

  return {
    state: 'ok',
    result: {
      percentChange,
      difference,
      direction: difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'none',
    },
  }
}

export function PercentageChangeForm() {
  const [inputs, setInputs] = useState<ChangeInputs>({ ...DEFAULTS })
  const originalId = useId()
  const updatedId = useId()

  const outcome = useMemo(() => evaluatePercentageChange(inputs), [inputs])
  const result = outcome.state === 'ok' && outcome.result ? outcome.result : null

  const fields = [
    {
      id: originalId,
      key: 'original' as const,
      label: 'Original value',
      hint: 'Where you started — the baseline.',
    },
    {
      id: updatedId,
      key: 'updated' as const,
      label: 'New value',
      hint: 'Where you ended up.',
    },
  ]

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <label htmlFor={field.id} className="text-sm font-semibold text-primary">
              {field.label}
            </label>
            <input
              id={field.id}
              type="number"
              inputMode="decimal"
              step="any"
              value={inputs[field.key]}
              onChange={(event) => {
                const next = event.target.value
                setInputs((current) => ({ ...current, [field.key]: next }))
              }}
              className="h-12 rounded-md border border-input bg-background px-3 text-lg outline-none ring-accent focus:ring-2"
            />
            <p className="text-xs text-muted-foreground">{field.hint}</p>
          </div>
        ))}
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? DIRECTION_LABEL[result.direction] : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? (outcome.message ?? 'Invalid input')
            : result
              ? `${formatNumber(Math.abs(result.percentChange))}%`
              : '—'
        }
        hint={
          result
            ? result.direction === 'none'
              ? 'The two values are the same.'
              : `A ${formatNumber(Math.abs(result.difference))} ${result.direction} on the original value.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          {
            term: 'Percentage change',
            value: result && `${formatNumber(result.percentChange)}%`,
          },
          { term: 'Direction', value: result && DIRECTION_LABEL[result.direction] },
          { term: 'Absolute difference', value: result && formatNumber(Math.abs(result.difference)) },
        ].map((item) => (
          <div key={item.term} className="rounded-lg border border-border bg-background p-4">
            <dt className="text-xs font-medium text-muted-foreground">{item.term}</dt>
            <dd className="mt-1 text-xl font-bold text-primary">{item.value ?? '—'}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => setInputs({ original: '', updated: '' })}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="size-4" />
        Reset values
      </button>
    </div>
  )
}
