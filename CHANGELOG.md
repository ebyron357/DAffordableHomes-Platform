# Changelog

All notable repository changes are documented here.

## 2026-09-22

### Homepage hero exterior

- The hero's exterior slot is wired end to end: `lib/media/ambient-motion.ts`
  resolves the still at build time, `components/media/ambient-motion.tsx`
  renders it, and the drawn brand streetscape stays beneath it as the fallback —
  removing the file restores the drawing with no code change.
- The owner's approved generated still (`hero-north-texas-exterior.webp`, from
  `9VO_H8Qh26Hg90ZLIvsSd.jpg` in Gamma) is registered in
  `docs/05-content/IMAGE_ASSET_REGISTER.md`, which states plainly that it is not
  evidence of a real listing, transaction, client property, address or verified
  neighbourhood, and now also carries its measured responsive framing and the
  one region that does not survive magnification.
- `qa:audit` requires the still to render on `/`, so the file going missing is
  reported rather than silently falling back to the drawing.
- Motion for the slot is prepared but unfilled, and never autoplays: with the
  still alone the page mounts no `<video>`, issues no media request and offers
  no control, at every viewport and under `prefers-reduced-motion`.

## 2026-09-21

### Homepage quiz

- "Find Your Homebuying Path": five or six questions branched on the visitor's goal (goal, DFW area, timeline, buyer or seller position, Homes for Heroes group), with a progress indicator, keyboard-operable radio choices and focus-managed steps. The result is one of eight paths (First-Time Buyer, North Texas Hero, Moving to DFW, Selling a Home, Selling and Buying, Ready to Search, Early-Stage Researcher, Not Sure Yet) with a "Your next move" heading, an explanation written from the answers, a next step, an existing resource, a primary CTA and an optional consultation. No contact details are collected. It replaces the interim homepage entry to the `/start` assessment.
- Homepage copy: services, buyer and seller strategy points, knowledge cards and three section headings rewritten as specific Dallas–Fort Worth language; the claim of a "real-time MLS search" that the site does not have is gone.
- The guided-quiz state machine is shared (`useGuidedQuiz`) by the homepage quiz and the interior Find Your Next Step check; funnel events flow through the existing analytics seam.

### Homepage hero

- The hero no longer carries a photograph of a living-room interior. It draws the subject instead: the brand roofline at streetscape scale over a dusk sky with a warm horizon, a set-back range of roofs for depth, and one lit window. Ornament, `aria-hidden`, depicting no particular place. The licensed Pexels interior stays in the repository and in use elsewhere; a photograph can replace the drawing by restoring an `<Image>` in `.fh-hero-media`.

### Homepage visual review

- The "Find your homebuying path" section asked the same question twice, side by side: the section heading "Not sure what your next move in DFW should be?" and, an inch to its right, the panel title "What should your next move in Dallas–Fort Worth be?". The panel now says what the visitor is about to do instead of restating the question, and the question count and duration are stated once, in the list on the left, rather than three times across the section.

### Guide-card imagery and the unregistered-photograph audit

- `featuredImage` is optional end to end (shared type, Sanity schema, blog index, article masthead, related cards, Open Graph and Article JSON-LD). An article without one renders `ArticlePlate` — brand field, architectural linework, the article's own category — and publishes no image property rather than asserting that an unrelated photograph depicts its subject. Setting the field in Sanity restores a photograph everywhere with no code change.
- The Homes for Heroes and Garland guides no longer carry Debra Allen's portrait as their card, masthead or body image.
- Three images are off every route and barred in the audit's retired list: a generated portrait of a woman who is not Debra, published on `/start` as though she were; a generated office scene carrying an invented agency logo and tagline; and a north-eastern US streetscape that `/neighborhoods` captioned "North Texas". The `/start` panel now shows Debra's own registered photograph at the register's upright-frame crop. The files stay in the repository.
- Fixed `.dah-landing-image-frame-portrait` resolving to 0px wide: `margin-inline:auto` cancels a grid item's default stretch, so with no explicit width the frame was sized to content and its only child is an absolutely positioned image. That panel's photograph had never rendered at any desktop width.
- `docs/05-content/IMAGE_ASSET_REGISTER.md` records what each of the seven unregistered images actually shows and its disposition. Three remain unresolved on licence and are owner actions.

### Interior visual system

- Added a `.dh-*` interior composition layer (`app/globals.css`) plus
  `components/page/editorial.tsx` and `components/page/brand-motif.tsx`: painted
  bands, editorial splits on brand plates, icon-supported pathway rows, numbered
  process, designed status strips, image-led closing bands.
- Rebuilt the shared masthead as a two-column field. The right column carries an
  approved photograph or the brand's architectural linework, so no interior
  route opens with half its first viewport empty.
- Rebuilt `/homes`, `/areas`, `/areas/garland`, `/programs`, `/programs/*`,
  `/about`, `/calculators`, `/consultation`, `/contact`, `/faq`,
  `/first-time-buyers`, `/neighborhoods`, `/events`, `/market-reports`,
  `/testimonials` and the `/blog` tail on that system. Content and every honesty
  constraint are unchanged; the presentation is not.
- `/homes` no longer presents the no-MLS state as a warning panel in an empty
  page. The MLS truth is verbatim, inside a composition with the four actions
  that genuinely exist and the DFW market list.
- Homepage Buy/Sell pathways: removed the `01`/`02` numbering, added icon
  badges, benefit highlights, layered brand fields and ornament.
- Homepage closing band is left-aligned with a directional scrim; centred copy
  over a centred subject had required a scrim heavy enough to silhouette Debra.
- Footer brand bands (homepage and interior) moved off white onto the brand's
  soft green-gray, with the logo on a designed plate and a third column of
  verified local facts where the empty middle used to be.
- `/start` moved off its divergent palette (`#0B1F33` navy, `#C9A227` gold,
  `#06B6D4` turquoise, `#F7F2E8` beige) onto the approved brand values. Painted
  brand area on that route went from 8.2% to 46.6%.
- Removed internal product and publishing language from public pages
  ("doorway pages", "local-content focus", "visual direction", "answer engines").

### Imagery

- Added `lib/content/imagery.ts`: the image register expressed as code. Pages
  compose with a named placement rather than a hand-typed `objectPosition`.
- Fixed the closing-band crop. The band used the upright-frame `50% 30%`, which
  removed 22% off the top of the source and clipped the top of Debra's head on
  every route carrying one. The band placement is now `50% 14%`, and the
  masthead placement `50% 22%`. Worst measured top crop across all placements
  and all five breakpoints: 22.4% → 10.5%.
- `/consultation` masthead now carries a registered asset.

### QA

- `scripts/qa/site-audit.mjs` measures painted brand area per route as a share
  of the rendered page, counting each field once, and fails below a floor —
  20% for content routes, 12% for long-form articles. Added `/homes`, `/areas`,
  `/first-time-buyers`, `/faq` and `/programs/naca` to the visual routes, and
  added internal-language strings to the forbidden-copy list.
- Added `scripts/qa/face-safety.mjs` (`npm run qa:faces`): computes the rendered
  crop of every Debra placement at 1440/1024/768/430/375 and fails above a 12%
  top crop.
- `scripts/check-contrast.mjs` (`npm run qa:contrast`) now covers every brand
  pair in the interior system and on `/start`, and exits non-zero on a failure.
  It caught three real defects: gold on teal (4.02:1, unfixable in that pairing
  — teal surfaces now use white), and two icon badges at 3.81:1 and 4.41:1.
- Added `tests/static/interior-visual-system.test.mjs` (9 tests) asserting the
  masthead's second column, painted fields per brand colour, required icons,
  designed status states, absence of internal language, the `/start` palette,
  the register's crop rules and reduced-motion handling.

## 2026-09-20

- Consolidated one preview candidate: the Figma `11:4` homepage (PR #27) as the visual base, with the Sanity CMS / security / SEO closeout (PR #21) and the `/start` conversion landing (PR #26) merged on top and conflicts resolved by hand.
- Replaced the text wordmark in the Figma homepage header with the approved `daffordable-homes-official-logo.png`, rendered at a fixed height with its native aspect ratio on desktop and mobile.
- Carried the site-wide `Made by ClientVerse` attribution into the homepage footer bottom bar and made the footer copyright year dynamic.
- Added `/start` to the browser QA visual routes and documented `NEXT_STEP_LEAD_WEBHOOK_URL`.

## 2026-09-19

- Reconciled the homepage to Figma node `11:4` geometry: 1440 desktop lock, placeholder image wells, 296×337 service cards, 440×520 Meet Debra well, 296×264 market cards, teal listing prices, buyer/seller card colors, 5-column knowledge cards, Follow Us footer.
- Kept Figma placeholder composition instead of substituting unapproved production photographs that change the layout.
- Omitted Figma’s “Studio Clarity” contact line because it is a vendor name, not a published client contact path.
- Implemented Figma homepage frame `11:4` (`daffordable-homes-home-page`) from file `x8TpOO9gK5tsbcjkEsK18A` as the homepage.
- Matched the Figma homepage tokens (page `#faf7f2`, navy `#0b1f33`, body `#203042`, teal `#077783`, gold `#d6a743`, borders `#eae6df`) without changing unrelated interior pages.
- Mapped every homepage CTA to an existing route and kept featured listings as Figma placeholder cards until an approved MLS feed is connected.
- Loaded Inter and Source Serif 4 through `next/font` so the homepage typography can match the Figma file.

## 2026-08-15

- Implemented Sanity CMS: embedded Studio at `/studio`, article/author/category schema, 18 reusable editorial block types, GROQ query layer, draft preview, and a signature-verified publish revalidation webhook.
- Replaced the three hardcoded article routes with one CMS-driven `/blog/[slug]`; the three published URLs are unchanged and unknown slugs now return a real HTTP 404.
- Migrated all three articles into a reproducible seed with an NDJSON exporter for `sanity dataset import`.
- Rebuilt the blog as a premium editorial experience and ran a design pass across the shared system, including real Inter and Source Serif 4 webfonts self-hosted at build time.
- Added the `Made by ClientVerse` attribution to the shared site footer with an explicit vendor-relationship qualifier and a regression test that asserts it.
- Reworked the ClientVerse audit workflow so an unconfigured or uncertified audit fails instead of reporting a green no-op, and uploads its evidence as an artifact.
- Added a Playwright site-audit harness covering route crawl, internal links, canonicals, structured data, accessibility structure, console errors, and responsive behaviour at five viewports.
- Fixed a horizontal-overflow defect on `/consultation` at 375px and an unanchored overlay in the related-articles module that intercepted clicks.
- Removed the `recovered-manus` reference bundle from the production test pipeline; it remains in the repository as reference material only.

## 2026-07-18

- Added a shared calculation engine for mortgage payment, affordability, cash-to-close, and down-payment scenario planning.
- Added four responsive, accessible calculator pages under the Plan & Resources section.
- Added total monthly housing-cost breakdowns covering principal, interest, taxes, insurance, mortgage insurance, and HOA assumptions.
- Added conservative affordability planning with transparent debt-ratio assumptions and lender-decision disclaimers.
- Added adjustable closing-cost, prepaid, escrow, credit, and cash-to-close estimates.
- Added side-by-side down-payment scenarios for 3%, 3.5%, 5%, 10%, and 20%.
- Rebuilt the resources page as the primary entry point for planning tools and buyer education.
- Added automated formula tests and passed repository health, typecheck, lint, tests, production build, and Vercel preview deployment checks.

## 2026-07-14

- Consolidated the approved full website into the governed `apps/web` monorepo structure.
- Restored 22 public application routes, the responsive navigation, next-step guide, homepage sections, compliance pages, honest provider-unavailable states, and approved imagery.
- Upgraded the application to Next.js 16 and React 19.2.4.
- Fixed strict TypeScript, React 19 composition, provider notice, and navigation-state defects.
- Added a full GitHub Actions application quality gate for typecheck, lint, tests, and production build.
- Required the same full quality gate for Vercel preview builds.
- Updated production-readiness and technical-debt records.

## 2026-07-13

- Added production execution logs and risk/debt/decision registers.
- Added production readiness, release, deployment, rollback, and post-release monitoring checklists.
- Added GitHub issue templates for bugs, features, and production gates.
- Added initial repository-health GitHub Actions workflow.
- Updated README and roadmap to reflect Phase 0 governance progress and remaining blockers.
## 2026-07-20

- Replaced the homepage hero portrait with a licensed Black-family moving-day photograph.
- Added three approved Debra Allen photographs to the homepage trust section and About page with responsive image optimization and descriptive alt text.
- Added an image asset register documenting source filenames, final repository paths, processing limits, and hero provenance.
- Added the required ClientVerse.io footer attribution.
- Isolated the pnpm workspace, regenerated the canonical lockfile, and changed CI to use a frozen pnpm install so TypeScript and production builds are reproducible.
