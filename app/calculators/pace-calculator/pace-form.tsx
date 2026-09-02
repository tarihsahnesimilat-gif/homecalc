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
import { type DistanceUnit, evaluatePace } from '@/lib/calculations/pace'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { distance: '5', hours: '0', minutes: '25', seconds: '0' }

const UNITS: readonly ToggleOption<DistanceUnit>[] = [
  { id: 'km', label: 'Kilometres' },
  { id: 'mi', label: 'Miles' },
]

export function PaceForm() {
  const [unit, setUnit] = useState<DistanceUnit>('km')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluatePace(inputs.distance, inputs.hours, inputs.minutes, inputs.seconds, unit),
    [inputs, unit],
  )
  const result = outcomeValue(outcome)
  const unitLabel = unit === 'km' ? 'km' : 'mile'

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorToggle
        label="Distance unit"
        value={unit}
        onChange={setUnit}
        options={UNITS}
        bordered
      />

      <div className="mt-6">
        <NumberInput
          label={`Distance (${unit})`}
          hint="Decimals are fine — a marathon is 42.195 km."
          min="0"
          value={inputs.distance}
          onChange={(value) => update('distance', value)}
        />
      </div>

      <fieldset className="mt-5 grid gap-5 sm:grid-cols-3">
        <legend className="text-sm font-semibold text-primary">Time taken</legend>
        <NumberInput
          label="Hours"
          labelSize="compact"
          min="0"
          integer
          value={inputs.hours}
          onChange={(value) => update('hours', value)}
        />
        <NumberInput
          label="Minutes"
          labelSize="compact"
          min="0"
          integer
          value={inputs.minutes}
          onChange={(value) => update('minutes', value)}
        />
        <NumberInput
          label="Seconds"
          labelSize="compact"
          min="0"
          integer
          value={inputs.seconds}
          onChange={(value) => update('seconds', value)}
        />
      </fieldset>

      <CalculatorResult
        className="mt-7"
        label={result ? `Pace per ${unitLabel}` : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${result.paceFormatted} / ${unit}`
        }
        hint={
          result
            ? `An average speed of ${formatNumber(result.speed, 2)} ${unit}/h.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: `Pace per ${unitLabel}`, value: result && result.paceFormatted },
          { term: 'Speed', value: result && `${formatNumber(result.speed, 2)} ${unit}/h` },
          {
            term: 'Total time',
            value: result && `${formatNumber(result.totalSeconds)} seconds`,
          },
        ]}
      />

      <CalculatorReset
        onReset={() => setInputs({ distance: '', hours: '', minutes: '', seconds: '' })}
      />
    </div>
  )
}
