import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export type BetterOption = 'a' | 'b' | 'equal'

export interface PricePerUnitResult {
  unitPriceA: number
  unitPriceB: number
  better: BetterOption
  /** How much cheaper the better option is, per unit, as a percentage. */
  savingPercent: number
  /** The per-unit gap in money terms. */
  savingPerUnit: number
}

/**
 * Compares two package sizes by price per unit.
 *
 * Shelf pricing makes this deliberately hard: a bigger box is not always
 * better value, and the units on the label are often inconsistent between
 * brands. Reducing both to a price per single unit is the only reliable
 * comparison — provided both quantities are expressed in the same unit, which
 * is the user's job.
 */
export function calculatePricePerUnit(
  priceA: number,
  quantityA: number,
  priceB: number,
  quantityB: number,
): PricePerUnitResult {
  const unitPriceA = priceA / quantityA
  const unitPriceB = priceB / quantityB

  const cheaper = Math.min(unitPriceA, unitPriceB)
  const dearer = Math.max(unitPriceA, unitPriceB)

  return {
    unitPriceA,
    unitPriceB,
    better: unitPriceA === unitPriceB ? 'equal' : unitPriceA < unitPriceB ? 'a' : 'b',
    savingPercent: dearer === 0 ? 0 : ((dearer - cheaper) / dearer) * 100,
    savingPerUnit: dearer - cheaper,
  }
}

export function evaluatePricePerUnit(
  rawPriceA: string,
  rawQuantityA: string,
  rawPriceB: string,
  rawQuantityB: string,
): CalculatorOutcome<PricePerUnitResult> {
  if (anyBlank(rawPriceA, rawQuantityA, rawPriceB, rawQuantityB)) return { state: 'empty' }

  const parsed = parseNumbers(rawPriceA, rawQuantityA, rawPriceB, rawQuantityB)
  if (!parsed) return invalid('Please enter numbers only.')

  const [priceA, quantityA, priceB, quantityB] = parsed
  if (priceA < 0 || priceB < 0) return invalid('Prices cannot be negative.')
  if (quantityA <= 0 || quantityB <= 0) {
    return invalid('Both quantities must be greater than zero.')
  }

  return ok(calculatePricePerUnit(priceA, quantityA, priceB, quantityB))
}
