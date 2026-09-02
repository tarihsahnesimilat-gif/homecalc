'use client'

import { useMemo, useState } from 'react'

import {
  AmountInput,
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluatePricePerUnit } from '@/lib/calculations/price-per-unit'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { priceA: '2.00', quantityA: '500', priceB: '3.50', quantityB: '1000' }

export function PricePerUnitForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () =>
      evaluatePricePerUnit(inputs.priceA, inputs.quantityA, inputs.priceB, inputs.quantityB),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  const verdict =
    result === null
      ? null
      : result.better === 'equal'
        ? 'Identical value'
        : `Option ${result.better.toUpperCase()} is better value`

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="rounded-md border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
        Enter both quantities in the same unit — grams against grams, millilitres against
        millilitres. Mixing units gives an answer that looks perfectly reasonable and is wrong.
      </p>

      <fieldset className="mt-5 grid gap-5 sm:grid-cols-2">
        <legend className="text-sm font-semibold text-primary">Option A</legend>
        <AmountInput
          label="Price"
          value={inputs.priceA}
          onChange={(value) => update('priceA', value)}
        />
        <NumberInput
          label="Quantity"
          hint="Grams, millilitres, sheets — your choice."
          min="0"
          value={inputs.quantityA}
          onChange={(value) => update('quantityA', value)}
        />
      </fieldset>

      <fieldset className="mt-5 grid gap-5 sm:grid-cols-2">
        <legend className="text-sm font-semibold text-primary">Option B</legend>
        <AmountInput
          label="Price"
          value={inputs.priceB}
          onChange={(value) => update('priceB', value)}
        />
        <NumberInput
          label="Quantity"
          hint="Must use the same unit as option A."
          min="0"
          value={inputs.quantityB}
          onChange={(value) => update('quantityB', value)}
        />
      </fieldset>

      <CalculatorResult
        className="mt-7"
        label={verdict ?? 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : result.better === 'equal'
                ? formatNumber(result.unitPriceA, 6)
                : `${formatNumber(result.savingPercent, 1)}% cheaper`
        }
        hint={
          result
            ? `A costs ${formatNumber(result.unitPriceA, 6)} per unit, B costs ${formatNumber(result.unitPriceB, 6)}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Option A per unit', value: result && formatNumber(result.unitPriceA, 6) },
          { term: 'Option B per unit', value: result && formatNumber(result.unitPriceB, 6) },
          {
            term: 'Saving per unit',
            value: result && formatNumber(result.savingPerUnit, 6),
          },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ priceA: '', quantityA: '', priceB: '', quantityB: '' })}
      />
    </div>
  )
}
