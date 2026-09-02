'use client'

import { useId, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { CalculatorResult } from '@/components/calculator/calculator-result'
import { formatAmount, formatNumber } from '@/lib/format'

interface MarginInputs {
  revenue: string
  cost: string
}

interface MarginResult {
  /** Negative when cost exceeds revenue — a legitimate result, not an error. */
  profit: number
  margin: number
  revenue: number
  cost: number
}

interface MarginOutcome {
  state: 'empty' | 'invalid' | 'ok'
  message?: string
  result?: MarginResult
}

const DEFAULTS: MarginInputs = { revenue: '1000', cost: '600' }

export function evaluateProfitMargin(inputs: MarginInputs): MarginOutcome {
  const { revenue, cost } = inputs
  if (revenue.trim() === '' || cost.trim() === '') return { state: 'empty' }

  const revenueValue = Number(revenue)
  const costValue = Number(cost)

  if (!Number.isFinite(revenueValue) || !Number.isFinite(costValue)) {
    return { state: 'invalid', message: 'Please enter numbers only.' }
  }
  if (revenueValue <= 0) {
    return {
      state: 'invalid',
      message: 'Revenue must be greater than zero — margin is a share of revenue.',
    }
  }
  if (costValue < 0) {
    return { state: 'invalid', message: 'Cost cannot be negative.' }
  }

  const profit = revenueValue - costValue

  return {
    state: 'ok',
    result: {
      profit,
      margin: (profit / revenueValue) * 100,
      revenue: revenueValue,
      cost: costValue,
    },
  }
}

export function ProfitMarginForm() {
  const [inputs, setInputs] = useState<MarginInputs>({ ...DEFAULTS })
  const revenueId = useId()
  const costId = useId()

  const outcome = useMemo(() => evaluateProfitMargin(inputs), [inputs])
  const result = outcome.state === 'ok' && outcome.result ? outcome.result : null
  const isLoss = result !== null && result.profit < 0

  const fields = [
    {
      id: revenueId,
      key: 'revenue' as const,
      label: 'Revenue (selling price)',
      hint: 'What you receive. Must be above zero.',
    },
    {
      id: costId,
      key: 'cost' as const,
      label: 'Cost',
      hint: 'What the item cost you. Zero is allowed.',
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
              min="0"
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
        label={result ? (isLoss ? 'Negative margin (a loss)' : 'Profit margin') : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? (outcome.message ?? 'Invalid input')
            : result
              ? `${formatNumber(result.margin)}%`
              : '—'
        }
        hint={
          result
            ? isLoss
              ? `Cost exceeds revenue by ${formatAmount(Math.abs(result.profit))}.`
              : `A profit of ${formatAmount(result.profit)} on ${formatAmount(result.revenue)} of revenue.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { term: 'Revenue', value: result && formatAmount(result.revenue), negative: false },
          {
            term: isLoss ? 'Loss' : 'Profit',
            value: result && formatAmount(result.profit),
            negative: isLoss,
          },
          {
            term: 'Profit margin',
            value: result && `${formatNumber(result.margin)}%`,
            negative: isLoss,
          },
        ].map((item) => (
          <div key={item.term} className="rounded-lg border border-border bg-background p-4">
            <dt className="text-xs font-medium text-muted-foreground">{item.term}</dt>
            <dd
              className={`mt-1 text-xl font-bold ${item.negative ? 'text-destructive' : 'text-primary'}`}
            >
              {item.value ?? '—'}
            </dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => setInputs({ revenue: '', cost: '' })}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="size-4" />
        Reset values
      </button>
    </div>
  )
}
