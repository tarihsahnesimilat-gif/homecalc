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
import { type AreaShape, type AreaUnits, evaluateArea } from '@/lib/calculations/area'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const SHAPES: readonly ToggleOption<AreaShape>[] = [
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
  { id: 'triangle', label: 'Triangle' },
]

const UNITS: readonly ToggleOption<AreaUnits>[] = [
  { id: 'metric', label: 'Metres' },
  { id: 'imperial', label: 'Feet' },
]

/** Field labels change with the shape, since the dimensions mean different things. */
const FIELD_LABELS: Readonly<Record<AreaShape, { first: string; second: string | null }>> = {
  rectangle: { first: 'Length', second: 'Width' },
  circle: { first: 'Radius', second: null },
  triangle: { first: 'Base', second: 'Height' },
}

export function AreaForm() {
  const [shape, setShape] = useState<AreaShape>('rectangle')
  const [units, setUnits] = useState<AreaUnits>('metric')
  const [inputs, setInputs] = useState({ first: '5', second: '4' })

  const outcome = useMemo(
    () => evaluateArea(shape, units, inputs.first, inputs.second),
    [shape, units, inputs],
  )
  const result = outcomeValue(outcome)

  const unitLabel = units === 'metric' ? 'm' : 'ft'
  const labels = FIELD_LABELS[shape]

  function update(key: 'first' | 'second', value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorToggle
        label="Shape"
        value={shape}
        onChange={setShape}
        options={SHAPES}
        bordered
      />

      <fieldset className="mt-6 grid gap-2">
        <legend className="text-sm font-semibold text-primary">Units</legend>
        <CalculatorToggle label="Units" value={units} onChange={setUnits} options={UNITS} />
      </fieldset>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberInput
          label={`${labels.first} (${unitLabel})`}
          hint={shape === 'circle' ? 'Half the width across.' : undefined}
          min="0"
          value={inputs.first}
          onChange={(value) => update('first', value)}
        />
        {labels.second && (
          <NumberInput
            label={`${labels.second} (${unitLabel})`}
            hint={shape === 'triangle' ? 'Perpendicular to the base.' : undefined}
            min="0"
            value={inputs.second}
            onChange={(value) => update('second', value)}
          />
        )}
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Area' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : units === 'metric'
                ? `${formatNumber(result.squareMeters, 2)} m²`
                : `${formatNumber(result.squareFeet, 2)} ft²`
        }
        hint={
          result
            ? `${formatNumber(result.squareMeters, 2)} m², ${formatNumber(result.squareFeet, 2)} ft², ${formatNumber(result.squareYards, 2)} yd². Add a margin for cuts and waste before ordering.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Square metres', value: result && formatNumber(result.squareMeters, 3) },
          { term: 'Square feet', value: result && formatNumber(result.squareFeet, 2) },
          { term: 'Square yards', value: result && formatNumber(result.squareYards, 2) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ first: '', second: '' })} />
    </div>
  )
}
