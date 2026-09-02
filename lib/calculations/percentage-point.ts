import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export type PointDirection = 'increase' | 'decrease' | 'none'

export interface PercentagePointResult {
  /** The plain arithmetic gap between the two rates, in percentage points. */
  pointChange: number
  /**
   * The same move as a relative percentage change. `null` when the starting
   * rate is zero, which leaves nothing to be relative to.
   */
  relativeChange: number | null
  direction: PointDirection
  from: number
  to: number
}

/**
 * The difference between two percentages, which is a percentage *point* change
 * rather than a percentage change.
 *
 * A rate moving from 5% to 6% has risen by one percentage point, and by 20%.
 * Both are correct, they are wildly different numbers, and confusing them is
 * one of the most common errors in reporting figures — so this returns both,
 * labelled.
 */
export function calculatePercentagePoints(from: number, to: number): PercentagePointResult {
  const pointChange = to - from

  return {
    pointChange,
    relativeChange: from === 0 ? null : (pointChange / from) * 100,
    direction: pointChange > 0 ? 'increase' : pointChange < 0 ? 'decrease' : 'none',
    from,
    to,
  }
}

export function evaluatePercentagePoints(
  rawFrom: string,
  rawTo: string,
): CalculatorOutcome<PercentagePointResult> {
  if (anyBlank(rawFrom, rawTo)) return { state: 'empty' }

  const parsed = parseNumbers(rawFrom, rawTo)
  if (!parsed) return invalid('Please enter numbers only.')

  return ok(calculatePercentagePoints(parsed[0], parsed[1]))
}
