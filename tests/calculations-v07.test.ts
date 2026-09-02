/**
 * Coverage for calculators 21-30, against the shipped calculation modules.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import { outcomeValue } from '../lib/calculator-validation.ts'
import { evaluatePercentageOf } from '../lib/calculations/percentage-of-number.ts'
import {
  evaluateGcfLcm,
  greatestCommonFactor,
  leastCommonMultiple,
} from '../lib/calculations/gcf-lcm.ts'
import { evaluateExponent } from '../lib/calculations/exponent.ts'
import { evaluateSquareRoot } from '../lib/calculations/square-root.ts'
import { evaluateSalesTax } from '../lib/calculations/sales-tax.ts'
import { evaluateInvestment } from '../lib/calculations/investment.ts'
import { evaluateBreakEven } from '../lib/calculations/break-even.ts'
import { evaluateFuelCost } from '../lib/calculations/fuel-cost.ts'
import { evaluateTimeDuration } from '../lib/calculations/time-duration.ts'
import { evaluateWorkHours } from '../lib/calculations/work-hours.ts'
import { minutesBetween, parseTimeInput } from '../lib/calculations/time-utils.ts'

const close = (actual: number, expected: number, tolerance = 1e-9) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  )

// ------------------------------------------------- 21. Percentage of Number
test('percentage of number: standard cases', () => {
  close(outcomeValue(evaluatePercentageOf('15', '200'))!.amount, 30)
  close(outcomeValue(evaluatePercentageOf('7.5', '480'))!.amount, 36)
  close(outcomeValue(evaluatePercentageOf('100', '250'))!.amount, 250)
  close(outcomeValue(evaluatePercentageOf('50', '99'))!.amount, 49.5)
})

test('percentage of number: zero and negatives', () => {
  close(outcomeValue(evaluatePercentageOf('0', '200'))!.amount, 0)
  close(outcomeValue(evaluatePercentageOf('15', '0'))!.amount, 0)
  close(outcomeValue(evaluatePercentageOf('-10', '200'))!.amount, -20)
})

test('percentage of number: decimals carry through', () => {
  close(outcomeValue(evaluatePercentageOf('12.5', '86.4'))!.amount, 10.8, 1e-9)
})

test('percentage of number: validation', () => {
  assert.equal(evaluatePercentageOf('', '200').state, 'empty')
  assert.equal(evaluatePercentageOf('15', '').state, 'empty')
  assert.equal(evaluatePercentageOf('abc', '200').state, 'invalid')
})

// ------------------------------------------------------------ 22. GCF / LCM
test('gcf/lcm: numbers with common factors', () => {
  const result = outcomeValue(evaluateGcfLcm('12', '18'))!
  assert.equal(result.gcf, 6)
  assert.equal(result.lcm, 36)

  const eight = outcomeValue(evaluateGcfLcm('8', '12'))!
  assert.equal(eight.gcf, 4)
  assert.equal(eight.lcm, 24)
})

test('gcf/lcm: coprime and prime numbers', () => {
  const primes = outcomeValue(evaluateGcfLcm('7', '13'))!
  assert.equal(primes.gcf, 1)
  assert.equal(primes.lcm, 91)

  const coprime = outcomeValue(evaluateGcfLcm('9', '28'))!
  assert.equal(coprime.gcf, 1)
  assert.equal(coprime.lcm, 252)
})

test('gcf/lcm: equal numbers, and one dividing the other', () => {
  const equal = outcomeValue(evaluateGcfLcm('15', '15'))!
  assert.equal(equal.gcf, 15)
  assert.equal(equal.lcm, 15)

  const divides = outcomeValue(evaluateGcfLcm('5', '20'))!
  assert.equal(divides.gcf, 5)
  assert.equal(divides.lcm, 20)

  const one = outcomeValue(evaluateGcfLcm('1', '17'))!
  assert.equal(one.gcf, 1)
  assert.equal(one.lcm, 17)
})

test('gcf/lcm: larger numbers stay exact', () => {
  const result = outcomeValue(evaluateGcfLcm('123456', '789012'))!
  assert.equal(result.gcf, greatestCommonFactor(123456, 789012))
  assert.equal(result.lcm, leastCommonMultiple(123456, 789012))
  // The identity gcf * lcm === a * b must hold.
  assert.equal(result.gcf * result.lcm, 123456 * 789012)
})

test('gcf/lcm: validation', () => {
  assert.equal(evaluateGcfLcm('', '18').state, 'empty')
  assert.equal(evaluateGcfLcm('12.5', '18').state, 'invalid')
  assert.equal(evaluateGcfLcm('0', '18').state, 'invalid')
  assert.equal(evaluateGcfLcm('-12', '18').state, 'invalid')
  assert.equal(evaluateGcfLcm('12', '-18').state, 'invalid')
  assert.equal(evaluateGcfLcm('abc', '18').state, 'invalid')
})

// ------------------------------------------------------------ 23. Exponent
test('exponent: positive exponents', () => {
  assert.equal(outcomeValue(evaluateExponent('2', '3'))!.value, 8)
  assert.equal(outcomeValue(evaluateExponent('10', '2'))!.value, 100)
  assert.equal(outcomeValue(evaluateExponent('3', '4'))!.value, 81)
  assert.equal(outcomeValue(evaluateExponent('-2', '3'))!.value, -8)
  assert.equal(outcomeValue(evaluateExponent('-2', '2'))!.value, 4)
})

test('exponent: zero exponent gives one', () => {
  assert.equal(outcomeValue(evaluateExponent('5', '0'))!.value, 1)
  assert.equal(outcomeValue(evaluateExponent('-7', '0'))!.value, 1)
  assert.equal(outcomeValue(evaluateExponent('0', '5'))!.value, 0)
})

test('exponent: negative exponents', () => {
  assert.equal(outcomeValue(evaluateExponent('5', '-2'))!.value, 0.04)
  assert.equal(outcomeValue(evaluateExponent('2', '-1'))!.value, 0.5)
  assert.equal(outcomeValue(evaluateExponent('10', '-3'))!.value, 0.001)
})

test('exponent: fractional exponents are roots', () => {
  assert.equal(outcomeValue(evaluateExponent('9', '0.5'))!.value, 3)
  // The exponent is only an approximation of one third, so the cube root of 27
  // lands just short of 3 — correctly so.
  close(outcomeValue(evaluateExponent('27', '0.3333333333'))!.value, 3, 1e-8)
  assert.equal(outcomeValue(evaluateExponent('16', '0.25'))!.value, 2)
})

test('exponent: undefined and non-real cases are rejected', () => {
  assert.equal(evaluateExponent('0', '0').state, 'invalid')
  assert.equal(evaluateExponent('0', '-1').state, 'invalid')
  assert.equal(evaluateExponent('-8', '0.5').state, 'invalid')
  assert.equal(evaluateExponent('10', '1000').state, 'invalid')
  assert.equal(evaluateExponent('abc', '2').state, 'invalid')
  assert.equal(evaluateExponent('', '2').state, 'empty')
})

// --------------------------------------------------------- 24. Square Root
test('square root: perfect squares', () => {
  for (const [value, root] of [
    ['16', 4],
    ['144', 12],
    ['1', 1],
    ['10000', 100],
  ] as const) {
    const result = outcomeValue(evaluateSquareRoot(value))!
    assert.equal(result.root, root)
    assert.equal(result.isPerfectSquare, true, `${value} should be a perfect square`)
  }
})

test('square root: non-perfect squares', () => {
  const two = outcomeValue(evaluateSquareRoot('2'))!
  close(two.root, Math.SQRT2, 1e-9)
  assert.equal(two.isPerfectSquare, false)

  close(outcomeValue(evaluateSquareRoot('10'))!.root, Math.sqrt(10), 1e-9)
  close(outcomeValue(evaluateSquareRoot('2.25'))!.root, 1.5, 1e-9)
})

test('square root: zero', () => {
  const zero = outcomeValue(evaluateSquareRoot('0'))!
  assert.equal(zero.root, 0)
  assert.equal(zero.isPerfectSquare, true)
})

test('square root: negatives are rejected', () => {
  assert.equal(evaluateSquareRoot('-1').state, 'invalid')
  assert.equal(evaluateSquareRoot('-0.5').state, 'invalid')
  assert.equal(evaluateSquareRoot('').state, 'empty')
  assert.equal(evaluateSquareRoot('abc').state, 'invalid')
})

// ----------------------------------------------------------- 25. Sales Tax
test('sales tax: adding tax to a price', () => {
  const result = outcomeValue(evaluateSalesTax('add', '100', '8.25'))!
  close(result.taxAmount, 8.25)
  close(result.finalPrice, 108.25)
  close(result.preTaxPrice, 100)

  const twenty = outcomeValue(evaluateSalesTax('add', '250', '20'))!
  close(twenty.taxAmount, 50)
  close(twenty.finalPrice, 300)
})

test('sales tax: zero tax and zero price', () => {
  const noTax = outcomeValue(evaluateSalesTax('add', '100', '0'))!
  close(noTax.taxAmount, 0)
  close(noTax.finalPrice, 100)

  const noPrice = outcomeValue(evaluateSalesTax('add', '0', '20'))!
  close(noPrice.taxAmount, 0)
  close(noPrice.finalPrice, 0)
})

test('sales tax: extracting tax from an inclusive price', () => {
  const result = outcomeValue(evaluateSalesTax('extract', '120', '20'))!
  close(result.preTaxPrice, 100)
  close(result.taxAmount, 20)
  close(result.finalPrice, 120)
})

test('sales tax: the two modes are inverses of each other', () => {
  const added = outcomeValue(evaluateSalesTax('add', '87.99', '7.5'))!
  const extracted = outcomeValue(
    evaluateSalesTax('extract', String(added.finalPrice), '7.5'),
  )!
  close(extracted.preTaxPrice, 87.99, 1e-9)
})

test('sales tax: validation', () => {
  assert.equal(evaluateSalesTax('add', '', '8').state, 'empty')
  assert.equal(evaluateSalesTax('add', '-10', '8').state, 'invalid')
  assert.equal(evaluateSalesTax('add', '100', '-1').state, 'invalid')
  assert.equal(evaluateSalesTax('add', 'abc', '8').state, 'invalid')
})

// ---------------------------------------------------------- 26. Investment
test('investment: no contributions is plain compound growth', () => {
  const result = outcomeValue(evaluateInvestment('10000', '0', '6', '10'))!
  assert.equal(result.months, 120)
  close(result.finalValue, 10000 * Math.pow(1 + 0.06 / 12, 120), 1e-9)
  close(result.totalContributions, 10000)
  close(result.growth, result.finalValue - 10000, 1e-9)
})

test('investment: regular contributions', () => {
  const result = outcomeValue(evaluateInvestment('1000', '200', '5', '10'))!
  const monthlyRate = 0.05 / 12
  const growthFactor = Math.pow(1 + monthlyRate, 120)
  const expected = 1000 * growthFactor + 200 * ((growthFactor - 1) / monthlyRate)

  close(result.finalValue, expected, 1e-9)
  close(result.totalContributions, 1000 + 200 * 120)
  assert.ok(result.growth > 0)
})

test('investment: a zero rate is just the money paid in', () => {
  const result = outcomeValue(evaluateInvestment('1000', '100', '0', '5'))!
  close(result.finalValue, 1000 + 100 * 60)
  close(result.totalContributions, 7000)
  close(result.growth, 0)
})

test('investment: longer periods and higher rates grow more', () => {
  const short = outcomeValue(evaluateInvestment('5000', '100', '6', '5'))!
  const long = outcomeValue(evaluateInvestment('5000', '100', '6', '20'))!
  const lowRate = outcomeValue(evaluateInvestment('5000', '100', '3', '20'))!

  assert.ok(long.finalValue > short.finalValue)
  assert.ok(long.finalValue > lowRate.finalValue)
  assert.ok(long.growth > short.growth)
})

test('investment: fractional years round to whole months', () => {
  assert.equal(outcomeValue(evaluateInvestment('1000', '0', '5', '1.5'))!.months, 18)
  assert.equal(outcomeValue(evaluateInvestment('1000', '0', '5', '0.25'))!.months, 3)
})

test('investment: validation', () => {
  assert.equal(evaluateInvestment('', '100', '5', '10').state, 'empty')
  assert.equal(evaluateInvestment('-1', '100', '5', '10').state, 'invalid')
  assert.equal(evaluateInvestment('1000', '-1', '5', '10').state, 'invalid')
  assert.equal(evaluateInvestment('1000', '100', '-1', '10').state, 'invalid')
  assert.equal(evaluateInvestment('1000', '100', '5', '0').state, 'invalid')
  assert.equal(evaluateInvestment('0', '0', '5', '10').state, 'invalid')
})

// ---------------------------------------------------------- 27. Break-Even
test('break-even: a standard case', () => {
  const result = outcomeValue(evaluateBreakEven('10000', '6', '10'))!
  close(result.units, 2500)
  assert.equal(result.unitsRoundedUp, 2500)
  close(result.revenue, 25000)
  close(result.contributionMargin, 4)
  close(result.contributionMarginRatio, 40)
})

test('break-even: a fractional result rounds up to whole units', () => {
  const result = outcomeValue(evaluateBreakEven('1000', '3', '7'))!
  close(result.units, 250)
  assert.equal(result.unitsRoundedUp, 250)

  const awkward = outcomeValue(evaluateBreakEven('1000', '2.5', '9.99'))!
  assert.ok(!Number.isInteger(awkward.units))
  assert.equal(awkward.unitsRoundedUp, Math.ceil(awkward.units))
  assert.ok(awkward.unitsRoundedUp > awkward.units)
})

test('break-even: zero fixed costs break even immediately', () => {
  const result = outcomeValue(evaluateBreakEven('0', '4', '10'))!
  close(result.units, 0)
  close(result.revenue, 0)
})

test('break-even: no margin means no break-even point', () => {
  const equal = evaluateBreakEven('10000', '10', '10')
  assert.equal(equal.state, 'invalid')
  if (equal.state === 'invalid') assert.match(equal.message, /never repaid/)

  const below = evaluateBreakEven('10000', '12', '10')
  assert.equal(below.state, 'invalid')
  if (below.state === 'invalid') assert.match(below.message, /loses money/)
})

test('break-even: validation', () => {
  assert.equal(evaluateBreakEven('', '6', '10').state, 'empty')
  assert.equal(evaluateBreakEven('-1', '6', '10').state, 'invalid')
  assert.equal(evaluateBreakEven('1000', '-1', '10').state, 'invalid')
  assert.equal(evaluateBreakEven('1000', '6', '0').state, 'invalid')
  assert.equal(evaluateBreakEven('abc', '6', '10').state, 'invalid')
})

// ----------------------------------------------------------- 28. Fuel Cost
test('fuel cost: distance per unit of fuel, e.g. mpg', () => {
  const result = outcomeValue(evaluateFuelCost('distance-per-unit', '300', '30', '4'))!
  close(result.fuelUsed, 10)
  close(result.totalCost, 40)
  close(result.costPerDistanceUnit, 40 / 300, 1e-9)
})

test('fuel cost: fuel per 100 distance, e.g. litres per 100 km', () => {
  const result = outcomeValue(evaluateFuelCost('units-per-hundred', '400', '7.5', '1.6'))!
  close(result.fuelUsed, 30)
  close(result.totalCost, 48)
})

test('fuel cost: decimal efficiency', () => {
  const result = outcomeValue(evaluateFuelCost('distance-per-unit', '250', '42.5', '1.75'))!
  close(result.fuelUsed, 250 / 42.5, 1e-9)
  close(result.totalCost, (250 / 42.5) * 1.75, 1e-9)
})

test('fuel cost: a zero-distance trip costs nothing and never divides by zero', () => {
  const result = outcomeValue(evaluateFuelCost('distance-per-unit', '0', '30', '4'))!
  close(result.fuelUsed, 0)
  close(result.totalCost, 0)
  close(result.costPerDistanceUnit, 0)
  assert.ok(Number.isFinite(result.costPerDistanceUnit))
})

test('fuel cost: validation', () => {
  assert.equal(evaluateFuelCost('distance-per-unit', '', '30', '4').state, 'empty')
  assert.equal(evaluateFuelCost('distance-per-unit', '300', '0', '4').state, 'invalid')
  assert.equal(evaluateFuelCost('distance-per-unit', '300', '-5', '4').state, 'invalid')
  assert.equal(evaluateFuelCost('distance-per-unit', '-1', '30', '4').state, 'invalid')
  assert.equal(evaluateFuelCost('distance-per-unit', '300', '30', '-1').state, 'invalid')
  assert.equal(evaluateFuelCost('distance-per-unit', 'abc', '30', '4').state, 'invalid')
})

// ------------------------------------------------------- 29. Time Duration
test('time utils: parsing and rollover', () => {
  assert.equal(parseTimeInput('09:30'), 570)
  assert.equal(parseTimeInput('00:00'), 0)
  assert.equal(parseTimeInput('23:59'), 1439)
  assert.equal(parseTimeInput('24:00'), null)
  assert.equal(parseTimeInput('12:60'), null)
  assert.equal(parseTimeInput('nope'), null)

  assert.equal(minutesBetween(540, 1020), 480)
  assert.equal(minutesBetween(1380, 90), 150, '23:00 to 01:30 rolls over midnight')
  assert.equal(minutesBetween(600, 600), 0, 'equal times are zero, not a full day')
})

test('time duration: same-day spans', () => {
  const morning = outcomeValue(evaluateTimeDuration('09:00', '17:00'))!
  assert.equal(morning.hours, 8)
  assert.equal(morning.minutes, 0)
  assert.equal(morning.totalMinutes, 480)
  assert.equal(morning.crossesMidnight, false)
})

test('time duration: crossing midnight', () => {
  const overnight = outcomeValue(evaluateTimeDuration('23:00', '01:30'))!
  assert.equal(overnight.hours, 2)
  assert.equal(overnight.minutes, 30)
  assert.equal(overnight.totalMinutes, 150)
  assert.equal(overnight.crossesMidnight, true)
})

test('time duration: exact hours and minute-level spans', () => {
  assert.equal(outcomeValue(evaluateTimeDuration('10:00', '11:00'))!.totalMinutes, 60)
  assert.equal(outcomeValue(evaluateTimeDuration('10:00', '10:45'))!.totalMinutes, 45)
  assert.equal(outcomeValue(evaluateTimeDuration('10:15', '10:16'))!.totalMinutes, 1)
  assert.equal(outcomeValue(evaluateTimeDuration('08:00', '08:00'))!.totalMinutes, 0)
})

test('time duration: validation', () => {
  assert.equal(evaluateTimeDuration('', '17:00').state, 'empty')
  assert.equal(evaluateTimeDuration('25:00', '17:00').state, 'invalid')
  assert.equal(evaluateTimeDuration('09:00', 'nope').state, 'invalid')
})

// ---------------------------------------------------------- 30. Work Hours
test('work hours: a normal workday with a break', () => {
  const result = outcomeValue(evaluateWorkHours('09:00', '17:30', '60'))!
  assert.equal(result.gross.totalMinutes, 510)
  assert.equal(result.breakMinutes, 60)
  assert.equal(result.net.hours, 7)
  assert.equal(result.net.minutes, 30)
  assert.equal(result.net.totalMinutes, 450)
})

test('work hours: an overnight shift', () => {
  const result = outcomeValue(evaluateWorkHours('22:00', '06:00', '30'))!
  assert.equal(result.gross.totalMinutes, 480, '22:00 to 06:00 is eight hours')
  assert.equal(result.gross.crossesMidnight, true)
  assert.equal(result.net.hours, 7)
  assert.equal(result.net.minutes, 30)
  assert.equal(result.net.totalMinutes, 450)
})

test('work hours: no break leaves the gross unchanged', () => {
  const result = outcomeValue(evaluateWorkHours('09:00', '17:00', '0'))!
  assert.equal(result.gross.totalMinutes, 480)
  assert.equal(result.net.totalMinutes, 480)
})

test('work hours: a break equal to the shift leaves nothing worked', () => {
  const result = outcomeValue(evaluateWorkHours('09:00', '10:00', '60'))!
  assert.equal(result.net.totalMinutes, 0)
})

test('work hours: validation', () => {
  assert.equal(evaluateWorkHours('', '17:00', '30').state, 'empty')
  assert.equal(evaluateWorkHours('09:00', '17:00', '-10').state, 'invalid')
  assert.equal(evaluateWorkHours('09:00', '17:00', '12.5').state, 'invalid')
  assert.equal(evaluateWorkHours('09:00', '17:00', 'abc').state, 'invalid')
  assert.equal(evaluateWorkHours('09:00', '10:00', '90').state, 'invalid', 'break exceeds shift')
  assert.equal(evaluateWorkHours('25:00', '17:00', '30').state, 'invalid')
})
