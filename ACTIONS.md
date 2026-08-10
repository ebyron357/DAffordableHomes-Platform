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

## ACT-007 — Phase 1 repository and brand stabilization

- **Priority:** P0 — Release blocker
- **Problem:** Clean-checkout typechecking depended on generated Next.js route declarations, the browser theme retained a retired cream, and approved accent/focus colors failed contrast on specific light and navy surfaces.
- **Plan:** Use `next typegen` before TypeScript validation, leave `next-env.d.ts` under Next.js ownership, correct semantic light/inverse accent and focus tokens, update only affected consultation and calculator labels, and add clean-checkout regression coverage without changing layout or calculator logic.
- **Files Changed:** Type-generation scripts and ignore rules, semantic color and focus consumers, repository tests, and controlled visual-system documentation.
- **Validation:** Utility-level focus overrides use the shared opaque navy boundary and gold halo. Frozen install, clean-checkout `next typegen` and TypeScript, the full root quality gate, direct app-level and root production builds, post-build typecheck, all 12 automated tests, and all 27 routes pass.
- **Status:** Complete locally; pending remote CI and preview verification.

## ACT-008 — Recover the client-approved Manus site and add editorial routes

- **Priority:** P0 — Client presentation blocker
- **Problem:** The repository deployment did not match the approved Manus website, and the Manus deployment had no blog routes.
- **Root Cause:** The Vercel implementation and the client-approved Manus build had diverged and were incorrectly treated as the same visual source.
- **Files Changed:** `recovered-manus/**`, `vercel.json`, and this action record.
- **Solution:** Recovered the exact public Manus HTML, production bundle, stylesheet, logo, and five approved photographs without consuming Manus credits. Preserved the working Home, Calculators, Neighborhoods, About, and Consultation experiences. Added a matching resource hub and the complete NACA, Homes for Heroes, and Garland field guides.
- **Validation:** JavaScript syntax checks pass for the recovered application and article generator. The Manus headline, all six local visual assets, four editorial routes, semantic main landmarks, consultation calls to action, and complete article bodies were verified locally.
- **Status:** Complete locally; pending the protected preview/production deployment workflow.
- **Rollback:** Revert this recovery commit to restore the previous Next.js build configuration.

## ACT-009 — Unify site navigation and enforce visual release proof

- **Priority:** P0 — Client trust and presentation blocker
- **Problem:** Core routes labeled the editorial destination “Resources,” while blog and article routes used a different abbreviated header and footer.
- **Root Cause:** The recovered single-page application and generated editorial pages maintained separate navigation markup, and release checks validated route existence without validating shared visual chrome.
- **Solution:** Renamed the public destination to “Blogs” everywhere, made every editorial route use the complete desktop/mobile navigation and full production footer, and added automated shared-shell regression tests.
- **Process Correction:** Updated the publishing standard so implementation, deployment, and public visual verification are separate gates. Future releases require desktop and mobile checks of every changed route after production deployment.
- **Validation:** The first public visual check confirmed the corrected Blogs label and shared editorial shell, then exposed direct-route 404s for core application pages. Root-level Vercel SPA rewrites and a route regression test were added before closeout.
- **Status:** Header/footer correction deployed; direct-route repair pending deployment and final public verification.

## ACT-010 — Repair Blogs click-through routing

- **Priority:** P0 — Public navigation blocker
- **Problem:** Direct blog URLs loaded, but selecting “Blogs” from the recovered Manus header or footer produced the application’s internal 404 page.
- **Root Cause:** The recovered application router intercepted `/blog` even though the editorial pages are static routes outside that router.
- **Solution:** Exempt `/blog` from client-side interception so the browser performs a normal request to the static blog hub. Added a regression assertion for the navigation-handler behavior.
- **Validation:** Local generator and route tests must pass before deployment; final proof requires clicking Blogs from the public homepage and opening all three article links.
- **Status:** Implemented locally; pending deployment and public click-through verification.

## ACT-009 — Surface editorial routes and approved Debra photography

- **Priority:** P0 — Client presentation blocker
- **Problem:** The recovered homepage shell did not link to the new Resources hub, and the four editorial routes did not visibly feature Debra's approved real photography. The first correction reused the older Manus portrait instead of the three approved ClientVerse source photographs.
- **Plan:** Add Resources to desktop, mobile, and footer navigation; copy the three approved Debra photographs into the deployed static output; use distinct approved photos across the hub and articles; align editorial colors with the approved Manus palette; regenerate the static routes; and add regression coverage.
- **Files Changed:** `recovered-manus/assets/index-BT_aM9Xt.js`, `recovered-manus/build-blog.mjs`, `recovered-manus/blog.css`, generated `recovered-manus/blog/**`, repository tests, and this action record.
- **Solution:** Connected the recovered shell to `/blog`; placed the approved kitchen-counter, advisor-desk, and full-body photographs with their registered crop positions and alternative text across the resource hub and three field guides; and replaced the divergent editorial palette with the approved Manus plum, coral, gold, cream, and ink colors.
- **Validation:** Generated all four editorial routes, verified Resources in the recovered navigation and footer, verified the correct distinct Debra photograph on every editorial route, ran JavaScript syntax checks, repository tests, and the root quality gate.
- **Status:** Complete locally; pending public Vercel preview and client visual approval.
- **Rollback:** Revert this commit to restore the PR #11 resource presentation.

## ACT-011 — Select one authoritative production implementation

- **Priority:** P0 — Production closeout blocker
- **Problem:** The repository still treated the recovered static Manus export and the Next.js application as competing production definitions, while the public navigation and canonical calculator/consultation routes diverged from the approved Manus experience.
- **Root Cause:** Recovery work preserved the approved Manus artifact for reference, but deployment and route ownership were not consolidated back onto a single governed implementation.
- **Files Changed:** `apps/web/app/calculators/**`, `apps/web/app/consultation/page.tsx`, `apps/web/app/book/page.tsx`, `apps/web/app/resources/calculators/**`, `apps/web/components/**`, `apps/web/lib/**`, `apps/web/public/manus-storage/**`, `apps/web/next.config.mjs`, `apps/web/app/sitemap.ts`, `vercel.json`, `tests/static/*.test.mjs`, and production-readiness records.
- **Solution:** Selected `apps/web` as the single production implementation, moved the approved Manus shell, navigation, canonical calculator routes, consultation route, and restored visual assets into the Next.js application, kept `recovered-manus/` as a reference-only archive, and changed Vercel to build the governed app instead of the static export.
- **Validation:** `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`.
- **Status:** Complete locally; Vercel root-directory verification, canonical-domain verification, branch-protection changes, external form/CRM wiring, and public browser evidence remain blocked on external access.
