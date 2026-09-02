import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export interface GradeBand {
  /** Lowest percentage that earns this letter. */
  minimum: number
  letter: string
}

/**
 * A common US letter scale with plus and minus grades.
 *
 * Grading scales are set by individual schools and courses and vary widely —
 * some use no plus/minus, some set the pass mark elsewhere, some curve. This is
 * one widely used scale, published here so it can be checked and changed in one
 * place rather than assumed to be universal.
 */
export const GRADE_SCALE: readonly GradeBand[] = [
  { minimum: 97, letter: 'A+' },
  { minimum: 93, letter: 'A' },
  { minimum: 90, letter: 'A-' },
  { minimum: 87, letter: 'B+' },
  { minimum: 83, letter: 'B' },
  { minimum: 80, letter: 'B-' },
  { minimum: 77, letter: 'C+' },
  { minimum: 73, letter: 'C' },
  { minimum: 70, letter: 'C-' },
  { minimum: 67, letter: 'D+' },
  { minimum: 63, letter: 'D' },
  { minimum: 60, letter: 'D-' },
  { minimum: 0, letter: 'F' },
]

export interface GradeResult {
  percentage: number
  letter: string
  pointsEarned: number
  totalPoints: number
  /** True above 100%, which extra credit can legitimately produce. */
  isExtraCredit: boolean
}

export function letterForPercentage(percentage: number): string {
  return GRADE_SCALE.find((band) => percentage >= band.minimum)?.letter ?? 'F'
}

export function calculateGrade(pointsEarned: number, totalPoints: number): GradeResult {
  const percentage = (pointsEarned / totalPoints) * 100

  return {
    percentage,
    letter: letterForPercentage(percentage),
    pointsEarned,
    totalPoints,
    isExtraCredit: percentage > 100,
  }
}

export function evaluateGrade(
  rawEarned: string,
  rawTotal: string,
): CalculatorOutcome<GradeResult> {
  if (anyBlank(rawEarned, rawTotal)) return { state: 'empty' }

  const parsed = parseNumbers(rawEarned, rawTotal)
  if (!parsed) return invalid('Please enter numbers only.')

  const [pointsEarned, totalPoints] = parsed
  if (totalPoints <= 0) {
    return invalid('The total points must be greater than zero.')
  }
  if (pointsEarned < 0) {
    return invalid('Points earned cannot be negative.')
  }

  // Scoring above the total is allowed: extra credit is real, and the result
  // is flagged rather than rejected.
  return ok(calculateGrade(pointsEarned, totalPoints))
}
