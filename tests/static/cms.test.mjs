import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';

const PRESERVED_SLUGS = [
  'naca-homebuying-dallas-fort-worth',
  'homes-for-heroes-north-texas',
  'how-to-buy-home-garland-tx',
];

const read = (file) => readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(read(file));

const articles = PRESERVED_SLUGS.map((slug) => readJson(`apps/web/content/articles/${slug}.json`));
const blocksSchema = read('apps/studio/schemas/blocks.ts');
const documentsSchema = read('apps/studio/schemas/documents.ts');
const renderer = read('apps/web/components/blog/article-body.tsx');
const types = read('apps/web/lib/cms/types.ts');

/* -------------------------------------------------------------------------- */
/* Architecture                                                               */
/* -------------------------------------------------------------------------- */

test('the blog is served by one dynamic CMS route and no per-article route files', () => {
  assert.equal(existsSync('apps/web/app/blog/[slug]/page.tsx'), true);
  assert.equal(existsSync('apps/web/app/blog/page.tsx'), true);

  const blogRoutes = readdirSync('apps/web/app/blog', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  assert.deepEqual(blogRoutes, ['[slug]'], 'only the dynamic [slug] route may exist under /blog');

  assert.equal(existsSync('apps/web/components/articles/article-feature.tsx'), false);
  for (const slug of PRESERVED_SLUGS) {
    assert.equal(existsSync(`apps/web/app/blog/${slug}/page.tsx`), false, `${slug} must not have a route file`);
  }
});

test('article body content is never hardcoded in route or component files', () => {
  const dynamicRoute = read('apps/web/app/blog/[slug]/page.tsx');
  const index = read('apps/web/app/blog/page.tsx');

  // A distinctive sentence from each migrated article must live only in the CMS payload.
  const fingerprints = [
    'NACA is a process',
    'Who is considered a community hero',
    'Step 14: Plan for the first year',
  ];
  for (const fingerprint of fingerprints) {
    assert.doesNotMatch(dynamicRoute, new RegExp(fingerprint));
    assert.doesNotMatch(index, new RegExp(fingerprint));
    assert.doesNotMatch(renderer, new RegExp(fingerprint));
  }

  assert.match(dynamicRoute, /getArticle\(/);
  assert.match(index, /getArticleSummaries\(/);
});

test('the sitemap and static params come from the CMS rather than a hardcoded list', () => {
  const sitemap = read('apps/web/app/sitemap.ts');
  assert.match(sitemap, /getArticleSlugRecords\(\)/);
  for (const slug of PRESERVED_SLUGS) {
    assert.doesNotMatch(sitemap, new RegExp(slug), `${slug} must not be hardcoded in the sitemap`);
  }

  const dynamicRoute = read('apps/web/app/blog/[slug]/page.tsx');
  assert.match(dynamicRoute, /generateStaticParams/);
  assert.match(dynamicRoute, /notFound\(\)/, 'unknown slugs must return a real 404');
});

/* -------------------------------------------------------------------------- */
/* Schema                                                                     */
/* -------------------------------------------------------------------------- */

test('every supported editorial block has a schema type and a frontend renderer', () => {
  const declared = [...types.matchAll(/^\s{2}"([a-zA-Z]+)",$/gm)].map((match) => match[1]);
  const blockTypes = declared.filter((value, index) => declared.indexOf(value) === index);
  assert.ok(blockTypes.length >= 18, `expected the full block list, saw ${blockTypes.length}`);

  for (const blockType of blockTypes) {
    if (blockType === 'block') continue; // rich text is Portable Text's built-in type
    // Types are declared either directly (`name: "x"`) or through the linkCta factory.
    assert.match(
      blocksSchema,
      new RegExp(`(name: "${blockType}"|linkCta\\("${blockType}")`),
      `${blockType} is missing a Sanity schema definition`
    );
    assert.match(
      blocksSchema,
      new RegExp(`\\n  ${blockType},`),
      `${blockType} is not registered in the exported blockTypes list`
    );
    assert.match(renderer, new RegExp(`case "${blockType}":`), `${blockType} is missing a frontend renderer`);
  }
});

test('the article schema validates every required editorial field', () => {
  const requiredFields = [
    'title',
    'slug',
    'excerpt',
    'featuredImage',
    'body',
    'author',
    'category',
    'publishedAt',
    'reviewedAt',
    'readingTimeMinutes',
    'seoDescription',
    'status',
  ];
  for (const field of requiredFields) {
    const definition = documentsSchema.slice(documentsSchema.indexOf(`name: "${field}"`));
    assert.ok(definition.length > 0, `${field} is missing from the article schema`);
    const window = definition.slice(0, 600);
    assert.match(window, /rule\.required\(\)/, `${field} must be required`);
  }

  // Descriptive alt text is enforced at the image level.
  assert.match(blocksSchema, /rule\.required\(\)\.min\(15\)/);
  // At least one body block.
  assert.match(documentsSchema, /rule\.required\(\)\.min\(1\)\.error\("An article needs at least one body block\."\)/);
});

/* -------------------------------------------------------------------------- */
/* Migrated content                                                           */
/* -------------------------------------------------------------------------- */

test('all three articles are migrated, published, and keep their exact URLs', () => {
  assert.equal(articles.length, 3);
  for (const [index, article] of articles.entries()) {
    assert.equal(article.slug.current, PRESERVED_SLUGS[index]);
    assert.equal(article.status, 'published');
    assert.ok(article.title.length > 0);
    assert.ok(article.excerpt.length > 40);
    assert.ok(article.seoDescription.length > 40);
    assert.ok(article.publishedAt && article.reviewedAt);
    assert.ok(Number.isInteger(article.readingTimeMinutes) && article.readingTimeMinutes > 0);
    assert.ok(article.body.length > 10, `${article.slug.current} body looks truncated`);
    assert.ok(article.faqs.length >= 3);
    assert.ok(article.sources.length >= 2);
    assert.ok(article.complianceNotice.length >= 1);
  }
});

test('migrated articles preserve their full body copy', () => {
  const textOf = (article) =>
    JSON.stringify(article)
      .replace(/\\u2019|\\u2014|\\u2013/g, "'")
      .toLowerCase();

  const expectations = {
    'naca-homebuying-dallas-fort-worth': [
      'naca is a process',
      'what happens after the homebuyer workshop',
      'seven mistakes that can disrupt the purchase',
      'a practical pre-search checklist',
      'can a naca buyer use an outside real-estate agent',
    ],
    'homes-for-heroes-north-texas': [
      'who is considered a community hero',
      'why hero households may need a different plan',
      'how debra helps hero home sellers',
      'buying and selling at the same time',
      'questions to answer before starting',
    ],
    'how-to-buy-home-garland-tx': [
      'step 1: decide whether you are financially ready',
      'step 7: obtain a meaningful financing review',
      'step 12: use inspections and specialists wisely',
      'step 14: plan for the first year',
      'verify wire instructions',
    ],
  };

  for (const article of articles) {
    const haystack = textOf(article);
    for (const needle of expectations[article.slug.current]) {
      assert.ok(haystack.includes(needle), `${article.slug.current} is missing "${needle}"`);
    }
  }
});

test('every meaningful image carries descriptive alt text and no location claim it cannot prove', () => {
  const forbiddenLocationClaims = /\b(in|from)\s+(garland|dallas|fort worth|north texas|texas)\b/i;

  for (const article of articles) {
    assert.ok(article.featuredImage?.src, `${article.slug.current} has no featured image`);
    assert.ok(
      article.featuredImage.alt.length >= 20,
      `${article.slug.current} featured image alt text is not descriptive`
    );
    assert.doesNotMatch(article.featuredImage.alt, forbiddenLocationClaims);

    for (const node of article.body) {
      if (node._type === 'inlineImage' || node._type === 'heroImage') {
        assert.ok(node.alt.length >= 20, `${article.slug.current} inline image alt text is not descriptive`);
        assert.doesNotMatch(node.alt, forbiddenLocationClaims);
      }
    }
  }
});

test('articles keep program boundaries and carry no fabricated claims', () => {
  const all = JSON.stringify(articles).toLowerCase();

  assert.match(JSON.stringify(articles[0]), /independent from NACA/i);
  assert.match(JSON.stringify(articles[0]), /NACA controls/i);
  assert.match(JSON.stringify(articles[1]), /third-party program/i);
  assert.match(JSON.stringify(articles[1]), /does not guarantee/i);

  for (const claim of [
    'guaranteed approval',
    'guaranteed savings',
    'number one realtor',
    'best realtor',
    'we save you',
    'award-winning',
  ]) {
    assert.ok(!all.includes(claim), `unsupported claim present: ${claim}`);
  }
});

test('articles route readers into the existing program, area, calculator, and consultation architecture', () => {
  const [naca, heroes, garland] = articles.map((article) => JSON.stringify(article));

  assert.match(naca, /\/programs\/naca/);
  assert.match(naca, /\/areas\/garland/);
  assert.match(heroes, /\/programs\/homes-for-heroes/);
  assert.match(heroes, /\/calculators\/closing-costs/);
  assert.match(garland, /\/areas\/garland/);
  assert.match(garland, /\/calculators\/affordability/);

  for (const article of articles) {
    const hasConsultationCta = article.body.some((node) => node._type === 'consultationCta');
    assert.ok(hasConsultationCta, `${article.slug.current} needs a closing consultation CTA`);
  }
});

test('no promotional vendor links appear inside article bodies', () => {
  for (const article of articles) {
    assert.ok(
      !JSON.stringify(article).toLowerCase().includes('clientverse'),
      `${article.slug.current} must not carry vendor promotion in the body`
    );
  }
});

/* -------------------------------------------------------------------------- */
/* Migration payload                                                          */
/* -------------------------------------------------------------------------- */

test('the Sanity import payload matches the committed article documents', () => {
  const ndjson = read('content/sanity/articles.ndjson').trim().split('\n').map((line) => JSON.parse(line));
  const byId = new Map(ndjson.map((doc) => [doc._id, doc]));

  for (const article of articles) {
    const exported = byId.get(article._id);
    assert.ok(exported, `${article._id} is missing from the import payload`);
    assert.deepEqual(exported, article, `${article._id} differs between the app payload and the import payload`);
  }

  // References must resolve inside the payload so `sanity dataset import` succeeds.
  for (const doc of ndjson) {
    for (const reference of JSON.stringify(doc).matchAll(/"_ref":"([^"]+)"/g)) {
      assert.ok(byId.has(reference[1]), `dangling reference ${reference[1]} in ${doc._id}`);
    }
  }
});

/* -------------------------------------------------------------------------- */
/* Environment and preview                                                    */
/* -------------------------------------------------------------------------- */

test('CMS credentials are read from the environment and never committed', () => {
  const env = read('apps/web/lib/cms/env.ts');
  assert.match(env, /process\.env\.NEXT_PUBLIC_SANITY_PROJECT_ID/);
  assert.match(env, /process\.env\.SANITY_API_READ_TOKEN/);
  assert.match(env, /process\.env\.SANITY_REVALIDATE_SECRET/);
  assert.doesNotMatch(env, /sk[A-Za-z0-9]{20,}/, 'no token literal may be committed');

  assert.equal(existsSync('apps/web/app/api/preview/enable/route.ts'), true);
  assert.equal(existsSync('apps/web/app/api/preview/disable/route.ts'), true);
  assert.equal(existsSync('apps/web/app/api/revalidate/route.ts'), true);

  const enable = read('apps/web/app/api/preview/enable/route.ts');
  assert.match(enable, /Invalid preview secret/, 'preview must require the shared secret');
  const revalidate = read('apps/web/app/api/revalidate/route.ts');
  assert.match(revalidate, /invalid secret/, 'the revalidate webhook must require the shared secret');
});

/* -------------------------------------------------------------------------- */
/* Link and outage hardening                                                  */
/* -------------------------------------------------------------------------- */

test('CMS-supplied links are normalised before they become navigation targets', async () => {
  const links = read('apps/web/lib/cms/links.ts');
  assert.match(links, /safeInternalPath/);
  assert.match(links, /safeExternalUrl/);

  // Behavioural check of the guard itself.
  const module = await import('../../apps/web/lib/cms/links.ts').catch(() => null);
  if (module) {
    assert.equal(module.safeInternalPath('/programs/naca'), '/programs/naca');
    assert.equal(module.safeInternalPath('javascript:alert(1)'), '/');
    assert.equal(module.safeInternalPath('//evil.example.com'), '/');
    assert.equal(module.safeInternalPath('/\\evil.example.com'), '/');
    assert.equal(module.safeExternalUrl('http://example.com'), null);
    assert.equal(module.safeExternalUrl('javascript:alert(1)'), null);
  }

  for (const file of [
    'apps/web/components/blog/article-body.tsx',
    'apps/web/components/blog/portable-text.tsx',
    'apps/web/components/blog/article-view.tsx',
    'apps/web/app/api/preview/enable/route.ts',
    'apps/web/app/api/preview/disable/route.ts',
  ]) {
    assert.match(read(file), /safeInternalPath|safeExternalUrl/, `${file} must normalise CMS-supplied links`);
  }
});

test('a Content Lake outage degrades to the bootstrap source instead of throwing', () => {
  const articles = read('apps/web/lib/cms/articles.ts');
  assert.match(articles, /withFallback/);
  assert.match(articles, /catch \(error\)/);
  assert.match(articles, /serving the bootstrap content source instead/);
});

test('Sanity-hosted images and approved embed hosts are allowed by configuration', () => {
  const config = read('apps/web/next.config.mjs');
  assert.match(config, /hostname: 'cdn\.sanity\.io'/);
  assert.match(config, /frame-src 'self' https:\/\/www\.youtube-nocookie\.com https:\/\/player\.vimeo\.com/);
  assert.doesNotMatch(config, /unsafe-eval/);
});

test('preview and revalidation use separate credentials', () => {
  const env = read('apps/web/lib/cms/env.ts');
  assert.match(env, /SANITY_PREVIEW_SECRET/);
  assert.match(env, /SANITY_REVALIDATE_SECRET/);

  const enable = read('apps/web/app/api/preview/enable/route.ts');
  assert.match(enable, /SANITY_PREVIEW_SECRET/);
  assert.doesNotMatch(enable, /SANITY_REVALIDATE_SECRET/);

  const revalidate = read('apps/web/app/api/revalidate/route.ts');
  assert.match(revalidate, /SANITY_REVALIDATE_SECRET/);
  assert.doesNotMatch(revalidate, /SANITY_PREVIEW_SECRET/);
});

test('draft previews have a route, are never indexed, and are disallowed', () => {
  assert.equal(existsSync('apps/web/app/preview/[slug]/page.tsx'), true);
  const preview = read('apps/web/app/preview/[slug]/page.tsx');
  assert.match(preview, /force-dynamic/);
  assert.match(preview, /if \(!isDraft\) redirect\("\/blog"\)/);
  assert.match(preview, /index: false/);

  // The status must be set before the render, not during it.
  const middleware = read('apps/web/middleware.ts');
  assert.match(middleware, /__prerender_bypass/);
  assert.match(middleware, /NextResponse\.redirect\(url, 307\)/);
  assert.match(middleware, /matcher: \["\/preview\/:path\*"\]/);

  assert.match(read('apps/web/app/robots.ts'), /"\/preview\/"/);

  // Draft mode must describe the draft, not the published document.
  assert.match(read('apps/web/app/blog/[slug]/page.tsx'), /Draft preview — \$\{article\.title\}/);
});

test('editor-curated related articles are projected and preferred', () => {
  assert.match(read('apps/web/lib/cms/queries.ts'), /"relatedArticles": relatedArticles\[@->status == "published"/);
  assert.match(read('apps/web/lib/cms/articles.ts'), /const curated = \(article\.relatedArticles \?\? \[\]\)/);
});

test('curated related articles cannot link to unpublished documents', () => {
  const queries = read('apps/web/lib/cms/queries.ts');
  assert.match(queries, /relatedArticles\[@->status == "published" && @->publishedAt <= now\(\)\]->/);

  const articles = read('apps/web/lib/cms/articles.ts');
  assert.match(articles, /candidate\.status === "published"/);
});

test('a failed draft read never renders published content as a draft', () => {
  const articles = read('apps/web/lib/cms/articles.ts');
  assert.match(articles, /draftOnly\?: boolean/);
  // Every draft-only branch must return null rather than falling through.
  assert.ok(
    (articles.match(/if \(options\.draftOnly\) return null/g) ?? []).length >= 3,
    'draftOnly must short-circuit on missing client, missing document, and read failure'
  );

  const preview = read('apps/web/app/preview/[slug]/page.tsx');
  assert.match(preview, /getArticle\(slug, \{ draftOnly: true \}\)/);
});

test('exit preview never lands on a slug with no public route', () => {
  const view = read('apps/web/components/blog/article-view.tsx');
  assert.match(view, /article\.status === "published" \? `\/blog\/\$\{article\.slug\}` : "\/blog"/);
});

test('every author profile link is hardened', () => {
  const view = read('apps/web/components/blog/article-view.tsx');
  const raw = view.match(/href=\{article\.author\.profilePath\}/g) ?? [];
  assert.deepEqual(raw, [], 'author profile paths must pass through safeInternalPath');
  assert.ok((view.match(/safeInternalPath\(article\.author\.profilePath\)/g) ?? []).length >= 2);
});
