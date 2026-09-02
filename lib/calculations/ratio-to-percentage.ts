import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface RatioToPercentageResult {
  /** Each part as a share of the whole. The two always add up to 100. */
  percentA: number
  percentB: number
  total: number
  /** A as a percentage of B, which is a different question. `null` when B is zero. */
  aAsPercentOfB: number | null
  first: number
  second: number
}

/**
 * Converts a ratio into percentages.
 *
 * The important distinction is what the percentage is *of*. In a 2 : 3 mix
 * there are five parts, so the first is 40% of the whole — but it is also
 * 66.67% of the second part. Both are useful and they are easy to confuse, so
 * both are returned.
 */
export function calculateRatioToPercentage(
  first: number,
  second: number,
): RatioToPercentageResult {
  const total = first + second

  return {
    percentA: (first / total) * 100,
    percentB: (second / total) * 100,
    total,
    aAsPercentOfB: second === 0 ? null : (first / second) * 100,
    first,
    second,
  }
}

export function evaluateRatioToPercentage(
  rawFirst: string,
  rawSecond: string,
): CalculatorOutcome<RatioToPercentageResult> {
  if (anyBlank(rawFirst, rawSecond)) return { state: 'empty' }

  const parsed = parseNumbers(rawFirst, rawSecond)
  if (!parsed) return invalid('Please enter numbers only.')

  const [first, second] = parsed
  if (first < 0 || second < 0) return invalid('Ratio parts cannot be negative.')
  if (first + second === 0) {
    return invalid('At least one part must be greater than zero.')
  }

  return ok(calculateRatioToPercentage(first, second))
}
