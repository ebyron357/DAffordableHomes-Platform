# ClientVerse audit integration recovery — D'Affordable Homes

**Evidence date:** November 2, 2026 (America/New_York)  
**Status:** BLOCKED — endpoint configured and client protocol repaired; no completed website audit  
**Client baseline:** `6051a56730b749e4888e5d6513981a56fd367d63`  
**Central service baseline/deployed SHA:** `ad7ece218cda54cb5ee529ae281ae399a7322d40`

This is the current consolidated recovery record. It supersedes earlier guidance
that supplying three client settings alone would restore certification. It does
not change product requirements, authorize publication, or waive release controls.

## Mission

Restore the existing centralized release-certification integration. Scanning,
policy evaluation, and authoritative release decisions stay in
`ebyron357/clientverse-website-audit`. No scanner is added to this client repository.

## Verified status

| Check | Evidence | Meaning |
| --- | --- | --- |
| Latest client audit run | [41402880190](https://github.com/ebyron357/DAffordableHomes-Platform/actions/runs/41402880190), created Nov 2 at 1:54:29 a.m. EST | Failure in configuration verification; submission skipped; zero artifacts |
| Client repository settings | Browser inspection of Actions Secrets and Variables | Initially no repository/environment secrets or variables; endpoint variable now saved |
| Actual service deployment | Vercel project `clientverse-audit`, ID `prj_9yWwfAhblOTbXL0taMGx89P2S5uh`; deployment `dpl_DiGaAGayhqVDVNZbMFo4bEhFwcK5` | READY build for central SHA above; not runtime readiness |
| Actual service health | Authenticated Vercel fetch of `https://clientverse-audit.vercel.app/api/health` at 8:18:54 a.m. EST | HTTP 503, status `unconfigured`, six missing runtime names |
| Vercel configuration inventory | Six named entries exist for production/preview; sensitive values were not exposed | Presence of entry names is not usable runtime configuration; runtime health is authoritative |
| Central Actions secrets | Browser inspection | No repository or environment secrets |
| Central watchdog | [41451613489](https://github.com/ebyron357/clientverse-website-audit/actions/runs/41451613489) | Green because all six missing values trigger a deliberate skipped-success branch; log says `missing_runtime_configuration`. Not service health or audit execution |
| Audit database | Read-only query of Neon project `tiny-waterfall-36711346`, branch `br-broad-darkness-au3r2la3`, database `clientverse_audit` | 21 public tables exist; zero API tokens; zero D'Affordable project records; zero matching audits. No migration or data mutation performed |
| Exact-commit deployment | Vercel team `tradeiq` query filtered to client baseline SHA | Zero deployments returned. Do not assign an older preview or the canonical domain to this SHA |
| Existing previews | Both D'Affordable projects have READY Oct 28 previews at SHA `5347c6bfbf1f640303c5d60e86946b26f9f577e6` | Older candidate only; not evidence for current main |
| Deployment access | Service and both website projects report Vercel SSO `all_except_custom_domains` | Machine-to-machine access must be verified without removing protection. An authenticated connector fetch is not proof that GitHub runners can reach the API or website |
| Installed central-repository Apps | Both UI pages inspected (20 entries) | No dedicated ClientVerse audit App identified; vendor-owned integration keys cannot be repurposed |

The original 06:54 UTC timestamp corresponds to **1:54 a.m. EST**, after the
November 1 daylight-saving transition.

## Corrections completed

- Saved repository variable `CLIENTVERSE_ENDPOINT` as
  `https://clientverse-audit.vercel.app/api/audits`, verified by reading it back.
  This is the actual submission route, not the public URL audit route.
- Replaced the synchronous-response client with the actual asynchronous contract:
  POST → audit ID → bounded polling → terminal evidence and findings → release gate.
- Added the required `application_path: apps/web` and immutable configuration
  revision in `policy_version`. The revision is derived from the real workflow SHA
  and existing configuration path; it does not invent or approve a policy.
- Accept only `completed` plus central `APPROVED`, with matching audit ID,
  repository, commit, deployment, policy revision, and consistent evidence manifest.
  PostgreSQL decimal-string byte sizes are normalized for manifest verification.
- Keep diagnostic artifacts on preflight/transport failure and terminal evidence
  on BLOCKED/error results. Never describe diagnostics as completed scanner evidence.
- Reject credential-bearing URLs, non-HTTPS endpoints, wrong API routes, redirects,
  malformed responses, unknown statuses, mismatched candidates, and missing evidence.
  The bearer token is scoped to the two transport steps and redacted from saved JSON.
- Preserve release-only triggers, read-only repository permissions, centralized
  scanning, and fail-closed behavior. No live release gate was bypassed.

Code changes are reviewable in this branch/PR; they are not deployed or merged
merely because local tests pass. No live audit was rerun while prerequisites fail.

## Specific blockers and responsibility

| Blocker | Owner-only portion | Engineering portion |
| --- | --- | --- |
| Central GitHub App identity | Authorize a service-owned App and its access; securely supply its ID, installation ID and private key | Wire the existing dispatch/checkout contract and verify both operations |
| Central runtime values | Recover/enter existing secret material through secure provider fields; approve new identity/access where required | Validate configuration, database connectivity, callback agreement, then redeploy and check health |
| D'Affordable project token | Credential entry/secure handoff if tooling cannot deliver it directly | Onboard the exact repository and issue a project-scoped `cva_` token using the service's real token/pepper scheme; never invent one |
| Machine access to protected deployments | Approve the intended machine identity/access arrangement if not already authorized | Verify authenticated API calls, signed callbacks and target browser access; never remove SSO or place credentials in URLs |
| Exact candidate deployment | No business-content approval can be inferred from this repair | Create/verify a preview from the intended SHA using the established working project; record provider SHA metadata; supply the immutable URL for that run |
| Central runner compatibility | Any genuinely new business/policy decision remains with the owner | Reconcile the existing project YAML/pnpm monorepo with the central engine's current legacy contract, inside the central repository |

### Secure configuration requirements

The deployed health response names these missing values:
`DATABASE_URL`, `TOKEN_HASH_PEPPER`, `RUNNER_CALLBACK_SECRET`,
`GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_APP_INSTALLATION_ID`.

The existing central runtime and watchdog require the six names in Vercel and
central Actions. The central runner additionally consumes Actions secrets
`CLIENTVERSE_ENDPOINT` (service **base URL**, without `/api/audits`),
`CLIENTVERSE_RUNNER_CALLBACK_SECRET`, `CLIENTVERSE_GITHUB_APP_ID`,
and `CLIENTVERSE_GITHUB_APP_PRIVATE_KEY`.
The callback secret must match the Vercel runtime value. Do not change an
existing token pepper; any established token would become invalid.

The known database is available through Neon; do not recreate it or rerun
migration 001. App private-key material is not obtainable from the connected
GitHub content tools, and no service credential has been identified.
No secret values belong in chat, source, PR bodies, evidence screenshots, or logs.

**First owner-only action:** authorize/provide the central audit GitHub App
identity through the approved secret-management interface. Its operational
requirements are Actions dispatch for the central runner and Contents read for
the authorized client repository, with Metadata read. Scope installation and
minted tokens to the authorized repositories and operations; do not use a
personal all-repository token or reuse a vendor's App.

Evidence for this owner step is secret-name presence, App installation/permission
metadata, and later successful dispatch plus exact-SHA checkout—not the raw key.

### Engineering gap that credentials alone cannot resolve

The deployed [runner](https://github.com/ebyron357/clientverse-website-audit/blob/ad7ece218cda54cb5ee529ae281ae399a7322d40/runner/run-audit.mjs)
requires `BUSINESS_TRUTH.yaml`, `qa-manifest.yaml`, and `qa-policy.yaml`
under the application path. It then runs `npm ci`, local Playwright configuration,
and `lighthouserc.json` there. The inspected client instead supplies
`qa-config/clientverse-audit.yaml` and a root pnpm workspace/lockfile; the three
legacy controls and engine setup are absent.

The original integration's `audit_config_path` is not consumed by the current
service validator. The new client repairs the accepted HTTP fields and lifecycle;
it does **not** claim to implement this separate runner adapter. That work belongs
in the central engine to preserve the user's architecture. Missing controls must
continue to block; do not populate fake business truth or copy a scanner stack
into this repository to conceal the mismatch.

## Alternatives and recommendation

Recommended: finish the existing central-service bring-up and configuration adapter,
then validate a preview of the exact candidate. This preserves the approved
architecture and scopes credentials to the service.

An ordinary repository CI pass or a public-URL audit can provide supplementary
information but cannot substitute for release certification. An old preview
cannot certify a new SHA. Disabling the integration is not an acceptable recovery.

## Completion criteria

1. Central `/api/health` responds HTTP 200 with `status: ready` from the intended
   machine access path, and database readiness is verified.
2. The central GitHub App dispatches a real runner, checks out the exact client SHA,
   and signed start/complete callbacks authenticate.
3. The central runner consumes the actual project controls and pnpm workspace
   without missing-policy shortcuts, duplicated scanner logic, or weakened gates.
4. Hosting metadata maps the immutable target URL to the submitted SHA.
5. POST returns HTTP 202 with a real audit ID; polling reaches a terminal state.
6. Evidence/findings refer to that audit and candidate; artifact hashes and storage
   references are retained and retrievable. The client artifact is downloadable.
7. A completed BLOCKED audit with evidence proves integration execution but does
   not authorize release. Only completed APPROVED with valid evidence passes.
8. A controlled-defect candidate blocks and its repaired candidate passes before
   claiming certification is ready for ongoing release use.

## Validation performed

- Client transport and existing ClientVerse regression tests: **38 passed, 0 failed**.
- Full repository static suite: **279 passed, 0 failed** after installing locked dependencies.
- Type checking: passed for the web app and integrations package.
- Application lint: passed with zero warnings.
- Script syntax and `git diff --check`: passed.
- Initial dependency-free full-suite attempt failed because Next.js was not installed;
  the successful run above supersedes that environment failure.
- Tests use synthetic responses and establish client behavior only. No live audit,
  central runner execution, release verdict, or scanner-evidence artifact is claimed.

## Evidence

- [Original workflow run](https://github.com/ebyron357/DAffordableHomes-Platform/actions/runs/41402880190)
- [Original workflow source](https://github.com/ebyron357/DAffordableHomes-Platform/blob/6051a56730b749e4888e5d6513981a56fd367d63/.github/workflows/clientverse-audit.yml)
- [Central request/authentication contract](https://github.com/ebyron357/clientverse-website-audit/blob/ad7ece218cda54cb5ee529ae281ae399a7322d40/src/core.mjs)
- [Central API router](https://github.com/ebyron357/clientverse-website-audit/blob/ad7ece218cda54cb5ee529ae281ae399a7322d40/api/index.mjs)
- [Central runtime configuration documentation](https://github.com/ebyron357/clientverse-website-audit/blob/ad7ece218cda54cb5ee529ae281ae399a7322d40/docs/CLOSEOUT_CONFIGURATION.md)
- [Skipped watchdog log](https://github.com/ebyron357/clientverse-website-audit/actions/runs/41451613489/job/125297924279)
- [Health observation](../evidence/clientverse-audit-20261102/health.json)
- [Saved endpoint screenshot](../evidence/clientverse-audit-20261102/endpoint-setting.png)
