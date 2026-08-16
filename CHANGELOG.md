# Changelog

All notable repository changes are documented here.

## 2026-08-16

- Merged the warm residential editorial reset from `main` into the CMS closeout. The reset is the current design direction and wins on presentation; the closeout keeps its architecture and re-applies what the reset did not carry — the site-wide ClientVerse attribution, the mobile menu's Escape-to-close, and root scripts that keep the test path off `recovered-manus`.
- Restyled the homepage CMS field-guide section into the reset's editorial vocabulary and moved it ahead of the closing consultation band.
- Fixed the footer logo rendering as a solid white block: the knock-out filter inverted the whole box because the logo asset is opaque RGB with no alpha channel.

## 2026-08-15

- Replaced the three hardcoded blog route files with a single CMS-backed `/blog/[slug]` route; the existing article URLs are unchanged and still prerendered.
- Added a Sanity Studio workspace (`apps/studio`) with `article`, `author`, `category`, `program`, and `area` documents and 18 reusable editorial block types, each with required-field and descriptive-alt-text validation.
- Added the query layer, draft-mode preview, preview exit, and a secret-guarded publish/revalidation webhook.
- Migrated all three articles into structured CMS documents with a reproducible build (`scripts/cms/build-content.mjs`) that emits both the app payload and the `sanity dataset import` NDJSON.
- Removed `recovered-manus` from the test path; `pnpm test` had been building it before every check.
- Fixed 13 pages that shipped without a canonical link.
- Fixed unknown article URLs returning HTTP 200 with 404 content.
- Fixed `/naca` rendering a 200 page instead of a 308 redirect, and the missing favicon.
- Removed a geographically misleading neighborhood photograph and its false alt text.
- Completed a premium design pass unifying the editorial and core-site systems, plus a responsive and accessibility pass across five widths.
- Restored the ClientVerse footer attribution with a test that asserts its text and destination, and replaced the audit workflow that passed green when unconfigured with one that reports BLOCKED.
- Added `scripts/qa/crawl.mjs` and `scripts/qa/visual.mjs`, both gating in CI.

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
