import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface CommissionResult {
  commission: number
  /** What the seller keeps when commission comes out of the sale. */
  netAmount: number
  /** What the buyer pays when commission is added on top instead. */
  totalWithCommission: number
  saleAmount: number
  commissionRate: number
}

/**
 * Commission on a sale.
 *
 * Both directions are reported because arrangements differ: an agent's fee is
 * usually deducted from the sale price, while a buyer's premium is added on
 * top. The commission itself is the same figure either way.
 */
export function calculateCommission(
  saleAmount: number,
  commissionRate: number,
): CommissionResult {
  const commission = saleAmount * (commissionRate / 100)

  return {
    commission,
    netAmount: saleAmount - commission,
    totalWithCommission: saleAmount + commission,
    saleAmount,
    commissionRate,
  }
}

export function evaluateCommission(
  rawSaleAmount: string,
  rawCommissionRate: string,
): CalculatorOutcome<CommissionResult> {
  if (anyBlank(rawSaleAmount, rawCommissionRate)) return { state: 'empty' }

  const parsed = parseNumbers(rawSaleAmount, rawCommissionRate)
  if (!parsed) return invalid('Please enter numbers only.')

  const [saleAmount, commissionRate] = parsed
  if (saleAmount < 0) return invalid('The sale amount cannot be negative.')
  if (commissionRate < 0) return invalid('The commission rate cannot be negative.')

  return ok(calculateCommission(saleAmount, commissionRate))
}
