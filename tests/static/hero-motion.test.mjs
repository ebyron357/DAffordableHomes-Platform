import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Hero exterior slot.
 *
 * `.fh-hero-media` draws the brand roofline because no cleared North Texas
 * exterior exists in the repository. These assertions cover the seam that
 * prepares the slot for one: the drawing has to survive an absent asset, the
 * clip has to stay opt-in and decorative, and nothing may be committed as a
 * stand-in for the photograph that is still missing.
 */

const read = (file) => readFileSync(file, "utf8");

const HERO = "apps/web/components/home/figma-home-page.tsx";
const RESOLVER = "apps/web/lib/media/ambient-motion.ts";
const COMPONENT = "apps/web/components/media/ambient-motion.tsx";
const STYLES = "apps/web/app/globals.css";

test("the drawn hero scene survives an unfilled exterior slot", () => {
  const hero = read(HERO);
  const resolver = read(RESOLVER);

  // The scene is rendered unconditionally; only the exterior is conditional.
  assert.match(hero, /<div className="fh-hero-scene" aria-hidden="true">/);
  assert.match(hero, /fh-hero-roofs-far/);
  assert.match(hero, /fh-hero-roofs-near/);
  assert.match(hero, /\{heroMotion \? <AmbientMotion/);

  // The still is the hero image, and on mobile `.fh-hero-media { order: -1 }`
  // puts it above the copy, so it is the LCP element and must not be lazy.
  assert.match(hero, /<AmbientMotion[^>]*priority[^>]*\/>/);
  assert.match(read(STYLES), /\.fh-hero-media \{ order: -1;/);

  // No still approved means no asset, which is what leaves the drawing alone.
  assert.match(resolver, /if \(!present\(HERO_NORTH_TEXAS_EXTERIOR\.poster\)\) return null/);
  assert.match(resolver, /existsSync/);
});

test("no stand-in media is committed for the missing exterior", () => {
  const resolver = read(RESOLVER);
  const referenced = [...resolver.matchAll(/"(\/(?:images|video)\/hero-north-texas-exterior[^"]*)"/g)].map(
    (match) => match[1]
  );

  assert.ok(referenced.length > 0, "the resolver should name the files the slot expects");
  for (const path of referenced) {
    assert.equal(
      existsSync(`apps/web/public${path}`),
      false,
      `${path} exists; a real asset needs a register row and this assertion updated`
    );
  }

  // Nothing may be hotlinked either: the CSP declares no media-src, so media
  // falls back to default-src 'self'.
  assert.doesNotMatch(resolver, /https?:\/\//);

  const videoDir = "apps/web/public/video";
  if (existsSync(videoDir)) {
    assert.deepEqual(readdirSync(videoDir), [], "public/video should hold no uncleared encodes");
  }
});

test("hero motion is opt-in, silent, and reduced-motion safe", () => {
  const component = read(COMPONENT);
  const styles = read(STYLES);

  for (const attribute of ["muted", "loop", "playsInline", 'preload="metadata"', 'aria-hidden="true"']) {
    assert.match(component, new RegExp(attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(component, /^\s+controls\s*$/m);
  assert.doesNotMatch(component, /^\s+controls=/m);
  assert.match(component, /tabIndex=\{-1\}/);

  // AGENTS.md and the publishing standard both bar autoplay motion, so the clip
  // is not mounted — and nothing is fetched — until the visitor asks for it.
  assert.match(component, /\{started && sources\.length > 0 \?/);
  assert.match(component, /className="ambient-motion-toggle"/);
  assert.match(component, /aria-pressed=\{playing\}/);

  // Reduced motion leaves no sources, so neither the clip nor its control is offered.
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /reducedMotion\s*\n?\s*\?\s*\[\]/);
  assert.match(component, /alt=\{asset\.label\}/);

  // The added rules stay inside this slot.
  for (const rule of [
    ".fh-hero-media .ambient-motion {",
    ".fh-hero-media .ambient-motion-clip {",
    ".fh-hero-media .ambient-motion-toggle {",
    ".fh-hero-media .ambient-motion-clip { display: none; }",
  ]) {
    assert.ok(styles.includes(rule), `globals.css should scope "${rule}" to the hero slot`);
  }
});
