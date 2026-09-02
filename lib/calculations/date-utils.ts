/**
 * Calendar arithmetic shared by the Age, Date Difference and Days Between
 * calculators.
 *
 * Everything works on plain `{ year, month, day }` records rather than `Date`
 * objects. A `Date` carries a time and a timezone, which is how the same two
 * calendar dates end up one day apart on machines in different offsets, or
 * across a daylight-saving boundary. Working in whole days sidesteps all of it,
 * and makes every function here deterministic and testable.
 */

/** A calendar date. `month` is 1-12, matching how dates are written. */
export interface CalendarDate {
  year: number
  month: number
  day: number
}

/** Years, months and days between two dates, as a person would count them. */
export interface CalendarSpan {
  years: number
  months: number
  days: number
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28
  return month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31
}

export function isValidDate({ year, month, day }: CalendarDate): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false
  if (month < 1 || month > 12) return false
  if (day < 1) return false
  return day <= daysInMonth(year, month)
}

/**
 * Parses the `YYYY-MM-DD` value produced by `<input type="date">`.
 *
 * Parsed by hand rather than with `new Date(string)`, which interprets the
 * string as UTC midnight and then reports it in local time — shifting the day
 * backwards for anyone west of Greenwich.
 */
export function parseDateInput(raw: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim())
  if (!match) return null

  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }

  return isValidDate(date) ? date : null
}

/** Formats a calendar date back into `YYYY-MM-DD`. */
export function formatDateInput({ year, month, day }: CalendarDate): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}`
}

/**
 * Days since 1970-01-01, using the civil-calendar algorithm.
 *
 * Pure integer arithmetic, so it is exact for any year and never touches the
 * host clock or timezone.
 */
export function toDayNumber({ year, month, day }: CalendarDate): number {
  const shiftedYear = month <= 2 ? year - 1 : year
  const era = Math.floor(shiftedYear / 400)
  const yearOfEra = shiftedYear - era * 400
  const dayOfYear = Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1
  const dayOfEra = yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear

  return era * 146097 + dayOfEra - 719468
}

/** Whole days from `start` to `end`. Negative when `end` is earlier. */
export function differenceInDays(start: CalendarDate, end: CalendarDate): number {
  return toDayNumber(end) - toDayNumber(start)
}

/**
 * Adds whole months, clamping the day to the length of the target month.
 *
 * 31 January plus one month is 29 February in a leap year and 28 February
 * otherwise — there is no 31 February to land on.
 */
export function addMonths(date: CalendarDate, monthsToAdd: number): CalendarDate {
  const monthIndex = date.year * 12 + (date.month - 1) + monthsToAdd
  const year = Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1

  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) }
}

/**
 * The years/months/days breakdown from `start` to `end`, counted the way people
 * do: whole years first, then whole months, then leftover days.
 *
 * The leftover days are measured from the anchor date — `start` advanced by the
 * whole years and months — rather than borrowed from the month before `end`.
 * Borrowing looks simpler but breaks whenever the start day is longer than the
 * month it borrows from: 31 January to 1 March would come out as one month and
 * minus one day.
 *
 * Assumes `end` is not before `start`; callers order the pair first.
 */
export function calendarSpan(start: CalendarDate, end: CalendarDate): CalendarSpan {
  let years = end.year - start.year
  let months = end.month - start.month

  // The final month is only complete once the day of the month is reached.
  if (end.day < start.day) months -= 1

  if (months < 0) {
    years -= 1
    months += 12
  }

  const anchor = addMonths(start, years * 12 + months)

  return { years, months, days: differenceInDays(anchor, end) }
}

/** Whole months between two dates, ignoring the leftover days. */
export function totalMonths(start: CalendarDate, end: CalendarDate): number {
  const span = calendarSpan(start, end)
  return span.years * 12 + span.months
}
