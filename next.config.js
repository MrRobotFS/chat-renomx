/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  // Static export only for production builds
  ...(isDev ? {} : {
    output: 'export',
    basePath: '/chatbot',
    assetPrefix: '/chatbot/',
  }),

  trailingSlash: true,

  images: {
    unoptimized: true, // Required for static export
  },

  // Environment variables will be read from .env files
  // No need to hardcode them here

  // Performance optimizations
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn']
    },
  },
}

module.exports = nextConfig