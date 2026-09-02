import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface TipBreakdown {
  tipAmount: number
  total: number
  perPerson: number
  people: number
}

/**
 * Amounts are plain numbers with no currency baked in, so the same logic works
 * whatever currency the user has in mind.
 */
export function calculateTip(bill: number, tipPercent: number, people: number): TipBreakdown {
  const tipAmount = bill * (tipPercent / 100)
  const total = bill + tipAmount

  return { tipAmount, total, perPerson: total / people, people }
}

export function evaluateTip(
  rawBill: string,
  rawTipPercent: string,
  rawPeople: string,
): CalculatorOutcome<TipBreakdown> {
  if (anyBlank(rawBill, rawTipPercent, rawPeople)) return { state: 'empty' }

  const parsed = parseNumbers(rawBill, rawTipPercent, rawPeople)
  if (!parsed) return invalid('Please enter numbers only.')

  const [bill, tipPercent, people] = parsed
  if (bill < 0) return invalid('The bill amount cannot be negative.')
  if (tipPercent < 0) return invalid('The tip percentage cannot be negative.')
  if (!Number.isInteger(people)) return invalid('The number of people must be a whole number.')
  if (people < 1) return invalid('There must be at least 1 person to split the bill.')

  return ok(calculateTip(bill, tipPercent, people))
}
