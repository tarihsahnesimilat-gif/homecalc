'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  CalculatorSelect,
  CalculatorToggle,
  NumberInput,
  ResultBreakdown,
  type SelectOption,
  type ToggleOption,
} from '@/components/calculator'
import type { MeasurementSystem } from '@/lib/calculations/bmi'
import type { Sex } from '@/lib/calculations/bmr'
import {
  ACTIVITY_LABEL,
  ACTIVITY_MULTIPLIERS,
  type ActivityLevel,
  evaluateCalories,
} from '@/lib/calculations/calorie'
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

const ACTIVITY_OPTIONS: readonly SelectOption[] = (
  Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]
).map((level) => ({
  value: level,
  label: `${ACTIVITY_LABEL[level]} (×${ACTIVITY_MULTIPLIERS[level]})`,
}))

function isActivityLevel(value: string): value is ActivityLevel {
  return Object.prototype.hasOwnProperty.call(ACTIVITY_MULTIPLIERS, value)
}

export function CalorieForm() {
  const [system, setSystem] = useState<MeasurementSystem>('metric')
  const [sex, setSex] = useState<Sex>('male')
  const [activity, setActivity] = useState<ActivityLevel>('moderately-active')
  const [inputs, setInputs] = useState({ ...METRIC_DEFAULTS })

  const outcome = useMemo(
    () => evaluateCalories({ system, sex, ...inputs }, activity),
    [system, sex, inputs, activity],
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

      <CalculatorSelect
        className="mt-5"
        label="Activity level"
        value={activity}
        onChange={(value) => {
          if (isActivityLevel(value)) setActivity(value)
        }}
        options={ACTIVITY_OPTIONS}
      />

      <CalculatorResult
        className="mt-7"
        label={result ? 'Estimated daily calories' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.dailyCalories, 0)} cal/day`
        }
        hint={
          result
            ? 'An informational estimate. Real energy needs vary between individuals and from day to day.'
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Estimated BMR', value: result && `${formatNumber(result.bmr.bmr, 0)} cal/day` },
          { term: 'Activity multiplier', value: result && `×${formatNumber(result.multiplier)}` },
          {
            term: 'Daily calories',
            value: result && `${formatNumber(result.dailyCalories, 0)} cal/day`,
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
