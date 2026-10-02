# Security and Access Handoff

**Assessed at commit `d350db2`, 2026-10-02.**

> **This document names secrets. It contains no secret values, and none may ever
> be added to it.** The governance CI job rejects any committed `.env` file other
> than `.env.example`, but that check cannot catch a token pasted into a Markdown
> file. If you are about to paste a value here, stop: it belongs in the Vercel
> dashboard or the GitHub Actions secret store.

---

## 1. Secrets register — names only

| Name | Kind | Stored in | Who needs it | Rotate by |
| --- | --- | --- | --- | --- |
| `SANITY_API_READ_TOKEN` | Sanity viewer token | Vercel environment variables | The deployed app, server-side only | Create a new token in `sanity.io/manage` → **API** → **Tokens**, update Vercel, redeploy, then revoke the old one |
| `SANITY_REVALIDATE_SECRET` | Shared secret | Vercel **and** the Sanity webhook configuration | Both ends of the publish webhook | Generate a new random value, set it in both places, redeploy. It must match or revalidation stops. |
| `LEAD_WEBHOOK_URL` | Webhook URL, treated as a secret | Vercel | The deployed app | Reissue the webhook in the CRM and update Vercel |
| `PROGRAM_LEAD_WEBHOOK_URL` | Webhook URL, treated as a secret | Vercel | The deployed app | As above |
| `GHL_PROGRAM_LEAD_WEBHOOK_URL` | Webhook URL, treated as a secret | Vercel | The deployed app | As above |
| `NEXT_STEP_LEAD_WEBHOOK_URL` | Webhook URL, treated as a secret | Vercel | The deployed app | As above |
| `CLIENTVERSE_TOKEN` | Bearer token | GitHub Actions **secret** | CI only | Reissue with the audit operator, update the repository secret |
| `CLIENTVERSE_ENDPOINT` | URL | GitHub Actions **variable** | CI only | Not a secret; update in place |
| `CLIENTVERSE_DEPLOYMENT_URL` | URL | GitHub Actions **variable** | CI only | Not a secret; update in place |

**A webhook URL is a credential.** Anyone holding one can post fabricated leads
into the CRM. Treat it exactly as you would a password.

### Not secrets

`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` and
`NEXT_PUBLIC_SANITY_API_VERSION` are public by design and visible in the browser.
Nothing sensitive may ever be given a `NEXT_PUBLIC_` prefix.

### Current state

**Every variable above is unset.** No credential has been issued, so none needs
rotating today — but the first act after provisioning each service is to record
who holds it, in `docs/CLIENT_ACCESS_HANDOFF_TEMPLATE.md`, kept outside this
repository.

---

## 2. Account ownership and the roles that matter

| Service | Owner today | Owner required | Access to remove at handover |
| --- | --- | --- | --- |
| Domain registrar | **Unconfirmed** | Debra Allen | Any prior holder |
| Vercel | **`tradeiq` team** | Debra Allen | `tradeiq` team members |
| GitHub | **`ebyron357`** | Debra, or her developer with Debra as owner | Any collaborator no longer working on the site |
| Sanity | **Does not exist** | Debra Allen | n/a until created |
| CRM (GoHighLevel or equivalent) | Debra's | Debra Allen | Any agency seat |

If Vercel stays under someone else's team, the owner cannot move, rebuild or
recover her own website without them. Transfer the project or recreate it in her
account and redeploy. Leaving it is not an option at sign-off.

### Platform roles

| Platform | Role to grant the owner | Role for a maintaining developer | Notes |
| --- | --- | --- | --- |
| Vercel | **Owner** | Member, or Developer scoped to the project | Only Owner can transfer or delete the project, manage billing, or attach a domain |
| GitHub | **Admin** on the repository | Write | Admin is required to manage secrets, branch protection and collaborators |
| Sanity | **Administrator** | Administrator or Editor | See `docs/ADMIN_OPERATIONS_MANUAL.md` Part 1 |
| CRM | **Account owner** | Delegated seat, revocable | The webhook endpoint is the only thing the website needs |

### Multi-factor authentication

The application has no authentication of its own, so MFA is an account control,
not a code change. Enable it on **all five**: the registrar, Vercel, GitHub,
Sanity and the CRM. This is the single highest-value security action available
today and it costs nothing.

---

## 3. Permissions on the application itself

The public site has no user accounts, no sessions, no passwords and no credential
store. The complete list of privileged surfaces:

| Surface | Who can reach it | Control |
| --- | --- | --- |
| `/studio` | Anyone can load the page; only an authenticated Sanity member can read or write content | Sanity identity. `X-Robots-Tag: noindex, nofollow` and a Studio-scoped CSP |
| `/api/draft-mode/enable` | Only a holder of a **single-use secret minted by the Studio** for an authenticated session | `next-sanity`'s `defineEnableDraftMode`. An earlier version checked only that a slug existed, which handed any anonymous visitor a draft cookie and read access to unpublished editorial content. That is fixed. |
| `/api/revalidate` | Only a caller with a valid Sanity webhook signature | Signature verified before anything is revalidated; 401 otherwise |
| `/api/leads/next-step` | Anyone | Honeypot, rate limit, timing check, field validation, allow-listed enum, server-side address validation |
| `/api/leads/program` | Anyone | The same, as of `d350db2` |

---

## 4. Security baseline as shipped

### Headers

Applied to every response: `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=()`,
`X-Frame-Options: SAMEORIGIN`, `X-DNS-Prefetch-Control: on`. The `X-Powered-By`
header is disabled.

### Content Security Policy

Two policies, deliberately separated.

**Public pages** — `default-src 'self'`, `base-uri 'self'`,
`form-action 'self'`, `frame-ancestors 'self'`, `object-src 'none'`,
`connect-src 'self'`, no `unsafe-eval`, no third-party script origin, and frames
restricted to `www.youtube-nocookie.com` and `player.vimeo.com` for the video
embed block.

**`/studio` only** — adds `unsafe-eval`, `blob:`, and the Sanity API origins over
HTTPS and WebSocket, because the Studio compiles GROQ and schema at runtime.

The public policy is matched by a **negative lookahead** so it cannot replace the
Studio policy: Next keeps the last value for a duplicated header key, and a plain
catch-all silently broke the Studio. Both are asserted against the **served
header**, not the config text, in `tests/static/repository.test.mjs`.

### Input handling

Every field on both lead endpoints is bounded by type and by length. Enumerated
values are allow-listed, not merely checked for presence. Email addresses are
validated server-side through one shared check
(`apps/web/lib/lead-validation.ts`), so the two endpoints cannot drift. CMS
citation and related-link URLs are sanitised before being emitted into JSON-LD or
rendered markup.

### Open redirect

`apps/web/lib/safe-path.ts` strips control characters and normalises backslashes.
The WHATWG URL parser removes TAB, LF and CR before parsing, which is the bypass
class this guards against. 13 adversarial cases in
`tests/static/safe-path.test.mjs`.

### Rate limiting — and its real limit

5 requests per 60 seconds per caller address, per endpoint, returning 429 with
`retry-after`. The counter lives **in the serving process**: on several instances
it limits per instance, and a cold start resets it. A request with no usable
address is bucketed under one shared key rather than waved through.

This reduces replay volume from one client. It is not a fleet-wide guarantee, and
nothing in this repository claims otherwise. A durable store is the
production-grade version and is tracked as non-blocking follow-up.

---

## 5. What is not covered

Stated plainly, because an unlisted gap is worse than a known one.

| Gap | Status |
| --- | --- |
| Dependency vulnerability audit in CI | Not implemented |
| Static analysis / CodeQL | Not implemented |
| Secret scanning for leaked credentials | Not implemented. Committing a `.env` is blocked; a token pasted into source is not caught. |
| Web application firewall, bot management | Not configured |
| Alerting on failure | None. Nobody is notified when a deployment or a check fails. |
| Error tracking | None wired |
| Penetration test | Never performed |
| ClientVerse security review | **Has never executed.** Its three secrets are unset, so the check reports `BLOCKED`. Its absence is not a pass. |
| Durable rate-limit store | Not provisioned |

---

## 6. If a credential is exposed

1. **Revoke first, investigate second.** Rotate the affected value in the service that issued it, following §1.
2. If it reached a Git commit, assume it is public permanently. Rotation is the only remedy — removing the commit is not sufficient.
3. For a leaked lead webhook URL, reissue the webhook in the CRM and review recent CRM entries for fabricated leads.
4. For a leaked `SANITY_API_READ_TOKEN`, revoke it in `sanity.io/manage`, issue a new one, update Vercel, redeploy. Assume unpublished drafts were readable while it was valid.
5. For a leaked `SANITY_REVALIDATE_SECRET`, rotate it in Vercel **and** the Sanity webhook together.
6. Record what happened and the follow-up in `ACTIONS.md`.

---

## 7. Handover checklist

Not a claim that any of this is done. Every box is open.

- [ ] MFA enabled on registrar, Vercel, GitHub, Sanity and CRM
- [ ] Vercel project owned by Debra Allen
- [ ] Duplicate Vercel project `d-affordable-homes-platform-web` deleted
- [ ] GitHub repository admin held by Debra Allen
- [ ] Sanity project created, owned by Debra Allen, administrator role assigned
- [ ] Every account listed in §2 confirmed, with prior access removed
- [ ] Every secret in §1 issued and its holder recorded outside this repository
- [ ] `docs/CLIENT_ACCESS_HANDOFF_TEMPLATE.md` completed and delivered privately
- [ ] Rotation owner named for each secret
- [ ] `docs/FINAL_CLIENT_ACCEPTANCE.md` signed
