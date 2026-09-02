'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorReset,
  CalculatorResult,
  NumberInput,
  ResultBreakdown,
} from '@/components/calculator'
import { evaluateGrade } from '@/lib/calculations/grade'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { earned: '45', total: '50' }

export function GradeForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(() => evaluateGrade(inputs.earned, inputs.total), [inputs])
  const result = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput
          label="Points earned"
          hint="The marks awarded."
          min="0"
          value={inputs.earned}
          onChange={(value) => update('earned', value)}
        />
        <NumberInput
          label="Total points"
          hint="What the work was marked out of."
          min="0"
          value={inputs.total}
          onChange={(value) => update('total', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? `Grade: ${result.letter}` : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : `${formatNumber(result.percentage, 2)}%`
        }
        hint={
          result
            ? result.isExtraCredit
              ? 'Above 100% — extra credit has been counted in full.'
              : 'The letter uses the scale published below; check it against your syllabus.'
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Percentage', value: result && `${formatNumber(result.percentage, 2)}%` },
          { term: 'Letter grade', value: result && result.letter },
          {
            term: 'Score',
            value:
              result && `${formatNumber(result.pointsEarned)} / ${formatNumber(result.totalPoints)}`,
          },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ earned: '', total: '' })} />
    </div>
  )
}
