# D'Affordable Homes — Approved Client Handoff Execution Plan

Approved by project owner: 2026-10-26. This document tracks execution, not completion. Do not mark work complete without evidence. Do not merge or deploy unreviewed changes. Continue independent safe tasks if client decisions or credentials are unavailable.

## Phase 1 — Website completion
- [ ] Verify business name, brokerage, licensing, contact details and service area against client-approved facts; do not invent missing details.
- [ ] Inspect all pages, links, buttons, responsive layouts and image rendering; correct demonstrated defects only.
- [ ] Obtain owner approval of final hero crops; continue other tasks while waiting.

## Phase 2 — Content editing
- [ ] Verify Sanity project and environment configuration; provision only with authorized owner access.
- [ ] Test publish, preview, edit and unpublish end to end.
- [ ] Verify client can operate content editing independently.

## Phase 3 — Release audit
- [ ] Investigate ClientVerse Audit failure; distinguish missing central service configuration from actual application defects.
- [ ] Resolve confirmed defects and rerun certification with approved credentials.

## Phase 4 — Quality
- [ ] Re-run automated build, lint, types, static and browser checks on current main.
- [ ] Perform manual WCAG 2.2 AA keyboard/screen-reader review, mobile and cross-browser testing.
- [ ] Record Lighthouse/Core Web Vitals, privacy and security evidence against production-like deployment.

## Phase 5 — Launch
- [ ] Verify correct Vercel project, domain and DNS; do not change live domain without approval.
- [ ] Verify HTTPS, form behavior and production smoke tests.
- [ ] Confirm duplicate project can be safely removed, then remove only with owner authorization.
- [ ] Test rollback, content backup/restore and monitoring.

## Phase 6 — GoHighLevel (deferred, not removed)
- [ ] Identify every form and approved GHL destination; map fields and consent.
- [ ] Configure webhook(s), duplicate protection, notifications and approved follow-ups.
- [ ] Observe actual test lead arrival for each form and record evidence.

## Phase 7 — Client handoff
- [ ] Obtain required business and brokerage approvals.
- [ ] Transfer authorized account ownership, enable MFA and rotate secrets through private channels.
- [ ] Complete owner walkthrough, operating instructions, billing and access register.
- [ ] Record limitations and obtain signed acceptance in docs/FINAL_CLIENT_ACCEPTANCE.md.

## Evidence and execution rules
1. Inspect before editing. Never fabricate facts, approvals, test results or access.
2. Do not block unrelated safe tasks while waiting on client credentials, approvals or decisions.
3. Record evidence and the exact outstanding dependency for each item.
4. Keep PRs unmerged until validated and reviewed; do not deploy or transfer ownership without authorization.
5. Existing project closeout records remain authoritative; reconcile any stale statuses before final acceptance.
