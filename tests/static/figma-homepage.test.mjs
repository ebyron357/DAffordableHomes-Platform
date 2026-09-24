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
  // Hero: the brand roofline at streetscape scale, drawn rather than a
  // photograph of an interior, which is the wrong subject for this slot.
  assert.match(home, /fh-hero-roofs-near/);
  assert.match(home, /fh-hero-roofs-far/);
  assert.doesNotMatch(home, /black-family-home-pexels-7114188\.webp/);
  assert.match(home, /\/images\/debra-allen-primary-about\.webp/);
  // Real <Image> elements, not a labelled empty well.
  assert.match(home, /import Image from "next\/image"/);
  // Alt text is the register's wording, not a filename. The hero scene is
  // drawn and `aria-hidden`, so it has no alt text to check — only Debra's
  // photograph remains on this page.
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
  // The mark is an opaque PNG, so it will always sit on white. Making the
  // whole band white to hide that produced the "logo pasted on a blank card"
  // read; the band is now the brand's green-gray and the plate is designed.
  assert.match(css, /\.fh-footer-brand-band \{[^}]*background: var\(--fh-alt\);/);
  assert.match(css, /\.fh-footer-logo-plate \{[^}]*border-bottom: 4px solid var\(--fh-gold\);/);
  assert.match(footer, /className="fh-footer-logo-plate"/);
  assert.doesNotMatch(css, /\.fh-footer-logo \{[^}]*background:/);
  // Three columns, so the band has no empty middle to notice.
  assert.match(css, /\.fh-footer-brand-inner \{[^}]*grid-template-columns: minmax\(0, 1\.15fr\) minmax\(0, \.85fr\) minmax\(0, \.9fr\);/);
  assert.match(footer, /className="footer-local"/);
});

test("the page still wires the honest listings provider and the brand composition", () => {
  const page = readFileSync("apps/web/app/page.tsx", "utf8");
  const home = readFileSync("apps/web/components/home/figma-home-page.tsx", "utf8");
  const css = readFileSync("apps/web/app/globals.css", "utf8");

  assert.match(page, /FigmaHomePage/);
  assert.match(page, /searchListings/);
  // Hero headline, Debra's section and the market section are the three
  // narrative anchors the homepage is not allowed to lose.
  assert.match(home, /Buying a home in <em>Dallas–Fort Worth<\/em>, with someone who explains it\./);
  assert.match(home, /Guidance first\. Pressure never\./);
  assert.match(home, /Debra Allen, REALTOR®/);
  assert.doesNotMatch(home, /Studio Clarity/);
  assert.doesNotMatch(home, /NC &amp; SC|North Carolina|South Carolina/);
  // The 1440 content lock from the Figma frame is retained.
  assert.match(css, /width: 1440px/);
});

test("the brand is painted, not merely declared", () => {
  const css = readFileSync("apps/web/app/globals.css", "utf8");

  // A painted-area audit of the previous build measured teal, bright teal,
  // green and gold at zero painted area anywhere on the homepage: every one
  // existed only as a text or border value. These assert each brand colour is
  // used as a *field* or a structural rule somewhere in the homepage block,
  // which is the difference between declaring the palette and showing it.
  const fh = css.slice(css.indexOf("/* ====="), css.indexOf("/* Find Your Next Step"));

  assert.match(fh, /\.fh-hero \{[^}]*background: var\(--fh-navy\)/, "hero is a navy field");
  assert.match(fh, /\.fh-trust \{[^}]*background: var\(--fh-teal\)/, "trust band is a teal field");
  // Layered fields, not flat rectangles: base brand colour plus a wash.
  assert.match(fh, /\.fh-path-buy \{ background: linear-gradient\(.*var\(--fh-teal\)/, "buyer path is a teal field");
  assert.match(fh, /\.fh-path-sell \{ background: linear-gradient\(.*var\(--fh-navy\)/, "seller path is a navy field");
  assert.match(fh, /\.fh-meet \{ background: var\(--fh-navy\); \}/, "Debra sits on a navy field");
  assert.match(fh, /\.fh-markets \{ background: var\(--fh-navy-deep\); \}/, "markets is a navy field");
  assert.match(fh, /\.fh-market-feature \{[^}]*background: var\(--fh-teal\)/, "home market is a teal field");
  // Green and gold are structural rules rather than fields, per the brand doc.
  assert.match(fh, /border-bottom: 4px solid var\(--fh-green\)/, "green carries a structural rule");
  assert.match(fh, /border-top: 4px solid var\(--fh-green\)/, "green marks the seller pathway");
  assert.match(fh, /border-bottom: 3px solid var\(--fh-gold\)/, "gold carries a divider");
  assert.match(fh, /\.fh-btn-gold \{ background: var\(--fh-gold\)/, "gold carries the primary CTA on dark");
  assert.match(fh, /--fh-teal-bright: #18a9b4/);

  // The Buy/Sell pathways carry icons, highlights and ornament — not an
  // index number over a paragraph over a button, which is the dashboard
  // composition the owner review rejected.
  const home = readFileSync("apps/web/components/home/figma-home-page.tsx", "utf8");
  assert.doesNotMatch(home, /fh-path-index/, "the 01/02 numbering is gone");
  assert.doesNotMatch(fh, /\.fh-path-index/, "no orphaned numbering style");
  assert.match(home, /FIGMA_PATHWAY_HIGHLIGHTS\.buy/);
  assert.match(home, /FIGMA_PATHWAY_HIGHLIGHTS\.sell/);
  assert.match(home, /<KeyRound aria-hidden="true" \/>/, "the buy path is icon-led");
  assert.match(home, /BrandMotif variant="keys"/, "the buy path carries ornament");
  assert.match(home, /BrandMotif variant="route"/, "the sell path carries ornament");
});

test("the hero is one full-bleed composition, not a boxed column beside a picture", () => {
  const home = readFileSync("apps/web/components/home/figma-home-page.tsx", "utf8");
  const css = readFileSync("apps/web/app/globals.css", "utf8");

  // No page-width lock: on a wide monitor the old `.figma-home { width: 1440px }`
  // boxed the whole site inside near-white margins and the hero read as a card
  // floating in empty space. Only the content shell holds the 1440 line.
  assert.doesNotMatch(css, /\.figma-home \{ width: 1440px; margin-inline: auto; \}/);
  assert.match(css, /\.fh-shell \{[^}]*max-width: 1440px;/);

  // Four-track hero grid: gutter, copy, photograph, gutter — the photograph
  // spans into the right gutter so it bleeds to the viewport edge.
  assert.match(css, /\.fh-hero \{[^}]*grid-template-columns: minmax\(24px, 1fr\) minmax\(0, 564px\) minmax\(0, 692px\) minmax\(24px, 1fr\);/);
  assert.match(css, /\.fh-hero-media \{ grid-column: 3 \/ 5;/);
  // The seam is blended, not cut, and the wash never covers the subject.
  assert.match(css, /\.fh-hero-media::before \{[^}]*width: 180px;/);

  // The first viewport names the person: Debra's byline with the approved
  // portrait at the register's crop rule.
  assert.match(home, /className="fh-hero-byline"/);
  assert.match(home, /className="fh-hero-byline-portrait"/);
  assert.match(home, /<strong>Debra Allen, REALTOR®<\/strong>/);

  // The seam panel is a real entry to the quiz, and it is positioned from the
  // section's own width so it stays on the seam at every viewport.
  assert.match(home, /<Link href="#find-your-path" className="fh-hero-path">/);
  assert.match(css, /\.fh-hero-path \{[^}]*left: calc\(max\(24px, \(100% - 1256px\) \/ 2\) \+ 476px\);/);

  // The split holds at laptop widths; stacking starts under 900px. A 1024px
  // viewport used to put every word of hero copy below the fold.
  const laptop = css.slice(css.indexOf("@media (min-width: 900px) and (max-width: 1100px) {\n  .fh-hero-inner"), css.indexOf("@media (min-width: 1440px)"));
  assert.match(laptop, /\.fh-hero-copy h1 \{ font-size: clamp\(34px/);
  const stackedStart = css.indexOf("@media (max-width: 899px)");
  const stacked = css.slice(stackedStart, css.indexOf("@media (max-width: 760px)", stackedStart));
  assert.match(stacked, /\.fh-hero \{ grid-template-columns: 1fr; \}/);
  assert.match(stacked, /\.fh-hero-path \{\s*position: static;/);

  // Section order tells the story in sequence: the practice, the person, then
  // where the visitor fits — and the quiz's light field separates the two navy ones.
  const order = ["<Hero />", "<TrustBand />", "<Pathways />", "<MeetDebra />", "<FindYourPath />", "<Markets />", "<FeaturedListings", "<GuidanceSplit />", "<KnowledgeBase", "<FinalCta />"];
  let cursor = -1;
  for (const marker of order) {
    const next = home.indexOf(marker, cursor + 1);
    assert.ok(next > cursor, `${marker} should follow the previous section`);
    cursor = next;
  }

  // The planning index is an editorial list under a gold rule, not five
  // identical white cards.
  assert.match(css, /\.fh-knowledge-grid \{[^}]*border-top: 2px solid var\(--fh-gold\);/);
  assert.doesNotMatch(css, /\.fh-knowledge-card \{[^}]*border-radius: 10px;/);
});

test("interior routes carry the brand too", () => {
  const header = readFileSync("apps/web/components/page/page-header.tsx", "utf8");
  const blog = readFileSync("apps/web/app/blog/page.tsx", "utf8");
  const article = readFileSync("apps/web/components/blog/article-header.tsx", "utf8");
  const calculators = readFileSync("apps/web/app/calculators/page.tsx", "utf8");
  const css = readFileSync("apps/web/app/globals.css", "utf8");

  // The shared masthead is navy by default, which brands every interior route
  // that uses it rather than leaving them near-white end to end.
  assert.match(header, /tone = "navy"/);
  assert.match(header, /dh-masthead-navy/);
  assert.match(css, /\.dh-masthead-navy \{ background: var\(--dh-navy\); color: #fff; \}/);
  assert.match(css, /\.dh-masthead \{[^}]*border-bottom: 4px solid var\(--dh-gold\);/);
  assert.match(blog, /border-b-4 border-brand-gold bg-primary/);
  assert.match(article, /border-b-4 border-brand-gold bg-primary/);
  // The calculators index is composed from the branded system, so it inherits
  // the masthead rather than hand-rolling one.
  assert.match(calculators, /<PageHeader/);
  assert.match(calculators, /dh-btn dh-btn-gold/);
  // The resources action block is a teal field, not a near-white tool list.
  assert.match(css, /\.resource-steps \{[^}]*background: var\(--color-accent\)/);

  // Eyebrow colour is chosen with a tone, because `cn` is a plain joiner and a
  // colour passed via className does not override the base one.
  const eyebrow = readFileSync("apps/web/components/ui/eyebrow.tsx", "utf8");
  assert.match(eyebrow, /tone = "accent"/);
  assert.match(eyebrow, /gold: "text-\[#e6bd55\]"/);
});
