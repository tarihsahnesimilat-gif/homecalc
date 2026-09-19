/**
 * SEO assertions against the real build output.
 *
 * The registry tests prove the data is right; these prove the pages Next
 * actually produced carry it. Requires a prior `pnpm build` — without one the
 * suite skips rather than failing, so `pnpm test` still works on a clean tree.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

import { liveCalculators, categoriesWithLiveCalculators } from '../lib/calculators.ts'
import { calculatorContent } from '../lib/calculator-content/index.ts'
import { getCategoryContent } from '../lib/category-content.ts'
import { directoryContent } from '../lib/directory-content.ts'
import { INFO_ROUTES, LEGAL_ROUTES } from '../lib/routes.ts'

const BUILD_DIR = path.join(process.cwd(), '.next', 'server', 'app')
const hasBuild = fs.existsSync(path.join(BUILD_DIR, 'calculators.html'))

const read = (relative: string) => fs.readFileSync(path.join(BUILD_DIR, relative), 'utf8')
const count = (haystack: string, needle: RegExp) => (haystack.match(needle) ?? []).length

/** Only the real JSON-LD blocks; the RSC payload embeds an escaped copy too. */
function jsonLdTypes(html: string): string[] {
  const matches = html.matchAll(
    /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"([A-Za-z]+)"/g,
  )
  return [...matches].map((match) => match[1])
}

const calculatorPages = () => liveCalculators.map((c) => `calculators/${c.slug}.html`)
const categoryPages = () => categoriesWithLiveCalculators.map((c) => `calculators/${c.id}.html`)
const legalPages = () => LEGAL_ROUTES.map((route) => `${route.slice(1)}.html`)
/** About and contact: the trust pages an ad network's reviewer looks for. */
const infoPages = () => INFO_ROUTES.map((route) => `${route.slice(1)}.html`)
const allPages = () => [
  'index.html',
  'calculators.html',
  ...categoryPages(),
  ...calculatorPages(),
  ...infoPages(),
  ...legalPages(),
]

test('rendered: every public page carries complete metadata', { skip: !hasBuild }, () => {
  for (const page of allPages()) {
    const html = read(page)
    assert.equal(count(html, /<title>/g), 1, `${page}: expected exactly one <title>`)
    assert.equal(count(html, /name="description"/g), 1, `${page}: expected one meta description`)
    assert.equal(count(html, /rel="canonical"/g), 1, `${page}: expected one canonical`)
    assert.equal(count(html, /property="og:url"/g), 1, `${page}: expected one og:url`)
    assert.equal(count(html, /property="og:title"/g), 1, `${page}: expected one og:title`)
    assert.equal(count(html, /<h1/g), 1, `${page}: expected exactly one <h1>`)
  }
})

test('rendered: titles and descriptions are unique across the site', { skip: !hasBuild }, () => {
  const titles = new Set<string>()
  const descriptions = new Set<string>()

  for (const page of allPages()) {
    const html = read(page)
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? ''
    const description = /name="description" content="([^"]*)"/.exec(html)?.[1] ?? ''

    assert.ok(!titles.has(title), `duplicate title on ${page}: ${title}`)
    assert.ok(!descriptions.has(description), `duplicate description on ${page}`)
    titles.add(title)
    descriptions.add(description)
  }

  assert.equal(titles.size, allPages().length)
})

test('rendered: calculator pages carry three distinct JSON-LD blocks', { skip: !hasBuild }, () => {
  for (const page of calculatorPages()) {
    const types = jsonLdTypes(read(page))
    assert.deepEqual(
      [...types].sort(),
      ['BreadcrumbList', 'FAQPage', 'WebApplication'],
      `${page} has ${types.join(', ')}`,
    )
    assert.equal(new Set(types).size, types.length, `${page} repeats a JSON-LD entity`)
  }
})

test('rendered: the directory is a CollectionPage', { skip: !hasBuild }, () => {
  const types = jsonLdTypes(read('calculators.html'))
  assert.deepEqual([...types].sort(), ['BreadcrumbList', 'CollectionPage'])
})

/**
 * Category pages carry a third block: their editorial FAQs, marked up the same
 * way the calculator pages mark up theirs, and only ever mirroring questions
 * that are visible on the page.
 */
test('rendered: category pages are CollectionPages with marked-up FAQs', { skip: !hasBuild }, () => {
  for (const page of categoryPages()) {
    const types = jsonLdTypes(read(page))
    assert.deepEqual(
      [...types].sort(),
      ['BreadcrumbList', 'CollectionPage', 'FAQPage'],
      `${page} has ${types.join(', ')}`,
    )
    assert.equal(new Set(types).size, types.length, `${page} repeats a JSON-LD entity`)
  }
})

test('rendered: no fabricated rating, review, price or author data', { skip: !hasBuild }, () => {
  const forbidden = [
    /"aggregateRating"/,
    /"ratingValue"/,
    /"reviewCount"/,
    /"review"\s*:/,
    /"price"/,
    /"priceCurrency"/,
    /"author"/,
  ]

  for (const page of allPages()) {
    const html = read(page)
    for (const pattern of forbidden) {
      assert.ok(!pattern.test(html), `${page} contains ${pattern}`)
    }
  }
})

test('rendered: the directory links to every live calculator and category', { skip: !hasBuild }, () => {
  const html = read('calculators.html')

  for (const calculator of liveCalculators) {
    assert.ok(html.includes(`href="${calculator.href}"`), `directory is missing ${calculator.slug}`)
  }
  for (const category of categoriesWithLiveCalculators) {
    assert.ok(
      html.includes(`href="/calculators/${category.id}"`),
      `directory is missing the ${category.id} category`,
    )
  }
})

test('rendered: the directory carries its editorial sections', { skip: !hasBuild }, () => {
  const html = read('calculators.html')

  for (const id of [
    'directory-intro-heading',
    'directory-chooser-heading',
    'directory-howto-heading',
    'directory-results-heading',
  ]) {
    assert.ok(html.includes(`id="${id}"`), `the directory is missing #${id}`)
  }

  // Server-rendered prose, not text that only appears once React has run.
  for (const paragraph of directoryContent.intro.paragraphs) {
    assert.ok(html.includes(paragraph), `the directory does not render: ${paragraph.slice(0, 40)}…`)
  }

  for (const group of directoryContent.chooser.groups) {
    assert.ok(
      html.includes(`href="/calculators/${group.id}"`),
      `the chooser does not link to /calculators/${group.id}`,
    )
    for (const slug of group.examples) {
      assert.ok(
        html.includes(`href="/calculators/${slug}"`),
        `the chooser does not link to ${slug}`,
      )
    }
  }

  assert.equal(count(html, /<h1/g), 1, 'the directory should keep exactly one h1')
  assert.ok(html.includes('<h2'), 'the editorial sections should use h2 headings')
  assert.ok(html.includes('<h3'), 'the chooser and workflow should use h3 subheadings')
})

test('rendered: each category page links to its own calculators only', { skip: !hasBuild }, () => {
  for (const category of categoriesWithLiveCalculators) {
    const html = read(`calculators/${category.id}.html`)

    for (const calculator of liveCalculators) {
      const linked = html.includes(`href="${calculator.href}"`)
      if (calculator.category === category.id) {
        assert.ok(linked, `${category.id} page is missing ${calculator.slug}`)
      }
    }
    assert.ok(html.includes('href="/calculators"'), `${category.id} page does not link back`)
  }
})

test('rendered: every category page carries its editorial sections', { skip: !hasBuild }, () => {
  for (const category of categoriesWithLiveCalculators) {
    const html = read(`calculators/${category.id}.html`)
    const content = getCategoryContent(category.id)!

    for (const id of [
      'category-overview-heading',
      'category-chooser-heading',
      'category-interpreting-heading',
      'category-mistakes-heading',
      'faq-heading',
    ]) {
      assert.ok(html.includes(`id="${id}"`), `${category.id} page is missing #${id}`)
    }

    for (const item of content.chooser.items) {
      assert.ok(
        html.includes(`href="/calculators/${item.slug}"`),
        `${category.id} page does not link to ${item.slug}`,
      )
    }

    assert.equal(
      count(html, /<details/g),
      content.faqs.length,
      `${category.id} page should render one details block per FAQ`,
    )
  }
})

test('rendered: the YMYL note sits under the result, not at the foot of the page', { skip: !hasBuild }, () => {
  for (const calculator of liveCalculators) {
    const disclaimer = calculatorContent[calculator.slug].disclaimer
    const html = read(`calculators/${calculator.slug}.html`)
    const panel = html.indexOf('About these results')

    if (!disclaimer) {
      assert.equal(panel, -1, `${calculator.slug} renders a disclaimer panel without content`)
      continue
    }

    assert.ok(panel !== -1, `${calculator.slug} does not render its disclaimer`)
    assert.ok(html.includes(disclaimer), `${calculator.slug}: the disclaimer text is missing`)
    assert.ok(
      panel < html.indexOf('id="about-heading"'),
      `${calculator.slug}: the disclaimer should come before the article, under the result`,
    )
  }
})

test('rendered: neighbouring calculators link to each other in both directions', { skip: !hasBuild }, () => {
  for (const calculator of liveCalculators) {
    const comparisons = calculatorContent[calculator.slug].comparisons ?? []
    const html = read(`calculators/${calculator.slug}.html`)

    if (comparisons.length === 0) {
      assert.ok(
        !html.includes('id="comparison-heading"'),
        `${calculator.slug} renders a comparison section with nothing in it`,
      )
      continue
    }

    assert.ok(
      html.includes('id="comparison-heading"'),
      `${calculator.slug} does not render its comparison section`,
    )

    for (const comparison of comparisons) {
      assert.ok(
        html.includes(`href="/calculators/${comparison.slug}"`),
        `${calculator.slug} does not link across to ${comparison.slug}`,
      )
      assert.ok(html.includes(comparison.summary), `${calculator.slug}: summary is not rendered`)
      assert.ok(
        html.includes(comparison.useThisWhen) && html.includes(comparison.useOtherWhen),
        `${calculator.slug}: the when-to-use clauses are not rendered`,
      )

      // The other side has to link back, or the pair is only half separated.
      const back = read(`calculators/${comparison.slug}.html`)
      assert.ok(
        back.includes(`href="/calculators/${calculator.slug}"`),
        `${comparison.slug} does not link back to ${calculator.slug}`,
      )
    }
  }
})

test('rendered: no page contains a dead anchor', { skip: !hasBuild }, () => {
  for (const page of allPages()) {
    assert.ok(!read(page).includes('href="#"'), `${page} contains href="#"`)
  }
})

test('rendered: every page carries the footer with legal links', { skip: !hasBuild }, () => {
  for (const page of allPages()) {
    const html = read(page)
    for (const legal of LEGAL_ROUTES) {
      assert.ok(html.includes(`href="${legal}"`), `${page} does not link to ${legal}`)
    }
    assert.ok(html.includes('href="/calculators"'), `${page} does not link to the directory`)
  }
})

test('rendered: legal pages are indexable', { skip: !hasBuild }, () => {
  for (const page of legalPages()) {
    const html = read(page)
    assert.ok(!/name="robots"[^>]*noindex/.test(html), `${page} is marked noindex`)
  }
})

test('rendered: the homepage links to the directory and category pages', { skip: !hasBuild }, () => {
  const html = read('index.html')

  assert.ok(html.includes('href="/calculators"'), 'homepage does not link to the directory')
  for (const category of categoriesWithLiveCalculators) {
    assert.ok(
      html.includes(`href="/calculators/${category.id}"`),
      `homepage does not link to ${category.id}`,
    )
  }
})

/** Entities inflate a raw `<title>` string; Google measures the decoded text. */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

/**
 * Google renders roughly 60 characters of a title and 160 of a description
 * before truncating. Overrunning does not hurt ranking, but it hides the part
 * of the copy that earns the click — and the ` | HomeCalc` suffix used to
 * push every title past the limit. This keeps that from creeping back as the
 * catalog grows.
 */
const MAX_TITLE = 60
const MAX_DESCRIPTION = 160

test('rendered: titles and descriptions fit what Google displays', { skip: !hasBuild }, () => {
  for (const page of allPages()) {
    const html = read(page)
    const title = decodeEntities(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '')
    const description = decodeEntities(
      /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '',
    )

    assert.ok(title.length > 0, `${page}: missing title`)
    assert.ok(
      title.length <= MAX_TITLE,
      `${page}: title is ${title.length} chars, over ${MAX_TITLE} — ${title}`,
    )
    assert.ok(description.length > 0, `${page}: missing description`)
    assert.ok(
      description.length <= MAX_DESCRIPTION,
      `${page}: description is ${description.length} chars, over ${MAX_DESCRIPTION}`,
    )
  }
})

test('rendered: every public page carries a social preview image', { skip: !hasBuild }, () => {
  for (const page of allPages()) {
    const html = read(page)
    assert.equal(
      count(html, /property="og:image"/g),
      1,
      `${page}: expected exactly one og:image — pages that declare their own openGraph block must spread OG_IMAGE in`,
    )
  }
})

test('rendered: the home page declares the site name for search results', { skip: !hasBuild }, () => {
  const html = read('index.html')
  assert.match(html, /"@type":"WebSite"/, 'home page should carry WebSite structured data')
  assert.match(html, /"@type":"FAQPage"/, 'home page FAQs should be marked up')
})
