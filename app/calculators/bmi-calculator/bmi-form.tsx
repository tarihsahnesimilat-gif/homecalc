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
  BMI_CATEGORY_LABEL,
  type MeasurementSystem,
  evaluateBmi,
} from '@/lib/calculations/bmi'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const METRIC_DEFAULTS = { weight: '70', heightCm: '175', heightFeet: '', heightInches: '' }
const IMPERIAL_DEFAULTS = { weight: '154', heightCm: '', heightFeet: '5', heightInches: '9' }

export const SYSTEMS: readonly ToggleOption<MeasurementSystem>[] = [
  { id: 'metric', label: 'Metric' },
  { id: 'imperial', label: 'Imperial' },
]

export function BmiForm() {
  const [system, setSystem] = useState<MeasurementSystem>('metric')
  const [inputs, setInputs] = useState({ ...METRIC_DEFAULTS })

  const outcome = useMemo(() => evaluateBmi({ system, ...inputs }), [system, inputs])
  const result = outcomeValue(outcome)

  function update(key: keyof typeof METRIC_DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  /** Switching units swaps in that system's defaults rather than stale numbers. */
  function changeSystem(next: MeasurementSystem) {
    setSystem(next)
    setInputs({ ...(next === 'metric' ? METRIC_DEFAULTS : IMPERIAL_DEFAULTS) })
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorToggle
        label="Measurement system"
        value={system}
        onChange={changeSystem}
        options={SYSTEMS}
        bordered
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <NumberInput
          label={system === 'metric' ? 'Weight (kg)' : 'Weight (lb)'}
          min="0"
          value={inputs.weight}
          onChange={(value) => update('weight', value)}
        />

        {system === 'metric' ? (
          <NumberInput
            label="Height (cm)"
            min="0"
            value={inputs.heightCm}
            onChange={(value) => update('heightCm', value)}
          />
        ) : (
          <>
            <NumberInput
              label="Height (ft)"
              min="0"
              integer
              value={inputs.heightFeet}
              onChange={(value) => update('heightFeet', value)}
            />
            <NumberInput
              label="Height (in)"
              hint="Optional."
              min="0"
              max="11"
              value={inputs.heightInches}
              onChange={(value) => update('heightInches', value)}
            />
          </>
        )}
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? BMI_CATEGORY_LABEL[result.category] : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatNumber(result.bmi, 1)
        }
        hint={
          result
            ? 'BMI is a screening measure, not a diagnosis. It cannot tell muscle from fat.'
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        columns={2}
        items={[
          { term: 'BMI', value: result && formatNumber(result.bmi, 1) },
          { term: 'Category', value: result && BMI_CATEGORY_LABEL[result.category] },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ weight: '', heightCm: '', heightFeet: '', heightInches: '' })}
      />
    </div>
  )
}
