'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateLoanInterest } from '@/lib/calculations/loan-interest'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { amount: '20000', rate: '7', term: '5' }

export function LoanInterestForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateLoanInterest(inputs.amount, inputs.rate, inputs.term),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        <AmountInput
          label="Amount borrowed"
          hint="The principal."
          value={inputs.amount}
          onChange={(value) => update('amount', value)}
        />
        <NumberInput
          label="Annual interest rate (%)"
          hint="The yearly rate."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
        <NumberInput
          label="Term (years)"
          hint="How long you have to repay."
          min="0"
          value={inputs.term}
          onChange={(value) => update('term', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Total interest' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.totalInterest)
        }
        hint={
          result
            ? `${formatNumber(result.interestAsPercentOfPrincipal, 1)}% of the amount borrowed, over ${formatNumber(result.months)} payments of ${formatAmount(result.monthlyPayment)}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Total interest', value: result && formatAmount(result.totalInterest) },
          {
            term: 'First payment: interest',
            value: result && formatAmount(result.firstPaymentInterest),
          },
          {
            term: 'First payment: principal',
            value: result && formatAmount(result.firstPaymentPrincipal),
          },
        ]}
      />

      <ResultBreakdown
        columns={2}
        items={[
          { term: 'Total repaid', value: result && formatAmount(result.totalPaid) },
          {
            term: 'Final payment: principal',
            value: result && formatAmount(result.lastPaymentPrincipal),
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ amount: '', rate: '', term: '' })} />
    </div>
  )
}
