# Project Closeout Status

**Project:** D'Affordable Homes platform
**Repository:** `ebyron357/DAffordableHomes-Platform`
**Default branch:** `main`
**Integration branch for this closeout:** `claude/reconcile-20-into-28` (PR #31)
**Assessed at commit:** `d350db2`; re-verified on `21662ec` and its successor (§13)
**Assessed on:** 2026-10-02

> **Final closure state: `BLOCKED - OWNER ACTION REQUIRED`.**
>
> The application builds, passes every automated gate the repository has, and
> serves 33 public pages. It is blocked from production by facts and approvals
> that only the owner and her broker can supply, and by a release gate that has
> never executed. Nothing in this document converts a blocked item into a pass.

This is the index required by `docs/PROJECT_COMPLETION_STANDARD.md`. Every status
below is `PASS`, `FAIL`, `BLOCKED`, `NOT APPLICABLE`, or
`NON-BLOCKING FOLLOW-UP`, with evidence or a named blocker.

The owner-facing walkthrough of what to do about the blocked items is
`docs/12-governance/CLIENT_HANDOFF.md`. This document is the status register;
that one is the instructions. Where they overlap, this one cites it rather than
repeating it.

---

## 1. The blockers, stated first

Everything else in this document is detail. These are the reasons the project is
not finished. Only blocker 6 involves code, and it waits on an owner decision.

| # | Blocker | Who resolves it | Consequence today |
| --- | --- | --- | --- |
| 1 | **Verified business facts** — brokerage name, licence number and state, business address, phone number, confirmed service-area cities | Debra Allen | `apps/web/lib/site.ts` holds `null` for every one. The live site displays **no phone number, no brokerage, and no licence**. The display and the local-business markup are built (`lib/business-facts.ts`, PR #32) and stay hidden until each value is set, so supplying them is the only remaining step. |
| 2 | **Compliance sign-off** on brokerage, licensing, Fair Housing, Equal Housing Opportunity and REALTOR® language | Debra's broker, named in `docs/12-governance/RELEASE_CHECKLIST.md` | Release gate open. Required language cannot be certified by this repository. |
| 3 | **CRM webhook URLs** — four environment variables, all unset | Debra / her GoHighLevel administrator | **The lead forms do not deliver.** All three endpoints (`/start`, the program pages, and the `/contact` + `/consultation` message form) return an honest 503 and tell the visitor nothing was sent. One GoHighLevel webhook in `GHL_PROGRAM_LEAD_WEBHOOK_URL` now covers both the program forms and the message form. Vercel API, 2026-10-02: the working project has **zero** environment variables in any environment. |
| 4 | **Hero crop approval** on the rendered homepage hero | Debra Allen | Roadmap gate open. No agent has marked it approved and none should. |
| 6 | **No working route from the site to Debra** — no form delivers and no phone or email is published | Debra: a webhook (blocker 3) **or** a phone number / office (blocker 1) | **Code side fixed 2026-10-02 (PR #32):** the `/contact` and `/consultation` form now posts to `POST /api/leads/contact` and delivers as soon as `LEAD_WEBHOOK_URL` or a program webhook is set; it no longer needs a code change. What remains is the owner's input in blocker 1 or 3. Found 2026-10-02 (§13). |

A fifth item gates release but is not the owner's to supply:

| # | Blocker | Who resolves it | Consequence today |
| --- | --- | --- | --- |
| 5 | **ClientVerse release certification** — `CLIENTVERSE_ENDPOINT`, `CLIENTVERSE_DEPLOYMENT_URL`, `CLIENTVERSE_TOKEN` | Whoever operates the central audit engine | The check reports `BLOCKED` and fails wherever it runs. **It has never executed against this repository.** Its absence on a pull request is not a pass. |

---

## 2. Identity and environments

| Requirement | Status | Evidence |
| --- | --- | --- |
| Repository, default branch | `PASS` | `ebyron357/DAffordableHomes-Platform`, default `main` |
| Deployed SHA traceability | `PASS` | Every Vercel deployment is keyed to a commit SHA; the PR comment table records them |
| Production URL | `BLOCKED` | No production domain is attached. `daffordablehomes.com` is not cut over. See `CLIENT_HANDOFF.md` Part 5. |
| Login URL | `NOT APPLICABLE` | The public site has no end-user accounts. The only authenticated surface is the Sanity Studio at `/studio`, which cannot be used until a Sanity project exists. |
| Environment map | `PASS` | Local, Vercel preview per pull request, Vercel production. `docs/12-governance/CI_PLAN.md` → **Environments**. |
| Preview environment | `PASS` | Vercel preview per PR, SSO-protected, `X-Robots-Tag: noindex, nofollow` on `/studio` and preview hosts |
| Production environment | `BLOCKED` | Exists as a Vercel project but has never served a verified production release |

### Hosting, as it actually stands

| Vercel project | Role | State |
| --- | --- | --- |
| `daffordablehomes-platform` (`prj_Frv8mBWD4VUITT18qP0yCK4TBKpV`) | The working project | Builds and deploys successfully |
| `d-affordable-homes-platform-web` (`prj_zbCDLJd83aFPMKgLhtpHMVn29XlK`) | **Duplicate, should be deleted** | Fails every build on every branch including `main`. Its Root Directory `apps/web` doubles with `vercel.json`'s `outputDirectory: apps/web/.next`, so the output lookup fails at `apps/web/apps/web/.next` (`NEXT_OUTPUT_DIR_MISSING`). The Next build itself succeeds. Fixable only in the Vercel dashboard. |

Both projects live under the **`tradeiq`** team, not the owner's. See
§8 and `CLIENT_HANDOFF.md` Part 2.

---

## 3. Accounts, authentication and provisioning

| Requirement | Status | Evidence |
| --- | --- | --- |
| End-user account creation, login, logout | `NOT APPLICABLE` | The site collects enquiries; it has no visitor accounts, no passwords, no sessions. |
| Password requirements, rotation, recovery, lockout recovery | `NOT APPLICABLE` | Same reason. No credential store exists in this application. |
| MFA | `NOT APPLICABLE` for the application. `BLOCKED` as an operational control | The site has no auth. MFA must be enabled on the Vercel, GitHub, Sanity and registrar accounts; that is account configuration, recorded in `docs/SECURITY_AND_ACCESS_HANDOFF.md`. |
| Admin authentication | `BLOCKED` | The Sanity Studio authenticates against Sanity's own identity provider. No Sanity project exists, so no administrator can log in yet. |
| Client provisioning, workspace, invites, roles | `BLOCKED` | Depends on the Sanity project. Role model documented in `docs/ADMIN_OPERATIONS_MANUAL.md`. |
| Ownership transfer | `BLOCKED` | Procedure in `CLIENT_HANDOFF.md` Part 2 and `docs/CLIENT_ACCESS_HANDOFF_TEMPLATE.md`; not executed. |
| Offboarding | `PASS` as documentation | `docs/DATA_LIFECYCLE_AND_OFFBOARDING.md` |

---

## 4. Documentation

| Required file | Status |
| --- | --- |
| `docs/PROJECT_COMPLETION_STANDARD.md` | `PASS` |
| `docs/PROJECT_CLOSEOUT_STATUS.md` | `PASS` — this file |
| `docs/CLIENT_USER_MANUAL.md` | `PASS` |
| `docs/ADMIN_OPERATIONS_MANUAL.md` | `PASS` |
| `docs/SECURITY_AND_ACCESS_HANDOFF.md` | `PASS` |
| `docs/DEPLOYMENT_AND_RECOVERY_RUNBOOK.md` | `PASS` |
| `docs/DATA_LIFECYCLE_AND_OFFBOARDING.md` | `PASS` |
| `docs/TROUBLESHOOTING_AND_SUPPORT.md` | `PASS` |
| `docs/CLIENT_ACCESS_HANDOFF_TEMPLATE.md` | `PASS` — blank template; it must never be filled in inside this repository |
| `docs/FINAL_CLIENT_ACCEPTANCE.md` | `PASS` as a document, **unsigned** as a record |

Several of these describe procedures against systems that do not exist yet
(a Sanity project, a production domain). Each says so where it applies. A
document that explains how to do something is not evidence that it was done.

| Other documentation | Status |
| --- | --- |
| Architecture and dependency map | `PASS` — `ARCHITECTURE.md` |
| Roles and permissions matrix | `PASS` — `docs/SECURITY_AND_ACCESS_HANDOFF.md` |
| Secrets register, names only | `PASS` — `.env.example` and `docs/SECURITY_AND_ACCESS_HANDOFF.md`. No value is recorded anywhere in this repository. |
| Known limitations | `PASS` — `TECH_DEBT.md`, `RISKS.md`, and this document |
| Decision record | `PASS` — `DECISIONS.md` |
| API and integration contracts | `PASS` — §6 below and `docs/ADMIN_OPERATIONS_MANUAL.md` |
| Training and knowledge transfer | `PASS` as material — `docs/CLIENT_USER_MANUAL.md`. No session has been delivered. |

---

## 5. Engineering quality

Measured on `d350db2` with the repository's own commands, and re-run on
`21662ec` under Node 24.21.0 on 2026-10-02 with the same results except where
noted (§13).

| Requirement | Status | Evidence |
| --- | --- | --- |
| TypeScript strict | `PASS` | `pnpm typecheck` exit 0 |
| Lint, zero warnings | `PASS` | `pnpm lint` (`--max-warnings=0`) exit 0 |
| Unit and contract tests | `PASS` | `pnpm test` — **128 pass, 0 fail** on `d350db2`; **142 pass, 0 fail** on `21662ec` |
| Production build | `PASS` | `pnpm build` — 46/46 routes |
| Colour contrast, WCAG 2.2 AA | `PASS` | `pnpm qa:contrast` — 36 pairs, 0 failures |
| Route crawl, structured data, landmarks, heading order, alt text, form labels, focus visibility, touch targets (SC 2.5.8), real 404, console errors, horizontal overflow at 375/430/768/1024/1440 | `PASS` | `pnpm qa:audit` — 33 routes, 29 internal links, 0 console errors, 0 failures, 90 responsive checks |
| Quiz end to end, desktop and phone | `PASS` | `pnpm qa:quiz` — 16/16 paths, 0 non-200 CTAs |
| Portrait crop safety | `PASS` | `pnpm qa:faces` — worst top crop 10.5% against a 12% ceiling |
| Responsive behaviour verified | `PASS` | 5 viewports in `qa:audit`; evidence in `qa-evidence/`. Until §13's refresh, the committed `qa-evidence/visual/` captures predated the current hero (`348e455` is an ancestor of the hero replacement `034e517`) and showed the rejected image. |
| **Manual WCAG 2.2 AA review** | `BLOCKED` | Automated checks are a supplement, not a substitute. No keyboard-and-screen-reader review by a person has been recorded. `docs/12-governance/CI_PLAN.md` item 8 says so explicitly. |
| Formatting check in CI | `NON-BLOCKING FOLLOW-UP` | Not implemented. `CI_PLAN.md` item 3. |
| Dependency audit, static analysis, secret scanning in CI | `NON-BLOCKING FOLLOW-UP` | Not implemented. `CI_PLAN.md` item 9. Secret *commitment* is blocked by the governance job; scanning for leaked secrets is not. |
| Bundle budget, Lighthouse, Core Web Vitals | `BLOCKED` | `CI_PLAN.md` item 10 is unmet. No performance evidence exists against a production-like deployment. The repository treats these as release requirements, so this blocks the release gate rather than deferring. |

### What runs in CI today

| Workflow / job | Trigger | State on `d350db2` |
| --- | --- | --- |
| `Governance and repository integrity` | every PR, push | expected `PASS` |
| `Typecheck, lint, test, and build` | every PR, push | expected `PASS` |
| `Browser QA (audit, quiz, contrast, faces)` | every PR, push | expected `PASS` |
| `Centralized ClientVerse audit` | push to `main`, manual dispatch only | **`BLOCKED`** — three secrets unset |

The ClientVerse workflow does not run on pull requests, so it is **absent** from
PR checks rather than green. The `Browser QA` job does **not** satisfy the
ClientVerse gate and must never be represented as doing so. See `CI_PLAN.md` and
`DECISIONS.md`, 2026-09-27.

---

## 6. Integration truth

Each integration carries one of the standard's seven labels.

| Integration | Label | Detail |
| --- | --- | --- |
| **Sanity CMS** (content, Studio, draft preview, publish webhook) | `CONFIGURATION REQUIRED` | Code, schema, Studio route and webhook handler are complete and tested. No Sanity project exists. Without `NEXT_PUBLIC_SANITY_PROJECT_ID` the Content Lake is never contacted and the three launch guides serve from the committed seed — correct content, not editable by the owner. |
| **`/api/revalidate`** (Sanity publish webhook) | `CONFIGURATION REQUIRED` | Verifies the signature before revalidating anything; returns 503 when `SANITY_REVALIDATE_SECRET` is unset, 401 on a bad signature. Never exercised against a real Sanity project. |
| **Draft-mode preview** (`/api/draft-mode/enable`, `/disable`) | `CONFIGURATION REQUIRED` | Uses `next-sanity`'s single-use Studio-minted secret. Returns 503 without `SANITY_API_READ_TOKEN`. An anonymous visitor cannot obtain a draft cookie. |
| **Lead delivery — `/api/leads/next-step`** | `CONFIGURATION REQUIRED` | Rate-limited, address-validated, honeypot, timing check. Returns 503 without `NEXT_STEP_LEAD_WEBHOOK_URL`. **Delivers nowhere today.** |
| **Lead delivery — `/api/leads/contact`** (`/contact`, `/consultation` message form) | `CONFIGURATION REQUIRED` | Added 2026-10-02 (PR #32); before that the form validated and then showed "not connected" from a `setTimeout`, with no endpoint behind it. Same controls as the other two endpoints. Returns 503 when none of `LEAD_WEBHOOK_URL`, `PROGRAM_LEAD_WEBHOOK_URL`, `GHL_PROGRAM_LEAD_WEBHOOK_URL` is set. Covered end to end by `tests/static/contact-endpoint.test.mjs`. **Delivers nowhere today.** The untested root `api/consultation.js`, which no page called, was retired. |
| **Lead delivery — `/api/leads/program`** (NACA, Homes for Heroes) | `CONFIGURATION REQUIRED` | Same controls as of `d350db2`; it previously had neither a rate limit nor server-side address validation. Returns 503 without `PROGRAM_LEAD_WEBHOOK_URL` or `GHL_PROGRAM_LEAD_WEBHOOK_URL`. **Delivers nowhere today.** |
| **GoHighLevel / CRM** | `NOT IMPLEMENTED` as a verified path | The application posts JSON to a webhook URL. No URL has ever been supplied, so no end-to-end delivery has been observed. Field-by-field mapping is in `docs/ADMIN_OPERATIONS_MANUAL.md`. |
| **ClientVerse release certification** | `AVAILABLE BUT NOT CERTIFIED` | Workflow present and correct; fails `BLOCKED` without its three secrets. Has never executed. |
| **ClientVerse attribution** (site footer) | `LIVE + VERIFIED` | Rendered site-wide, asserted by `tests/static/clientverse.test.mjs`. |
| **MLS / IDX property data** | `NOT IMPLEMENTED` | No approved provider. The listings area shows an honest unavailable state. Required attribution cannot be displayed for a feed that does not exist. |
| **Clara (AI assistant)** | `NOT IMPLEMENTED` | Specified in `docs/09-ai-clara/CLARA_SPEC.md`; no endpoint, no provider, no key. Nothing to rate-limit yet. |
| **Analytics** | `NOT IMPLEMENTED` | No analytics provider is wired. `docs/12-governance/RELEASE_CHECKLIST.md` requires documented events; this is the documentation that none are emitted. |
| **Booking / scheduling** | `NOT IMPLEMENTED` | `/consultation` is a page, not a calendar integration. `/book` permanently redirects to it. |
| **Vercel hosting** | `LIVE + VERIFIED` for preview, `DEGRADED` overall | The working project deploys. A duplicate project fails on every branch and must be deleted. Vercel API, 2026-10-02: the duplicate has 57 deployments, **every one `ERROR`** (3 of them production), has never produced a `READY` deployment, and has no environment variables. It does carry one custom domain, `urltests.team` (bought in the same team the day the project was created), which has therefore never served anything. Deleting the project detaches that domain; the domain itself stays registered to the team. |
| **Email / notification delivery** | `NOT IMPLEMENTED` | The application sends no email. Enquiry notification is whatever the CRM does once a webhook exists. |

---

## 7. Security and privacy

| Requirement | Status | Evidence |
| --- | --- | --- |
| No secrets, client records or credentials committed | `PASS` | Governance job rejects any committed `.env` other than `.env.example`; `.env.example` holds names and no values |
| Privileged integrations server-side only | `PASS` | `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET` and all webhook URLs are read in route handlers; no presentation component calls a provider |
| Input validation and sanitisation | `PASS` | All three lead endpoints bound every field by type and length, allow-list the enumerated values, and validate the address server-side. CMS citation and related-link URLs are sanitised before emission. |
| Rate limiting on public forms | `PASS`, with a stated limit | All three lead endpoints, 5 requests per 60s per address, 429 with `retry-after`. The counter is **per serving instance** and resets on cold start — a real reduction in replay volume from one client, not a fleet-wide guarantee. A durable store is the production-grade version and needs provisioning this repository does not have. Documented at `apps/web/lib/rate-limit.ts`. |
| Rate limiting on AI endpoints | `NOT APPLICABLE` | No AI endpoint exists. Becomes required the moment Clara ships. |
| Spam protection | `PASS` | Honeypot field and minimum-elapsed-time check on all three forms, behind the rate limit, which is the boundary the caller cannot set |
| Secure headers | `PASS` | `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` (camera, microphone, geolocation all denied), `X-Frame-Options: SAMEORIGIN`, `X-DNS-Prefetch-Control`; `poweredByHeader` disabled |
| Restrictive CSP | `PASS` | Two policies. Public: `default-src 'self'`, no `unsafe-eval`, no third-party script origin, `object-src 'none'`, frames limited to `youtube-nocookie.com` and `player.vimeo.com`. Studio-only: scoped to `/studio` by negative lookahead so it cannot leak to public pages, and asserted against the **served header**, not the config text. |
| Security-header tests in CI | `PASS` | `tests/static/repository.test.mjs` |
| Open-redirect protection | `PASS` | `lib/safe-path.ts` strips control characters and normalises backslashes; 13 adversarial cases in `tests/static/safe-path.test.mjs` |
| Data minimisation | `PASS` | See `docs/DATA_LIFECYCLE_AND_OFFBOARDING.md` |
| Retention documented | `PASS` as documentation, `BLOCKED` as practice | The application stores nothing. Retention is entirely the CRM's behaviour and cannot be documented concretely until a CRM is connected. |
| Dependency audit in CI | `NON-BLOCKING FOLLOW-UP` | Not implemented |
| Privacy policy reflects actual providers | `BLOCKED` | `/privacy` cannot be final while the CRM and analytics providers are undetermined |
| Privacy policy reflects data actually collected | `PASS` as to the facts, legal wording `BLOCKED` on the reviewer | Corrected 2026-10-02 (PR #32): `/privacy` said only name, email and message were collected. It now lists each form's fields, the page URL, referrer and campaign tags, the browser-tab storage on `/start`, and the hosting provider's request data, and states that no tracker is loaded. `tests/static/contact-endpoint.test.mjs` pins it. Only facts were changed; the page still says a finalized legal version is to come, and that wording is the compliance reviewer's. |
| Secrets rotation procedure | `PASS` as documentation | `docs/SECURITY_AND_ACCESS_HANDOFF.md` |

---

## 8. Ownership, billing and vendors

| Requirement | Status | Evidence |
| --- | --- | --- |
| Ownership register | `PASS` as documentation, `BLOCKED` as fact | `CLIENT_HANDOFF.md` Part 2. Vercel is under `tradeiq`; GitHub is under `ebyron357`; Sanity does not exist; the registrar holder is unconfirmed. **None of the production accounts is in the owner's name today.** |
| Billing and cost controls | `BLOCKED` | Who pays for Vercel, Sanity, the domain and the CRM is not recorded. Must be settled before sign-off. |
| Vendor register | `PASS` | Vercel, Sanity, GoHighLevel (intended), the domain registrar, ClientVerse. No other third party is contacted by the running site. |
| Source, IP, assets and licences | `PASS` | Code in this repository; image provenance in `docs/05-content/IMAGE_ASSET_REGISTER.md` and `MOTION_ASSET_REGISTER.md`; REALTOR® usage preserved |
| Domain, DNS, certificates | `BLOCKED` | No cutover. Certificates are Vercel-managed once a domain is attached. Observed 2026-10-02: `https://daffordablehomes.com/` answers 200 with a **live GoHighLevel/LeadConnector page branded "Refind Realty"** carrying its own home-valuation form. The domain is not in the `tradeiq` Vercel team. Cutover replaces that page and its form, so it is the owner's decision, made knowingly. |
| Software supply chain | `PASS` | pnpm 11.9.0 pinned via `packageManager`, `pnpm-lock.yaml` committed, CI installs with `--frozen-lockfile`, Node 24 |
| AI agent and automation controls | `PASS` | `AGENTS.md` governs every agent in this repository; `PROJECT_COMPLETION_STANDARD.md` adds the closeout rules |

---

## 9. Operations

| Requirement | Status | Evidence |
| --- | --- | --- |
| Deployment runbook | `PASS` | `docs/DEPLOYMENT_AND_RECOVERY_RUNBOOK.md`, `docs/12-governance/DEPLOYMENT_CHECKLIST.md` |
| Release and change control | `PASS` | `docs/12-governance/RELEASE_CHECKLIST.md`; pull requests with CI gates |
| Rollback | `PASS` as procedure, `BLOCKED` as tested | `docs/12-governance/ROLLBACK_CHECKLIST.md`. The production rollback path has never been exercised, because there has never been a production release to roll back. |
| Backup and restore | `PASS` as procedure, `BLOCKED` as tested | Code is backed up by Git. Content backup is a Sanity dataset export, which cannot be taken or restored until the project exists. `docs/DEPLOYMENT_AND_RECOVERY_RUNBOOK.md`. |
| Disaster recovery and continuity | `PASS` as procedure, `BLOCKED` as tested | Same document. Untested while hosting and content are unprovisioned. |
| Monitoring, alerts, logs, auditability | `BLOCKED` | Vercel retains build and runtime logs for the working project. No alerting is configured, no error tracker is wired, and no owner receives a notification when anything fails. `docs/12-governance/POST_RELEASE_MONITORING.md` is the checklist; nothing automated backs it. |
| Incident response | `PASS` as documentation | `docs/TROUBLESHOOTING_AND_SUPPORT.md` and the rollback checklist. No on-call arrangement exists, and none is claimed. |
| Support and troubleshooting | `PASS` | `docs/TROUBLESHOOTING_AND_SUPPORT.md` |
| Performance and capacity | `BLOCKED` | See §5. No Lighthouse or Core Web Vitals evidence. |
| Browser, device and accessibility support | `PASS` for the automated matrix, `BLOCKED` for manual | 5 viewports in Chromium. No Safari, Firefox or real-device pass is recorded, and no assistive-technology review. |
| Decommissioning | `PASS` as documentation | `docs/DATA_LIFECYCLE_AND_OFFBOARDING.md` |

---

## 10. Acceptance

| Requirement | Status |
| --- | --- |
| Production acceptance | `BLOCKED` — depends on §1 and §5 |
| Client acceptance | `BLOCKED` — `docs/FINAL_CLIENT_ACCEPTANCE.md` is unsigned |
| Ownership transfer | `BLOCKED` — `CLIENT_HANDOFF.md` Part 7 is unticked |

---

## 11. Non-blocking follow-up

Recorded so that none of it is mistaken for a blocker, and none of it delays
closeout.

- CI formatting check, dependency audit, static analysis, secret scanning (`CI_PLAN.md` items 3 and 9)
- `TD-005` — root `package.json` scripts delegate through `npm` inside a pnpm workspace
- A durable rate-limit store (Vercel KV or equivalent) to replace the per-instance limiter
- Cross-browser and real-device verification beyond Chromium
- An error tracker and deployment alerting

## 12. What would change this verdict

In order. Items 1–6 are not code; item 7 is code that waits on a decision:

1. Debra supplies the business facts in §1.1 → trust facts populate, structured data gains a service area.
2. Her broker signs off on the compliance language in §1.2 → the compliance release gate closes.
3. CRM webhook URLs are set in Vercel and a test lead is observed arriving → lead delivery moves to `LIVE + VERIFIED`.
4. Debra approves the hero crop → the roadmap gate closes.
5. A Sanity project is created and transferred to her → the CMS moves to `LIVE + VERIFIED` and she can edit articles herself.
6. The duplicate Vercel project is deleted and the domain is attached → hosting stops being `DEGRADED`.
7. Debra decides where `/contact` and `/consultation` messages go, and that form is wired → blocker 6 closes. This one **is** code, and it waits on her decision.
7. ClientVerse's three secrets are configured and the audit runs and passes → the release certification gate closes.
8. Lighthouse and Core Web Vitals evidence is recorded against the production deployment.
9. A manual WCAG 2.2 AA review is performed and recorded.
10. Accounts transfer, then `FINAL_CLIENT_ACCEPTANCE.md` and `CLIENT_HANDOFF.md` Part 7 are signed.

Until items 1 to 7 are done, the correct closure state is
`BLOCKED - OWNER ACTION REQUIRED`, and no agent should report otherwise.

---

## 13. Release-captain verification, 2026-10-02

Re-verified from scratch rather than carried forward. Everything below was
observed on this date; nothing is inferred from earlier documents.

### Source of truth

| Item | Value |
| --- | --- |
| `main` | `752b93e5fcb1e53e7fbf24f1178087c214886ca1` |
| PR #31 head before this pass | `21662ece9cd1f9e426286589314618b034695037`, 0 behind `main`, 97 ahead, open, not draft |
| Other open PRs / open issues | none / none |
| Copilot review threads on PR #31 | 9 — each checked against the code at `21662ec`; 8 fixed there, 1 (restore draft status) correctly declined. All resolved. |

### Gates, re-run locally on `21662ec` (Node 24.21.0, pnpm 11.9.0, production build on `127.0.0.1:3111`)

| Gate | Command | Result |
| --- | --- | --- |
| Clean install | `pnpm install --frozen-lockfile` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint, zero warnings | `pnpm lint` | exit 0 |
| Tests | `pnpm test` | 142 pass, 0 fail |
| Build | `pnpm build` | exit 0, 46/46 |
| Repository health | the three `repository-health.yml` steps, run locally | 29/29 required files, no conflict markers, no committed env file |
| Contrast | `pnpm qa:contrast` | 36 pairs, 0 failures |
| Route crawl + responsive | `pnpm qa:audit` | 33 routes, 29 links, 0 console errors, 90 responsive checks, 0 failures |
| Quiz | `pnpm qa:quiz` | 16/16, 0 non-200 CTAs, 0 console errors |
| Portrait crops | `pnpm qa:faces` | worst top crop 10.5% vs 12% ceiling |

CI on `21662ec`: Application Quality run `36980294884` and Repository Health run
`36980294885`, all three jobs `success`.

`main`'s own last push runs (`36363913195`, `36363913205` on `752b93e`) are
`failure` after ~2 seconds with no retrievable logs — the jobs never reached a
step. That is a runner-side failure, not a code result; the same workflows pass
on the PR head.

### Hosting, read from the Vercel API

| Project | Fact |
| --- | --- |
| `daffordablehomes-platform` | Preview `dpl_9Pa55FXJYDzvsFUAZWpsysigatHt` for `21662ec` is `READY`. Smoke: `/` 200, `/robots.txt` 200, `/sitemap.xml` 200 with 33 URLs, unknown article 404, `GET /api/leads/next-step` 405; CSP, HSTS and the other security headers present; both TREC links in the footer. Production target currently serves `main` `752b93e` (`dpl_5VaWWB4F4AcPLQB2hrGy4DzXFT2S`) on `*.vercel.app` only, SSO-protected. **Zero environment variables** in any environment. No custom domain. |
| `d-affordable-homes-platform-web` | 57 deployments, all `ERROR`, never `READY`. No environment variables. One custom domain attached, `urltests.team`, which has never served a page because no deployment ever succeeded (corrected 2026-10-02: the project summary lists only `*.vercel.app` aliases, so the first check missed it). Build succeeds; output lookup fails at `apps/web/apps/web/.next`. **Recommended action: delete it.** Correcting its Root Directory would only produce a second copy of the working project. |

### Found in this pass

| Finding | Disposition |
| --- | --- |
| `/contact` and `/consultation` message form never submits; both lead endpoints' 503 fallback lands on it; no phone or email published anywhere | **Blocker 6** above; the form itself was wired in PR #32. Docs that claimed enquiries were "not lost" corrected in `CLIENT_USER_MANUAL.md`, `TROUBLESHOOTING_AND_SUPPORT.md`, `DEPLOYMENT_AND_RECOVERY_RUNBOOK.md`, `CLIENT_HANDOFF.md` |
| `CLIENT_HANDOFF.md` said display logic for phone, address, brokerage and licence "already exists and is covered by tests" | Untrue at the time — nothing displayed them. Corrected, and then built in PR #32 (`lib/business-facts.ts`, `tests/static/business-facts.test.mjs`). |
| Homepage footer's legal row had Fair Housing but no Equal Housing Opportunity link (interior footer had both) | **Fixed** in `lib/figma-home.ts`; `figma-homepage.test.mjs` now fails if either footer drops either link (mutation-checked) |
| Committed `qa-evidence/visual/` showed the rejected hero | Refreshed from the current build |
| `IMAGE_ASSET_REGISTER.md` still read "the homepage hero item is now closed with the registered owner-approved generated still" | Dated supersession note added. **The current hero is not approved.** |
| `ADMIN_OPERATIONS_MANUAL.md` described the pre-fix revalidate route | Corrected to `article`, `author`, `category` |
| `/privacy` understates the data collected | Facts corrected in PR #32 (§7); legal wording stays with the compliance reviewer |
| The favicon and Apple touch icon were a red "n" mark carried from PR #20, not the brand | Replaced in PR #32 with the DA-and-house monogram cropped from the official logo (73 KB → 13 KB); registered in `IMAGE_ASSET_REGISTER.md` |
| `daffordablehomes.com` is live on a GoHighLevel "Refind Realty" page | §8 — cutover is an owner decision |
| CRM ownership is stated three different ways across the handoff docs | Left for the owner to settle; `FINAL_CLIENT_ACCEPTANCE.md` keeps it open |

### Copy for the compliance reviewer

These lines state or imply representation, licensing or a service area without
the qualifier used elsewhere on the site. Whether each may stand is the broker's
decision, not an agent's; they are listed so the review is complete.

| Location | Text |
| --- | --- |
| `components/home/figma-home-page.tsx:54` | Trust band: "REALTOR®" — "Licensed residential representation" |
| `lib/figma-home.ts:43` | "Representation from the first search criteria to the closing table…" |
| `lib/content/homebuying-path.ts:51` | "These are the North Texas cities Debra works in most. Garland is the home market." |
| `app/homes/page.tsx:43` | "Debra works the Dallas–Fort Worth market every day." |
| `app/areas/page.tsx:61` | "…for the communities Debra works in." |
| `app/areas/page.tsx:64`, `app/neighborhoods/page.tsx:28` | "Garland is home base" |
| `app/areas/page.tsx:83`, `app/areas/garland/page.tsx:186` | "Garland is where Debra's practice is based" |
| Both footers | TREC links point at TREC's generic pages, not a broker-completed IABS form |

