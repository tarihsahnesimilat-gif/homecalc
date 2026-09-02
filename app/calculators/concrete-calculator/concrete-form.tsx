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
import { type ConcreteUnits, evaluateConcrete } from '@/lib/calculations/concrete'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const IMPERIAL_DEFAULTS = { length: '10', width: '10', depth: '4', waste: '10' }
const METRIC_DEFAULTS = { length: '4', width: '3', depth: '10', waste: '10' }

const UNIT_OPTIONS: readonly ToggleOption<ConcreteUnits>[] = [
  { id: 'imperial', label: 'Feet and inches' },
  { id: 'metric', label: 'Metres and cm' },
]

export function ConcreteForm() {
  const [units, setUnits] = useState<ConcreteUnits>('imperial')
  const [inputs, setInputs] = useState({ ...IMPERIAL_DEFAULTS })

  const outcome = useMemo(
    () => evaluateConcrete(units, inputs.length, inputs.width, inputs.depth, inputs.waste),
    [units, inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof IMPERIAL_DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  /** Switching units swaps in sensible defaults rather than reinterpreting the old numbers. */
  function changeUnits(next: ConcreteUnits) {
    setUnits(next)
    setInputs({ ...(next === 'imperial' ? IMPERIAL_DEFAULTS : METRIC_DEFAULTS) })
  }

  const isImperial = units === 'imperial'

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorToggle
        label="Measurement units"
        value={units}
        onChange={changeUnits}
        options={UNIT_OPTIONS}
        bordered
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <NumberInput
          label={isImperial ? 'Length (ft)' : 'Length (m)'}
          min="0"
          value={inputs.length}
          onChange={(value) => update('length', value)}
        />
        <NumberInput
          label={isImperial ? 'Width (ft)' : 'Width (m)'}
          min="0"
          value={inputs.width}
          onChange={(value) => update('width', value)}
        />
        <NumberInput
          label={isImperial ? 'Depth (in)' : 'Depth (cm)'}
          hint={isImperial ? 'A patio slab is often 4 in.' : 'A patio slab is often 10 cm.'}
          min="0"
          value={inputs.depth}
          onChange={(value) => update('depth', value)}
        />
        <NumberInput
          label="Waste allowance (%)"
          hint="5 to 10% is typical. Leave blank for none."
          min="0"
          max="100"
          value={inputs.waste}
          onChange={(value) => update('waste', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Concrete to order, including waste' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.withWasteCubicYards, 2)} yd³`
        }
        hint={
          result
            ? `That is ${formatNumber(result.withWasteCubicMeters, 3)} m³ or ${formatNumber(result.withWasteCubicFeet, 1)} ft³, from a slab of ${formatNumber(result.cubicYards, 2)} yd³ plus ${formatNumber(result.wastePercent)}% waste.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Cubic yards', value: result && formatNumber(result.withWasteCubicYards, 2) },
          { term: 'Cubic metres', value: result && formatNumber(result.withWasteCubicMeters, 3) },
          { term: 'Cubic feet', value: result && formatNumber(result.withWasteCubicFeet, 1) },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ length: '', width: '', depth: '', waste: '' })}
      />
    </div>
  )
}
