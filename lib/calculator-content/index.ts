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
import { breakEvenContent } from './break-even.ts'
import { exponentContent } from './exponent.ts'
import { fuelCostContent } from './fuel-cost.ts'
import { gcfLcmContent } from './gcf-lcm.ts'
import { investmentContent } from './investment.ts'
import { percentageOfNumberContent } from './percentage-of-number.ts'
import { salesTaxContent } from './sales-tax.ts'
import { squareRootContent } from './square-root.ts'
import { timeDurationContent } from './time-duration.ts'
import { workHoursContent } from './work-hours.ts'
import { commissionContent } from './commission.ts'
import { concreteContent } from './concrete.ts'
import { currencyContent } from './currency.ts'
import { dateCalculatorContent } from './date-calculator.ts'
import { debtPayoffContent } from './debt-payoff.ts'
import { gradeContent } from './grade.ts'
import { mortgageContent } from './mortgage.ts'
import { percentageDifferenceContent } from './percentage-difference.ts'
import { savingsContent } from './savings.ts'
import { timeZoneContent } from './timezone.ts'
import { areaContent } from './area.ts'
import { calorieDeficitContent } from './calorie-deficit.ts'
import { futureValueContent } from './future-value.ts'
import { hoursContent } from './hours.ts'
import { loanInterestContent } from './loan-interest.ts'
import { markupContent } from './markup.ts'
import { paceContent } from './pace.ts'
import { percentagePointContent } from './percentage-point.ts'
import { pricePerUnitContent } from './price-per-unit.ts'
import { ratioToPercentageContent } from './ratio-to-percentage.ts'

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
  percentageOfNumberContent,
  gcfLcmContent,
  exponentContent,
  squareRootContent,
  salesTaxContent,
  investmentContent,
  breakEvenContent,
  fuelCostContent,
  timeDurationContent,
  workHoursContent,
  commissionContent,
  concreteContent,
  currencyContent,
  dateCalculatorContent,
  debtPayoffContent,
  gradeContent,
  mortgageContent,
  percentageDifferenceContent,
  savingsContent,
  timeZoneContent,
  areaContent,
  calorieDeficitContent,
  futureValueContent,
  hoursContent,
  loanInterestContent,
  markupContent,
  paceContent,
  percentagePointContent,
  pricePerUnitContent,
  ratioToPercentageContent,
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
  percentageOfNumberContent,
  gcfLcmContent,
  exponentContent,
  squareRootContent,
  salesTaxContent,
  investmentContent,
  breakEvenContent,
  fuelCostContent,
  timeDurationContent,
  workHoursContent,
  commissionContent,
  concreteContent,
  currencyContent,
  dateCalculatorContent,
  debtPayoffContent,
  gradeContent,
  mortgageContent,
  percentageDifferenceContent,
  savingsContent,
  timeZoneContent,
  areaContent,
  calorieDeficitContent,
  futureValueContent,
  hoursContent,
  loanInterestContent,
  markupContent,
  paceContent,
  percentagePointContent,
  pricePerUnitContent,
  ratioToPercentageContent,
}
