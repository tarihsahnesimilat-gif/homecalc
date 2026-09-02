import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteHeader } from '@/components/site-header'
import { calculatorHref, popularCalculators } from '@/lib/calculators'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: `Page not found | ${siteConfig.name}`,
  // Served with a 404 status, so this is belt and braces rather than a fix.
  robots: { index: false, follow: true },
}

/**
 * Replaces the framework's bare 404 so a mistyped or retired URL offers a way
 * back into the site instead of a dead end. Next.js serves this for unmatched
 * routes, including category slugs rejected by `dynamicParams = false`.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Error 404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-primary md:text-5xl">
          We could not find that page
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          The link may be out of date, or the address may have a typo. Every calculator on the
          site is listed in the directory.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/calculators"
            className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Browse all calculators
          </Link>
          <Link
            href="/"
            className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-primary transition hover:border-accent hover:bg-muted"
          >
            Go to the home page
          </Link>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-primary">Popular calculators</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {popularCalculators.map((calculator) => (
            <li key={calculator.slug}>
              <Link
                href={calculatorHref(calculator.slug)}
                className="text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
              >
                {calculator.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
