import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface GcfLcmResult {
  /** Greatest common factor, also called the greatest common divisor. */
  gcf: number
  /** Least common multiple. */
  lcm: number
  first: number
  second: number
}

/** Euclid's algorithm. Inputs are validated as positive integers first. */
export function greatestCommonFactor(a: number, b: number): number {
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
 * Divides before multiplying, which keeps the intermediate value small enough
 * to stay exact for far larger inputs than `a * b` would allow.
 */
export function leastCommonMultiple(a: number, b: number): number {
  return (a / greatestCommonFactor(a, b)) * b
}

export function calculateGcfLcm(first: number, second: number): GcfLcmResult {
  return {
    gcf: greatestCommonFactor(first, second),
    lcm: leastCommonMultiple(first, second),
    first,
    second,
  }
}

export function evaluateGcfLcm(
  rawFirst: string,
  rawSecond: string,
): CalculatorOutcome<GcfLcmResult> {
  if (anyBlank(rawFirst, rawSecond)) return { state: 'empty' }

  const parsed = parseNumbers(rawFirst, rawSecond)
  if (!parsed) return invalid('Please enter numbers only.')

  const [first, second] = parsed
  if (!Number.isInteger(first) || !Number.isInteger(second)) {
    return invalid('Both values must be whole numbers.')
  }
  if (first <= 0 || second <= 0) {
    return invalid('Both values must be greater than zero.')
  }

  const result = calculateGcfLcm(first, second)
  if (!Number.isSafeInteger(result.lcm)) {
    return invalid('Those numbers are too large to work with exactly. Try smaller values.')
  }

  return ok(result)
}
