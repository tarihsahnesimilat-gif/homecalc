'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateDebtPayoff } from '@/lib/calculations/debt-payoff'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { balance: '5000', rate: '18', payment: '200' }

export function DebtPayoffForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateDebtPayoff(inputs.balance, inputs.rate, inputs.payment),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  const duration = result
    ? result.years > 0
      ? `${formatNumber(result.years)} year${result.years === 1 ? '' : 's'} ${formatNumber(result.remainingMonths)} month${result.remainingMonths === 1 ? '' : 's'}`
      : `${formatNumber(result.months)} month${result.months === 1 ? '' : 's'}`
    : null

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        <AmountInput
          label="Current balance"
          hint="What you owe today."
          value={inputs.balance}
          onChange={(value) => update('balance', value)}
        />
        <NumberInput
          label="Annual interest rate (%)"
          hint="The APR on the account."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
        <AmountInput
          label="Monthly payment"
          hint="Must exceed the monthly interest."
          value={inputs.payment}
          onChange={(value) => update('payment', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Time to pay off' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : duration === null
              ? '—'
              : duration
        }
        hint={
          result
            ? `${formatNumber(result.months)} payments totalling ${formatAmount(result.totalPaid)}, of which ${formatAmount(result.totalInterest)} is interest. Assumes no new spending or fees.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Months to clear', value: result && formatNumber(result.months) },
          { term: 'Total paid', value: result && formatAmount(result.totalPaid) },
          { term: 'Total interest', value: result && formatAmount(result.totalInterest) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ balance: '', rate: '', payment: '' })} />
    </div>
  )
}
