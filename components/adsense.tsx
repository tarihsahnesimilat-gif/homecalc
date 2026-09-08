import Script from 'next/script'

import { adsenseClientId } from '@/lib/site'

/**
 * Loads the AdSense tag once, from the root layout.
 *
 * Renders nothing until `NEXT_PUBLIC_ADSENSE_ID` is set, so previews and local
 * development never call Google, and a deployment that has not been issued a
 * publisher id cannot ship a broken tag. `afterInteractive` keeps the script
 * off the critical path — ad scripts are the usual cause of a bad LCP, and page
 * experience is part of what an AdSense reviewer looks at.
 *
 * With Auto ads enabled in the AdSense dashboard this tag alone is enough to
 * place ads; `<AdUnit />` below is for slots you want to position yourself.
 */
export function AdSenseScript() {
  if (!adsenseClientId) {
    return null
  }

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
    />
  )
}
