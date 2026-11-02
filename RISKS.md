# Risk Register

## RISK-001 — Compliance approvals delay launch

- **Risk:** Brokerage, licensing, Fair Housing, Equal Housing Opportunity, privacy, terms, and IDX language may require revisions before publication.
- **Likelihood:** High
- **Impact:** High
- **Mitigation:** Treat approvals as release gates, avoid placeholder compliance claims, and document blockers in the release checklist.
- **Current Status:** Open
- **Owner:** Debra Allen and designated compliance reviewer

## RISK-002 — External provider access blocks end-to-end validation

- **Risk:** GHL, IDX, analytics, maps, reviews, calendar, and AI provider access may not be available when implementation begins.
- **Likelihood:** Medium
- **Impact:** High
- **Mitigation:** Implement provider-disabled fallback states, environment validation, and adapters that can be tested with non-production credentials.
- **Current Status:** Open
- **Owner:** Engineering and Debra Allen

## RISK-003 — Accessibility issues discovered late

- **Risk:** Manual keyboard and assistive-technology issues may be found after pages are visually complete.
- **Likelihood:** Medium
- **Impact:** High
- **Mitigation:** Build with accessible components, add automated accessibility tests early, and schedule manual WCAG 2.2 AA review before launch.
- **Progress (2026-11-02):** Automated axe-core WCAG 2.0–2.2 A/AA scan of 22 routes at two widths added to CI (`pnpm qa:a11y`, PR #41), with the three issues the first audit found fixed (Q-06, Q-07, Q-17 in `docs/AI_SOFTWARE_QUALITY_ADOPTION.md`). Manual screen-reader, 400% zoom and cross-browser review are still outstanding.
- **Current Status:** Open (manual review pending)
- **Owner:** Engineering

## RISK-004 — Lead endpoints can be flooded across instances

- **Risk:** The per-caller rate limit on `/api/leads/*` lives in each server instance's memory (`apps/web/lib/rate-limit.ts`), so scale-out and cold starts each grant a fresh allowance, and a sustained or distributed flood can still reach the CRM. The cross-site guard (PR #40) removes the easiest abuse path but not this one.
- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:** Add a durable limiter (Vercel KV or Upstash) or a Vercel WAF rate-limit rule on `/api/leads/*`; monitor CRM contact volume after launch.
- **Current Status:** Open (audit finding Q-04)
- **Owner:** Engineering

## RISK-005 — Leads lost or duplicated when the CRM is slow or down

- **Risk:** `apps/web/lib/lead-delivery.ts` makes one 8-second attempt with no retry, no failure log and no idempotency key. A GoHighLevel outage loses the lead unless the visitor retries (they are told honestly), and a reply slower than 8 seconds can lead the visitor to resubmit and create a duplicate contact. The owner cannot currently see that deliveries are failing.
- **Likelihood:** Medium
- **Impact:** High
- **Mitigation:** Log a PII-free delivery-failure event, add one bounded retry, send a submission ID for de-duplication, and consider a durable fallback queue. Verify with the live webhook (TD-002).
- **Current Status:** Open (audit finding Q-05)
- **Owner:** Engineering

## RISK-006 — Brokerage services disclosure links to a blank form

- **Risk:** The footer's "Information About Brokerage Services" link goes to TREC's generic form page rather than a completed IABS for Debra's sponsoring brokerage, which may not satisfy Texas advertising rules.
- **Likelihood:** High (until fixed)
- **Impact:** High
- **Mitigation:** Once brokerage details are verified (TD-003), host the completed IABS and link it from the footer; have the broker confirm the requirement. Tracked as a launch gate with the other compliance language.
- **Current Status:** Open (audit finding Q-02)
- **Owner:** Debra Allen and her broker; Engineering to publish
