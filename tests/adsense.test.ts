/**
 * The advertising setup.
 *
 * AdSense problems are account problems rather than build problems: a wrong
 * publisher id, a second copy of the loader, an unlabelled unit against a
 * result, or an ad on a page that should carry none. None of that shows up as
 * a failing build, so it is pinned here instead.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

import { ADSENSE_DISPLAY_SLOT, EXPECTED_ADSENSE_CLIENT_ID } from '../lib/site.ts'
import { INFO_ROUTES, LEGAL_ROUTES } from '../lib/routes.ts'
import { categoriesWithLiveCalculators, liveCalculators } from '../lib/calculators.ts'

const source = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), 'utf8')

const BUILD_DIR = path.join(process.cwd(), '.next', 'server', 'app')
const hasBuild = fs.existsSync(path.join(BUILD_DIR, 'calculators.html'))
const read = (relative: string) => fs.readFileSync(path.join(BUILD_DIR, relative), 'utf8')
const count = (haystack: string, needle: RegExp) => (haystack.match(needle) ?? []).length

/**
 * Ads only render once a publisher id is configured, which it deliberately is
 * not in local development or previews. Rendered assertions about the unit
 * itself therefore run against a build that had one.
 */
const builtWithAds = hasBuild && read('calculators.html').includes('adsbygoogle')

// ------------------------------------------------------------ Configuration
test('adsense: the configured publisher id and ad slot are the ones issued', () => {
  assert.equal(EXPECTED_ADSENSE_CLIENT_ID, 'ca-pub-7484981971574475')
  assert.equal(ADSENSE_DISPLAY_SLOT, '4176066573')
  assert.match(ADSENSE_DISPLAY_SLOT, /^\d{10}$/)
})

test('adsense: the publisher id resolves to both spellings from one variable', async () => {
  // ads.txt needs `pub-…` and the ad tag needs `ca-pub-…`. Naming the wrong
  // seller in ads.txt marks the inventory unauthorised, so the two must come
  // from the same place and agree.
  const previous = process.env.NEXT_PUBLIC_ADSENSE_ID
  process.env.NEXT_PUBLIC_ADSENSE_ID = EXPECTED_ADSENSE_CLIENT_ID

  try {
    const site = await import(`../lib/site.ts?configured=${Date.now()}`)
    assert.equal(site.adsenseClientId, 'ca-pub-7484981971574475')
    assert.equal(site.adsensePublisherId, 'pub-7484981971574475')
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_ADSENSE_ID
    else process.env.NEXT_PUBLIC_ADSENSE_ID = previous
  }
})

test('adsense: an unset or malformed id publishes nothing at all', async () => {
  const previous = process.env.NEXT_PUBLIC_ADSENSE_ID

  try {
    for (const value of ['', '   ', 'pub-not-a-number', 'ca-pub-123', 'nonsense']) {
      process.env.NEXT_PUBLIC_ADSENSE_ID = value
      const site = await import(`../lib/site.ts?bad=${encodeURIComponent(value)}${Date.now()}`)
      assert.equal(site.adsenseClientId, '', `"${value}" produced a client id`)
      assert.equal(site.adsensePublisherId, '', `"${value}" produced a publisher id`)
    }
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_ADSENSE_ID
    else process.env.NEXT_PUBLIC_ADSENSE_ID = previous
  }
})

// ------------------------------------------------------------------ Wiring
test('adsense: there is one ad component, and it carries no loader script', () => {
  const unit = source('components/ad-unit.tsx')

  // The loader belongs in the head, once, from the root layout. A component
  // that shipped its own copy would load it on every calculator page.
  assert.doesNotMatch(unit, /googlesyndication/, 'the unit embeds the loader script')
  assert.doesNotMatch(unit, /<script/, 'the unit renders a script tag')

  // The SSR guard keeps empty boxes out of previews; it must stay.
  assert.match(unit, /if \(!adsenseClientId\) \{\s*\n\s*return null/)
  assert.match(unit, /aria-label="Advertisement"/, 'the unit must stay labelled')
  assert.match(unit, /data-full-width-responsive="true"/)
  assert.match(unit, /data-ad-format=\{format\}/)

  const components = fs
    .readdirSync(path.join(process.cwd(), 'components'), { recursive: true })
    .filter((entry): entry is string => typeof entry === 'string' && entry.endsWith('.tsx'))

  const withIns = components.filter((file) =>
    source(path.join('components', file)).includes('className="adsbygoogle'),
  )
  assert.deepEqual(withIns, ['ad-unit.tsx'], `more than one ad component: ${withIns.join(', ')}`)
})

test('adsense: exactly one place renders the unit, after the editorial content', () => {
  const article = source('components/calculator/calculator-article.tsx')

  assert.match(article, /<AdUnit slot=\{ADSENSE_DISPLAY_SLOT\} \/>/)
  // After the article closes, so it cannot land between the result and the
  // note beneath it, or among the calculator's own controls.
  assert.ok(
    article.indexOf('</article>') < article.indexOf('<AdUnit'),
    'the unit should sit after the article, not inside it',
  )

  const renderers = fs
    .readdirSync(path.join(process.cwd(), 'components'), { recursive: true })
    .filter((entry): entry is string => typeof entry === 'string' && entry.endsWith('.tsx'))
    // `<AdUnit slot=` rather than the bare name: the loader component mentions
    // it in a comment, which is documentation and not a placement.
    .filter((file) => /<AdUnit slot=/.test(source(path.join('components', file))))

  assert.deepEqual(renderers, [path.join('calculator', 'calculator-article.tsx')])
})

test('adsense: no page file places an ad of its own', () => {
  const pages = fs
    .readdirSync(path.join(process.cwd(), 'app'), { recursive: true })
    .filter((entry): entry is string => typeof entry === 'string' && entry.endsWith('.tsx'))

  for (const page of pages) {
    const contents = source(path.join('app', page))
    assert.ok(!/<AdUnit slot=/.test(contents), `${page} places its own ad unit`)
    assert.ok(
      !contents.includes('className="adsbygoogle'),
      `${page} hard-codes an ad tag instead of using the component`,
    )
  }

  // Auto ads stay as they are: one loader, in the head, from the layout.
  const layout = source('app/layout.tsx')
  assert.match(layout, /<AdSenseScript \/>/)
  assert.equal(count(layout, /AdSenseScript/g), 2, 'the layout should import and render it once')
})

// --------------------------------------------------------- Rendered output
test('adsense: the loader is never duplicated on a page', { skip: !hasBuild }, () => {
  const pages = [
    'index.html',
    'calculators.html',
    ...categoriesWithLiveCalculators.map((category) => `calculators/${category.id}.html`),
    ...liveCalculators.map((calculator) => `calculators/${calculator.slug}.html`),
    ...INFO_ROUTES.map((route) => `${route.slice(1)}.html`),
    ...LEGAL_ROUTES.map((route) => `${route.slice(1)}.html`),
  ]

  for (const page of pages) {
    const html = read(page)
    // Only real script tags: the RSC payload carries an escaped copy of every
    // element, which is data React hydrates from rather than a second loader.
    const loaders = count(
      html,
      /<script[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g,
    )
    assert.ok(loaders <= 1, `${page} loads the AdSense script ${loaders} times`)
  }
})

test('adsense: the unit renders on calculator pages only', { skip: !builtWithAds }, () => {
  for (const calculator of liveCalculators) {
    const html = read(`calculators/${calculator.slug}.html`)
    assert.equal(
      count(html, new RegExp(`data-ad-slot="${ADSENSE_DISPLAY_SLOT}"`, 'g')),
      1,
      `${calculator.slug} should carry exactly one manual unit`,
    )
    assert.match(html, /data-ad-client="ca-pub-7484981971574475"/)
  }

  const adFree = [
    'index.html',
    'calculators.html',
    ...categoriesWithLiveCalculators.map((category) => `calculators/${category.id}.html`),
    ...INFO_ROUTES.map((route) => `${route.slice(1)}.html`),
    ...LEGAL_ROUTES.map((route) => `${route.slice(1)}.html`),
  ]

  for (const page of adFree) {
    assert.ok(
      !read(page).includes(`data-ad-slot="${ADSENSE_DISPLAY_SLOT}"`),
      `${page} should not carry the manual ad unit`,
    )
  }
})

test('adsense: the unit sits after the article and below any note on the result', {
  skip: !builtWithAds,
}, () => {
  for (const calculator of liveCalculators) {
    const html = read(`calculators/${calculator.slug}.html`)
    const ad = html.indexOf(`data-ad-slot="${ADSENSE_DISPLAY_SLOT}"`)
    const article = html.indexOf('id="about-heading"')
    const faq = html.indexOf('id="faq-heading"')
    const note = html.indexOf('About these results')

    assert.ok(ad > article, `${calculator.slug}: the ad precedes the editorial content`)
    assert.ok(ad < faq, `${calculator.slug}: the ad should come before the FAQ`)
    if (note !== -1) {
      assert.ok(ad > note, `${calculator.slug}: the ad sits above the note on the result`)
    }
  }
})
