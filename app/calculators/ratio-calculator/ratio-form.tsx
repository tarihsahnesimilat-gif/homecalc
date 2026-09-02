'use client'

import { useId, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { CalculatorResult } from '@/components/calculator/calculator-result'
import { formatNumber } from '@/lib/format'

/** Which side of the ratio the user already knows a real value for. */
export type KnownSide = 'a' | 'b'

interface RatioInputs {
  termA: string
  termB: string
  knownValue: string
}

interface RatioSolution {
  /** The value the user supplied, on their chosen side. */
  knownValue: number
  /** The value calculated for the other side. */
  unknownValue: number
  valueA: number
  valueB: number
  simplified: string
}

interface RatioOutcome {
  state: 'empty' | 'invalid' | 'ok'
  message?: string
  solution?: RatioSolution
}

const DEFAULTS: RatioInputs = { termA: '2', termB: '3', knownValue: '10' }

function greatestCommonDivisor(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const remainder = x % y
    x = y
    y = remainder
  }
  return x
}

/**
 * Whole-number ratios reduce with the GCD (12 : 18 becomes 2 : 3). Ratios
 * containing decimals cannot, so they are shown scaled against the smaller
 * term instead (2.5 : 5 becomes 1 : 2).
 */
export function simplifyRatio(a: number, b: number): string {
  if (a <= 0 || b <= 0) return '—'

  if (Number.isInteger(a) && Number.isInteger(b)) {
    const divisor = greatestCommonDivisor(a, b)
    return `${a / divisor} : ${b / divisor}`
  }

  const smaller = Math.min(a, b)
  return `${formatNumber(a / smaller, 4)} : ${formatNumber(b / smaller, 4)}`
}

export function evaluateRatio(known: KnownSide, inputs: RatioInputs): RatioOutcome {
  const { termA, termB, knownValue } = inputs
  if (termA.trim() === '' || termB.trim() === '' || knownValue.trim() === '') {
    return { state: 'empty' }
  }

  const a = Number(termA)
  const b = Number(termB)
  const value = Number(knownValue)

  if (![a, b, value].every((entry) => Number.isFinite(entry))) {
    return { state: 'invalid', message: 'Please enter numbers only.' }
  }
  if (a <= 0 || b <= 0) {
    return {
      state: 'invalid',
      message: 'Both ratio terms must be greater than zero — a ratio with a zero term cannot be scaled.',
    }
  }
  if (value < 0) {
    return { state: 'invalid', message: 'The known value cannot be negative.' }
  }

  // Both terms are guaranteed positive above, so neither division can be by zero.
  const unknownValue = known === 'a' ? (value * b) / a : (value * a) / b

  return {
    state: 'ok',
    solution: {
      knownValue: value,
      unknownValue,
      valueA: known === 'a' ? value : unknownValue,
      valueB: known === 'a' ? unknownValue : value,
      simplified: simplifyRatio(a, b),
    },
  }
}

export function RatioForm() {
  const [known, setKnown] = useState<KnownSide>('a')
  const [inputs, setInputs] = useState<RatioInputs>({ ...DEFAULTS })
  const termAId = useId()
  const termBId = useId()
  const knownValueId = useId()

  const outcome = useMemo(() => evaluateRatio(known, inputs), [known, inputs])
  const solution = outcome.state === 'ok' && outcome.solution ? outcome.solution : null

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-primary">Your ratio</legend>
        <div className="flex items-end gap-3">
          <div className="grid flex-1 gap-1.5">
            <label htmlFor={termAId} className="text-xs font-medium text-muted-foreground">
              Term A
            </label>
            <input
              id={termAId}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={inputs.termA}
              onChange={(event) => {
                const next = event.target.value
                setInputs((current) => ({ ...current, termA: next }))
              }}
              className="h-12 w-full rounded-md border border-input bg-background px-3 text-lg outline-none ring-accent focus:ring-2"
            />
          </div>
          <span aria-hidden="true" className="pb-3 text-2xl font-bold text-accent">
            :
          </span>
          <div className="grid flex-1 gap-1.5">
            <label htmlFor={termBId} className="text-xs font-medium text-muted-foreground">
              Term B
            </label>
            <input
              id={termBId}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={inputs.termB}
              onChange={(event) => {
                const next = event.target.value
                setInputs((current) => ({ ...current, termB: next }))
              }}
              className="h-12 w-full rounded-md border border-input bg-background px-3 text-lg outline-none ring-accent focus:ring-2"
            />
          </div>
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <fieldset className="grid gap-2">
          <legend className="text-sm font-semibold text-primary">Which side do you know?</legend>
          <div role="tablist" aria-label="Known side" className="flex gap-2">
            {(
              [
                { id: 'a', label: 'I know A' },
                { id: 'b', label: 'I know B' },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={known === option.id}
                onClick={() => setKnown(option.id)}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  known === option.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-primary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-2">
          <label htmlFor={knownValueId} className="text-sm font-semibold text-primary">
            Known value for {known === 'a' ? 'A' : 'B'}
          </label>
          <input
            id={knownValueId}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={inputs.knownValue}
            onChange={(event) => {
              const next = event.target.value
              setInputs((current) => ({ ...current, knownValue: next }))
            }}
            className="h-12 rounded-md border border-input bg-background px-3 text-lg outline-none ring-accent focus:ring-2"
          />
        </div>
      </div>

      <CalculatorResult
        className="mt-7"
        label={solution ? `${known === 'a' ? 'B' : 'A'} works out to` : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? (outcome.message ?? 'Invalid input')
            : solution
              ? formatNumber(solution.unknownValue)
              : '—'
        }
        hint={
          solution
            ? `The full pair is ${formatNumber(solution.valueA)} : ${formatNumber(solution.valueB)}.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { term: 'Value of A', value: solution && formatNumber(solution.valueA) },
          { term: 'Value of B', value: solution && formatNumber(solution.valueB) },
          { term: 'Simplified ratio', value: solution && solution.simplified },
        ].map((item) => (
          <div key={item.term} className="rounded-lg border border-border bg-background p-4">
            <dt className="text-xs font-medium text-muted-foreground">{item.term}</dt>
            <dd className="mt-1 text-xl font-bold text-primary">{item.value ?? '—'}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => setInputs({ termA: '', termB: '', knownValue: '' })}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="size-4" />
        Reset values
      </button>
    </div>
  )
}
