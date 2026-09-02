import type { Metadata } from 'next'

import { LegalPage } from '@/components/legal-page'
import { siteConfig } from '@/lib/site'

const TITLE = 'Disclaimer'
const DESCRIPTION = `What ${siteConfig.name} results are and are not: general information from standard formulas, never financial, medical or professional advice.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/disclaimer' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/disclaimer', type: 'website' },
}

export default function DisclaimerPage() {
  return (
    <LegalPage title={TITLE} description={DESCRIPTION}>
      <h2>General information only</h2>
      <p>
        Everything on {siteConfig.name} is provided for general information and education. A result
        is the output of a standard formula applied to the numbers you entered — nothing more. It
        does not take your circumstances into account, because the site knows nothing about them.
      </p>

      <h2>Not financial advice</h2>
      <p>
        The finance calculators — including compound interest, loan payments, investment growth,
        return on investment and break-even — are mathematical projections, not forecasts. They
        assume the fixed rates and conditions you enter and exclude fees, taxes, inflation and
        changes in the market. Real outcomes differ, and investments can lose value.
      </p>
      <p>
        Nothing here is a recommendation to buy, sell or hold anything, or to enter into any
        financial agreement. Speak to a qualified financial professional about decisions that
        affect your money.
      </p>

      <h2>Not medical advice</h2>
      <p>
        The health calculators — BMI, BMR and daily calories — use population-level formulas that
        describe a typical person with the measurements you enter. They cannot assess your health,
        diagnose anything, or account for body composition, medical conditions, medication or
        pregnancy.
      </p>
      <p>
        BMI in particular is a screening measure rather than a diagnostic one. Speak to a qualified
        healthcare professional about anything concerning your health, weight or diet.
      </p>

      <h2>Not legal or tax advice</h2>
      <p>
        The sales tax calculator applies the rate you supply. It does not know which rate applies to
        a given product in a given place, and tax rules vary by country, state and category. Check
        with the relevant tax authority or a qualified adviser.
      </p>

      <h2>Accuracy</h2>
      <p>
        Formulas are implemented from published, standard definitions and are covered by an
        automated test suite, and every calculator shows the formula it uses so you can check the
        working. Even so, errors are possible, and rounding means a displayed figure may differ
        slightly from one produced elsewhere. Verify anything important independently.
      </p>

      <h2>External links</h2>
      <p>
        Where the site links elsewhere, we are not responsible for the content or accuracy of those
        pages.
      </p>
    </LegalPage>
  )
}
