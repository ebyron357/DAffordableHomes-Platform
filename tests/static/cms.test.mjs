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

test('draft mode cannot be enabled for an arbitrary path', () => {
  const enable = read('apps/web/app/api/draft-mode/enable/route.ts');
  const disable = read('apps/web/app/api/draft-mode/disable/route.ts');

  assert.match(enable, /\/\^\[a-z0-9\]\[a-z0-9-\]\{0,95\}\$\//);
  assert.match(enable, /No article matches that slug/);
  assert.ok(
    enable.indexOf('const exists') < enable.indexOf('draft.enable()'),
    'the slug must be verified before draft mode is enabled'
  );
  // Open-redirect guard on exit.
  assert.match(disable, /\^\\\/\(\?!\\\/\)/);
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
