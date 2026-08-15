import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

/**
 * ClientVerse regression coverage.
 *
 * These assertions exist specifically to keep the site-wide vendor attribution
 * and the audit integration honest. They test ClientVerse itself — the
 * attribution text, its destination, its presence in the shared footer, and the
 * audit workflow's refusal to report success when it cannot actually run.
 */

const site = readFileSync('apps/web/lib/site.ts', 'utf8');
const footer = readFileSync('apps/web/components/layout/site-footer.tsx', 'utf8');
const layout = readFileSync('apps/web/app/layout.tsx', 'utf8');

test('ClientVerse attribution text and destination are defined once, canonically', () => {
  assert.match(site, /vendorName: "ClientVerse"/);
  assert.match(site, /vendorUrl: "https:\/\/clientverse\.io"/);
  assert.match(site, /label: "Made by"/);
  assert.match(site, /qualification: "Website design and technology vendor for D'Affordable Homes\."/);
});

test('the ClientVerse attribution renders in the shared site-wide footer', () => {
  assert.match(footer, /ATTRIBUTION/);
  assert.match(footer, /ATTRIBUTION\.label/);
  assert.match(footer, /href=\{ATTRIBUTION\.vendorUrl\}/);
  assert.match(footer, /\{ATTRIBUTION\.vendorName\}/);
  assert.match(footer, /\{ATTRIBUTION\.qualification\}/);
});

test('the shared footer is mounted on every route through the root layout', () => {
  assert.match(layout, /import \{ SiteFooter \}/);
  assert.match(layout, /<SiteFooter \/>/);
});

test('the ClientVerse attribution link is a real, accessible anchor', () => {
  const anchor = footer.slice(footer.indexOf('ATTRIBUTION.vendorUrl'));
  assert.match(anchor, /target="_blank"/);
  assert.match(anchor, /rel="noreferrer"/);
  assert.match(anchor, /underline/);
});

test('promotional ClientVerse links never appear in article content', () => {
  for (const slug of [
    'naca-homebuying-dallas-fort-worth',
    'homes-for-heroes-north-texas',
    'how-to-buy-home-garland-tx'
  ]) {
    const article = readFileSync(`apps/web/content/articles/${slug}.json`, 'utf8');
    assert.doesNotMatch(article, /clientverse/i, `${slug} must not carry promotional vendor links`);
  }
});

test('the ClientVerse audit workflow exists and targets the canonical application', () => {
  assert.equal(existsSync('.github/workflows/clientverse-audit.yml'), true);
  assert.equal(existsSync('qa-config/clientverse-audit.yaml'), true);

  const config = readFileSync('qa-config/clientverse-audit.yaml', 'utf8');
  for (const route of [
    '/blog',
    '/blog/naca-homebuying-dallas-fort-worth',
    '/blog/homes-for-heroes-north-texas',
    '/blog/how-to-buy-home-garland-tx',
    '/programs',
    '/areas/garland',
    '/consultation'
  ]) {
    assert.ok(config.includes(`"${route}"`), `audit config must cover ${route}`);
  }
});

test('the ClientVerse audit reports BLOCKED instead of silently passing when unconfigured', () => {
  const workflow = readFileSync('.github/workflows/clientverse-audit.yml', 'utf8');

  assert.match(workflow, /CLIENTVERSE_ENDPOINT/);
  assert.match(workflow, /CLIENTVERSE_DEPLOYMENT_URL/);
  assert.match(workflow, /CLIENTVERSE_TOKEN/);
  assert.match(workflow, /BLOCKED/);
  assert.match(workflow, /exit 1/);
  assert.doesNotMatch(workflow, /continue-on-error:\s*true/);
  assert.doesNotMatch(workflow, /::notice::.*Skipping the central audit/);
  assert.doesNotMatch(workflow, /sk[A-Za-z0-9]{20,}/);
});
