import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/legal-page'
import { OG_IMAGE, siteConfig } from '@/lib/site'

const TITLE = 'Cookie Policy'
const DESCRIPTION = `Which cookies ${siteConfig.name} allows, what each one is for, and how to change or withdraw your choice.`

export const metadata: Metadata = {
  title: `${TITLE} | ${siteConfig.name}`,
  description: DESCRIPTION,
  alternates: { canonical: '/cookies' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/cookies', type: 'website', images: OG_IMAGE },
}

const LAST_UPDATED = '8 September 2026'

export default function CookiesPage() {
  return (
    <LegalPage title={TITLE} description={DESCRIPTION}>
      <p className="text-sm">Last updated: {LAST_UPDATED}</p>

      <h2>The short version</h2>
      <p>
        {siteConfig.name} sets no cookies of its own. The calculators need none: they run in your
        browser and remember nothing between visits. Every cookie described below is set by a
        third-party service, and in regions that require consent none of them is set until you give
        it.
      </p>

      <h2>Advertising cookies</h2>
      <p>
        The site is funded by advertising served through Google AdSense. Google and its partner
        vendors set cookies in order to:
      </p>
      <ul>
        <li>choose which ad to show and, with your consent, tailor it to your interests</li>
        <li>limit how many times the same ad is repeated to you</li>
        <li>measure whether an ad was seen or clicked, and detect click fraud</li>
      </ul>
      <p>
        These are third-party cookies read by domains such as google.com, googlesyndication.com and
        doubleclick.net. Their lifetimes are set by the vendor and typically range from a single
        session to about two years. They never receive the values you type into a calculator.
      </p>

      <h2>Analytics cookies</h2>
      <p>
        A privacy-focused analytics service records aggregate page views, referrers, approximate
        country and device type so we can see which calculators are useful and whether pages load
        properly. The data is not used to identify you.
      </p>

      <h2>Strictly necessary storage</h2>
      <p>
        Your consent choice itself has to be remembered somewhere, or the banner would reappear on
        every page. That record is stored by the consent management platform and cannot be declined
        without also declining the site.
      </p>

      <h2>Changing your mind</h2>
      <p>
        Use the &ldquo;Privacy settings&rdquo; link in the footer to reopen the consent banner and
        change or withdraw your choice at any time. You can also:
      </p>
      <ul>
        <li>
          turn off ad personalisation at{' '}
          <a
            href="https://www.google.com/settings/ads"
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="underline hover:text-primary"
          >
            Google Ads Settings
          </a>
        </li>
        <li>
          opt out across participating vendors at{' '}
          <a
            href="https://www.aboutads.info/choices/"
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="underline hover:text-primary"
          >
            aboutads.info/choices
          </a>
        </li>
        <li>
          block or delete cookies in your browser settings — the calculators keep working without
          them
        </li>
      </ul>

      <p>
        The{' '}
        <Link href="/privacy" className="underline hover:text-primary">
          privacy policy
        </Link>{' '}
        explains the wider picture, including your rights under the GDPR, the KVKK and the
        CCPA/CPRA.
      </p>
    </LegalPage>
  )
}
