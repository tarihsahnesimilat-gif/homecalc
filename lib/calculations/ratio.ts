import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

/** Which side of the ratio the user already knows a real value for. */
export type KnownSide = 'a' | 'b'

/**
 * A simplified ratio. `exact` is true when both terms reduced to whole numbers
 * via the GCD; when false the pair was scaled against the smaller term instead
 * and needs decimal formatting for display.
 */
export interface SimplifiedRatio {
  a: number
  b: number
  exact: boolean
}

export interface RatioSolution {
  knownValue: number
  /** The value calculated for the other side. */
  unknownValue: number
  valueA: number
  valueB: number
  simplified: SimplifiedRatio
}

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
 * containing decimals cannot, so they are scaled against the smaller term
 * instead (2.5 : 5 becomes 1 : 2).
 */
export function simplifyRatio(a: number, b: number): SimplifiedRatio {
  if (Number.isInteger(a) && Number.isInteger(b)) {
    const divisor = greatestCommonDivisor(a, b)
    return { a: a / divisor, b: b / divisor, exact: true }
  }

  const smaller = Math.min(a, b)
  return { a: a / smaller, b: b / smaller, exact: false }
}

export function solveRatio(
  known: KnownSide,
  termA: number,
  termB: number,
  knownValue: number,
): RatioSolution {
  const unknownValue = known === 'a' ? (knownValue * termB) / termA : (knownValue * termA) / termB

  return {
    knownValue,
    unknownValue,
    valueA: known === 'a' ? knownValue : unknownValue,
    valueB: known === 'a' ? unknownValue : knownValue,
    simplified: simplifyRatio(termA, termB),
  }
}

export function evaluateRatio(
  known: KnownSide,
  rawTermA: string,
  rawTermB: string,
  rawKnownValue: string,
): CalculatorOutcome<RatioSolution> {
  if (anyBlank(rawTermA, rawTermB, rawKnownValue)) return { state: 'empty' }

  const parsed = parseNumbers(rawTermA, rawTermB, rawKnownValue)
  if (!parsed) return invalid('Please enter numbers only.')

  const [termA, termB, knownValue] = parsed
  if (termA <= 0 || termB <= 0) {
    return invalid(
      'Both ratio terms must be greater than zero — a ratio with a zero term cannot be scaled.',
    )
  }
  if (knownValue < 0) return invalid('The known value cannot be negative.')

  // Both terms are guaranteed positive above, so neither division is by zero.
  return ok(solveRatio(known, termA, termB, knownValue))
}
