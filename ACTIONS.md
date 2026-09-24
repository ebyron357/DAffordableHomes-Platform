# Action Log

This log is retained as project history. Completed items are not deleted.

## ACT-016 — Homepage visual reconciliation on the canonical preview

- **Priority:** P0 — Owner rejected the rendered PR #28 preview 2026-09-24
- **Problem:** The owner reviewed the hosted preview and rejected the first viewport as sparse and template-like: oversized empty near-white space, a headline floating without composition, the exterior pushed into a disconnected frame, and weak integration between copy and photograph. A local production render of the same commit (`1e06618`) confirmed three real causes even though the navy split hero and the approved still were both present in the code: `.figma-home { width: 1440px; margin-inline: auto }` boxed the entire site inside near-white margins on any monitor wider than 1440, so the hero read as a card in empty space; the photograph was a hard-edged half-rectangle with nothing tying it to the copy; and the stacking breakpoint at 1100px put every word of hero copy below the fold at 1024. Note: the hero copy the owner quoted ("Homebuying doesn't have to feel overwhelming", pill buttons, a rounded image card) exists in no commit of this repository; it matches the Figma 11:4 frame's own placeholder composition. The findings above stand regardless.
- **Plan:** Keep the approved exterior, the drawn fallback, the opt-in motion contract, the CMS-driven guides, the quiz, `/start`, SEO, security and accessibility work untouched. Recompose only the presentation: remove the page lock so fields bleed; lay the hero on a four-track grid (gutter, copy, photograph, gutter) so the copy sits on the content line and the exterior runs to the viewport edge; blend the seam with a navy wash and a low vignette; add a white gold-edged panel straddling the seam that links to the quiz; add Debra's byline with her approved portrait; hold the split to 900px; reorder sections so the quiz separates the two navy fields; restyle the planning index as an editorial list. Pin all of it in the static tests and re-run every gate against a local production build.
- **Files Changed:** `apps/web/components/home/figma-home-page.tsx`, `apps/web/app/globals.css`, `tests/static/figma-homepage.test.mjs`, `scripts/qa/quiz-e2e.mjs` (new `pnpm qa:quiz` gate: all eight quiz paths at desktop and phone width, every result CTA fetched), `package.json`, `docs/02-brand/VISUAL_SYSTEM.md`, `docs/05-content/IMAGE_ASSET_REGISTER.md`, `CHANGELOG.md`, `PROJECT_ROADMAP.md`, `qa-evidence/**`.
- **Validation:** Static tests, typecheck, lint (0 warnings), production build, contrast gate, face-safety gate, browser audit, evidence captures, and a Chromium inspection of the rendered homepage at 1920, 1440, 1024, 768, 430 and 375 — recorded in the pull request.
- **Status:** Composition pushed and reviewed by the owner on 2026-09-24. Two directives came back: the white quiz panel over the seam is removed (done, same day), and the generated exterior itself is rejected as not fitting the composition. See ACT-017.

## ACT-017 — Hero photograph generated for the layout (owner review pending)

- **Priority:** P0 — Owner directive 2026-09-24.
- **Implementation:** Replaced the rejected Gamma exterior with Higgsfield GPT Image 2.5 job `5136834d-c2cf-4bf9-8120-e509a1abe5ee`, generated at 2688×1520 on `mrbyron357@gmail.com`, converted to WebP without cropping. A single-story brick suburban home has a visible full roofline, no visible garage doors, and no people, house numbers, signs, or text. A second reference-based portrait generation (`fb990c64-11a4-406b-aa3a-fe2c1b542326`, 1744×2336) shows the same house at viewport widths ≤1600px; both sources center the crop. Removed the short gold tagline line on all viewport sizes.
- **Source limitation:** The earlier Dallas/DFW Zillow reference listing images were not available in this workspace; the candidate follows the owner's written description. It is generic generated imagery and must never be called a listing, client property, real address, or verified neighbourhood.
- **Release gate:** Await the owner's visual acceptance of the rendered candidate, after responsive checks. The original Gamma still is removed from the active hero slot.

## ACT-015 — Guide-card imagery, and an audit of every unregistered photograph

- **Priority:** P1 — Owner directive 2026-09-21
- **Problem:** ACT-014 left the two guide cards carrying Debra Allen's portraits, blocked on sourcing replacement photography. Auditing the seven unregistered images to answer that question found three of them misrepresenting something: `/start` published a generated picture of a different woman under the alt text "Debra Allen standing outside a home"; `/start` and the Homes for Heroes guide published a generated office scene whose framed poster and mug carry an invented agency logo and tagline; and `/neighborhoods` captioned a dense north-eastern US streetscape "North Texas" on a page that promises to compare North Texas cities "without fabricated" content. Separately, `.dah-landing-image-frame-portrait` resolved to 0px wide at every desktop width, so that panel's photograph had never appeared on desktop at all.
- **Plan:** Take Debra's portrait off the two cards by making `featuredImage` optional end to end rather than substituting an unrelated photograph — the register allows four images and three are Debra. An article with no photograph of its own subject renders `ArticlePlate`: brand field, architectural linework and the article's own category, which is the answer the interior mastheads already give for a slot with no licensed asset. Keep it CMS-driven: setting `featuredImage` in Sanity restores a photograph to the card, masthead, related card, Open Graph image and Article JSON-LD with no code change, and no image property is published meanwhile rather than an unrelated one being asserted as the subject. Take the three misrepresenting images off every route, bar them in the audit's `RETIRED_ASSETS`, and leave the files in the repository because removing imagery the owner may have licensed is not an agent's call. Record the whole audit in the register.
- **Files Changed:** `apps/web/lib/blog/types.ts`, `apps/web/cms/schema/documents/article.ts`, `apps/web/components/blog/blog-image.tsx` (`ArticlePlate`, `plateVariantFor`), `apps/web/components/blog/article-header.tsx`, `apps/web/components/blog/blocks.tsx`, `apps/web/app/blog/page.tsx`, `apps/web/app/blog/[slug]/page.tsx`, `apps/web/lib/blog/structured-data.ts`, `apps/web/lib/blog/seed/articles/homes-for-heroes-north-texas.ts`, `apps/web/lib/blog/seed/articles/how-to-buy-home-garland-tx.ts`, `apps/web/components/landing/next-step-landing.tsx`, `apps/web/app/neighborhoods/page.tsx`, `apps/web/app/globals.css`, `scripts/qa/site-audit.mjs`, `tests/static/articles.test.mjs`, `tests/static/debra-card-crop.test.mjs`, `docs/05-content/IMAGE_ASSET_REGISTER.md`, `PROJECT_ROADMAP.md`, `CHANGELOG.md`, `qa-evidence/**`.
- **Validation:** 107 static tests, typecheck, lint (0 warnings), production build, contrast gate (23 pairs, 0 failures), face-safety gate (worst top crop 10.5% against a 12% ceiling), browser audit (33 routes, 35 links, 0 console errors, 90 responsive checks, 0 failures), 90 evidence captures across five viewports, and a Chromium run driving all eight quiz paths, both branches, back navigation, keyboard-only completion, reduced motion, mobile touch, and every result CTA returning 200.
- **Status:** Complete, except the photographs themselves. Every image host — Pexels, Unsplash, Wikimedia Commons and the rest — is refused by this environment's egress policy, so no new photograph can be brought into the repository from here. The owner action is recorded in the register and the pull request.

## ACT-014 — Homepage "Find Your Homebuying Path" quiz and guide-card imagery

- **Priority:** P1 — Owner directive 2026-09-21
- **Problem:** The homepage needed one meaningful interactive experience that identifies a visitor's path and recommends existing destinations immediately, in the voice of a DFW real-estate professional rather than generic quiz copy; several homepage strings were generic or overstated (a "real-time MLS search" that does not exist); and the Heroes and Garland guide cards reused Debra Allen's portraits as generic editorial imagery.
- **Plan:** Replace the interim homepage entry to the `/start` assessment with a branched five-or-six-question quiz (goal, DFW area, timeline, buyer or seller position, Homes for Heroes group) whose eight results — First-Time Buyer, North Texas Hero, Moving to DFW, Selling a Home, Selling and Buying, Ready to Search, Early-Stage Researcher, Not Sure Yet — each carry a "Your next move" heading, an explanation assembled from the answers, a recommended next step, one existing resource, a primary CTA and an optional "Want Debra to review your plan?" consultation, with no contact capture. Rewrite generic homepage strings (services, buyer and seller points, knowledge cards, section headings) as specific DFW language. Share one state machine (`useGuidedQuiz`) with the interior readiness check and emit funnel events through the existing analytics seam. Replace the two card images through the CMS `featuredImage` field (seed + Studio), not hard-coded markup.
- **Files Changed:** `apps/web/lib/content/homebuying-path.ts`, `apps/web/components/quiz/use-guided-quiz.ts`, `apps/web/components/home/homebuying-path-quiz.tsx`, `apps/web/components/home/figma-home-page.tsx`, `apps/web/components/next-step/find-your-next-step.tsx`, `apps/web/lib/analytics.ts`, `apps/web/app/globals.css`, `tests/static/homebuying-path.test.mjs`, `tests/static/debra-card-crop.test.mjs` (crop assertions kept from the retired quiz test); removed `apps/web/components/home/home-quiz.tsx`.
- **Validation:** Static tests, typecheck, lint, production build, browser audit, and a Chromium run that drives all eight result paths and both question branches, back navigation, keyboard-only completion, reduced-motion rendering, tablet and mobile touch input, 24px targets, and confirms every result CTA returns 200.
- **Status:** Quiz complete. Card imagery blocked: every image host (stock sites, Wikimedia Commons, and the CDN holding the two generated exterior photographs) is denied by the maintenance sandbox's egress policy, so the two `featuredImage` replacements wait on the owner action recorded in the pull request.

## ACT-013 — Consolidate the final preview: Figma 11:4 homepage + CMS/SEO/security + /start conversion flow

- **Priority:** P0 — Single verified preview for owner review
- **Problem:** The approved Figma homepage (PR #27), the Sanity CMS / security / SEO closeout (PR #21), and the `/start` conversion landing (PR #26) lived on three diverging branches. The Figma header rendered the brand as plain text although the approved logo asset exists, and the homepage footer dropped the site-wide ClientVerse attribution.
- **Plan:** Start from PR #27 as the visual source of truth (Figma file `x8TpOO9gK5tsbcjkEsK18A`, node `11:4`), merge PR #21 and PR #26 on top with conflict resolution instead of blind merges, keep the Figma composition untouched, place the approved logo in the homepage header, carry the vendor attribution into the homepage footer, extend the QA audit to `/start`, and re-run the full gate.
- **Files Changed:** `apps/web/app/page.tsx`, `apps/web/app/layout.tsx`, `apps/web/app/globals.css`, `apps/web/components/home/figma-home-header.tsx`, `apps/web/components/home/figma-home-footer.tsx`, `scripts/qa/site-audit.mjs`, `.env.example`, `tests/static/{figma-homepage,clientverse,repository}.test.mjs`, plus everything carried from PR #21 and PR #26.
- **Reconciliation:** PR #21 — carried in full (CMS, blog `[slug]` route, draft mode, revalidation webhook, safe-href allowlist, scoped Studio CSP, sitemap `lastmod`, structured data, ClientVerse workflow, QA harness, app icons); its homepage-only edits (old hero/section JSON-LD wiring) were superseded by the Figma page while its WebPage JSON-LD and social metadata were kept. PR #26 — carried in full (`/start` landing, intent paths, assessment, UTM attribution, analytics seam, `/api/leads/next-step`); `NEXT_STEP_LEAD_WEBHOOK_URL` documented. PR #20 / #22 — already dispositioned file-by-file in PR #21; no unique validated delta remains outside the two owner decisions recorded there (`latest-guides.tsx`, `og-default.jpg`).
- **Validation:** `pnpm typecheck`, `pnpm lint`, `pnpm test` (78 tests), `pnpm build`, and `pnpm qa:audit` against a local production server of the same commit; results recorded in the pull request.
- **Status:** Preview candidate; not merged. Hosted preview inspection is subject to Vercel Deployment Protection (see pull request).

## ACT-012 — Implement Figma homepage frame 11:4

- **Priority:** P0 — Public homepage implementation
- **Problem:** The production homepage did not match the verified Figma frame `daffordable-homes-home-page`.
- **Plan:** Re-read Figma node `11:4` via official MCP (`get_metadata`, `get_design_context`, `get_screenshot`) and lock the homepage to that geometry. Preserve Figma placeholder wells. Do not change unrelated interior pages. Preview-only redeploy.
- **Files Changed:** `apps/web/app/globals.css`, `apps/web/components/home/figma-home-page.tsx`, `apps/web/components/home/figma-home-footer.tsx`, `apps/web/lib/figma-home.ts`, tests, visual-system and changelog records.
- **Validation:** Lint, typecheck, static homepage tests, production build, and a second visual comparison against the Figma 11:4 screenshot.
- **Status:** Visual reconciliation in preview; not approved for production. MLS/IDX cards remain Figma placeholders until an approved feed is connected.


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

## ACT-012 — Migrate the blog to Sanity and close out the premium design pass

- **Priority:** P0 — Production blocker
- **Problem:** The three published articles were hardcoded as individual TSX routes under `apps/web/app/blog`, so no article could be published, corrected, or previewed without a code change and a deploy. The shared footer carried no ClientVerse attribution even though `tests/static/repository.test.mjs` had a test *named* for ClientVerse coverage that asserted nothing about it, and `.github/workflows/clientverse-audit.yml` (PR #18) exited 0 with a notice when the integration was unconfigured — reporting green for an audit that never ran. The production test suite generated and validated `recovered-manus`, a reference-only bundle that is not deployed.
- **Root Cause:** The editorial architecture predated any CMS; the audit workflow was written as a best-effort notifier rather than a release gate; and the test suite grew around the recovered static bundle rather than the `apps/web` application that Vercel actually builds.
- **Solution:** Implemented Sanity CMS end to end — embedded Studio at `/studio`, schema (article/author/category plus 18 editorial block types), GROQ query layer, published/draft clients, signed publish-revalidation webhook, and slug-verified draft preview. Replaced the three hardcoded routes with a single CMS-driven `/blog/[slug]` and migrated all three articles verbatim into a reproducible seed that `scripts/sanity/export-seed.mjs` converts to importable NDJSON. The three URLs are unchanged and `dynamicParams = false` makes an unknown slug a real HTTP 404 instead of an ISR-cached 200. Ran a premium design pass across the blog and shared system (real Inter/Source Serif 4 webfonts, editorial reading measure, callouts, comparison tables, checklists, FAQ accordion, sources module, related content, contextual CTAs). Added the `Made by ClientVerse` attribution to the shared footer with a qualified vendor relationship, plus a regression test that actually asserts the text, href and single placement. Rewrote the audit workflow so missing configuration reports BLOCKED and fails, only an explicit certified pass passes the gate, and evidence is uploaded as an artifact. Severed the `recovered-manus` bundle from the production test pipeline.
- **Files Changed:** `apps/web/cms/**`, `apps/web/sanity.config.ts`, `apps/web/sanity.cli.ts`, `apps/web/lib/blog/**`, `apps/web/lib/clientverse.ts`, `apps/web/components/blog/**`, `apps/web/components/studio/**`, `apps/web/app/blog/**`, `apps/web/app/studio/**`, `apps/web/app/api/draft-mode/**`, `apps/web/app/api/revalidate/**`, `apps/web/app/layout.tsx`, `apps/web/app/sitemap.ts`, `apps/web/app/robots.ts`, `apps/web/app/globals.css`, `apps/web/next.config.mjs`, `apps/web/components/layout/site-footer.tsx`, `scripts/qa/site-audit.mjs`, `scripts/sanity/**`, `qa-config/clientverse-audit.yaml`, `.github/workflows/clientverse-audit.yml`, `tests/static/**`, `docs/13-cms/SANITY_SETUP.md`, `.env.example`.
- **Validation:** Clean `pnpm install --frozen-lockfile`; `pnpm test:all` green (typecheck, lint at `--max-warnings=0`, 46 tests, production build). Browser QA via `pnpm qa:audit --screenshots` against `next start`: 33 routes crawled, 35 internal links resolved, 0 console errors, 55 responsive checks across 375/430/768/1024/1440, 0 failures — covering canonicals, Article/Breadcrumb/FAQ JSON-LD, heading hierarchy, alt text, form labels, nested interactive controls, focus visibility, touch-target size, the real 404, and consultation-CTA navigation. Evidence in `qa-evidence/`.
- **Status:** Code complete. Release gate **not** satisfied: the Sanity project, the production domain, and the ClientVerse audit are external-account actions that cannot be performed or verified from this environment.
- **Next Action:** Owner to create the Sanity project and set its environment variables, run the seed import, configure the ClientVerse repository variables/secret, and complete the `daffordablehomes.com` domain cutover in Vercel. See the pull request body for exact values and locations.

## ACT-011 — Select one authoritative production implementation

- **Priority:** P0 — Production closeout blocker
- **Problem:** The repository still treated the recovered static Manus export and the Next.js application as competing production definitions, while the public navigation and canonical calculator/consultation routes diverged from the approved Manus experience.
- **Root Cause:** Recovery work preserved the approved Manus artifact for reference, but deployment and route ownership were not consolidated back onto a single governed implementation.
- **Files Changed:** `apps/web/app/calculators/**`, `apps/web/app/consultation/page.tsx`, `apps/web/app/book/page.tsx`, `apps/web/app/resources/calculators/**`, `apps/web/components/**`, `apps/web/lib/**`, `apps/web/public/manus-storage/**`, `apps/web/next.config.mjs`, `apps/web/app/sitemap.ts`, `vercel.json`, `tests/static/*.test.mjs`, and production-readiness records.
- **Solution:** Selected `apps/web` as the single production implementation, moved the approved Manus shell, navigation, canonical calculator routes, consultation route, and restored visual assets into the Next.js application, kept `recovered-manus/` as a reference-only archive, and changed Vercel to build the governed app instead of the static export.
- **Validation:** `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm audit --prod --audit-level=high` reduced local production dependency findings to one remaining moderate advisory.
- **Status:** Complete locally; Vercel root-directory verification, canonical-domain verification, branch-protection changes, external form/CRM wiring, and public browser evidence remain blocked on external access.
