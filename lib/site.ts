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
 * Google AdSense publisher id, in the two spellings the two consumers need.
 *
 * AdSense shows the same number as `pub-0000000000000000` in the dashboard and
 * as `ca-pub-0000000000000000` in the code snippet, and it is easy to paste the
 * wrong one. The ad tag needs the `ca-` form and ads.txt needs it without, so
 * normalise once here and let either spelling be configured.
 *
 * Set `NEXT_PUBLIC_ADSENSE_ID` in the hosting provider's environment settings
 * once AdSense has issued the id, then redeploy — `NEXT_PUBLIC_*` values are
 * baked in at build time, so adding the variable alone changes nothing. While
 * it is unset the ad loader renders nothing and `/ads.txt` stays empty, so a
 * half-configured deployment can never publish a wrong publisher id, which is
 * itself an AdSense policy problem.
 */
const rawAdsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim().replace(/^ca-/, '') ?? ''

/** Anything that is not a `pub-…` id is treated as unset rather than shipped. */
const hasAdsenseId = /^pub-\d{10,}$/.test(rawAdsenseId)

/** `ca-pub-…` — the form the ad tag's `client` parameter expects. */
export const adsenseClientId = hasAdsenseId ? `ca-${rawAdsenseId}` : ''

/** `pub-…` — the form the ads.txt seller line expects. */
export const adsensePublisherId = hasAdsenseId ? rawAdsenseId : ''

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
