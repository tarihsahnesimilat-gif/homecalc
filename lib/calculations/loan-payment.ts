import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export type LoanTermUnit = 'years' | 'months'

export interface LoanPaymentResult {
  monthlyPayment: number
  totalPaid: number
  totalInterest: number
  principal: number
  months: number
}

/**
 * Fixed-payment amortisation: M = P[r(1+r)^n] / [(1+r)^n - 1].
 *
 * Covers principal and interest only. Real repayments also carry fees, taxes,
 * insurance and lender-specific terms, so treat this as an estimate.
 */
export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  months: number,
): LoanPaymentResult {
  const monthlyRate = annualRate / 100 / 12

  // With no interest the loan simply divides evenly, and the general formula
  // would divide by zero.
  const monthlyPayment =
    monthlyRate === 0
      ? principal / months
      : (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1)

  const totalPaid = monthlyPayment * months

  return {
    monthlyPayment,
    totalPaid,
    totalInterest: totalPaid - principal,
    principal,
    months,
  }
}

export function toMonths(term: number, unit: LoanTermUnit): number {
  return unit === 'years' ? term * 12 : term
}

export function evaluateLoanPayment(
  rawAmount: string,
  rawRate: string,
  rawTerm: string,
  unit: LoanTermUnit,
): CalculatorOutcome<LoanPaymentResult> {
  if (anyBlank(rawAmount, rawRate, rawTerm)) return { state: 'empty' }

  const parsed = parseNumbers(rawAmount, rawRate, rawTerm)
  if (!parsed) return invalid('Please enter numbers only.')

  const [amount, rate, term] = parsed
  if (amount <= 0) return invalid('The loan amount must be greater than zero.')
  if (rate < 0) return invalid('The interest rate cannot be negative.')
  if (term <= 0) return invalid('The loan term must be greater than zero.')

  return ok(calculateLoanPayment(amount, rate, toMonths(term, unit)))
}
