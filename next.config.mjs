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
}

export default nextConfig
