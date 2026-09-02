/**
 * Shared validation and input-parsing helpers for calculator forms.
 *
 * Every calculator turns raw string inputs into numbers, decides whether the
 * user has finished typing, and reports a problem in plain language. These
 * helpers cover the parts that were identical across all ten calculators; the
 * rules that are specific to one calculator stay in that calculator's form.
 *
 * Deliberately dependency-free so it can be unit tested directly with
 * `node --test`.
 */

/**
 * The three states every calculator result can be in.
 *
 * `empty`   - not enough input yet; show a placeholder, never an error.
 * `invalid` - the input breaks a rule; `message` explains it to the user.
 * `ok`      - `value` holds the calculated result.
 */
export type CalculatorOutcome<T> =
  | { state: 'empty' }
  | { state: 'invalid'; message: string }
  | { state: 'ok'; value: T }

export function empty<T>(): CalculatorOutcome<T> {
  return { state: 'empty' }
}

export function invalid<T>(message: string): CalculatorOutcome<T> {
  return { state: 'invalid', message }
}

export function ok<T>(value: T): CalculatorOutcome<T> {
  return { state: 'ok', value }
}

/** Narrows an outcome to its payload, or `null` for empty and invalid states. */
export function outcomeValue<T>(outcome: CalculatorOutcome<T>): T | null {
  return outcome.state === 'ok' ? outcome.value : null
}

// ---------------------------------------------------------------------------
// Raw input handling
// ---------------------------------------------------------------------------

/** True when a raw input has no content beyond whitespace. */
export function isBlank(raw: string): boolean {
  return raw.trim() === ''
}

/** True when every supplied raw input has content. */
export function allFilled(...raws: string[]): boolean {
  return raws.every((raw) => !isBlank(raw))
}

/** True when any supplied raw input is blank. */
export function anyBlank(...raws: string[]): boolean {
  return raws.some((raw) => isBlank(raw))
}

/**
 * Parses raw inputs into finite numbers.
 *
 * Returns `null` if any value is not a finite number, which callers turn into
 * an `invalid` outcome. A blank string is *not* handled here — check with
 * `anyBlank` first so blank input reads as `empty` rather than an error.
 */
export function parseNumbers(...raws: string[]): number[] | null {
  const values = raws.map(Number)
  return values.every((value) => Number.isFinite(value)) ? values : null
}

// ---------------------------------------------------------------------------
// Numeric predicates
// ---------------------------------------------------------------------------

export function isValidNumber(value: number): boolean {
  return Number.isFinite(value)
}

export function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function isNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

export function isNonZero(value: number): boolean {
  return Number.isFinite(value) && value !== 0
}

/** Within 0-100 inclusive. Use `isNonNegative` for rates that may exceed 100. */
export function isPercentage(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 100
}

export function isInteger(value: number): boolean {
  return Number.isInteger(value)
}

export function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0
}

/** Guards against silent precision loss in exact integer arithmetic. */
export function isSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value)
}
