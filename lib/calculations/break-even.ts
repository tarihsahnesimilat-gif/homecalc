import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface BreakEvenResult {
  /** Units needed to cover fixed costs. Rarely a whole number. */
  units: number
  /** Rounded up, since you cannot sell part of a unit. */
  unitsRoundedUp: number
  revenue: number
  /** What each sale contributes towards fixed costs. */
  contributionMargin: number
  contributionMarginRatio: number
  fixedCosts: number
}

/**
 * Break-even units = fixed costs ÷ (selling price − variable cost per unit).
 *
 * The denominator is the contribution margin: what is left from each sale once
 * that sale's own variable cost is paid, and therefore what is available to
 * chip away at the fixed costs.
 */
export function calculateBreakEven(
  fixedCosts: number,
  variableCost: number,
  sellingPrice: number,
): BreakEvenResult {
  const contributionMargin = sellingPrice - variableCost
  const units = fixedCosts / contributionMargin

  return {
    units,
    unitsRoundedUp: Math.ceil(units),
    revenue: units * sellingPrice,
    contributionMargin,
    contributionMarginRatio: (contributionMargin / sellingPrice) * 100,
    fixedCosts,
  }
}

export function evaluateBreakEven(
  rawFixedCosts: string,
  rawVariableCost: string,
  rawSellingPrice: string,
): CalculatorOutcome<BreakEvenResult> {
  if (anyBlank(rawFixedCosts, rawVariableCost, rawSellingPrice)) return { state: 'empty' }

  const parsed = parseNumbers(rawFixedCosts, rawVariableCost, rawSellingPrice)
  if (!parsed) return invalid('Please enter numbers only.')

  const [fixedCosts, variableCost, sellingPrice] = parsed
  if (fixedCosts < 0) return invalid('Fixed costs cannot be negative.')
  if (variableCost < 0) return invalid('The variable cost cannot be negative.')
  if (sellingPrice <= 0) return invalid('The selling price must be greater than zero.')

  if (sellingPrice === variableCost) {
    return invalid(
      'Each sale covers only its own cost, so the fixed costs are never repaid. Raise the price or cut the variable cost.',
    )
  }
  if (sellingPrice < variableCost) {
    return invalid(
      'Every sale loses money, so there is no break-even point. The selling price must be above the variable cost.',
    )
  }

  return ok(calculateBreakEven(fixedCosts, variableCost, sellingPrice))
}
