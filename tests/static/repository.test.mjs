import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';

const requiredFiles = [
  'package.json',
  'tsconfig.base.json',
  'apps/web/package.json',
  'apps/web/app/layout.tsx',
  'apps/web/app/page.tsx',
  'apps/web/next.config.mjs',
  'packages/integrations/src/shopify/index.ts'
];

test('production scaffold files exist', () => {
  for (const file of requiredFiles) {
    assert.equal(existsSync(file), true, `${file} should exist`);
  }
});

test('home layout includes core accessibility landmarks', () => {
  const layout = readFileSync('apps/web/app/layout.tsx', 'utf8');
  assert.match(layout, /Skip to main content/);
  assert.match(layout, /<main id="main-content">/);
  assert.match(layout, /<nav aria-label="Primary navigation">/);
});

test('security headers include CSP and anti-sniffing controls', () => {
  const config = readFileSync('apps/web/next.config.mjs', 'utf8');
  assert.match(config, /Content-Security-Policy/);
  assert.match(config, /X-Content-Type-Options/);
  assert.match(config, /Permissions-Policy/);
  assert.doesNotMatch(config, /unsafe-eval/);
});

test('Shopify integration fails closed without placeholder products', () => {
  const source = readFileSync('packages/integrations/src/shopify/index.ts', 'utf8');
  assert.match(source, /status: 'unavailable'/);
  assert.match(source, /placeholder products/);
  assert.match(source, /myshopify\.com/);
});
