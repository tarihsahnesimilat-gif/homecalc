import type { CalculatorContent } from './types.ts'
import { ageContent } from './age.ts'
import { averageContent } from './average.ts'
import { bmiContent } from './bmi.ts'
import { bmrContent } from './bmr.ts'
import { calorieContent } from './calorie.ts'
import { compoundInterestContent } from './compound-interest.ts'
import { dateDifferenceContent } from './date-difference.ts'
import { daysBetweenContent } from './days-between.ts'
import { discountContent } from './discount.ts'
import { fractionContent } from './fraction.ts'
import { loanPaymentContent } from './loan-payment.ts'
import { percentageContent } from './percentage.ts'
import { percentageChangeContent } from './percentage-change.ts'
import { profitMarginContent } from './profit-margin.ts'
import { ratioContent } from './ratio.ts'
import { roiContent } from './roi.ts'
import { scientificContent } from './scientific.ts'
import { simpleInterestContent } from './simple-interest.ts'
import { tipContent } from './tip.ts'
import { unitConverterContent } from './unit-converter.ts'

export type {
  CalculatorContent,
  CalculatorExample,
  CalculatorExampleInput,
  CalculatorFaq,
  CalculatorFormula,
  CalculatorHowTo,
  CalculatorHowToStep,
} from './types.ts'

/**
 * Registry of calculator content, keyed by slug.
 *
 * To add content for a new calculator: create `lib/calculator-content/<name>.ts`
 * exporting a `CalculatorContent`, then add it to the array below.
 */
const contentEntries: readonly CalculatorContent[] = [
  percentageContent,
  tipContent,
  discountContent,
  averageContent,
  percentageChangeContent,
  fractionContent,
  ratioContent,
  profitMarginContent,
  simpleInterestContent,
  unitConverterContent,
  compoundInterestContent,
  loanPaymentContent,
  roiContent,
  bmiContent,
  bmrContent,
  calorieContent,
  ageContent,
  dateDifferenceContent,
  daysBetweenContent,
  scientificContent,
]

export const calculatorContent: Readonly<Record<string, CalculatorContent>> =
  Object.fromEntries(contentEntries.map((entry) => [entry.slug, entry]))

export function getCalculatorContent(slug: string): CalculatorContent | undefined {
  return calculatorContent[slug]
}

export {
  percentageContent,
  tipContent,
  discountContent,
  averageContent,
  percentageChangeContent,
  fractionContent,
  ratioContent,
  profitMarginContent,
  simpleInterestContent,
  unitConverterContent,
  compoundInterestContent,
  loanPaymentContent,
  roiContent,
  bmiContent,
  bmrContent,
  calorieContent,
  ageContent,
  dateDifferenceContent,
  daysBetweenContent,
  scientificContent,
}
