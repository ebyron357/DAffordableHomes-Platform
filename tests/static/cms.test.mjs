import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';

/**
 * CMS architecture regression tests.
 *
 * The load-bearing property is block parity: every editorial block the schema
 * offers must have a renderer, and every renderer must correspond to a schema
 * type. A mismatch means an editor can publish a block that silently renders
 * nothing, which looks fine in the Studio and is blank in production.
 */

const read = (file) => readFileSync(file, 'utf8');

/** Every block the mission requires, as schema type -> renderer case. */
const REQUIRED_BLOCKS = [
  'richTextBlock',
  'quickAnswer',
  'heroImage',
  'inlineImage',
  'imageGallery',
  'videoEmbed',
  'quote',
  'callout',
  'complianceDisclaimer',
  'checklist',
  'comparisonTable',
  'faqBlock',
  'officialSourcesBlock',
  'calculatorCta',
  'programCta',
  'areaGuideCta',
  'consultationCta',
  'relatedArticlesBlock'
];

test('the Sanity implementation is present and wired', () => {
  for (const file of [
    'apps/web/sanity.config.ts',
    'apps/web/sanity.cli.ts',
    'apps/web/cms/env.ts',
    'apps/web/cms/client.ts',
    'apps/web/cms/structure.ts',
    'apps/web/cms/schema/index.ts',
    'apps/web/cms/schema/documents/article.ts',
    'apps/web/cms/schema/documents/author.ts',
    'apps/web/cms/schema/documents/category.ts',
    'apps/web/cms/schema/objects/blocks.ts',
    'apps/web/cms/schema/objects/rich-text.ts',
    'apps/web/cms/schema/objects/shared.ts',
    'apps/web/lib/blog/queries.ts',
    'apps/web/lib/blog/source.ts',
    'apps/web/lib/blog/types.ts',
    'apps/web/app/studio/[[...tool]]/page.tsx',
    'apps/web/app/api/draft-mode/enable/route.ts',
    'apps/web/app/api/draft-mode/disable/route.ts',
    'apps/web/app/api/revalidate/route.ts',
    'scripts/sanity/export-seed.mjs',
    'docs/13-cms/SANITY_SETUP.md'
  ]) {
    assert.equal(existsSync(file), true, `${file} should exist`);
  }
});

test('every required block has both a schema type and a renderer', () => {
  const schema = read('apps/web/cms/schema/objects/blocks.ts');
  const renderer = read('apps/web/components/blog/blocks.tsx');
  const types = read('apps/web/lib/blog/types.ts');

  for (const block of REQUIRED_BLOCKS) {
    assert.match(schema, new RegExp(`name: "${block}"`), `schema is missing ${block}`);
    assert.match(renderer, new RegExp(`case "${block}":`), `renderer is missing ${block}`);
    assert.match(types, new RegExp(`_type: "${block}"`), `types are missing ${block}`);
  }
});

test('every block registered in the schema index is renderable', () => {
  const schema = read('apps/web/cms/schema/objects/blocks.ts');
  const renderer = read('apps/web/components/blog/blocks.tsx');

  const registered = [...schema.matchAll(/^export const (\w+) = defineType\(\{/gm)].map(
    (match) => match[1]
  );

  for (const block of registered) {
    assert.match(
      renderer,
      new RegExp(`case "${block}":`),
      `${block} is offered to editors but has no renderer`
    );
  }
});

test('headings and lists are Portable Text styles, not bespoke block types', () => {
  const richText = read('apps/web/cms/schema/objects/rich-text.ts');
  const renderer = read('apps/web/components/blog/portable-text.tsx');

  for (const style of ['h2', 'h3', 'h4']) {
    assert.match(richText, new RegExp(`value: "${style}"`));
    assert.match(renderer, new RegExp(`${style}: \\(\\{ children`));
  }
  for (const list of ['bullet', 'number']) {
    assert.match(richText, new RegExp(`value: "${list}"`));
    assert.match(renderer, new RegExp(`${list}: \\(\\{ children \\}\\)`));
  }
});

test('the article schema requires the fields the release gate depends on', () => {
  const article = read('apps/web/cms/schema/documents/article.ts');
  const shared = read('apps/web/cms/schema/objects/shared.ts');

  for (const field of [
    'title',
    'slug',
    'excerpt',
    'featuredImage',
    'author',
    'category',
    'publishedAt',
    'readingTime',
    'seoDescription',
    'body',
    'publicationState'
  ]) {
    assert.match(article, new RegExp(`name: "${field}"`), `missing field ${field}`);
  }

  // Required-ness, not just presence.
  for (const required of [
    'name: "title"',
    'name: "slug"',
    'name: "excerpt"',
    'name: "featuredImage"',
    'name: "author"',
    'name: "publishedAt"',
    'name: "seoDescription"'
  ]) {
    const index = article.indexOf(required);
    assert.ok(index > 0, `${required} should exist`);
    const block = article.slice(index, index + 700);
    assert.match(block, /rule\.required\(\)/, `${required} should be required`);
  }

  // Alt text must be meaningful, not merely non-empty.
  assert.match(shared, /name: "alt"/);
  assert.match(shared, /rule\s*\n?\s*\.required\(\)/);
  assert.match(shared, /must describe the image, not repeat the filename/);
});

test('published queries exclude drafts and previews require a server token', () => {
  const queries = read('apps/web/lib/blog/queries.ts');
  const source = read('apps/web/lib/blog/source.ts');
  const client = read('apps/web/cms/client.ts');
  const env = read('apps/web/cms/env.ts');

  assert.match(queries, /publicationState == "published"/);
  assert.match(source, /isDraftRequest/);
  assert.match(source, /draftMode\(\)/);
  assert.match(client, /perspective: "published"/);
  assert.match(client, /perspective: "drafts"/);
  assert.match(client, /token: SANITY_API_READ_TOKEN/);
  assert.match(env, /isPreviewConfigured/);

  // The preview client is server-only.
  assert.match(client, /^import "server-only"/m);
  assert.match(source, /^import "server-only"/m);
});

test('dereferenced related articles cannot leak unpublished documents', () => {
  const queries = read('apps/web/lib/blog/queries.ts');

  // Every `relatedArticles[]->` dereference must filter on publication state,
  // or a draft's title, excerpt and image surface on a live article.
  const dereferences = queries.match(/relatedArticles\[\]->/g) ?? [];
  assert.ok(dereferences.length >= 2, 'expected related-article dereferences');
  for (const match of queries.matchAll(/relatedArticles\[\]->[\s\S]{0,160}/g)) {
    assert.match(
      match[0],
      /publicationState == "published"/,
      'related-article dereference must filter on publicationState'
    );
  }
});

test('optional CMS list fields are never projected as null', () => {
  const queries = read('apps/web/lib/blog/queries.ts');

  // The page and structured-data builders call .length / .map on these
  // directly, so a schema-valid article that omits them must not 500.
  for (const field of ['faqs', 'sources', 'notice', 'relatedLinks', 'programs', 'areas']) {
    assert.match(
      queries,
      new RegExp(`"${field}": coalesce\\(`),
      `${field} must be coalesced to an empty array`
    );
  }
  assert.match(queries, /"relatedArticleSlugs": coalesce\(/);
  assert.match(queries, /"body": coalesce\(/);
});

test('an empty FAQ or sources block falls back to the article-level list', () => {
  const queries = read('apps/web/lib/blog/queries.ts');

  // The schema tells editors to leave the block's list empty to reuse the
  // article-level entries. `coalesce` treats [] as present, so the projection
  // has to test the count instead.
  assert.match(queries, /"faqs": select\(count\(faqs\) > 0 => faqs, coalesce\(\^\.faqs, \[\]\)\)/);
  assert.match(
    queries,
    /"sources": select\(count\(sources\) > 0 => sources, coalesce\(\^\.sources, \[\]\)\)/
  );
});

test('a Content Lake outage degrades to the seed instead of failing the page', () => {
  const source = read('apps/web/lib/blog/source.ts');

  assert.match(source, /withSeedFallback/);
  assert.match(source, /console\.error/);
  for (const caller of ['"listArticles"', '"listArticleSlugs"', '`getArticle(']) {
    assert.ok(
      source.includes(caller),
      `${caller} should be passed to withSeedFallback as its label`
    );
  }
  // A draft read must not fall back to published seed copy.
  assert.match(source, /must never fall back to published seed content/);
});

test('the revalidate webhook verifies its signature before revalidating', () => {
  const route = read('apps/web/app/api/revalidate/route.ts');

  assert.match(route, /parseBody/);
  assert.match(route, /SANITY_REVALIDATE_SECRET/);
  assert.match(route, /if \(!isValidSignature\)/);
  assert.match(route, /revalidateTag\(ARTICLE_CACHE_TAG/);

  // The 401 must be reached before any revalidation happens.
  assert.ok(
    route.indexOf('Invalid signature') < route.indexOf('revalidateTag('),
    'signature verification must precede revalidation'
  );
});

test('draft mode requires an authenticated Studio preview session', () => {
  const enable = read('apps/web/app/api/draft-mode/enable/route.ts');
  const disable = read('apps/web/app/api/draft-mode/disable/route.ts');
  const config = read('apps/web/sanity.config.ts');

  // `defineEnableDraftMode` validates a single-use secret minted in the Content
  // Lake by the Studio's Presentation tool. An existence check on the slug is
  // NOT authentication: any visitor who knows a published slug would satisfy it
  // and receive a draft-mode cookie.
  assert.match(enable, /defineEnableDraftMode/);
  assert.doesNotMatch(enable, /searchParams\.get\("slug"\)/);
  assert.doesNotMatch(enable, /draft\.enable\(\)/);

  assert.match(config, /presentationTool/);
  assert.match(config, /enable: "\/api\/draft-mode\/enable"/);

  // Presentation must know where an article renders, or the preview link
  // exists but opens "/" instead of the article.
  assert.match(config, /defineLocations/);
  assert.match(config, /`\/blog\/\$\{doc\.slug\}`/);

  // Open-redirect guard on exit. Behaviour is covered by
  // tests/static/safe-path.test.mjs.
  assert.match(disable, /toSafeInternalPath/);
});

test('no Sanity credentials or project identifiers are committed', () => {
  const env = read('apps/web/cms/env.ts');
  const config = read('apps/web/sanity.config.ts');
  const cli = read('apps/web/sanity.cli.ts');

  for (const source of [env, config, cli]) {
    assert.doesNotMatch(source, /sk[A-Za-z0-9]{40,}/, 'no Sanity tokens');
  }
  assert.match(env, /process\.env\.NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(config, /projectId: SANITY_PROJECT_ID/);
  assert.equal(existsSync('apps/web/.env'), false);
  assert.equal(existsSync('.env'), false);
});

test('the migration seed is reproducible and covers every launch article', () => {
  const files = readdirSync('apps/web/lib/blog/seed/articles');
  assert.equal(files.length, 3);

  const builders = read('apps/web/lib/blog/seed/builders.ts');
  const portableText = read('apps/web/lib/blog/seed/portable-text.ts');

  // Deterministic keys keep re-imports idempotent.
  assert.match(builders, /resetKeys/);
  assert.match(portableText, /stableKey/);
  assert.doesNotMatch(portableText, /Math\.random|Date\.now/);
  assert.doesNotMatch(builders, /Math\.random|Date\.now/);
});

test('the Studio is not indexable', () => {
  const robots = read('apps/web/app/robots.ts');
  const config = read('apps/web/next.config.mjs');
  const studio = read('apps/web/app/studio/[[...tool]]/page.tsx');

  assert.match(robots, /"\/studio"/);
  assert.match(config, /X-Robots-Tag/);
  assert.match(studio, /robots: \{ index: false, follow: false \}/);
});
