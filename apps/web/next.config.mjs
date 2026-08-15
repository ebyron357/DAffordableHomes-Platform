import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "img-src 'self' data: https:",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests'
    ].join('; ')
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: repositoryRoot
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ];
  },
  async redirects() {
    return [
      { source: '/book', destination: '/consultation', permanent: true },
      { source: '/resources/calculators', destination: '/calculators', permanent: true },
      { source: '/resources/calculators/affordability', destination: '/calculators/affordability', permanent: true },
      { source: '/resources/calculators/closing-costs', destination: '/calculators/closing-costs', permanent: true },
      { source: '/resources/calculators/down-payment', destination: '/calculators/down-payment', permanent: true },
      { source: '/resources/calculators/mortgage-payment', destination: '/calculators/mortgage-payment', permanent: true },
      { source: '/calculator', destination: '/calculators/mortgage-payment', permanent: true },
      { source: '/naca', destination: '/programs/naca', permanent: true }
    ];
  }
};

export default nextConfig;
