import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Breadcrumbs } from '@/components/calculator/breadcrumbs'
import { CalculatorCard } from '@/components/calculator/calculator-card'
import { SiteHeader } from '@/components/site-header'
import {
  CALCULATORS_DIRECTORY_PATH,
  categoryHref,
  groupLiveCalculatorsByCategory,
  liveCalculators,
} from '@/lib/calculators'
import { OG_IMAGE, absoluteUrl } from '@/lib/site'

const TITLE = 'All Calculators — The Full CalculatorHub Directory'
const DESCRIPTION =
  'Every CalculatorHub tool in one place, grouped by category: math, finance, health, date and time, and everyday conversions. All free, all instant, no sign-up.'

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
          Every CalculatorHub tool, grouped by what it helps you work out. There are{' '}
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </main>
    </>
  )
}
