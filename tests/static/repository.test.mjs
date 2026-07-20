import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';

const requiredFiles = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'tsconfig.base.json',
  'apps/web/package.json',
  'apps/web/app/layout.tsx',
  'apps/web/app/page.tsx',
  'apps/web/components/layout/site-header.tsx',
  'apps/web/next.config.mjs',
  'packages/integrations/src/shopify/index.ts'
];

test('production application files exist', () => {
  for (const file of requiredFiles) {
    assert.equal(existsSync(file), true, `${file} should exist`);
  }
});

test('workspace installs are isolated and reproducible', () => {
  const rootPackage = JSON.parse(readFileSync('package.json', 'utf8'));
  const webPackage = JSON.parse(readFileSync('apps/web/package.json', 'utf8'));
  const workspace = readFileSync('pnpm-workspace.yaml', 'utf8');
  const workflow = readFileSync('.github/workflows/application-quality.yml', 'utf8');

  assert.equal(rootPackage.packageManager, 'pnpm@11.9.0');
  assert.equal(webPackage.dependencies['@daffordablehomes/integrations'], 'workspace:*');
  assert.match(workspace, /apps\/\*/);
  assert.match(workspace, /packages\/\*/);
  assert.match(workflow, /pnpm install --frozen-lockfile/);
});

test('approved photography and ClientVerse attribution remain wired to public pages', () => {
  const hero = readFileSync('apps/web/components/home/hero.tsx', 'utf8');
  const aboutHome = readFileSync('apps/web/components/home/about-debra.tsx', 'utf8');
  const aboutPage = readFileSync('apps/web/app/about/page.tsx', 'utf8');
  const footer = readFileSync('apps/web/components/layout/site-footer.tsx', 'utf8');

  assert.match(hero, /black-family-moving-home-hero\.webp/);
  assert.match(aboutHome, /debra-allen-primary-about\.webp/);
  assert.match(aboutPage, /debra-allen-advisor-desk\.webp/);
  assert.match(aboutPage, /debra-allen-lifestyle-full-body\.webp/);
  assert.match(footer, /Real Estate Technology by/);
  assert.match(footer, /https:\/\/clientverse\.io/);
});

test('application shell includes core accessibility landmarks', () => {
  const layout = readFileSync('apps/web/app/layout.tsx', 'utf8');
  const header = readFileSync('apps/web/components/layout/site-header.tsx', 'utf8');
  assert.match(layout, /Skip to main content/);
  assert.match(layout, /<main id="main-content"/);
  assert.match(header, /<nav aria-label="Primary"/);
  assert.match(header, /aria-expanded=/);
  assert.match(header, /aria-controls="mobile-menu"/);
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
