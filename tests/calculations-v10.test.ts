/**
 * Coverage for calculators 41-50, against the shipped calculation modules.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import { outcomeValue } from '../lib/calculator-validation.ts'
import { evaluateMarkup } from '../lib/calculations/markup.ts'
import { evaluatePricePerUnit } from '../lib/calculations/price-per-unit.ts'
import { evaluateLoanInterest } from '../lib/calculations/loan-interest.ts'
import { evaluateFutureValue } from '../lib/calculations/future-value.ts'
import { evaluatePercentagePoints } from '../lib/calculations/percentage-point.ts'
import { evaluateRatioToPercentage } from '../lib/calculations/ratio-to-percentage.ts'
import { evaluatePace, formatPace } from '../lib/calculations/pace.ts'
import { evaluateCalorieDeficit } from '../lib/calculations/calorie-deficit.ts'
import { evaluateHours } from '../lib/calculations/hours.ts'
import { evaluateArea } from '../lib/calculations/area.ts'
import { calculateLoanPayment } from '../lib/calculations/loan-payment.ts'

const close = (actual: number, expected: number, tolerance = 1e-9) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  )

// ------------------------------------------------------------- 41. Markup
test('markup: adds the percentage to cost', () => {
  const result = outcomeValue(evaluateMarkup('100', '50'))!
  close(result.sellingPrice, 150)
  close(result.profit, 50)
  // The same profit is a third of the selling price, not a half.
  close(result.equivalentMarginPercent, 100 / 3)
})

test('markup: markup and margin are different numbers', () => {
  const result = outcomeValue(evaluateMarkup('60', '66.6666666667'))!
  close(result.sellingPrice, 100, 1e-6)
  close(result.equivalentMarginPercent, 40, 1e-6)
  assert.ok(result.markupPercent > result.equivalentMarginPercent)
})

test('markup: zero markup sells at cost', () => {
  const result = outcomeValue(evaluateMarkup('100', '0'))!
  close(result.sellingPrice, 100)
  close(result.profit, 0)
  close(result.equivalentMarginPercent, 0)
})

test('markup: doubling the price is a 100% markup and a 50% margin', () => {
  const result = outcomeValue(evaluateMarkup('25', '100'))!
  close(result.sellingPrice, 50)
  close(result.equivalentMarginPercent, 50)
})

test('markup: validation', () => {
  assert.equal(evaluateMarkup('', '50').state, 'empty')
  assert.equal(evaluateMarkup('0', '50').state, 'invalid')
  assert.equal(evaluateMarkup('-10', '50').state, 'invalid')
  assert.equal(evaluateMarkup('100', '-1').state, 'invalid')
  assert.equal(evaluateMarkup('abc', '50').state, 'invalid')
})

// ------------------------------------------------------ 42. Price per Unit
test('price per unit: the bigger pack is not always better', () => {
  // 2.00 for 500 is 0.004 each; 3.50 for 1000 is 0.0035 each.
  const result = outcomeValue(evaluatePricePerUnit('2.00', '500', '3.50', '1000'))!
  close(result.unitPriceA, 0.004)
  close(result.unitPriceB, 0.0035)
  assert.equal(result.better, 'b')
  close(result.savingPercent, 12.5)
})

test('price per unit: the smaller pack can win', () => {
  const result = outcomeValue(evaluatePricePerUnit('1.00', '500', '2.50', '1000'))!
  assert.equal(result.better, 'a')
  close(result.unitPriceA, 0.002)
  close(result.unitPriceB, 0.0025)
  close(result.savingPercent, 20)
})

test('price per unit: identical value', () => {
  const result = outcomeValue(evaluatePricePerUnit('2', '100', '4', '200'))!
  assert.equal(result.better, 'equal')
  close(result.savingPercent, 0)
  close(result.savingPerUnit, 0)
})

test('price per unit: a free item costs nothing per unit', () => {
  const result = outcomeValue(evaluatePricePerUnit('0', '100', '5', '100'))!
  assert.equal(result.better, 'a')
  close(result.unitPriceA, 0)
  close(result.savingPercent, 100)
})

test('price per unit: validation', () => {
  assert.equal(evaluatePricePerUnit('', '500', '3.50', '1000').state, 'empty')
  assert.equal(evaluatePricePerUnit('2', '0', '3.50', '1000').state, 'invalid')
  assert.equal(evaluatePricePerUnit('2', '500', '3.50', '-1').state, 'invalid')
  assert.equal(evaluatePricePerUnit('-2', '500', '3.50', '1000').state, 'invalid')
  assert.equal(evaluatePricePerUnit('abc', '500', '3.50', '1000').state, 'invalid')
})

// ------------------------------------------------------- 43. Loan Interest
test('loan interest: totals match the amortisation formula', () => {
  const result = outcomeValue(evaluateLoanInterest('20000', '7', '5'))!
  const loan = calculateLoanPayment(20000, 7, 60)

  assert.equal(result.months, 60)
  close(result.monthlyPayment, loan.monthlyPayment, 1e-9)
  close(result.totalInterest, loan.totalInterest, 1e-9)
  close(result.interestAsPercentOfPrincipal, (loan.totalInterest / 20000) * 100, 1e-9)
})

test('loan interest: the first payment is mostly interest, the last mostly principal', () => {
  const result = outcomeValue(evaluateLoanInterest('200000', '6', '30'))!

  close(result.firstPaymentInterest, 200000 * (0.06 / 12))
  close(result.firstPaymentInterest + result.firstPaymentPrincipal, result.monthlyPayment, 1e-9)
  assert.ok(result.firstPaymentInterest > result.firstPaymentPrincipal, 'front-loaded interest')
  assert.ok(result.lastPaymentPrincipal > result.firstPaymentPrincipal)
  // By the end, almost the whole payment goes to principal.
  assert.ok(result.lastPaymentPrincipal > result.monthlyPayment * 0.99)
})

test('loan interest: a zero-rate loan costs nothing in interest', () => {
  const result = outcomeValue(evaluateLoanInterest('12000', '0', '2'))!
  close(result.totalInterest, 0)
  close(result.firstPaymentInterest, 0)
  close(result.interestAsPercentOfPrincipal, 0)
  close(result.monthlyPayment, 500)
})

test('loan interest: a longer term costs proportionally more', () => {
  const short = outcomeValue(evaluateLoanInterest('200000', '6', '15'))!
  const long = outcomeValue(evaluateLoanInterest('200000', '6', '30'))!
  assert.ok(long.interestAsPercentOfPrincipal > short.interestAsPercentOfPrincipal)
})

test('loan interest: validation', () => {
  assert.equal(evaluateLoanInterest('', '7', '5').state, 'empty')
  assert.equal(evaluateLoanInterest('0', '7', '5').state, 'invalid')
  assert.equal(evaluateLoanInterest('20000', '-1', '5').state, 'invalid')
  assert.equal(evaluateLoanInterest('20000', '7', '0').state, 'invalid')
})

// ------------------------------------------------------- 44. Future Value
test('future value: growing a sum forward', () => {
  const result = outcomeValue(evaluateFutureValue('future', '1000', '5', '10'))!
  close(result.result, 1000 * Math.pow(1.05, 10), 1e-9)
  close(result.result, 1628.894626777442, 1e-9)
  close(result.difference, result.result - 1000, 1e-9)
})

test('future value: discounting a sum back to today', () => {
  const result = outcomeValue(evaluateFutureValue('present', '1628.894626777442', '5', '10'))!
  close(result.result, 1000, 1e-9)
  close(result.difference, 628.894626777442, 1e-9)
})

test('future value: the two directions are exact inverses', () => {
  const forward = outcomeValue(evaluateFutureValue('future', '2500', '4.5', '7'))!
  const back = outcomeValue(evaluateFutureValue('present', String(forward.result), '4.5', '7'))!
  close(back.result, 2500, 1e-9)
})

test('future value: a zero rate leaves the amount unchanged', () => {
  close(outcomeValue(evaluateFutureValue('future', '1000', '0', '10'))!.result, 1000)
  close(outcomeValue(evaluateFutureValue('present', '1000', '0', '10'))!.result, 1000)
})

test('future value: validation', () => {
  assert.equal(evaluateFutureValue('future', '', '5', '10').state, 'empty')
  assert.equal(evaluateFutureValue('future', '0', '5', '10').state, 'invalid')
  assert.equal(evaluateFutureValue('future', '1000', '-1', '10').state, 'invalid')
  assert.equal(evaluateFutureValue('future', '1000', '5', '0').state, 'invalid')
})

// --------------------------------------------------- 45. Percentage Points
test('percentage point: points and relative change are different numbers', () => {
  const result = outcomeValue(evaluatePercentagePoints('5', '6'))!
  close(result.pointChange, 1, 1e-9)
  close(result.relativeChange!, 20)
  assert.equal(result.direction, 'increase')
})

test('percentage point: a decrease', () => {
  const result = outcomeValue(evaluatePercentagePoints('8', '6'))!
  close(result.pointChange, -2)
  close(result.relativeChange!, -25)
  assert.equal(result.direction, 'decrease')
})

test('percentage point: no movement', () => {
  const result = outcomeValue(evaluatePercentagePoints('5', '5'))!
  close(result.pointChange, 0)
  close(result.relativeChange!, 0)
  assert.equal(result.direction, 'none')
})

test('percentage point: from zero there is no relative change', () => {
  const result = outcomeValue(evaluatePercentagePoints('0', '5'))!
  close(result.pointChange, 5)
  assert.equal(result.relativeChange, null, 'nothing to be relative to')
})

test('percentage point: validation', () => {
  assert.equal(evaluatePercentagePoints('', '6').state, 'empty')
  assert.equal(evaluatePercentagePoints('abc', '6').state, 'invalid')
  // Negative rates are legitimate, e.g. a rate of return.
  assert.equal(evaluatePercentagePoints('-2', '3').state, 'ok')
})

// ------------------------------------------------ 46. Ratio to Percentage
test('ratio to percentage: parts of the whole always total 100', () => {
  const result = outcomeValue(evaluateRatioToPercentage('2', '3'))!
  close(result.percentA, 40)
  close(result.percentB, 60)
  close(result.percentA + result.percentB, 100)
  close(result.total, 5)
})

test('ratio to percentage: a part of the whole is not a part of the other part', () => {
  const result = outcomeValue(evaluateRatioToPercentage('2', '3'))!
  close(result.percentA, 40, 1e-9)
  close(result.aAsPercentOfB!, 66.66666666666666, 1e-9)
})

test('ratio to percentage: equal parts split evenly', () => {
  const result = outcomeValue(evaluateRatioToPercentage('1', '1'))!
  close(result.percentA, 50)
  close(result.percentB, 50)
  close(result.aAsPercentOfB!, 100)
})

test('ratio to percentage: a zero part', () => {
  const result = outcomeValue(evaluateRatioToPercentage('3', '0'))!
  close(result.percentA, 100)
  close(result.percentB, 0)
  assert.equal(result.aAsPercentOfB, null, 'cannot be a percentage of zero')
})

test('ratio to percentage: validation', () => {
  assert.equal(evaluateRatioToPercentage('', '3').state, 'empty')
  assert.equal(evaluateRatioToPercentage('0', '0').state, 'invalid')
  assert.equal(evaluateRatioToPercentage('-1', '3').state, 'invalid')
  assert.equal(evaluateRatioToPercentage('abc', '3').state, 'invalid')
})

// ---------------------------------------------------------------- 47. Pace
test('pace: a 5 km run in 25 minutes', () => {
  const result = outcomeValue(evaluatePace('5', '0', '25', '0', 'km'))!
  close(result.paceSecondsPerUnit, 300)
  assert.equal(result.paceFormatted, '5:00')
  close(result.speed, 12)
})

test('pace: a marathon', () => {
  // 42.195 km in 4 hours.
  const result = outcomeValue(evaluatePace('42.195', '4', '0', '0', 'km'))!
  close(result.totalSeconds, 14400)
  close(result.paceSecondsPerUnit, 14400 / 42.195, 1e-9)
  assert.equal(result.paceFormatted, '5:41')
})

test('pace: seconds are carried into the pace', () => {
  const result = outcomeValue(evaluatePace('10', '0', '55', '30', 'km'))!
  close(result.totalSeconds, 3330)
  close(result.paceSecondsPerUnit, 333)
  assert.equal(result.paceFormatted, '5:33')
})

test('pace: formatting pads the seconds', () => {
  assert.equal(formatPace(300), '5:00')
  assert.equal(formatPace(365), '6:05')
  assert.equal(formatPace(59), '0:59')
  assert.equal(formatPace(3600), '60:00')
})

test('pace: validation', () => {
  assert.equal(evaluatePace('', '0', '25', '0', 'km').state, 'empty')
  assert.equal(evaluatePace('5', '', '', '', 'km').state, 'empty')
  assert.equal(evaluatePace('0', '0', '25', '0', 'km').state, 'invalid')
  assert.equal(evaluatePace('5', '0', '0', '0', 'km').state, 'invalid', 'no time entered')
  assert.equal(evaluatePace('5', '0', '-5', '0', 'km').state, 'invalid')
  assert.equal(evaluatePace('abc', '0', '25', '0', 'km').state, 'invalid')
})

// ------------------------------------------------------ 48. Calorie Deficit
test('calorie deficit: a standard 500 a day deficit', () => {
  const result = outcomeValue(evaluateCalorieDeficit('2500', '500'))!
  close(result.targetIntake, 2000)
  close(result.weeklyDeficit, 3500)
  close(result.weeklyLossLb, 1, 1e-9)
  close(result.weeklyLossKg, 3500 / 7700, 1e-9)
  assert.equal(result.isVeryLowIntake, false)
})

test('calorie deficit: no deficit means no projected change', () => {
  const result = outcomeValue(evaluateCalorieDeficit('2200', '0'))!
  close(result.targetIntake, 2200)
  close(result.weeklyLossKg, 0)
  close(result.weeklyLossLb, 0)
})

test('calorie deficit: a very low resulting intake is flagged', () => {
  const result = outcomeValue(evaluateCalorieDeficit('1800', '700'))!
  close(result.targetIntake, 1100)
  assert.equal(result.isVeryLowIntake, true)
})

test('calorie deficit: a deficit at or above maintenance is rejected', () => {
  assert.equal(evaluateCalorieDeficit('2000', '2000').state, 'invalid')
  assert.equal(evaluateCalorieDeficit('2000', '2500').state, 'invalid')
})

test('calorie deficit: validation', () => {
  assert.equal(evaluateCalorieDeficit('', '500').state, 'empty')
  assert.equal(evaluateCalorieDeficit('0', '500').state, 'invalid')
  assert.equal(evaluateCalorieDeficit('2500', '-1').state, 'invalid')
  assert.equal(evaluateCalorieDeficit('abc', '500').state, 'invalid')
})

// --------------------------------------------------------------- 49. Hours
const entry = (start: string, end: string) => ({ start, end })

test('hours: totals several entries', () => {
  const result = outcomeValue(
    evaluateHours([entry('09:00', '17:00'), entry('09:00', '12:30'), entry('13:00', '17:00')], ''),
  )!
  assert.equal(result.entries.length, 3)
  assert.equal(result.totalMinutes, 480 + 210 + 240)
  assert.equal(result.hours, 15)
  assert.equal(result.minutes, 30)
  close(result.decimalHours, 15.5)
  assert.equal(result.pay, null)
})

test('hours: an overnight entry sits alongside day ones', () => {
  const result = outcomeValue(
    evaluateHours([entry('09:00', '17:00'), entry('22:00', '06:00')], ''),
  )!
  assert.equal(result.entries[1].minutes, 480)
  assert.equal(result.entries[1].crossesMidnight, true)
  assert.equal(result.totalMinutes, 960)
  close(result.decimalHours, 16)
})

test('hours: blank rows are skipped', () => {
  const result = outcomeValue(
    evaluateHours([entry('09:00', '17:00'), entry('', ''), entry('10:00', '11:00')], ''),
  )!
  assert.equal(result.entries.length, 2)
  assert.equal(result.totalMinutes, 540)
})

test('hours: an hourly rate produces pay', () => {
  const result = outcomeValue(evaluateHours([entry('09:00', '17:30')], '20'))!
  close(result.decimalHours, 8.5)
  close(result.pay!, 170)
  close(result.hourlyRate!, 20)
})

test('hours: validation', () => {
  assert.equal(evaluateHours([entry('', '')], '').state, 'empty')
  assert.equal(evaluateHours([], '').state, 'empty')
  assert.equal(evaluateHours([entry('09:00', '')], '').state, 'invalid', 'half-filled row')
  assert.equal(evaluateHours([entry('25:00', '17:00')], '').state, 'invalid')
  assert.equal(evaluateHours([entry('09:00', '17:00')], 'abc').state, 'invalid')
  assert.equal(evaluateHours([entry('09:00', '17:00')], '-5').state, 'invalid')
})

// ---------------------------------------------------------------- 50. Area
test('area: a rectangular room', () => {
  const result = outcomeValue(evaluateArea('rectangle', 'metric', '5', '4'))!
  close(result.squareMeters, 20)
  close(result.squareFeet, 20 / 0.09290304, 1e-9)
  close(result.perimeterOrCircumference, 18)
})

test('area: imperial input converts consistently', () => {
  const result = outcomeValue(evaluateArea('rectangle', 'imperial', '10', '12'))!
  close(result.squareFeet, 120, 1e-9)
  close(result.squareMeters, 120 * 0.09290304, 1e-9)
  close(result.squareYards, 120 / 9, 1e-9)
})

test('area: a circle from its radius', () => {
  const result = outcomeValue(evaluateArea('circle', 'metric', '3', ''))!
  close(result.squareMeters, Math.PI * 9, 1e-9)
  close(result.perimeterOrCircumference, 2 * Math.PI * 3, 1e-9)
})

test('area: a triangle is half the rectangle', () => {
  const triangle = outcomeValue(evaluateArea('triangle', 'metric', '6', '4'))!
  const rectangle = outcomeValue(evaluateArea('rectangle', 'metric', '6', '4'))!
  close(triangle.squareMeters, 12)
  close(triangle.squareMeters, rectangle.squareMeters / 2, 1e-9)
})

test('area: the three unit figures always agree', () => {
  const result = outcomeValue(evaluateArea('rectangle', 'metric', '7', '3'))!
  close(result.squareFeet / 9, result.squareYards, 1e-9)
  close(result.squareMeters / 0.09290304, result.squareFeet, 1e-9)
})

test('area: validation', () => {
  assert.equal(evaluateArea('rectangle', 'metric', '', '4').state, 'empty')
  assert.equal(evaluateArea('rectangle', 'metric', '5', '').state, 'empty')
  assert.equal(evaluateArea('circle', 'metric', '', '').state, 'empty')
  assert.equal(evaluateArea('rectangle', 'metric', '0', '4').state, 'invalid')
  assert.equal(evaluateArea('rectangle', 'metric', '5', '-1').state, 'invalid')
  assert.equal(evaluateArea('circle', 'metric', '-2', '').state, 'invalid')
  assert.equal(evaluateArea('rectangle', 'metric', 'abc', '4').state, 'invalid')
})
