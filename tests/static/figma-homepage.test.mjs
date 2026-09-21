import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Homepage regression tests.
 *
 * The previous version of this file asserted that the placeholder strings were
 * *present* — `assert.match(home, /\[Price Placeholder\]/)`. That is why a full
 * audit could pass while the homepage visibly shipped bracketed placeholder
 * copy: the gate was pinning the defect in place. These assertions are the
 * inverse, and the browser-level checks in `scripts/qa/site-audit.mjs` cover
 * what a static read cannot — that the approved images actually decode.
 */

const read = (file) => readFileSync(file, "utf8");

const HOME_SOURCES = [
  "apps/web/components/home/figma-home-page.tsx",
  "apps/web/components/home/figma-home-footer.tsx",
  "apps/web/components/home/figma-home-header.tsx",
  "apps/web/lib/figma-home.ts",
];

/** Every placeholder string the corrected homepage must never reintroduce. */
const FORBIDDEN_PLACEHOLDERS = [
  "[Price Placeholder]",
  "[Property Address Placeholder]",
  "Portrait Placeholder",
  "Photography Placeholder",
  "Neighborhood Image Placeholder",
  "[Phone Placeholder]",
  "[Email Placeholder]",
  "[Address Placeholder",
  "[City, TX]",
  "[X] Beds",
  "[Y] Baths",
  "[Sq Ft]",
  "Active MLS Feed Integration Point",
];

test("no homepage source carries visible placeholder copy", () => {
  for (const file of HOME_SOURCES) {
    const source = read(file);
    for (const needle of FORBIDDEN_PLACEHOLDERS) {
      assert.ok(
        !source.includes(needle),
        `${file} still contains the placeholder ${JSON.stringify(needle)}`,
      );
    }
    // Catches new bracketed placeholders nobody has thought of yet, while
    // allowing ordinary bracketed JSX/TS syntax.
    const bracketed = source.match(/\[[A-Z][^\]\n]{4,60}(Placeholder|TBD|TODO)[^\]\n]*\]/g);
    assert.equal(bracketed, null, `${file} has bracketed placeholder copy: ${bracketed}`);
  }
});

test("the homepage renders the approved hero and portrait assets", () => {
  const home = read("apps/web/components/home/figma-home-page.tsx");

  // Approved, registered assets — see docs/05-content/IMAGE_ASSET_REGISTER.md.
  assert.match(home, /\/images\/black-family-home-pexels-7114188\.webp/);
  assert.match(home, /\/images\/debra-allen-primary-about\.webp/);
  // Real <Image> elements, not a labelled empty well.
  assert.match(home, /import Image from "next\/image"/);
  // Alt text is the register's wording, not a filename.
  assert.match(home, /A Black family of five holding hands together in a bright living room/);
  assert.match(home, /Debra Allen smiling in a yellow blazer at a kitchen counter/);
  // The register's crop rule for Debra keeps her face inside the frame.
  assert.match(home, /objectPosition: "48% center"/);
});

test("the listings band never fabricates a listing", () => {
  const home = read("apps/web/components/home/figma-home-page.tsx");

  // No listing-shaped card is rendered unless the provider returned listings.
  assert.doesNotMatch(home, /ListingPlaceholderCard/);
  assert.match(home, /ListingsEmptyState/);
  // The empty state states the situation and offers a real next action.
  assert.match(home, /No live MLS feed is connected to this site yet/);
  assert.match(home, /listings\.status === "connected"/);
});

test("the market section carries no unlicensed image wells", () => {
  const map = read("apps/web/lib/figma-home.ts");
  const css = read("apps/web/app/globals.css");

  assert.doesNotMatch(map, /well:/);
  assert.doesNotMatch(css, /\.fh-city-well/);
  assert.doesNotMatch(css, /\.fh-placeholder/);
  // County context is a verifiable civic fact, unlike a market statistic.
  assert.match(map, /county: "Dallas County"/);
});

test("the header uses the approved logo, unstretched and uncropped", () => {
  const header = read("apps/web/components/home/figma-home-header.tsx");
  const css = read("apps/web/app/globals.css");

  assert.match(header, /\/images\/daffordable-homes-official-logo\.png/);
  assert.match(header, /width=\{640\}/);
  assert.match(header, /height=\{427\}/);
  assert.doesNotMatch(header, /fh-wordmark/);
  // The retired Manus glyph must never come back.
  assert.doesNotMatch(header, /dah-logo_ff042b7b/);
  // Fixed height + auto width is what prevents stretching.
  assert.match(css, /\.fh-logo \{[^}]*height: 74px;[^}]*width: auto;/);
  // No plate, border or background behind the mark in the header.
  assert.doesNotMatch(css, /\.fh-logo \{[^}]*background:/);
});

test("the homepage uses the approved brand palette", () => {
  const css = read("apps/web/app/globals.css");

  for (const token of ["#102b4e", "#077783", "#18a9b4", "#66ad45", "#bf922d", "#f7f9f8", "#edf3f2"]) {
    assert.ok(css.includes(token), `globals.css is missing the brand colour ${token}`);
  }
  // The parallel Figma screen palette is retired so there is one system.
  assert.ok(!css.includes("--fh-page: #faf7f2"), "the warm-cream page token is still in use");
});

test("the homepage footer keeps compliance reachable and subordinate", () => {
  const footer = read("apps/web/components/home/figma-home-footer.tsx");
  const map = read("apps/web/lib/figma-home.ts");
  const css = read("apps/web/app/globals.css");

  // Texas practice requires both TREC notices to be reachable.
  assert.match(map, /information-about-brokerage-services-form/);
  assert.match(map, /forms\/consumer-protection-notice/);
  // They live in the small compliance row, not a navigation column.
  assert.match(footer, /className="fh-footer-legal"/);
  assert.match(css, /\.fh-footer-legal a \{[^}]*font-size: 12px;/);
  // Vendor credit survives the recomposition.
  assert.match(footer, /CLIENTVERSE\.attributionText/);
  assert.match(footer, /new Date\(\)\.getFullYear\(\)/);
  // The logo sits on a light band rather than a white card on navy.
  assert.match(css, /\.fh-footer-brand-band \{[^}]*background: var\(--fh-white\);/);
  assert.doesNotMatch(css, /\.fh-footer-logo \{[^}]*background:/);
});

test("the page still wires the honest listings provider and the Figma composition", () => {
  const page = read("apps/web/app/page.tsx");
  const home = read("apps/web/components/home/figma-home-page.tsx");
  const css = read("apps/web/app/globals.css");

  assert.match(page, /FigmaHomePage/);
  assert.match(page, /searchListings/);
  assert.match(home, /Professional representation\. Trusted guidance for your next move/);
  assert.match(home, /Meet Debra Allen/);
  assert.doesNotMatch(home, /Studio Clarity/);
  assert.doesNotMatch(home, /NC &amp; SC|North Carolina|South Carolina/);
  // Figma frame geometry is retained.
  assert.match(css, /width: 1440px/);
  assert.match(css, /height: 680px/);
});
