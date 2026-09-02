import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/calculator/breadcrumbs'
import { CalculatorCard } from '@/components/calculator/calculator-card'
import { SiteHeader } from '@/components/site-header'
import {
  CALCULATORS_DIRECTORY_PATH,
  type CalculatorCategoryId,
  categoriesWithLiveCalculators,
  categoryHref,
  getCategory,
  getLiveCalculatorsByCategory,
} from '@/lib/calculators'
import { absoluteUrl } from '@/lib/site'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

/**
 * One page per category that actually has live calculators.
 *
 * `dynamicParams = false` means anything outside this list 404s rather than
 * being rendered on demand — including a category whose calculators are all
 * still planned.
 */
export function generateStaticParams() {
  return categoriesWithLiveCalculators.map((category) => ({ category: category.id }))
}

export const dynamicParams = false

function resolveCategory(slug: string) {
  const match = categoriesWithLiveCalculators.find((category) => category.id === slug)
  return match ? getCategory(match.id as CalculatorCategoryId) : undefined
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params
  const category = resolveCategory(slug)
  if (!category) return {}

  const path = categoryHref(category.id)

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title: category.seoTitle,
      description: category.seoDescription,
      url: path,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params
  const category = resolveCategory(slug)
  if (!category) notFound()

  const calculators = getLiveCalculatorsByCategory(category.id)
  const path = categoryHref(category.id)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.seoTitle,
    description: category.seoDescription,
    url: absoluteUrl(path),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: calculators.length,
      itemListElement: calculators.map((calculator, index) => ({
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
          items={[
            { label: 'Home', href: '/' },
            { label: 'Calculators', href: CALCULATORS_DIRECTORY_PATH },
            { label: category.name },
          ]}
        />

        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-secondary">
            <category.icon className="size-5 text-accent" />
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">
            {category.name}
          </h1>
        </div>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          {category.seoDescription}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} showCategory={false} />
          ))}
        </div>

        <section aria-labelledby="other-categories" className="mt-12 border-t border-border pt-8">
          <h2 id="other-categories" className="text-lg font-bold text-primary">
            Other categories
          </h2>
          <nav aria-label="Other categories" className="mt-4 flex flex-wrap gap-2">
            {categoriesWithLiveCalculators
              .filter((other) => other.id !== category.id)
              .map((other) => (
                <Link
                  key={other.id}
                  href={categoryHref(other.id)}
                  className="rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-primary transition hover:border-accent hover:bg-muted"
                >
                  {other.name}
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    {other.liveCount}
                  </span>
                </Link>
              ))}
          </nav>

          <Link
            href={CALCULATORS_DIRECTORY_PATH}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            All calculators
          </Link>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </main>
    </>
  )
}
