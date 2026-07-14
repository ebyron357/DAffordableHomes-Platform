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
- **Recommended Fix:** Generate and commit the npm lockfile from the consolidated workspace, switch CI to `npm ci`, and validate a clean install.
- **Status:** Open
