import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail } from 'lucide-react'

import { Breadcrumbs } from '@/components/calculator/breadcrumbs'
import { SiteHeader } from '@/components/site-header'
import { OG_IMAGE, absoluteUrl, siteConfig } from '@/lib/site'

const TITLE = 'Contact'
const DESCRIPTION = `Get in touch with ${siteConfig.name} about a wrong result, a calculator request, advertising, or a privacy question.`

export const metadata: Metadata = {
  title: `Contact ${siteConfig.name}`,
  description: DESCRIPTION,
  alternates: { canonical: '/contact' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/contact', type: 'website', images: OG_IMAGE },
}

/**
 * `ContactPage` with a `ContactPoint` is what tells Google (and an AdSense
 * reviewer following the footer link) that a real, reachable publisher stands
 * behind the site.
 */
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${siteConfig.url}/contact#contactpage`,
  url: absoluteUrl('/contact'),
  name: `Contact ${siteConfig.name}`,
  description: DESCRIPTION,
  mainEntity: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: absoluteUrl('/'),
    email: siteConfig.contactEmail,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: siteConfig.contactEmail,
        availableLanguage: ['English', 'Turkish'],
      },
    ],
  },
}

const REASONS = [
  {
    heading: 'A result looks wrong',
    body: 'Send the calculator name, the exact values you entered and the figure you expected. Every formula is covered by tests, so a reproducible example is what lets us find and fix a genuine error quickly.',
  },
  {
    heading: 'A calculator you need is missing',
    body: 'Tell us what you were trying to work out and what you would type in. Requests that describe a real task are the ones that turn into new tools.',
  },
  {
    heading: 'Advertising and partnerships',
    body: 'Ad placement on the site is handled through third-party ad networks. For anything beyond that, write to the same address with the details.',
  },
  {
    heading: 'Privacy and data questions',
    body: 'Calculations never leave your browser, so there is no calculation history to request or delete. For anything else covered by the privacy policy, use the address below and we will respond.',
  },
] as const

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
        <Breadcrumbs className="mb-8" items={[{ label: 'Home', href: '/' }, { label: TITLE }]} />

        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">Contact us</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {siteConfig.name} is run by a small independent team. Email is the only channel we use,
          and it is read by a person.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary">
              <Mail className="size-5 text-accent" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-primary">Email</p>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-lg font-medium text-accent underline underline-offset-4"
              >
                {siteConfig.contactEmail}
              </a>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            We aim to reply within two working days. There is no phone line and no postal address
            for enquiries — everything is handled by email.
          </p>
        </div>

        <div className="mt-10 space-y-4 leading-7 text-muted-foreground [&>h2]:mt-10 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-primary">
          <h2>What to write about</h2>
          {REASONS.map((reason) => (
            <div key={reason.heading}>
              <h3 className="mt-6 text-lg font-semibold text-primary">{reason.heading}</h3>
              <p className="mt-2">{reason.body}</p>
            </div>
          ))}

          <h2>Before you write</h2>
          <p>
            The{' '}
            <Link href="/disclaimer" className="underline hover:text-primary">
              disclaimer
            </Link>{' '}
            explains what the results are and are not, and the{' '}
            <Link href="/privacy" className="underline hover:text-primary">
              privacy policy
            </Link>{' '}
            covers cookies, analytics and advertising. Most questions are answered there. We cannot
            give financial, medical, legal or tax advice about your own situation, and we do not
            reply to unsolicited link-building or guest-post offers.
          </p>
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
