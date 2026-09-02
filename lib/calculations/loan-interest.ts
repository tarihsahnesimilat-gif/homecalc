import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'
import { calculateLoanPayment } from './loan-payment.ts'

export interface LoanInterestResult {
  totalInterest: number
  totalPaid: number
  monthlyPayment: number
  principal: number
  months: number
  /** Interest in the very first payment, before much principal has moved. */
  firstPaymentInterest: number
  firstPaymentPrincipal: number
  /** Principal in the final payment, by which point interest is almost gone. */
  lastPaymentPrincipal: number
  /** Total interest as a share of the amount borrowed. */
  interestAsPercentOfPrincipal: number
}

/**
 * What a loan costs in interest, and how that cost is distributed.
 *
 * The Loan Payment calculator answers "what is my monthly payment?" — this one
 * answers "what does the interest cost me, and why does the balance barely
 * move at first?". The payment itself comes from the same amortisation
 * function rather than a second copy of the formula.
 *
 * The split matters: interest is charged on the outstanding balance, so an
 * early payment is mostly interest and a late one is almost entirely principal.
 */
export function calculateLoanInterest(
  principal: number,
  annualRate: number,
  months: number,
): LoanInterestResult {
  const loan = calculateLoanPayment(principal, annualRate, months)
  const monthlyRate = annualRate / 100 / 12

  const firstPaymentInterest = principal * monthlyRate

  // Walk the schedule to find what the closing payment puts against principal.
  let remaining = principal
  let lastPaymentPrincipal = loan.monthlyPayment
  for (let month = 0; month < months; month += 1) {
    const interest = remaining * monthlyRate
    lastPaymentPrincipal = loan.monthlyPayment - interest
    remaining = remaining + interest - loan.monthlyPayment
  }

  return {
    totalInterest: loan.totalInterest,
    totalPaid: loan.totalPaid,
    monthlyPayment: loan.monthlyPayment,
    principal,
    months,
    firstPaymentInterest,
    firstPaymentPrincipal: loan.monthlyPayment - firstPaymentInterest,
    lastPaymentPrincipal,
    interestAsPercentOfPrincipal: (loan.totalInterest / principal) * 100,
  }
}

export function evaluateLoanInterest(
  rawAmount: string,
  rawRate: string,
  rawTermYears: string,
): CalculatorOutcome<LoanInterestResult> {
  if (anyBlank(rawAmount, rawRate, rawTermYears)) return { state: 'empty' }

  const parsed = parseNumbers(rawAmount, rawRate, rawTermYears)
  if (!parsed) return invalid('Please enter numbers only.')

  const [amount, rate, termYears] = parsed
  if (amount <= 0) return invalid('The loan amount must be greater than zero.')
  if (rate < 0) return invalid('The interest rate cannot be negative.')
  if (termYears <= 0) return invalid('The loan term must be greater than zero.')

  return ok(calculateLoanInterest(amount, rate, Math.round(termYears * 12)))
}
