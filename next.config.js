/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for hosting providers like Hostinger
  output: 'export',
  trailingSlash: true,
  
  // Configuration for subdirectory deployment
  basePath: '/chatbot',
  assetPrefix: '/chatbot/',
  
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Environment variables (these will be embedded at build time)
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://renovablesdelsurmx.online:8443',
    NEXT_PUBLIC_N8N_WEBHOOK_URL: 'https://n8n.srv865372.hstgr.cloud/webhook/615091e3-d7c3-477d-9d64-fae01c60845b',
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn']
    },
  },
}

module.exports = nextConfig