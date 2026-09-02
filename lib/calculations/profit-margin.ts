import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface MarginResult {
  /** Negative when cost exceeds revenue — a legitimate result, not an error. */
  profit: number
  margin: number
  revenue: number
  cost: number
}

export function calculateProfitMargin(revenue: number, cost: number): MarginResult {
  const profit = revenue - cost

  return { profit, margin: (profit / revenue) * 100, revenue, cost }
}

export function evaluateProfitMargin(
  rawRevenue: string,
  rawCost: string,
): CalculatorOutcome<MarginResult> {
  if (anyBlank(rawRevenue, rawCost)) return { state: 'empty' }

  const parsed = parseNumbers(rawRevenue, rawCost)
  if (!parsed) return invalid('Please enter numbers only.')

  const [revenue, cost] = parsed
  if (revenue <= 0) {
    return invalid('Revenue must be greater than zero — margin is a share of revenue.')
  }
  if (cost < 0) return invalid('Cost cannot be negative.')

  return ok(calculateProfitMargin(revenue, cost))
}
