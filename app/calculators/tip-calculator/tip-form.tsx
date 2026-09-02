'use client'

import { useId, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { CalculatorResult } from '@/components/calculator/calculator-result'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { bill: '100', tipPercent: '15', people: '1' } as const

interface TipInputs {
  bill: string
  tipPercent: string
  people: string
}

interface TipBreakdown {
  tipAmount: number
  total: number
  perPerson: number
  people: number
}

type TipOutcome =
  | { state: 'empty' }
  | { state: 'invalid'; message: string }
  | { state: 'ok'; breakdown: TipBreakdown }

/**
 * Pure calculation: amounts are plain numbers with no currency baked in, so
 * the same logic works whatever currency the user has in mind.
 */
export function calculateTip(bill: number, tipPercent: number, people: number): TipBreakdown {
  const tipAmount = bill * (tipPercent / 100)
  const total = bill + tipAmount

  return { tipAmount, total, perPerson: total / people, people }
}

export function evaluateTip({ bill, tipPercent, people }: TipInputs): TipOutcome {
  if (bill.trim() === '' || tipPercent.trim() === '' || people.trim() === '') {
    return { state: 'empty' }
  }

  const billValue = Number(bill)
  const tipValue = Number(tipPercent)
  const peopleValue = Number(people)

  if (!Number.isFinite(billValue) || !Number.isFinite(tipValue) || !Number.isFinite(peopleValue)) {
    return { state: 'invalid', message: 'Please enter numbers only.' }
  }
  if (billValue < 0) {
    return { state: 'invalid', message: 'The bill amount cannot be negative.' }
  }
  if (tipValue < 0) {
    return { state: 'invalid', message: 'The tip percentage cannot be negative.' }
  }
  if (!Number.isInteger(peopleValue)) {
    return { state: 'invalid', message: 'The number of people must be a whole number.' }
  }
  if (peopleValue < 1) {
    return { state: 'invalid', message: 'There must be at least 1 person to split the bill.' }
  }

  return { state: 'ok', breakdown: calculateTip(billValue, tipValue, peopleValue) }
}

export function TipForm() {
  const [inputs, setInputs] = useState<TipInputs>({ ...DEFAULTS })
  const billId = useId()
  const tipId = useId()
  const peopleId = useId()

  const outcome = useMemo(() => evaluateTip(inputs), [inputs])

  const fields = [
    {
      id: billId,
      key: 'bill' as const,
      label: 'Bill amount',
      min: '0',
      step: 'any',
      hint: 'The total before the tip.',
    },
    {
      id: tipId,
      key: 'tipPercent' as const,
      label: 'Tip percentage',
      min: '0',
      step: 'any',
      hint: 'Any rate you like, decimals included.',
    },
    {
      id: peopleId,
      key: 'people' as const,
      label: 'Number of people',
      min: '1',
      step: '1',
      hint: 'Leave at 1 if you are paying alone.',
    },
  ]

  const breakdown = outcome.state === 'ok' ? outcome.breakdown : null
  const isSplit = breakdown !== null && breakdown.people > 1

  const resultLabel =
    outcome.state === 'ok'
      ? isSplit
        ? `Each of ${formatNumber(breakdown.people)} people pays`
        : 'Total bill'
      : 'Your result'

  const resultValue =
    outcome.state === 'invalid'
      ? outcome.message
      : breakdown === null
        ? '—'
        : formatAmount(isSplit ? breakdown.perPerson : breakdown.total)

  const resultHint =
    breakdown === null
      ? undefined
      : isSplit
        ? `Total ${formatAmount(breakdown.total)}, including a ${formatAmount(breakdown.tipAmount)} tip.`
        : `Includes a ${formatAmount(breakdown.tipAmount)} tip.`

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        {fields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <label htmlFor={field.id} className="text-sm font-semibold text-primary">
              {field.label}
            </label>
            <input
              id={field.id}
              type="number"
              inputMode="decimal"
              min={field.min}
              step={field.step}
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
        label={resultLabel}
        value={resultValue}
        hint={resultHint}
        isError={outcome.state === 'invalid'}
      />

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { term: 'Tip amount', value: breakdown && formatAmount(breakdown.tipAmount) },
          { term: 'Total bill', value: breakdown && formatAmount(breakdown.total) },
          { term: 'Amount per person', value: breakdown && formatAmount(breakdown.perPerson) },
        ].map((item) => (
          <div key={item.term} className="rounded-lg border border-border bg-background p-4">
            <dt className="text-xs font-medium text-muted-foreground">{item.term}</dt>
            <dd className="mt-1 text-xl font-bold text-primary">{item.value ?? '—'}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => setInputs({ bill: '', tipPercent: '', people: '' })}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="size-4" />
        Reset values
      </button>
    </div>
  )
}
