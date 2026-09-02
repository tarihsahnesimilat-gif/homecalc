'use client'

import { useMemo, useState } from 'react'
import { Delete } from 'lucide-react'

import {
  CalculatorReset,
  CalculatorResult,
  CalculatorToggle,
  type ToggleOption,
} from '@/components/calculator'
import { type AngleMode, evaluateExpression } from '@/lib/calculations/scientific'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const ANGLE_MODES: readonly ToggleOption<AngleMode>[] = [
  { id: 'degrees', label: 'Degrees' },
  { id: 'radians', label: 'Radians' },
]

/**
 * A key inserts `insert` into the expression while showing `label`.
 *
 * The expression is stored in the canonical form the parser reads (`*`, `pi`,
 * `sqrt(`) and rewritten for display, so what you see uses the familiar
 * symbols without the parser needing to know about them.
 */
interface Key {
  label: string
  insert: string
  /** Emphasised styling for operators and functions. */
  tone?: 'operator' | 'function'
  ariaLabel?: string
}

const KEYS: readonly (readonly Key[])[] = [
  [
    { label: 'sin', insert: 'sin(', tone: 'function' },
    { label: 'cos', insert: 'cos(', tone: 'function' },
    { label: 'tan', insert: 'tan(', tone: 'function' },
    { label: '√', insert: 'sqrt(', tone: 'function', ariaLabel: 'Square root' },
  ],
  [
    { label: 'x²', insert: '^2', tone: 'function', ariaLabel: 'Squared' },
    { label: 'xʸ', insert: '^', tone: 'function', ariaLabel: 'To the power of' },
    { label: '1/x', insert: 'inv(', tone: 'function', ariaLabel: 'Reciprocal' },
    { label: '%', insert: '%', tone: 'function', ariaLabel: 'Percent' },
  ],
  [
    { label: 'π', insert: 'pi', tone: 'function', ariaLabel: 'Pi' },
    { label: 'e', insert: 'e', tone: 'function' },
    { label: '(', insert: '(', tone: 'operator', ariaLabel: 'Open bracket' },
    { label: ')', insert: ')', tone: 'operator', ariaLabel: 'Close bracket' },
  ],
  [
    { label: '7', insert: '7' },
    { label: '8', insert: '8' },
    { label: '9', insert: '9' },
    { label: '÷', insert: '/', tone: 'operator', ariaLabel: 'Divide' },
  ],
  [
    { label: '4', insert: '4' },
    { label: '5', insert: '5' },
    { label: '6', insert: '6' },
    { label: '×', insert: '*', tone: 'operator', ariaLabel: 'Multiply' },
  ],
  [
    { label: '1', insert: '1' },
    { label: '2', insert: '2' },
    { label: '3', insert: '3' },
    { label: '−', insert: '-', tone: 'operator', ariaLabel: 'Minus' },
  ],
  [
    { label: '0', insert: '0' },
    { label: '.', insert: '.', ariaLabel: 'Decimal point' },
    { label: '=', insert: '=', tone: 'operator', ariaLabel: 'Equals' },
    { label: '+', insert: '+', tone: 'operator', ariaLabel: 'Plus' },
  ],
]

/** Rewrites the stored expression into the symbols shown on the keys. */
function toDisplay(expression: string): string {
  return expression
    .replaceAll('sqrt(', '√(')
    .replaceAll('inv(', '1/(')
    .replaceAll('pi', 'π')
    .replaceAll('*', '×')
    .replaceAll('/', '÷')
}

export function ScientificForm() {
  const [mode, setMode] = useState<AngleMode>('degrees')
  const [expression, setExpression] = useState('')

  const outcome = useMemo(() => evaluateExpression(expression, mode), [expression, mode])
  const result = outcomeValue(outcome)

  function press(key: Key) {
    if (key.insert === '=') {
      // Equals folds the answer back in, so it can start the next calculation.
      if (result !== null) setExpression(String(result))
      return
    }
    setExpression((current) => current + key.insert)
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorToggle
        label="Angle mode"
        value={mode}
        onChange={setMode}
        options={ANGLE_MODES}
        bordered
      />

      <div className="mt-6 grid gap-2">
        <label htmlFor="expression" className="text-sm font-semibold text-primary">
          Expression
        </label>
        <input
          id="expression"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g. 2 + 3 × 4"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          className="h-12 rounded-md border border-input bg-background px-3 font-mono text-lg outline-none ring-accent focus:ring-2"
        />
        {expression !== '' && (
          <p className="font-mono text-xs text-muted-foreground">{toDisplay(expression)}</p>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => setExpression('')}
          className="flex-1 rounded-md border border-border py-3 text-sm font-semibold text-primary transition hover:border-accent hover:bg-muted"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => setExpression((current) => current.slice(0, -1))}
          aria-label="Backspace"
          className="flex-1 rounded-md border border-border py-3 text-sm font-semibold text-primary transition hover:border-accent hover:bg-muted"
        >
          <Delete className="mx-auto size-4" />
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        {KEYS.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-2">
            {row.map((key) => (
              <button
                key={key.label}
                type="button"
                onClick={() => press(key)}
                aria-label={key.ariaLabel}
                className={`h-12 rounded-md text-base font-semibold transition ${
                  key.tone === 'operator'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : key.tone === 'function'
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      : 'border border-border bg-background text-primary hover:border-accent hover:bg-muted'
                }`}
              >
                {key.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <CalculatorResult
        className="mt-7"
        label={result !== null ? toDisplay(expression) : 'Your result'}
        value={
          outcome.state === 'invalid'
            ? outcome.message
            : result === null
              ? '—'
              : formatNumber(result, 10)
        }
        isError={outcome.state === 'invalid'}
      />

      <CalculatorReset onReset={() => setExpression('')} label="Clear expression" />
    </div>
  )
}
