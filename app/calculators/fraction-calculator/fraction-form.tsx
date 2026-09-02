'use client'

import { useId, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { CalculatorResult } from '@/components/calculator/calculator-result'
import { formatNumber } from '@/lib/format'

export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide'

export interface Fraction {
  numerator: number
  denominator: number
}

interface FractionInputs {
  aNumerator: string
  aDenominator: string
  bNumerator: string
  bDenominator: string
}

interface FractionOutcome {
  state: 'empty' | 'invalid' | 'ok'
  message?: string
  result?: Fraction
}

const OPERATIONS: readonly { id: FractionOperation; label: string; symbol: string }[] = [
  { id: 'add', label: 'Add', symbol: '+' },
  { id: 'subtract', label: 'Subtract', symbol: '−' },
  { id: 'multiply', label: 'Multiply', symbol: '×' },
  { id: 'divide', label: 'Divide', symbol: '÷' },
]

const DEFAULTS: FractionInputs = {
  aNumerator: '1',
  aDenominator: '2',
  bNumerator: '1',
  bDenominator: '4',
}

/** Greatest common divisor, Euclid's algorithm on magnitudes. */
export function greatestCommonDivisor(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const remainder = x % y
    x = y
    y = remainder
  }
  return x
}

/** Reduces to lowest terms, keeping the sign on the numerator. */
export function simplifyFraction({ numerator, denominator }: Fraction): Fraction {
  if (numerator === 0) return { numerator: 0, denominator: 1 }

  const sign = denominator < 0 ? -1 : 1
  const divisor = greatestCommonDivisor(numerator, denominator)

  return {
    numerator: (sign * numerator) / divisor,
    denominator: (sign * denominator) / divisor,
  }
}

/**
 * Exact fraction arithmetic on integers — the result never passes through a
 * float, so 1/3 + 1/3 is 2/3 rather than 0.6666666666666666.
 */
export function operateOnFractions(
  operation: FractionOperation,
  a: Fraction,
  b: Fraction,
): Fraction {
  switch (operation) {
    case 'add':
      return simplifyFraction({
        numerator: a.numerator * b.denominator + b.numerator * a.denominator,
        denominator: a.denominator * b.denominator,
      })
    case 'subtract':
      return simplifyFraction({
        numerator: a.numerator * b.denominator - b.numerator * a.denominator,
        denominator: a.denominator * b.denominator,
      })
    case 'multiply':
      return simplifyFraction({
        numerator: a.numerator * b.numerator,
        denominator: a.denominator * b.denominator,
      })
    case 'divide':
      return simplifyFraction({
        numerator: a.numerator * b.denominator,
        denominator: a.denominator * b.numerator,
      })
  }
}

/** "3/4", or just "2" when the denominator reduces to 1. */
export function formatFraction({ numerator, denominator }: Fraction): string {
  return denominator === 1 ? `${numerator}` : `${numerator}/${denominator}`
}

/** "1 1/4" for improper fractions; empty string when there is no whole part. */
export function formatMixedNumber({ numerator, denominator }: Fraction): string {
  if (denominator === 1 || Math.abs(numerator) < denominator) return ''

  const sign = numerator < 0 ? '-' : ''
  const magnitude = Math.abs(numerator)
  const whole = Math.floor(magnitude / denominator)
  const remainder = magnitude % denominator

  return remainder === 0 ? `${sign}${whole}` : `${sign}${whole} ${remainder}/${denominator}`
}

export function evaluateFraction(
  operation: FractionOperation,
  inputs: FractionInputs,
): FractionOutcome {
  const raw = [inputs.aNumerator, inputs.aDenominator, inputs.bNumerator, inputs.bDenominator]
  if (raw.some((value) => value.trim() === '')) return { state: 'empty' }

  const [an, ad, bn, bd] = raw.map(Number)
  if (![an, ad, bn, bd].every((value) => Number.isFinite(value))) {
    return { state: 'invalid', message: 'Please enter numbers only.' }
  }
  if (![an, ad, bn, bd].every((value) => Number.isInteger(value))) {
    return {
      state: 'invalid',
      message: 'Numerators and denominators must be whole numbers.',
    }
  }
  if (ad === 0 || bd === 0) {
    return { state: 'invalid', message: 'A denominator cannot be zero.' }
  }
  if (operation === 'divide' && bn === 0) {
    return { state: 'invalid', message: 'You cannot divide by a fraction equal to zero.' }
  }

  const result = operateOnFractions(operation, { numerator: an, denominator: ad }, { numerator: bn, denominator: bd })

  if (!Number.isSafeInteger(result.numerator) || !Number.isSafeInteger(result.denominator)) {
    return {
      state: 'invalid',
      message: 'Those numbers are too large to work with exactly. Try smaller values.',
    }
  }

  return { state: 'ok', result }
}

export function FractionForm() {
  const [operation, setOperation] = useState<FractionOperation>('add')
  const [inputs, setInputs] = useState<FractionInputs>({ ...DEFAULTS })
  const ids = {
    aNumerator: useId(),
    aDenominator: useId(),
    bNumerator: useId(),
    bDenominator: useId(),
  }

  const outcome = useMemo(() => evaluateFraction(operation, inputs), [operation, inputs])
  const result = outcome.state === 'ok' && outcome.result ? outcome.result : null
  const activeSymbol = OPERATIONS.find((item) => item.id === operation)?.symbol ?? '+'

  const fractionFields: { key: keyof FractionInputs; label: string }[][] = [
    [
      { key: 'aNumerator', label: 'Numerator' },
      { key: 'aDenominator', label: 'Denominator' },
    ],
    [
      { key: 'bNumerator', label: 'Numerator' },
      { key: 'bDenominator', label: 'Denominator' },
    ],
  ]

  const mixed = result ? formatMixedNumber(result) : ''

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div
        role="tablist"
        aria-label="Operation"
        className="flex flex-wrap gap-2 border-b border-border pb-5"
      >
        {OPERATIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={operation === item.id}
            onClick={() => setOperation(item.id)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              operation === item.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-primary'
            }`}
          >
            {item.label} <span aria-hidden="true">{item.symbol}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid items-end gap-5 sm:grid-cols-[1fr_auto_1fr]">
        {fractionFields.map((group, index) => (
          <fieldset key={index === 0 ? 'a' : 'b'} className="grid gap-3">
            <legend className="text-sm font-semibold text-primary">
              {index === 0 ? 'First fraction' : 'Second fraction'}
            </legend>
            {group.map((field) => (
              <div key={field.key} className="grid gap-1.5">
                <label htmlFor={ids[field.key]} className="text-xs font-medium text-muted-foreground">
                  {field.label}
                </label>
                <input
                  id={ids[field.key]}
                  type="number"
                  inputMode="numeric"
                  step="1"
                  value={inputs[field.key]}
                  onChange={(event) => {
                    const next = event.target.value
                    setInputs((current) => ({ ...current, [field.key]: next }))
                  }}
                  className="h-12 rounded-md border border-input bg-background px-3 text-lg outline-none ring-accent focus:ring-2"
                />
              </div>
            ))}
          </fieldset>
        ))}

        {/* Operator sits between the two fraction groups on wide screens. */}
        <div
          aria-hidden="true"
          className="order-first hidden self-center text-2xl font-bold text-accent sm:order-none sm:block"
          style={{ gridColumn: 2, gridRow: 1 }}
        >
          {activeSymbol}
        </div>
      </div>

      <CalculatorResult
        className="mt-7"
        label={result ? 'Result' : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? (outcome.message ?? 'Invalid input')
            : result
              ? formatFraction(result)
              : '—'
        }
        hint={
          result
            ? `${formatNumber(result.numerator / result.denominator, 6)} as a decimal${mixed ? ` · ${mixed} as a mixed number` : ''}`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { term: 'Simplified fraction', value: result && formatFraction(result) },
          { term: 'Mixed number', value: result ? mixed || formatFraction(result) : null },
          {
            term: 'Decimal',
            value: result && formatNumber(result.numerator / result.denominator, 6),
          },
        ].map((item) => (
          <div key={item.term} className="rounded-lg border border-border bg-background p-4">
            <dt className="text-xs font-medium text-muted-foreground">{item.term}</dt>
            <dd className="mt-1 text-xl font-bold text-primary">{item.value ?? '—'}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() =>
          setInputs({ aNumerator: '', aDenominator: '', bNumerator: '', bDenominator: '' })
        }
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="size-4" />
        Reset values
      </button>
    </div>
  )
}
