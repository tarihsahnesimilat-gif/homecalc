import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface MarkupResult {
  sellingPrice: number
  profit: number
  cost: number
  markupPercent: number
  /** The same profit expressed as a share of the selling price. */
  equivalentMarginPercent: number
}

/**
 * Markup is profit as a percentage of **cost** — what you add on to arrive at a
 * price. Margin is the same profit as a percentage of the **selling price**.
 *
 * They are different numbers for the same sale, and conflating them is the
 * classic pricing error, so the equivalent margin is reported alongside.
 */
export function calculateMarkup(cost: number, markupPercent: number): MarkupResult {
  const profit = cost * (markupPercent / 100)
  const sellingPrice = cost + profit

  return {
    sellingPrice,
    profit,
    cost,
    markupPercent,
    equivalentMarginPercent: sellingPrice === 0 ? 0 : (profit / sellingPrice) * 100,
  }
}

export function evaluateMarkup(
  rawCost: string,
  rawMarkupPercent: string,
): CalculatorOutcome<MarkupResult> {
  if (anyBlank(rawCost, rawMarkupPercent)) return { state: 'empty' }

  const parsed = parseNumbers(rawCost, rawMarkupPercent)
  if (!parsed) return invalid('Please enter numbers only.')

  const [cost, markupPercent] = parsed
  if (cost <= 0) return invalid('The cost must be greater than zero.')
  if (markupPercent < 0) {
    return invalid('The markup cannot be negative — that would price below cost.')
  }

  return ok(calculateMarkup(cost, markupPercent))
}
