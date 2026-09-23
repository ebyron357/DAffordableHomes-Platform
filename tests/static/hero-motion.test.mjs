import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Hero exterior slot.
 *
 * `.fh-hero-media` keeps the brand roofline as a fallback and now carries an
 * owner-approved generated exterior still. These assertions cover the seam:
 * the drawing must survive if the still is ever absent, the approved still must
 * be registered, and optional motion must remain opt-in and decorative.
 */

const read = (file) => readFileSync(file, "utf8");

const HERO = "apps/web/components/home/figma-home-page.tsx";
const RESOLVER = "apps/web/lib/media/ambient-motion.ts";
const COMPONENT = "apps/web/components/media/ambient-motion.tsx";
const STYLES = "apps/web/app/globals.css";
const REGISTER = "docs/05-content/IMAGE_ASSET_REGISTER.md";

test("the drawn hero scene remains a safe fallback behind the approved exterior", () => {
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

  // The fallback contract remains: removing the still restores the drawing.
  assert.match(resolver, /if \(!present\(HERO_NORTH_TEXAS_EXTERIOR\.poster\)\) return null/);
  assert.match(resolver, /existsSync/);
});

test("the approved hero still is committed and registered; motion encodes remain absent", () => {
  const resolver = read(RESOLVER);
  const register = read(REGISTER);

  assert.equal(
    existsSync("apps/web/public/images/hero-north-texas-exterior.webp"),
    true,
    "the approved hero still should be committed"
  );
  assert.match(register, /9VO_H8Qh26Hg90ZLIvsSd\.jpg/);
  assert.match(register, /hero-north-texas-exterior\.webp/);
  assert.match(register, /Gamma AI generation/);

  // Nothing may be hotlinked: the CSP declares no media-src, so media falls
  // back to default-src 'self'. Optional video encodes are not approved yet.
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
