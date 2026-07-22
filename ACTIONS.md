# Action Log

This log is retained as project history. Completed items are not deleted.

## ACT-001 — Production governance artifacts

- **Priority:** P0 — Production blocker
- **Problem:** The repository did not include the mandatory execution artifacts needed to track production readiness, technical debt, risks, decisions, release, deployment, rollback, and monitoring evidence.
- **Root Cause:** Phase 0 governance established product direction, but the operational delivery logs requested for production-readiness execution had not yet been created.
- **Files Changed:** `ACTIONS.md`, `TECH_DEBT.md`, `DECISIONS.md`, `RISKS.md`, `CHANGELOG.md`, `docs/12-governance/PRODUCTION_READINESS.md`, `docs/12-governance/RELEASE_CHECKLIST.md`, `docs/12-governance/DEPLOYMENT_CHECKLIST.md`, `docs/12-governance/ROLLBACK_CHECKLIST.md`, `docs/12-governance/POST_RELEASE_MONITORING.md`, `README.md`, `PROJECT_ROADMAP.md`.
- **Solution:** Added durable governance artifacts that define current blockers, production gates, release checklists, deployment/rollback procedures, and post-release monitoring requirements.
- **Validation:** Reviewed required source-of-truth documentation and verified the new files are tracked by Git.
- **Status:** Complete
- **Next Action:** Use these artifacts during every development cycle and update status as gates move from blocked to passing.

## ACT-002 — Repository intake automation

- **Priority:** P0 — Production blocker
- **Problem:** Contributors did not have structured issue intake forms or an executable repository-health check to prevent governance regressions.
- **Root Cause:** The roadmap called for issue templates and a CI plan, but the repository only contained the plan document and did not yet include GitHub templates or an initial workflow.
- **Files Changed:** `.github/ISSUE_TEMPLATE/bug_report.yml`, `.github/ISSUE_TEMPLATE/feature_request.yml`, `.github/ISSUE_TEMPLATE/production_gate.yml`, `.github/workflows/repository-health.yml`, `PROJECT_ROADMAP.md`.
- **Solution:** Added issue templates aligned to the priority matrix and production gates, plus a repository-health workflow that checks required governance files, merge-conflict markers, and committed environment files.
- **Validation:** Ran the same shell checks used by the workflow locally.
- **Status:** Complete
- **Next Action:** Maintain the full application quality gate and extend it with browser and accessibility evidence.

## ACT-003 — Consolidate the approved website and governed scaffold

- **Priority:** P0 — Production blocker
- **Problem:** The approved v0 website and the governed monorepo existed on diverged branches, leaving the complete site outside the verified production workflow.
- **Root Cause:** Visual application work and governance/CI work were developed independently before the repository architecture was consolidated.
- **Files Changed:** `apps/web/**`, `package.json`, `vercel.json`, `.github/workflows/application-quality.yml`, `tests/static/repository.test.mjs`, and production-readiness records.
- **Solution:** Moved the complete approved website into `apps/web`, preserved governance and integration packages, upgraded to Next.js 16 and React 19.2.4, repaired strict-type and lint defects, and made the full quality gate mandatory in GitHub Actions and Vercel.
- **Validation:** Repository Health passes; strict TypeScript passes; ESLint passes with zero warnings; static tests pass; all 22 routes build; Vercel preview deployment is ready.
- **Status:** Complete
- **Next Action:** Complete visual, accessibility, performance, compliance, and provider-readiness gates before production launch.

## ACT-004 — Homebuyer planning calculators

- **Priority:** P0 — Approved revenue-foundation scope
- **Problem:** The Plan & Resources section explained budgeting and preparation but did not provide functional tools for estimating monthly payment, affordability, cash to close, or down-payment scenarios.
- **Root Cause:** The approved website foundation prioritized content and navigation before interactive financial planning tools were implemented.
- **Files Changed:** `apps/web/app/resources/**`, `apps/web/components/calculators/**`, `apps/web/lib/calculators.ts`, and `tests/static/calculators.test.mjs`.
- **Solution:** Added one shared calculation engine, four responsive calculator experiences, dedicated metadata-enabled routes, consultation pathways, transparent assumptions, and clear estimate disclosures.
- **Validation:** Repository Health passed; strict TypeScript, ESLint, formula tests, static tests, and the Next.js production build passed; Vercel preview reached READY; preview deployment logs contained no build errors or error/fatal runtime entries.
- **Status:** Complete in PR #4
- **Next Action:** Complete final visual review, merge PR #4, and verify the resulting production deployment before starting the next feature scope.
## ACT-005 — Approved photography, attribution, and reproducible workspace validation

- Plan: replace the homepage Debra hero with an authentic Black-family image; place the three approved Debra photographs in the homepage trust and About-page contexts; optimize locally; add descriptive alternative text; document provenance and final paths.
- Affected routes: `/` and `/about`.
- Image processing boundary: EXIF orientation, proportional resize, WebP compression, and CSS crop positioning only. No generative fill or appearance edits.
- Root cause resolved: the clone lacked `pnpm-workspace.yaml`, so pnpm walked into an unrelated parent workspace and the earlier npm-based install created a non-canonical dependency tree. The repository now declares its own workspace boundary, package manager, internal workspace dependency, native-build allowlist, and frozen-lockfile CI install.
- Footer: added the exact “Real Estate Technology by ClientVerse.io” attribution with a visible-focus, underlined link to `https://clientverse.io`.
- Rollback: revert this commit and remove the four new WebP assets.
- Validation: `pnpm install --frozen-lockfile`, `pnpm test:all`, and `git diff --check` pass. The complete gate includes TypeScript, zero-warning ESLint, all 11 automated tests (including five calculator formula tests), and a 26-route production build. Browser checks at 375px and desktop widths found no horizontal overflow; all four calculator routes rendered; all four new images loaded through `next/image`; and the footer text/link rendered correctly.
- **Status:** Complete pending remote CI and preview verification.

## ACT-006 — Figma-first controlled production recovery

- Rejected the prior Fraunces, moving-box hero, icon-card, pill-control, and large navy-panel direction.
- Created the canonical editable Figma source and implemented only the homepage, navigation, footer, calculator hub, affordability calculator, and consultation page.
- Preserved all calculator formulas and disclosures; added no financial-data persistence.
- Added licensed Pexels photo 7114188 and documented provenance, crop, optimization, and alt text in the canonical image register.
- Validation: strict TypeScript, zero-warning ESLint, 11/11 tests, five calculator formula tests, 27-route production build, `git diff --check`, and browser checks at 375, 430, 768, 1024, and 1440 with zero horizontal overflow.
- **Status:** Complete locally; pending GitHub Actions and matching Vercel preview verification.
