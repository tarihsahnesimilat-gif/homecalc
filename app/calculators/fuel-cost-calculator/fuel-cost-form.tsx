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
import { type EfficiencyMode, evaluateFuelCost } from '@/lib/calculations/fuel-cost'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount, formatNumber } from '@/lib/format'

const DEFAULTS = { distance: '300', efficiency: '30', fuelPrice: '4' }

const MODES: readonly ToggleOption<EfficiencyMode>[] = [
  { id: 'distance-per-unit', label: 'Distance per unit (mpg, km/L)' },
  { id: 'units-per-hundred', label: 'Fuel per 100 distance (L/100km)' },
]

export function FuelCostForm() {
  const [mode, setMode] = useState<EfficiencyMode>('distance-per-unit')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateFuelCost(mode, inputs.distance, inputs.efficiency, inputs.fuelPrice),
    [mode, inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold text-primary">How is your efficiency quoted?</legend>
        <CalculatorToggle
          label="Efficiency convention"
          value={mode}
          onChange={setMode}
          options={MODES}
        />
      </fieldset>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <NumberInput
          label="Distance"
          hint="Miles or kilometres — match your efficiency."
          min="0"
          value={inputs.distance}
          onChange={(value) => update('distance', value)}
        />
        <NumberInput
          label={mode === 'distance-per-unit' ? 'Efficiency (per unit)' : 'Fuel per 100 distance'}
          hint={mode === 'distance-per-unit' ? 'Higher is better.' : 'Lower is better.'}
          min="0"
          value={inputs.efficiency}
          onChange={(value) => update('efficiency', value)}
        />
        <AmountInput
          label="Fuel price per unit"
          hint="Per gallon or per litre."
          value={inputs.fuelPrice}
          onChange={(value) => update('fuelPrice', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Estimated trip cost' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatAmount(result.totalCost)
        }
        hint={
          result
            ? `${formatNumber(result.fuelUsed, 3)} units of fuel for ${formatNumber(result.distance)} distance. Real consumption is usually a little higher than a quoted figure.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Fuel used', value: result && formatNumber(result.fuelUsed, 3) },
          { term: 'Trip cost', value: result && formatAmount(result.totalCost) },
          {
            term: 'Cost per distance unit',
            value: result && formatAmount(result.costPerDistanceUnit),
          },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ distance: '', efficiency: '', fuelPrice: '' })}
      />
    </div>
  )
}
