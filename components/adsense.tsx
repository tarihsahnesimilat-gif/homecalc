import { adsenseClientId } from '@/lib/site'

/**
 * The AdSense tag, rendered inside the document head from the root layout.
 *
 * Deliberately a plain `<script async>` rather than `next/script`: Google's
 * site verification fetches the page and looks for this tag between the
 * `<head>` tags, and `next/script`'s `afterInteractive` strategy puts it at the
 * end of the body instead. `async` keeps it off the critical path anyway, so
 * nothing is lost by placing it where Google expects it.
 *
 * Renders nothing until `NEXT_PUBLIC_ADSENSE_ID` is set, so previews and local
 * development never call Google and a deployment without a publisher id cannot
 * ship a broken tag.
 *
 * With Auto ads enabled in the AdSense dashboard this tag alone is enough to
 * place ads; `<AdUnit />` is for slots you want to position yourself.
 */
export function AdSenseScript() {
  if (!adsenseClientId) {
    return null
  }

  return (
    <script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
    />
  )
}
