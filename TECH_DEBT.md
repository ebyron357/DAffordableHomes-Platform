# Technical Debt Register

## TD-001 — Application scaffold not initialized

- **Severity:** Critical
- **Resolution:** The approved Next.js application is consolidated under `apps/web` with strict TypeScript, Tailwind CSS 4, ESLint, automated tests, CI, and Vercel configuration.
- **Status:** Resolved in PR #3

## TD-002 — Production providers not configured

- **Severity:** Critical
- **Impact:** CRM delivery, IDX inventory, analytics, maps, reviews, booking automation, and Clara cannot be verified against live providers.
- **Current implementation:** Contact, consultation, and program lead routes support server-only webhooks with validation, consent, spam protection, throttling, timeouts, and honest unavailable responses. MLS/IDX remains an explicit unavailable state and never fabricates listings.
- **Required resolution:** Supply approved providers, credentials, test accounts, attribution requirements, and compliance decisions; then run the documented end-to-end provider checks.
- **Status:** Open — external dependency

## TD-003 — Compliance and business facts pending approval

- **Severity:** High
- **Impact:** Public launch remains blocked until brokerage, licensing, business contact, service-area, Fair Housing, Equal Housing Opportunity, privacy, terms, IDX attribution, accessibility, and program language are approved.
- **Current implementation:** Unverified facts remain unpublished and are not replaced with plausible values.
- **Required resolution:** Debra Allen and the designated reviewer must record verified facts and approvals in the release checklist.
- **Status:** Open — external dependency

## TD-004 — Reproducible dependency lockfile pending

- **Severity:** High
- **Resolution:** `pnpm-workspace.yaml`, `pnpm-lock.yaml`, the pinned `pnpm@11.9.0` package manager, frozen CI installation, and supply-chain policy verification are committed and passing.
- **Status:** Resolved

## TD-005 — Manual accessibility and cross-device evidence pending

- **Severity:** High
- **Impact:** Automated WCAG checks cannot replace manual keyboard, zoom, screen-reader, and device review.
- **Current implementation:** All 29 public pages pass automated serious/critical axe checks, route smoke checks, and responsive overflow checks; targeted contrast and 375 px defects found by the suite are resolved.
- **Required resolution:** Complete and record the manual WCAG 2.2 AA review on approved preview and production deployments.
- **Status:** Open — human verification required

## TD-006 — Live monitoring and rollback exercise pending

- **Severity:** High
- **Impact:** Runtime errors, provider delivery, production Core Web Vitals, and rollback behavior cannot be verified before an approved production deployment exists.
- **Required resolution:** Configure production monitoring, submit approved test leads, confirm analytics and provider logs, record Core Web Vitals, and exercise the rollback procedure.
- **Status:** Open — deployment dependency
