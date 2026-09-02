import test from 'node:test'
import assert from 'node:assert/strict'

import {
  allFilled,
  anyBlank,
  empty,
  invalid,
  isBlank,
  isInteger,
  isNonNegative,
  isNonZero,
  isPercentage,
  isPositive,
  isPositiveInteger,
  isSafeInteger,
  isValidNumber,
  ok,
  outcomeValue,
  parseNumbers,
} from '../lib/calculator-validation.ts'

test('outcome constructors produce the documented shapes', () => {
  assert.deepEqual(empty(), { state: 'empty' })
  assert.deepEqual(invalid('nope'), { state: 'invalid', message: 'nope' })
  assert.deepEqual(ok(42), { state: 'ok', value: 42 })
})

test('outcomeValue unwraps ok and returns null otherwise', () => {
  assert.equal(outcomeValue(ok(7)), 7)
  assert.equal(outcomeValue(empty<number>()), null)
  assert.equal(outcomeValue(invalid<number>('bad')), null)
  // A falsy payload must still come back, not be confused with "no value".
  assert.equal(outcomeValue(ok(0)), 0)
})

test('isBlank treats whitespace as empty but not zero', () => {
  assert.equal(isBlank(''), true)
  assert.equal(isBlank('   '), true)
  assert.equal(isBlank('0'), false)
})

test('allFilled and anyBlank are complements over a field group', () => {
  assert.equal(allFilled('1', '2', '3'), true)
  assert.equal(allFilled('1', '', '3'), false)
  assert.equal(anyBlank('1', '2'), false)
  assert.equal(anyBlank('1', '  '), true)
})

test('parseNumbers converts valid input and rejects anything non-finite', () => {
  assert.deepEqual(parseNumbers('1', '2.5', '-3'), [1, 2.5, -3])
  assert.equal(parseNumbers('1', 'abc'), null)
  assert.equal(parseNumbers('Infinity'), null)
  // A blank parses as 0, which is why callers must check anyBlank first.
  assert.deepEqual(parseNumbers(''), [0])
})

test('numeric predicates', () => {
  assert.equal(isValidNumber(1), true)
  assert.equal(isValidNumber(Number.NaN), false)

  assert.equal(isPositive(1), true)
  assert.equal(isPositive(0), false)
  assert.equal(isPositive(-1), false)

  assert.equal(isNonNegative(0), true)
  assert.equal(isNonNegative(-0.1), false)

  assert.equal(isNonZero(0), false)
  assert.equal(isNonZero(-2), true)

  assert.equal(isPercentage(0), true)
  assert.equal(isPercentage(100), true)
  assert.equal(isPercentage(100.1), false)
  assert.equal(isPercentage(-1), false)

  assert.equal(isInteger(4), true)
  assert.equal(isInteger(4.5), false)

  assert.equal(isPositiveInteger(1), true)
  assert.equal(isPositiveInteger(0), false)
  assert.equal(isPositiveInteger(2.5), false)

  assert.equal(isSafeInteger(2 ** 53 - 1), true)
  assert.equal(isSafeInteger(2 ** 53), false)
})
