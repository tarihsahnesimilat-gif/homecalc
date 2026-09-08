import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/calculator/breadcrumbs'
import { SiteHeader } from '@/components/site-header'
import { CALCULATORS_DIRECTORY_PATH, liveCalculators } from '@/lib/calculators'
import { OG_IMAGE, siteConfig } from '@/lib/site'

const TITLE = 'About'
const DESCRIPTION = `Who runs ${siteConfig.name}, how the calculators are built and tested, and how the site is funded.`

export const metadata: Metadata = {
  title: `About ${siteConfig.name} — who we are and how the calculators are built`,
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/about', type: 'website', images: OG_IMAGE },
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
        <Breadcrumbs className="mb-8" items={[{ label: 'Home', href: '/' }, { label: TITLE }]} />

        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">
          About {siteConfig.name}
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{DESCRIPTION}</p>

        <div className="mt-10 space-y-4 leading-7 text-muted-foreground [&>h2]:mt-10 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-primary [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6">
          <h2>What this site is</h2>
          <p>
            {siteConfig.name} is a collection of {liveCalculators.length} free calculators for the
            arithmetic that comes up in ordinary life: working out a percentage, splitting a bill,
            checking what a loan really costs, converting units, counting the days to a deadline.
            Every tool is on its own page, opens straight into the calculation, and needs no
            account.
          </p>
          <p>
            The site is run as an independent publishing project, not by a bank, a lender, a clinic
            or any brand whose products the numbers might favour. Nothing on the site is sponsored
            content, and no calculator is tuned to push you towards a particular outcome.
          </p>

          <h2>How the calculators are built</h2>
          <p>
            Each calculator implements a standard, published formula rather than an approximation
            someone invented. Mortgage payments use the ordinary amortisation formula, BMI uses the
            Quetelet definition, BMR uses Mifflin-St Jeor. Where a formula has known limits, the
            page says so instead of hiding it.
          </p>
          <ul>
            <li>
              The calculation logic lives apart from the interface and is covered by an automated
              test suite that runs on every change.
            </li>
            <li>
              Each page shows the formula it used and breaks the result into its parts, so you can
              check the working rather than trust a single number.
            </li>
            <li>
              Everything runs in your browser. The values you type are never sent to a server, so
              there is no calculation history for anyone to store, sell or leak.
            </li>
          </ul>

          <h2>What it is not</h2>
          <p>
            A calculator knows the numbers you typed and nothing else. Results here are general
            information, never financial, medical, legal or tax advice, and they cannot account for
            your circumstances. The{' '}
            <Link href="/disclaimer" className="underline hover:text-primary">
              disclaimer
            </Link>{' '}
            sets out the limits in full — worth reading before you rely on a figure for something
            that matters.
          </p>

          <h2>How the site is funded</h2>
          <p>
            {siteConfig.name} is free to use and is funded by advertising. Ads are served by
            third-party networks and are labelled as advertising where they appear. Advertisers
            have no say in which calculators exist, how they work, or what the pages say. The{' '}
            <Link href="/privacy" className="underline hover:text-primary">
              privacy policy
            </Link>{' '}
            explains what advertising cookies do and how to control them.
          </p>

          <h2>Corrections and suggestions</h2>
          <p>
            If a result looks wrong, tell us and we will check it — a reproducible example is the
            fastest route to a fix. Requests for calculators we do not have yet are welcome too.
            Write to{' '}
            <a href={`mailto:${siteConfig.contactEmail}`} className="underline hover:text-primary">
              {siteConfig.contactEmail}
            </a>{' '}
            or use the{' '}
            <Link href="/contact" className="underline hover:text-primary">
              contact page
            </Link>
            .
          </p>

          <p>
            <Link href={CALCULATORS_DIRECTORY_PATH} className="underline hover:text-primary">
              Browse all {liveCalculators.length} calculators
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
