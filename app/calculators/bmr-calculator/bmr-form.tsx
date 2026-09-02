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
import type { MeasurementSystem } from '@/lib/calculations/bmi'
import { type Sex, evaluateBmr } from '@/lib/calculations/bmr'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const METRIC_DEFAULTS = {
  age: '30',
  weight: '80',
  heightCm: '180',
  heightFeet: '',
  heightInches: '',
}
const IMPERIAL_DEFAULTS = {
  age: '30',
  weight: '176',
  heightCm: '',
  heightFeet: '5',
  heightInches: '11',
}

const SYSTEMS: readonly ToggleOption<MeasurementSystem>[] = [
  { id: 'metric', label: 'Metric' },
  { id: 'imperial', label: 'Imperial' },
]

const SEXES: readonly ToggleOption<Sex>[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
]

export function BmrForm() {
  const [system, setSystem] = useState<MeasurementSystem>('metric')
  const [sex, setSex] = useState<Sex>('male')
  const [inputs, setInputs] = useState({ ...METRIC_DEFAULTS })

  const outcome = useMemo(
    () => evaluateBmr({ system, sex, ...inputs }),
    [system, sex, inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof METRIC_DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

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

      <fieldset className="mt-6 grid gap-2">
        <legend className="text-sm font-semibold text-primary">Sex</legend>
        <CalculatorToggle label="Sex" value={sex} onChange={setSex} options={SEXES} />
      </fieldset>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <NumberInput
          label="Age (years)"
          min="0"
          value={inputs.age}
          onChange={(value) => update('age', value)}
        />
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
        label={result ? 'Estimated BMR' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.bmr, 0)} cal/day`
        }
        hint={
          result
            ? 'An estimate of energy used at complete rest, from the Mifflin-St Jeor equation. Individual metabolism varies.'
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        columns={2}
        items={[
          { term: 'Estimated BMR', value: result && `${formatNumber(result.bmr, 0)} cal/day` },
          {
            term: 'Used in calculation',
            value:
              result &&
              `${formatNumber(result.kilograms, 1)} kg · ${formatNumber(result.centimeters, 1)} cm`,
          },
        ]}
      />

      <CalculatorReset
        onReset={() =>
          setInputs({ age: '', weight: '', heightCm: '', heightFeet: '', heightInches: '' })
        }
      />
    </div>
  )
}
