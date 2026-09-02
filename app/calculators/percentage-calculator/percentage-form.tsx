'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  CalculatorToggle,
  NumberInput,
  type ToggleOption,
} from '@/components/calculator'
import { type PercentageMode, evaluatePercentage } from '@/lib/calculations/percentage'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

interface ModeConfig extends ToggleOption<PercentageMode> {
  /** Field labels, in the same order the formula consumes them. */
  fields: [string, string]
  helper: string
}

const modes: readonly ModeConfig[] = [
  {
    id: 'of',
    label: 'What is X% of Y?',
    fields: ['Percentage', 'Number'],
    helper: 'Find a percentage of a number.',
  },
  {
    id: 'what',
    label: 'X is what % of Y?',
    fields: ['First number', 'Second number'],
    helper: 'Find what percentage one number is of another.',
  },
  {
    id: 'change',
    label: 'Percentage change',
    fields: ['Original value', 'New value'],
    helper: 'Calculate the percentage change between two values.',
  },
  {
    id: 'increase',
    label: 'Increase by X%',
    fields: ['Original value', 'Increase percentage'],
    helper: 'Add a percentage to a number.',
  },
  {
    id: 'decrease',
    label: 'Decrease by X%',
    fields: ['Original value', 'Decrease percentage'],
    helper: 'Subtract a percentage from a number.',
  },
]

/** Describes what was calculated, in the same wording for every mode. */
function describe(mode: PercentageMode, a: number, b: number): string {
  switch (mode) {
    case 'of':
      return `${formatNumber(a)}% of ${formatNumber(b)}`
    case 'what':
      return `${formatNumber(a)} is what % of ${formatNumber(b)}`
    case 'change':
      return `Change from ${formatNumber(a)} to ${formatNumber(b)}`
    case 'increase':
      return `${formatNumber(a)} increased by ${formatNumber(b)}%`
    case 'decrease':
      return `${formatNumber(a)} decreased by ${formatNumber(b)}%`
  }
}

export function PercentageForm() {
  const [mode, setMode] = useState<PercentageMode>('of')
  const [values, setValues] = useState<[string, string]>(['15', '240'])

  const active = modes.find((item) => item.id === mode) ?? modes[0]
  const outcome = useMemo(() => evaluatePercentage(mode, values[0], values[1]), [mode, values])
  const result = outcomeValue(outcome)

  const displayValue =
    outcome.state === 'invalid'
      ? outcome.message
      : result === null
        ? '—'
        : result.value === null
          ? 'Cannot divide by zero'
          : `${formatNumber(result.value)}${result.isPercent ? '%' : ''}`

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorToggle
        label="Calculation mode"
        value={mode}
        onChange={setMode}
        options={modes}
        bordered
      />

      <p className="mt-6 text-sm text-muted-foreground">{active.helper}</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {active.fields.map((fieldLabel, index) => (
          <NumberInput
            key={`${mode}-${fieldLabel}`}
            label={fieldLabel}
            value={values[index]}
            onChange={(next) =>
              setValues((current) => (index === 0 ? [next, current[1]] : [current[0], next]))
            }
          />
        ))}
      </div>

      <CalculatorResult
        className="mt-7"
        label={
          result === null ? 'Your result' : describe(mode, Number(values[0]), Number(values[1]))
        }
        value={displayValue}
        hint={result?.error}
        isError={outcome.state === 'invalid' || result?.value === null}
      />

      <CalculatorReset onReset={() => setValues(['', ''])} />
    </div>
  )
}
