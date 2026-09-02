'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateCalorieDeficit } from '@/lib/calculations/calorie-deficit'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { maintenance: '2500', deficit: '500' }

export function CalorieDeficitForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateCalorieDeficit(inputs.maintenance, inputs.deficit),
    [inputs],
  )
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput
          label="Maintenance calories"
          hint="What you use in a typical day."
          min="0"
          value={inputs.maintenance}
          onChange={(value) => update('maintenance', value)}
        />
        <NumberInput
          label="Daily deficit"
          hint="How much less you plan to eat each day."
          min="0"
          value={inputs.deficit}
          onChange={(value) => update('deficit', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Daily calorie target' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.targetIntake, 0)} cal/day`
        }
        hint={
          result
            ? `A weekly deficit of ${formatNumber(result.weeklyDeficit, 0)} calories projects to about ${formatNumber(result.weeklyLossKg, 2)} kg (${formatNumber(result.weeklyLossLb, 2)} lb) a week. An estimate on rule-of-thumb constants, not a plan.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      {result?.isVeryLowIntake && (
        <p className="mt-4 rounded-md border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
          That target is below roughly 1,200 calories a day, a level generally considered low
          enough to warrant professional supervision. This calculator makes no recommendation
          either way — it is worth discussing with a qualified healthcare professional.
        </p>
      )}

      <ResultBreakdown
        items={[
          {
            term: 'Daily target',
            value: result && `${formatNumber(result.targetIntake, 0)} cal`,
          },
          {
            term: 'Weekly deficit',
            value: result && `${formatNumber(result.weeklyDeficit, 0)} cal`,
          },
          {
            term: 'Projected weekly change',
            value:
              result &&
              `${formatNumber(result.weeklyLossKg, 2)} kg / ${formatNumber(result.weeklyLossLb, 2)} lb`,
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ maintenance: '', deficit: '' })} />
    </div>
  )
}
