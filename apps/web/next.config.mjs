import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { bookingEmbed } from './lib/ghl-booking.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * The GoHighLevel booking calendar's origin, when `GHL_BOOKING_URL` holds a
 * valid booking link; otherwise nothing is added. Read with the same parser the
 * /consultation page uses (lib/ghl-booking.mjs), so the frame the page renders
 * is always one this policy allows.
 */
const booking = bookingEmbed();
const frameSources = [
  "'self'",
  'https://www.youtube-nocookie.com',
  'https://player.vimeo.com',
  ...(booking ? [booking.origin] : [])
];

/**
 * Public-site Content Security Policy.
 *
 * Deliberately strict: no `unsafe-eval`, no third-party script origins. The
 * only additions over the original policy are frame origins: the
 * privacy-friendly players the CMS video-embed block renders, and the
 * GoHighLevel booking calendar when one is configured. The calendar runs inside
 * its own frame, so no GoHighLevel script, style or connection is allowed here.
 */
const publicContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "img-src 'self' data: https:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "connect-src 'self'",
  `frame-src ${frameSources.join(' ')}`,
  "object-src 'none'",
  'upgrade-insecure-requests'
].join('; ');

/**
 * Studio-only Content Security Policy, applied exclusively to `/studio`.
 *
 * Sanity Studio is a client-side application that compiles GROQ and schema code
 * at runtime, so it requires `unsafe-eval` and direct access to the Sanity APIs
 * over HTTPS and WebSocket. Scoping it to the noindexed admin route keeps the
 * public site's policy unchanged — the public pages never receive this policy.
 */
const studioContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' https://*.sanity.io",
  "frame-ancestors 'self'",
  "img-src 'self' blob: data: https://cdn.sanity.io https://*.sanity.io",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  "connect-src 'self' blob: https://*.sanity.io wss://*.sanity.io https://*.api.sanity.io",
  "frame-src 'self' https://*.sanity.io",
  "object-src 'none'",
  'upgrade-insecure-requests'
].join('; ');

const baseSecurityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: repositoryRoot
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' }
    ],
    formats: ['image/avif', 'image/webp']
  },
  async headers() {
    return [
      {
        // Studio first: Next applies the first matching header set per key.
        source: '/studio/:path*',
        headers: [
          ...baseSecurityHeaders,
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Content-Security-Policy', value: studioContentSecurityPolicy }
        ]
      },
      {
        source: '/studio',
        headers: [
          ...baseSecurityHeaders,
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Content-Security-Policy', value: studioContentSecurityPolicy }
        ]
      },
      {
        /*
         * Everything except /studio.
         *
         * A plain `/(.*)` catch-all also matches /studio, and Next keeps the
         * LAST value for a duplicated response-header key — so the public
         * policy silently replaced the Studio policy above and the Studio could
         * not load at all. The negative lookahead is what keeps the two
         * policies from colliding. Verified by asserting the served header,
         * not the config text, in tests/static/repository.test.mjs.
         */
        source: '/((?!studio(?:/|$)).*)',
        headers: [
          ...baseSecurityHeaders,
          { key: 'Content-Security-Policy', value: publicContentSecurityPolicy }
        ]
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
      { source: '/naca', destination: '/programs/naca', permanent: true },
      { source: '/neighborhoods', destination: '/areas', permanent: true }
    ];
  }
};

export default nextConfig;
