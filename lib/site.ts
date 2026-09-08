/**
 * Single place for the canonical site origin, brand and contact details used by
 * metadata, robots, the sitemap and the legal pages.
 *
 * `NEXT_PUBLIC_SITE_URL` lets a deployment set its real domain without any code
 * change — set it in the hosting provider's environment settings before going
 * live, or canonical URLs and the sitemap will point at the fallback below.
 * It is read at build time, contains no secret, and is optional: local
 * development and the test suite work without it.
 */
const FALLBACK_URL = 'https://homecalc.net'

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configured) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        `[site] NEXT_PUBLIC_SITE_URL is not set — canonical URLs and the sitemap will use ${FALLBACK_URL}.`,
      )
    }
    return FALLBACK_URL
  }

  // A trailing slash would produce doubled slashes once paths are appended.
  return configured.replace(/\/+$/, '')
}

export const siteConfig = {
  name: 'HomeCalc',
  url: resolveSiteUrl(),
  description:
    'Free, fast, and easy-to-use calculators for math, money, health, home, and education.',
  /** Published on the contact page and in the legal pages. A real, monitored inbox. */
  contactEmail: 'contact@homecalc.net',
  /** Shown on the about page so readers know who stands behind the numbers. */
  publisher: 'HomeCalc',
} as const

/**
 * Google AdSense publisher id, e.g. `ca-pub-1234567890123456`.
 *
 * Set `NEXT_PUBLIC_ADSENSE_ID` in the hosting provider's environment settings
 * once AdSense has issued the id. While it is unset the ad loader renders
 * nothing and `/ads.txt` stays empty, so a half-configured deployment can never
 * publish a wrong publisher id — which is itself an AdSense policy problem.
 */
export const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() ?? ''

/** Google Search Console HTML-tag verification token, if that method is used. */
export const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ?? ''

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
