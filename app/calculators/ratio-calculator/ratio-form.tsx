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
  type KnownSide,
  type SimplifiedRatio,
  evaluateRatio,
} from '@/lib/calculations/ratio'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const DEFAULTS = { termA: '2', termB: '3', knownValue: '10' }

const KNOWN_SIDES: readonly ToggleOption<KnownSide>[] = [
  { id: 'a', label: 'I know A' },
  { id: 'b', label: 'I know B' },
]

/** Exact ratios print as whole numbers; scaled ones need decimal formatting. */
function formatSimplified({ a, b, exact }: SimplifiedRatio): string {
  return exact ? `${a} : ${b}` : `${formatNumber(a, 4)} : ${formatNumber(b, 4)}`
}

export function RatioForm() {
  const [known, setKnown] = useState<KnownSide>('a')
  const [inputs, setInputs] = useState({ ...DEFAULTS })

  const outcome = useMemo(
    () => evaluateRatio(known, inputs.termA, inputs.termB, inputs.knownValue),
    [known, inputs],
  )
  const solution = outcomeValue(outcome)

  function update(key: keyof typeof DEFAULTS, value: string) {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-primary">Your ratio</legend>
        <div className="flex items-end gap-3">
          <NumberInput
            className="flex-1"
            label="Term A"
            labelSize="compact"
            min="0"
            value={inputs.termA}
            onChange={(value) => update('termA', value)}
          />
          <span aria-hidden="true" className="pb-3 text-2xl font-bold text-accent">
            :
          </span>
          <NumberInput
            className="flex-1"
            label="Term B"
            labelSize="compact"
            min="0"
            value={inputs.termB}
            onChange={(value) => update('termB', value)}
          />
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <fieldset className="grid gap-2">
          <legend className="text-sm font-semibold text-primary">Which side do you know?</legend>
          <CalculatorToggle
            label="Known side"
            value={known}
            onChange={setKnown}
            options={KNOWN_SIDES}
          />
        </fieldset>

        <NumberInput
          label={`Known value for ${known === 'a' ? 'A' : 'B'}`}
          min="0"
          value={inputs.knownValue}
          onChange={(value) => update('knownValue', value)}
        />
      </div>

      <CalculatorResult
        className="mt-7"
        label={solution ? `${known === 'a' ? 'B' : 'A'} works out to` : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : solution === null
              ? '—'
              : formatNumber(solution.unknownValue)
        }
        hint={
          solution
            ? `The full pair is ${formatNumber(solution.valueA)} : ${formatNumber(solution.valueB)}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <ResultBreakdown
        items={[
          { term: 'Value of A', value: solution && formatNumber(solution.valueA) },
          { term: 'Value of B', value: solution && formatNumber(solution.valueB) },
          { term: 'Simplified ratio', value: solution && formatSimplified(solution.simplified) },
        ]}
      />

      <CalculatorReset onReset={() => setInputs({ termA: '', termB: '', knownValue: '' })} />
    </div>
  )
}
