# Final Client Acceptance

> ## This document is UNSIGNED. The project has not been accepted.
>
> It is the acceptance record, not evidence of acceptance. Every box below is
> open. No agent may tick one, and no agent may report this project as delivered
> while any box in Part 1 or Part 2 is open.

**Project:** D'Affordable Homes platform
**Repository:** `ebyron357/DAffordableHomes-Platform`
**Assessed at commit:** `d350db2`
**Assessment date:** 2026-10-02
**Closure state:** `BLOCKED - OWNER ACTION REQUIRED`

The full status register is `docs/PROJECT_CLOSEOUT_STATUS.md`. The owner-facing
instructions for closing these items are
`docs/12-governance/CLIENT_HANDOFF.md`.

---

## Part 1 — Release gates

None of these may be waived by a developer or an agent. Each is either met or the
project is not releasable.

| # | Gate | Who | Met |
| --- | --- | --- | --- |
| 1 | Verified business facts supplied: brokerage, licence number and state, business address, phone number, confirmed service-area cities | Debra Allen | ☐ |
| 2 | Compliance sign-off on brokerage, licensing, Fair Housing, Equal Housing Opportunity and REALTOR® language, by a **named** reviewer | Debra's broker | ☐ |
| 3 | CRM webhook configured **and a test lead observed arriving** | Debra / CRM administrator | ☐ |
| 4 | Homepage hero crop approved | Debra Allen | ☐ |
| 5 | ClientVerse release certification **executed and passed** | Audit operator | ☐ |
| 6 | Lighthouse and Core Web Vitals evidence recorded against the production deployment | Developer | ☐ |
| 7 | Manual WCAG 2.2 AA review performed and recorded, keyboard and assistive technology | Developer or accessibility reviewer | ☐ |
| 8 | Privacy policy names the actual providers and the actual retention behaviour | Debra, with the developer | ☐ |

On gate 5: the ClientVerse check reports `BLOCKED` wherever it runs and does not
run on pull requests at all. **Its absence from a pull request is not a pass**,
and no other check in this repository satisfies it.

On gate 3: configuration is not delivery. The box is for a lead **seen arriving**.

---

## Part 2 — Ownership transfer

A handover is not complete while a production account belongs to someone else.
Today, none of these is in the owner's name.

| # | Item | Done |
| --- | --- | --- |
| 1 | Vercel project owned by Debra Allen — currently under the `tradeiq` team | ☐ |
| 2 | Duplicate Vercel project `d-affordable-homes-platform-web` deleted | ☐ |
| 3 | GitHub repository admin held by Debra Allen | ☐ |
| 4 | Sanity project created and owned by Debra Allen — does not exist today | ☐ |
| 5 | Domain registrar account confirmed as hers | ☐ |
| 6 | CRM account confirmed as hers | ☐ |
| 7 | MFA enabled on all five accounts | ☐ |
| 8 | Every credential reissued in her accounts, not carried across | ☐ |
| 9 | All agency access removed | ☐ |
| 10 | `docs/CLIENT_ACCESS_HANDOFF_TEMPLATE.md` completed and delivered privately | ☐ |
| 11 | Who pays for each service recorded | ☐ |
| 12 | `docs/12-governance/CLIENT_HANDOFF.md` Part 7 signed | ☐ |

---

## Part 3 — Verified by the owner, unaided

Ticked by Debra having done it herself, not by having been shown it.

| Check | Done |
| --- | --- |
| I signed in to the content editor | ☐ |
| I wrote, previewed and published an article | ☐ |
| I corrected a published article | ☐ |
| I unpublished an article and saw it disappear | ☐ |
| I signed in to Vercel, GitHub, Sanity, the registrar and the CRM | ☐ |
| I know where my leads arrive | ☐ |
| I know who to contact when something breaks | ☐ |
| I know what the site will not claim about my business, and why | ☐ |

---

## Part 4 — Accepted with known limitations

These are not defects and do not block acceptance. Listed so that accepting the
project is accepting it as it is, with nothing hidden.

| Limitation | Where recorded |
| --- | --- |
| No MLS/IDX property feed; the listings area shows an honest unavailable state | `PROJECT_CLOSEOUT_STATUS.md` §6 |
| Clara, the AI assistant, is specified but not built | `docs/09-ai-clara/CLARA_SPEC.md` |
| No analytics provider is wired; no visitor is tracked | `DATA_LIFECYCLE_AND_OFFBOARDING.md` §1 |
| Booking calendar built but not connected until `GHL_BOOKING_URL` is set (`docs/08-integrations/GHL_SETUP.md`) | `PROJECT_CLOSEOUT_STATUS.md` §6 |
| The rate limiter is per serving instance, not fleet-wide | `SECURITY_AND_ACCESS_HANDOFF.md` §4 |
| No alerting, uptime monitoring or error tracking | `TROUBLESHOOTING_AND_SUPPORT.md` §5 |
| No support contract or response-time commitment | `TROUBLESHOOTING_AND_SUPPORT.md` §5 |
| No dependency audit, static analysis or secret scanning in CI | `docs/12-governance/CI_PLAN.md` items 3 and 9 |
| Verified only in Chromium; no Safari, Firefox or real-device pass | `PROJECT_CLOSEOUT_STATUS.md` §9 |
| Open technical debt, including TD-005 | `TECH_DEBT.md` |

**Owner has read Part 4 and accepts these limitations:** ☐

---

## Part 5 — Signature

Sign only when every box in Parts 1, 2 and 3 is ticked, and Part 4 is
acknowledged.

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Product and compliance owner | Debra Allen | | |
| Compliance reviewer | | | |
| Delivering developer | | | |

**Final closure state at signature** — circle one:

`READY FOR CLIENT HANDOFF` · `READY FOR INTERNAL OPERATION` ·
`BLOCKED - OWNER ACTION REQUIRED` · `BLOCKED - TECHNICAL OPERATING FAILURE`

**Closure state on 2026-10-02: `BLOCKED - OWNER ACTION REQUIRED`.**

The application is built, tested and passing every automated gate this repository
has. It is blocked by business facts, a compliance approval, a CRM connection, a
design approval, and a release certification that has never executed. None of
those is a coding task, and none may be marked passed on its behalf.
