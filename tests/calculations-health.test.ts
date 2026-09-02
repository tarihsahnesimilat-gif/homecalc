import test from 'node:test'
import assert from 'node:assert/strict'

import { outcomeValue } from '../lib/calculator-validation.ts'
import { type BmiInputs, calculateBmi, categorizeBmi, evaluateBmi } from '../lib/calculations/bmi.ts'
import { type BodyInputs, calculateBmr, evaluateBmr } from '../lib/calculations/bmr.ts'
import { ACTIVITY_MULTIPLIERS, evaluateCalories } from '../lib/calculations/calorie.ts'
import { feetAndInchesToCentimeters, poundsToKilograms } from '../lib/calculations/body-units.ts'

const close = (actual: number, expected: number, tolerance = 1e-9) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  )

const bmiInputs = (overrides: Partial<BmiInputs> = {}): BmiInputs => ({
  system: 'metric',
  weight: '70',
  heightCm: '175',
  heightFeet: '',
  heightInches: '',
  ...overrides,
})

const bodyInputs = (overrides: Partial<BodyInputs> = {}): BodyInputs => ({
  system: 'metric',
  sex: 'male',
  age: '30',
  weight: '80',
  heightCm: '180',
  heightFeet: '',
  heightInches: '',
  ...overrides,
})

// ----------------------------------------------------------------------- BMI
test('bmi: metric calculation', () => {
  const result = outcomeValue(evaluateBmi(bmiInputs()))!
  close(result.bmi, 70 / 1.75 ** 2, 1e-9)
  close(result.bmi, 22.857142857142858, 1e-9)
  assert.equal(result.category, 'normal')
})

test('bmi: imperial input converts to the same scale', () => {
  const imperial = outcomeValue(
    evaluateBmi(bmiInputs({ system: 'imperial', weight: '154', heightFeet: '5', heightInches: '9' })),
  )!
  const expectedKg = poundsToKilograms(154)
  const expectedCm = feetAndInchesToCentimeters(5, 9)
  close(imperial.bmi, expectedKg / (expectedCm / 100) ** 2, 1e-9)
  assert.equal(imperial.category, 'normal')
})

test('bmi: imperial inches are optional', () => {
  const result = evaluateBmi(
    bmiInputs({ system: 'imperial', weight: '160', heightFeet: '6', heightInches: '' }),
  )
  assert.equal(result.state, 'ok')
})

test('bmi: category boundaries follow the standard adult ranges', () => {
  // Boundaries are inclusive at the lower end: 18.5 is normal, 25 is overweight.
  assert.equal(categorizeBmi(18.49), 'underweight')
  assert.equal(categorizeBmi(18.5), 'normal')
  assert.equal(categorizeBmi(24.99), 'normal')
  assert.equal(categorizeBmi(25), 'overweight')
  assert.equal(categorizeBmi(29.99), 'overweight')
  assert.equal(categorizeBmi(30), 'obesity')

  // The same boundaries reached through real weights at a 2 m height.
  assert.equal(calculateBmi(74, 200).category, 'normal')
  assert.equal(calculateBmi(100, 200).category, 'overweight')
  assert.equal(calculateBmi(120, 200).category, 'obesity')
  assert.equal(calculateBmi(70, 200).category, 'underweight')
})

test('bmi: decimal inputs', () => {
  const result = outcomeValue(evaluateBmi(bmiInputs({ weight: '68.5', heightCm: '172.5' })))!
  close(result.bmi, 68.5 / 1.725 ** 2, 1e-9)
})

test('bmi: validation', () => {
  assert.equal(evaluateBmi(bmiInputs({ weight: '' })).state, 'empty')
  assert.equal(evaluateBmi(bmiInputs({ weight: '0' })).state, 'invalid')
  assert.equal(evaluateBmi(bmiInputs({ weight: '-5' })).state, 'invalid')
  assert.equal(evaluateBmi(bmiInputs({ heightCm: '0' })).state, 'invalid')
  assert.equal(evaluateBmi(bmiInputs({ weight: 'abc' })).state, 'invalid')
  assert.equal(evaluateBmi(bmiInputs({ weight: '900' })).state, 'invalid')
  assert.equal(evaluateBmi(bmiInputs({ heightCm: '400' })).state, 'invalid')
  assert.equal(
    evaluateBmi(bmiInputs({ system: 'imperial', weight: '154', heightFeet: '5', heightInches: '12' }))
      .state,
    'invalid',
  )
})

// ----------------------------------------------------------------------- BMR
test('bmr: Mifflin-St Jeor for male and female', () => {
  // 10(80) + 6.25(180) - 5(30) + 5 = 1780
  close(outcomeValue(evaluateBmr(bodyInputs()))!.bmr, 1780)
  // Same body, female: 161 lower than the male base, so 1780 - 166 = 1614
  close(outcomeValue(evaluateBmr(bodyInputs({ sex: 'female' })))!.bmr, 1614)
  close(calculateBmr(80, 180, 30, 'male').bmr, 1780)
  close(calculateBmr(80, 180, 30, 'female').bmr, 1614)
})

test('bmr: imperial input matches the metric equivalent', () => {
  const imperial = outcomeValue(
    evaluateBmr(
      bodyInputs({ system: 'imperial', weight: '176.37', heightFeet: '5', heightInches: '11' }),
    ),
  )!
  const expected = calculateBmr(
    poundsToKilograms(176.37),
    feetAndInchesToCentimeters(5, 11),
    30,
    'male',
  )
  close(imperial.bmr, expected.bmr, 1e-9)
})

test('bmr: decimal values', () => {
  const result = outcomeValue(evaluateBmr(bodyInputs({ weight: '72.4', heightCm: '167.6', age: '41' })))!
  close(result.bmr, 10 * 72.4 + 6.25 * 167.6 - 5 * 41 + 5, 1e-9)
})

test('bmr: validation', () => {
  assert.equal(evaluateBmr(bodyInputs({ age: '' })).state, 'empty')
  assert.equal(evaluateBmr(bodyInputs({ age: '0' })).state, 'invalid')
  assert.equal(evaluateBmr(bodyInputs({ age: '-1' })).state, 'invalid')
  assert.equal(evaluateBmr(bodyInputs({ age: '150' })).state, 'invalid')
  assert.equal(evaluateBmr(bodyInputs({ weight: '0' })).state, 'invalid')
  assert.equal(evaluateBmr(bodyInputs({ heightCm: '0' })).state, 'invalid')
  assert.equal(evaluateBmr(bodyInputs({ weight: 'abc' })).state, 'invalid')
})

// ------------------------------------------------------------------- Calorie
test('calorie: every activity level applies its documented multiplier', () => {
  const bmr = outcomeValue(evaluateBmr(bodyInputs()))!.bmr

  for (const [level, multiplier] of Object.entries(ACTIVITY_MULTIPLIERS)) {
    const result = outcomeValue(
      evaluateCalories(bodyInputs(), level as keyof typeof ACTIVITY_MULTIPLIERS),
    )!
    close(result.multiplier, multiplier)
    close(result.dailyCalories, bmr * multiplier, 1e-9)
  }
})

test('calorie: the BMR it reports is the same one the BMR calculator produces', () => {
  const fromBmr = outcomeValue(evaluateBmr(bodyInputs({ sex: 'female', age: '45' })))!
  const fromCalories = outcomeValue(
    evaluateCalories(bodyInputs({ sex: 'female', age: '45' }), 'moderately-active'),
  )!

  assert.deepEqual(fromCalories.bmr, fromBmr)
  close(fromCalories.dailyCalories, fromBmr.bmr * 1.55, 1e-9)
})

test('calorie: imperial input', () => {
  const result = outcomeValue(
    evaluateCalories(
      bodyInputs({ system: 'imperial', weight: '154', heightFeet: '5', heightInches: '9' }),
      'sedentary',
    ),
  )!
  const expectedBmr = calculateBmr(
    poundsToKilograms(154),
    feetAndInchesToCentimeters(5, 9),
    30,
    'male',
  )
  close(result.dailyCalories, expectedBmr.bmr * 1.2, 1e-9)
})

test('calorie: more activity always means more calories', () => {
  const levels = ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extra-active'] as const
  const values = levels.map(
    (level) => outcomeValue(evaluateCalories(bodyInputs(), level))!.dailyCalories,
  )
  for (let index = 1; index < values.length; index += 1) {
    assert.ok(values[index] > values[index - 1], levels[index])
  }
})

test('calorie: validation is shared with BMR', () => {
  assert.equal(evaluateCalories(bodyInputs({ age: '' }), 'sedentary').state, 'empty')
  assert.equal(evaluateCalories(bodyInputs({ age: '0' }), 'sedentary').state, 'invalid')
  assert.equal(evaluateCalories(bodyInputs({ weight: '-5' }), 'sedentary').state, 'invalid')
  assert.equal(evaluateCalories(bodyInputs({ heightCm: 'abc' }), 'sedentary').state, 'invalid')
})
