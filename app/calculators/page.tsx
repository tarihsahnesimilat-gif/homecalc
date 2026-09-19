import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Breadcrumbs } from '@/components/calculator/breadcrumbs'
import { CalculatorCard } from '@/components/calculator/calculator-card'
import { SiteHeader } from '@/components/site-header'
import {
  CALCULATORS_DIRECTORY_PATH,
  categoryHref,
  getCalculatorBySlug,
  getCategoryName,
  groupLiveCalculatorsByCategory,
  liveCalculators,
} from '@/lib/calculators'
import { directoryContent } from '@/lib/directory-content'
import { OG_IMAGE, absoluteUrl } from '@/lib/site'

const TITLE = 'All Calculators — The Full HomeCalc Directory'
const DESCRIPTION =
  'Every HomeCalc tool in one place, grouped by category: math, finance, health, date and time, and everyday conversions. All free, all instant, no sign-up.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CALCULATORS_DIRECTORY_PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CALCULATORS_DIRECTORY_PATH,
    type: 'website',
    images: OG_IMAGE,
  },
}

export default function CalculatorsDirectoryPage() {
  const groups = groupLiveCalculatorsByCategory()
  const { intro, chooser, howTo, results } = directoryContent

  /** Example links resolve through the registry, so none can go stale. */
  const chooserGroups = chooser.groups.map((group) => ({
    ...group,
    name: getCategoryName(group.id),
    href: categoryHref(group.id),
    calculators: group.examples.flatMap((slug) => {
      const calculator = getCalculatorBySlug(slug)
      return calculator && calculator.status === 'live' ? [calculator] : []
    }),
  }))

  // A CollectionPage listing the categories it links to. No ratings, prices or
  // authorship are claimed — only what the page genuinely contains.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(CALCULATORS_DIRECTORY_PATH),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: liveCalculators.length,
      itemListElement: liveCalculators.map((calculator, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: calculator.name,
        url: absoluteUrl(calculator.href),
      })),
    },
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Calculators' }]}
        />

        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">
          All Calculators
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          Every HomeCalc tool, grouped by what it helps you work out. There are{' '}
          {liveCalculators.length} calculators available right now — each one runs entirely in your
          browser, with the formula and worked examples on the page.
        </p>

        <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
          {groups.map(({ category }) => (
            <Link
              key={category.id}
              href={categoryHref(category.id)}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-primary transition hover:border-accent hover:bg-muted"
            >
              {category.name}
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                {category.liveCount}
              </span>
            </Link>
          ))}
        </nav>

        <section aria-labelledby="directory-intro-heading" className="mt-12">
          <h2 id="directory-intro-heading" className="text-2xl font-bold text-primary">
            {intro.title}
          </h2>
          <div className="mt-4 space-y-4">
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-3xl leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {groups.map(({ category, calculators }) => (
          <section key={category.id} id={category.id} className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-primary">{category.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
              </div>
              <Link
                href={categoryHref(category.id)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {category.countLabel}
                <ArrowRight className="ml-1 inline size-4" />
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {calculators.map((calculator) => (
                <CalculatorCard key={calculator.slug} calculator={calculator} showCategory={false} />
              ))}
            </div>
          </section>
        ))}

        <section
          aria-labelledby="directory-chooser-heading"
          className="mt-16 border-t border-border pt-10"
        >
          <h2 id="directory-chooser-heading" className="text-2xl font-bold text-primary">
            {chooser.title}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chooserGroups.map((group) => (
              <li key={group.id} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-primary">
                  <Link href={group.href} className="hover:text-accent hover:underline">
                    {group.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.text}</p>
                {group.calculators.length > 0 && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Start with{' '}
                    {group.calculators.map((calculator, index) => (
                      <span key={calculator.slug}>
                        {index > 0 && ' or '}
                        <Link
                          href={calculator.href}
                          className="font-medium text-primary hover:text-accent hover:underline"
                        >
                          {calculator.name}
                        </Link>
                      </span>
                    ))}
                    .
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="directory-howto-heading" className="mt-12">
          <h2 id="directory-howto-heading" className="text-2xl font-bold text-primary">
            {howTo.title}
          </h2>
          <ol className="mt-5 space-y-4">
            {howTo.steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-primary">{step.title}</h3>
                  <p className="mt-1 max-w-3xl leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="directory-results-heading" className="mt-12">
          <h2 id="directory-results-heading" className="text-2xl font-bold text-primary">
            {results.title}
          </h2>
          <div className="mt-4 space-y-4">
            {results.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-3xl leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </main>
    </>
  )
}
