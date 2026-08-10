import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const articleFiles = [
  'apps/web/app/blog/page.tsx',
  'apps/web/app/blog/naca-homebuying-dallas-fort-worth/page.tsx',
  'apps/web/app/blog/homes-for-heroes-north-texas/page.tsx',
  'apps/web/app/blog/how-to-buy-home-garland-tx/page.tsx',
  'apps/web/components/articles/article-feature.tsx',
];

test('editorial resource center and all three features exist', () => {
  for (const file of articleFiles) {
    assert.equal(existsSync(file), true, `${file} should exist`);
  }
});

test('features include canonical metadata, visible authorship, reviewed dates, and structured data', () => {
  const layout = readFileSync('apps/web/components/articles/article-feature.tsx', 'utf8');
  const pages = articleFiles.slice(1, 4).map((file) => readFileSync(file, 'utf8')).join('\n');

  assert.match(layout, /"@type": "Article"/);
  assert.match(layout, /"@type": "FAQPage"/);
  assert.match(layout, /"@type": "BreadcrumbList"/);
  assert.match(layout, /SITE\.realtorName/);
  assert.match(layout, /Reviewed/);
  assert.match(pages, /alternates: \{ canonical:/);
  assert.match(pages, /reviewedAt="2026-08-05"/);
});

test('articles route readers to the existing program, local, calculator, and consultation architecture', () => {
  const layout = readFileSync('apps/web/components/articles/article-feature.tsx', 'utf8');
  const naca = readFileSync('apps/web/app/blog/naca-homebuying-dallas-fort-worth/page.tsx', 'utf8');
  const heroes = readFileSync('apps/web/app/blog/homes-for-heroes-north-texas/page.tsx', 'utf8');
  const garland = readFileSync('apps/web/app/blog/how-to-buy-home-garland-tx/page.tsx', 'utf8');

  assert.match(naca, /\/programs\/naca/);
  assert.match(naca, /\/areas\/garland/);
  assert.match(heroes, /\/programs\/homes-for-heroes/);
  assert.match(heroes, /\/resources\/calculators\/closing-costs|\/calculators\/closing-costs/);
  assert.match(garland, /\/areas\/garland/);
  assert.match(garland, /\/resources\/calculators\/affordability|\/calculators\/affordability/);
  assert.match(layout, /href="\/consultation"/);
});

test('program boundaries remain explicit and unsupported claims remain absent', () => {
  const naca = readFileSync('apps/web/app/blog/naca-homebuying-dallas-fort-worth/page.tsx', 'utf8');
  const heroes = readFileSync('apps/web/app/blog/homes-for-heroes-north-texas/page.tsx', 'utf8');
  const all = `${naca}\n${heroes}`;

  assert.match(naca, /independent from NACA/i);
  assert.match(naca, /NACA controls/i);
  assert.match(heroes, /third-party program/i);
  assert.match(heroes, /does not guarantee/i);
  assert.doesNotMatch(all, /guaranteed approval|guaranteed savings|number one realtor|best realtor/i);
});

test('sitemap exposes the complete editorial collection', () => {
  const sitemap = readFileSync('apps/web/app/sitemap.ts', 'utf8');
  assert.match(sitemap, /\/blog\/naca-homebuying-dallas-fort-worth/);
  assert.match(sitemap, /\/blog\/homes-for-heroes-north-texas/);
  assert.match(sitemap, /\/blog\/how-to-buy-home-garland-tx/);
});
