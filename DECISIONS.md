# Architecture Decision Log

## 2026-09-20 — PR #27 controls the look; PR #21 and PR #26 are merged underneath it

- **Decision:** Build the final preview from the `preview/figma-homepage-11-4` head, then merge `claude/daffordable-homes-closeout-atajpq` (PR #21) and `feature/dfw-conversion-landing` (PR #26) onto it. Every conflict on the homepage (`app/page.tsx`, `app/layout.tsx`, `globals.css`) resolves in favour of the Figma implementation; non-visual additions from the other branches (JSON-LD, social metadata, self-hosted fonts, canonical defaults) are kept.
- **Reason:** The Stitch → Figma homepage is the approved visual direction. The CMS, security, SEO, and conversion work is orthogonal to it and would otherwise be lost or re-implemented.
- **Alternatives Considered:** Merge PR #21 to `main` first and rebase PR #27; cherry-pick selected files.
- **Trade-offs:** Three merge commits instead of one clean history, but each branch's review record stays intact and reviewable.
- **Affected Components:** homepage route and chrome, `apps/web/cms/**`, `apps/web/lib/blog/**`, `apps/web/components/landing/**`, QA harness.

## 2026-09-20 — The approved logo asset replaces the Figma text wordmark in the homepage header

- **Decision:** The homepage header renders `public/images/daffordable-homes-official-logo.png` (640×427) at 66px tall on desktop and 56px on small screens, with `width: auto`, instead of the serif text “D’Affordable Homes” drawn in Figma node `11:6`.
- **Reason:** The real brand asset exists and is already used by the interior header, footer, and Organization JSON-LD; recreating the logo as text is not permitted. `manus-storage/dah-logo_ff042b7b.png` is a Manus placeholder glyph, not the brand mark, and is retained only as a historical reference.
- **Alternatives Considered:** Keep the text wordmark; show logo and wordmark together (overlaps the Figma nav column at 1440).
- **Trade-offs:** The brand slot is a mark rather than serif type, occupying the same left column and header height as the Figma frame. Everything else in the header is unchanged.
- **Affected Components:** `apps/web/components/home/figma-home-header.tsx`, `apps/web/app/globals.css`.

## 2026-09-20 — Vendor attribution appears in both footers

- **Decision:** The homepage footer (Figma `11:274`) carries the `Made by ClientVerse` attribution in its bottom bar next to the copyright, because the root layout hides the shared footer on `/`.
- **Reason:** The attribution is a site-wide release requirement recorded on 2026-08-15; a homepage without it would silently drop the requirement on the most visited page.
- **Alternatives Considered:** Show the shared footer beneath the Figma footer (duplicate footers); leave the homepage without attribution.
- **Trade-offs:** One extra small text item in the footer bottom bar. `tests/static/clientverse.test.mjs` now allows exactly the two footer components and still rejects any other placement.
- **Affected Components:** `apps/web/components/home/figma-home-footer.tsx`, `tests/static/clientverse.test.mjs`.

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
