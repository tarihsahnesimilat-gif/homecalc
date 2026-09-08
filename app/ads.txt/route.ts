import { adsensePublisherId } from '@/lib/site'

/**
 * Serves `/ads.txt` from the configured publisher id.
 *
 * An ads.txt that names the wrong publisher tells buyers your inventory is
 * unauthorised, so this file is derived from the same env var the ad tag uses
 * rather than hand-written — the two can never disagree. Until
 * `NEXT_PUBLIC_ADSENSE_ID` is set the response is empty, which is exactly how a
 * site with no ad partners should answer.
 */
export const dynamic = 'force-static'

export function GET(): Response {
  const body = adsensePublisherId
    ? `google.com, ${adsensePublisherId}, DIRECT, f08c47fec0942fa0\n`
    : '# No authorised ad sellers configured yet.\n'

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
