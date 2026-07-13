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
- **Current Status:** Open
- **Owner:** Engineering
