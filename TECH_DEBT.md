# Technical Debt Register

## TD-001 — Application scaffold not initialized

- **Severity:** Critical
- **Impact:** Build, type-safety, lint, browser, accessibility, and performance gates could not run.
- **Resolution:** The approved 22-route Next.js application is consolidated under `apps/web` with strict TypeScript, Tailwind CSS 4, ESLint, static tests, full CI, and Vercel preview validation.
- **Status:** Resolved in PR #3

## TD-002 — Production integrations not configured

- **Severity:** Critical
- **Impact:** CRM, IDX, analytics, maps, reviews, booking, and Clara production workflows cannot be verified end to end.
- **Reason:** Provider selection, credentials, test accounts, compliance approvals, and adapters are not yet implemented.
- **Recommended Fix:** Confirm providers and credentials, define environment schemas, then implement server-side adapters with honest unavailable states.
- **Status:** Open

## TD-003 — Compliance release language pending approval

- **Severity:** High
- **Impact:** Public launch is blocked until brokerage, licensing, Fair Housing, Equal Housing Opportunity, privacy, terms, IDX attribution, and accessibility language are reviewed.
- **Reason:** Required legal/compliance reviewers and final business facts are external dependencies.
- **Recommended Fix:** Record verified business facts and approvals in the release checklist before production publication.
- **Status:** Open

## TD-004 — Reproducible dependency lockfile pending

- **Severity:** High
- **Impact:** Dependency resolution can change between installations even when source code does not.
- **Reason:** The governed monorepo was consolidated from npm and pnpm branches without adopting a final workspace lockfile.
- **Original Recommended Fix (superseded, do not follow):** Generate and commit the npm lockfile from the consolidated workspace, switch CI to `npm ci`, and validate a clean install.
- **How it was actually resolved:** On pnpm rather than npm. `packageManager` is pinned to `pnpm@11.9.0`, `pnpm-workspace.yaml` defines the workspace, `pnpm-lock.yaml` is committed, and both CI jobs install with `pnpm install --frozen-lockfile`. Installation is reproducible and the stated impact no longer applies. **No `package-lock.json` exists and none should be added** — two lockfiles for one workspace is worse than either alone, which is why the original recommendation above must not be actioned.
- **Status:** Resolved. Residual inconsistency tracked separately as TD-005.

## TD-005 — Root scripts still delegate through npm in a pnpm workspace

- **Severity:** Low
- **Impact:** Cosmetic and a maintenance trap, not a correctness problem. `pnpm build` currently resolves to `npm --workspace apps/web run build`, so both package managers must be present for the documented commands to work, and the root `package.json` carries an `npm`-style `workspaces` array that pnpm ignores in favour of `pnpm-workspace.yaml`.
- **Reason:** Residue of the npm-to-pnpm consolidation recorded in TD-004. CI passes because the runner has npm as well as pnpm.
- **Recommended Fix:** Rewrite the root scripts to `pnpm --filter`, and drop the redundant `workspaces` array. Verify `pnpm test:all` and every `qa:*` script afterwards, and update `docs/12-governance/CI_PLAN.md` if the commands change.
- **Status:** Open

## TD-006 — Duplicate colour-token systems and heading scales

- **Severity:** Medium
- **Impact:** Brand drift: one colour change must be made in four places, and page headings use different size scales.
- **Reason:** `apps/web/app/globals.css` defines `@theme --color-brand-*`, `--fh-*`, `--dh-*` and `--dah-*` with the same values, plus about 200 raw hex values; the blog uses fixed pixel heading sizes.
- **Recommended Fix:** Alias `--fh-*`, `--dh-*` and `--dah-*` to the `@theme` tokens, replace raw hex with tokens, and define one heading scale. Verify with a pixel comparison across routes.
- **Status:** Open (audit finding Q-13)

## TD-007 — Security headers: inline-script CSP and HSTS

- **Severity:** Low
- **Impact:** The public CSP allows `script-src 'unsafe-inline'`, so it gives no backstop if an HTML-injection bug appears; the repository sets no `Strict-Transport-Security` header.
- **Recommended Fix:** Move to a nonce-based CSP through middleware; add HSTS (after confirming what Vercel's edge already sends on the production domain).
- **Status:** Open (audit findings Q-15, Q-16)

## TD-008 — No browser tests for lead forms, visual regression or rollback

- **Severity:** Medium
- **Impact:** A client-side break in the main conversion path (`/contact`, program forms, `/start`) would not be caught; screenshots are captured but never compared; rollback is a manual checklist only.
- **Recommended Fix:** Playwright end-to-end tests for each form (valid, invalid, server error with a mocked route); a screenshot comparison step; one rehearsed rollback recorded against a preview deployment.
- **Status:** Open (audit findings Q-10, Q-20)

## TD-009 — High advisories in build and admin tooling

- **Severity:** Low
- **Impact:** Since PR #40 (merged), `pnpm audit --prod` reports 0 critical and 24 high advisories, all in the Sanity CLI chain (adm-zip, undici, brace-expansion, vite, zod, js-yaml, markdown-it) and Next's compiler chain (postcss, nanoid, source-map-js, browserslist). None run on public routes.
- **Recommended Fix:** Re-audit after each Sanity and Next upgrade; add `pnpm-workspace.yaml` overrides where a patched version is compatible.
- **Status:** Open (audit finding Q-21)

