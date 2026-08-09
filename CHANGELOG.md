# Changelog

All notable repository changes are documented here.

## 2026-08-04

- Added complete FHA, VA, USDA, conventional, NACA, and Homes for Heroes education routes using the existing program-page system.
- Added complete buyer guides for first-time buyers, credit improvement, down payment assistance, homeownership readiness, the Texas closing process, and common questions.
- Added differentiated Dallas, Garland, Mesquite, Richardson, Plano, Sachse, Rowlett, Forney, Rockwall, and Wylie guides with neutral neighborhood research, school-boundary verification, affordability planning, market context, buying tips, FAQs, and official links.
- Expanded Article, FAQ, Breadcrumb, Organization, LocalBusiness, and RealEstateAgent structured data plus canonical, Open Graph, Twitter, sitemap, robots, and web-manifest coverage.
- Added optional GA4, Google Search Console, and Bing verification wiring that remains inactive without approved environment values.
- Expanded privacy and terms content, added Texas brokerage consumer information, and preserved honest blockers for missing brokerage, license, contact, and completed IABS facts.
- Added a global error page, Escape-key mobile menu behavior, completion regression tests, and an updated production-readiness record.
- Passed strict TypeScript, zero-warning ESLint, 20 automated tests, and a 56-route optimized production build.

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
