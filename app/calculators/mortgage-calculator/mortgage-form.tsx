'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateMortgage } from '@/lib/calculations/mortgage'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { homePrice: '300000', downPayment: '60000', rate: '6', term: '30' }

export function MortgageForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateMortgage(inputs.homePrice, inputs.downPayment, inputs.rate, inputs.term),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <AmountInput
          label="Home price"
          hint="The agreed purchase price."
          value={inputs.homePrice}
          onChange={(value) => update('homePrice', value)}
        />
        <AmountInput
          label="Down payment"
          hint="What you are putting down."
          value={inputs.downPayment}
          onChange={(value) => update('downPayment', value)}
        />
        <NumberInput
          label="Annual interest rate (%)"
          hint="The yearly rate."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
        <NumberInput
          label="Loan term (years)"
          hint="Typically 15, 25 or 30."
          min="0"
          value={inputs.term}
          onChange={(value) => update('term', value)}
        />
      </div>

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
            ? `Borrowing ${formatAmount(result.loanAmount)} after a ${formatNumber(result.downPaymentPercent, 1)}% deposit. Principal and interest only — tax, insurance and fees are not included.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Amount borrowed', value: result && formatAmount(result.loanAmount) },
          { term: 'Monthly payment', value: result && formatAmount(result.monthlyPayment) },
          { term: 'Total interest', value: result && formatAmount(result.totalInterest) },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ homePrice: '', downPayment: '', rate: '', term: '' })}
      />
    </div>
  )
}
