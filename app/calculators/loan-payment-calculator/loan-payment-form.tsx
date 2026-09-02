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
import { type LoanTermUnit, evaluateLoanPayment } from '@/lib/calculations/loan-payment'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { amount: '200000', rate: '6', term: '30' }

const TERM_UNITS: readonly ToggleOption<LoanTermUnit>[] = [
  { id: 'years', label: 'Years' },
  { id: 'months', label: 'Months' },
]

export function LoanPaymentForm() {
  const [unit, setUnit] = useState<LoanTermUnit>('years')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateLoanPayment(inputs.amount, inputs.rate, inputs.term, unit),
    [inputs, unit],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        <AmountInput
          label="Loan amount"
          hint="The sum borrowed, before fees."
          value={inputs.amount}
          onChange={(value) => update('amount', value)}
        />
        <NumberInput
          label="Annual interest rate (%)"
          hint="The yearly rate, not the monthly one."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
        <NumberInput
          label="Loan term"
          hint="How long you have to repay."
          min="0"
          value={inputs.term}
          onChange={(value) => update('term', value)}
        />
      </div>

      <fieldset className="mt-5 grid gap-2">
        <legend className="text-sm font-semibold text-primary">Term unit</legend>
        <CalculatorToggle label="Term unit" value={unit} onChange={setUnit} options={TERM_UNITS} />
      </fieldset>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Estimated monthly payment' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.monthlyPayment)
        }
        hint={
          result
            ? `${formatNumber(result.months)} payments totalling ${formatAmount(result.totalPaid)}. Principal and interest only — fees, taxes and insurance are not included.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Monthly payment', value: result && formatAmount(result.monthlyPayment) },
          { term: 'Total repaid', value: result && formatAmount(result.totalPaid) },
          { term: 'Total interest', value: result && formatAmount(result.totalInterest) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ amount: '', rate: '', term: '' })} />
    </div>
  )
}
