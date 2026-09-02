import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

/** 100 years. Anything slower than this is not a repayment plan. */
const MAXIMUM_MONTHS = 1200

export interface DebtPayoffResult {
  months: number
  years: number
  remainingMonths: number
  totalPaid: number
  totalInterest: number
  balance: number
  monthlyPayment: number
  /** The interest charged in the very first month, before any principal moves. */
  firstMonthInterest: number
}

/**
 * Steps through the balance month by month: interest is added, the payment is
 * taken off, and the remainder carries forward. The final payment is trimmed to
 * whatever is actually left, so the totals are exact rather than an estimate
 * based on a rounded number of months.
 *
 * Callers must reject a payment that cannot cover the first month's interest;
 * this function assumes the debt is payable.
 */
export function calculateDebtPayoff(
  balance: number,
  annualRate: number,
  monthlyPayment: number,
): DebtPayoffResult {
  const monthlyRate = annualRate / 100 / 12
  let remaining = balance
  let totalPaid = 0
  let months = 0

  while (remaining > 1e-6 && months < MAXIMUM_MONTHS) {
    const interest = remaining * monthlyRate
    const payment = Math.min(monthlyPayment, remaining + interest)
    remaining = remaining + interest - payment
    totalPaid += payment
    months += 1
  }

  return {
    months,
    years: Math.floor(months / 12),
    remainingMonths: months % 12,
    totalPaid,
    totalInterest: totalPaid - balance,
    balance,
    monthlyPayment,
    firstMonthInterest: balance * monthlyRate,
  }
}

export function evaluateDebtPayoff(
  rawBalance: string,
  rawRate: string,
  rawPayment: string,
): CalculatorOutcome<DebtPayoffResult> {
  if (anyBlank(rawBalance, rawRate, rawPayment)) return { state: 'empty' }

  const parsed = parseNumbers(rawBalance, rawRate, rawPayment)
  if (!parsed) return invalid('Please enter numbers only.')

  const [balance, rate, payment] = parsed
  if (balance <= 0) return invalid('The balance must be greater than zero.')
  if (rate < 0) return invalid('The interest rate cannot be negative.')
  if (payment <= 0) return invalid('The monthly payment must be greater than zero.')

  // A payment that does not cover the interest never reduces the balance, so
  // the debt grows forever. Saying so is far more useful than a huge number.
  const firstMonthInterest = balance * (rate / 100 / 12)
  if (payment <= firstMonthInterest && rate > 0) {
    return invalid(
      'This payment does not cover the interest charged each month, so the balance would never fall. It needs to be more than the monthly interest.',
    )
  }

  const result = calculateDebtPayoff(balance, rate, payment)
  if (result.months >= MAXIMUM_MONTHS) {
    return invalid('This would take over 100 years to pay off. Try a larger monthly payment.')
  }

  return ok(result)
}
