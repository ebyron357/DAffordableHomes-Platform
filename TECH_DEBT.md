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
