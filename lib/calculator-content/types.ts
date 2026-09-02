/**
 * Shape of the editorial content that surrounds a calculator.
 *
 * Content lives in code (one file per calculator under `lib/calculator-content/`)
 * so every page is statically rendered and fully indexable. Calculation logic
 * stays in the calculator's own page/component — nothing here executes.
 */

export interface CalculatorFaq {
  question: string
  answer: string
}

export interface CalculatorExampleInput {
  label: string
  value: string
}

export interface CalculatorExample {
  title: string
  description: string
  inputs: CalculatorExampleInput[]
  result: string
}

export interface CalculatorFormula {
  name: string
  /** Written out in plain text, e.g. "(percentage ÷ 100) × number". */
  expression: string
  description: string
}

export interface CalculatorHowToStep {
  title: string
  description: string
}

export interface CalculatorHowTo {
  title: string
  steps: CalculatorHowToStep[]
}

export interface CalculatorContent {
  /** Must match a `slug` in the calculator registry. */
  slug: string
  seoTitle: string
  seoDescription: string
  /** Lead paragraph shown under the page heading, then supporting paragraphs. */
  intro: {
    /** Heading for the supporting paragraphs. Defaults to "About this calculator". */
    title?: string
    lead: string
    paragraphs: string[]
  }
  howTo: CalculatorHowTo
  formulas: CalculatorFormula[]
  /** Heading for the formulas section. Defaults to "Formulas". */
  formulasTitle?: string
  examples: CalculatorExample[]
  faqs: CalculatorFaq[]
  /** Optional sidebar note. */
  tip?: {
    title: string
    body: string
  }
}
