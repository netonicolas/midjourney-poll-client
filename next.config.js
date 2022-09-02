/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  env:{
    STRAPI_URL: process.env.STRAPI_URL,
  }
}

module.exports = nextConfig
