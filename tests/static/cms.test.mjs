import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const blocksSchema = readFileSync('apps/web/sanity/schema/blocks.ts', 'utf8');
const documentsSchema = readFileSync('apps/web/sanity/schema/documents.ts', 'utf8');
const blockRenderer = readFileSync('apps/web/components/blog/article-blocks.tsx', 'utf8');

/**
 * Every editorial block required by the publishing standard, with the Sanity
 * schema type that defines it and the renderer branch that draws it.
 */
const REQUIRED_BLOCKS = [
  'richTextBlock',
  'quickAnswerBlock',
  'heroImageBlock',
  'inlineImageBlock',
  'imageGalleryBlock',
  'videoEmbedBlock',
  'quoteBlock',
  'calloutBlock',
  'complianceDisclaimerBlock',
  'checklistBlock',
  'comparisonTableBlock',
  'faqBlock',
  'officialSourcesBlock',
  'calculatorCtaBlock',
  'programCtaBlock',
  'areaGuideCtaBlock',
  'consultationCtaBlock',
  'relatedArticlesBlock'
];

test('Sanity CMS implementation files exist', () => {
  for (const file of [
    'apps/web/sanity.config.ts',
    'apps/web/sanity/env.ts',
    'apps/web/sanity/schema/index.ts',
    'apps/web/sanity/schema/blocks.ts',
    'apps/web/sanity/schema/documents.ts',
    'apps/web/sanity/lib/client.ts',
    'apps/web/sanity/lib/queries.ts',
    'apps/web/lib/blog/source.ts',
    'apps/web/lib/blog/types.ts',
    'apps/web/app/studio/[[...tool]]/page.tsx',
    'apps/web/app/api/preview/enable/route.ts',
    'apps/web/app/api/preview/disable/route.ts',
    'apps/web/app/api/revalidate/route.ts',
    'scripts/content/build-articles.mjs',
    'scripts/sanity/import-articles.mjs',
    'content/sanity/articles.ndjson'
  ]) {
    assert.equal(existsSync(file), true, `${file} should exist`);
  }
});

test('every required editorial block has a schema type and a renderer', () => {
  for (const block of REQUIRED_BLOCKS) {
    assert.match(blocksSchema, new RegExp(`name: "${block}"`), `${block} needs a Sanity schema type`);
    assert.match(blockRenderer, new RegExp(`case "${block}":`), `${block} needs a frontend renderer`);
  }
});

test('the article schema enforces the required publication fields', () => {
  for (const field of [
    'title',
    'slug',
    'excerpt',
    'author',
    'category',
    'readingTime',
    'featuredImage',
    'publishedAt',
    'reviewedAt',
    'seoTitle',
    'seoDescription',
    'socialImage',
    'body',
    'faqs',
    'officialSources',
    'relatedArticles',
    'programs',
    'areas',
    'status'
  ]) {
    assert.match(documentsSchema, new RegExp(`name: "${field}"`), `article schema needs a "${field}" field`);
  }

  assert.match(documentsSchema, /A published article needs a featured image/);
  assert.match(documentsSchema, /A published featured image needs meaningful alternative text/);
  assert.match(documentsSchema, /An article needs at least one body block/);
  assert.match(blocksSchema, /Meaningful alternative text is required for every published image/);
});

test('Sanity configuration is environment-driven and commits no credentials', () => {
  const env = readFileSync('apps/web/sanity/env.ts', 'utf8');
  const config = readFileSync('apps/web/sanity.config.ts', 'utf8');

  assert.match(env, /process\.env\.NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(env, /process\.env\.NEXT_PUBLIC_SANITY_DATASET/);
  assert.match(env, /process\.env\.SANITY_API_READ_TOKEN/);
  assert.match(env, /process\.env\.SANITY_REVALIDATE_SECRET/);
  assert.match(config, /projectId,/);

  for (const source of [env, config, readFileSync('apps/web/sanity/lib/client.ts', 'utf8')]) {
    assert.doesNotMatch(source, /sk[A-Za-z0-9]{20,}/, 'no Sanity token may be committed');
  }
});

test('published reads exclude drafts and preview reads require a token', () => {
  const queries = readFileSync('apps/web/sanity/lib/queries.ts', 'utf8');
  const client = readFileSync('apps/web/sanity/lib/client.ts', 'utf8');
  const source = readFileSync('apps/web/lib/blog/source.ts', 'utf8');

  assert.match(queries, /status == "published"/);
  assert.match(client, /perspective: "published"/);
  assert.match(client, /perspective: "drafts"/);
  assert.match(client, /if \(!isSanityConfigured\(\) \|\| !readToken\) return null/);
  assert.match(source, /draftMode/);
});

test('the Studio previews unpublished work on the draft-only preview route', () => {
  const config = readFileSync('apps/web/sanity.config.ts', 'utf8');
  assert.match(config, /presentationTool/);
  assert.match(config, /enable: "\/api\/preview\/enable"/);
  assert.match(config, /disable: "\/api\/preview\/disable"/);
  assert.match(config, /href: `\/preview\/\$\{doc\.slug\}`/);
});

test('the publish webhook fails closed without a configured secret', () => {
  const route = readFileSync('apps/web/app/api/revalidate/route.ts', 'utf8');
  assert.match(route, /if \(!revalidateSecret\)/);
  assert.match(route, /isValidSignature/);
  assert.match(route, /revalidateTag\("article", "max"\)/);
});

test('generated article artefacts are reproducible and up to date', () => {
  const output = execFileSync('node', ['scripts/content/build-articles.mjs', '--check'], { encoding: 'utf8' });
  assert.match(output, /up to date/);
});

test('the Sanity import script is idempotent and refuses to run without credentials', () => {
  const script = readFileSync('scripts/sanity/import-articles.mjs', 'utf8');
  assert.match(script, /createOrReplace/);
  assert.match(script, /SANITY_API_WRITE_TOKEN/);
  assert.match(script, /BLOCKED/);
  assert.doesNotMatch(script, /sk[A-Za-z0-9]{20,}/);
});
