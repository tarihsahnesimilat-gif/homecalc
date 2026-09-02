import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export type ChangeDirection = 'increase' | 'decrease' | 'none'

export interface ChangeResult {
  /** Signed percentage: negative for a decrease. */
  percentChange: number
  /** Signed absolute difference between the two values. */
  difference: number
  direction: ChangeDirection
}

export function calculatePercentageChange(original: number, updated: number): ChangeResult {
  const difference = updated - original

  return {
    percentChange: (difference / original) * 100,
    difference,
    direction: difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'none',
  }
}

export function evaluatePercentageChange(
  rawOriginal: string,
  rawUpdated: string,
): CalculatorOutcome<ChangeResult> {
  if (anyBlank(rawOriginal, rawUpdated)) return { state: 'empty' }

  const parsed = parseNumbers(rawOriginal, rawUpdated)
  if (!parsed) return invalid('Please enter numbers only.')

  const [original, updated] = parsed
  if (original === 0) {
    return invalid(
      'The original value cannot be zero — percentage change needs a non-zero baseline to divide by.',
    )
  }

  return ok(calculatePercentageChange(original, updated))
}
