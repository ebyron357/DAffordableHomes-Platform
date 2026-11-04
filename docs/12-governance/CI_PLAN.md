# Continuous Integration and Release Validation Plan

## Objective

Every pull request must prove that the D'Affordable Homes platform remains buildable, typed, tested, accessible, secure, and compliant with repository governance before merge.

## What actually runs today

Read the list below as the target, not as a description of the current pipeline. As of 2026-09-27 GitHub Actions runs three workflows:

| Workflow / job | Status |
| --- | --- |
| `Governance and repository integrity` (`repository-health.yml`) | Running — required files, conflict markers, committed env files |
| `Typecheck, lint, test, and build` (`application-quality.yml`) | Running — `pnpm test:all` |
| `Browser QA (audit, quiz, contrast, faces)` (`application-quality.yml`) | Running — see **Browser QA gates** |
| `Centralized ClientVerse audit` (`clientverse-audit.yml`) | **`BLOCKED`** — client protocol repaired; central runtime, credential, candidate deployment, and runner-contract prerequisites remain. See `CLIENTVERSE_AUDIT_RECOVERY.md`. Runs on push to `main` and `workflow_dispatch` only |

Not yet implemented from the target list: formatting check, dependency audit, CodeQL or equivalent, secret scanning, security-header tests, bundle-size budget, and the Lighthouse release workflow. Items 9 and 10 below are therefore unmet, and no check should be reported as covering them.

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

## Centralized ClientVerse audit connection

Discovery, browser/accessibility/performance/security testing, findings normalization,
repair policy enforcement, and release decisions remain owned by the centralized
**ClientVerse Website Audit & Release Certification System**.

- `qa-config/clientverse-audit.yaml` preserves this project's routes, journeys,
  viewports, and review requirements. The deployed central runner does **not** yet
  consume this schema; its current control-file and package-manager contract must
  be reconciled centrally before acceptance. Do not copy scanners into this repo.
- `.github/workflows/clientverse-audit.yml` and `scripts/clientverse-audit.mjs`
  provide transport only: authenticated submission, bounded polling, candidate
  identity checks, manifest verification, evidence retention, and fail-closed exit.
- The request carries repository, exact workflow commit, deployment URL,
  `application_path: apps/web`, and an immutable `policy_version` reference to the
  project configuration. The policy reference is provenance, not policy approval.
- Only a completed audit with central decision `APPROVED`, matching candidate
  identity, and consistent evidence manifest satisfies the release gate. HTTP 202,
  preflight success, watchdog success, and ordinary CI success do not.
- `clientverse-audit-evidence` retains request/configuration identity, submission,
  latest status, terminal evidence/findings when available, HTTP status, and result
  for 30 days. Configuration and transport failures retain diagnostic results;
  those files are explicitly **not** proof that website scanning executed.

Repository variables are `CLIENTVERSE_ENDPOINT` and
`CLIENTVERSE_DEPLOYMENT_URL`; the secret is `CLIENTVERSE_TOKEN`. The endpoint may
be a service base URL or the `/api/audits` submission route. The deployment must
serve the exact workflow commit, verified using hosting-provider metadata.
The token must be issued by this central service for this exact repository.

The complete, current recovery record is
[`CLIENTVERSE_AUDIT_RECOVERY.md`](CLIENTVERSE_AUDIT_RECOVERY.md). It supersedes
prior claims that supplying three values alone restores certification. The endpoint
is configured; the central API returned HTTP 503 with six missing runtime values
on November 2, 2026. There is no real audit verdict or retained scan evidence yet.

Existing local browser gates remain separate. They do not satisfy ClientVerse
release certification. Never disable the central check, weaken service access
controls, or treat an unexecuted audit as passed.

## Browser QA gates

Four scripts drive a real Chromium browser over a served production build and each fails non-zero on any defect. They run locally and, since 2026-09-27, as the blocking `runtime-qa` CI job on every pull request.

| Command | Covers |
| --- | --- |
| `pnpm qa:contrast` | Every documented foreground/background pair against WCAG 2.2 AA, so a contrast regression fails the build rather than waiting for an audit |
| `pnpm qa:audit` | Route crawl, internal-link resolution, canonical tags, Article/Breadcrumb/FAQ structured data, heading hierarchy, alt text, landmarks, form labels, nested interactive controls, focus visibility, touch-target size, the real 404 for an unknown article slug, consultation-CTA navigation, console errors, and horizontal overflow at 375/430/768/1024/1440 |
| `pnpm qa:quiz` | Every homepage quiz path end to end at desktop and phone width, with each result CTA fetched and required to return 200 |
| `pnpm qa:faces` | Portrait crop safety — how far every placement of a real person's photograph cuts into the face, against a documented ceiling, including placements the browser failed to draw at all |

They need a built app and a running server:

```bash
pnpm build
sh scripts/qa/serve.sh 3111 "$PWD/.qa-server.log"
pnpm qa:contrast && pnpm qa:audit && pnpm qa:quiz && pnpm qa:faces
```

`qa:audit` accepts `--base <url> [--screenshots]`. Output lands in `qa-evidence/`, which is tracked; regenerating it produces srcset-candidate and JPEG re-encode noise, so discard it with `git checkout -- qa-evidence/` unless rendering actually changed.

## Initial implementation sequence

1. scaffold application and lock package manager
2. add formatting, lint, typecheck, unit test, and build checks
3. add Playwright browser and accessibility checks
4. add CodeQL and secret scanning
5. add Vercel preview validation
6. add Lighthouse release workflow
7. enable branch protection after required checks are stable
