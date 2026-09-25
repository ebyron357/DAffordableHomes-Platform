import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('homepage ambient motion degrades to approved still photography', () => {
  const resolver = readFileSync('apps/web/lib/media/ambient-motion.ts', 'utf8');
  const component = readFileSync('apps/web/components/media/ambient-motion.tsx', 'utf8');
  const homepage = readFileSync('apps/web/components/home/controlled-home-sections.tsx', 'utf8');

  // Encodes are served same-origin so the existing CSP default-src 'self' keeps covering media.
  assert.match(resolver, /\/video\/home-neighborhood-1280\.(?:webm|mp4)/);
  assert.match(resolver, /\/video\/home-neighborhood-720\.(?:webm|mp4)/);
  assert.doesNotMatch(resolver, /https?:\/\//);
  assert.match(resolver, /existsSync/);

  // The approved photograph remains the poster and keeps the accessible name.
  assert.match(resolver, /black-family-home-pexels-7114188\.webp/);
  assert.match(component, /alt=\{asset\.label\}/);
  assert.match(homepage, /<AmbientMotion asset=\{resolveHomeNeighborhoodMotion\(\)\}/);
});

test('homepage ambient motion stays silent, decorative, and reduced-motion safe', () => {
  const component = readFileSync('apps/web/components/media/ambient-motion.tsx', 'utf8');
  const styles = readFileSync('apps/web/app/globals.css', 'utf8');

  for (const attribute of ['muted', 'loop', 'playsInline', 'preload="metadata"', 'aria-hidden="true"']) {
    assert.match(component, new RegExp(attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  // No audio and no player chrome: nothing can autoplay sound or take focus.
  assert.doesNotMatch(component, /^\s+controls\s*$/m);
  assert.doesNotMatch(component, /^\s+controls=/m);
  assert.match(component, /tabIndex=\{-1\}/);

  // Reduced motion removes the element outright rather than hiding a playing clip.
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /reducedMotion\s*\n?\s*\?\s*\[\]/);
  assert.match(styles, /\.ambient-motion-clip \{ display:none; \}/);

  // The clip is only requested once scrolled near, so it never competes with the hero.
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /nearViewport/);
});
