import nextIntl from 'next-intl/plugin';
import pwa from '@ducanh2912/next-pwa';

// กำหนดค่า next-intl โดยระบุพาธของ i18n.ts
const withNextIntl = nextIntl('./src/i18n.ts');

// กำหนดค่า PWA
const withPWA = pwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // เพิ่มการตั้งค่าเพื่อป้องกันแคชเก่า
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/evrpbwwzkznageuplglx\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'evrpbwwzkznageuplglx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// The wrapping order is important.
export default withNextIntl(withPWA(nextConfig));