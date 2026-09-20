import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

/**
 * ClientVerse attribution and audit-integration regression tests.
 *
 * These tests exist because a previous suite carried a test *named* for
 * ClientVerse coverage that asserted nothing about ClientVerse. Every assertion
 * below is about ClientVerse specifically.
 */

const read = (file) => readFileSync(file, 'utf8');

const ATTRIBUTION_TEXT = 'Made by ClientVerse';
const ATTRIBUTION_HREF = 'https://clientverse.io';

test('the attribution constants hold the approved text and destination', () => {
  const source = read('apps/web/lib/clientverse.ts');

  assert.match(source, new RegExp(`attributionText: "${ATTRIBUTION_TEXT}"`));
  assert.match(source, new RegExp(`href: "${ATTRIBUTION_HREF}"`));
  // The commercial relationship must be qualified, not implied.
  assert.match(source, /relationshipNote: "[^"]+"/);
});

test('the attribution renders in the shared site footer', () => {
  const footer = read('apps/web/components/layout/site-footer.tsx');

  assert.match(footer, /import \{ CLIENTVERSE \} from "@\/lib\/clientverse"/);
  assert.match(footer, /href=\{CLIENTVERSE\.href\}/);
  assert.match(footer, /\{CLIENTVERSE\.attributionText\}/);
  assert.match(footer, /\{CLIENTVERSE\.relationshipNote\}/);
  // Outbound vendor link hygiene.
  assert.match(footer, /rel="noopener noreferrer"/);
});

test('the shared footer is mounted site-wide by the root layout', () => {
  const layout = read('apps/web/app/layout.tsx');

  assert.match(layout, /import \{ SiteFooter \} from "@\/components\/layout\/site-footer"/);
  assert.match(layout, /<SiteFooter \/>/);
});

test('the attribution appears once and never inside article content', () => {
  const componentFiles = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const target = join(directory, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (/\.(tsx?|mdx?)$/.test(entry.name)) componentFiles.push(target);
    }
  };
  walk('apps/web/app');
  walk('apps/web/components');
  walk('apps/web/lib');

  const rendering = componentFiles.filter((file) => {
    if (file.endsWith('lib/clientverse.ts')) return false;
    return /CLIENTVERSE\.attributionText|Made by ClientVerse/.test(read(file));
  });

  assert.deepEqual(
    rendering,
    ['apps/web/components/layout/site-footer.tsx'],
    'the attribution must render only from the shared footer'
  );

  // Article bodies come from the CMS seed; no promotional vendor links there.
  const seedFiles = readdirSync('apps/web/lib/blog/seed/articles').map((name) =>
    read(join('apps/web/lib/blog/seed/articles', name))
  );
  for (const source of seedFiles) {
    assert.doesNotMatch(source, /clientverse/i);
  }
});

test('the audit workflow targets the canonical app and preserves evidence', () => {
  const workflow = read('.github/workflows/clientverse-audit.yml');
  const config = read('qa-config/clientverse-audit.yaml');

  assert.match(workflow, /vars\.CLIENTVERSE_ENDPOINT/);
  assert.match(workflow, /secrets\.CLIENTVERSE_TOKEN/);
  assert.match(workflow, /vars\.CLIENTVERSE_DEPLOYMENT_URL/);
  assert.match(workflow, /qa-config\/clientverse-audit\.yaml/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /name: clientverse-audit-evidence/);

  assert.match(config, /app_directory: "apps\/web"/);
  assert.match(config, /canonical_origin: "https:\/\/daffordablehomes\.com"/);
  for (const slug of [
    'naca-homebuying-dallas-fort-worth',
    'homes-for-heroes-north-texas',
    'how-to-buy-home-garland-tx'
  ]) {
    assert.match(config, new RegExp(slug));
  }
});

test('the ClientVerse certification runs only in release contexts', () => {
  const workflow = read('.github/workflows/clientverse-audit.yml');

  assert.match(workflow, /push:\s+branches:\s+- main/s);
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(
    workflow,
    /pull_request:/,
    'the release certification depends on deployment configuration unavailable to ordinary PR checks'
  );
});

test('an unconfigured or uncertified audit fails instead of reporting success', () => {
  const workflow = read('.github/workflows/clientverse-audit.yml');

  // Missing configuration must fail the check, not emit a notice and exit 0.
  assert.match(workflow, /ClientVerse audit BLOCKED/);
  assert.doesNotMatch(workflow, /::notice::.*Skipping the central audit/);

  // Only an explicit certified pass may pass the gate.
  assert.match(workflow, /PASS\|PASSED\|APPROVED\|CERTIFIED\|OK/);
  assert.match(workflow, /not a certified pass/);

  // A failed request or an unreadable response must not fall through as success.
  assert.match(workflow, /gate=REQUEST_FAILED/);
  assert.match(workflow, /UNPARSEABLE/);
});

test('no ClientVerse credentials are committed', () => {
  const workflow = read('.github/workflows/clientverse-audit.yml');
  const config = read('qa-config/clientverse-audit.yaml');

  for (const source of [workflow, config]) {
    assert.doesNotMatch(source, /Bearer\s+[A-Za-z0-9_-]{16,}/);
    assert.doesNotMatch(source, /CLIENTVERSE_TOKEN\s*[:=]\s*["']?[A-Za-z0-9_-]{16,}/);
  }

  assert.equal(existsSync('.env'), false);
});
