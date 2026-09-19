/**
 * Registry integration: the single source of truth behind the homepage,
 * search, related calculators and the sitemap.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import { calculatorContent } from '../lib/calculator-content/index.ts'
import {
  type CalculatorDefinition,
  activeCategories,
  calculators,
  categoriesWithCounts,
  getRelatedCalculators,
  liveCalculators,
  plannedCalculators,
  searchCalculators,
} from '../lib/calculators.ts'

const LIVE_SLUGS = [
  'percentage-calculator',
  'tip-calculator',
  'discount-calculator',
  'average-calculator',
  'percentage-change-calculator',
  'fraction-calculator',
  'ratio-calculator',
  'profit-margin-calculator',
  'simple-interest-calculator',
  'unit-converter',
  'compound-interest-calculator',
  'loan-payment-calculator',
  'roi-calculator',
  'bmi-calculator',
  'bmr-calculator',
  'calorie-calculator',
  'age-calculator',
  'date-difference-calculator',
  'days-between-dates-calculator',
  'scientific-calculator',
  'percentage-of-number-calculator',
  'gcf-lcm-calculator',
  'exponent-calculator',
  'square-root-calculator',
  'sales-tax-calculator',
  'investment-calculator',
  'break-even-calculator',
  'fuel-cost-calculator',
  'time-duration-calculator',
  'work-hours-calculator',
  'percentage-difference-calculator',
  'grade-calculator',
  'mortgage-calculator',
  'savings-calculator',
  'commission-calculator',
  'debt-payoff-calculator',
  'currency-converter',
  'concrete-calculator',
  'date-calculator',
  'time-zone-converter',
  'markup-calculator',
  'loan-interest-calculator',
  'future-value-calculator',
  'price-per-unit-calculator',
  'percentage-point-calculator',
  'ratio-to-percentage-calculator',
  'pace-calculator',
  'calorie-deficit-calculator',
  'hours-calculator',
  'area-calculator',
]

test('registry: fifty live calculators', () => {
  assert.equal(liveCalculators.length, 50)
  assert.deepEqual([...liveCalculators.map((c: CalculatorDefinition) => c.slug)].sort(), [...LIVE_SLUGS].sort())
})

test('registry: nothing is left planned', () => {
  // Mortgage and Grade were the last two, and both went live in v0.9.
  assert.deepEqual(plannedCalculators.map((c: CalculatorDefinition) => c.slug), [])
})

test('registry: every href is derived from its slug', () => {
  for (const calculator of calculators) {
    assert.equal(calculator.href, `/calculators/${calculator.slug}`)
  }
})

test('registry: slugs are unique', () => {
  const slugs = calculators.map((c: CalculatorDefinition) => c.slug)
  assert.equal(new Set(slugs).size, slugs.length)
})

test('registry: every live calculator has content', () => {
  for (const calculator of liveCalculators) {
    assert.ok(calculatorContent[calculator.slug], `${calculator.slug} has no content file`)
    assert.equal(calculatorContent[calculator.slug].slug, calculator.slug)
  }
})

/**
 * Calculators whose results could be read as health or financial advice carry
 * a note under the result saying what the number is and what it is not. The
 * list is explicit on both sides: a calculator that needs one must have it,
 * and one that does not must stay clean, so the notes keep their weight.
 */
const YMYL_DISCLAIMERS = [
  // Health: every calculator that turns a measurement into a health figure.
  'bmi-calculator',
  'bmr-calculator',
  'calorie-calculator',
  'calorie-deficit-calculator',
  'pace-calculator',
  // Money: borrowing, and anything that projects a balance forward on an
  // assumed rate. Arithmetic on figures the user already knows -- a tip, a
  // discount, sales tax, a margin -- carries no assumption to disclaim and
  // deliberately has no note.
  'mortgage-calculator',
  'loan-payment-calculator',
  'loan-interest-calculator',
  'debt-payoff-calculator',
  'investment-calculator',
  'savings-calculator',
  'compound-interest-calculator',
  'simple-interest-calculator',
  'future-value-calculator',
  'roi-calculator',
]

test('disclaimers: every YMYL calculator carries one, and nothing else does', () => {
  for (const slug of YMYL_DISCLAIMERS) {
    assert.ok(calculatorContent[slug], `${slug} has no content file`)
    assert.ok(calculatorContent[slug].disclaimer, `${slug} has no disclaimer`)
  }

  for (const calculator of liveCalculators) {
    if (YMYL_DISCLAIMERS.includes(calculator.slug)) continue
    assert.equal(
      calculatorContent[calculator.slug].disclaimer,
      undefined,
      `${calculator.slug} carries a disclaimer it was not meant to`,
    )
  }
})

test('disclaimers: each one is short, specific and unrepeated', () => {
  const seen = new Set<string>()

  for (const slug of YMYL_DISCLAIMERS) {
    const disclaimer = calculatorContent[slug].disclaimer!
    const words = disclaimer.split(/\s+/).filter(Boolean).length

    assert.ok(words >= 25 && words <= 70, `${slug}: disclaimer is ${words} words`)
    assert.ok(disclaimer.trim().endsWith('.'), `${slug}: disclaimer does not end in a full stop`)
    assert.ok(!seen.has(disclaimer), `${slug} repeats another calculator's disclaimer`)
    seen.add(disclaimer)
  }
})

test('disclaimers: none claims authority or promises an outcome', () => {
  // The point of the note is to withdraw a claim, so wording that asserts one
  // would defeat it.
  const forbidden = [
    /guarantees?(?!\s+nothing)/i,
    /guaranteed(?!\.)/i,
    /medically (approved|certified)/i,
    /(doctors|experts|physicians) (recommend|agree)/i,
    /clinically proven/i,
    /accurate/i,
  ]

  for (const slug of YMYL_DISCLAIMERS) {
    const disclaimer = calculatorContent[slug].disclaimer!
    for (const pattern of forbidden) {
      assert.ok(!pattern.test(disclaimer), `${slug}: disclaimer matches ${pattern}`)
    }
  }
})

test('disclaimers: health notes name their limits, finance notes name the variables', () => {
  const health = ['bmi-calculator', 'bmr-calculator', 'calorie-calculator', 'calorie-deficit-calculator']
  const finance = [
    'mortgage-calculator',
    'loan-payment-calculator',
    'loan-interest-calculator',
    'debt-payoff-calculator',
    'investment-calculator',
    'savings-calculator',
    'compound-interest-calculator',
    'simple-interest-calculator',
    'future-value-calculator',
    'roi-calculator',
  ]

  for (const slug of [...health, 'pace-calculator']) {
    assert.match(
      calculatorContent[slug].disclaimer!,
      /professional|healthcare|medical advice/i,
      `${slug}: the note should point somewhere better than itself`,
    )
  }

  for (const slug of health) {
    assert.match(
      calculatorContent[slug].disclaimer!,
      /estimate|screening|not a (diagnosis|nutrition plan|recommendation)/i,
      `${slug}: the note should say the figure is an estimate with limits`,
    )
  }

  for (const slug of finance) {
    assert.match(
      calculatorContent[slug].disclaimer!,
      /estimate|projection/i,
      `${slug}: the note should say the figure is an estimate`,
    )
    assert.match(
      calculatorContent[slug].disclaimer!,
      /fees|rates?|taxes|terms|returns/i,
      `${slug}: the note should say what can differ in practice`,
    )
    assert.match(
      calculatorContent[slug].disclaimer!,
      /not (financial|investment) advice|not financial advice|rather than (financial|investment) advice/i,
      `${slug}: the note should say it is not advice`,
    )
  }
})

/**
 * Calculators that sit next to a near neighbour: without an explicit
 * distinction the pair reads as two versions of one tool, to a visitor who
 * landed on the wrong one and to a search engine choosing between them.
 */
const OVERLAPPING_PAIRS: [string, string][] = [
  ['days-between-dates-calculator', 'date-difference-calculator'],
  ['mortgage-calculator', 'loan-payment-calculator'],
  ['loan-interest-calculator', 'loan-payment-calculator'],
]

test('comparisons: each overlapping pair points at the other, both ways', () => {
  for (const [a, b] of OVERLAPPING_PAIRS) {
    for (const [self, other] of [
      [a, b],
      [b, a],
    ]) {
      const comparisons = calculatorContent[self].comparisons ?? []
      const match = comparisons.find((comparison) => comparison.slug === other)
      assert.ok(match, `${self} does not distinguish itself from ${other}`)
    }
  }
})

test('comparisons: every one names a live calculator that is not itself', () => {
  for (const calculator of liveCalculators) {
    const comparisons = calculatorContent[calculator.slug].comparisons ?? []
    const slugs = comparisons.map((comparison) => comparison.slug)

    assert.equal(new Set(slugs).size, slugs.length, `${calculator.slug} repeats a comparison`)

    for (const comparison of comparisons) {
      assert.notEqual(comparison.slug, calculator.slug, `${calculator.slug} compares to itself`)
      const other = liveCalculators.find(
        (entry: CalculatorDefinition) => entry.slug === comparison.slug,
      )
      assert.ok(other, `${calculator.slug} compares to "${comparison.slug}", which is not live`)
    }
  }
})

test('comparisons: each side says what separates them and when to leave', () => {
  for (const calculator of liveCalculators) {
    for (const comparison of calculatorContent[calculator.slug].comparisons ?? []) {
      const where = `${calculator.slug} -> ${comparison.slug}`

      for (const [field, text] of Object.entries({
        summary: comparison.summary,
        useThisWhen: comparison.useThisWhen,
        useOtherWhen: comparison.useOtherWhen,
      })) {
        assert.ok(text.trim().length > 0, `${where}: ${field} is empty`)
        assert.ok(
          text.split(/\s+/).length >= 10,
          `${where}: ${field} is too short to distinguish anything`,
        )
      }

      // The two clauses must send the reader in opposite directions.
      assert.notEqual(
        comparison.useThisWhen,
        comparison.useOtherWhen,
        `${where}: both clauses say the same thing`,
      )
    }
  }
})

test('comparisons: neither side of a pair repeats the other, or the page it sits on', () => {
  const seen = new Map<string, string>()

  for (const calculator of liveCalculators) {
    const content = calculatorContent[calculator.slug]
    const pageCopy = [
      ...content.intro.paragraphs,
      ...content.howTo.steps.map((step) => step.description),
      ...content.faqs.map((faq) => faq.answer),
    ]

    for (const comparison of content.comparisons ?? []) {
      for (const text of [comparison.summary, comparison.useThisWhen, comparison.useOtherWhen]) {
        const owner = seen.get(text)
        assert.equal(owner, undefined, `${calculator.slug} repeats copy from ${owner}`)
        seen.set(text, `${calculator.slug} -> ${comparison.slug}`)

        assert.ok(
          !pageCopy.includes(text),
          `${calculator.slug}: the comparison repeats a paragraph already on the page`,
        )
      }
    }
  }
})

test('registry: category counts are derived, not hardcoded', () => {
  const counts: Record<string, number> = Object.fromEntries(
    categoriesWithCounts.map((category) => [category.id, category.liveCount]),
  )
  assert.equal(counts.math, 14)
  assert.equal(counts.finance, 17)
  assert.equal(counts.health, 5)
  assert.equal(counts['date-time'], 8)
  assert.equal(counts.everyday, 5)
  assert.equal(counts.home, 1)
  assert.equal(counts.education, 0)
  assert.equal(
    activeCategories.reduce((total: number, category) => total + category.liveCount, 0),
    50,
  )
})

test('search: every live calculator is findable by name', () => {
  for (const calculator of liveCalculators) {
    const found = searchCalculators(calculator.name, 30).map((c: CalculatorDefinition) => c.slug)
    assert.ok(found.includes(calculator.slug), `${calculator.name} was not found by name`)
  }
})

test('search: findable by description and category', () => {
  const finds = (query: string) => searchCalculators(query, 30).map((c: CalculatorDefinition) => c.slug)

  assert.ok(finds('compound').includes('compound-interest-calculator'))
  assert.ok(finds('repayments').includes('loan-payment-calculator'))
  assert.ok(finds('return percentage').includes('roi-calculator'))
  assert.ok(finds('body mass').includes('bmi-calculator'))
  assert.ok(finds('at rest').includes('bmr-calculator'))
  assert.ok(finds('trigonometry').includes('scientific-calculator'))

  // Category label and id both match.
  const health = finds('health')
  for (const slug of ['bmi-calculator', 'bmr-calculator', 'calorie-calculator']) {
    assert.ok(health.includes(slug), `${slug} not found by category`)
  }
  const dates = finds('date')
  for (const slug of ['age-calculator', 'date-difference-calculator']) {
    assert.ok(dates.includes(slug), `${slug} not found by category`)
  }
})

test('related: the curated pairings hold', () => {
  const related = (slug: string) => getRelatedCalculators(slug).map((c: CalculatorDefinition) => c.slug)

  assert.ok(related('compound-interest-calculator').includes('simple-interest-calculator'))
  assert.ok(related('loan-payment-calculator').includes('compound-interest-calculator'))
  assert.ok(related('roi-calculator').includes('profit-margin-calculator'))
  assert.ok(related('bmi-calculator').includes('bmr-calculator'))
  assert.ok(related('bmr-calculator').includes('calorie-calculator'))
  assert.ok(related('calorie-calculator').includes('bmr-calculator'))
  assert.ok(related('age-calculator').includes('date-difference-calculator'))
  assert.ok(related('date-difference-calculator').includes('days-between-dates-calculator'))
  assert.ok(related('days-between-dates-calculator').includes('date-difference-calculator'))
  assert.ok(related('scientific-calculator').includes('percentage-calculator'))
  assert.ok(related('scientific-calculator').includes('fraction-calculator'))
})

test('related: never planned, never self, never duplicated', () => {
  for (const calculator of calculators) {
    const related = getRelatedCalculators(calculator.slug)
    const slugs = related.map((c: CalculatorDefinition) => c.slug)

    assert.ok(!slugs.includes(calculator.slug), `${calculator.slug} relates to itself`)
    assert.equal(new Set(slugs).size, slugs.length, `${calculator.slug} has duplicates`)
    for (const entry of related) {
      assert.equal(entry.status, 'live', `${calculator.slug} links to planned ${entry.slug}`)
    }
  }
})

test('related: every live calculator has related links to show', () => {
  for (const calculator of liveCalculators) {
    assert.ok(
      getRelatedCalculators(calculator.slug).length > 0,
      `${calculator.slug} has no related calculators`,
    )
  }
})
