import test from 'node:test'
import assert from 'node:assert/strict'

import { outcomeValue } from '../lib/calculator-validation.ts'
import {
  COMPOUNDING_PERIODS,
  evaluateCompoundInterest,
} from '../lib/calculations/compound-interest.ts'
import { evaluateLoanPayment, toMonths } from '../lib/calculations/loan-payment.ts'
import { evaluateRoi } from '../lib/calculations/roi.ts'

const close = (actual: number, expected: number, tolerance = 1e-9) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  )

// --------------------------------------------------------- Compound interest
test('compound interest: annual compounding', () => {
  const result = outcomeValue(evaluateCompoundInterest('1000', '5', 'annually', '10'))!
  close(result.finalAmount, 1000 * Math.pow(1.05, 10), 1e-9)
  close(result.finalAmount, 1628.894626777442, 1e-9)
  close(result.totalInterest, 628.894626777442, 1e-9)
  assert.equal(result.principal, 1000)
  assert.equal(result.periodsPerYear, 1)
})

test('compound interest: monthly and quarterly compound faster than annual', () => {
  const annual = outcomeValue(evaluateCompoundInterest('1000', '5', 'annually', '10'))!
  const quarterly = outcomeValue(evaluateCompoundInterest('1000', '5', 'quarterly', '10'))!
  const monthly = outcomeValue(evaluateCompoundInterest('1000', '5', 'monthly', '10'))!
  const daily = outcomeValue(evaluateCompoundInterest('1000', '5', 'daily', '10'))!

  close(quarterly.finalAmount, 1000 * Math.pow(1 + 0.05 / 4, 40), 1e-9)
  close(monthly.finalAmount, 1000 * Math.pow(1 + 0.05 / 12, 120), 1e-9)

  assert.ok(annual.finalAmount < quarterly.finalAmount)
  assert.ok(quarterly.finalAmount < monthly.finalAmount)
  assert.ok(monthly.finalAmount < daily.finalAmount)
})

test('compound interest: every documented frequency is supported', () => {
  assert.deepEqual(COMPOUNDING_PERIODS, {
    annually: 1,
    'semi-annually': 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  })
  for (const frequency of Object.keys(COMPOUNDING_PERIODS)) {
    assert.equal(evaluateCompoundInterest('1000', '5', frequency, '1').state, 'ok', frequency)
  }
})

test('compound interest: zero rate leaves the principal untouched', () => {
  const result = outcomeValue(evaluateCompoundInterest('1000', '0', 'monthly', '10'))!
  close(result.finalAmount, 1000)
  close(result.totalInterest, 0)
})

test('compound interest: decimal principal, rate and term', () => {
  const result = outcomeValue(evaluateCompoundInterest('1500.75', '3.25', 'quarterly', '2.5'))!
  close(result.finalAmount, 1500.75 * Math.pow(1 + 0.0325 / 4, 4 * 2.5), 1e-9)
})

test('compound interest: validation', () => {
  assert.equal(evaluateCompoundInterest('', '5', 'annually', '10').state, 'empty')
  assert.equal(evaluateCompoundInterest('0', '5', 'annually', '10').state, 'invalid')
  assert.equal(evaluateCompoundInterest('-100', '5', 'annually', '10').state, 'invalid')
  assert.equal(evaluateCompoundInterest('1000', '-1', 'annually', '10').state, 'invalid')
  assert.equal(evaluateCompoundInterest('1000', '5', 'annually', '0').state, 'invalid')
  assert.equal(evaluateCompoundInterest('1000', '5', 'annually', '-1').state, 'invalid')
  assert.equal(evaluateCompoundInterest('abc', '5', 'annually', '10').state, 'invalid')
  assert.equal(evaluateCompoundInterest('1000', '5', 'hourly', '10').state, 'invalid')
})

// ------------------------------------------------------------- Loan payment
test('loan payment: a standard 30-year loan', () => {
  const result = outcomeValue(evaluateLoanPayment('200000', '6', '30', 'years'))!
  assert.equal(result.months, 360)
  // Cross-checked against the amortisation formula computed independently.
  const monthlyRate = 6 / 100 / 12
  const growth = Math.pow(1 + monthlyRate, 360)
  close(result.monthlyPayment, (200000 * monthlyRate * growth) / (growth - 1), 1e-9)
  close(result.monthlyPayment, 1199.10, 0.01)
  close(result.totalPaid, result.monthlyPayment * 360, 1e-7)
  close(result.totalInterest, result.totalPaid - 200000, 1e-7)
  assert.ok(result.totalInterest > 0)
})

test('loan payment: zero interest divides evenly, never dividing by zero', () => {
  const result = outcomeValue(evaluateLoanPayment('12000', '0', '24', 'months'))!
  close(result.monthlyPayment, 500)
  close(result.totalPaid, 12000)
  close(result.totalInterest, 0)
})

test('loan payment: short term and decimal rate', () => {
  const short = outcomeValue(evaluateLoanPayment('5000', '7.5', '6', 'months'))!
  assert.equal(short.months, 6)
  assert.ok(short.monthlyPayment > 5000 / 6)
  assert.ok(short.totalInterest > 0)

  const decimal = outcomeValue(evaluateLoanPayment('15000', '4.25', '5', 'years'))!
  assert.equal(decimal.months, 60)
  const monthlyRate = 4.25 / 100 / 12
  const growth = Math.pow(1 + monthlyRate, 60)
  close(decimal.monthlyPayment, (15000 * monthlyRate * growth) / (growth - 1), 1e-9)
})

test('loan payment: a longer term costs more interest overall', () => {
  const fifteen = outcomeValue(evaluateLoanPayment('200000', '6', '15', 'years'))!
  const thirty = outcomeValue(evaluateLoanPayment('200000', '6', '30', 'years'))!

  assert.ok(fifteen.monthlyPayment > thirty.monthlyPayment)
  assert.ok(fifteen.totalInterest < thirty.totalInterest)
})

test('loan payment: term unit conversion', () => {
  assert.equal(toMonths(5, 'years'), 60)
  assert.equal(toMonths(18, 'months'), 18)
})

test('loan payment: validation', () => {
  assert.equal(evaluateLoanPayment('', '6', '30', 'years').state, 'empty')
  assert.equal(evaluateLoanPayment('0', '6', '30', 'years').state, 'invalid')
  assert.equal(evaluateLoanPayment('-1000', '6', '30', 'years').state, 'invalid')
  assert.equal(evaluateLoanPayment('200000', '-1', '30', 'years').state, 'invalid')
  assert.equal(evaluateLoanPayment('200000', '6', '0', 'years').state, 'invalid')
  assert.equal(evaluateLoanPayment('abc', '6', '30', 'years').state, 'invalid')
})

// ---------------------------------------------------------------------- ROI
test('roi: positive, zero and negative returns', () => {
  const gain = outcomeValue(evaluateRoi('1000', '1500'))!
  close(gain.gain, 500)
  close(gain.roiPercent, 50)

  const flat = outcomeValue(evaluateRoi('1000', '1000'))!
  close(flat.gain, 0)
  close(flat.roiPercent, 0)

  const loss = outcomeValue(evaluateRoi('1000', '800'))!
  close(loss.gain, -200)
  close(loss.roiPercent, -20)

  // A total loss is -100%, the floor for a non-negative final value.
  close(outcomeValue(evaluateRoi('1000', '0'))!.roiPercent, -100)
})

test('roi: decimal values', () => {
  const result = outcomeValue(evaluateRoi('2500.50', '3125.75'))!
  close(result.gain, 625.25, 1e-9)
  close(result.roiPercent, (625.25 / 2500.5) * 100, 1e-9)
})

test('roi: validation', () => {
  assert.equal(evaluateRoi('', '1500').state, 'empty')
  assert.equal(evaluateRoi('0', '1500').state, 'invalid')
  assert.equal(evaluateRoi('-100', '1500').state, 'invalid')
  assert.equal(evaluateRoi('1000', '-1').state, 'invalid')
  assert.equal(evaluateRoi('abc', '1500').state, 'invalid')
})
