/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: new RegExp(
        `^https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GCP_BUCKET}/.*$`
      ),
      handler: 'CacheFirst', 
      options: {
        cacheName: 'google-cloud-images',
        expiration: {
          maxEntries: 200, // Cache up to 200 images
          maxAgeSeconds: 1 * 24 * 60 * 60, // Cache for 1 day
        },
      },
    },
    {
      urlPattern: new RegExp(`^${process.env.NEXT_PUBLIC_BACKEND_URL}/.*$`),
      handler: 'NetworkFirst', 
      options: {
        cacheName: 'backend-api-cache',
        expiration: {
          maxEntries: 100, // Limit to 100 cached entries
          maxAgeSeconds: 3600, // Cache for 1 hour
        },
        networkTimeoutSeconds: 10, // Fallback to cache if response takes longer than 10 seconds
      },
    },
    {
      urlPattern: /\.(?:js|css|html)$/, // Cache static assets
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'storage.googleapis.com',
            port: '',
            pathname: `/${process.env.NEXT_PUBLIC_GCP_BUCKET}/**`,
        },
    ],
  },
  optimizeFonts:true,
}

module.exports = withPWA(nextConfig)
