import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

/**
 * Behavioural tests for the redirect guard.
 *
 * This is deliberately a real unit test rather than a regex over the source.
 * The bug it guards against — `/\evil.example` passing a `startsWith("/")`
 * check and then being normalised by the browser into the protocol-relative
 * `//evil.example` — is exactly the kind of thing a source-text assertion
 * says nothing about.
 */

// The module is TypeScript; Node strips types, the hook supplies TS's
// extensionless resolution.
register('../../scripts/sanity/ts-resolver.mjs', import.meta.url);

const { toSafeInternalPath } = await import(
  pathToFileURL('apps/web/lib/safe-path.ts').href
);

test('same-origin paths are preserved', () => {
  assert.equal(toSafeInternalPath('/blog'), '/blog');
  assert.equal(toSafeInternalPath('/blog/how-to-buy-home-garland-tx'), '/blog/how-to-buy-home-garland-tx');
  assert.equal(toSafeInternalPath('/blog?page=2#top'), '/blog?page=2#top');
});

test('missing or non-absolute input falls back', () => {
  assert.equal(toSafeInternalPath(null, '/blog'), '/blog');
  assert.equal(toSafeInternalPath(undefined, '/blog'), '/blog');
  assert.equal(toSafeInternalPath('', '/blog'), '/blog');
  assert.equal(toSafeInternalPath('blog', '/blog'), '/blog');
  assert.equal(toSafeInternalPath('https://evil.example', '/blog'), '/blog');
  assert.equal(toSafeInternalPath('javascript:alert(1)', '/blog'), '/blog');
});

test('off-origin redirects are rejected in every browser-normalised form', () => {
  const hostile = [
    '//evil.example',
    '///evil.example',
    // Browsers normalise "\" to "/" in a Location header.
    '/\\evil.example',
    '\\\\evil.example',
    '/\\\\evil.example',
    '\\/evil.example',
    // Control characters are stripped while re-parsing, reforming "//".
    '/\t/evil.example',
    '/\n/evil.example',
    '/\r/evil.example',
    // Written as escapes: a literal control character in the source makes
    // this file binary to git, so its diffs stop rendering in review.
    '/\0/evil.example',
    '/\v/evil.example',
  ];

  for (const input of hostile) {
    assert.equal(
      toSafeInternalPath(input, '/blog'),
      '/blog',
      `${JSON.stringify(input)} must not be used as a redirect target`
    );
  }
});

test('the result is always a single-leading-slash same-origin path', () => {
  const inputs = [
    '/blog',
    '//evil.example',
    '/\\evil.example',
    'https://evil.example',
    '/\t/evil.example',
    null,
  ];

  for (const input of inputs) {
    const result = toSafeInternalPath(input, '/blog');
    assert.ok(result.startsWith('/'), `${JSON.stringify(input)} -> ${result}`);
    assert.ok(!result.startsWith('//'), `${JSON.stringify(input)} -> ${result}`);
    assert.ok(!result.includes('\\'), `${JSON.stringify(input)} -> ${result}`);
  }
});

test('the draft-mode exit route uses the guard', () => {
  const route = readFileSync('apps/web/app/api/draft-mode/disable/route.ts', 'utf8');
  assert.match(route, /toSafeInternalPath/);
  // No hand-rolled regex guard should creep back in.
  assert.doesNotMatch(route, /searchParams[\s\S]{0,80}test\(/);
});

test('CMS href validation rejects protocol-relative destinations', async () => {
  const { isSafeInternalPath } = await import(
    pathToFileURL('apps/web/lib/safe-path.ts').href
  );

  for (const good of ['/blog', '/calculators/affordability', '/blog?a=1#b']) {
    assert.equal(isSafeInternalPath(good), true, good);
  }

  // Each of these begins with "/" and would pass a naive startsWith check,
  // yet navigates off-site once the browser normalises it.
  for (const bad of ['//attacker.example', '/\\attacker.example', '/\t/attacker.example']) {
    assert.equal(isSafeInternalPath(bad), false, JSON.stringify(bad));
  }

  for (const bad of ['https://attacker.example', 'blog', '', null, undefined]) {
    assert.equal(isSafeInternalPath(bad), false, JSON.stringify(bad));
  }
});

const SCHEMA_FILES = {
  blocks: 'apps/web/cms/schema/objects/blocks.ts',
  shared: 'apps/web/cms/schema/objects/shared.ts',
  richText: 'apps/web/cms/schema/objects/rich-text.ts',
  author: 'apps/web/cms/schema/documents/author.ts',
};

test('the CMS schema validators use the shared guard', () => {
  for (const [name, path] of Object.entries(SCHEMA_FILES)) {
    const source = readFileSync(path, 'utf8');
    assert.match(
      source,
      /isSafeInternalPath|toSafeHref/,
      `${name} should use a shared guard rather than its own check`
    );
    // The naive check must not come back.
    assert.doesNotMatch(source, /value\.startsWith\("\/"\)/, name);
  }
});

/**
 * The Studio must never accept a destination the renderer will drop.
 *
 * This is the invariant behind a defect that shipped: the renderer's allowlist
 * lost `http:` while the rich-text validator kept its own `https?://` regex, so
 * an editor could save a plain-http link and watch it render as unlinked text
 * with nothing in the Studio explaining why.
 *
 * The relation is subset, not equality. A validator is allowed to be *stricter*
 * than the renderer on purpose — `officialSource` takes https URLs only because
 * a citation should not be a `tel:` link, and the CTA blocks take site-relative
 * paths only. What must never happen is a validator accepting something the
 * renderer then silently drops.
 *
 * Every predicate is lifted out of the schema and executed rather than pattern
 * matched, so a validator that drifts fails the build.
 */
/**
 * The name of the field a validator is attached to.
 *
 * Only link fields are relevant here. Alt text is also validated with
 * `.custom(`, and "http://example.com" is perfectly good alt text — matching on
 * `.custom(` alone reports it as an unrenderable link.
 */
function enclosingFieldName(source, at) {
  const names = [...source.slice(0, at).matchAll(/name: "([^"]+)"/g)];
  return names.length > 0 ? names[names.length - 1][1] : null;
}

/**
 * The name of the `defineType` a validator sits inside.
 *
 * Needed to tell two different `url` fields apart: `author.url` is a
 * destination rendered into an anchor and into metadata, so the href allowlist
 * governs it, while `videoEmbed.url` is a watch URL that never becomes an href
 * at all — it is resolved to an iframe `src` by `toEmbedUrl`, which emits only
 * a youtube-nocookie or player.vimeo URL. Holding it to the href allowlist
 * would assert the wrong contract; it has its own invariant below.
 */
function enclosingTypeName(source, at) {
  const types = [...source.slice(0, at).matchAll(/defineType\(\{\s*\n\s*name: "([^"]+)"/g)];
  return types.length > 0 ? types[types.length - 1][1] : null;
}

const NOT_AN_HREF = new Set(['videoEmbed']);

function extractCustomValidators(source) {
  const marker = '.custom(';
  const predicates = [];

  for (let at = source.indexOf(marker); at !== -1; at = source.indexOf(marker, at + 1)) {
    const field = enclosingFieldName(source, at);
    if (field !== 'href' && field !== 'url') continue;
    if (NOT_AN_HREF.has(enclosingTypeName(source, at))) continue;

    let depth = 0;
    let quote = null;
    let end = -1;

    for (let i = at + marker.length - 1; i < source.length; i += 1) {
      const char = source[i];

      if (quote) {
        if (char === '\\') i += 1;
        else if (char === quote) quote = null;
        continue;
      }

      if (char === '"' || char === "'" || char === '`') quote = char;
      else if (char === '(') depth += 1;
      else if (char === ')') {
        depth -= 1;
        if (depth === 0) { end = i; break; }
      }
    }

    assert.ok(end > 0, 'unbalanced .custom( in schema source');
    predicates.push(source.slice(at + marker.length, end));
  }

  return predicates;
}

function compileValidator(body, guards) {
  // Node strips types from .ts files, but this text is being eval'd as plain JS.
  const js = body
    .replace(/\(\s*value\s*:[^)]*\)/, '(value)')
    .trim()
    // The formatter leaves a trailing comma in the argument list.
    .replace(/,$/, '');
  const build = new Function(...Object.keys(guards), `return (${js})`);
  return build(...Object.values(guards));
}

const HREF_CORPUS = [
  '/blog',
  '/blog/how-to-buy-home-garland-tx',
  '/blog?page=2#top',
  'https://www.naca.com/purchase/',
  'https://example.com',
  'mailto:hello@example.com',
  'tel:+15550001111',
  // Values that shipped as saveable-but-unrenderable.
  'http://example.com',
  // A scheme prefix is not a URL. `startsWith('https://')` accepted all four
  // of these while `new URL()` throws on them, which is exactly how the
  // related-link validator drifted looser than the renderer: the Studio saved
  // them and the article rendered an unlinked label. Corpus entries, not
  // comments, are what stop that recurring.
  'https://',
  'https:// ',
  'https://#x',
  'https://?a=1',
  'javascript:alert(1)',
  'JavaScript:alert(1)',
  'data:text/html;base64,PHNjcmlwdD4=',
  'vbscript:msgbox(1)',
  'file:///etc/passwd',
  '//attacker.example',
  '///attacker.example',
  '/\\attacker.example',
  '\\\\attacker.example',
  '/\tattacker.example',
  'blog',
  '',
  undefined,
];

test('no schema validator accepts a destination the renderer would drop', async () => {
  const { toSafeHref, isSafeInternalPath } = await import(
    pathToFileURL('apps/web/lib/safe-path.ts').href
  );

  let checked = 0;

  for (const [name, path] of Object.entries(SCHEMA_FILES)) {
    const source = readFileSync(path, 'utf8');

    for (const [index, body] of extractCustomValidators(source).entries()) {
      const accepts = compileValidator(body, { toSafeHref, isSafeInternalPath });
      checked += 1;

      for (const value of HREF_CORPUS) {
        // An optional field accepting "no value" is not a broken link: the
        // renderers fall back (author.url becomes /about). Absence is not a
        // destination, so it is not in scope for this invariant.
        if (value === undefined || value === '') continue;
        if (accepts(value) !== true) continue;

        assert.notEqual(
          toSafeHref(value),
          null,
          `${name} validator #${index} accepts ${JSON.stringify(value)}, ` +
            'but the renderer drops it — the Studio would report success and ' +
            'the link would render as plain text'
        );
      }
    }
  }

  // A refactor that removes the validators must not quietly pass this test.
  assert.ok(checked >= 4, `expected several validators, extracted ${checked}`);
});

test('the rich-text validator delegates to the renderer allowlist', async () => {
  const { toSafeHref, isSafeInternalPath } = await import(
    pathToFileURL('apps/web/lib/safe-path.ts').href
  );

  const [body] = extractCustomValidators(readFileSync(SCHEMA_FILES.richText, 'utf8'));
  const accepts = compileValidator(body, { toSafeHref, isSafeInternalPath });

  // Body prose is the one surface that carries arbitrary editor links, so here
  // the relation is equality: anything renderable is saveable and vice versa.
  for (const value of HREF_CORPUS) {
    assert.equal(
      accepts(value) === true,
      toSafeHref(value) !== null,
      `Studio and renderer disagree about ${JSON.stringify(value)}`
    );
  }

  // Absence is refused separately by `.required()`, which is not part of the
  // extracted predicate — assert the schema still carries it.
  assert.match(
    readFileSync(SCHEMA_FILES.richText, 'utf8'),
    /\.required\(\)\s*\n?\s*(\/\*[\s\S]*?\*\/\s*)?\.custom\(|required\(\)[\s\S]{0,40}custom\(/,
    'the rich-text href must stay required'
  );
});

test('the render-time href allowlist rejects script and data URLs', async () => {
  const { toSafeHref } = await import(pathToFileURL('apps/web/lib/safe-path.ts').href);

  for (const good of [
    '/blog',
    'https://www.naca.com/purchase/',
    'mailto:hello@example.com',
    'tel:+15550001111'
  ]) {
    assert.equal(toSafeHref(good), good, good);
  }

  // Studio validation is bypassable by a direct API mutation, so these have to
  // be rejected at render time too.
  for (const bad of [
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    ' javascript:alert(1)',
    'data:text/html;base64,PHNjcmlwdD4=',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    '//attacker.example',
    '/\\attacker.example',
    // The Studio only saves https for absolute destinations, so a plain-http
    // link means schema validation was bypassed — and it is a downgrade from
    // an HTTPS page either way.
    'http://example.com',
    'http://www.naca.com/purchase/',
    '',
    null
  ]) {
    assert.equal(toSafeHref(bad), null, JSON.stringify(bad));
  }
});

test('every CMS-supplied href passes through the allowlist before rendering', () => {
  const portableText = readFileSync('apps/web/components/blog/portable-text.tsx', 'utf8');
  const blocks = readFileSync('apps/web/components/blog/blocks.tsx', 'utf8');
  const article = readFileSync('apps/web/app/blog/[slug]/page.tsx', 'utf8');

  for (const [name, source] of Object.entries({ portableText, blocks, article })) {
    assert.match(source, /toSafeHref/, `${name} should sanitise CMS hrefs`);
  }

  // No raw CMS value may reach an href attribute.
  assert.doesNotMatch(portableText, /href=\{String\(value/);
  assert.doesNotMatch(blocks, /href=\{source\.href\}/);
  assert.doesNotMatch(article, /href=\{link\.href\}/);

  // The CTA blocks pass `block.href` into InlineCta, so the sanitiser has to
  // sit inside InlineCta rather than at the three call sites — otherwise a
  // fourth CTA block type reintroduces the gap silently.
  assert.match(blocks, /const safeHref = toSafeHref\(href\)/);
  assert.doesNotMatch(blocks, /<Button\s+href=\{href\}/);
});

/**
 * Extracts the audit's served-anchor predicate and runs it here.
 *
 * The predicate lives inside a `page.evaluate` callback, so it cannot be
 * imported — but it is now the check that covers render sites the unit tests
 * above do not name, which makes it worth more than a `assert.match` on the
 * source. Lifting the real code out and exercising it means a predicate that
 * silently stops catching things fails the build.
 */
function servedHrefPredicate() {
  const source = readFileSync('scripts/qa/site-audit.mjs', 'utf8');
  const start = source.indexOf('const allowedSchemes =');
  const end = source.indexOf('})', source.indexOf('const unsafeHrefs ='));
  assert.ok(start > 0 && end > start, 'audit predicate not found — did it move?');

  const body = source
    .slice(start, end + 2)
    .replace('const unsafeHrefs = allHrefs.filter', 'return hrefs.filter');
  const build = new Function('hrefs', body);
  return (href) => build([href]).length === 1;
}

test('the audit flags every anchor the render-time allowlist would reject', () => {
  const isUnsafe = servedHrefPredicate();

  for (const good of [
    '/blog',
    '/blog/how-to-buy-home-garland-tx',
    '/blog?page=2#top',
    '#top',
    'https://www.naca.com/purchase/',
    'mailto:hello@example.com',
    'tel:+15550001111'
  ]) {
    assert.equal(isUnsafe(good), false, `${good} is a legitimate destination`);
  }

  for (const bad of [
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    ' javascript:alert(1)',
    'data:text/html;base64,PHNjcmlwdD4=',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    // Matches toSafeHref: the Studio only saves https for absolute values.
    'http://example.com',
    // These begin with "/" and resolve to an https: URL against the page
    // origin, so a predicate that tests the *resolved* scheme calls them
    // safe. The first version of this check did exactly that.
    '//attacker.example',
    '///attacker.example',
    '/\\attacker.example',
    '\\\\attacker.example',
    '/\t/attacker.example',
    '/\r/attacker.example'
  ]) {
    assert.equal(isUnsafe(bad), true, `${JSON.stringify(bad)} must be flagged`);
  }
});

test('the audit records the served-anchor result as a check', () => {
  const audit = readFileSync('scripts/qa/site-audit.mjs', 'utf8');
  assert.match(audit, /anchors all use an allowlisted scheme/);
});

test('the video URL validator and the renderer share one embeddability predicate', async () => {
  const { toEmbedUrl, isEmbeddableVideoUrl } = await import(
    pathToFileURL('apps/web/lib/blog/embeds.ts').href
  );

  // The schema used to require only "an https URI" while the renderer needed a
  // watch URL it could pull an id out of. A valid-but-unembeddable URL saved
  // cleanly and then rendered as nothing, so the published article lost the
  // block with no message anywhere. Saveable and renderable have to be the
  // same question.
  const corpus = [
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', true],
    ['https://youtu.be/dQw4w9WgXcQ', 'youtube', true],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'youtube', true],
    ['https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'youtube', true],
    ['https://vimeo.com/123456789', 'vimeo', true],
    ['https://player.vimeo.com/video/123456789', 'vimeo', true],
    // Accepted by "an https URI", embeddable by neither provider.
    ['https://example.com/article', 'youtube', false],
    ['https://example.com/article', 'vimeo', false],
    // Any https URL ending in a numeric segment used to resolve to a Vimeo
    // embed, so a typo produced a plausible iframe pointing at someone else's
    // video on a host the editor never named.
    ['https://example.com/12345', 'vimeo', false],
    ['https://www.youtube.com/watch?list=PL123', 'youtube', false],
    ['https://vimeo.com/channels/staffpicks', 'vimeo', false],
    // Plain http is a mixed-content downgrade, as it is for hrefs.
    ['http://vimeo.com/123456789', 'vimeo', false],
    ['http://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', false],
    // A scheme prefix is not a URL.
    ['https://', 'youtube', false],
    ['javascript:alert(1)', 'youtube', false],
    ['', 'youtube', false],
    [undefined, 'vimeo', false],
  ];

  for (const [url, provider, embeddable] of corpus) {
    assert.equal(
      isEmbeddableVideoUrl(url, provider),
      embeddable,
      `${provider}: ${JSON.stringify(url)} should ${embeddable ? '' : 'not '}be accepted`
    );

    // The Studio-facing predicate is the render-time one, not a copy of it, so
    // the two cannot drift apart the way the href checks once did.
    assert.equal(
      isEmbeddableVideoUrl(url, provider),
      toEmbedUrl(url, provider) !== null,
      `${provider}: ${JSON.stringify(url)} — validator and renderer disagree`
    );
  }

  // Whatever is embedded is served from the provider's own host: the resolver
  // reconstructs the URL from a validated id rather than passing input through.
  for (const [url, provider, embeddable] of corpus) {
    if (!embeddable) continue;
    const embed = toEmbedUrl(url, provider);
    assert.match(
      embed,
      provider === 'youtube'
        ? /^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]{11}$/
        : /^https:\/\/player\.vimeo\.com\/video\/\d+$/,
      `${JSON.stringify(url)} produced ${JSON.stringify(embed)}`
    );
  }
});

test('the schema validator for a video URL is the shared predicate, not a copy', () => {
  const source = readFileSync(SCHEMA_FILES.blocks, 'utf8');

  // A regex over source is a weak assertion, which is why the behavioural test
  // above carries the contract. This one exists only to catch the specific
  // regression of someone reintroducing a second, hand-rolled URL test here.
  assert.match(
    source,
    /isEmbeddableVideoUrl\(value, provider\)/,
    'the videoEmbed url validator must call the renderer resolver'
  );
  assert.doesNotMatch(
    source,
    /uri\(\{ scheme: \["https"\] \}\)[\s\S]{0,40}videoEmbed/,
    'the videoEmbed url field must not fall back to a bare scheme check'
  );
});
