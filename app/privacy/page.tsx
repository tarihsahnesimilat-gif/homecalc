import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal-page'
import { OG_IMAGE, siteConfig } from '@/lib/site'

const TITLE = 'Privacy Policy'
const DESCRIPTION = `How ${siteConfig.name} handles your data: calculations run in your browser, and the values you enter are never sent to us or stored.`

export const metadata: Metadata = {
  title: `${TITLE} | ${siteConfig.name}`,
  description: DESCRIPTION,
  alternates: { canonical: '/privacy' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/privacy', type: 'website', images: OG_IMAGE },
}

export default function PrivacyPage() {
  return (
    <LegalPage title={TITLE} description={DESCRIPTION}>
      <h2>What we collect</h2>
      <p>
        Every calculator on {siteConfig.name} runs entirely in your browser. The numbers, dates and
        times you type are used to display a result on your screen and are never transmitted to us,
        written to a server, or stored anywhere beyond your own device.
      </p>
      <p>
        We do not ask you to create an account, and there is nothing to sign up for, so we hold no
        names, email addresses or passwords.
      </p>

      <h2>Analytics</h2>
      <p>
        We may use a privacy-focused analytics service to understand which pages are visited and how
        the site performs. Where analytics is enabled it records aggregate information such as page
        views, referrers, approximate country and device type. It does not record the values you
        enter into a calculator, and it is not used to identify individual visitors.
      </p>

      <h2>Cookies</h2>
      <p>
        {siteConfig.name} does not set advertising or tracking cookies of its own. If advertising is
        introduced in future, this page will be updated before any advertising cookies are served,
        and any consent required in your region will be requested first.
      </p>

      <h2>Third-party services</h2>
      <p>
        The site is served through a hosting provider, which processes standard technical request
        data such as IP addresses and user-agent strings in order to deliver pages and protect
        against abuse. That processing is governed by the provider&rsquo;s own privacy terms.
      </p>

      <h2>Your choices</h2>
      <p>
        Because nothing you enter leaves your browser, there is no personal calculation data for us
        to access, correct or delete. You can block analytics and scripts using your browser
        settings or an extension; the calculators will continue to work.
      </p>

      <h2>Children</h2>
      <p>
        {siteConfig.name} is a general-purpose reference tool and is not directed at children, and we
        do not knowingly collect information from them.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this page as the site changes. The version published here is always the
        current one.
      </p>
    </LegalPage>
  )
}
