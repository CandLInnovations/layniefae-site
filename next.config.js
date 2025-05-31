/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['localhost'],
  },
  env: {
    SITE_NAME: 'Sacred Blooms & Ceremonies',
    SITE_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  },
}

module.exports = nextConfig