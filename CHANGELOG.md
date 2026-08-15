# Changelog

All notable repository changes are documented here.

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
