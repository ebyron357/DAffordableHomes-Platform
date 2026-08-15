import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const requiredProgramFiles = [
  'apps/web/app/programs/page.tsx',
  'apps/web/app/programs/naca/page.tsx',
  'apps/web/app/programs/homes-for-heroes/page.tsx',
  'apps/web/app/areas/page.tsx',
  'apps/web/app/areas/garland/page.tsx',
  'apps/web/app/api/leads/program/route.ts',
  'apps/web/components/programs/program-page.tsx',
  'apps/web/components/programs/program-lead-form.tsx',
  'apps/web/lib/local-market.ts',
  'apps/web/lib/programs.ts',
  'apps/web/app/sitemap.ts',
  'apps/web/app/robots.ts',
];

test('program and local-search architecture exists', () => {
  for (const file of requiredProgramFiles) {
    assert.equal(existsSync(file), true, `${file} should exist`);
  }
});

test('program values and lead-source labels remain normalized', () => {
  const programs = readFileSync('apps/web/lib/programs.ts', 'utf8');
  const endpoint = readFileSync('apps/web/app/api/leads/program/route.ts', 'utf8');
  const form = readFileSync('apps/web/components/programs/program-lead-form.tsx', 'utf8');

  assert.match(programs, /type ProgramSlug = "naca" \| "homes-for-heroes"/);
  assert.match(programs, /NACA Landing Page/);
  assert.match(programs, /Homes for Heroes Landing Page/);
  assert.match(endpoint, /PROGRAM_LEAD_WEBHOOK_URL/);
  assert.match(endpoint, /GHL_PROGRAM_LEAD_WEBHOOK_URL/);
  assert.match(form, /program === "naca" \? "buying"/);
  assert.match(form, /utm_source/);
  assert.match(form, /utm_medium/);
  assert.match(form, /utm_campaign/);
  assert.match(form, /utm_content/);
  assert.match(form, /utm_term/);
  assert.match(form, /document\.referrer/);
  assert.match(form, /consent/);
});

test('unverified service areas remain guarded', () => {
  const market = readFileSync('apps/web/lib/local-market.ts', 'utf8');
  const site = readFileSync('apps/web/lib/site.ts', 'utf8');
  const programPage = readFileSync('apps/web/components/programs/program-page.tsx', 'utf8');

  assert.match(market, /verifiedServiceAreas: \[\]/);
  assert.match(site, /serviceAreas: \[\]/);
  assert.match(programPage, /verifiedAreaServedSchema/);
  assert.match(programPage, /serviceAreaStatus/);
});

test('program pages avoid unsupported outcome and affiliation claims', () => {
  const content = readFileSync('apps/web/lib/programs.ts', 'utf8');
  assert.doesNotMatch(content, /number one|best agent|guaranteed savings|guaranteed approval/i);
  assert.match(content, /independent from NACA/i);
  assert.match(content, /does not claim affiliation/i);
});

test('navigation, homepage, redirect, sitemap, and robots integrate the new routes', () => {
  const navigation = readFileSync('apps/web/lib/navigation.ts', 'utf8');
  const homepage = readFileSync('apps/web/components/home/controlled-home-sections.tsx', 'utf8');
  const nextConfig = readFileSync('apps/web/next.config.mjs', 'utf8');
  const sitemap = readFileSync('apps/web/app/sitemap.ts', 'utf8');
  const robots = readFileSync('apps/web/app/robots.ts', 'utf8');

  assert.match(navigation, /label: "Programs", href: "\/programs"/);
  assert.match(homepage, /Homebuyer programs/);
  assert.match(homepage, /\/programs\/naca/);
  assert.match(homepage, /\/programs\/homes-for-heroes/);
  // /naca is a configuration-level 308 so crawlers see a real redirect status.
  assert.match(nextConfig, /source: '\/naca', destination: '\/programs\/naca', permanent: true/);
  assert.match(sitemap, /\/areas\/garland/);
  assert.match(sitemap, /\/programs\/homes-for-heroes/);
  assert.match(robots, /sitemap\.xml/);
});
