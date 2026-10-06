import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Public-site Content Security Policy.
 *
 * Deliberately strict: no `unsafe-eval`, no third-party script origins. The
 * only additions over the previous policy are the frame origins needed by the
 * CMS video-embed block, which renders privacy-friendly players.
 *
 * `script-src 'unsafe-inline'` is a considered trade, not an omission. Next
 * emits the RSC payload as inline <script> pushes, so tightening this means
 * either hashes — which change on every build and cannot be expressed in a
 * static config — or a per-request nonce. A nonce has to be minted in
 * middleware, which makes every response dynamic and gives up the static
 * prerendering this site's Core Web Vitals depend on: a measurable
 * performance and caching regression bought for a policy that already admits
 * no third-party script origin and no `unsafe-eval`. If a nonce is ever
 * wanted, it should arrive together with a decision to render these routes
 * dynamically, not on its own.
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
  "frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com",
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
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  /*
   * HSTS: two years, and deliberately WITHOUT `includeSubDomains` or `preload`.
   *
   * The directive only takes effect over HTTPS, so it is inert in local
   * development and on the preview deployments.
   *
   * `includeSubDomains` is omitted on purpose rather than by oversight. It
   * would bind every present and future subdomain of the production domain to
   * HTTPS-only, and a subdomain still served over plain HTTP — a legacy host,
   * a mail or marketing tool on a CNAME — would stop resolving for anyone who
   * had already visited the site once, with no way to undo it inside the
   * max-age window. That inventory is not verifiable from this repository, so
   * the safe default ships and the stricter one is an explicit owner decision.
   *
   * To reach an A+ on the usual header graders, once every subdomain of the
   * production domain is confirmed HTTPS-only, extend this to
   * `max-age=63072000; includeSubDomains; preload` and submit the domain at
   * hstspreload.org. Do not add `preload` before that check.
   */
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /*
   * `experimental.inlineCss` was measured here and rejected, so that nobody
   * re-adds it on the reasoning that it removes a render-blocking request.
   * It does, but this site's stylesheet is ~436KB uncompressed, so inlining it
   * moved the homepage from 90 to 84 on mobile Lighthouse and pushed Total
   * Blocking Time from 40ms to 310ms — the main thread spends longer parsing
   * the inlined rules than it saved on the round trip, and the document goes
   * from ~55KB to ~101KB on the wire. The stylesheet's size is the actual
   * problem; inlining only moves it onto the critical path.
   */
  turbopack: {
    root: repositoryRoot
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' }
    ],
    formats: ['image/avif', 'image/webp'],
    /*
     * Permitted `quality` values for the optimizer.
     *
     * Next 16 serves only the qualities declared here and answers any other
     * with an error, so this list is what makes a non-default quality usable
     * at all. 75 stays for general imagery; 60 exists for the hero still,
     * which is the homepage's Largest Contentful Paint element. At AVIF q60
     * the hero photograph is visually indistinguishable at its rendered size
     * while costing roughly half the bytes, and on a throttled mobile
     * connection those bytes are the whole of the LCP cost.
     */
    qualities: [60, 75]
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
      { source: '/calculator', destination: '/calculators/mortgage-payment', permanent: true }
    ];
  }
};

export default nextConfig;
