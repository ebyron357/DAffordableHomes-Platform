# Technical Debt Register

## TD-001 — Application scaffold not initialized

- **Severity:** Critical
- **Impact:** Build, type-safety, lint, automated accessibility, browser, and performance gates cannot pass until the Next.js application and package manager are established.
- **Reason:** The repository is still in Phase 0 governance foundation; application code begins in Phase 1.
- **Recommended Fix:** Initialize the Next.js App Router application with TypeScript strict mode, Tailwind CSS, locked package manager, test runners, and baseline CI checks.
- **Status:** Open

## TD-002 — Production integrations not configured

- **Severity:** Critical
- **Impact:** GHL, IDX, analytics, maps, reviews, booking, and Clara production workflows cannot be verified end to end.
- **Reason:** Provider selection, credentials, test accounts, compliance approvals, and adapters are not yet implemented.
- **Recommended Fix:** Define provider contracts and environment schemas before implementing server-side adapters and fallbacks.
- **Status:** Open

## TD-003 — Compliance release language pending approval

- **Severity:** High
- **Impact:** Public launch is blocked until brokerage, licensing, Fair Housing, Equal Housing Opportunity, privacy, terms, IDX attribution, and accessibility language are reviewed.
- **Reason:** Required legal/compliance reviewers and final business facts are external dependencies.
- **Recommended Fix:** Track each required approval in the release checklist and avoid publishing production routes until approved language is committed.
- **Status:** Open
