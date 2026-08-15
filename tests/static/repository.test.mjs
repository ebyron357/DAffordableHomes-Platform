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
  'apps/web/app/consultation/page.tsx',
  'apps/web/app/calculators/page.tsx',
  'apps/web/app/calculators/affordability/page.tsx',
  'apps/web/app/calculators/closing-costs/page.tsx',
  'apps/web/app/calculators/down-payment/page.tsx',
  'apps/web/app/calculators/mortgage-payment/page.tsx',
  'apps/web/app/calculators/rent-vs-buy/page.tsx',
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

test('approved photography remains wired to public pages', () => {
  const hero = readFileSync('apps/web/components/home/hero.tsx', 'utf8');
  const aboutHome = readFileSync('apps/web/components/home/about-debra.tsx', 'utf8');
  const aboutPage = readFileSync('apps/web/app/about/page.tsx', 'utf8');
  const consultation = readFileSync('apps/web/app/consultation/page.tsx', 'utf8');
  const header = readFileSync('apps/web/components/layout/site-header.tsx', 'utf8');
  const footer = readFileSync('apps/web/components/layout/site-footer.tsx', 'utf8');

  assert.match(hero, /hero-family_b1fab939\.jpg/);
  assert.match(header, /dah-logo_ff042b7b\.png/);
  assert.match(aboutHome, /debra-allen-primary-about\.webp/);
  assert.match(aboutPage, /debra-allen-advisor-desk\.webp/);
  assert.match(aboutPage, /debra-allen-lifestyle-full-body\.webp/);
  assert.match(consultation, /couple-consultation_25d3a592\.jpg/);
  assert.match(footer, /TREC Information About Brokerage Services/);

  // Rejected asset: a dense East-Coast streetscape cannot illustrate a North
  // Texas page. It is removed from the app so it cannot be reused.
  assert.equal(existsSync('apps/web/public/manus-storage/neighborhood-community_101d8dfe.jpg'), false);
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

test('clean-checkout typechecking uses Next-managed route declarations', () => {
  const rootPackage = JSON.parse(readFileSync('package.json', 'utf8'));
  const webPackage = JSON.parse(readFileSync('apps/web/package.json', 'utf8'));
  const gitignore = readFileSync('.gitignore', 'utf8');
  const workflow = readFileSync('.github/workflows/application-quality.yml', 'utf8');
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));

  assert.match(webPackage.scripts.typecheck, /(?:^|&&\s*)next typegen(?:\s*&&|$)/);
  assert.equal('postbuild' in webPackage.scripts, false);
  assert.match(gitignore, /^apps\/web\/next-env\.d\.ts$/m);
  assert.equal(existsSync('apps/web/scripts/restore-next-env.mjs'), false);
  assert.match(rootPackage.scripts['test:all'], /(?:^|&&\s*)npm run typecheck(?:\s*&&|$)/);
  assert.match(workflow, /pnpm test:all/);
  assert.equal(vercel.framework, 'nextjs');
  assert.equal(vercel.buildCommand, 'pnpm build');
  assert.equal(vercel.outputDirectory, 'apps/web/.next');
});

test('public production routes use the Manus-aligned canonical paths and preserve redirects', () => {
  const sitemap = readFileSync('apps/web/app/sitemap.ts', 'utf8');
  const redirects = readFileSync('apps/web/next.config.mjs', 'utf8');

  for (const route of [
    '/consultation',
    '/calculators',
    '/calculators/affordability',
    '/calculators/closing-costs',
    '/calculators/down-payment',
    '/calculators/mortgage-payment',
    '/calculators/rent-vs-buy'
  ]) {
    assert.match(sitemap, new RegExp(route.replaceAll('/', '\\/')));
  }

  assert.match(redirects, /source: '\/book', destination: '\/consultation'/);
  assert.match(redirects, /source: '\/resources\/calculators', destination: '\/calculators'/);
  assert.match(redirects, /source: '\/calculator', destination: '\/calculators\/mortgage-payment'/);
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
