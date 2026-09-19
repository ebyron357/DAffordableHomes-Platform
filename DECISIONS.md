# Architecture Decision Log

## 2026-09-19 — Figma 11:4 geometry wins over substituted production assets

- **Decision:** On the homepage, keep Figma placeholder wells, listing cards, contact placeholders, and 1440-frame geometry until replacement assets are separately approved. Do not let repository photographs change the Figma composition.
- **Reason:** Approved photos changed hero and Meet Debra aspect ratios and were rejected as an unfaithful reproduction of node `11:4`.
- **Alternatives Considered:** Crop approved photos into the Figma wells; keep the previous editorial homepage.
- **Trade-offs:** The preview shows Figma placeholder text instead of photography. Studio Clarity is omitted from the final CTA because it is a vendor name, not a client contact path. Body copy uses REALTOR® rather than Figma’s lowercase “realtor.”
- **Affected Components:** `apps/web/components/home/figma-home-page.tsx`, `apps/web/app/globals.css`.

## 2026-09-19 — Use Figma frame 11:4 as the production homepage

- **Decision:** Implement `daffordable-homes-home-page` from Figma file `x8TpOO9gK5tsbcjkEsK18A` as the live homepage, while leaving interior page chrome unchanged.
- **Reason:** The verified Figma file is the current visual source of truth for the public first impression. The previous file key `lHNOSrbAi46SccUZBrYpIF` is stale.
- **Alternatives Considered:** Keep the education-first editorial homepage; apply the Figma chrome site-wide immediately.
- **Trade-offs:** The homepage now leads with search and service pathways. Education remains available through mapped routes. Featured listings stay as Figma placeholders until an approved IDX feed exists. Contact facts stay unpublished until verified.
- **Affected Components:** `apps/web/app/page.tsx`, homepage-only header/footer, `apps/web/app/globals.css`, `docs/02-brand/VISUAL_SYSTEM.md`.

## 2026-07-13 — Add durable production-readiness governance artifacts

- **Decision:** Maintain `ACTIONS.md`, `TECH_DEBT.md`, `DECISIONS.md`, `RISKS.md`, `CHANGELOG.md`, and release/deployment/rollback/monitoring checklists in the repository.
- **Reason:** Production readiness requires auditable evidence of decisions, risks, unresolved dependencies, validation, and release operations before application launch.
- **Alternatives Considered:** Track execution only in pull requests or external project management tools.
- **Trade-offs:** Repository-based logs require ongoing maintenance, but they keep critical delivery context close to the code and accessible to future agents.
- **Affected Components:** Governance documentation, release process, contributor workflow.

## 2026-07-13 — Start CI with repository-health validation before app scaffold

- **Decision:** Add an initial GitHub Actions workflow focused on governance-file presence, merge-conflict markers, and committed environment-file prevention.
- **Reason:** Full build/type/lint/test checks cannot run until the application scaffold exists, but Phase 0 can still prevent high-impact repository regressions.
- **Alternatives Considered:** Wait to add CI until the Next.js app is created.
- **Trade-offs:** The initial workflow is intentionally limited, but it creates an executable quality gate now and can be expanded without replacing it.
- **Affected Components:** `.github/workflows/repository-health.yml`, `docs/12-governance/CI_PLAN.md`, Phase 0 roadmap.
