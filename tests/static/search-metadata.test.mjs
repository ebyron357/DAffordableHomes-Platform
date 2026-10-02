import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { register } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

/**
 * Search, social and answer-engine metadata.
 *
 * Each case pins a defect found by the 2026-10-02 SEO/AEO/GEO audit, so the
 * fix cannot quietly regress. The audit crawled the built site; these read the
 * source that produced it.
 */

register('../../scripts/sanity/ts-resolver.mjs', import.meta.url);

const read = (file) => readFileSync(file, 'utf8');
const APP = 'apps/web/app';

/** Every page.tsx under app/, as [route, source]. */
function pages(dir = APP, route = '') {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name.startsWith('(') || name.startsWith('_') || name === 'api' || name === 'studio') continue;
      out.push(...pages(full, `${route}/${name}`));
    } else if (name === 'page.tsx') {
      out.push([route || '/', read(full)]);
    }
  }
  return out;
}

test('the layout does not give every page the same share text or URL', () => {
  const layout = read(`${APP}/layout.tsx`);
  const og = layout.slice(layout.indexOf('openGraph: {'), layout.indexOf('twitter: {'));
  const tw = layout.slice(layout.indexOf('twitter: {'), layout.indexOf('export const viewport'));

  // Next fills an absent og:title / og:description from the route's own title
  // and description. A static value here overrode that on 23 routes.
  assert.doesNotMatch(og, /\btitle:/, 'layout openGraph must not set a title');
  assert.doesNotMatch(og, /\bdescription:/, 'layout openGraph must not set a description');
  assert.doesNotMatch(tw, /\btitle:/, 'layout twitter must not set a title');
  assert.doesNotMatch(tw, /\bdescription:/, 'layout twitter must not set a description');
  // "./" resolves per route, like the canonical; SITE.url pointed og:url at "/".
  assert.match(og, /url: "\.\/"/);
  assert.match(og, /\.\.\.SHARE_IMAGES/);
});

test('the layout sets no site-wide robots directive', () => {
  // `index, follow` here was emitted beside the `noindex` Next adds to 404s.
  const layout = read(`${APP}/layout.tsx`);
  const metadata = layout.slice(layout.indexOf('export const metadata'), layout.indexOf('export const viewport'));
  assert.doesNotMatch(metadata, /^\s*robots:/m);
});

test('every route that declares openGraph also declares its image', () => {
  // A route's `openGraph` replaces the layout's wholesale, images included.
  const offenders = pages()
    .filter(([, source]) => /openGraph:\s*\{/.test(source))
    .filter(([, source]) => !/SHARE_IMAGES|images:/.test(source.slice(source.indexOf('openGraph'))))
    .map(([route]) => route);
  assert.deepEqual(offenders, [], `routes with openGraph but no image: ${offenders.join(', ')}`);
});

test('the share card exists at the size the metadata declares', () => {
  const seo = read('apps/web/lib/seo.ts');
  const file = 'apps/web/public/images/share/daffordable-homes-share.png';
  assert.ok(existsSync(file), `${file} is missing`);
  assert.match(seo, /url: "\/images\/share\/daffordable-homes-share\.png"/);

  // Read the PNG header rather than trusting the declared size.
  const png = readFileSync(file);
  assert.equal(png.readUInt32BE(16), 1200, 'share card width');
  assert.equal(png.readUInt32BE(20), 630, 'share card height');
  assert.ok(png.length < 300 * 1024, 'share card should stay small');
});

test('static page titles fit in a search result once the brand suffix is added', () => {
  const suffix = " — D'Affordable Homes".length;
  const long = [];
  for (const [route, source] of pages()) {
    if (route === '/') continue; // the root page is outside the title template
    const block = source.slice(source.indexOf('export const metadata'));
    const match = block.match(/^\s{2}title: "([^"]+)"/m);
    if (match && match[1].length + suffix > 60) long.push(`${route} (${match[1].length + suffix})`);
  }
  assert.deepEqual(long, [], `titles over 60 characters: ${long.join(', ')}`);
});

test('CMS article titles drop the brand suffix rather than run long', async () => {
  const { fittedTitle } = await import(pathToFileURL('apps/web/lib/seo.ts').href);
  assert.equal(fittedTitle('Short title'), 'Short title');
  assert.deepEqual(
    fittedTitle('How Debra Allen Helps North Texas Heroes Buy or Sell a Home'),
    { absolute: 'How Debra Allen Helps North Texas Heroes Buy or Sell a Home' }
  );
  assert.match(read(`${APP}/blog/[slug]/page.tsx`), /title: fittedTitle\(article\.seoTitle \?\? article\.title\)/);
});

test('a CMS title longer than 60 characters is shortened at a word, not shipped whole', async () => {
  const { fittedTitle, shortenAtWord } = await import(pathToFileURL('apps/web/lib/seo.ts').href);

  // The schema allows 120 characters; this is 97.
  const long = 'A Complete Guide to Buying Your First Home in Garland, Texas, With Every Step Explained Plainly';
  const fitted = fittedTitle(long);
  assert.equal(typeof fitted, 'object');
  assert.ok(fitted.absolute.length <= 60, `got ${fitted.absolute.length}: ${fitted.absolute}`);
  assert.ok(fitted.absolute.endsWith('…'));
  // Cut on a word boundary: the text before the ellipsis is a prefix of whole words.
  assert.ok(long.startsWith(fitted.absolute.slice(0, -1)));
  assert.match(long.slice(fitted.absolute.length - 1), /^[\s,]/, 'must not cut mid-word');

  // One unbroken word still fits.
  assert.ok(shortenAtWord('x'.repeat(90), 60).length <= 60);
  // Trailing punctuation is not left before the ellipsis.
  assert.doesNotMatch(shortenAtWord(long, 60), /[,\s]…$/);

  // The Studio caps the SEO title at 60 and warns when a long title has none.
  const schema = read('apps/web/cms/schema/documents/article.ts');
  const seoTitle = schema.slice(schema.indexOf('name: "seoTitle"'), schema.indexOf('name: "seoDescription"'));
  assert.match(seoTitle, /rule\.max\(60\)/);
  assert.match(seoTitle, /\.warning\(\)/);
});

test('placeholder pages stay out of the index and out of the sitemap', () => {
  const sitemap = read(`${APP}/sitemap.ts`);
  for (const route of ['testimonials', 'market-reports']) {
    assert.match(read(`${APP}/${route}/page.tsx`), /robots: \{ index: false, follow: true \}/, `/${route} must be noindex`);
    assert.doesNotMatch(sitemap, new RegExp(`"/${route}"`), `/${route} must not be in the sitemap`);
  }
});

test('llms.txt is generated from site sources and never lists a noindexed page', () => {
  const route = read(`${APP}/llms.txt/route.ts`);
  assert.match(route, /listArticles\(\)/, 'guides come from the CMS, not a hardcoded list');
  assert.match(route, /What this site does not do/);
  assert.match(route, /does not approve loans/);
  for (const hidden of ['/testimonials', '/market-reports']) {
    assert.doesNotMatch(route, new RegExp(`"${hidden}"`));
  }
});

test('article topics publish the CMS display names, not title-cased slugs', async () => {
  const { TOPIC_LABELS, articleJsonLd } = await import(
    pathToFileURL('apps/web/lib/blog/structured-data.ts').href
  );
  const schema = read('apps/web/cms/schema/documents/article.ts');
  // Only the topic lists: the schema's other option lists are not topics.
  const lists = schema.slice(schema.indexOf('const PROGRAMS'), schema.indexOf('export const article'));
  const options = [...lists.matchAll(/\{ title: "([^"]+)", value: "([^"]+)" \}/g)];
  assert.ok(options.length >= 6, 'expected the PROGRAMS and AREAS option lists');
  for (const [, title, value] of options) {
    assert.equal(TOPIC_LABELS[value], title, `topic "${value}" should publish as "${title}"`);
  }

  const article = {
    slug: 's', title: 'T', seoDescription: 'D', publishedAt: '2026-08-05',
    category: { title: 'C' }, programs: ['naca'], areas: ['dallas-fort-worth'], sources: [],
    author: { name: 'Debra Allen', role: 'REALTOR®', url: '/about' },
  };
  const ld = articleJsonLd(article);
  assert.deepEqual(ld.about.map((t) => t.name), ['NACA', 'Dallas–Fort Worth']);
  // The byline resolves to the site-wide Person entity, with the role as a title.
  assert.equal(ld.author['@id'], 'https://daffordablehomes.com/#debra-allen');
  assert.equal(ld.author.name, 'Debra Allen');
  assert.equal(ld.author.jobTitle, 'REALTOR®');
  assert.ok(ld.publisher.logo?.url, 'publisher carries a logo');

  // A guest author is not merged into Debra's entity.
  const guest = articleJsonLd({ ...article, author: { name: 'Guest Writer', url: '/about' } });
  assert.equal(guest.author['@id'], undefined);
});

test('the site-wide Person asserts no unverified fact', () => {
  const layout = read(`${APP}/layout.tsx`);
  const person = layout.slice(layout.indexOf('"@type": "Person"'), layout.indexOf('export default function'));
  for (const field of ['address', 'telephone', 'areaServed', 'sameAs', 'hasCredential']) {
    assert.doesNotMatch(person, new RegExp(`\\b${field}:`), `Person must not publish ${field} until it is verified`);
  }
});

test('the app icons are the brand monogram at the sizes browsers ask for, and stay small', () => {
  // The icon ships with every first page view and is what search results show
  // beside the site name. It was a 73 KB red "n" that was not part of the brand.
  for (const [file, size] of [[`${APP}/icon.png`, 512], [`${APP}/apple-icon.png`, 180]]) {
    const png = readFileSync(file);
    assert.equal(png.readUInt32BE(16), size, `${file} width`);
    assert.equal(png.readUInt32BE(20), size, `${file} height`);
    assert.ok(png.length < 24 * 1024, `${file} is ${png.length} bytes`);
    // iOS fills transparency with black, so the home-screen tile must be opaque.
    assert.equal(png.includes(Buffer.from('tRNS')), false, `${file} must be opaque`);
    assert.ok(png[25] !== 4 && png[25] !== 6, `${file} must not carry an alpha channel`);
  }
  assert.match(read('docs/05-content/IMAGE_ASSET_REGISTER.md'), /`icon\.png` \(512×512\) and `apple-icon\.png`/);
});
