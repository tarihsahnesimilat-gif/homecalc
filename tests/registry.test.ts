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
]

test('registry: forty live calculators', () => {
  assert.equal(liveCalculators.length, 40)
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

test('registry: category counts are derived, not hardcoded', () => {
  const counts: Record<string, number> = Object.fromEntries(
    categoriesWithCounts.map((category) => [category.id, category.liveCount]),
  )
  assert.equal(counts.math, 12)
  assert.equal(counts.finance, 14)
  assert.equal(counts.health, 3)
  assert.equal(counts['date-time'], 7)
  assert.equal(counts.everyday, 4)
  assert.equal(counts.education, 0)
  assert.equal(
    activeCategories.reduce((total: number, category) => total + category.liveCount, 0),
    40,
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
