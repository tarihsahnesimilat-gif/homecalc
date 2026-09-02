/**
 * Calendar tests.
 *
 * Every case uses fixed dates and the pure calendar helpers, so results never
 * depend on the machine's clock, timezone or daylight-saving rules.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import { outcomeValue } from '../lib/calculator-validation.ts'
import {
  calendarSpan,
  daysInMonth,
  differenceInDays,
  formatDateInput,
  isLeapYear,
  isValidDate,
  parseDateInput,
  toDayNumber,
  totalMonths,
} from '../lib/calculations/date-utils.ts'
import { evaluateAge } from '../lib/calculations/age.ts'
import { evaluateDateDifference } from '../lib/calculations/date-difference.ts'
import { evaluateDaysBetween } from '../lib/calculations/days-between.ts'

// ---------------------------------------------------------------- Date utils
test('date utils: leap years follow the full Gregorian rule', () => {
  assert.equal(isLeapYear(2024), true)
  assert.equal(isLeapYear(2023), false)
  assert.equal(isLeapYear(1900), false, '1900 is divisible by 100 but not 400')
  assert.equal(isLeapYear(2000), true, '2000 is divisible by 400')
})

test('date utils: month lengths', () => {
  assert.equal(daysInMonth(2024, 2), 29)
  assert.equal(daysInMonth(2023, 2), 28)
  assert.equal(daysInMonth(2024, 1), 31)
  assert.equal(daysInMonth(2024, 4), 30)
  assert.equal(daysInMonth(2024, 12), 31)
})

test('date utils: parsing rejects impossible dates', () => {
  assert.deepEqual(parseDateInput('2024-02-29'), { year: 2024, month: 2, day: 29 })
  assert.equal(parseDateInput('2023-02-29'), null, '2023 is not a leap year')
  assert.equal(parseDateInput('2024-13-01'), null)
  assert.equal(parseDateInput('2024-00-10'), null)
  assert.equal(parseDateInput('2024-04-31'), null)
  assert.equal(parseDateInput('not-a-date'), null)
  assert.equal(parseDateInput(''), null)
  assert.equal(parseDateInput('2024-1-1'), null, 'the date input always pads to two digits')
})

test('date utils: parsing is timezone independent', () => {
  // new Date('2024-01-01') would be UTC midnight and could report 2023-12-31
  // in a negative offset. Parsing by hand keeps the calendar day entered.
  const parsed = parseDateInput('2024-01-01')!
  assert.deepEqual(parsed, { year: 2024, month: 1, day: 1 })
  assert.equal(formatDateInput(parsed), '2024-01-01')
})

test('date utils: day numbers anchor to the Unix epoch', () => {
  assert.equal(toDayNumber({ year: 1970, month: 1, day: 1 }), 0)
  assert.equal(toDayNumber({ year: 1970, month: 1, day: 2 }), 1)
  assert.equal(toDayNumber({ year: 1969, month: 12, day: 31 }), -1)
  assert.equal(toDayNumber({ year: 2000, month: 3, day: 1 }), 11017)
})

test('date utils: day differences across year and leap boundaries', () => {
  const days = (a: string, b: string) => differenceInDays(parseDateInput(a)!, parseDateInput(b)!)

  assert.equal(days('2024-01-01', '2024-01-01'), 0)
  assert.equal(days('2024-01-01', '2024-01-02'), 1)
  assert.equal(days('2023-01-01', '2024-01-01'), 365)
  assert.equal(days('2024-01-01', '2025-01-01'), 366, '2024 is a leap year')
  assert.equal(days('2024-02-28', '2024-03-01'), 2, 'through 29 February')
  assert.equal(days('2023-02-28', '2023-03-01'), 1, 'no 29 February')
  assert.equal(days('2024-01-02', '2024-01-01'), -1, 'negative when reversed')
})

test('date utils: calendar spans borrow from the correct month', () => {
  const span = (a: string, b: string) => calendarSpan(parseDateInput(a)!, parseDateInput(b)!)

  assert.deepEqual(span('2024-01-31', '2024-03-01'), { years: 0, months: 1, days: 1 })
  assert.deepEqual(span('2024-01-01', '2024-12-31'), { years: 0, months: 11, days: 30 })
  assert.deepEqual(span('2023-12-31', '2024-01-01'), { years: 0, months: 0, days: 1 })
  assert.deepEqual(span('2024-03-31', '2024-04-30'), { years: 0, months: 0, days: 30 })
  assert.equal(totalMonths(parseDateInput('2020-01-15')!, parseDateInput('2024-07-15')!), 54)
})

test('date utils: validity check', () => {
  assert.equal(isValidDate({ year: 2024, month: 2, day: 29 }), true)
  assert.equal(isValidDate({ year: 2023, month: 2, day: 29 }), false)
  assert.equal(isValidDate({ year: 2024, month: 2, day: 0 }), false)
  assert.equal(isValidDate({ year: 2024, month: 2.5, day: 10 }), false)
})

// ----------------------------------------------------------------------- Age
test('age: on and around a birthday', () => {
  const onBirthday = outcomeValue(evaluateAge('1990-06-15', '2024-06-15'))!
  assert.deepEqual(onBirthday.span, { years: 34, months: 0, days: 0 })
  assert.equal(onBirthday.isBirthday, true)

  const dayBefore = outcomeValue(evaluateAge('1990-06-15', '2024-06-14'))!
  assert.deepEqual(dayBefore.span, { years: 33, months: 11, days: 30 })
  assert.equal(dayBefore.isBirthday, false)

  const dayAfter = outcomeValue(evaluateAge('1990-06-15', '2024-06-16'))!
  assert.deepEqual(dayAfter.span, { years: 34, months: 0, days: 1 })
})

test('age: a 29 February birthday in a non-leap year', () => {
  const beforeLeapDay = outcomeValue(evaluateAge('2000-02-29', '2023-02-28'))!
  assert.deepEqual(beforeLeapDay.span, { years: 22, months: 11, days: 30 })

  const onLeapDay = outcomeValue(evaluateAge('2000-02-29', '2024-02-29'))!
  assert.deepEqual(onLeapDay.span, { years: 24, months: 0, days: 0 })

  // In a non-leap year, 1 March is the first day of the new year of age.
  const marchFirst = outcomeValue(evaluateAge('2000-02-29', '2023-03-01'))!
  assert.equal(marchFirst.span.years, 23)
})

test('age: month-end and year-end birth dates', () => {
  assert.deepEqual(outcomeValue(evaluateAge('1995-01-31', '2024-02-29'))!.span, {
    years: 29,
    months: 0,
    days: 29,
  })
  assert.deepEqual(outcomeValue(evaluateAge('1999-12-31', '2024-01-01'))!.span, {
    years: 24,
    months: 0,
    days: 1,
  })
})

test('age: totals', () => {
  const result = outcomeValue(evaluateAge('2020-01-01', '2024-01-01'))!
  assert.equal(result.totalDays, 1461, 'four years including one leap day')
  assert.equal(result.totalMonths, 48)
  assert.equal(result.totalWeeks, 208)
})

test('age: validation', () => {
  assert.equal(evaluateAge('', '2024-01-01').state, 'empty')
  assert.equal(evaluateAge('not-a-date', '2024-01-01').state, 'invalid')
  assert.equal(evaluateAge('2023-02-29', '2024-01-01').state, 'invalid')
  assert.equal(evaluateAge('2030-01-01', '2024-01-01').state, 'invalid', 'birth date in the future')
  assert.equal(evaluateAge('2024-01-01', '2024-01-01').state, 'ok', 'born today is zero, not an error')
})

// ------------------------------------------------------------ Date difference
test('date difference: exclusive counting, with an inclusive total alongside', () => {
  const same = outcomeValue(evaluateDateDifference('2024-03-10', '2024-03-10'))!
  assert.equal(same.totalDays, 0)
  assert.equal(same.inclusiveDays, 1, 'one day, counting both endpoints')
  assert.deepEqual(same.span, { years: 0, months: 0, days: 0 })

  const consecutive = outcomeValue(evaluateDateDifference('2024-03-10', '2024-03-11'))!
  assert.equal(consecutive.totalDays, 1)
  assert.equal(consecutive.inclusiveDays, 2)
})

test('date difference: month, year and leap boundaries', () => {
  assert.equal(outcomeValue(evaluateDateDifference('2024-01-31', '2024-02-01'))!.totalDays, 1)
  assert.equal(outcomeValue(evaluateDateDifference('2023-12-31', '2024-01-01'))!.totalDays, 1)
  assert.equal(outcomeValue(evaluateDateDifference('2024-02-28', '2024-02-29'))!.totalDays, 1)

  const year = outcomeValue(evaluateDateDifference('2024-01-01', '2025-01-01'))!
  assert.equal(year.totalDays, 366)
  assert.deepEqual(year.span, { years: 1, months: 0, days: 0 })
})

test('date difference: weeks and remaining days', () => {
  const result = outcomeValue(evaluateDateDifference('2024-01-01', '2024-01-18'))!
  assert.equal(result.totalDays, 17)
  assert.equal(result.totalWeeks, 2)
  assert.equal(result.remainingDays, 3)
})

test('date difference: reversed dates are measured by magnitude and flagged', () => {
  const forward = outcomeValue(evaluateDateDifference('2024-01-01', '2024-03-01'))!
  const reversed = outcomeValue(evaluateDateDifference('2024-03-01', '2024-01-01'))!

  assert.equal(forward.reversed, false)
  assert.equal(reversed.reversed, true)
  assert.equal(reversed.totalDays, forward.totalDays)
  assert.deepEqual(reversed.span, forward.span)
  assert.deepEqual(reversed.earlier, { year: 2024, month: 1, day: 1 })
})

test('date difference: validation', () => {
  assert.equal(evaluateDateDifference('', '2024-01-01').state, 'empty')
  assert.equal(evaluateDateDifference('2024-02-30', '2024-01-01').state, 'invalid')
  assert.equal(evaluateDateDifference('2024-01-01', 'nope').state, 'invalid')
})

// -------------------------------------------------------------- Days between
test('days between: same date, one day, one week', () => {
  assert.equal(outcomeValue(evaluateDaysBetween('2024-05-05', '2024-05-05'))!.totalDays, 0)
  assert.equal(outcomeValue(evaluateDaysBetween('2024-05-05', '2024-05-06'))!.totalDays, 1)

  const week = outcomeValue(evaluateDaysBetween('2024-05-05', '2024-05-12'))!
  assert.equal(week.totalDays, 7)
  assert.equal(week.weeks, 1)
  assert.equal(week.remainingDays, 0)
  assert.equal(week.inclusiveDays, 8)
})

test('days between: month, year and leap crossings', () => {
  assert.equal(outcomeValue(evaluateDaysBetween('2024-01-25', '2024-02-05'))!.totalDays, 11)
  assert.equal(outcomeValue(evaluateDaysBetween('2023-12-25', '2024-01-05'))!.totalDays, 11)
  assert.equal(outcomeValue(evaluateDaysBetween('2024-02-01', '2024-03-01'))!.totalDays, 29)
  assert.equal(outcomeValue(evaluateDaysBetween('2023-02-01', '2023-03-01'))!.totalDays, 28)
})

test('days between: reversed dates give the same count, flagged', () => {
  const reversed = outcomeValue(evaluateDaysBetween('2024-05-12', '2024-05-05'))!
  assert.equal(reversed.totalDays, 7)
  assert.equal(reversed.reversed, true)
  assert.deepEqual(reversed.earlier, { year: 2024, month: 5, day: 5 })
})

test('days between: agrees with the date difference calculator', () => {
  for (const [start, end] of [
    ['2024-01-01', '2024-12-31'],
    ['2020-02-29', '2024-02-29'],
    ['2024-03-10', '2024-03-10'],
  ]) {
    assert.equal(
      outcomeValue(evaluateDaysBetween(start, end))!.totalDays,
      outcomeValue(evaluateDateDifference(start, end))!.totalDays,
      `${start} -> ${end}`,
    )
  }
})

test('days between: validation', () => {
  assert.equal(evaluateDaysBetween('', '2024-01-01').state, 'empty')
  assert.equal(evaluateDaysBetween('2024-01-01', '2023-02-29').state, 'invalid')
})
