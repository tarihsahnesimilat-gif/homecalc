import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'

import { AdSenseScript } from '@/components/adsense'
import { SiteFooter } from '@/components/site-footer'
import { adsenseClientId, googleSiteVerification, siteConfig } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  /**
   * No `template` on purpose. Every page title already names the tool and its
   * job, and appending ` | HomeCalc` pushed all of them past the ~60
   * characters Google renders, truncating the descriptive half. Google derives
   * the site name for the SERP from the WebSite schema on the home page.
   */
  title: 'HomeCalc — Simple calculators for everyday life',
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: 'Next.js',
  publisher: siteConfig.publisher,
  alternates: { canonical: '/' },
  /**
   * Site-ownership tags. Search Console's HTML-tag method, and the AdSense
   * account meta so whichever verification method AdSense offers will pass.
   */
  ...(googleSiteVerification || adsenseClientId
    ? {
        verification: {
          ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
          ...(adsenseClientId ? { other: { 'google-adsense-account': adsenseClientId } } : {}),
        },
      }
    : {}),
  openGraph: {
    title: 'HomeCalc — Numbers made simple',
    description: 'Free, fast, and easy-to-use calculators for everyday life.',
    url: '/',
    siteName: siteConfig.name,
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        {/* Opens the connection to the ad server before the tag asks for it. */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        <AdSenseScript />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <div className="flex-1">{children}</div>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
