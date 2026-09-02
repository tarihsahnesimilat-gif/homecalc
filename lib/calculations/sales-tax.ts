import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

/**
 * `add` starts from a pre-tax price and adds tax on top.
 * `extract` starts from a price that already includes tax and works backwards.
 */
export type SalesTaxMode = 'add' | 'extract'

export interface SalesTaxResult {
  preTaxPrice: number
  taxAmount: number
  finalPrice: number
  taxRate: number
}

export function calculateSalesTax(
  mode: SalesTaxMode,
  price: number,
  taxRate: number,
): SalesTaxResult {
  if (mode === 'add') {
    const taxAmount = price * (taxRate / 100)
    return { preTaxPrice: price, taxAmount, finalPrice: price + taxAmount, taxRate }
  }

  // Working backwards: the entered price represents 100% plus the rate, so
  // dividing by that factor recovers the original pre-tax price.
  const preTaxPrice = price / (1 + taxRate / 100)

  return { preTaxPrice, taxAmount: price - preTaxPrice, finalPrice: price, taxRate }
}

export function evaluateSalesTax(
  mode: SalesTaxMode,
  rawPrice: string,
  rawTaxRate: string,
): CalculatorOutcome<SalesTaxResult> {
  if (anyBlank(rawPrice, rawTaxRate)) return { state: 'empty' }

  const parsed = parseNumbers(rawPrice, rawTaxRate)
  if (!parsed) return invalid('Please enter numbers only.')

  const [price, taxRate] = parsed
  if (price < 0) return invalid('The price cannot be negative.')
  if (taxRate < 0) return invalid('The tax rate cannot be negative.')

  return ok(calculateSalesTax(mode, price, taxRate))
}
