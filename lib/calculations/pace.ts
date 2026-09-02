import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export type DistanceUnit = 'km' | 'mi'

export interface PaceResult {
  /** Seconds taken per kilometre or mile. */
  paceSecondsPerUnit: number
  /** The same pace written the way runners say it, e.g. "5:30". */
  paceFormatted: string
  /** Distance covered per hour, in the chosen unit. */
  speed: number
  totalSeconds: number
  distance: number
  unit: DistanceUnit
}

/** Formats seconds as m:ss, the conventional way to write a running pace. */
export function formatPace(secondsPerUnit: number): string {
  const rounded = Math.round(secondsPerUnit)
  const minutes = Math.floor(rounded / 60)
  const seconds = rounded % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/**
 * Pace and speed are the same information the other way up: pace is time per
 * distance, speed is distance per time. Runners think in pace, cyclists and
 * treadmills in speed, so both are given.
 */
export function calculatePace(
  distance: number,
  totalSeconds: number,
  unit: DistanceUnit,
): PaceResult {
  const paceSecondsPerUnit = totalSeconds / distance

  return {
    paceSecondsPerUnit,
    paceFormatted: formatPace(paceSecondsPerUnit),
    speed: distance / (totalSeconds / 3600),
    totalSeconds,
    distance,
    unit,
  }
}

export function evaluatePace(
  rawDistance: string,
  rawHours: string,
  rawMinutes: string,
  rawSeconds: string,
  unit: DistanceUnit,
): CalculatorOutcome<PaceResult> {
  // Only the distance is required; a blank time component counts as zero.
  if (anyBlank(rawDistance)) return { state: 'empty' }
  if (anyBlank(rawHours) && anyBlank(rawMinutes) && anyBlank(rawSeconds)) {
    return { state: 'empty' }
  }

  const parsed = parseNumbers(
    rawDistance,
    rawHours.trim() === '' ? '0' : rawHours,
    rawMinutes.trim() === '' ? '0' : rawMinutes,
    rawSeconds.trim() === '' ? '0' : rawSeconds,
  )
  if (!parsed) return invalid('Please enter numbers only.')

  const [distance, hours, minutes, seconds] = parsed
  if (distance <= 0) return invalid('The distance must be greater than zero.')
  if (hours < 0 || minutes < 0 || seconds < 0) return invalid('Time cannot be negative.')

  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  if (totalSeconds <= 0) return invalid('Enter the time it took.')

  return ok(calculatePace(distance, totalSeconds, unit))
}
