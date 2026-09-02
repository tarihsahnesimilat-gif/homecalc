import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface Currency {
  code: string
  name: string
}

/**
 * Currency codes offered in the dropdowns.
 *
 * These are labels only. **No exchange rates are stored anywhere in this
 * project and none are fetched.** Rates move constantly, and a rate baked into
 * a static site would be wrong within hours while still looking authoritative,
 * so the rate is something the user supplies from a source they trust.
 */
export const CURRENCIES: readonly Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'ZAR', name: 'South African Rand' },
]

export interface CurrencyResult {
  convertedAmount: number
  /** The rate actually applied — always 1 when both currencies match. */
  rate: number
  inverseRate: number
  amount: number
  from: string
  to: string
  /** True when the two currencies are the same and the rate was forced to 1. */
  sameCurrency: boolean
}

export function calculateCurrency(
  amount: number,
  from: string,
  to: string,
  rate: number,
): CurrencyResult {
  // Converting a currency into itself is always 1:1, whatever was typed.
  const sameCurrency = from === to
  const effectiveRate = sameCurrency ? 1 : rate

  return {
    convertedAmount: amount * effectiveRate,
    rate: effectiveRate,
    inverseRate: 1 / effectiveRate,
    amount,
    from,
    to,
    sameCurrency,
  }
}

export function evaluateCurrency(
  rawAmount: string,
  from: string,
  to: string,
  rawRate: string,
): CalculatorOutcome<CurrencyResult> {
  if (from === to) {
    if (anyBlank(rawAmount)) return { state: 'empty' }

    const parsedAmount = parseNumbers(rawAmount)
    if (!parsedAmount) return invalid('Please enter a number.')
    if (parsedAmount[0] < 0) return invalid('The amount cannot be negative.')

    return ok(calculateCurrency(parsedAmount[0], from, to, 1))
  }

  if (anyBlank(rawAmount, rawRate)) return { state: 'empty' }

  const parsed = parseNumbers(rawAmount, rawRate)
  if (!parsed) return invalid('Please enter numbers only.')

  const [amount, rate] = parsed
  if (amount < 0) return invalid('The amount cannot be negative.')
  if (rate <= 0) return invalid('The exchange rate must be greater than zero.')

  return ok(calculateCurrency(amount, from, to, rate))
}
