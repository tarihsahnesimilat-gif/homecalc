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
import { LEGAL_ROUTES } from '../lib/routes.ts'

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
const allPages = () => [
  'index.html',
  'calculators.html',
  ...categoryPages(),
  ...calculatorPages(),
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

test('rendered: directory and category pages are CollectionPages', { skip: !hasBuild }, () => {
  for (const page of ['calculators.html', ...categoryPages()]) {
    const types = jsonLdTypes(read(page))
    assert.deepEqual([...types].sort(), ['BreadcrumbList', 'CollectionPage'], `${page}`)
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
 * of the copy that earns the click — and the ` | CalculatorHub` suffix used to
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
