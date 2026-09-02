'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateTip } from '@/lib/calculations/tip'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { bill: '100', tipPercent: '15', people: '1' }

export function TipForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateTip(inputs.bill, inputs.tipPercent, inputs.people),
    [inputs],
  )
  const breakdown = outcomeValue(outcome)
  const isSplit = breakdown !== null && breakdown.people > 1

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        <AmountInput
          label="Bill amount"
          hint="The total before the tip."
          value={inputs.bill}
          onChange={(value) => update('bill', value)}
        />
        <NumberInput
          label="Tip percentage"
          hint="Any rate you like, decimals included."
          min="0"
          value={inputs.tipPercent}
          onChange={(value) => update('tipPercent', value)}
        />
        <NumberInput
          label="Number of people"
          hint="Leave at 1 if you are paying alone."
          min="1"
          integer
          value={inputs.people}
          onChange={(value) => update('people', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={
          breakdown === null
            ? 'Your result'
            : isSplit
              ? `Each of ${formatNumber(breakdown.people)} people pays`
              : 'Total bill'
        }
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : breakdown === null
              ? '—'
              : formatAmount(isSplit ? breakdown.perPerson : breakdown.total)
        }
        hint={
          breakdown === null
            ? undefined
            : isSplit
              ? `Total ${formatAmount(breakdown.total)}, including a ${formatAmount(breakdown.tipAmount)} tip.`
              : `Includes a ${formatAmount(breakdown.tipAmount)} tip.`
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Tip amount', value: breakdown && formatAmount(breakdown.tipAmount) },
          { term: 'Total bill', value: breakdown && formatAmount(breakdown.total) },
          { term: 'Amount per person', value: breakdown && formatAmount(breakdown.perPerson) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ bill: '', tipPercent: '', people: '' })} />
    </div>
  )
}
