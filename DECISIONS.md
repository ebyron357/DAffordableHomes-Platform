# Architecture Decision Log

## 2026-08-15 — Serve the blog from Sanity, with the migration seed as the fallback source

- **Decision:** `/blog` and `/blog/[slug]` read from the Sanity Content Lake when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, and fall back to the committed migration seed in `apps/web/lib/blog/seed` when it is not.
- **Reason:** The seed has to exist regardless — it is the reproducible payload that imports the three migrated articles into Sanity, so nobody retypes them. Reusing it as the fallback means a deploy with missing CMS environment variables serves real content at the three preserved URLs instead of 404ing, and `getContentSource()` reports which source is live rather than hiding the difference.
- **Alternatives Considered:** Fail the build when Sanity is unconfigured; ship an empty blog; keep the hardcoded routes alongside the CMS route.
- **Trade-offs:** Two content paths must stay shape-compatible. They are: both satisfy the `Article` type in `lib/blog/types.ts`, and the renderers never branch on source. Article copy still lives only in the CMS and the seed — never in a route file or a renderer.
- **Affected Components:** `apps/web/lib/blog/source.ts`, `apps/web/lib/blog/seed/**`, `scripts/sanity/export-seed.mjs`.

## 2026-08-15 — Make an unknown article slug a real 404 with `dynamicParams = false`

- **Decision:** `/blog/[slug]` sets `export const dynamicParams = false`, so only slugs returned by `generateStaticParams` are routable.
- **Reason:** With the default `dynamicParams`, Next treats an unknown slug as a cacheable ISR miss and serves the not-found page with HTTP 200. That looks correct in a browser and is wrong for every crawler. Verified empirically: `/blog/nope` returned 200 before the change and 404 after.
- **Alternatives Considered:** `dynamic = "force-dynamic"` (correct 404s, but disables the fetch cache and re-queries Sanity per request); accepting the soft 404.
- **Trade-offs:** The routable slug list is refreshed by ISR and by the publish webhook rather than being unbounded. Publishing a new article still requires no new route file and no code change.
- **Affected Components:** `apps/web/app/blog/[slug]/page.tsx`, `apps/web/app/api/revalidate/route.ts`.

## 2026-08-15 — Scope the Studio's Content Security Policy to `/studio`

- **Decision:** Keep the public site's CSP free of `unsafe-eval` and serve a separate, more permissive policy only on `/studio`.
- **Reason:** Sanity Studio compiles GROQ and schema code at runtime and needs `unsafe-eval` plus direct access to the Sanity APIs over HTTPS and WebSocket. Relaxing the site-wide policy to accommodate an admin route would weaken every public page.
- **Alternatives Considered:** Drop the Vision plugin and hope core Studio runs without `unsafe-eval`; relax the site-wide policy; host the Studio separately.
- **Trade-offs:** Two policies to maintain. `tests/static/repository.test.mjs` asserts the split, so the public policy cannot silently acquire `unsafe-eval`.
- **Affected Components:** `apps/web/next.config.mjs`, `tests/static/repository.test.mjs`.

## 2026-08-15 — A ClientVerse audit that did not run is a failure, not a pass

- **Decision:** `.github/workflows/clientverse-audit.yml` fails when `CLIENTVERSE_ENDPOINT`, `CLIENTVERSE_TOKEN`, or a deployment URL is missing, and only an explicit certified verdict passes the gate.
- **Reason:** The PR #18 draft emitted a notice and exited 0 when unconfigured, so an integration that had never executed reported a green check. A release gate that cannot distinguish "passed" from "never ran" is not a gate.
- **Alternatives Considered:** Keep the skip-with-notice behaviour; make the workflow manual-dispatch only.
- **Trade-offs:** The check is red until the owner configures the integration. That is the intended signal.
- **Affected Components:** `.github/workflows/clientverse-audit.yml`, `qa-config/clientverse-audit.yaml`, `tests/static/clientverse.test.mjs`.

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
