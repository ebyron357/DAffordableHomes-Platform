import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import test from "node:test"
import assert from "node:assert/strict"

const read = (file) => readFileSync(file, "utf8")
const APP = "apps/web/app"
const CSS = read("apps/web/app/globals.css")

/**
 * Interior visual-system contract.
 *
 * The previous gate was structural — status codes, landmarks, heading order —
 * and a site can pass all of it while every interior route is a white box
 * holding a heading, a paragraph and a button. That is precisely the state the
 * owner review found. These assertions describe the *composition*, so the next
 * regression toward a documentation layout fails the build instead of shipping.
 */

/** Every route a visitor is likely to land on from search or navigation. */
const PUBLIC_ROUTES = [
  "about",
  "areas",
  "areas/garland",
  "calculators",
  "consultation",
  "contact",
  "events",
  "faq",
  "first-time-buyers",
  "homes",
  "market-reports",
  "neighborhoods",
  "programs",
  "resources",
  "testimonials",
]

function pageSource(route) {
  return read(path.join(APP, route, "page.tsx"))
}

test("every public route opens on a painted brand masthead", () => {
  for (const route of PUBLIC_ROUTES) {
    const source = pageSource(route)
    assert.match(
      source,
      /<PageHeader/,
      `/${route} should use the shared masthead rather than a hand-rolled header`,
    )
    assert.doesNotMatch(
      source,
      /<section className="border-b border-border bg-card"/,
      `/${route} still carries the old near-white masthead`,
    )
  }
})

test("the masthead always has a second column, so no route opens half empty", () => {
  const header = read("apps/web/components/page/page-header.tsx")
  // Either an approved photograph or the brand's architectural linework.
  assert.match(header, /className="dh-masthead-aside"/)
  assert.match(header, /<BrandMotif variant=\{motif\}/)
  assert.match(header, /media \?/)
  assert.match(CSS, /\.dh-masthead-inner \{[^}]*grid-template-columns: minmax\(0, 1\.08fr\) minmax\(0, \.92fr\);/)
  // The ornament survives to phone widths rather than being hidden there.
  assert.doesNotMatch(CSS, /\.dh-masthead-aside \{ display: none; \}/)
})

test("the brand is painted across interior fields, not only declared", () => {
  const dh = CSS.slice(CSS.indexOf("Interior route visual system"))

  assert.match(dh, /--dh-navy: #102b4e;/)
  assert.match(dh, /--dh-teal: #077783;/)
  assert.match(dh, /--dh-teal-bright: #18a9b4;/)
  assert.match(dh, /--dh-green: #66ad45;/)
  assert.match(dh, /--dh-gold: #bf922d;/)
  assert.match(dh, /--dh-page: #f7f9f8;/)
  assert.match(dh, /--dh-alt: #edf3f2;/)

  // Each approved colour has to carry a field or a structural rule.
  assert.match(dh, /\.dh-band-navy \{ background: var\(--dh-navy\); color: #fff; \}/, "navy is a field")
  assert.match(dh, /\.dh-band-teal \{ background: var\(--dh-teal\); color: #fff; \}/, "teal is a field")
  assert.match(dh, /\.dh-band-alt \{ background: var\(--dh-alt\); \}/, "green-gray is a field")
  assert.match(dh, /\.dh-split-frame-green::before \{ background: var\(--dh-green\)/, "green backs a photograph")
  assert.match(dh, /\.dh-masthead \{[^}]*border-bottom: 4px solid var\(--dh-gold\);/, "gold rules the masthead")
  assert.match(dh, /\.dh-btn-gold \{ background: var\(--dh-gold\)/, "gold carries the primary CTA")
})

test("icons are wired to meaning, not scattered", () => {
  const editorial = read("apps/web/components/page/editorial.tsx")
  // A Feature cannot exist without an icon; the type makes it required.
  assert.match(editorial, /icon: ComponentType<\{ className\?: string \}>/)
  assert.doesNotMatch(editorial, /icon\?: ComponentType/)

  // Place pages carry a map pin, tools carry a calculator, purchases a key.
  assert.match(pageSource("areas"), /MapPin/)
  assert.match(pageSource("areas/garland"), /MapPin/)
  assert.match(pageSource("calculators"), /Calculator/)
  assert.match(pageSource("homes"), /Search/)
  assert.match(pageSource("first-time-buyers"), /KeyRound/)
})

test("the honest states are designed, not error boxes", () => {
  const homes = pageSource("homes")

  // The MLS truth is unchanged and still unconditional.
  assert.match(homes, /No MLS or IDX feed is connected to this site yet/)
  assert.match(homes, /approved MLS or IDX provider/)
  // But it is now a status strip inside a composition, with real next steps.
  assert.match(homes, /<StatusStrip/)
  assert.match(homes, /<Split/)
  assert.match(homes, /Ask Debra what&apos;s on the market/)
  // And no fabricated inventory has crept in behind it.
  assert.doesNotMatch(homes, /\[Price/)
  assert.doesNotMatch(homes, /\[Property Address/)
  assert.match(homes, /result\.status === "connected"/, "prices only render from a live feed")

  // Same treatment wherever the site has to say something is not ready.
  for (const route of ["testimonials", "market-reports", "events"]) {
    assert.match(pageSource(route), /<StatusStrip/, `/${route} should use the designed status strip`)
  }
})

test("public pages do not expose internal product language", () => {
  // Real decisions, but decisions about the site. A visitor reading about
  // buying a house should never be shown the content strategy behind it.
  const forbidden = [
    "doorway pages",
    "local-content focus",
    "visual direction",
    "answer engines",
    "require verification and original content",
    "The architecture intentionally",
  ]

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      if (!entry.endsWith(".tsx")) continue
      const source = read(full)
      for (const phrase of forbidden) {
        assert.ok(!source.includes(phrase), `${full} exposes internal language: "${phrase}"`)
      }
    }
  }
  walk(APP)
})

test("the campaign landing page uses the approved palette", () => {
  // /start shipped with its own navy, gold, turquoise and a warm beige. It was
  // coherent and it belonged to no brand in particular.
  assert.match(CSS, /\.dah-landing \{ --dah-navy:#102B4E; --dah-gold:#BF922D; --dah-turquoise:#18A9B4; --dah-cream:#EDF3F2;/)
  assert.doesNotMatch(CSS, /#0B1F33/, "the divergent navy is gone")
  assert.doesNotMatch(CSS, /#C9A227/, "the divergent gold is gone")
  assert.doesNotMatch(CSS, /#F7F2E8/, "the beige is gone")
  assert.doesNotMatch(CSS, /rgba\(11,31,51/, "the divergent navy scrim is gone")
})

test("approved crop rules survive on every Debra placement", () => {
  // Every placement composes from the register module rather than typing an
  // objectPosition by hand. That is what stopped the same photograph having one
  // safe crop on one route and a clipped one on fourteen others.
  const register = read("apps/web/lib/content/imagery.ts")
  assert.match(register, /HERO_FAMILY[\s\S]{0,400}objectPosition: "52% center"/)
  assert.match(register, /DEBRA_PORTRAIT[\s\S]{0,500}objectPosition: "48% center"/)
  assert.match(register, /DEBRA_DESK: ApprovedImage[\s\S]{0,240}objectPosition: "50% 30%"/)
  assert.match(register, /DEBRA_DESK_MASTHEAD[\s\S]{0,240}objectPosition: "50% 22%"/)
  assert.match(register, /DEBRA_DESK_BAND[\s\S]{0,240}objectPosition: "50% 14%"/)
  assert.match(register, /DEBRA_LIFESTYLE[\s\S]{0,320}objectPosition: "center 30%"/)

  for (const [route, symbol] of [
    ["about", "DEBRA_PORTRAIT"],
    ["contact", "DEBRA_PORTRAIT"],
    ["programs", "DEBRA_PORTRAIT"],
    ["first-time-buyers", "DEBRA_PORTRAIT"],
    ["consultation", "DEBRA_DESK_MASTHEAD"],
    ["areas", "DEBRA_LIFESTYLE"],
  ]) {
    const source = pageSource(route)
    assert.match(source, new RegExp(`\\.\\.\\.${symbol},`), `/${route} should spread ${symbol}`)
    assert.doesNotMatch(
      source,
      /objectPosition: "/,
      `/${route} should not hand-type a crop rule`,
    )
  }

  // The full-bleed closing band takes the band crop on every route that has one.
  for (const route of ["about", "areas", "areas/garland", "calculators", "faq", "homes", "resources"]) {
    assert.match(pageSource(route), /image=\{CLOSING_BAND_IMAGE\}/, `/${route} closing band`)
  }
  assert.match(read("apps/web/components/home/figma-home-page.tsx"), /const DEBRA_DESK = DEBRA_DESK_BAND/)
})

test("motion is restrained and respects prefers-reduced-motion", () => {
  const reduced = CSS.slice(CSS.indexOf("Interior route visual system"))
  assert.match(reduced, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.dh-split-media:hover \.dh-split-figure img/)
  assert.match(reduced, /\.dh-feature-card:hover,/)
  assert.match(reduced, /\.dh-place-feature:hover \{ transform: none; \}/)
  // The homepage pathway ornament moves on hover, so it opts out too.
  assert.match(CSS, /\.fh-path:hover \.fh-path-art,/)
})
