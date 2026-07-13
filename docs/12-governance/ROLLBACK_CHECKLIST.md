# Rollback Checklist

## Rollback triggers

- [ ] Production build or deployment is unhealthy
- [ ] Critical user journey is broken
- [ ] Security or privacy exposure is discovered
- [ ] Compliance-required language is missing or incorrect
- [ ] Provider integration causes inaccurate or misleading user-facing behavior
- [ ] Critical accessibility blocker prevents use of a public journey

## Rollback procedure

- [ ] Identify last known good deployment and commit SHA
- [ ] Preserve logs and evidence before rollback when safe
- [ ] Revert through Vercel deployment rollback or Git revert, whichever is safest
- [ ] Disable affected feature flag or integration if rollback is not immediately available
- [ ] Verify critical routes and contact paths after rollback
- [ ] Notify product owner and affected reviewers
- [ ] Document root cause and follow-up action in `ACTIONS.md`
