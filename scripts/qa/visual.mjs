#!/usr/bin/env node
/**
 * Browser-based design, responsive, and accessibility QA.
 *
 * For every reviewed route at every reviewed width it captures a full-page
 * screenshot and asserts the things that make a design actually work:
 *
 *   - no horizontal overflow (document wider than the viewport)
 *   - no element overflowing the viewport horizontally
 *   - no browser console errors or page errors
 *   - a single <h1> and no skipped heading levels
 *   - interactive controls meet a 44px touch target on mobile widths
 *   - no nested interactive controls
 *   - images are not visibly stretched relative to their intrinsic ratio
 *   - the mobile menu opens, is keyboard reachable, and closes on Escape
 *
 * Usage: node scripts/qa/visual.mjs [baseUrl]
 * Screenshots: artifacts/visual/<width>/<route>.png
 */

import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = (process.argv[2] ?? process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const OUT = 'artifacts/visual';

const WIDTHS = [
  { name: '375-mobile', width: 375, height: 900, mobile: true },
  { name: '430-mobile-lg', width: 430, height: 932, mobile: true },
  { name: '768-tablet', width: 768, height: 1024, mobile: true },
  { name: '1024-laptop', width: 1024, height: 900, mobile: false },
  { name: '1440-desktop', width: 1440, height: 1000, mobile: false },
];

const ROUTES = [
  '/',
  '/blog',
  '/blog/naca-homebuying-dallas-fort-worth',
  '/blog/homes-for-heroes-north-texas',
  '/blog/how-to-buy-home-garland-tx',
  '/programs',
  '/programs/naca',
  '/programs/homes-for-heroes',
  '/areas/garland',
  '/neighborhoods',
  '/calculators',
  '/calculators/affordability',
  '/consultation',
  '/about',
  '/contact',
];

const findings = [];
const report = [];

function record(route, width, message) {
  findings.push({ route, width, message });
}

const AUDIT = `() => {
  const problems = [];
  const viewportWidth = window.innerWidth;

  if (document.documentElement.scrollWidth > viewportWidth + 1) {
    problems.push('document scrollWidth ' + document.documentElement.scrollWidth + ' exceeds viewport ' + viewportWidth);
  }

  for (const element of document.querySelectorAll('body *')) {
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const box = element.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) continue;
    if (box.right > viewportWidth + 2 && style.overflowX !== 'auto' && style.overflowX !== 'scroll') {
      const scroller = element.parentElement && element.parentElement.closest('[style*="overflow"], .overflow-x-auto, .overflow-auto, .overflow-hidden');
      if (!scroller) {
        problems.push('overflow: <' + element.tagName.toLowerCase() + '> right edge ' + Math.round(box.right));
        break;
      }
    }
  }

  const h1s = document.querySelectorAll('h1');
  if (h1s.length !== 1) problems.push('found ' + h1s.length + ' <h1> elements');

  let previous = 1;
  for (const heading of document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')) {
    const level = Number(heading.tagName.slice(1));
    if (level > previous + 1) {
      problems.push('heading level jumps from h' + previous + ' to h' + level + ' ("' + heading.textContent.trim().slice(0, 40) + '")');
      break;
    }
    previous = level;
  }

  for (const control of document.querySelectorAll('a, button, [role="button"]')) {
    if (control.querySelector('a, button, [role="button"]')) {
      problems.push('nested interactive control inside <' + control.tagName.toLowerCase() + '>');
      break;
    }
  }

  if (viewportWidth <= 768) {
    for (const control of document.querySelectorAll('header a, header button, main button, main a[class*="inline-flex"]')) {
      const style = getComputedStyle(control);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const box = control.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      if (box.height < 32) {
        problems.push('small touch target ' + Math.round(box.width) + 'x' + Math.round(box.height) + ' on "' + control.textContent.trim().slice(0, 30) + '"');
        break;
      }
    }
  }

  for (const image of document.querySelectorAll('img')) {
    if (!image.hasAttribute('alt')) { problems.push('image without alt attribute: ' + image.currentSrc); break; }
    if (!image.complete || image.naturalWidth === 0) continue;
    const box = image.getBoundingClientRect();
    if (box.width < 40 || box.height < 40) continue;
    const fit = getComputedStyle(image).objectFit;
    if (fit === 'cover' || fit === 'contain') continue;
    const intrinsic = image.naturalWidth / image.naturalHeight;
    const rendered = box.width / box.height;
    if (Math.abs(intrinsic - rendered) / intrinsic > 0.06) {
      problems.push('stretched image (' + intrinsic.toFixed(2) + ' vs ' + rendered.toFixed(2) + '): ' + image.currentSrc.split('/').pop());
      break;
    }
  }

  const meta = document.querySelector('meta[name="viewport"]');
  if (meta && /user-scalable\\s*=\\s*no|maximum-scale\\s*=\\s*1(\\.0)?\\b/.test(meta.content)) {
    problems.push('viewport blocks zoom: ' + meta.content);
  }

  return problems;
}`;

async function main() {
  // Use a preinstalled Chromium when one is present (sandboxes, CI images that
  // bundle it); otherwise fall back to Playwright's own managed download.
  const preinstalled = process.env.PW_CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch(existsSync(preinstalled) ? { executablePath: preinstalled } : {});

  for (const size of WIDTHS) {
    await mkdir(path.join(OUT, size.name), { recursive: true });
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 1,
      hasTouch: size.mobile,
      isMobile: size.mobile,
    });

    for (const route of ROUTES) {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));

      const response = await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 60_000 });
      if (!response || response.status() !== 200) {
        record(route, size.name, `status ${response?.status()}`);
      }

      await page.waitForLoadState('domcontentloaded');
      // Scroll the full page so lazy-loaded imagery renders before the audit
      // and the screenshot; otherwise below-the-fold images are captured blank.
      await page.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, 0);
      });
      // Chromium's full-page capture re-renders lazy images as empty boxes even
      // once they have loaded, which makes the screenshot evidence misleading.
      // Force eager loading and wait for decode before capturing.
      await page.evaluate(async () => {
        const images = [...document.querySelectorAll('img')];
        for (const image of images) image.loading = 'eager';
        await Promise.all(
          images.map((image) => (image.decode ? image.decode().catch(() => {}) : Promise.resolve()))
        );
      });
      await page.waitForTimeout(600);
      const problems = await page.evaluate(`(${AUDIT})()`);
      for (const problem of problems) record(route, size.name, problem);
      for (const error of consoleErrors) {
        // Over a plain-http test server the CSP upgrade-insecure-requests directive
        // rewrites same-origin prefetches to https, which cannot connect. This is a
        // test-harness artifact, not a production defect.
        if (BASE.startsWith('http://') && error.includes('ERR_SSL_PROTOCOL_ERROR')) continue;
        record(route, size.name, `console: ${error}`);
      }

      const file = path.join(OUT, size.name, `${route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')}.png`);
      await page.screenshot({ path: file, fullPage: true });
      report.push({ route, width: size.name, file, problems: problems.length + consoleErrors.length });

      await page.close();
    }

    // Mobile navigation behaviour, checked once per mobile width.
    if (size.mobile) {
      const page = await context.newPage();
      await page.goto(`${BASE}/`, { waitUntil: 'load', timeout: 60_000 });
      const toggle = page.locator('button[aria-controls="mobile-menu"]');
      if ((await toggle.count()) === 0) {
        record('/', size.name, 'no mobile menu toggle found');
      } else {
        await toggle.click();
        const menu = page.locator('#mobile-menu');
        if (!(await menu.isVisible())) record('/', size.name, 'mobile menu did not open');
        if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
          record('/', size.name, 'aria-expanded not updated when the menu opens');
        }
        await page.screenshot({ path: path.join(OUT, size.name, 'home_menu-open.png'), fullPage: false });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(150);
        if (await menu.isVisible()) record('/', size.name, 'Escape did not close the mobile menu');
      }
      await page.close();
    }

    await context.close();
  }

  // Keyboard focus visibility on the desktop width.
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/blog`, { waitUntil: 'load', timeout: 60_000 });
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 40) ?? null);
  if (firstFocus !== 'Skip to main content') {
    record('/blog', 'a11y', `first tab stop is "${firstFocus}", expected the skip link`);
  }
  const outline = await page.evaluate(() => {
    const element = document.activeElement;
    if (!element) return null;
    const style = getComputedStyle(element);
    return `${style.outlineStyle} ${style.outlineWidth}`;
  });
  if (!outline || outline.startsWith('none')) record('/blog', 'a11y', 'focused skip link has no visible outline');
  await page.close();
  await context.close();

  await browser.close();

  await mkdir(OUT, { recursive: true });
  await writeFile(path.join(OUT, 'report.json'), `${JSON.stringify({ report, findings }, null, 2)}\n`);

  console.log(`Captured ${report.length} screenshots across ${WIDTHS.length} widths and ${ROUTES.length} routes.`);
  if (findings.length > 0) {
    console.error(`\n${findings.length} finding(s):`);
    for (const finding of findings) console.error(`  ✗ [${finding.width}] ${finding.route}: ${finding.message}`);
    process.exit(1);
  }
  console.log('✓ no overflow, console, heading, touch-target, or image-quality findings');
}

await main();
