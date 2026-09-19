# Changelog

All notable repository changes are documented here.

## 2026-09-19

- Reconciled the homepage to Figma node `11:4` geometry: 1440 desktop lock, placeholder image wells, 296×337 service cards, 440×520 Meet Debra well, 296×264 market cards, teal listing prices, buyer/seller card colors, 5-column knowledge cards, Follow Us footer.
- Kept Figma placeholder composition instead of substituting unapproved production photographs that change the layout.
- Omitted Figma’s “Studio Clarity” contact line because it is a vendor name, not a published client contact path.
- Implemented Figma homepage frame `11:4` (`daffordable-homes-home-page`) from file `x8TpOO9gK5tsbcjkEsK18A` as the homepage.
- Matched the Figma homepage tokens (page `#faf7f2`, navy `#0b1f33`, body `#203042`, teal `#077783`, gold `#d6a743`, borders `#eae6df`) without changing unrelated interior pages.
- Mapped every homepage CTA to an existing route and kept featured listings as Figma placeholder cards until an approved MLS feed is connected.
- Loaded Inter and Source Serif 4 through `next/font` so the homepage typography can match the Figma file.

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
