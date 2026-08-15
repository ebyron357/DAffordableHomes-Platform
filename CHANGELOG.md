# Changelog

All notable repository changes are documented here.

## 2026-08-15

- Replaced the three hardcoded blog article routes with one CMS-driven `/blog/[slug]` route and a CMS-driven `/blog` index.
- Implemented a production-grade Sanity CMS: embedded Studio at `/studio`, Content Lake client, GROQ query layer, draft mode with preview enable/exit endpoints, and a signed publish webhook that revalidates cache tags.
- Added an eighteen-block reusable editorial system with matching Sanity schema types and frontend renderers.
- Migrated all three published articles into structured CMS content with a reproducible, deterministic generator and an idempotent Sanity import script. All three published URLs are unchanged.
- Normalised internal calculator links from the `/resources/calculators/*` redirect aliases to their canonical destinations.
- Fixed the blog article segment to return a real HTTP 404 for unknown slugs instead of a soft 404.
- Ran a premium design pass across the blog and the shared header, footer, cards, and CTA system.
- Rebuilt the site footer with full navigation, required legal notices, and the site-wide "Made by ClientVerse" vendor attribution.
- Scoped a separate Content Security Policy to the Studio route so the public site policy stays strict.
- Added the apex-domain canonical redirect for `www.daffordablehomes.com`, a default social image, and site icons.
- Cleared every axe-core WCAG 2.1 AA violation found across the 34 public routes.

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
