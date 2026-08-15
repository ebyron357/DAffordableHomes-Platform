#!/usr/bin/env node
/**
 * Route crawl and internal-link validation.
 *
 * Crawls every route reachable from "/" plus every sitemap entry against a
 * running server, then checks the things a release gate cares about:
 *
 *   - HTTP status of every route and every internal link target
 *   - exactly one <h1> per page
 *   - a canonical link on every indexable page
 *   - canonical origin matches the configured production origin
 *   - no references to obsolete production origins
 *   - unknown article slugs return a real 404
 *   - JSON-LD blocks parse, and articles carry Article + BreadcrumbList
 *   - images declare alt text
 *
 * Usage: node scripts/qa/crawl.mjs [baseUrl]
 * Default base URL: http://127.0.0.1:3000
 */

const BASE = (process.argv[2] ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const PRODUCTION_ORIGIN = 'https://daffordablehomes.com';
const OBSOLETE_ORIGINS = ['incentives.stevenjthomas.com', 'daffordablehomes-platform.vercel.app'];

const PRESERVED_ARTICLES = [
  '/blog/naca-homebuying-dallas-fort-worth',
  '/blog/homes-for-heroes-north-texas',
  '/blog/how-to-buy-home-garland-tx',
];

const failures = [];
const notes = [];
const visited = new Map();

function fail(route, message) {
  failures.push(`${route}: ${message}`);
}

async function fetchRoute(route) {
  if (visited.has(route)) return visited.get(route);
  const response = await fetch(`${BASE}${route}`, { redirect: 'manual' });
  const contentType = response.headers.get('content-type') ?? '';
  const isText = /text\/|xml|json/.test(contentType);
  const body = isText ? await response.text() : '';
  const result = { status: response.status, location: response.headers.get('location'), body, contentType };
  visited.set(route, result);
  return result;
}

function extractLinks(html) {
  return [...html.matchAll(/href="(\/[^"#]*)"/g)]
    .map((match) => match[1].split('?')[0].replace(/\/$/, '') || '/')
    .filter((href) => !href.startsWith('//') && !href.startsWith('/_next') && !href.startsWith('/api/'));
}

function checkPage(route, html) {
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) fail(route, `expected exactly one <h1>, found ${h1Count}`);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) {
    fail(route, 'missing canonical link');
  } else if (!canonical.startsWith(PRODUCTION_ORIGIN)) {
    fail(route, `canonical points at ${canonical}, expected ${PRODUCTION_ORIGIN}`);
  }

  for (const origin of OBSOLETE_ORIGINS) {
    if (html.includes(origin)) fail(route, `references obsolete origin ${origin}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(match[0])) fail(route, 'image without an alt attribute');
  }

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => {
    try {
      return JSON.parse(match[1].replace(/\\u003c/g, '<'));
    } catch (error) {
      fail(route, `invalid JSON-LD: ${error.message}`);
      return null;
    }
  });

  return schemas.filter(Boolean);
}

async function main() {
  console.log(`Crawling ${BASE}\n`);

  // Seed from the sitemap so CMS-published routes are covered too.
  const sitemap = await fetchRoute('/sitemap.xml');
  if (sitemap.status !== 200) fail('/sitemap.xml', `status ${sitemap.status}`);
  const sitemapRoutes = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].replace(PRODUCTION_ORIGIN, '') || '/')
    .map((route) => route.replace(/\/$/, '') || '/');
  if (sitemapRoutes.length === 0) fail('/sitemap.xml', 'contains no URLs');

  const robots = await fetchRoute('/robots.txt');
  if (robots.status !== 200) fail('/robots.txt', `status ${robots.status}`);
  if (!robots.body.includes(`${PRODUCTION_ORIGIN}/sitemap.xml`)) {
    fail('/robots.txt', 'does not advertise the production sitemap');
  }

  const queue = ['/', ...sitemapRoutes];
  const seen = new Set();
  const pages = [];

  while (queue.length > 0) {
    const route = queue.shift();
    if (seen.has(route)) continue;
    seen.add(route);

    const result = await fetchRoute(route);

    if (result.status >= 300 && result.status < 400) {
      notes.push(`${route} -> ${result.status} ${result.location}`);
      continue;
    }
    if (result.status !== 200) {
      fail(route, `status ${result.status}`);
      continue;
    }
    if (!result.contentType.includes('text/html')) continue;

    const schemas = checkPage(route, result.body);
    pages.push({ route, schemas });

    for (const link of extractLinks(result.body)) {
      if (!seen.has(link)) queue.push(link);
    }
  }

  // Article-specific expectations.
  for (const route of PRESERVED_ARTICLES) {
    const page = pages.find((candidate) => candidate.route === route);
    if (!page) {
      fail(route, 'preserved article URL did not return a page');
      continue;
    }
    const types = page.schemas.map((schema) => schema['@type']);
    if (!types.includes('Article')) fail(route, 'missing Article JSON-LD');
    if (!types.includes('BreadcrumbList')) fail(route, 'missing BreadcrumbList JSON-LD');
    if (!types.includes('FAQPage')) fail(route, 'missing FAQPage JSON-LD');

    const article = page.schemas.find((schema) => schema['@type'] === 'Article');
    if (article && !String(article.mainEntityOfPage?.['@id'] ?? '').startsWith(PRODUCTION_ORIGIN)) {
      fail(route, 'Article JSON-LD does not use the production origin');
    }
  }

  // Unknown slugs must 404.
  const missing = await fetchRoute('/blog/this-article-does-not-exist');
  if (missing.status !== 404) fail('/blog/this-article-does-not-exist', `expected 404, got ${missing.status}`);

  // Consultation CTA must be reachable from every article.
  for (const route of PRESERVED_ARTICLES) {
    const body = visited.get(route)?.body ?? '';
    if (!body.includes('href="/consultation"')) fail(route, 'no consultation CTA link');
  }

  // ClientVerse attribution must be present site-wide.
  for (const { route } of pages) {
    const body = visited.get(route)?.body ?? '';
    if (!body.includes('Made by') || !body.includes('https://clientverse.io')) {
      fail(route, 'missing ClientVerse footer attribution');
    }
  }

  console.log(`Pages crawled: ${pages.length}`);
  console.log(`Redirects observed: ${notes.length}`);
  for (const note of notes) console.log(`  ${note}`);

  if (failures.length > 0) {
    console.error(`\n${failures.length} crawl failure(s):`);
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    process.exit(1);
  }

  console.log('\n✓ route crawl, internal links, canonicals, structured data, and attribution all pass');
}

await main();
