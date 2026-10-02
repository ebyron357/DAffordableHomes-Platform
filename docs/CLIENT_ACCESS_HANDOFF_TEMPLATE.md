# Client Access Handoff Template

> ## Do not fill this in inside this repository.
>
> This is a **blank template**. Copy it out, complete the copy somewhere private,
> and deliver it to the owner through a channel she controls — a password manager
> share, or in person.
>
> **Never commit a completed copy. Never put a password, token, recovery code or
> webhook URL in this file or in any file in this repository.** A credential that
> reaches a Git commit is public permanently; rotating it is then the only remedy.
> CI rejects committed `.env` files, but it cannot catch a secret pasted into a
> Markdown document.
>
> Record **who holds** each credential and **where it lives**. Never the value.

**Project:** D'Affordable Homes platform
**Prepared by:** ________________  **Date:** ____________
**Delivered to:** Debra Allen  **Delivered how:** ________________
**Received on:** ____________  **Acknowledged by:** ________________

---

## 1. Accounts

For each service: the owner's account must be the owner, and the previous
holder's access must be removed or reduced once she is in.

| Service | Account email | Owner role confirmed | MFA on | Prior access removed | Who pays |
| --- | --- | --- | --- | --- | --- |
| Domain registrar | | ☐ | ☐ | ☐ | |
| Vercel | | ☐ | ☐ | ☐ | |
| GitHub | | ☐ | ☐ | ☐ | |
| Sanity | | ☐ | ☐ | ☐ | |
| CRM (GoHighLevel or equivalent) | | ☐ | ☐ | ☐ | |

**Starting position, for honesty at handover:** Vercel is under the `tradeiq`
team, GitHub under `ebyron357`, Sanity does not exist, and the registrar holder
is unconfirmed. Every row above starts unticked for a reason.

---

## 2. Where things are

| Thing | Location | Notes |
| --- | --- | --- |
| Live site | | The real domain, not a `.vercel.app` host |
| Content editor | `<domain>/studio` | Unusable until the Sanity project exists |
| Source code | `github.com/ebyron357/DAffordableHomes-Platform` | |
| Hosting dashboard | Vercel → project `daffordablehomes-platform` | `prj_Frv8mBWD4VUITT18qP0yCK4TBKpV` |
| CRM | | Where enquiries arrive |
| Content backups | | Where the dataset exports are kept, and who takes them |

---

## 3. Secrets — holders, not values

Names from `docs/SECURITY_AND_ACCESS_HANDOFF.md` §1. Record only who holds each
and where it is stored.

| Secret name | Stored in | Issued on | Holder | Rotation owner |
| --- | --- | --- | --- | --- |
| `SANITY_API_READ_TOKEN` | Vercel env | | | |
| `SANITY_REVALIDATE_SECRET` | Vercel env + Sanity webhook | | | |
| `NEXT_STEP_LEAD_WEBHOOK_URL` | Vercel env | | | |
| `PROGRAM_LEAD_WEBHOOK_URL` | Vercel env | | | |
| `GHL_PROGRAM_LEAD_WEBHOOK_URL` | Vercel env | | | |
| `LEAD_WEBHOOK_URL` | Vercel env | | | |
| `CLIENTVERSE_TOKEN` | GitHub Actions secret | | | |

Public, not secret, recorded for completeness:
`NEXT_PUBLIC_SANITY_PROJECT_ID` ______  ·  `NEXT_PUBLIC_SANITY_DATASET` ______

**Reissue every credential in the owner's own accounts.** Do not carry one across
a handover.

---

## 4. People with access

Everyone who can reach the site, its code, its content or its leads. Anyone not
listed should have no access.

| Name | Service | Role | Granted | Should retain after handover |
| --- | --- | --- | --- | --- |
| | | | | ☐ |
| | | | | ☐ |
| | | | | ☐ |

Removal procedure: `docs/DATA_LIFECYCLE_AND_OFFBOARDING.md` §6. Removing a person
from Sanity does **not** revoke a token they created — check the token list too.

---

## 5. Business facts supplied

The site displays nothing in place of these. Until each is supplied and approved,
the corresponding element is genuinely absent rather than filled with a
placeholder.

| Fact | Value supplied | Supplied by | Date | Broker approved |
| --- | --- | --- | --- | --- |
| Brokerage name | | | | ☐ |
| Licence number | | | | ☐ |
| Licence state | | | | ☐ |
| Business address | | | | ☐ |
| Phone number | | | | ☐ |
| Confirmed service-area cities | | | | ☐ |

**Nothing on this table may be guessed, inferred or rounded.** An unsupplied fact
stays absent.

---

## 6. Compliance approval

| Item | Reviewer | Date | Approved |
| --- | --- | --- | --- |
| Brokerage and licensing language | | | ☐ |
| REALTOR® usage | | | ☐ |
| Fair Housing language | | | ☐ |
| Equal Housing Opportunity language | | | ☐ |
| Privacy policy reflects the actual providers | | | ☐ |
| Terms of use | | | ☐ |
| Accessibility statement | | | ☐ |
| IDX attribution | | | ☐ **or** ☐ not applicable — no feed connected |

Reviewer must be named, per `docs/12-governance/RELEASE_CHECKLIST.md`. "Reviewed"
without a name is not an approval.

---

## 7. Verified working at handover

Do not tick from a document. Tick from having watched it happen.

| Check | Verified by | Date | Result |
| --- | --- | --- | --- |
| Live domain serves over HTTPS with a valid certificate | | | ☐ |
| A test lead submitted and **observed arriving in the CRM** | | | ☐ |
| An article published from the Studio and seen live | | | ☐ |
| An article unpublished and confirmed returning 404 | | | ☐ |
| Draft preview opened from the Studio | | | ☐ |
| A dataset export taken **and restored into a fresh dataset** | | | ☐ |
| A deployment rolled back and promoted forward again | | | ☐ |
| Owner signed in to all five accounts unaided | | | ☐ |

---

## 8. Known open items at handover

Copy the current blockers from `docs/PROJECT_CLOSEOUT_STATUS.md` §1 and §11 so the
owner receives the same picture this repository holds. Do not summarise them away.

| Item | Status | Whose |
| --- | --- | --- |
| | | |
| | | |

---

## 9. Signature

| | Name | Signature | Date |
| --- | --- | --- | --- |
| Delivered by | | | |
| Received by | Debra Allen | | |

Completing this template is **not** client acceptance. That is
`docs/FINAL_CLIENT_ACCEPTANCE.md`.
