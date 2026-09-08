import Link from 'next/link'

import { PrivacySettingsLink } from '@/components/privacy-settings-link'
import { CALCULATORS_DIRECTORY_PATH, categoriesWithLiveCalculators, categoryHref } from '@/lib/calculators'
import { siteConfig } from '@/lib/site'

const SITE_LINKS = [
  { label: 'All calculators', href: CALCULATORS_DIRECTORY_PATH },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/#faq' },
] as const

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Terms', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
] as const

/**
 * Shared site footer.
 *
 * Rendered from the root layout so every page carries it — the legal pages in
 * particular need to be reachable from anywhere, not just the homepage, and an
 * ad network's reviewer will look for exactly these links.
 */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <nav aria-labelledby="footer-site" className="text-sm">
            <h2 id="footer-site" className="font-semibold text-primary">
              {siteConfig.name}
            </h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-primary">
                  {siteConfig.contactEmail}
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-categories" className="text-sm">
            <h2 id="footer-categories" className="font-semibold text-primary">
              Categories
            </h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              {categoriesWithLiveCalculators.map((category) => (
                <li key={category.id}>
                  <Link href={categoryHref(category.id)} className="hover:text-primary">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-legal" className="text-sm">
            <h2 id="footer-legal" className="font-semibold text-primary">
              Legal
            </h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <PrivacySettingsLink className="text-left hover:text-primary" />
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. Free calculators for everyday life.
          Results are for general information only and are not financial, medical, legal or tax
          advice. This site is funded by advertising.
        </p>
      </div>
    </footer>
  )
}
