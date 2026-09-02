/**
 * Coverage for calculators 31-40, against the shipped calculation modules.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import { outcomeValue } from '../lib/calculator-validation.ts'
import { evaluatePercentageDifference } from '../lib/calculations/percentage-difference.ts'
import { GRADE_SCALE, evaluateGrade, letterForPercentage } from '../lib/calculations/grade.ts'
import { evaluateMortgage } from '../lib/calculations/mortgage.ts'
import { evaluateSavings } from '../lib/calculations/savings.ts'
import { evaluateCommission } from '../lib/calculations/commission.ts'
import { evaluateDebtPayoff } from '../lib/calculations/debt-payoff.ts'
import { CURRENCIES, evaluateCurrency } from '../lib/calculations/currency.ts'
import { evaluateConcrete } from '../lib/calculations/concrete.ts'
import { evaluateDateCalculator } from '../lib/calculations/date-calculator.ts'
import { TIME_ZONES, evaluateTimeZone } from '../lib/calculations/timezone.ts'
import { calculateLoanPayment } from '../lib/calculations/loan-payment.ts'
import { calculateInvestment } from '../lib/calculations/investment.ts'

const close = (actual: number, expected: number, tolerance = 1e-9) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  )

// ------------------------------------------------ 31. Percentage Difference
test('percentage difference: equal numbers are zero percent apart', () => {
  close(outcomeValue(evaluatePercentageDifference('50', '50'))!.percentDifference, 0)
  close(outcomeValue(evaluatePercentageDifference('0.5', '0.5'))!.percentDifference, 0)
})

test('percentage difference: standard cases', () => {
  // |40 - 60| / 50 * 100 = 40%
  close(outcomeValue(evaluatePercentageDifference('40', '60'))!.percentDifference, 40)
  // |10 - 20| / 15 * 100 = 66.6667%
  close(outcomeValue(evaluatePercentageDifference('10', '20'))!.percentDifference, 66.66666666666666)
  close(outcomeValue(evaluatePercentageDifference('100', '110'))!.percentDifference, 9.523809523809524)
})

test('percentage difference: order does not matter', () => {
  const forward = outcomeValue(evaluatePercentageDifference('40', '60'))!
  const reversed = outcomeValue(evaluatePercentageDifference('60', '40'))!
  close(forward.percentDifference, reversed.percentDifference)
})

test('percentage difference: decimals and one zero value', () => {
  close(outcomeValue(evaluatePercentageDifference('2.5', '7.5'))!.percentDifference, 100)
  // |0 - 20| / 10 * 100 = 200%
  close(outcomeValue(evaluatePercentageDifference('0', '20'))!.percentDifference, 200)
})

test('percentage difference: an average of zero is rejected', () => {
  assert.equal(evaluatePercentageDifference('0', '0').state, 'invalid')
  assert.equal(evaluatePercentageDifference('5', '-5').state, 'invalid')
  assert.equal(evaluatePercentageDifference('', '5').state, 'empty')
  assert.equal(evaluatePercentageDifference('abc', '5').state, 'invalid')
})

// ------------------------------------------------------------- 32. Grade
test('grade: normal, zero and full marks', () => {
  const normal = outcomeValue(evaluateGrade('45', '50'))!
  close(normal.percentage, 90)
  assert.equal(normal.letter, 'A-')

  const zero = outcomeValue(evaluateGrade('0', '50'))!
  close(zero.percentage, 0)
  assert.equal(zero.letter, 'F')

  const full = outcomeValue(evaluateGrade('50', '50'))!
  close(full.percentage, 100)
  assert.equal(full.letter, 'A+')
  assert.equal(full.isExtraCredit, false)
})

test('grade: the documented scale maps at its boundaries', () => {
  assert.equal(letterForPercentage(97), 'A+')
  assert.equal(letterForPercentage(96.9), 'A')
  assert.equal(letterForPercentage(93), 'A')
  assert.equal(letterForPercentage(90), 'A-')
  assert.equal(letterForPercentage(89.9), 'B+')
  assert.equal(letterForPercentage(60), 'D-')
  assert.equal(letterForPercentage(59.9), 'F')
  assert.equal(letterForPercentage(0), 'F')

  // Every band must be reachable, and the scale must end at zero.
  assert.equal(GRADE_SCALE[GRADE_SCALE.length - 1].minimum, 0)
  assert.equal(new Set(GRADE_SCALE.map((band) => band.letter)).size, GRADE_SCALE.length)
})

test('grade: extra credit is allowed and flagged', () => {
  const extra = outcomeValue(evaluateGrade('55', '50'))!
  close(extra.percentage, 110)
  assert.equal(extra.letter, 'A+')
  assert.equal(extra.isExtraCredit, true)
})

test('grade: validation', () => {
  assert.equal(evaluateGrade('', '50').state, 'empty')
  assert.equal(evaluateGrade('45', '0').state, 'invalid')
  assert.equal(evaluateGrade('45', '-10').state, 'invalid')
  assert.equal(evaluateGrade('-1', '50').state, 'invalid')
  assert.equal(evaluateGrade('abc', '50').state, 'invalid')
})

// ---------------------------------------------------------- 33. Mortgage
test('mortgage: a standard loan with a deposit', () => {
  const result = outcomeValue(evaluateMortgage('300000', '60000', '6', '30'))!
  assert.equal(result.loanAmount, 240000)
  assert.equal(result.months, 360)
  close(result.downPaymentPercent, 20)

  // Delegates to the amortisation formula rather than repeating it.
  close(result.monthlyPayment, calculateLoanPayment(240000, 6, 360).monthlyPayment, 1e-9)
  assert.ok(result.totalInterest > 0)
  close(result.totalPaid, result.monthlyPayment * 360, 1e-7)
})

test('mortgage: a zero-interest loan divides evenly', () => {
  const result = outcomeValue(evaluateMortgage('240000', '40000', '0', '20'))!
  assert.equal(result.loanAmount, 200000)
  close(result.monthlyPayment, 200000 / 240)
  close(result.totalInterest, 0)
})

test('mortgage: a shorter term costs less interest but more per month', () => {
  const fifteen = outcomeValue(evaluateMortgage('300000', '60000', '6', '15'))!
  const thirty = outcomeValue(evaluateMortgage('300000', '60000', '6', '30'))!

  assert.ok(fifteen.monthlyPayment > thirty.monthlyPayment)
  assert.ok(fifteen.totalInterest < thirty.totalInterest)
})

test('mortgage: no deposit borrows the full price', () => {
  const result = outcomeValue(evaluateMortgage('250000', '0', '5', '30'))!
  assert.equal(result.loanAmount, 250000)
  close(result.downPaymentPercent, 0)
})

test('mortgage: validation', () => {
  assert.equal(evaluateMortgage('', '60000', '6', '30').state, 'empty')
  assert.equal(evaluateMortgage('0', '0', '6', '30').state, 'invalid')
  assert.equal(evaluateMortgage('300000', '-1', '6', '30').state, 'invalid')
  assert.equal(evaluateMortgage('300000', '300000', '6', '30').state, 'invalid', 'nothing to borrow')
  assert.equal(evaluateMortgage('300000', '400000', '6', '30').state, 'invalid')
  assert.equal(evaluateMortgage('300000', '60000', '-1', '30').state, 'invalid')
  assert.equal(evaluateMortgage('300000', '60000', '6', '0').state, 'invalid')
})

// ----------------------------------------------------------- 34. Savings
test('savings: contributions with interest', () => {
  const result = outcomeValue(evaluateSavings('1000', '200', '4', '10'))!
  assert.equal(result.months, 120)
  close(result.totalContributions, 1000 + 200 * 120)
  assert.ok(result.interestEarned > 0)
  close(result.finalBalance, result.totalContributions + result.interestEarned, 1e-9)

  // Shares the Investment Calculator's model rather than duplicating it.
  close(result.finalBalance, calculateInvestment(1000, 200, 4, 10).finalValue, 1e-9)
})

test('savings: zero interest is just the money paid in', () => {
  const result = outcomeValue(evaluateSavings('500', '100', '0', '5'))!
  close(result.finalBalance, 500 + 100 * 60)
  close(result.interestEarned, 0)
})

test('savings: a lump sum with no contributions still compounds', () => {
  const result = outcomeValue(evaluateSavings('10000', '0', '5', '10'))!
  close(result.totalContributions, 10000)
  assert.ok(result.interestEarned > 0)
  close(result.finalBalance, 10000 * Math.pow(1 + 0.05 / 12, 120), 1e-9)
})

test('savings: contributions with no starting balance', () => {
  const result = outcomeValue(evaluateSavings('0', '250', '3', '5'))!
  close(result.totalContributions, 250 * 60)
  assert.ok(result.finalBalance > result.totalContributions)
})

test('savings: validation', () => {
  assert.equal(evaluateSavings('', '100', '3', '5').state, 'empty')
  assert.equal(evaluateSavings('-1', '100', '3', '5').state, 'invalid')
  assert.equal(evaluateSavings('1000', '-1', '3', '5').state, 'invalid')
  assert.equal(evaluateSavings('1000', '100', '-1', '5').state, 'invalid')
  assert.equal(evaluateSavings('1000', '100', '3', '0').state, 'invalid')
  assert.equal(evaluateSavings('0', '0', '3', '5').state, 'invalid')
})

// -------------------------------------------------------- 35. Commission
test('commission: normal rates', () => {
  const result = outcomeValue(evaluateCommission('5000', '10'))!
  close(result.commission, 500)
  close(result.netAmount, 4500)
  close(result.totalWithCommission, 5500)

  close(outcomeValue(evaluateCommission('250000', '3'))!.commission, 7500)
})

test('commission: zero rate and zero sale', () => {
  const noRate = outcomeValue(evaluateCommission('5000', '0'))!
  close(noRate.commission, 0)
  close(noRate.netAmount, 5000)

  const noSale = outcomeValue(evaluateCommission('0', '10'))!
  close(noSale.commission, 0)
})

test('commission: decimal rates and amounts', () => {
  const result = outcomeValue(evaluateCommission('1875.50', '2.5'))!
  close(result.commission, 1875.5 * 0.025, 1e-9)
  close(result.netAmount, 1875.5 - 1875.5 * 0.025, 1e-9)
})

test('commission: validation', () => {
  assert.equal(evaluateCommission('', '10').state, 'empty')
  assert.equal(evaluateCommission('-1', '10').state, 'invalid')
  assert.equal(evaluateCommission('5000', '-1').state, 'invalid')
  assert.equal(evaluateCommission('abc', '10').state, 'invalid')
})

// ------------------------------------------------------- 36. Debt Payoff
test('debt payoff: zero interest divides evenly', () => {
  const result = outcomeValue(evaluateDebtPayoff('1200', '0', '100'))!
  assert.equal(result.months, 12)
  close(result.totalPaid, 1200)
  close(result.totalInterest, 0)
})

test('debt payoff: a normal credit card balance', () => {
  const result = outcomeValue(evaluateDebtPayoff('5000', '18', '200'))!
  assert.ok(result.months > 0 && result.months < 1200)
  assert.ok(result.totalInterest > 0)
  // The totals must reconcile: everything paid is the balance plus interest.
  close(result.totalPaid, result.balance + result.totalInterest, 1e-6)
  // Every payment but the last is the full amount, so the total sits just under.
  assert.ok(result.totalPaid <= 200 * result.months + 1e-6)
  assert.ok(result.totalPaid > 200 * (result.months - 1))
})

test('debt payoff: a larger payment clears it sooner and costs less', () => {
  const slow = outcomeValue(evaluateDebtPayoff('5000', '18', '150'))!
  const fast = outcomeValue(evaluateDebtPayoff('5000', '18', '500'))!

  assert.ok(fast.months < slow.months)
  assert.ok(fast.totalInterest < slow.totalInterest)
})

test('debt payoff: a payment barely above the interest still finishes', () => {
  // 5000 at 18% costs 75 in interest in the first month.
  const result = outcomeValue(evaluateDebtPayoff('5000', '18', '80'))!
  close(result.firstMonthInterest, 75)
  assert.ok(result.months > 100, 'it takes a very long time, but it does end')
  assert.ok(Number.isFinite(result.totalPaid))
})

test('debt payoff: a payment below the monthly interest is rejected', () => {
  const tooLow = evaluateDebtPayoff('5000', '18', '70')
  assert.equal(tooLow.state, 'invalid')
  if (tooLow.state === 'invalid') assert.match(tooLow.message, /does not cover the interest/)

  // Exactly equal to the interest never reduces the balance either.
  assert.equal(evaluateDebtPayoff('5000', '18', '75').state, 'invalid')
})

test('debt payoff: validation', () => {
  assert.equal(evaluateDebtPayoff('', '18', '200').state, 'empty')
  assert.equal(evaluateDebtPayoff('0', '18', '200').state, 'invalid')
  assert.equal(evaluateDebtPayoff('-100', '18', '200').state, 'invalid')
  assert.equal(evaluateDebtPayoff('5000', '-1', '200').state, 'invalid')
  assert.equal(evaluateDebtPayoff('5000', '18', '0').state, 'invalid')
  assert.equal(evaluateDebtPayoff('5000', '18', '-50').state, 'invalid')
})

// ----------------------------------------------------------- 37. Currency
test('currency: a simple conversion at a supplied rate', () => {
  const result = outcomeValue(evaluateCurrency('100', 'USD', 'EUR', '0.92'))!
  close(result.convertedAmount, 92)
  close(result.rate, 0.92)
  close(result.inverseRate, 1 / 0.92, 1e-9)
  assert.equal(result.sameCurrency, false)
})

test('currency: the same currency is always 1:1', () => {
  const result = outcomeValue(evaluateCurrency('100', 'USD', 'USD', ''))!
  close(result.convertedAmount, 100)
  close(result.rate, 1)
  assert.equal(result.sameCurrency, true)
})

test('currency: decimal amounts and rates', () => {
  const result = outcomeValue(evaluateCurrency('249.99', 'GBP', 'JPY', '188.4523'))!
  close(result.convertedAmount, 249.99 * 188.4523, 1e-9)
})

test('currency: a missing or invalid rate is rejected', () => {
  assert.equal(evaluateCurrency('100', 'USD', 'EUR', '').state, 'empty')
  assert.equal(evaluateCurrency('100', 'USD', 'EUR', '0').state, 'invalid')
  assert.equal(evaluateCurrency('100', 'USD', 'EUR', '-1').state, 'invalid')
  assert.equal(evaluateCurrency('100', 'USD', 'EUR', 'abc').state, 'invalid')
  assert.equal(evaluateCurrency('-5', 'USD', 'EUR', '0.92').state, 'invalid')
})

test('currency: the code list is well formed and holds no rates', () => {
  assert.ok(CURRENCIES.length >= 10)
  assert.equal(new Set(CURRENCIES.map((c) => c.code)).size, CURRENCIES.length)
  for (const currency of CURRENCIES) {
    assert.match(currency.code, /^[A-Z]{3}$/)
    // A stored rate would go stale and mislead; there must not be one.
    assert.deepEqual(Object.keys(currency).sort(), ['code', 'name'])
  }
})

// ----------------------------------------------------------- 38. Concrete
test('concrete: an imperial slab', () => {
  // 10 ft x 10 ft x 4 in = 33.33 cubic feet = 1.2346 cubic yards
  const result = outcomeValue(evaluateConcrete('imperial', '10', '10', '4', '0'))!
  close(result.cubicFeet, (10 * 10 * 4) / 12, 1e-9)
  close(result.cubicYards, 100 / 3 / 27, 1e-9)
  close(result.withWasteCubicYards, result.cubicYards, 1e-9)
})

test('concrete: a metric slab', () => {
  // 4 m x 3 m x 10 cm = 1.2 cubic metres
  const result = outcomeValue(evaluateConcrete('metric', '4', '3', '10', '0'))!
  close(result.cubicMeters, 1.2, 1e-9)
  close(result.cubicYards, 1.2 / 0.764554857984, 1e-9)
})

test('concrete: the three volume units always agree', () => {
  const result = outcomeValue(evaluateConcrete('imperial', '12', '8', '6', '0'))!
  close(result.cubicFeet / 27, result.cubicYards, 1e-9)
  close(result.cubicMeters / 0.028316846592, result.cubicFeet, 1e-9)
})

test('concrete: the waste allowance scales the order', () => {
  const result = outcomeValue(evaluateConcrete('metric', '4', '3', '10', '10'))!
  close(result.withWasteCubicMeters, 1.2 * 1.1, 1e-9)
  close(result.withWasteCubicYards, result.cubicYards * 1.1, 1e-9)

  // Blank means no allowance rather than an error.
  const blank = outcomeValue(evaluateConcrete('metric', '4', '3', '10', ''))!
  close(blank.withWasteCubicMeters, blank.cubicMeters, 1e-9)
})

test('concrete: validation', () => {
  assert.equal(evaluateConcrete('metric', '', '3', '10', '0').state, 'empty')
  assert.equal(evaluateConcrete('metric', '0', '3', '10', '0').state, 'invalid')
  assert.equal(evaluateConcrete('metric', '4', '-1', '10', '0').state, 'invalid')
  assert.equal(evaluateConcrete('metric', '4', '3', '0', '0').state, 'invalid')
  assert.equal(evaluateConcrete('metric', '4', '3', '10', '-5').state, 'invalid')
  assert.equal(evaluateConcrete('metric', '4', '3', '10', '150').state, 'invalid')
  assert.equal(evaluateConcrete('metric', 'abc', '3', '10', '0').state, 'invalid')
})

// --------------------------------------------------------------- 39. Date
test('date calculator: adding days', () => {
  const result = outcomeValue(evaluateDateCalculator('2024-01-01', '30', 'add'))!
  assert.equal(result.formatted, '2024-01-31')
  assert.equal(result.weekday, 'Wednesday')

  assert.equal(outcomeValue(evaluateDateCalculator('2024-03-10', '0', 'add'))!.formatted, '2024-03-10')
})

test('date calculator: subtracting days', () => {
  assert.equal(
    outcomeValue(evaluateDateCalculator('2024-03-10', '10', 'subtract'))!.formatted,
    '2024-02-29',
  )
  assert.equal(
    outcomeValue(evaluateDateCalculator('2024-01-05', '10', 'subtract'))!.formatted,
    '2023-12-26',
  )
})

test('date calculator: leap years', () => {
  // 2024 is a leap year, so 28 February plus one day is the 29th.
  assert.equal(
    outcomeValue(evaluateDateCalculator('2024-02-28', '1', 'add'))!.formatted,
    '2024-02-29',
  )
  // 2023 is not, so the same sum lands on 1 March.
  assert.equal(
    outcomeValue(evaluateDateCalculator('2023-02-28', '1', 'add'))!.formatted,
    '2023-03-01',
  )
  // A full year from a leap day.
  assert.equal(
    outcomeValue(evaluateDateCalculator('2024-02-29', '365', 'add'))!.formatted,
    '2025-02-28',
  )
})

test('date calculator: month and year boundaries', () => {
  assert.equal(
    outcomeValue(evaluateDateCalculator('2024-01-31', '1', 'add'))!.formatted,
    '2024-02-01',
  )
  assert.equal(
    outcomeValue(evaluateDateCalculator('2023-12-31', '1', 'add'))!.formatted,
    '2024-01-01',
  )
  assert.equal(
    outcomeValue(evaluateDateCalculator('2024-01-01', '365', 'add'))!.formatted,
    '2024-12-31',
    '2024 has 366 days, so 365 lands on 31 December',
  )
})

test('date calculator: validation', () => {
  assert.equal(evaluateDateCalculator('', '30', 'add').state, 'empty')
  assert.equal(evaluateDateCalculator('2023-02-29', '30', 'add').state, 'invalid')
  assert.equal(evaluateDateCalculator('2024-01-01', '1.5', 'add').state, 'invalid')
  assert.equal(evaluateDateCalculator('2024-01-01', '-5', 'add').state, 'invalid')
  assert.equal(evaluateDateCalculator('2024-01-01', 'abc', 'add').state, 'invalid')
})

// ----------------------------------------------------------- 40. Time Zone
test('time zone: the same zone leaves the time unchanged', () => {
  const result = outcomeValue(evaluateTimeZone('2024-06-01', '09:00', 'UTC', 'UTC'))!
  assert.equal(result.date, '2024-06-01')
  assert.equal(result.time, '09:00')
  assert.equal(result.dayShift, 0)
})

test('time zone: a common conversion in winter', () => {
  const result = outcomeValue(evaluateTimeZone('2024-01-15', '12:00', 'UTC', 'America/New_York'))!
  assert.equal(result.time, '07:00', 'New York is five hours behind UTC in winter')
  assert.equal(result.abbreviation, 'EST')
  assert.equal(result.offsetMinutes, -300)
})

test('time zone: daylight saving is applied from the runtime data', () => {
  const summer = outcomeValue(evaluateTimeZone('2024-07-15', '12:00', 'UTC', 'America/New_York'))!
  assert.equal(summer.time, '08:00', 'four hours behind on daylight time')
  assert.equal(summer.abbreviation, 'EDT')
  assert.equal(summer.offsetMinutes, -240)
})

test('time zone: conversions that cross the date line forward and back', () => {
  const forward = outcomeValue(
    evaluateTimeZone('2024-01-15', '23:00', 'America/New_York', 'Europe/London'),
  )!
  assert.equal(forward.date, '2024-01-16')
  assert.equal(forward.time, '04:00')
  assert.equal(forward.dayShift, 1)

  const backward = outcomeValue(
    evaluateTimeZone('2024-01-15', '02:00', 'Asia/Tokyo', 'America/Los_Angeles'),
  )!
  assert.equal(backward.date, '2024-01-14')
  assert.equal(backward.dayShift, -1)
})

test('time zone: half-hour offsets', () => {
  const result = outcomeValue(evaluateTimeZone('2024-06-01', '09:00', 'Asia/Kolkata', 'UTC'))!
  assert.equal(result.time, '03:30', 'Kolkata is five and a half hours ahead')
  assert.equal(result.offsetMinutes, 0)
})

test('time zone: round-tripping returns the original wall time', () => {
  for (const [date, time, zone] of [
    ['2024-01-15', '08:30', 'Europe/Paris'],
    ['2024-07-15', '17:45', 'Australia/Sydney'],
    ['2024-03-01', '00:15', 'America/Chicago'],
  ] as const) {
    const there = outcomeValue(evaluateTimeZone(date, time, zone, 'UTC'))!
    const back = outcomeValue(evaluateTimeZone(there.date, there.time, 'UTC', zone))!
    assert.equal(back.date, date, `${date} ${time} ${zone}`)
    assert.equal(back.time, time, `${date} ${time} ${zone}`)
  }
})

test('time zone: validation and the supported zone list', () => {
  assert.equal(evaluateTimeZone('', '09:00', 'UTC', 'UTC').state, 'empty')
  assert.equal(evaluateTimeZone('2023-02-29', '09:00', 'UTC', 'UTC').state, 'invalid')
  assert.equal(evaluateTimeZone('2024-06-01', '25:00', 'UTC', 'UTC').state, 'invalid')
  assert.equal(evaluateTimeZone('2024-06-01', '09:00', 'Mars/Olympus', 'UTC').state, 'invalid')

  assert.ok(TIME_ZONES.length >= 10)
  assert.equal(new Set(TIME_ZONES.map((z) => z.id)).size, TIME_ZONES.length)
})
