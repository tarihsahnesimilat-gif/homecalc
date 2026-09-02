'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateCommission } from '@/lib/calculations/commission'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { saleAmount: '5000', rate: '10' }

export function CommissionForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateCommission(inputs.saleAmount, inputs.rate),
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
          label="Sale amount"
          hint="The value commission is charged on."
          value={inputs.saleAmount}
          onChange={(value) => update('saleAmount', value)}
        />
        <NumberInput
          label="Commission rate (%)"
          hint="Decimals such as 2.5 are fine."
          min="0"
          value={inputs.rate}
          onChange={(value) => update('rate', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? `Commission at ${formatNumber(result.commissionRate)}%` : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.commission)
        }
        hint={
          result
            ? `Deducted from the sale that leaves ${formatAmount(result.netAmount)}; added on top it comes to ${formatAmount(result.totalWithCommission)}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Commission', value: result && formatAmount(result.commission) },
          { term: 'After commission', value: result && formatAmount(result.netAmount) },
          { term: 'With commission added', value: result && formatAmount(result.totalWithCommission) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ saleAmount: '', rate: '' })} />
    </div>
  )
}
