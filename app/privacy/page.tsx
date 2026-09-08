import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/legal-page'
import { OG_IMAGE, siteConfig } from '@/lib/site'

const TITLE = 'Privacy Policy'
const DESCRIPTION = `How ${siteConfig.name} handles your data: calculations run in your browser and are never sent to us, and this page explains the cookies advertising and analytics do set.`

export const metadata: Metadata = {
  title: `${TITLE} | ${siteConfig.name}`,
  description: DESCRIPTION,
  alternates: { canonical: '/privacy' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/privacy', type: 'website', images: OG_IMAGE },
}

const LAST_UPDATED = '8 September 2026'

export default function PrivacyPage() {
  return (
    <LegalPage title={TITLE} description={DESCRIPTION}>
      <p className="text-sm">Last updated: {LAST_UPDATED}</p>

      <h2>Who we are</h2>
      <p>
        {siteConfig.name} publishes free online calculators at {siteConfig.url}. For any question
        about this policy, or to exercise any of the rights described below, write to{' '}
        <a href={`mailto:${siteConfig.contactEmail}`} className="underline hover:text-primary">
          {siteConfig.contactEmail}
        </a>
        . We are the data controller for the personal data described here.
      </p>

      <h2>What you enter into a calculator</h2>
      <p>
        Every calculator on {siteConfig.name} runs entirely in your browser. The numbers, dates and
        times you type are used to display a result on your screen and are never transmitted to us,
        written to a server, or stored anywhere beyond your own device. Closing the tab discards
        them.
      </p>
      <p>
        We do not ask you to create an account and there is nothing to sign up for, so we hold no
        names, email addresses or passwords — unless you write to us, in which case we keep your
        message and address only for as long as it takes to answer you.
      </p>

      <h2>Advertising and Google AdSense</h2>
      <p>
        This site is free to use and is funded by advertising. We use Google AdSense to serve the
        ads you see. Third-party vendors, including Google, use cookies to serve ads based on your
        previous visits to this site and to other sites on the internet.
      </p>
      <ul>
        <li>
          Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to you
          based on your visit to this and other sites.
        </li>
        <li>
          You can opt out of personalised advertising by visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="underline hover:text-primary"
          >
            Google Ads Settings
          </a>
          . Ads will still appear; they simply stop being tailored to you.
        </li>
        <li>
          To opt out of personalised advertising from other participating vendors, use{' '}
          <a
            href="https://www.aboutads.info/choices/"
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="underline hover:text-primary"
          >
            aboutads.info/choices
          </a>{' '}
          or{' '}
          <a
            href="https://optout.networkadvertising.org/"
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="underline hover:text-primary"
          >
            the NAI opt-out page
          </a>
          .
        </li>
        <li>
          How Google handles data from sites that use its services is described in{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="underline hover:text-primary"
          >
            Google&rsquo;s partner sites policy
          </a>
          .
        </li>
      </ul>
      <p>
        Ad networks never receive the values you type into a calculator. They see the page you are
        on, not what you worked out on it.
      </p>

      <h2>Cookies and consent</h2>
      <p>
        {siteConfig.name} sets no advertising or tracking cookies of its own. The cookies on this
        site come from the advertising and analytics services described above and are listed on
        the{' '}
        <Link href="/cookies" className="underline hover:text-primary">
          cookie policy
        </Link>{' '}
        page.
      </p>
      <p>
        If you are in the European Economic Area, the United Kingdom or Switzerland, a consent
        banner appears on your first visit and no advertising or analytics cookie is set until you
        choose. You can reopen that banner at any time from the &ldquo;Privacy settings&rdquo; link
        in the footer and change or withdraw your choice. You can also block cookies entirely in
        your browser settings; the calculators will continue to work.
      </p>

      <h2>Analytics</h2>
      <p>
        We use a privacy-focused analytics service to understand which pages are visited and how the
        site performs. It records aggregate information such as page views, referrers, approximate
        country and device type. It does not record the values you enter into a calculator and is
        not used to identify individual visitors.
      </p>

      <h2>Hosting and server logs</h2>
      <p>
        The site is served through a hosting provider, which processes standard technical request
        data such as IP addresses and user-agent strings in order to deliver pages and protect
        against abuse. That processing is governed by the provider&rsquo;s own privacy terms and the
        logs are retained only briefly.
      </p>

      <h2>Legal bases and your rights (GDPR / UK GDPR)</h2>
      <p>
        Where the GDPR applies, we rely on your consent for advertising and analytics cookies, and
        on our legitimate interest in running a secure, working website for server logs and for
        answering the emails you send us.
      </p>
      <p>
        You have the right to access the personal data we hold about you, to have it corrected or
        erased, to restrict or object to its processing, to data portability, and to withdraw
        consent at any time without affecting processing already carried out. You also have the
        right to complain to your national supervisory authority. Because nothing you enter into a
        calculator leaves your browser, in practice there is rarely any personal data of yours for
        us to produce — but write to us and we will confirm that in writing.
      </p>

      <h2>KVKK — visitors in Türkiye</h2>
      <p>
        For visitors in Türkiye, personal data is processed under Law No. 6698 on the Protection of
        Personal Data (KVKK). Under Article 11 you may ask whether your data is processed, request
        information about that processing, ask for correction or deletion, and object to results
        produced solely by automated analysis. Requests go to the same address:{' '}
        <a href={`mailto:${siteConfig.contactEmail}`} className="underline hover:text-primary">
          {siteConfig.contactEmail}
        </a>
        , and are answered within thirty days.
      </p>

      <h2>Visitors in California and other US states</h2>
      <p>
        We do not sell personal information for money. Serving personalised ads may count as
        &ldquo;sharing&rdquo; for cross-context behavioural advertising under the CCPA/CPRA. To opt
        out, decline personalised advertising in the consent banner, use Google Ads Settings above,
        or send a Global Privacy Control signal from your browser, which we honour.
      </p>

      <h2>International transfers</h2>
      <p>
        Our hosting, analytics and advertising providers operate globally, so data may be processed
        outside your country, including in the United States. Those providers rely on the European
        Commission&rsquo;s standard contractual clauses or an equivalent transfer mechanism.
      </p>

      <h2>Children</h2>
      <p>
        {siteConfig.name} is a general-purpose reference tool, is not directed at children under 16,
        and we do not knowingly collect information from them. If you believe a child has sent us
        personal data, write to us and we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this page as the site changes, and the date at the top always reflects the
        current version. Material changes to how advertising works here will be reflected on this
        page before they take effect.
      </p>
    </LegalPage>
  )
}
