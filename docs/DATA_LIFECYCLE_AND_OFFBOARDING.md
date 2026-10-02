# Data Lifecycle and Offboarding

**Assessed at commit `d350db2`, 2026-10-02.**

The central fact: **this application stores no personal data.** It has no
database, no session store, no user accounts, and no analytics. A lead
submission is validated, forwarded to the CRM over HTTPS, and then gone from the
application's memory. Everything below follows from that.

---

## 1. What the site collects

### Lead submissions — the only personal data accepted

**`/api/leads/next-step`** (the "Find My Next Step" form on `/start`):

| Field | Classification | Required |
| --- | --- | --- |
| First name | Personal | yes |
| Email address | Personal, contact | yes |
| Mobile number | Personal, contact | no |
| Preferred next step | Preference, allow-listed | yes |
| Selected path, result key, landing intent | Behavioural | no |
| Attribution (string pairs only) | Marketing | no |
| Page URL, submission timestamp | Technical | automatic |

**`/api/leads/program`** (the NACA and Homes for Heroes forms) adds: last name,
phone (required there), current city, desired city, desired ZIP, timeline,
preferred contact method, intent, program stage, service category, a free-text
questions field up to 2,000 characters, referrer, five UTM fields, and an explicit
consent flag which must be `true`.

**`/api/leads/contact`** (the message form on `/contact` and `/consultation`,
added 2026-10-02): name and email (required), a message up to 3,000 characters
(required), and optionally phone, preferred way to connect and buyer stage, both
allow-listed; plus page URL and submission timestamp. It collects no referrer or
campaign tags.

**Not collected anywhere:** date of birth, Social Security number, income,
credit score, bank or account details, uploaded documents, or any other
protected financial information. The site has no field for any of it, and
`AGENTS.md` forbids introducing one.

> **If a visitor types financial details into the free-text questions field**, it
> is forwarded to the CRM like any other text. The field is labelled for
> questions, not documents, and the privacy page should say that financial
> details belong in a direct conversation, not a web form.

### What the site does not collect

| | |
| --- | --- |
| Cookies | **None set by the site**, apart from the draft-mode cookie, which only an authenticated Studio user can obtain |
| Analytics | **None.** No provider is wired, so no visitor is tracked, profiled or fingerprinted |
| Advertising or tracking pixels | None. The CSP has no third-party script origin, so one could not load |
| Visitor accounts | None exist |
| Server-side logging of submissions | The application logs no payload. Vercel's platform logs record requests; the application does not write field values into them |

Embedded YouTube and Vimeo players are loaded only from their privacy-friendly
hosts (`youtube-nocookie.com`, `player.vimeo.com`), and only where an editor adds
a video block.

---

## 2. Where data goes, and where it rests

| Store | Holds | Controlled by | Retention |
| --- | --- | --- | --- |
| **The application** | Nothing. Validated, forwarded, discarded | — | Zero |
| **The CRM** (GoHighLevel or equivalent) | Every lead submission | **Debra Allen** | **Whatever the CRM is configured to do.** This is the only place enquiries persist. |
| **Sanity Content Lake** | Articles, images, editorial drafts, document revision history | Debra, once the project exists | Sanity's own revision history, indefinite unless pruned |
| **Vercel** | Build logs, runtime logs, deployment artifacts | Vercel account owner | Per Vercel's plan |
| **GitHub** | Source code and its full history | Repository owner | Indefinite |

**The retention question has one honest answer: it is the CRM's behaviour, and
no CRM is connected.** Nothing in this repository can set, enforce or document a
retention period for lead data. The moment a webhook URL is supplied, whoever
configures it must record the CRM's retention and deletion settings here. Until
then this section is a gap, not a policy.

---

## 3. Minimisation, in practice

- Every field is bounded by type and by length at the endpoint — the free-text questions field at 2,000 characters, names at 80, addresses at 180.
- Enumerated fields are allow-listed, so an arbitrary value cannot be injected into a CRM record.
- `/api/leads/program` requires explicit `consent === true`; there is no implied consent path.
- No field exists for data the site has no use for.
- The caller's IP address is used for rate limiting **in memory only**, inside a fixed window, and is never forwarded to the CRM or written to a store.

---

## 4. Subject requests

### Access or export

All personal data lives in the CRM. Export it from the CRM. The website has
nothing to export and no endpoint that could produce it.

### Correction

In the CRM.

### Deletion

In the CRM. Deleting there deletes the only copy — the application never had one.
If a submission also triggered an email inside the CRM, check its sent items.

### Objection or withdrawal of consent

In the CRM. There is no mailing list, no profile and no tracking on the website to
opt out of.

**Response procedure:** whoever administers the CRM handles the request there,
records that it was handled, and tells the requester plainly. The website is not
part of the process, and no developer is needed.

---

## 5. Editorial content lifecycle

| Stage | What happens |
| --- | --- |
| Draft | Visible only to authenticated Studio members. An anonymous visitor cannot read a draft — the draft-mode route requires a single-use Studio-minted secret |
| Published | Live within about a minute of publishing, via the signed revalidation webhook |
| Corrected | Edit and publish again; Sanity retains the revision history |
| Unpublished | Set back to draft. The page returns a real 404 and it leaves `/blog` and the sitemap. Nothing is deleted |
| Deleted | Removed from the Content Lake. **Recoverable only from a dataset export** — see `docs/DEPLOYMENT_AND_RECOVERY_RUNBOOK.md` §4 |

The three launch guides are also committed to this repository as a seed, so they
survive any CMS loss. Their URLs must never change.

---

## 6. Offboarding a person

The day someone stops working on the site:

1. **Sanity** — remove them from Members, then check **API tokens** on the same screen and revoke any token they created. Removing a person does not revoke their tokens.
2. **GitHub** — remove the collaborator. If they had admin, review repository secrets and rotate anything they could read.
3. **Vercel** — remove them from the team. If they had Owner, rotate every environment variable they could have viewed.
4. **CRM** — remove the seat. If they had access to lead data, note what they could see.
5. Rotate every secret in `docs/SECURITY_AND_ACCESS_HANDOFF.md` §1 that the person could reach. A credential someone has seen is a credential to rotate, whether or not you suspect misuse.
6. Record it in `ACTIONS.md`.

---

## 7. Offboarding the agency — the handover itself

This is the sequence that makes the site genuinely the owner's.

1. Transfer or recreate the **Vercel** project under Debra's account. It is under the `tradeiq` team today.
2. Delete the duplicate Vercel project `d-affordable-homes-platform-web`.
3. Transfer **GitHub** repository ownership, or add Debra as admin and remove agency collaborators.
4. Create the **Sanity** project under Debra's account, with her as administrator.
5. Confirm the **domain registrar** account is hers, with MFA enabled.
6. Confirm the **CRM** account is hers and the webhook is one she controls.
7. Re-issue every secret in the new accounts. Do not carry a credential across a handover — reissue it.
8. Complete `docs/CLIENT_ACCESS_HANDOFF_TEMPLATE.md` and deliver it privately. **Never commit it.**
9. Remove all agency access.
10. Sign `docs/FINAL_CLIENT_ACCEPTANCE.md` and tick `docs/12-governance/CLIENT_HANDOFF.md` Part 7.

A handover is not complete while any production account belongs to someone other
than the owner. Today, **none of them is hers.**

---

## 8. Shutting the site down safely

If the site is ever to be retired:

1. Export the Sanity dataset and keep the archive (`DEPLOYMENT_AND_RECOVERY_RUNBOOK.md` §4).
2. Export lead data from the CRM, or confirm it should be deleted.
3. Archive the Git repository rather than deleting it — it is the record of what was built.
4. Decide what the domain should serve. Pointing it nowhere breaks every existing link; a holding page or redirects are kinder.
5. Remove the Vercel project **after** the domain is re-pointed, not before.
6. Delete the Sanity dataset only once the export is verified by importing it into a fresh dataset.
7. Revoke every credential in `SECURITY_AND_ACCESS_HANDOFF.md` §1.
8. Keep the required notice pages reachable for as long as any obligation attached to them runs.

### Deletion order matters

Domain first, then hosting, then content, then credentials. Deleting hosting
before re-pointing the domain leaves every link dead with no explanation.

---

## 9. Compliance notes

- **Fair Housing and Equal Housing Opportunity** language is a release gate. It is not satisfied by this document.
- **The privacy policy** at `/privacy` cannot be final while the CRM and analytics providers are undetermined. It must name the actual providers and describe the actual retention behaviour before launch.
- **No protected financial information** is collected, and none may be added without a documented review.
- **Clara**, if built, must never give legal, tax, lending or individualised financial advice, and must never promise approval. Its data handling is not covered here because it does not exist.
- **MLS/IDX data**, if ever connected, carries its own retention, caching and attribution rules set by the provider, which would override parts of this document.
