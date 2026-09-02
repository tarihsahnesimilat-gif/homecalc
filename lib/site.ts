/**
 * Single place for the canonical site origin used by metadata, robots and the
 * sitemap.
 *
 * `NEXT_PUBLIC_SITE_URL` lets a deployment set its real domain without any code
 * change — set it in the hosting provider's environment settings before going
 * live, or canonical URLs and the sitemap will point at the placeholder below.
 * It is read at build time, contains no secret, and is optional: local
 * development and the test suite work without it.
 */
const FALLBACK_URL = 'https://calculatorhub.example.com'

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configured) {
    // Shipping the placeholder would point every canonical, every OG url and
    // all 61 sitemap entries at a domain nobody owns. Harmless in dev and in
    // tests, so warn only when a production build is what is being produced.
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        `[site] NEXT_PUBLIC_SITE_URL is not set — canonical URLs and the sitemap will use ${FALLBACK_URL}. Set it to the real origin before deploying.`,
      )
    }
    return FALLBACK_URL
  }

  // A trailing slash would produce doubled slashes once paths are appended.
  return configured.replace(/\/+$/, '')
}

export const siteConfig = {
  name: 'CalculatorHub',
  url: resolveSiteUrl(),
  description:
    'Free, fast, and easy-to-use calculators for math, money, health, home, and education.',
} as const

/**
 * The site-wide social card produced by `app/opengraph-image.tsx`.
 *
 * Next.js attaches a file-based OG image only to pages that do not declare
 * their own `openGraph` block, and every page here declares one so it can set
 * a per-page title and url. Spreading this in keeps the card on all of them.
 */
export const OG_IMAGE = '/opengraph-image'

export function absoluteUrl(path = '/'): string {
  return new URL(path, siteConfig.url).toString()
}
