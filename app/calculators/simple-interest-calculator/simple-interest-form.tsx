'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  CalculatorToggle,
  NumberInput,
  ResultBreakdown,
  type ToggleOption,
} from '@/components/calculator'
import { type TimeUnit, evaluateSimpleInterest } from '@/lib/calculations/simple-interest'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { principal: '1000', rate: '5', time: '2' }

const TIME_UNITS: readonly ToggleOption<TimeUnit>[] = [
  { id: 'years', label: 'Years' },
  { id: 'months', label: 'Months' },
]

export function SimpleInterestForm() {
  const [unit, setUnit] = useState<TimeUnit>('years')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateSimpleInterest(unit, inputs.principal, inputs.rate, inputs.time),
    [unit, inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        <AmountInput
          label="Principal"
          hint="The amount borrowed or invested."
          value={inputs.principal}
          onChange={(value) => update('principal', value)}
        />
        <NumberInput
          label="Annual interest rate (%)"
          hint="The yearly rate, not the monthly one."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
        <NumberInput
          label="Time"
          hint="How long the money is held."
          min="0"
          value={inputs.time}
          onChange={(value) => update('time', value)}
        />
      </div>

      <fieldset className="mt-5 grid gap-2">
        <legend className="text-sm font-semibold text-primary">Time unit</legend>
        <CalculatorToggle label="Time unit" value={unit} onChange={setUnit} options={TIME_UNITS} />
      </fieldset>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Total amount' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.total)
        }
        hint={
          result
            ? `${formatAmount(result.interest)} of interest over ${formatNumber(result.years)} year${result.years === 1 ? '' : 's'}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Principal', value: result && formatAmount(result.principal) },
          { term: 'Interest', value: result && formatAmount(result.interest) },
          { term: 'Total amount', value: result && formatAmount(result.total) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ principal: '', rate: '', time: '' })} />
    </div>
  )
}
