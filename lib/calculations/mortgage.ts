import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'
import { calculateLoanPayment } from './loan-payment.ts'

export interface MortgageResult {
  homePrice: number
  downPayment: number
  /** What is actually borrowed: price less deposit. */
  loanAmount: number
  /** Principal and interest only. */
  monthlyPayment: number
  totalPaid: number
  totalInterest: number
  months: number
  downPaymentPercent: number
}

/**
 * A mortgage is a fixed-rate amortising loan, so the payment itself comes from
 * `calculateLoanPayment` rather than a second copy of the same formula. What
 * this adds is the deposit: the amount borrowed is the price less what you put
 * down.
 *
 * Principal and interest only — property tax, insurance, HOA fees, PMI and
 * lender charges are not modelled, so a real quote will be higher.
 */
export function calculateMortgage(
  homePrice: number,
  downPayment: number,
  annualRate: number,
  termYears: number,
): MortgageResult {
  const loanAmount = homePrice - downPayment
  const months = Math.round(termYears * 12)
  const loan = calculateLoanPayment(loanAmount, annualRate, months)

  return {
    homePrice,
    downPayment,
    loanAmount,
    monthlyPayment: loan.monthlyPayment,
    totalPaid: loan.totalPaid,
    totalInterest: loan.totalInterest,
    months,
    downPaymentPercent: (downPayment / homePrice) * 100,
  }
}

export function evaluateMortgage(
  rawHomePrice: string,
  rawDownPayment: string,
  rawRate: string,
  rawTermYears: string,
): CalculatorOutcome<MortgageResult> {
  if (anyBlank(rawHomePrice, rawDownPayment, rawRate, rawTermYears)) return { state: 'empty' }

  const parsed = parseNumbers(rawHomePrice, rawDownPayment, rawRate, rawTermYears)
  if (!parsed) return invalid('Please enter numbers only.')

  const [homePrice, downPayment, rate, termYears] = parsed
  if (homePrice <= 0) return invalid('The home price must be greater than zero.')
  if (downPayment < 0) return invalid('The down payment cannot be negative.')
  if (downPayment >= homePrice) {
    return invalid('The down payment covers the whole price, so there is nothing to borrow.')
  }
  if (rate < 0) return invalid('The interest rate cannot be negative.')
  if (termYears <= 0) return invalid('The loan term must be greater than zero.')

  return ok(calculateMortgage(homePrice, downPayment, rate, termYears))
}
