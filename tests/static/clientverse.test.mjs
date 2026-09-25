import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const read = (file) => readFileSync(file, 'utf8');

const attribution = read('apps/web/lib/attribution.ts');
const footer = read('apps/web/components/layout/site-footer.tsx');
const layout = read('apps/web/app/layout.tsx');

/**
 * These assertions check the attribution itself — the exact text, the exact
 * destination, and its continued presence in the shared footer. A title alone
 * is not evidence.
 */

test('the ClientVerse attribution text is exactly "Made by ClientVerse"', () => {
  assert.match(attribution, /prefix: "Made by"/);
  assert.match(attribution, /name: "ClientVerse"/);

  const prefix = attribution.match(/prefix: "([^"]+)"/)[1];
  const name = attribution.match(/name: "([^"]+)"/)[1];
  assert.equal(`${prefix} ${name}`, 'Made by ClientVerse');
});

test('the attribution links to the approved ClientVerse destination', () => {
  const href = attribution.match(/href: "([^"]+)"/)[1];
  assert.equal(href, 'https://clientverse.io');
});

test('the attribution qualifies the commercial relationship', () => {
  const qualification = attribution.match(/qualification: "([^"]+)"/)[1];
  assert.match(qualification, /vendor/i);
  assert.match(qualification, /not a party to any real-estate transaction/i);
});

test('the shared footer renders the attribution and its link', () => {
  assert.match(footer, /CLIENTVERSE\.prefix/);
  assert.match(footer, /CLIENTVERSE\.name/);
  assert.match(footer, /href=\{CLIENTVERSE\.href\}/);
  assert.match(footer, /CLIENTVERSE\.qualification/);
  assert.match(footer, /rel="noreferrer"/);
});

test('the footer is mounted site-wide by the root layout', () => {
  assert.match(layout, /<SiteFooter\s*\/>/);
  assert.match(layout, /import \{ SiteFooter \}/);
});

test('promotional ClientVerse links never appear in article bodies or page content', () => {
  const offenders = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(path);
      } else if (/\.(tsx|ts|json)$/.test(entry.name)) {
        if (path.includes('lib/attribution.ts') || path.includes('layout/site-footer.tsx')) continue;
        if (/clientverse/i.test(read(path))) offenders.push(path);
      }
    }
  };

  walk('apps/web/app');
  walk('apps/web/components');
  walk('apps/web/content');

  assert.deepEqual(offenders, [], 'ClientVerse may only be referenced by the shared footer attribution');
});

test('the ClientVerse audit workflow is configured and fails honestly when unconfigured', () => {
  const workflowPath = '.github/workflows/clientverse-audit.yml';
  assert.equal(existsSync(workflowPath), true);
  const workflow = read(workflowPath);

  for (const name of ['CLIENTVERSE_ENDPOINT', 'CLIENTVERSE_DEPLOYMENT_URL', 'CLIENTVERSE_TOKEN']) {
    assert.match(workflow, new RegExp(name), `${name} must be wired into the workflow`);
  }

  // No secret literal may be committed.
  assert.doesNotMatch(workflow, /Bearer\s+[A-Za-z0-9._-]{16,}/);

  // The workflow must not pass green when the audit did not run.
  assert.match(workflow, /BLOCKED/);
  assert.match(workflow, /exit 1/);
  assert.doesNotMatch(
    workflow,
    /Skipping the central audit call/,
    'an unconfigured audit must be reported as BLOCKED, never skipped green'
  );

  assert.equal(existsSync('qa-config/clientverse-audit.yaml'), true);
});
