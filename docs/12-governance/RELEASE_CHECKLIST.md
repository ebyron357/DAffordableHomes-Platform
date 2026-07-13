# Release Checklist

Complete this checklist for every production release candidate.

## Ownership

- [ ] Release owner named
- [ ] Product reviewer named
- [ ] Compliance reviewer named when required
- [ ] Affected routes and integrations listed
- [ ] User data collected and retention behavior documented
- [ ] Analytics events documented
- [ ] Known limitations documented

## Required validation

- [ ] Static analysis passes
- [ ] Type checking passes
- [ ] Lint passes
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] End-to-end tests pass
- [ ] Automated accessibility checks pass
- [ ] Keyboard-only review passes
- [ ] Responsive review passes for mobile, tablet, and desktop
- [ ] Lighthouse release targets are met or release is blocked
- [ ] Production build succeeds
- [ ] Security scan has no unresolved high-severity findings
- [ ] No secrets, client records, or production credentials are committed
- [ ] No fabricated listings, reviews, credentials, statistics, outcomes, or testimonials are present

## Compliance and content

- [ ] Brokerage and licensing language approved
- [ ] REALTOR® usage reviewed
- [ ] Fair Housing language approved
- [ ] Equal Housing Opportunity language approved
- [ ] IDX attribution and provider rules approved where applicable
- [ ] Privacy policy reflects actual providers and data behavior
- [ ] Terms of use approved
- [ ] Accessibility statement approved
- [ ] Time-sensitive content has review dates and sources

## Release evidence

- [ ] Build logs retained
- [ ] Test reports retained
- [ ] Accessibility report retained
- [ ] Lighthouse report retained
- [ ] Security scan retained
- [ ] Rollback plan reviewed
- [ ] Post-release monitoring owner assigned
