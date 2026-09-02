/**
 * Regression coverage for all ten calculators.
 *
 * These exercise the shipped calculation modules directly — the same functions
 * the forms call — so a change in behaviour fails here rather than in the UI.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import { outcomeValue } from '../lib/calculator-validation.ts'
import { evaluatePercentage } from '../lib/calculations/percentage.ts'
import { evaluateTip } from '../lib/calculations/tip.ts'
import { evaluateDiscount } from '../lib/calculations/discount.ts'
import { evaluateAverage } from '../lib/calculations/average.ts'
import {
  evaluateFraction,
  formatFraction,
  formatMixedNumber,
  greatestCommonDivisor,
} from '../lib/calculations/fraction.ts'
import { evaluateRatio, simplifyRatio } from '../lib/calculations/ratio.ts'
import { evaluatePercentageChange } from '../lib/calculations/percentage-change.ts'
import { evaluateProfitMargin } from '../lib/calculations/profit-margin.ts'
import { evaluateSimpleInterest, toYears } from '../lib/calculations/simple-interest.ts'
import { UNIT_CATEGORIES, convert, evaluateConversion } from '../lib/calculations/units.ts'

const close = (actual: number, expected: number, tolerance = 1e-9) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  )

// ---------------------------------------------------------------- Percentage
test('percentage: all five modes', () => {
  close(outcomeValue(evaluatePercentage('of', '15', '240'))!.value!, 36)
  close(outcomeValue(evaluatePercentage('what', '47', '60'))!.value!, 78.33333333333333)
  close(outcomeValue(evaluatePercentage('change', '48000', '52000'))!.value!, 8.333333333333332)
  close(outcomeValue(evaluatePercentage('increase', '240', '15'))!.value!, 276)
  close(outcomeValue(evaluatePercentage('decrease', '240', '15'))!.value!, 204)
})

test('percentage: divide-by-zero guards report instead of returning Infinity', () => {
  const what = outcomeValue(evaluatePercentage('what', '5', '0'))!
  assert.equal(what.value, null)
  assert.match(what.error!, /cannot be zero/)

  const change = outcomeValue(evaluatePercentage('change', '0', '50'))!
  assert.equal(change.value, null)
  assert.match(change.error!, /cannot be zero/)
})

test('percentage: percent-suffixed modes are flagged', () => {
  assert.equal(outcomeValue(evaluatePercentage('what', '1', '2'))!.isPercent, true)
  assert.equal(outcomeValue(evaluatePercentage('change', '1', '2'))!.isPercent, true)
  assert.equal(outcomeValue(evaluatePercentage('of', '1', '2'))!.isPercent, false)
})

test('percentage: blank and non-numeric input', () => {
  assert.equal(evaluatePercentage('of', '', '240').state, 'empty')
  assert.equal(evaluatePercentage('of', 'abc', '240').state, 'invalid')
})

// ----------------------------------------------------------------------- Tip
test('tip: normal calculation and splitting', () => {
  const single = outcomeValue(evaluateTip('100', '15', '1'))!
  close(single.tipAmount, 15)
  close(single.total, 115)
  close(single.perPerson, 115)

  const split = outcomeValue(evaluateTip('100', '20', '4'))!
  close(split.tipAmount, 20)
  close(split.total, 120)
  close(split.perPerson, 30)

  close(outcomeValue(evaluateTip('250', '10', '2'))!.perPerson, 137.5)
})

test('tip: validation', () => {
  assert.equal(evaluateTip('', '', '').state, 'empty')
  assert.equal(evaluateTip('100', '15', '0').state, 'invalid')
  assert.equal(evaluateTip('-5', '15', '1').state, 'invalid')
  assert.equal(evaluateTip('100', '-1', '1').state, 'invalid')
  assert.equal(evaluateTip('100', '15', '2.5').state, 'invalid')
  assert.equal(evaluateTip('abc', '15', '1').state, 'invalid')
})

// ------------------------------------------------------------------ Discount
test('discount: normal, zero and full discounts', () => {
  const normal = outcomeValue(evaluateDiscount('100', '20'))!
  close(normal.discountAmount, 20)
  close(normal.finalPrice, 80)
  close(normal.saved, 20)

  close(outcomeValue(evaluateDiscount('250', '10'))!.finalPrice, 225)
  close(outcomeValue(evaluateDiscount('100', '0'))!.finalPrice, 100)
  close(outcomeValue(evaluateDiscount('100', '100'))!.finalPrice, 0)
})

test('discount: validation', () => {
  assert.equal(evaluateDiscount('', '').state, 'empty')
  assert.equal(evaluateDiscount('-10', '20').state, 'invalid')
  assert.equal(evaluateDiscount('100', '-5').state, 'invalid')
  assert.equal(evaluateDiscount('100', '120').state, 'invalid')
  assert.equal(evaluateDiscount('xyz', '20').state, 'invalid')
})

// ------------------------------------------------------------------- Average
test('average: multiple values, blanks and zeros', () => {
  const three = outcomeValue(evaluateAverage(['10', '20', '30']))!
  assert.deepEqual(three, { sum: 60, count: 3, average: 20 })

  const four = outcomeValue(evaluateAverage(['10', '20', '30', '40']))!
  assert.deepEqual(four, { sum: 100, count: 4, average: 25 })

  // Blank rows are skipped entirely rather than counted as zero.
  const blanks = outcomeValue(evaluateAverage(['10', '', '20', '   ', '30']))!
  assert.deepEqual(blanks, { sum: 60, count: 3, average: 20 })

  // A typed zero is a real value and does count.
  const zeros = outcomeValue(evaluateAverage(['0', '0', '3']))!
  assert.equal(zeros.count, 3)
  close(zeros.average, 1)

  close(outcomeValue(evaluateAverage(['-10', '10']))!.average, 0)
  assert.equal(outcomeValue(evaluateAverage(['7']))!.average, 7)
})

test('average: no values and non-numeric values', () => {
  assert.equal(evaluateAverage(['', '', '']).state, 'empty')
  assert.equal(evaluateAverage([]).state, 'empty')
  assert.equal(evaluateAverage(['10', 'abc']).state, 'invalid')
})

// ------------------------------------------------------------------ Fraction
test('fraction: the four operations reduce to lowest terms', () => {
  const cases: [Parameters<typeof evaluateFraction>[0], string, string, string, string, string][] =
    [
      ['add', '1', '2', '1', '4', '3/4'],
      ['subtract', '3', '4', '1', '4', '1/2'],
      ['multiply', '2', '3', '3', '4', '1/2'],
      ['divide', '1', '2', '1', '4', '2'],
    ]
  for (const [op, an, ad, bn, bd, expected] of cases) {
    const result = outcomeValue(evaluateFraction(op, an, ad, bn, bd))!
    assert.equal(formatFraction(result), expected, `${an}/${ad} ${op} ${bn}/${bd}`)
  }
})

test('fraction: arithmetic stays exact, never passing through a float', () => {
  const third = outcomeValue(evaluateFraction('add', '1', '3', '1', '3'))!
  assert.deepEqual(third, { numerator: 2, denominator: 3 })
})

test('fraction: negatives, improper values and mixed numbers', () => {
  assert.equal(formatFraction(outcomeValue(evaluateFraction('add', '-1', '2', '1', '4'))!), '-1/4')
  assert.equal(formatFraction(outcomeValue(evaluateFraction('add', '3', '4', '3', '4'))!), '3/2')
  assert.equal(formatFraction(outcomeValue(evaluateFraction('subtract', '1', '2', '1', '2'))!), '0')
  assert.equal(formatMixedNumber({ numerator: 5, denominator: 4 }), '1 1/4')
  assert.equal(formatMixedNumber({ numerator: -5, denominator: 4 }), '-1 1/4')
  assert.equal(formatMixedNumber({ numerator: 1, denominator: 2 }), '')
})

test('fraction: zero denominators and division by zero are rejected', () => {
  assert.equal(evaluateFraction('add', '1', '0', '1', '4').state, 'invalid')
  assert.equal(evaluateFraction('add', '1', '2', '1', '0').state, 'invalid')
  assert.equal(evaluateFraction('divide', '1', '2', '0', '4').state, 'invalid')
})

test('fraction: input validation', () => {
  assert.equal(evaluateFraction('add', '1', '2', '1', '').state, 'empty')
  assert.equal(evaluateFraction('add', 'x', '2', '1', '4').state, 'invalid')
  assert.equal(evaluateFraction('add', '1.5', '2', '1', '4').state, 'invalid')
})

test('fraction: greatest common divisor', () => {
  assert.equal(greatestCommonDivisor(12, 18), 6)
  assert.equal(greatestCommonDivisor(-12, 18), 6)
  assert.equal(greatestCommonDivisor(7, 13), 1)
})

// --------------------------------------------------------------------- Ratio
test('ratio: scaling from either known side', () => {
  close(outcomeValue(evaluateRatio('a', '2', '3', '10'))!.unknownValue, 15)
  close(outcomeValue(evaluateRatio('b', '2', '3', '15'))!.unknownValue, 10)
  close(outcomeValue(evaluateRatio('a', '16', '9', '1920'))!.unknownValue, 1080)
  close(outcomeValue(evaluateRatio('a', '2', '3', '0'))!.unknownValue, 0)
})

test('ratio: simplification', () => {
  assert.deepEqual(simplifyRatio(12, 18), { a: 2, b: 3, exact: true })
  assert.deepEqual(simplifyRatio(16, 9), { a: 16, b: 9, exact: true })
  // Decimal terms cannot reduce by GCD, so they scale against the smaller term.
  const scaled = simplifyRatio(2.5, 5)
  assert.equal(scaled.exact, false)
  close(scaled.a, 1)
  close(scaled.b, 2)
})

test('ratio: invalid input', () => {
  assert.equal(evaluateRatio('a', '2', '3', '').state, 'empty')
  assert.equal(evaluateRatio('a', '0', '3', '10').state, 'invalid')
  assert.equal(evaluateRatio('a', '2', '0', '10').state, 'invalid')
  assert.equal(evaluateRatio('a', '2', '3', '-5').state, 'invalid')
  assert.equal(evaluateRatio('a', 'abc', '3', '10').state, 'invalid')
})

// --------------------------------------------------------- Percentage change
test('percentage change: increase, decrease and no change', () => {
  const up = outcomeValue(evaluatePercentageChange('100', '120'))!
  close(up.percentChange, 20)
  assert.equal(up.direction, 'increase')

  const down = outcomeValue(evaluatePercentageChange('120', '100'))!
  close(down.percentChange, -16.666666666666664)
  assert.equal(down.direction, 'decrease')

  const same = outcomeValue(evaluatePercentageChange('100', '100'))!
  close(same.percentChange, 0)
  assert.equal(same.direction, 'none')

  close(outcomeValue(evaluatePercentageChange('48000', '52000'))!.percentChange, 8.333333333333334)
})

test('percentage change: zero baseline is rejected, not Infinity', () => {
  assert.equal(evaluatePercentageChange('0', '50').state, 'invalid')
  assert.equal(evaluatePercentageChange('', '50').state, 'empty')
  assert.equal(evaluatePercentageChange('abc', '50').state, 'invalid')
})

// ------------------------------------------------------------- Profit margin
test('profit margin: profit, loss and break-even', () => {
  const profit = outcomeValue(evaluateProfitMargin('1000', '600'))!
  close(profit.profit, 400)
  close(profit.margin, 40)

  const loss = outcomeValue(evaluateProfitMargin('1000', '1200'))!
  close(loss.profit, -200)
  close(loss.margin, -20)

  close(outcomeValue(evaluateProfitMargin('500', '500'))!.margin, 0)
  close(outcomeValue(evaluateProfitMargin('250', '0'))!.margin, 100)
})

test('profit margin: revenue must be above zero', () => {
  assert.equal(evaluateProfitMargin('0', '100').state, 'invalid')
  assert.equal(evaluateProfitMargin('-5', '1').state, 'invalid')
  assert.equal(evaluateProfitMargin('100', '-1').state, 'invalid')
  assert.equal(evaluateProfitMargin('', '').state, 'empty')
})

// ------------------------------------------------------------ Simple interest
test('simple interest: principal, rate and time combinations', () => {
  const years = outcomeValue(evaluateSimpleInterest('years', '1000', '5', '2'))!
  close(years.interest, 100)
  close(years.total, 1100)

  const months = outcomeValue(evaluateSimpleInterest('months', '1000', '5', '12'))!
  close(months.interest, 50)
  close(months.total, 1050)

  close(outcomeValue(evaluateSimpleInterest('months', '2500', '8', '6'))!.interest, 100)
  close(outcomeValue(evaluateSimpleInterest('years', '1200', '0', '3'))!.interest, 0)
})

test('simple interest: month to year conversion', () => {
  close(toYears(12, 'months'), 1)
  close(toYears(18, 'months'), 1.5)
  close(toYears(3, 'years'), 3)
})

test('simple interest: negatives are rejected', () => {
  assert.equal(evaluateSimpleInterest('years', '-1', '5', '2').state, 'invalid')
  assert.equal(evaluateSimpleInterest('years', '1000', '-5', '2').state, 'invalid')
  assert.equal(evaluateSimpleInterest('years', '1000', '5', '-2').state, 'invalid')
  assert.equal(evaluateSimpleInterest('years', '', '5', '2').state, 'empty')
})

// ------------------------------------------------------------- Unit converter
test('unit converter: exact conversions are exact, with no float noise', () => {
  // Strict equality on purpose: a regression reintroducing 12.000000000000002
  // must fail here rather than be hidden by a tolerance.
  assert.equal(convert('length', 'foot', 'inch', 1), 12)
  assert.equal(convert('length', 'meter', 'centimeter', 1), 100)
  assert.equal(convert('length', 'kilometer', 'meter', 1), 1000)
  assert.equal(convert('temperature', 'celsius', 'fahrenheit', 0), 32)
  assert.equal(convert('temperature', 'celsius', 'fahrenheit', 100), 212)
  assert.equal(convert('weight', 'kilogram', 'gram', 1), 1000)
})

test('unit converter: broader coverage across all four categories', () => {
  close(convert('length', 'mile', 'kilometer', 1), 1.609344)
  assert.equal(convert('length', 'yard', 'foot', 1), 3)
  assert.equal(convert('length', 'inch', 'centimeter', 1), 2.54)
  assert.equal(convert('weight', 'pound', 'ounce', 1), 16)
  assert.equal(convert('temperature', 'fahrenheit', 'celsius', 32), 0)
  assert.equal(convert('temperature', 'fahrenheit', 'celsius', 212), 100)
  assert.equal(convert('temperature', 'celsius', 'kelvin', 0), 273.15)
  assert.equal(convert('temperature', 'kelvin', 'celsius', 273.15), 0)
  assert.equal(convert('volume', 'liter', 'milliliter', 1), 1000)
  close(convert('volume', 'gallon', 'liter', 1), 3.785411784)
  assert.equal(convert('volume', 'gallon', 'fluid-ounce', 1), 128)
})

test('unit converter: precision is normalized without being flattened', () => {
  // 12 significant digits are kept - far beyond the six decimals displayed.
  assert.equal(convert('weight', 'kilogram', 'pound', 1), 2.20462262185)
  assert.equal(convert('temperature', 'celsius', 'fahrenheit', 37.5), 99.5)
  assert.equal(convert('length', 'mile', 'millimeter', 1000), 1609344000)

  for (const category of UNIT_CATEGORIES) {
    for (const from of category.units) {
      for (const to of category.units) {
        for (const input of [1, 7, 0.5, 123.456]) {
          const value = convert(category.id, from.id, to.id, input)
          assert.equal(
            value,
            Number(value.toPrecision(12)),
            `${category.id} ${from.id}->${to.id} (${input}) carries float noise`,
          )
        }
      }
    }
  }
})

test('unit converter: every unit pair round-trips', () => {
  for (const category of UNIT_CATEGORIES) {
    for (const from of category.units) {
      for (const to of category.units) {
        const there = convert(category.id, from.id, to.id, 7)
        close(convert(category.id, to.id, from.id, there), 7)
      }
    }
  }
})

test('unit converter: validation', () => {
  assert.equal(evaluateConversion('length', 'meter', 'centimeter', '').state, 'empty')
  assert.equal(evaluateConversion('length', 'meter', 'centimeter', 'abc').state, 'invalid')
  assert.equal(evaluateConversion('length', 'meter', 'centimeter', '-5').state, 'invalid')
  // Temperature may legitimately go below zero.
  assert.equal(outcomeValue(evaluateConversion('temperature', 'celsius', 'fahrenheit', '-40')), -40)
  // But not below absolute zero.
  assert.equal(evaluateConversion('temperature', 'kelvin', 'celsius', '-1').state, 'invalid')
  assert.equal(evaluateConversion('temperature', 'celsius', 'kelvin', '-300').state, 'invalid')
})

test('unit converter: the four categories carry their documented units', () => {
  assert.equal(UNIT_CATEGORIES.length, 4)
  assert.deepEqual(
    UNIT_CATEGORIES.map((category) => [category.id, category.units.length]),
    [
      ['length', 8],
      ['weight', 4],
      ['temperature', 3],
      ['volume', 4],
    ],
  )
})
