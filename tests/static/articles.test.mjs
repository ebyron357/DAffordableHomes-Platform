import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';

/**
 * Editorial architecture regression tests.
 *
 * The three launch articles used to be three hardcoded TSX routes. They are now
 * CMS documents rendered by a single `/blog/[slug]` route. These tests assert
 * the properties that must survive that change: the URLs, the migrated content,
 * the structured data, and the absence of a return to per-article route files.
 */

const PRESERVED_SLUGS = [
  'naca-homebuying-dallas-fort-worth',
  'homes-for-heroes-north-texas',
  'how-to-buy-home-garland-tx'
];

const read = (file) => readFileSync(file, 'utf8');

test('the blog is served by one CMS-driven route, not per-article route files', () => {
  assert.equal(existsSync('apps/web/app/blog/[slug]/page.tsx'), true);
  assert.equal(existsSync('apps/web/app/blog/page.tsx'), true);

  const blogDirectories = readdirSync('apps/web/app/blog', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  assert.deepEqual(blogDirectories, ['[slug]'], 'only the dynamic segment may exist under app/blog');

  // The legacy renderer that hardcoded article layout is gone.
  assert.equal(existsSync('apps/web/components/articles/article-feature.tsx'), false);
});

test('all three article URLs are preserved by the migration seed', () => {
  for (const slug of PRESERVED_SLUGS) {
    const file = `apps/web/lib/blog/seed/articles/${slug}.ts`;
    assert.equal(existsSync(file), true, `${file} should exist`);
    assert.match(read(file), new RegExp(`slug: "${slug}"`));
  }

  const index = read('apps/web/lib/blog/seed/index.ts');
  for (const slug of PRESERVED_SLUGS) {
    assert.match(index, new RegExp(slug.replace(/-/g, '-')));
  }
});

test('migrated articles keep their authorship, dates, reading time and metadata', () => {
  const expected = {
    'naca-homebuying-dallas-fort-worth': '10 minute read',
    'homes-for-heroes-north-texas': '9 minute read',
    'how-to-buy-home-garland-tx': '12 minute read'
  };

  for (const [slug, readingTime] of Object.entries(expected)) {
    const source = read(`apps/web/lib/blog/seed/articles/${slug}.ts`);
    assert.match(source, new RegExp(`readingTime: "${readingTime}"`), slug);
    assert.match(source, /publishedAt: "2026-08-05"/, slug);
    assert.match(source, /reviewedAt: "2026-08-05"/, slug);
    assert.match(source, /name: "Debra Allen"/, slug);
    assert.match(source, /role: "REALTOR®"/, slug);
    assert.match(source, /seoDescription:/, slug);
    assert.match(source, /featuredImage: \{/, slug);
  }
});

test('migrated articles retain FAQs, official sources and compliance notices', () => {
  const naca = read('apps/web/lib/blog/seed/articles/naca-homebuying-dallas-fort-worth.ts');
  const heroes = read('apps/web/lib/blog/seed/articles/homes-for-heroes-north-texas.ts');
  const garland = read('apps/web/lib/blog/seed/articles/how-to-buy-home-garland-tx.ts');

  for (const [name, source] of Object.entries({ naca, heroes, garland })) {
    assert.match(source, /const articleFaqs = faqs\(\[/, name);
    assert.match(source, /const articleSources = sources\(\[/, name);
    assert.match(source, /notice: richText\(/, name);
    assert.match(source, /complianceDisclaimer\(/, name);
  }

  assert.match(naca, /https:\/\/www\.naca\.com\/10steps\//);
  assert.match(naca, /independent from NACA/i);
  assert.match(naca, /NACA controls/i);
  assert.match(heroes, /https:\/\/www\.homesforheroes\.com\/heroes\//);
  assert.match(heroes, /third-party program/i);
  assert.match(heroes, /does not guarantee/i);
  assert.match(garland, /garlandtx\.gov\/478\/Home-Ownership-Program/);
  assert.match(garland, /welcomehome\.tdhca\.texas\.gov/);
});

test('articles route readers into programs, areas, calculators and consultation', () => {
  const naca = read('apps/web/lib/blog/seed/articles/naca-homebuying-dallas-fort-worth.ts');
  const heroes = read('apps/web/lib/blog/seed/articles/homes-for-heroes-north-texas.ts');
  const garland = read('apps/web/lib/blog/seed/articles/how-to-buy-home-garland-tx.ts');
  const blocks = read('apps/web/components/blog/blocks.tsx');

  assert.match(naca, /\/programs\/naca/);
  assert.match(naca, /\/areas\/garland/);
  assert.match(heroes, /\/programs\/homes-for-heroes/);
  assert.match(heroes, /\/calculators\/closing-costs/);
  assert.match(garland, /\/areas\/garland/);
  assert.match(garland, /\/calculators\/affordability/);

  // The consultation CTA destination is fixed in the renderer, not editable
  // per article, so it cannot drift to a dead path.
  assert.match(blocks, /href="\/consultation"/);
});

test('unsupported promotional claims remain absent from migrated copy', () => {
  const all = PRESERVED_SLUGS.map((slug) =>
    read(`apps/web/lib/blog/seed/articles/${slug}.ts`)
  ).join('\n');

  assert.doesNotMatch(
    all,
    /guaranteed approval|guaranteed savings|number one realtor|best realtor|we guarantee/i
  );
});

test('structured data is generated from CMS fields for every article', () => {
  const structuredData = read('apps/web/lib/blog/structured-data.ts');
  const route = read('apps/web/app/blog/[slug]/page.tsx');

  assert.match(structuredData, /"@type": "Article"/);
  assert.match(structuredData, /"@type": "BreadcrumbList"/);
  assert.match(structuredData, /"@type": "FAQPage"/);
  assert.match(structuredData, /datePublished: article\.publishedAt/);
  assert.match(structuredData, /dateModified: article\.reviewedAt/);

  assert.match(route, /articleJsonLd\(article\)/);
  assert.match(route, /breadcrumbJsonLd\(article\)/);
  assert.match(route, /faqJsonLd\(article\)/);
  assert.match(route, /alternates: \{ canonical \}/);
});

test('an unknown article slug cannot resolve to a soft 404', () => {
  const route = read('apps/web/app/blog/[slug]/page.tsx');

  // `dynamicParams = false` is what makes an unknown slug a real HTTP 404
  // instead of an ISR-cached not-found page served with 200.
  assert.match(route, /export const dynamicParams = false/);
  assert.match(route, /notFound\(\)/);
});

test('the sitemap is generated from the CMS, not a hardcoded article list', () => {
  const sitemap = read('apps/web/app/sitemap.ts');

  assert.match(sitemap, /listArticleSlugs/);
  for (const slug of PRESERVED_SLUGS) {
    assert.doesNotMatch(
      sitemap,
      new RegExp(slug),
      'article URLs must come from the CMS, not a literal list'
    );
  }
});
