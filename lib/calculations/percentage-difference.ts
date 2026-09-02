import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface PercentageDifferenceResult {
  percentDifference: number
  absoluteDifference: number
  average: number
  first: number
  second: number
}

/**
 * Percentage difference = |a − b| ÷ ((a + b) ÷ 2) × 100.
 *
 * Unlike percentage *change*, this has no baseline — neither value is treated
 * as the starting point — so it divides by the average of the two and is the
 * same whichever order they are given in.
 *
 * The average is taken in magnitude so a pair of negatives behaves sensibly.
 */
export function calculatePercentageDifference(
  first: number,
  second: number,
): PercentageDifferenceResult {
  const absoluteDifference = Math.abs(first - second)
  const average = (first + second) / 2

  return {
    percentDifference: (absoluteDifference / Math.abs(average)) * 100,
    absoluteDifference,
    average,
    first,
    second,
  }
}

export function evaluatePercentageDifference(
  rawFirst: string,
  rawSecond: string,
): CalculatorOutcome<PercentageDifferenceResult> {
  if (anyBlank(rawFirst, rawSecond)) return { state: 'empty' }

  const parsed = parseNumbers(rawFirst, rawSecond)
  if (!parsed) return invalid('Please enter numbers only.')

  const [first, second] = parsed
  if (first + second === 0) {
    return invalid(
      'These two values average zero, so there is nothing to compare against — percentage difference needs a non-zero average.',
    )
  }

  return ok(calculatePercentageDifference(first, second))
}
