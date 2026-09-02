import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface DiscountBreakdown {
  discountAmount: number
  finalPrice: number
  /** Identical to `discountAmount` — kept because users look for both names. */
  saved: number
  discountPercent: number
}

export function calculateDiscount(price: number, discountPercent: number): DiscountBreakdown {
  const discountAmount = price * (discountPercent / 100)

  return {
    discountAmount,
    finalPrice: price - discountAmount,
    saved: discountAmount,
    discountPercent,
  }
}

export function evaluateDiscount(
  rawPrice: string,
  rawDiscountPercent: string,
): CalculatorOutcome<DiscountBreakdown> {
  if (anyBlank(rawPrice, rawDiscountPercent)) return { state: 'empty' }

  const parsed = parseNumbers(rawPrice, rawDiscountPercent)
  if (!parsed) return invalid('Please enter numbers only.')

  const [price, discountPercent] = parsed
  if (price < 0) return invalid('The original price cannot be negative.')
  if (discountPercent < 0) return invalid('The discount percentage cannot be negative.')
  if (discountPercent > 100) {
    return invalid(
      'A discount cannot be more than 100% — that would mean being paid to take the item.',
    )
  }

  return ok(calculateDiscount(price, discountPercent))
}
