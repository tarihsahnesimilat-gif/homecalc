/**
 * Discovery surface: the directory, category pages, search keywords, internal
 * links and the sitemap — all of which are derived from the registry.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  CALCULATORS_DIRECTORY_PATH,
  type CalculatorDefinition,
  calculators,
  categories,
  categoriesWithLiveCalculators,
  categoryHref,
  getCategory,
  getLiveCalculatorsByCategory,
  groupLiveCalculatorsByCategory,
  liveCalculators,
  searchCalculators,
} from '../lib/calculators.ts'
import { LEGAL_ROUTES, publicRoutes } from '../lib/routes.ts'

const EXPECTED_CATEGORY_PAGES = ['math', 'finance', 'health', 'date-time', 'everyday']

// ---------------------------------------------------------------- Registry
test('registry: 40 live calculators, each with a unique slug', () => {
  assert.equal(liveCalculators.length, 40)
  const slugs = liveCalculators.map((c: CalculatorDefinition) => c.slug)
  assert.equal(new Set(slugs).size, 40)
})

test('registry: every live calculator sits in a category that exists', () => {
  const ids = new Set(categories.map((category) => category.id))
  for (const calculator of liveCalculators) {
    assert.ok(ids.has(calculator.category), `${calculator.slug} has an unknown category`)
  }
})

test('registry: every live calculator has usable keywords', () => {
  for (const calculator of liveCalculators) {
    const keywords = calculator.keywords ?? []
    assert.ok(keywords.length >= 3, `${calculator.slug} has fewer than 3 keywords`)

    for (const keyword of keywords) {
      assert.equal(keyword, keyword.toLowerCase(), `${calculator.slug}: "${keyword}" is not lowercase`)
      assert.equal(keyword.trim(), keyword, `${calculator.slug}: "${keyword}" has stray whitespace`)
      assert.ok(keyword.length > 1, `${calculator.slug}: "${keyword}" is too short to be useful`)
    }
  }
})

test('registry: no calculator repeats a keyword', () => {
  for (const calculator of calculators) {
    const keywords = calculator.keywords ?? []
    assert.equal(
      new Set(keywords).size,
      keywords.length,
      `${calculator.slug} lists the same keyword twice`,
    )
  }
})

test('registry: each keyword belongs to exactly one calculator', () => {
  // Aliases are how people search, so a term claimed by two calculators would
  // make which one ranks first depend on alphabetical order rather than intent.
  const owners = new Map<string, string[]>()

  for (const calculator of calculators) {
    for (const keyword of calculator.keywords ?? []) {
      owners.set(keyword, [...(owners.get(keyword) ?? []), calculator.slug])
    }
  }

  for (const [keyword, slugs] of owners) {
    assert.equal(slugs.length, 1, `"${keyword}" is claimed by ${slugs.join(' and ')}`)
  }
})

test('registry: every category has its own SEO copy', () => {
  const titles = new Set<string>()
  const descriptions = new Set<string>()

  for (const category of categories) {
    assert.ok(category.seoTitle.length > 0, `${category.id} has no seoTitle`)
    assert.ok(category.seoDescription.length > 0, `${category.id} has no seoDescription`)
    titles.add(category.seoTitle)
    descriptions.add(category.seoDescription)
  }

  assert.equal(titles.size, categories.length, 'category SEO titles are not unique')
  assert.equal(descriptions.size, categories.length, 'category SEO descriptions are not unique')
})

test('registry: category ids never collide with calculator slugs', () => {
  // Both share the /calculators/* namespace, so a collision would shadow a page.
  const slugs = new Set(calculators.map((c: CalculatorDefinition) => c.slug))
  for (const category of categories) {
    assert.ok(!slugs.has(category.id), `category "${category.id}" collides with a calculator slug`)
  }
})

// -------------------------------------------------------------- Categories
test('categories: exactly five have live calculators and therefore pages', () => {
  assert.deepEqual(
    categoriesWithLiveCalculators.map((category) => category.id),
    EXPECTED_CATEGORY_PAGES,
  )
})

test('categories: a category with only planned calculators gets no page', () => {
  // Education holds the planned Grade Calculator and nothing live.
  const education = getCategory('education')!
  assert.equal(getLiveCalculatorsByCategory('education').length, 0)
  assert.ok(
    !categoriesWithLiveCalculators.some((category) => category.id === education.id),
    'education should not have a page',
  )
})

test('categories: every live calculator appears in exactly one category page', () => {
  const grouped = groupLiveCalculatorsByCategory()
  const seen = new Map<string, string>()

  for (const { category, calculators: inCategory } of grouped) {
    for (const calculator of inCategory) {
      assert.equal(
        calculator.category,
        category.id,
        `${calculator.slug} is listed under ${category.id}`,
      )
      assert.ok(!seen.has(calculator.slug), `${calculator.slug} appears in two categories`)
      seen.set(calculator.slug, category.id)
    }
  }

  assert.equal(seen.size, 40, 'not every live calculator is reachable from a category page')
})

test('categories: expected members', () => {
  const inCategory = (id: Parameters<typeof getLiveCalculatorsByCategory>[0]) =>
    getLiveCalculatorsByCategory(id)
      .map((c: CalculatorDefinition) => c.slug)
      .sort()

  assert.deepEqual(inCategory('health').sort(), [
    'bmi-calculator',
    'bmr-calculator',
    'calorie-calculator',
  ])
  assert.deepEqual(inCategory('everyday').sort(), [
    'concrete-calculator',
    'currency-converter',
    'fuel-cost-calculator',
    'unit-converter',
  ])
  assert.deepEqual(inCategory('date-time').sort(), [
    'age-calculator',
    'date-calculator',
    'date-difference-calculator',
    'days-between-dates-calculator',
    'time-duration-calculator',
    'time-zone-converter',
    'work-hours-calculator',
  ])
  assert.equal(inCategory('math').length, 12)
  assert.equal(inCategory('finance').length, 14)
})

test('categories: no planned calculator is listed on a category page', () => {
  for (const { calculators: inCategory } of groupLiveCalculatorsByCategory()) {
    for (const calculator of inCategory) {
      assert.equal(calculator.status, 'live', `${calculator.slug} is planned`)
    }
  }
})

// ------------------------------------------------------------------ Search
test('search: finds a calculator by its exact name, ranked first', () => {
  for (const calculator of liveCalculators) {
    const results = searchCalculators(calculator.name, 30)
    assert.equal(
      results[0]?.slug,
      calculator.slug,
      `searching "${calculator.name}" did not rank it first`,
    )
  }
})

test('search: finds calculators by keyword and alias', () => {
  const finds = (query: string) =>
    searchCalculators(query, 30).map((c: CalculatorDefinition) => c.slug)

  assert.equal(finds('percent of')[0], 'percentage-of-number-calculator')
  assert.equal(finds('percentage difference')[0], 'percentage-difference-calculator')
  assert.equal(finds('grade calculator')[0], 'grade-calculator')
  assert.equal(finds('mortgage payment')[0], 'mortgage-calculator')
  assert.equal(finds('savings calculator')[0], 'savings-calculator')
  assert.equal(finds('sales commission')[0], 'commission-calculator')
  assert.equal(finds('credit card payoff')[0], 'debt-payoff-calculator')
  assert.equal(finds('exchange rate calculator')[0], 'currency-converter')
  assert.equal(finds('how much concrete do i need')[0], 'concrete-calculator')
  assert.equal(finds('add days to date')[0], 'date-calculator')
  assert.equal(finds('timezone converter')[0], 'time-zone-converter')
  assert.equal(finds('gcd')[0], 'gcf-lcm-calculator')
  assert.equal(finds('gcf')[0], 'gcf-lcm-calculator')
  assert.equal(finds('breakeven')[0], 'break-even-calculator')
  assert.equal(finds('shift hours')[0], 'work-hours-calculator')
  assert.equal(finds('gas cost')[0], 'fuel-cost-calculator')
  assert.equal(finds('elapsed time')[0], 'time-duration-calculator')
  assert.equal(finds('investment growth')[0], 'investment-calculator')
  assert.equal(finds('sqrt')[0], 'square-root-calculator')
  assert.equal(finds('x to the power')[0], 'exponent-calculator')
  assert.equal(finds('sales tax')[0], 'sales-tax-calculator')
  assert.equal(finds('body mass index')[0], 'bmi-calculator')
  assert.equal(finds('monthly payment')[0], 'loan-payment-calculator')
  assert.equal(finds('tdee')[0], 'calorie-calculator')
  assert.equal(finds('how old am i')[0], 'age-calculator')
  assert.equal(finds('gratuity')[0], 'tip-calculator')
  assert.equal(finds('sin cos tan')[0], 'scientific-calculator')
  assert.equal(finds('return on investment')[0], 'roi-calculator')
  assert.equal(finds('aspect ratio')[0], 'ratio-calculator')
  assert.equal(finds('future value')[0], 'compound-interest-calculator')
})

test('search: an exact name outranks a keyword match on another calculator', () => {
  // "percentage calculator" is the Percentage Calculator's name, and also a
  // substring of the Percentage Change Calculator's name.
  assert.equal(searchCalculators('percentage calculator', 5)[0].slug, 'percentage-calculator')
})

test('search: finds calculators by category', () => {
  const finds = (query: string) =>
    searchCalculators(query, 30).map((c: CalculatorDefinition) => c.slug)

  for (const slug of ['bmi-calculator', 'bmr-calculator', 'calorie-calculator']) {
    assert.ok(finds('health').includes(slug), `${slug} not found by category`)
  }
  for (const slug of ['age-calculator', 'days-between-dates-calculator']) {
    assert.ok(finds('date').includes(slug), `${slug} not found by category`)
  }
})

test('search: is case-insensitive and ignores surrounding whitespace', () => {
  const variants = ['BMI', 'bmi', 'BmI', '  bmi  ']
  for (const variant of variants) {
    assert.equal(
      searchCalculators(variant, 5)[0]?.slug,
      'bmi-calculator',
      `"${variant}" did not find the BMI calculator`,
    )
  }
})

test('search: returns nothing for a blank or unmatched query', () => {
  assert.deepEqual(searchCalculators(''), [])
  assert.deepEqual(searchCalculators('   '), [])
  assert.deepEqual(searchCalculators('xyzzy-not-a-calculator'), [])
})

test('search: live calculators always rank above planned ones', () => {
  const results = searchCalculators('calculator', 30)
  const firstPlanned = results.findIndex((c: CalculatorDefinition) => c.status === 'planned')
  const lastLive = results.map((c: CalculatorDefinition) => c.status).lastIndexOf('live')

  if (firstPlanned !== -1) assert.ok(lastLive < firstPlanned, 'a planned result outranked a live one')
})

test('search: respects the result limit', () => {
  assert.ok(searchCalculators('calculator', 3).length <= 3)
  assert.ok(searchCalculators('calculator', 30).length > 3)
})

// ---------------------------------------------------------- Internal links
test('links: every generated href points at a real route', () => {
  const routes = new Set(publicRoutes().map((route) => route.path))

  assert.ok(routes.has(CALCULATORS_DIRECTORY_PATH), 'the directory is not a route')

  for (const category of categoriesWithLiveCalculators) {
    assert.ok(routes.has(categoryHref(category.id)), `${category.id} page is missing`)
  }
  for (const calculator of liveCalculators) {
    assert.ok(routes.has(calculator.href), `${calculator.slug} page is missing`)
  }
})

test('links: no route is an empty anchor or a bare fragment', () => {
  for (const route of publicRoutes()) {
    assert.notEqual(route.path, '#')
    assert.ok(route.path.startsWith('/'), `"${route.path}" is not an absolute path`)
  }
})

test('links: every live calculator is reachable from its category page', () => {
  for (const calculator of liveCalculators) {
    const siblings = getLiveCalculatorsByCategory(calculator.category)
    assert.ok(
      siblings.some((sibling: CalculatorDefinition) => sibling.slug === calculator.slug),
      `${calculator.slug} is not listed on /calculators/${calculator.category}`,
    )
  }
})

// ----------------------------------------------------------------- Sitemap
test('sitemap: exactly 50 public URLs', () => {
  const routes = publicRoutes()
  assert.equal(
    routes.length,
    50,
    '1 homepage + 1 directory + 5 categories + 40 calculators + 3 legal pages',
  )
})

test('sitemap: the legal pages are listed and indexable', () => {
  const paths = publicRoutes().map((route) => route.path)
  for (const legal of LEGAL_ROUTES) {
    assert.ok(paths.includes(legal), `missing ${legal}`)
  }
})

test('sitemap: contains the homepage, directory, categories and calculators', () => {
  const paths = publicRoutes().map((route) => route.path)

  assert.ok(paths.includes('/'))
  assert.ok(paths.includes('/calculators'))
  for (const id of EXPECTED_CATEGORY_PAGES) {
    assert.ok(paths.includes(`/calculators/${id}`), `missing /calculators/${id}`)
  }
  for (const calculator of liveCalculators) {
    assert.ok(paths.includes(calculator.href), `missing ${calculator.href}`)
  }
})

test('sitemap: excludes planned calculators and pageless categories', () => {
  const paths = new Set(publicRoutes().map((route) => route.path))

  for (const calculator of calculators) {
    if (calculator.status === 'planned') {
      assert.ok(!paths.has(calculator.href), `planned ${calculator.slug} leaked into the sitemap`)
    }
  }
  assert.ok(!paths.has('/calculators/education'), 'education has no live calculators')
  assert.ok(!paths.has('/calculators/home'), 'home has no calculators at all')
})

test('sitemap: no duplicate URLs, and priorities are in range', () => {
  const routes = publicRoutes()
  const paths = routes.map((route) => route.path)

  assert.equal(new Set(paths).size, paths.length, 'the sitemap repeats a URL')
  for (const route of routes) {
    assert.ok(route.priority > 0 && route.priority <= 1, `${route.path} has a bad priority`)
  }
})
