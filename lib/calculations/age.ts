import { type CalculatorOutcome, anyBlank, invalid, ok } from '../calculator-validation.ts'
import {
  type CalendarDate,
  type CalendarSpan,
  calendarSpan,
  differenceInDays,
  parseDateInput,
  totalMonths,
} from './date-utils.ts'

export interface AgeResult {
  span: CalendarSpan
  totalMonths: number
  totalDays: number
  totalWeeks: number
  birthDate: CalendarDate
  targetDate: CalendarDate
  /** True when the target date is the birthday itself. */
  isBirthday: boolean
}

export function calculateAge(birthDate: CalendarDate, targetDate: CalendarDate): AgeResult {
  return {
    span: calendarSpan(birthDate, targetDate),
    totalMonths: totalMonths(birthDate, targetDate),
    totalDays: differenceInDays(birthDate, targetDate),
    totalWeeks: Math.floor(differenceInDays(birthDate, targetDate) / 7),
    birthDate,
    targetDate,
    isBirthday:
      birthDate.month === targetDate.month &&
      birthDate.day === targetDate.day &&
      birthDate.year !== targetDate.year,
  }
}

export function evaluateAge(
  rawBirthDate: string,
  rawTargetDate: string,
): CalculatorOutcome<AgeResult> {
  if (anyBlank(rawBirthDate, rawTargetDate)) return { state: 'empty' }

  const birthDate = parseDateInput(rawBirthDate)
  if (!birthDate) return invalid('Enter a valid date of birth.')

  const targetDate = parseDateInput(rawTargetDate)
  if (!targetDate) return invalid('Enter a valid date to measure against.')

  if (differenceInDays(birthDate, targetDate) < 0) {
    return invalid('The date of birth is after the target date — nobody has been born yet.')
  }

  return ok(calculateAge(birthDate, targetDate))
}
