import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const baseSecurityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
];

const siteCsp = [
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
].join('; ');

/**
 * The embedded Sanity Studio is a first-party application route that must reach
 * the Content Lake and run its own bundled workers. It gets a scoped policy
 * instead of loosening the policy for the public site.
 */
const studioCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' https://*.sanity.io",
  "frame-ancestors 'self' https://*.sanity.studio https://*.sanity.io",
  "frame-src 'self' blob: https://*.sanity.io",
  "img-src 'self' blob: data: https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data: https://*.sanity.io https://design-system-static.sanity.io",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io",
  "object-src 'none'",
  'upgrade-insecure-requests'
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: repositoryRoot
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' }]
  },
  async headers() {
    // Later matching entries win, so the Studio rules must come after the
    // site-wide rule to override it on /studio.
    return [
      {
        source: '/(.*)',
        headers: [...baseSecurityHeaders, { key: 'Content-Security-Policy', value: siteCsp }]
      },
      {
        source: '/studio',
        headers: [{ key: 'Content-Security-Policy', value: studioCsp }]
      },
      {
        source: '/studio/:path*',
        headers: [{ key: 'Content-Security-Policy', value: studioCsp }]
      }
    ];
  },
  async redirects() {
    return [
      // Canonical origin: the apex domain is the only production host.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.daffordablehomes.com' }],
        destination: 'https://daffordablehomes.com/:path*',
        permanent: true
      },
      { source: '/book', destination: '/consultation', permanent: true },
      { source: '/resources/calculators', destination: '/calculators', permanent: true },
      { source: '/resources/calculators/affordability', destination: '/calculators/affordability', permanent: true },
      { source: '/resources/calculators/closing-costs', destination: '/calculators/closing-costs', permanent: true },
      { source: '/resources/calculators/down-payment', destination: '/calculators/down-payment', permanent: true },
      { source: '/resources/calculators/mortgage-payment', destination: '/calculators/mortgage-payment', permanent: true },
      { source: '/calculator', destination: '/calculators/mortgage-payment', permanent: true }
    ];
  }
};

export default nextConfig;
