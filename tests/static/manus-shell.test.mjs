import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const expectedNavigation = [
  ['/', 'Home'],
  ['/calculators', 'Calculators'],
  ['/neighborhoods', 'Neighborhoods'],
  ['/blog', 'Blogs'],
  ['/about', 'About Debra'],
  ['/consultation', 'Book Consultation'],
];

const editorialPages = [
  'recovered-manus/blog/index.html',
  'recovered-manus/blog/naca-homebuying-dallas-fort-worth/index.html',
  'recovered-manus/blog/homes-for-heroes-north-texas/index.html',
  'recovered-manus/blog/how-to-buy-home-garland-tx/index.html',
];

test('the recovered application labels the editorial destination Blogs', () => {
  const bundle = readFileSync('recovered-manus/assets/index-BT_aM9Xt.js', 'utf8');
  assert.match(bundle, /href:"\/blog",label:"Blogs"/);
  assert.doesNotMatch(bundle, /href:"\/blog",label:"Resources"/);
});

test('every editorial route uses the complete shared navigation and footer', () => {
  for (const path of editorialPages) {
    const page = readFileSync(path, 'utf8');
    for (const [href, label] of expectedNavigation) {
      assert.match(page, new RegExp(`href="${href.replaceAll('/', '\\/')}"[^>]*>${label}`), `${path} is missing ${label}`);
    }
    assert.match(page, /<nav class="desktop-nav" aria-label="Primary">/);
    assert.match(page, /<details class="mobile-nav">/);
    assert.match(page, /<footer class="site-footer">/);
    assert.match(page, /Real guidance for first-time buyers and families ready to own their future\./);
    assert.match(page, /Guidance for first-time buyers &amp; families/);
    assert.doesNotMatch(page, />Resources</);
  }
});

test('Vercel sends every recovered application route to the SPA shell', () => {
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const rewrites = new Map(vercel.rewrites.map(({ source, destination }) => [source, destination]));
  for (const route of ['/calculators', '/calculator', '/neighborhoods', '/about', '/consultation']) {
    assert.equal(rewrites.get(route), '/index.html', `${route} must resolve through the recovered application shell`);
  }
});
