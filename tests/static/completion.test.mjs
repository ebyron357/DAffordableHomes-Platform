import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

test('completion route architecture is present', () => {
  for (const file of [
    'apps/web/app/programs/[slug]/page.tsx',
    'apps/web/app/areas/[slug]/page.tsx',
    'apps/web/app/resources/[slug]/page.tsx',
    'apps/web/app/texas-brokerage-information/page.tsx',
    'apps/web/app/global-error.tsx',
    'apps/web/app/manifest.ts',
  ]) assert.equal(existsSync(file), true, `${file} should exist`);
});

test('all requested programs, cities, and buyer resources are represented', () => {
  const programs = readFileSync('apps/web/lib/programs.ts', 'utf8');
  const areas = readFileSync('apps/web/lib/areas.ts', 'utf8');
  const resources = readFileSync('apps/web/lib/buyer-resources.ts', 'utf8');
  for (const slug of ['fha', 'va', 'usda', 'conventional', 'naca', 'homes-for-heroes']) assert.match(programs, new RegExp(`slug: "${slug}"`));
  for (const slug of ['dallas', 'garland', 'mesquite', 'richardson', 'plano', 'sachse', 'rowlett', 'forney', 'rockwall', 'wylie']) assert.match(areas, new RegExp(`slug: "${slug}"`));
  for (const slug of ['first-time-home-buyers', 'credit-improvement', 'down-payment-assistance', 'homeownership-readiness', 'closing-process']) assert.match(resources, new RegExp(`slug: "${slug}"`));
});

test('SEO and analytics foundations are configured without credentials', () => {
  const layout = readFileSync('apps/web/app/layout.tsx', 'utf8');
  const sitemap = readFileSync('apps/web/app/sitemap.ts', 'utf8');
  assert.match(layout, /LocalBusiness/);
  assert.match(layout, /RealEstateAgent/);
  assert.match(layout, /NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION/);
  assert.match(sitemap, /BUYER_RESOURCE_LIST/);
});
