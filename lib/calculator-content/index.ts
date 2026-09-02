import type { CalculatorContent } from './types'
import { averageContent } from './average'
import { discountContent } from './discount'
import { fractionContent } from './fraction'
import { percentageContent } from './percentage'
import { percentageChangeContent } from './percentage-change'
import { profitMarginContent } from './profit-margin'
import { ratioContent } from './ratio'
import { simpleInterestContent } from './simple-interest'
import { tipContent } from './tip'
import { unitConverterContent } from './unit-converter'

export type {
  CalculatorContent,
  CalculatorExample,
  CalculatorExampleInput,
  CalculatorFaq,
  CalculatorFormula,
  CalculatorHowTo,
  CalculatorHowToStep,
} from './types'

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
}
