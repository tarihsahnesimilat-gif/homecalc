import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

/**
 * `future` grows a sum forward in time. `present` discounts a future sum back
 * to what it is worth today.
 */
export type TimeValueDirection = 'future' | 'present'

export interface FutureValueResult {
  /** The answer: a future value, or a present value, depending on direction. */
  result: number
  /** The figure that was entered. */
  amount: number
  /** Growth when looking forward, or the discount when looking back. */
  difference: number
  /** How much a unit today is worth after the period, or vice versa. */
  factor: number
  rate: number
  years: number
  direction: TimeValueDirection
}

/**
 * The time value of money in both directions.
 *
 * Where the Compound Interest calculator focuses on interest earned at a chosen
 * compounding frequency, this one is about comparing sums across time: what a
 * amount becomes, and — the direction people more often need and rarely have —
 * what a future amount is worth in today's terms.
 *
 * Compounding is annual, which is the convention for discounting.
 */
export function calculateTimeValue(
  amount: number,
  annualRate: number,
  years: number,
  direction: TimeValueDirection,
): FutureValueResult {
  const factor = Math.pow(1 + annualRate / 100, years)
  const result = direction === 'future' ? amount * factor : amount / factor

  return {
    result,
    amount,
    difference: direction === 'future' ? result - amount : amount - result,
    factor,
    rate: annualRate,
    years,
    direction,
  }
}

export function evaluateFutureValue(
  direction: TimeValueDirection,
  rawAmount: string,
  rawRate: string,
  rawYears: string,
): CalculatorOutcome<FutureValueResult> {
  if (anyBlank(rawAmount, rawRate, rawYears)) return { state: 'empty' }

  const parsed = parseNumbers(rawAmount, rawRate, rawYears)
  if (!parsed) return invalid('Please enter numbers only.')

  const [amount, rate, years] = parsed
  if (amount <= 0) return invalid('The amount must be greater than zero.')
  if (rate < 0) return invalid('The rate cannot be negative.')
  if (years <= 0) return invalid('The time period must be greater than zero.')

  return ok(calculateTimeValue(amount, rate, years, direction))
}
