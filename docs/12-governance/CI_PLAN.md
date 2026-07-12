# Continuous Integration and Release Validation Plan

## Objective

Every pull request must prove that the D'Affordable Homes platform remains buildable, typed, tested, accessible, secure, and compliant with repository governance before merge.

## Required pull-request checks

The Phase 1 application scaffold must implement these checks in GitHub Actions:

1. **Repository integrity**
   - required governance files exist
   - no merge-conflict markers
   - no committed environment files or known secret patterns

2. **Install**
   - use the locked package manager and lockfile
   - fail when the lockfile and package manifest disagree

3. **Formatting and linting**
   - formatting check
   - ESLint with accessibility rules
   - no ignored lint errors in changed application files without a documented exception

4. **Type safety**
   - TypeScript strict type check
   - environment schema validation during build

5. **Unit tests**
   - calculators
   - quiz and recommendation rules
   - validation schemas
   - Clara policy utilities
   - integration adapter behavior and fallbacks

6. **Build**
   - production Next.js build
   - static route and metadata generation where applicable
   - fail on missing required public environment configuration

7. **Browser tests**
   - critical navigation
   - Find Your Next Step
   - contact and booking fallback
   - content discovery
   - property-provider unavailable state
   - Clara unavailable state when implemented

8. **Accessibility tests**
   - automated checks on representative public routes
   - keyboard-focused browser tests for critical journeys
   - results are a supplement to manual WCAG 2.2 AA review, not a replacement

9. **Security checks**
   - dependency audit
   - CodeQL or equivalent static analysis
   - secret scanning
   - security-header tests after the web application exists

10. **Performance budget**
    - prevent uncontrolled bundle growth
    - run Lighthouse against preview or a production-like build for release candidates
    - enforce documented Core Web Vitals targets during the release gate

## Branch policy

Recommended policy for `main` after the first application pull request:

- require pull requests
- require approvals for production-impacting changes
- require all CI checks
- require conversation resolution
- block force pushes
- block branch deletion
- require branches to be current before merge when practical
- use squash merge for a clean product history

## Environments

### Local

Developer-owned values, fake or approved test data only, no production client records.

### Preview

Vercel preview deployment for each pull request. Use test provider credentials or provider-disabled fallbacks. Preview links must not expose secrets or be indexed by search engines.

### Production

Protected environment. Production credentials are stored outside Git. Deployment requires the release checklist and named approval.

## Test data rules

- Never use real client financial documents or protected information in fixtures.
- Listings must come from the approved test feed, provider sandbox, or clearly synthetic fixtures confined to automated tests.
- Synthetic test records must never appear in public production content.
- GHL workflow tests use named non-production test contacts.

## Required artifacts

For release-candidate workflows, retain:

- test results
- browser test report
- accessibility scan summary
- Lighthouse report
- dependency and security scan results
- build logs

Artifacts must not contain secrets, full form payloads, chat transcripts, or sensitive user data.

## Failure policy

A failed required check blocks merge. Re-running a job is appropriate only for a confirmed transient failure. Do not repeatedly rerun deterministic failures instead of fixing them.

## Initial implementation sequence

1. scaffold application and lock package manager
2. add formatting, lint, typecheck, unit test, and build checks
3. add Playwright browser and accessibility checks
4. add CodeQL and secret scanning
5. add Vercel preview validation
6. add Lighthouse release workflow
7. enable branch protection after required checks are stable
