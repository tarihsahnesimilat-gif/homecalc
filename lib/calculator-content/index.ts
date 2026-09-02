import type { CalculatorContent } from './types'
import { averageContent } from './average'
import { discountContent } from './discount'
import { percentageContent } from './percentage'
import { tipContent } from './tip'

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
]

export const calculatorContent: Readonly<Record<string, CalculatorContent>> =
  Object.fromEntries(contentEntries.map((entry) => [entry.slug, entry]))

export function getCalculatorContent(slug: string): CalculatorContent | undefined {
  return calculatorContent[slug]
}

export { percentageContent, tipContent, discountContent, averageContent }
