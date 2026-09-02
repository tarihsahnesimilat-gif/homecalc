/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // The project passes `tsc --noEmit`; let production builds enforce it.
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
