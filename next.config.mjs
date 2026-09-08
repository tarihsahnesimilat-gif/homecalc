/** @type {import('next').NextConfig} */
const nextConfig = {
  // No need to advertise the framework version to every visitor.
  poweredByHeader: false,
  typescript: {
    // The project passes `tsc --noEmit`; let production builds enforce it.
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Vercel keeps serving every deployment on its own *.vercel.app hostname.
      // Left alone those are full copies of the site competing with it in
      // search and reachable by an ad reviewer, so send them to the real
      // domain. Preview branches are exempt so they stay testable.
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<preview>.*)\\.vercel\\.app' }],
        missing: [{ type: 'header', key: 'x-vercel-deployment-url', value: '(?<preview>.*-git-.*)' }],
        destination: 'https://homecalc.net/:path*',
        permanent: true,
      },
      // One canonical host. www and the apex must not both serve the site.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.homecalc.net' }],
        destination: 'https://homecalc.net/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
