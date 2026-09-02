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
import { type SalesTaxMode, evaluateSalesTax } from '@/lib/calculations/sales-tax'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { price: '100', taxRate: '8.25' }

const MODES: readonly ToggleOption<SalesTaxMode>[] = [
  { id: 'add', label: 'Add tax' },
  { id: 'extract', label: 'Extract tax' },
]

export function SalesTaxForm() {
  const [mode, setMode] = useState<SalesTaxMode>('add')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateSalesTax(mode, inputs.price, inputs.taxRate),
    [mode, inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorToggle
        label="Direction"
        value={mode}
        onChange={setMode}
        options={MODES}
        bordered
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <AmountInput
          label={mode === 'add' ? 'Price before tax' : 'Price including tax'}
          hint={
            mode === 'add'
              ? 'The pre-tax price on the label.'
              : 'The total you actually paid.'
          }
          value={inputs.price}
          onChange={(value) => update('price', value)}
        />
        <NumberInput
          label="Tax rate (%)"
          hint="Whatever rate applies where you are buying."
          min="0"
          value={inputs.taxRate}
          onChange={(value) => update('taxRate', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? (mode === 'add' ? 'Total price' : 'Price before tax') : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(mode === 'add' ? result.finalPrice : result.preTaxPrice)
        }
        hint={
          result
            ? `${formatAmount(result.taxAmount)} of tax at ${formatNumber(result.taxRate)}%.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Price before tax', value: result && formatAmount(result.preTaxPrice) },
          { term: 'Tax amount', value: result && formatAmount(result.taxAmount) },
          { term: 'Total price', value: result && formatAmount(result.finalPrice) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ price: '', taxRate: '' })} />
    </div>
  )
}
