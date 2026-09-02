import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide'

export interface Fraction {
  numerator: number
  denominator: number
}

/** Greatest common divisor, Euclid's algorithm on magnitudes. */
export function greatestCommonDivisor(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const remainder = x % y
    x = y
    y = remainder
  }
  return x
}

/** Reduces to lowest terms, keeping the sign on the numerator. */
export function simplifyFraction({ numerator, denominator }: Fraction): Fraction {
  if (numerator === 0) return { numerator: 0, denominator: 1 }

  const sign = denominator < 0 ? -1 : 1
  const divisor = greatestCommonDivisor(numerator, denominator)

  return {
    numerator: (sign * numerator) / divisor,
    denominator: (sign * denominator) / divisor,
  }
}

/**
 * Exact fraction arithmetic on integers — the result never passes through a
 * float, so 1/3 + 1/3 is 2/3 rather than 0.6666666666666666.
 */
export function operateOnFractions(
  operation: FractionOperation,
  a: Fraction,
  b: Fraction,
): Fraction {
  switch (operation) {
    case 'add':
      return simplifyFraction({
        numerator: a.numerator * b.denominator + b.numerator * a.denominator,
        denominator: a.denominator * b.denominator,
      })
    case 'subtract':
      return simplifyFraction({
        numerator: a.numerator * b.denominator - b.numerator * a.denominator,
        denominator: a.denominator * b.denominator,
      })
    case 'multiply':
      return simplifyFraction({
        numerator: a.numerator * b.numerator,
        denominator: a.denominator * b.denominator,
      })
    case 'divide':
      return simplifyFraction({
        numerator: a.numerator * b.denominator,
        denominator: a.denominator * b.numerator,
      })
  }
}

/** "3/4", or just "2" when the denominator reduces to 1. */
export function formatFraction({ numerator, denominator }: Fraction): string {
  return denominator === 1 ? `${numerator}` : `${numerator}/${denominator}`
}

/** "1 1/4" for improper fractions; empty string when there is no whole part. */
export function formatMixedNumber({ numerator, denominator }: Fraction): string {
  if (denominator === 1 || Math.abs(numerator) < denominator) return ''

  const sign = numerator < 0 ? '-' : ''
  const magnitude = Math.abs(numerator)
  const whole = Math.floor(magnitude / denominator)
  const remainder = magnitude % denominator

  return remainder === 0 ? `${sign}${whole}` : `${sign}${whole} ${remainder}/${denominator}`
}

export function evaluateFraction(
  operation: FractionOperation,
  rawANumerator: string,
  rawADenominator: string,
  rawBNumerator: string,
  rawBDenominator: string,
): CalculatorOutcome<Fraction> {
  if (anyBlank(rawANumerator, rawADenominator, rawBNumerator, rawBDenominator)) {
    return { state: 'empty' }
  }

  const parsed = parseNumbers(rawANumerator, rawADenominator, rawBNumerator, rawBDenominator)
  if (!parsed) return invalid('Please enter numbers only.')

  const [an, ad, bn, bd] = parsed
  if (!parsed.every(Number.isInteger)) {
    return invalid('Numerators and denominators must be whole numbers.')
  }
  if (ad === 0 || bd === 0) return invalid('A denominator cannot be zero.')
  if (operation === 'divide' && bn === 0) {
    return invalid('You cannot divide by a fraction equal to zero.')
  }

  const result = operateOnFractions(
    operation,
    { numerator: an, denominator: ad },
    { numerator: bn, denominator: bd },
  )

  if (!Number.isSafeInteger(result.numerator) || !Number.isSafeInteger(result.denominator)) {
    return invalid('Those numbers are too large to work with exactly. Try smaller values.')
  }

  return ok(result)
}
