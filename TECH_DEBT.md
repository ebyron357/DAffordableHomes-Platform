# Technical Debt Register

## TD-001 — Application scaffold not initialized

- **Severity:** Critical
- **Impact:** Build, type-safety, lint, browser, accessibility, and performance gates could not run.
- **Resolution:** The approved 22-route Next.js application is consolidated under `apps/web` with strict TypeScript, Tailwind CSS 4, ESLint, static tests, full CI, and Vercel preview validation.
- **Status:** Resolved in PR #3

## TD-002 — Optional production integrations not configured

- **Severity:** Critical
- **Impact:** CRM, IDX, maps, reviews, booking delivery, and Clara workflows remain unavailable. They are outside the 2026-08-04 website completion scope. Analytics hooks are implemented but remain disabled without approved environment values.
- **Reason:** Provider selection, credentials, test accounts, compliance approvals, and adapters are not yet implemented.
- **Recommended Fix:** Confirm providers and credentials, define environment schemas, then implement server-side adapters with honest unavailable states.
- **Status:** Open

## TD-003 — Compliance release language pending approval

- **Severity:** High
- **Impact:** Public launch is blocked until brokerage, licensing, Fair Housing, Equal Housing Opportunity, privacy, terms, IDX attribution, and accessibility language are reviewed.
- **Reason:** Required legal/compliance reviewers and final business facts are external dependencies.
- **Recommended Fix:** Record verified business facts and approvals in the release checklist before production publication.
- **Status:** Open

## TD-004 — Reproducible dependency lockfile

- **Severity:** High
- **Impact:** Resolved. The repository uses pnpm 11.9.0, a workspace definition, a committed lockfile, frozen CI installs, and a validated clean dependency installation.
- **Status:** Resolved

## TD-005 — Verified business and legal facts pending

- **Severity:** Critical
- **Impact:** Final launch, direct contact delivery, Texas advertising compliance, and a complete IABS link cannot be approved.
- **Reason:** The repository does not contain Debra’s verified brokerage name, Texas license number, approved public email/phone, or completed brokerage IABS notice.
- **Recommended Fix:** Obtain written client/brokerage confirmation, add the exact approved facts to the canonical site configuration, and rerun the full release gate.
- **Status:** Open
