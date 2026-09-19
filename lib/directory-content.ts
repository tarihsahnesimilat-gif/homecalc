import type { CalculatorCategoryId } from './calculators.ts'

/**
 * Editorial content for the /calculators directory.
 *
 * The directory used to be a heading, one sentence and six grids of cards. The
 * cards answer "what is here"; this answers "which one do I need, and what does
 * the number mean once I have it" — the two questions a first-time visitor
 * actually arrives with.
 *
 * Same arrangement as `lib/category-content.ts`: content in code, typed, one
 * object, statically rendered. Category pages go deeper on their own tools, so
 * the copy here stays at the level of choosing between groups and never repeats
 * a category page sentence.
 */

export interface DirectoryGroup {
  /** The category page this group links to. */
  id: CalculatorCategoryId
  /** When this group is the right place to look. */
  text: string
  /** Two representative calculators, linked inline as examples. */
  examples: readonly string[]
}

export interface DirectoryStep {
  title: string
  description: string
}

export interface DirectoryContent {
  intro: { title: string; paragraphs: readonly string[] }
  chooser: { title: string; groups: readonly DirectoryGroup[] }
  howTo: { title: string; steps: readonly DirectoryStep[] }
  results: { title: string; paragraphs: readonly string[] }
}

export const directoryContent: DirectoryContent = {
  intro: {
    title: 'About these calculators',
    paragraphs: [
      'HomeCalc is a set of single-purpose calculators. Each one answers a specific question — what 15% of a bill comes to, what a loan costs per month, how many days remain until a deadline — and shows the formula and a worked example beside the answer, so the working is there to check rather than take on trust.',
      'Choosing the right tool matters more than it sounds. Most calculator mistakes are not arithmetic errors but category errors: reaching for percentage change when the two figures have no before-and-after relationship, or reading a health estimate as though it were a measurement. The groups below are organised by the kind of question each set of tools answers, and every category page explains where the line between two similar calculators falls.',
      'The calculators run entirely in your browser. What you type is not sent to a server or stored between visits, there is no sign-up, and closing the tab discards everything. Results are displayed to a sensible number of decimal places while the calculation behind them runs at full precision.',
      'Read any result as the answer to the exact question you asked, under the assumptions printed with it. A monthly payment assumes a fixed rate and no fees; a daily calorie figure assumes an average person with your measurements. The arithmetic is dependable — whether those assumptions describe your situation is the part only you can judge.',
    ],
  },
  chooser: {
    title: 'Which calculator should I use?',
    groups: [
      {
        id: 'math',
        text: 'Percentages, fractions, ratios, averages, powers and roots, plus a scientific calculator for longer expressions. Come here when the question is pure arithmetic and the difficulty is getting the shape of it right rather than the sums.',
        examples: ['percentage-calculator', 'average-calculator'],
      },
      {
        id: 'finance',
        text: 'Borrowing, saving, investing and pricing — repayments and interest, growth over time, and the everyday arithmetic of tips, discounts, tax and margin. Best used to compare two scenarios on the same basis rather than to predict a single outcome.',
        examples: ['loan-payment-calculator', 'tip-calculator'],
      },
      {
        id: 'health',
        text: 'Body mass index, resting and daily energy needs, and running pace. These are population formulas, so they describe an average person with your inputs; they are useful for tracking a direction over time, not for diagnosing anything.',
        examples: ['bmi-calculator', 'calorie-calculator'],
      },
      {
        id: 'home',
        text: 'Working out how much of a material a space needs before you order it. Anything that covers a surface is sold by area, while rooms arrive measured in lengths and widths — this is where one becomes the other.',
        examples: ['area-calculator'],
      },
      {
        id: 'date-time',
        text: 'Ages, gaps between dates, day counts, durations and timesheet totals. Worth using whenever a month boundary, a leap year or a clock change is involved, because none of those units behave the way mental arithmetic assumes.',
        examples: ['age-calculator', 'days-between-dates-calculator'],
      },
      {
        id: 'everyday',
        text: 'The small conversions and comparisons that sit between a decision and getting on with the day: units, value per pack, fuel for a journey, an amount in another currency. Nearly all of them come down to getting two quantities into the same measure first.',
        examples: ['unit-converter', 'price-per-unit-calculator'],
      },
    ],
  },
  howTo: {
    title: 'How to use the calculators',
    steps: [
      {
        title: 'Enter the values it asks for',
        description:
          'Results appear as you type, so a partly filled form simply shows nothing rather than an error. Fields marked optional can be left blank.',
      },
      {
        title: 'Check the units before you read anything',
        description:
          'Where a calculator offers metric and imperial, or annual and monthly, set that first. A figure entered under the wrong unit produces a plausible answer rather than a warning, which is why it is the mistake worth guarding against.',
      },
      {
        title: 'Read the result and the lines under it',
        description:
          'Most calculators show a breakdown alongside the headline figure — the split between interest and principal, the same answer in a second unit, the inclusive as well as the exclusive day count. The supporting lines are often the ones you actually needed.',
      },
      {
        title: 'Read the assumptions on the page',
        description:
          'Every calculator states its formula, works through an example and says what it does not account for. That section is where you find out whether the answer applies to your case.',
      },
      {
        title: 'Carry the number forward carefully',
        description:
          'For multi-step work, keep the unrounded figure between steps and round once at the end. Where a result feeds a decision about money or health, treat it as one input among several.',
      },
    ],
  },
  results: {
    title: 'Understanding calculator results',
    paragraphs: [
      'Some of these tools return exact answers and some return estimates, and the difference is worth knowing. A percentage, a unit conversion or a day count is exact arithmetic: given the same inputs it is simply correct. A mortgage payment, a daily calorie figure or an investment projection is a model — exact arithmetic applied to assumptions that stand in for a more complicated reality.',
      'For anything in the second group, what the number is worth depends on how well those assumptions fit. Each calculator sets out its own formula and limitations on its page, and the health and money tools carry a short note beside the result saying what it is and what it is not. Where a figure will inform a real decision about your health or your finances, treat it as a starting point for a conversation with someone qualified rather than as the answer.',
    ],
  },
}
