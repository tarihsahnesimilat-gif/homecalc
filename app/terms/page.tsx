import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal-page'
import { siteConfig } from '@/lib/site'

const TITLE = 'Terms of Use'
const DESCRIPTION = `The terms that apply when you use ${siteConfig.name}: the calculators are free to use, provided as they are, and offered for general information.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/terms' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/terms', type: 'website' },
}

export default function TermsPage() {
  return (
    <LegalPage title={TITLE} description={DESCRIPTION}>
      <h2>Using the site</h2>
      <p>
        {siteConfig.name} is free to use, for personal and commercial purposes alike, with no
        account required. By using the site you accept the terms on this page.
      </p>

      <h2>The calculators are provided as they are</h2>
      <p>
        We take accuracy seriously: every calculator uses standard published formulas, states its
        assumptions, and is covered by an automated test suite. Even so, the tools are provided
        without warranty of any kind. We do not guarantee that a result will be free of error, or
        that it will be suitable for a particular purpose.
      </p>
      <p>
        You are responsible for checking any figure before relying on it for something that matters.
        See the <a href="/disclaimer">disclaimer</a> for what the results are and are not.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>interfere with the site or attempt to disrupt it for other people</li>
        <li>use automated systems in a way that places unreasonable load on it</li>
        <li>present the site or its results as your own work or as endorsed by you</li>
      </ul>

      <h2>Content and intellectual property</h2>
      <p>
        The text, design and code of {siteConfig.name} belong to its authors. The mathematical
        formulas themselves are public knowledge and are not claimed by anyone. You are welcome to
        use the results of a calculation however you like.
      </p>

      <h2>Availability</h2>
      <p>
        We aim to keep the site available and correct, but it may be changed, interrupted or
        withdrawn at any time without notice. Calculators may be added, revised or removed.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, we are not liable for any loss arising from use of this
        site or reliance on its results, including financial loss and loss of data. Some
        jurisdictions do not allow certain limitations, in which case only those permitted apply.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        These terms may be updated as the site changes. The version published here is always the
        current one.
      </p>
    </LegalPage>
  )
}
