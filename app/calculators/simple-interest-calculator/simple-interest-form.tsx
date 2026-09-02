'use client'

import { useId, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { CalculatorResult } from '@/components/calculator/calculator-result'
import { formatAmount, formatNumber } from '@/lib/format'

export type TimeUnit = 'years' | 'months'

interface InterestInputs {
  principal: string
  rate: string
  time: string
}

interface InterestResult {
  interest: number
  total: number
  principal: number
  years: number
}

interface InterestOutcome {
  state: 'empty' | 'invalid' | 'ok'
  message?: string
  result?: InterestResult
}

const DEFAULTS: InterestInputs = { principal: '1000', rate: '5', time: '2' }

const TIME_UNITS: readonly { id: TimeUnit; label: string }[] = [
  { id: 'years', label: 'Years' },
  { id: 'months', label: 'Months' },
]

/** Months are converted to years so the annual rate applies correctly. */
export function toYears(time: number, unit: TimeUnit): number {
  return unit === 'months' ? time / 12 : time
}

export function evaluateSimpleInterest(unit: TimeUnit, inputs: InterestInputs): InterestOutcome {
  const { principal, rate, time } = inputs
  if (principal.trim() === '' || rate.trim() === '' || time.trim() === '') {
    return { state: 'empty' }
  }

  const principalValue = Number(principal)
  const rateValue = Number(rate)
  const timeValue = Number(time)

  if (![principalValue, rateValue, timeValue].every((value) => Number.isFinite(value))) {
    return { state: 'invalid', message: 'Please enter numbers only.' }
  }
  if (principalValue < 0) {
    return { state: 'invalid', message: 'The principal cannot be negative.' }
  }
  if (rateValue < 0) {
    return { state: 'invalid', message: 'The interest rate cannot be negative.' }
  }
  if (timeValue < 0) {
    return { state: 'invalid', message: 'The time period cannot be negative.' }
  }

  const years = toYears(timeValue, unit)
  const interest = (principalValue * rateValue * years) / 100

  return {
    state: 'ok',
    result: {
      interest,
      total: principalValue + interest,
      principal: principalValue,
      years,
    },
  }
}

export function SimpleInterestForm() {
  const [unit, setUnit] = useState<TimeUnit>('years')
  const [inputs, setInputs] = useState<InterestInputs>({ ...DEFAULTS })
  const principalId = useId()
  const rateId = useId()
  const timeId = useId()

  const outcome = useMemo(() => evaluateSimpleInterest(unit, inputs), [unit, inputs])
  const result = outcome.state === 'ok' && outcome.result ? outcome.result : null

  const fields = [
    {
      id: principalId,
      key: 'principal' as const,
      label: 'Principal',
      hint: 'The amount borrowed or invested.',
    },
    {
      id: rateId,
      key: 'rate' as const,
      label: 'Annual interest rate (%)',
      hint: 'The yearly rate, not the monthly one.',
    },
    {
      id: timeId,
      key: 'time' as const,
      label: 'Time',
      hint: 'How long the money is held.',
    },
  ]

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

      <fieldset className="mt-5 grid gap-2">
        <legend className="text-sm font-semibold text-primary">Time unit</legend>
        <div role="tablist" aria-label="Time unit" className="flex gap-2">
          {TIME_UNITS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={unit === option.id}
              onClick={() => setUnit(option.id)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                unit === option.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Total amount' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? (outcome.message ?? 'Invalid input')
            : result
              ? formatAmount(result.total)
              : '—'
        }
        hint={
          result
            ? `${formatAmount(result.interest)} of interest over ${formatNumber(result.years)} year${result.years === 1 ? '' : 's'}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { term: 'Principal', value: result && formatAmount(result.principal) },
          { term: 'Interest', value: result && formatAmount(result.interest) },
          { term: 'Total amount', value: result && formatAmount(result.total) },
        ].map((item) => (
          <div key={item.term} className="rounded-lg border border-border bg-background p-4">
            <dt className="text-xs font-medium text-muted-foreground">{item.term}</dt>
            <dd className="mt-1 text-xl font-bold text-primary">{item.value ?? '—'}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => setInputs({ principal: '', rate: '', time: '' })}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="size-4" />
        Reset values
      </button>
    </div>
  )
}
