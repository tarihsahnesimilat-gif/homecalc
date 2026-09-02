/**
 * Parser tests for the scientific calculator.
 *
 * The evaluator is hand-written precisely so that user input never reaches
 * `eval` or `new Function`, so these cases cover both correctness and the
 * rejection of anything outside the supported grammar.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import { outcomeValue } from '../lib/calculator-validation.ts'
import { type AngleMode, evaluateExpression } from '../lib/calculations/scientific.ts'

const value = (expression: string, mode: AngleMode = 'degrees') =>
  outcomeValue(evaluateExpression(expression, mode))

const close = (actual: number | null, expected: number, tolerance = 1e-9) =>
  assert.ok(
    actual !== null && Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  )

test('scientific: basic arithmetic', () => {
  assert.equal(value('2+3'), 5)
  assert.equal(value('10-4'), 6)
  assert.equal(value('6*7'), 42)
  assert.equal(value('20/4'), 5)
  assert.equal(value('2.5+1.25'), 3.75)
  assert.equal(value('-5+8'), 3)
})

test('scientific: operator precedence', () => {
  assert.equal(value('2+3*4'), 14, 'multiplication binds tighter than addition')
  assert.equal(value('2*3+4'), 10)
  assert.equal(value('10-2*3'), 4)
  assert.equal(value('10/2+3'), 8)
  assert.equal(value('1+2*3-4/2'), 5)
})

test('scientific: parentheses override precedence', () => {
  assert.equal(value('(2+3)*4'), 20)
  assert.equal(value('2*(3+4)'), 14)
  assert.equal(value('((2+3))*2'), 10)
  assert.equal(value('(1+2)*(3+4)'), 21)
  assert.equal(value('-(2+3)'), -5)
})

test('scientific: powers are right-associative', () => {
  assert.equal(value('2^3'), 8)
  assert.equal(value('2^3^2'), 512, '2^(3^2), not (2^3)^2')
  assert.equal(value('-2^2'), -4, 'the power binds tighter than the sign')
  assert.equal(value('2^-1'), 0.5)
  assert.equal(value('9^0.5'), 3)
})

test('scientific: square root', () => {
  assert.equal(value('sqrt(16)'), 4)
  assert.equal(value('sqrt(2)'), 1.41421356237)
  assert.equal(value('sqrt(9)+sqrt(4)'), 5)
  assert.equal(evaluateExpression('sqrt(-1)').state, 'invalid', 'not a real number')
})

test('scientific: reciprocal and percentage', () => {
  assert.equal(value('inv(4)'), 0.25)
  assert.equal(evaluateExpression('inv(0)').state, 'invalid')
  // Postfix % divides by 100, so 50% is 0.5.
  assert.equal(value('50%'), 0.5)
  assert.equal(value('200*10%'), 20)
})

test('scientific: trigonometry in degrees', () => {
  assert.equal(value('sin(0)'), 0)
  assert.equal(value('sin(30)'), 0.5)
  assert.equal(value('sin(90)'), 1)
  assert.equal(value('sin(180)'), 0, 'exact, not 1.22e-16')
  assert.equal(value('cos(0)'), 1)
  assert.equal(value('cos(90)'), 0, 'exact, not 6.12e-17')
  assert.equal(value('cos(180)'), -1)
  assert.equal(value('tan(0)'), 0)
  assert.equal(value('tan(45)'), 1)
  assert.equal(evaluateExpression('tan(90)').state, 'invalid', 'undefined at a quarter turn')
})

test('scientific: trigonometry in radians', () => {
  assert.equal(value('sin(0)', 'radians'), 0)
  close(value('sin(pi/2)', 'radians'), 1)
  close(value('cos(pi)', 'radians'), -1)
  // The same number means different things in each mode.
  assert.equal(value('sin(90)', 'degrees'), 1)
  assert.notEqual(value('sin(90)', 'radians'), 1)
})

test('scientific: constants', () => {
  assert.equal(value('pi'), 3.14159265359)
  assert.equal(value('e'), 2.71828182846)
  close(value('2*pi'), 2 * Math.PI, 1e-9)
  close(value('e^2'), Math.E ** 2, 1e-9)
})

test('scientific: divide by zero is rejected rather than returning Infinity', () => {
  const divideByZero = evaluateExpression('1/0')
  assert.equal(divideByZero.state, 'invalid')
  assert.equal(evaluateExpression('5/(3-3)').state, 'invalid')
  if (divideByZero.state === 'invalid') assert.match(divideByZero.message, /zero/)
})

test('scientific: malformed expressions are rejected, never executed', () => {
  for (const expression of [
    '2+',
    '*3',
    '((2)',
    '2)',
    '2**3',
    'sqrt',
    'sqrt 16',
    'foo(2)',
    '2 3',
    '()',
    '2^',
  ]) {
    assert.equal(evaluateExpression(expression).state, 'invalid', `"${expression}" should be rejected`)
  }
})

test('scientific: input that looks like code is data, not instructions', () => {
  // None of these run; they are simply outside the grammar.
  for (const expression of [
    'process.exit(1)',
    'globalThis',
    'require("fs")',
    'alert(1)',
    '[].constructor',
    '1;2',
  ]) {
    assert.equal(evaluateExpression(expression).state, 'invalid', expression)
  }
})

test('scientific: blank input is empty, not an error', () => {
  assert.equal(evaluateExpression('').state, 'empty')
  assert.equal(evaluateExpression('   ').state, 'empty')
})

test('scientific: results are normalized against float noise', () => {
  assert.equal(value('0.1+0.2'), 0.3, 'not 0.30000000000000004')
  assert.equal(value('sqrt(2)^2'), 2)
  assert.equal(value('1/3*3'), 1)
})

test('scientific: nested functions and whitespace', () => {
  assert.equal(value('sqrt(sqrt(16))'), 2)
  assert.equal(value(' 2 + 3 * 4 '), 14)
  assert.equal(value('sqrt( 16 ) + inv( 2 )'), 4.5)
  close(value('sin(30)+cos(60)'), 1, 1e-9)
})
