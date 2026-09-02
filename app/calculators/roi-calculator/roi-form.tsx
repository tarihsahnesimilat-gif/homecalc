'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateRoi } from '@/lib/calculations/roi'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { initial: '1000', final: '1500' }

export function RoiForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluateRoi(inputs.initial, inputs.final), [inputs])
  const result = outcomeValue(outcome)
  const isLoss = result !== null && result.gain < 0

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <AmountInput
          label="Initial investment"
          hint="Everything you put in, including costs."
          value={inputs.initial}
          onChange={(value) => update('initial', value)}
        />
        <AmountInput
          label="Final value"
          hint="What it is worth now, or sold for."
          value={inputs.final}
          onChange={(value) => update('final', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? (isLoss ? 'Negative return (a loss)' : 'Return on investment') : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.roiPercent)}%`
        }
        hint={
          result
            ? isLoss
              ? `A loss of ${formatAmount(Math.abs(result.gain))} on ${formatAmount(result.initialInvestment)} invested.`
              : `A gain of ${formatAmount(result.gain)} on ${formatAmount(result.initialInvestment)} invested.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Initial investment', value: result && formatAmount(result.initialInvestment) },
          {
            term: isLoss ? 'Loss' : 'Profit',
            value: result && formatAmount(result.gain),
            negative: isLoss,
          },
          {
            term: 'ROI',
            value: result && `${formatNumber(result.roiPercent)}%`,
            negative: isLoss,
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ initial: '', final: '' })} />
    </div>
  )
}
