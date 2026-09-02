'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  CalculatorSelect,
  NumberInput,
  ResultBreakdown,
  type SelectOption,
} from '@/components/calculator'
import { evaluateCompoundInterest } from '@/lib/calculations/compound-interest'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { principal: '1000', rate: '5', years: '10' }

const FREQUENCIES: readonly SelectOption[] = [
  { value: 'annually', label: 'Annually' },
  { value: 'semi-annually', label: 'Semi-annually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily', label: 'Daily' },
]

export function CompoundInterestForm() {
  const [frequency, setFrequency] = useState('annually')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateCompoundInterest(inputs.principal, inputs.rate, frequency, inputs.years),
    [inputs, frequency],
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
          hint="The starting balance."
          value={inputs.principal}
          onChange={(value) => update('principal', value)}
        />
        <NumberInput
          label="Annual interest rate (%)"
          hint="The yearly rate before compounding."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
        <NumberInput
          label="Time (years)"
          hint="Decimals are fine — 18 months is 1.5."
          min="0"
          value={inputs.years}
          onChange={(value) => update('years', value)}
        />
      </div>

      <CalculatorSelect
        className="mt-5"
        label="Compounding frequency"
        value={frequency}
        onChange={setFrequency}
        options={FREQUENCIES}
      />

      <CalculatorResult
        className="mt-7"
        label={result ? 'Final amount' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.finalAmount)
        }
        hint={
          result
            ? `${formatAmount(result.totalInterest)} of interest, compounded ${formatNumber(result.periodsPerYear)} time${result.periodsPerYear === 1 ? '' : 's'} a year. An estimate at a fixed rate.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Principal', value: result && formatAmount(result.principal) },
          { term: 'Total interest', value: result && formatAmount(result.totalInterest) },
          { term: 'Final amount', value: result && formatAmount(result.finalAmount) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ principal: '', rate: '', years: '' })} />
    </div>
  )
}
