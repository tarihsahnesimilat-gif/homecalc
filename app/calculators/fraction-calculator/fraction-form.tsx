'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  CalculatorToggle,
  NumberInput,
  ResultBreakdown,
  type ToggleOption,
} from '@/components/calculator'
import {
  type FractionOperation,
  evaluateFraction,
  formatFraction,
  formatMixedNumber,
} from '@/lib/calculations/fraction'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const OPERATIONS: readonly ToggleOption<FractionOperation>[] = [
  { id: 'add', label: 'Add', symbol: '+' },
  { id: 'subtract', label: 'Subtract', symbol: '−' },
  { id: 'multiply', label: 'Multiply', symbol: '×' },
  { id: 'divide', label: 'Divide', symbol: '÷' },
]

const DEFAULTS = {
  aNumerator: '1',
  aDenominator: '2',
  bNumerator: '1',
  bDenominator: '4',
}

type FractionField = keyof typeof DEFAULTS

const FRACTION_GROUPS: readonly {
  legend: string
  fields: readonly { key: FractionField; label: string }[]
}[] = [
  {
    legend: 'First fraction',
    fields: [
      { key: 'aNumerator', label: 'Numerator' },
      { key: 'aDenominator', label: 'Denominator' },
    ],
  },
  {
    legend: 'Second fraction',
    fields: [
      { key: 'bNumerator', label: 'Numerator' },
      { key: 'bDenominator', label: 'Denominator' },
    ],
  },
]

export function FractionForm() {
  const [operation, setOperation] = useState<FractionOperation>('add')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () =>
      evaluateFraction(
        operation,
        inputs.aNumerator,
        inputs.aDenominator,
        inputs.bNumerator,
        inputs.bDenominator,
      ),
    [operation, inputs],
  )
  const result = outcomeValue(outcome)
  const activeSymbol = OPERATIONS.find((item) => item.id === operation)?.symbol ?? '+'
  const mixed = result ? formatMixedNumber(result) : ''
  const decimal = result ? formatNumber(result.numerator / result.denominator, 6) : null

  function update(key: FractionField, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorToggle
        label="Operation"
        value={operation}
        onChange={setOperation}
        options={OPERATIONS}
        bordered
      />

      <div className="mt-6 grid items-end gap-5 sm:grid-cols-[1fr_auto_1fr]">
        {FRACTION_GROUPS.map((group) => (
          <fieldset key={group.legend} className="grid gap-3">
            <legend className="text-sm font-semibold text-primary">{group.legend}</legend>
            {group.fields.map((field) => (
              <NumberInput
                key={field.key}
                label={field.label}
                labelSize="compact"
                integer
                value={inputs[field.key]}
                onChange={(value) => update(field.key, value)}
              />
            ))}
          </fieldset>
        ))}

        {/* Operator sits between the two fraction groups on wide screens. */}
        <div
          aria-hidden="true"
          className="order-first hidden self-center text-2xl font-bold text-accent sm:order-none sm:block"
          style={{ gridColumn: 2, gridRow: 1 }}
        >
          {activeSymbol}
        </div>
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Result' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatFraction(result)
        }
        hint={
          result && decimal
            ? `${decimal} as a decimal${mixed ? ` · ${mixed} as a mixed number` : ''}`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Simplified fraction', value: result && formatFraction(result) },
          { term: 'Mixed number', value: result ? mixed || formatFraction(result) : null },
          { term: 'Decimal', value: decimal },
        ]}
      />

      <CalculatorReset
        onReset={() =>
          setInputs({ aNumerator: '', aDenominator: '', bNumerator: '', bDenominator: '' })
        }
      />
    </div>
  )
}
