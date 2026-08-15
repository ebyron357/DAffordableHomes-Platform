import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';

const PRESERVED_SLUGS = [
  'naca-homebuying-dallas-fort-worth',
  'homes-for-heroes-north-texas',
  'how-to-buy-home-garland-tx'
];

const articles = Object.fromEntries(
  PRESERVED_SLUGS.map((slug) => [slug, JSON.parse(readFileSync(`apps/web/content/articles/${slug}.json`, 'utf8'))])
);

function collectText(value, acc = []) {
  if (typeof value === 'string') acc.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => collectText(entry, acc));
  else if (value && typeof value === 'object') Object.values(value).forEach((entry) => collectText(entry, acc));
  return acc;
}

test('the blog is served by one CMS-driven route, not per-article route files', () => {
  assert.equal(existsSync('apps/web/app/blog/[slug]/page.tsx'), true);
  assert.equal(existsSync('apps/web/app/blog/page.tsx'), true);
  assert.equal(existsSync('apps/web/components/articles/article-feature.tsx'), false);

  const blogRouteEntries = readdirSync('apps/web/app/blog', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  assert.deepEqual(blogRouteEntries, ['[slug]'], 'only the dynamic article route may exist under app/blog');
});

test('all three published article URLs are preserved', () => {
  for (const slug of PRESERVED_SLUGS) {
    const article = articles[slug];
    assert.equal(article.slug, slug, `${slug} must keep its published URL`);
    assert.equal(article.status, 'published');
    assert.ok(article.body.length > 0, `${slug} must have body blocks`);
  }
});

test('migrated articles keep authorship, dates, reading time, metadata, and excerpts', () => {
  const expected = {
    'naca-homebuying-dallas-fort-worth': { readingTime: '10 minute read' },
    'homes-for-heroes-north-texas': { readingTime: '9 minute read' },
    'how-to-buy-home-garland-tx': { readingTime: '12 minute read' }
  };

  for (const slug of PRESERVED_SLUGS) {
    const article = articles[slug];
    assert.equal(article.author.name, 'Debra Allen');
    assert.equal(article.author.credential, 'REALTOR®');
    assert.equal(article.publishedAt, '2026-08-05');
    assert.equal(article.reviewedAt, '2026-08-05');
    assert.equal(article.readingTime, expected[slug].readingTime);
    assert.ok(article.excerpt.length >= 60, `${slug} needs a meaningful excerpt`);
    assert.ok(article.seoDescription.length >= 70, `${slug} needs an SEO description`);
    assert.ok(article.category?.title, `${slug} needs a category`);
  }
});

test('migrated articles keep their FAQs, official sources, and compliance disclaimers', () => {
  for (const slug of PRESERVED_SLUGS) {
    const article = articles[slug];
    assert.equal(article.faqs.length, 5, `${slug} must keep all five FAQs`);
    assert.ok(article.officialSources.length >= 2, `${slug} must keep its official sources`);
    assert.ok(article.disclaimer?.length, `${slug} must keep its compliance disclaimer`);
    for (const source of article.officialSources) {
      assert.match(source.href, /^https:\/\//, `${slug} sources must be absolute https URLs`);
    }
  }
});

test('published articles carry meaningful alt text or the editorial type-only treatment', () => {
  for (const slug of PRESERVED_SLUGS) {
    const article = articles[slug];
    if (article.featuredImageLayout === 'editorial') {
      assert.equal(article.featuredImage, null, `${slug} declares the type-only hero`);
      continue;
    }
    assert.ok(article.featuredImage, `${slug} needs a featured image`);
    assert.ok(
      article.featuredImage.alt.length >= 12,
      `${slug} featured image needs meaningful alternative text`
    );
    assert.ok(
      article.featuredImage.src || article.featuredImage.url,
      `${slug} featured image needs a resolvable source`
    );
  }
});

test('articles route readers to the program, local, calculator, and consultation architecture', () => {
  const naca = collectText(articles['naca-homebuying-dallas-fort-worth']).join(' ');
  const heroes = collectText(articles['homes-for-heroes-north-texas']).join(' ');
  const garland = collectText(articles['how-to-buy-home-garland-tx']).join(' ');
  const articleRoute = readFileSync('apps/web/app/blog/[slug]/page.tsx', 'utf8');

  assert.match(naca, /\/programs\/naca/);
  assert.match(naca, /\/areas\/garland/);
  assert.match(heroes, /\/programs\/homes-for-heroes/);
  assert.match(heroes, /\/calculators\/closing-costs/);
  assert.match(garland, /\/areas\/garland/);
  assert.match(garland, /\/calculators\/affordability/);
  assert.match(articleRoute, /href="\/consultation"/);
});

test('internal links in migrated content point at live routes, not redirect aliases', () => {
  for (const slug of PRESERVED_SLUGS) {
    const text = collectText(articles[slug]).join(' ');
    assert.doesNotMatch(text, /\/resources\/calculators/, `${slug} must link to canonical calculator routes`);
  }
});

test('program boundaries remain explicit and unsupported claims remain absent', () => {
  const naca = collectText(articles['naca-homebuying-dallas-fort-worth']).join(' ');
  const heroes = collectText(articles['homes-for-heroes-north-texas']).join(' ');
  const all = `${naca}\n${heroes}\n${collectText(articles['how-to-buy-home-garland-tx']).join(' ')}`;

  assert.match(naca, /independent from NACA/i);
  assert.match(naca, /NACA controls/i);
  assert.match(heroes, /third-party program/i);
  assert.match(heroes, /does not guarantee/i);
  assert.doesNotMatch(all, /guaranteed approval|guaranteed savings|number one realtor|best realtor/i);
});

test('article routes generate structured data, canonicals, and breadcrumbs from CMS data', () => {
  const route = readFileSync('apps/web/app/blog/[slug]/page.tsx', 'utf8');

  assert.match(route, /"@type": "Article"/);
  assert.match(route, /"@type": "BreadcrumbList"/);
  assert.match(route, /"@type": "FAQPage"/);
  assert.match(route, /alternates: \{ canonical: `\/blog\/\$\{article\.slug\}` \}/);
  assert.match(route, /aria-label="Breadcrumb"/);
  assert.match(route, /notFound\(\)/, 'unknown slugs must return a real 404');
});

test('sitemap generates article entries from published CMS content', () => {
  const sitemap = readFileSync('apps/web/app/sitemap.ts', 'utf8');
  assert.match(sitemap, /getPublishedArticleSlugs/);
  assert.match(sitemap, /\/blog\/\$\{article\.slug\}/);
  assert.doesNotMatch(
    sitemap,
    /"\/blog\/naca-homebuying-dallas-fort-worth"/,
    'article URLs must come from the CMS, not a hardcoded list'
  );
});

test('renderers contain no migrated article copy', () => {
  const renderers = [
    'apps/web/components/blog/article-blocks.tsx',
    'apps/web/components/blog/article-modules.tsx',
    'apps/web/components/blog/portable-text.tsx',
    'apps/web/app/blog/[slug]/page.tsx'
  ];

  const distinctiveCopy = [
    'Homebuyer Workshop is open to everyone',
    'A payment that leaves no room for an air-conditioning repair',
    'Housing Choice Voucher Home Ownership Program',
    'Debra helps North Texas community heroes'
  ];

  for (const file of renderers) {
    const source = readFileSync(file, 'utf8');
    for (const fragment of distinctiveCopy) {
      assert.equal(
        source.includes(fragment),
        false,
        `${file} must not hardcode migrated article copy: ${fragment}`
      );
    }
  }
});
