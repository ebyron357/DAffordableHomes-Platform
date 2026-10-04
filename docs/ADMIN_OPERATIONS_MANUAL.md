# Admin and Operations Manual

For whoever administers the site day to day: the owner acting as administrator,
or a maintaining developer.

Audience split: Part 1 needs no command line. Parts 2 onward do.

> Several procedures here act on a **Sanity project that does not exist yet**.
> They are written to be correct the day it is created. Where a step cannot be
> performed today, it says so.

---

## Part 1 — Administering content and people

### The roles

Sanity's own role model governs who can do what in the Studio. **The exact set
of roles available depends on the Sanity plan** — confirm what the project
actually offers in `sanity.io/manage` → **Members** before promising someone a
particular role. The table below is the model to aim for.

| Role | Can read drafts | Can edit | Can publish | Can invite others | Can delete the dataset |
| --- | --- | --- | --- | --- | --- |
| **Administrator** | yes | yes | yes | yes | yes |
| **Editor** | yes | yes | yes | no | no |
| **Contributor** | yes | yes | **no** | no | no |
| **Viewer** | yes | no | no | no | no |
| Anonymous visitor | **no** | no | no | no | no |

Give the owner **Administrator**. Give a copywriter **Editor**, or the most
restricted write role the plan offers if someone should review before anything
goes live. Never share one login between people — invitations are free, and an
audit trail is worth having.

### Inviting someone

In `sanity.io/manage`, open the project, then **Members** → **Invite member**.
Enter their email and choose the role from the table above. They set their own
password with Sanity; you never handle it.

### Removing someone

Same screen. Remove the member. Do this the day someone stops working on the
site, not at the end of the month. If they had Administrator, also check
**API tokens** on the same screen for any token they created, and revoke it —
removing a person does not revoke a token they minted.

### What an administrator must never do

- Share a Sanity API token by email or chat. Tokens go into the Vercel dashboard directly.
- Paste a token into a file in the code repository. CI rejects committed `.env` files, but a token pasted into source would get through — and then it is public forever in the Git history.
- Change the slug of a published article. See `docs/CLIENT_USER_MANUAL.md` Part 2.

---

## Part 2 — The repository

### Layout

| Path | What it holds |
| --- | --- |
| `apps/web` | The Next.js application — every public page, the API routes, the Studio mount |
| `apps/web/cms` | Sanity schema, client, environment reading |
| `apps/web/lib/blog` | Article fetching, rendering, embed resolution |
| `packages/integrations` | Shared integration adapters |
| `tests/static` | The contract tests `pnpm test` runs |
| `scripts/qa` | The browser gates |
| `qa-evidence` | Committed evidence from the last recorded gate run |
| `docs` | Governance, product, brand, CMS and handoff documentation |
| `recovered-manus` | **Reference only.** Never build production work from it. |

### Toolchain

Node 24, pnpm 11.9.0 (pinned by `packageManager`). `pnpm-lock.yaml` is committed
and CI installs with `--frozen-lockfile`. There is no `package-lock.json` and
none should be added — see `TECH_DEBT.md` TD-004.

### The commands

```bash
pnpm install --frozen-lockfile
pnpm typecheck           # strict TypeScript
pnpm lint                # ESLint, --max-warnings=0
pnpm test                # the static contract tests
pnpm build               # production build
pnpm test:all            # all four, in that order
```

The browser gates need a built app and a running server:

```bash
pnpm build
sh scripts/qa/serve.sh 3111 "$PWD/.qa-server.log"
pnpm qa:contrast && pnpm qa:audit && pnpm qa:quiz && pnpm qa:faces
```

`qa-evidence/` is tracked. Regenerating it produces srcset-candidate and JPEG
re-encode differences that are capture nondeterminism, not rendering changes —
discard them with `git checkout -- qa-evidence/` unless the rendered output
genuinely changed.

### Ground rules for anyone changing code

From `AGENTS.md`, which governs this repository and takes precedence over this
document:

- Education before lead capture. Every page should help someone understand a concern and find a practical next step.
- Never fabricate a listing, review, credential, certification, statistic, outcome or testimonial.
- WCAG 2.2 AA on every public-facing change. ARIA only where native HTML cannot carry the semantics.
- Server Components by default; a client component only where interaction requires it.
- No presentation component calls a provider directly.
- Every integration needs loading, empty, error and provider-unavailable states.
- Do not write new Playwright, Lighthouse, axe or scanner logic here — extend the central ClientVerse engine instead. The four existing browser scripts are the exception and they run in CI.

---

## Part 3 — Environment variables

Names only. **No value belongs in this repository.** `.env.example` is the
register; it lists every name with no values and is the only `.env*` file CI
permits.

### Where each one lives

| Variable | Scope | Set in | Required for |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | public | Vercel | The CMS to be contacted at all |
| `NEXT_PUBLIC_SANITY_DATASET` | public | Vercel | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | public | Vercel | Optional; defaults to 2026-08-01 |
| `SANITY_API_READ_TOKEN` | **server only** | Vercel | Draft preview. Without it `/api/draft-mode/enable` returns 503 |
| `SANITY_REVALIDATE_SECRET` | **server only** | Vercel, and the Sanity webhook | Publish-triggered revalidation. Must match on both sides |
| `LEAD_WEBHOOK_URL` | **server only** | Vercel | `/api/leads/contact` first choice |
| `PROGRAM_LEAD_WEBHOOK_URL` | **server only** | Vercel | `/api/leads/program` first choice |
| `GHL_PROGRAM_LEAD_WEBHOOK_URL` | **server only** | Vercel | GoHighLevel alias; **any one of these four delivers every form** |
| `NEXT_STEP_LEAD_WEBHOOK_URL` | **server only** | Vercel | `/api/leads/next-step` first choice |
| `GHL_BOOKING_URL` | public by nature | Vercel | The booking calendar on `/consultation`, and its `frame-src` allowance. Redeploy after changing |
| `CLIENTVERSE_ENDPOINT` | CI | GitHub repository **variable** | The ClientVerse audit |
| `CLIENTVERSE_DEPLOYMENT_URL` | CI | GitHub repository **variable** | The ClientVerse audit |
| `CLIENTVERSE_TOKEN` | CI | GitHub repository **secret** | The ClientVerse audit |

Anything prefixed `NEXT_PUBLIC_` is **visible in the browser**. Never put a
token behind that prefix.

The three ClientVerse values are not read by the application. They live in
GitHub under **Settings → Secrets and variables → Actions** and are consumed by
`.github/workflows/clientverse-audit.yml`. Until all three exist, that check
reports `BLOCKED` and fails. That is intentional: a gate that cannot tell
"passed" from "never ran" is not a gate.

---

## Part 4 — The API surface

Five routes. All five are server-side.

### `POST /api/leads/next-step`

The "Find My Next Step" form on `/start`.

**Controls, in the order they apply:** honeypot field → rate limit (5 per 60
seconds per caller address, 429 with `retry-after`) → minimum elapsed time →
required fields and an allow-listed `preferredNextStep` → server-side address
validation → webhook URL present.

**Forwards:** `firstName`, `email`, `mobile`, `preferredNextStep`,
`selectedPath`, `resultKey`, `source`, `landingIntent`, `attribution`,
`submittedAt`, `pageUrl`.

**Responses:** 200 delivered · 400 invalid · 429 rate-limited or too fast ·
503 no usable lead webhook (see `lib/lead-delivery.ts` for the order) · 502 the
CRM rejected it or timed out (8s).

Every lead route also sends `first_name`, `full_name`, `email` and
`lead_type`, plus `last_name` and `phone` when the visitor gave them (a blank
is left out, never sent empty, so it cannot clear a CRM contact), so one
GoHighLevel mapping fits every form; see `docs/08-integrations/GHL_SETUP.md`.

### `POST /api/leads/program`

The NACA and Homes for Heroes forms. Same controls, bucketed separately as
`leads:program`. Requires explicit `consent === true`.

**Forwards:** name, email, phone, program, source and source page, campaign and
the five UTM fields, referrer, page URL, current and desired city, desired ZIP,
timeline, preferred contact method, intent, program stage, service category,
free-text questions, and the consent flag.

**Responses:** as above, with 503 when neither `PROGRAM_LEAD_WEBHOOK_URL` nor
`GHL_PROGRAM_LEAD_WEBHOOK_URL` is set.

> The rate limit and the address validation on this endpoint were added in
> `d350db2`. Before that it had a honeypot and a timing check only, both of which
> a replayed request satisfies.

### `POST /api/leads/contact`

The message form on `/contact` and `/consultation`. Same controls, bucketed
separately as `leads:contact`; `preferredConnection` and `buyerStage` are
allow-listed. Added 2026-10-02 — before that the form posted nowhere.

**Forwards:** `name`, `email`, `phone`, `preferredConnection`, `buyerStage`,
`message`, `source` (`Consultation request` or `Contact form`), `submittedAt`,
`pageUrl`.

**Responses:** as above, with 503 when none of `LEAD_WEBHOOK_URL`,
`PROGRAM_LEAD_WEBHOOK_URL` or `GHL_PROGRAM_LEAD_WEBHOOK_URL` is set. Behaviour is
covered end to end by `tests/static/contact-endpoint.test.mjs`.

### `POST /api/revalidate`

The Sanity publish webhook. Verifies the signature **before** revalidating
anything. 503 without `SANITY_REVALIDATE_SECRET`, 400 on an unparseable
payload, 401 on a bad signature, 200 and ignored for any document type other
than `article`, `author` or `category` (the article queries dereference the
last two). On any of the three it expires the article cache tag and
revalidates `/blog` and `/sitemap.xml`; on an article it also revalidates that
article's page.

Configure it in Sanity as a POST to `https://yourdomain.com/api/revalidate` with
the shared secret.

### `GET /api/draft-mode/enable` and `/disable`

Draft preview. Validates a **single-use secret the Studio mints** for an
authenticated Studio user, so an anonymous visitor cannot obtain a draft cookie
by guessing a slug. 503 when Sanity is not configured.

---

## Part 5 — Rate limiting, honestly

The limiter is a fixed window held **in the process that serves the request**.
On a platform running several instances it limits per instance, not per
deployment, and a cold start resets it. A request arriving with no usable address
is bucketed under one shared key rather than waved through, so a missing header
cannot be used to opt out.

That is a real reduction in replay volume from one client. It is **not** a
fleet-wide guarantee. The production-grade version is a durable store — Vercel
KV, Upstash, or the edge middleware's own limiter — and it needs provisioning
this repository does not have. Recorded as non-blocking follow-up in
`docs/PROJECT_CLOSEOUT_STATUS.md` §11.

---

## Part 6 — Publishing and release

| Step | Where |
| --- | --- |
| Release checklist | `docs/12-governance/RELEASE_CHECKLIST.md` |
| Deployment steps | `docs/DEPLOYMENT_AND_RECOVERY_RUNBOOK.md` |
| Rollback | `docs/12-governance/ROLLBACK_CHECKLIST.md` |
| After release | `docs/12-governance/POST_RELEASE_MONITORING.md` |
| Editorial standards | `docs/12-governance/PUBLISHING_STANDARD.md` |

A failed required check blocks merge. Re-run a job only for a confirmed
transient failure; do not re-run a deterministic failure instead of fixing it.
