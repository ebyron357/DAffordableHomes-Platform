# Troubleshooting and Support

**Assessed at commit `d350db2`, 2026-10-02.**

> **There is no support contract, no on-call rotation, and no alerting.** Nobody
> is notified automatically when something fails. Discovery is by someone
> looking. That is the honest position, and §5 says what to do about it.

Part 1 needs no command line. Parts 2 onward do.

---

## 1. For the owner — what you might see

### An article says "temporarily unavailable"

The content system could not be reached. The site is telling the truth rather
than showing a blank page.

**What to do:** wait two minutes and reload. If it persists, check
[status.sanity.io](https://status.sanity.io). If Sanity is healthy and the message
stays, it is a configuration problem — tell your developer, and point them at
Part 3 of this document.

Your three launch guides are also stored in the code, so they keep working even
if the content system is unavailable.

### A form says "Online lead delivery is not configured yet"

**Expected today.** Your CRM is not connected. The visitor is sent to the
consultation page — whose own message form is also not connected, and the site
publishes no phone or email yet — so the enquiry is **not captured anywhere**.
`docs/12-governance/CLIENT_HANDOFF.md` Part 3.3 fixes the `/start` and program
forms; the `/contact` and `/consultation` form needs a separate code change.

### A form says "Lead delivery is temporarily unavailable"

Different message, different cause: the CRM **is** configured but rejected the
submission or did not answer within 8 seconds. Check whether your CRM is up and
whether the webhook is still active.

### A form says "Too many submissions. Please wait a moment"

The spam protection working. Five submissions in a minute from the same place
trips it. It clears itself within a minute.

### An article I published is not showing

1. Is the publication state set to published, not draft?
2. Did you press publish, or only save?
3. Wait a minute — updates are not instant.
4. Still missing: the publish webhook may not be reaching the site. That is Part 3.

### A page shows "not found"

If it is an article you unpublished, that is correct behaviour. If it is a page
that used to work, somebody changed an address — see Part 3, and note that
changing a published article's slug is the one thing `CLIENT_USER_MANUAL.md`
Part 2 says never to do.

### The site shows no phone number, brokerage or licence

**Correct, and deliberate.** Those facts have not been supplied, and the site
refuses to invent them. `CLIENT_HANDOFF.md` Part 3.1.

### Something looks visually wrong

Note the page, the device, and the browser, and take a screenshot. Those three
details are what make it reproducible; without them it usually cannot be chased.

---

## 2. First moves for a developer

| Question | How to answer it |
| --- | --- |
| Is it the site or the platform? | Vercel → the project → **Deployments**. Is the current production deployment Ready? |
| Which commit is live? | The deployment detail page shows the SHA. Compare it with `main`. |
| Is it a build failure or a runtime failure? | Build logs versus runtime logs, both in the Vercel deployment view |
| Did CI catch it? | GitHub → **Actions**. Three workflows run: governance, typecheck/lint/test/build, browser QA |
| Does it reproduce locally? | `pnpm install --frozen-lockfile && pnpm test:all`, then serve the build and run the four QA gates |

### Reproduce a production build exactly

```bash
git checkout <sha>
pnpm install --frozen-lockfile
pnpm build
sh scripts/qa/serve.sh 3111 "$PWD/.qa-server.log"
```

---

## 3. Symptom to cause

### "Temporarily unavailable" on articles

| Check | Meaning |
| --- | --- |
| Is `NEXT_PUBLIC_SANITY_PROJECT_ID` set in Vercel? | If not, the Content Lake is never contacted. Only the committed seed renders. **This is the state today.** |
| Is `NEXT_PUBLIC_SANITY_DATASET` correct, usually `production`? | A wrong dataset name looks exactly like an outage |
| Is Sanity itself up? | status.sanity.io |
| Did a token expire? | Sanity → **API** → **Tokens** |

### A published article never appears

| Check | Meaning |
| --- | --- |
| Is `SANITY_REVALIDATE_SECRET` set in Vercel **and** identical in the Sanity webhook? | A mismatch means every webhook call returns 401 and nothing revalidates |
| Does the webhook point at `https://<domain>/api/revalidate`? | A stale preview URL silently fails |
| What does the webhook's delivery log show? | 503 = secret unset in Vercel · 401 = signature mismatch · 400 = unparseable payload · 200 with `revalidated: false` = the document was not an `article` |
| Is the document actually published? | Draft documents are intentionally invisible |

### Draft preview returns 503

`SANITY_API_READ_TOKEN` is unset, or the Sanity project variables are missing.
By design: the route refuses rather than quietly serving published copy in place
of a draft.

### Draft preview returns 401 or will not open

The preview secret is single-use and minted by the Studio for an authenticated
session. Open the preview **from the Studio**, not from a copied URL. A reused
link is expected to fail — that is what stops an anonymous visitor obtaining a
draft cookie.

### A lead form returns 503

The relevant webhook variable is unset: `NEXT_STEP_LEAD_WEBHOOK_URL` for
`/start`, or `PROGRAM_LEAD_WEBHOOK_URL` / `GHL_PROGRAM_LEAD_WEBHOOK_URL` for the
program forms. **This is the state today for all of them.**

### A lead form returns 502

The webhook is configured but the CRM rejected the request or exceeded the
8-second timeout. Check the CRM's inbound log, and that the webhook has not been
rotated or disabled.

### A lead form returns 400 on a submission that looks fine

Either the address failed the server-side shape check, a required field is empty,
`preferredNextStep` is not one of the allow-listed values, or — on the program
form — `consent` was not `true`. The browser's own `type="email"` validation is
bypassable, so the server checks independently.

### Everything returns 429

The rate limit, 5 per 60 seconds per caller address. If legitimate traffic trips
it, the per-instance limiter is the wrong tool for that volume and needs the
durable store tracked in `docs/PROJECT_CLOSEOUT_STATUS.md` §11.

### The Studio will not load

Almost always the Content Security Policy. `/studio` has its own policy allowing
`unsafe-eval` and the Sanity origins; the public policy would block it. The two
are kept apart by a negative lookahead, because Next keeps the **last** value for
a duplicated header key and a plain catch-all silently replaced the Studio policy
once already. Check the **served** `Content-Security-Policy` header on `/studio`,
not the config file. `tests/static/repository.test.mjs` asserts this.

### A Vercel deployment fails with `NEXT_OUTPUT_DIR_MISSING`

You are looking at the duplicate project `d-affordable-homes-platform-web`. Its
Root Directory `apps/web` doubles with `vercel.json`'s
`outputDirectory: apps/web/.next`, so the lookup lands on
`apps/web/apps/web/.next`. **No code change fixes it.** It fails on every branch
including `main`, and the right action is to delete the project.
`docs/DEPLOYMENT_AND_RECOVERY_RUNBOOK.md` §1.

### The ClientVerse check is red, or missing

Red with `BLOCKED` means its three values are unset — expected, and deliberate.
**Missing on a pull request** is also expected: the workflow runs only on push to
`main` and manual dispatch. Absence is not a pass, and no other check satisfies
this gate.

### CI fails but it passes locally

| Likely cause | Check |
| --- | --- |
| Lockfile drift | CI uses `--frozen-lockfile`. Commit the lockfile change |
| Node version | CI is Node 24 |
| Chromium | CI installs its own; locally the browser gates may need `CHROMIUM_PATH` pointed at the container's build |
| A governance file was moved or emptied | The governance job checks a required-files list |
| A merge-conflict marker was committed | The governance job rejects them |

---

## 4. Escalating

| Problem | Who |
| --- | --- |
| Site down, deployment broken | Whoever maintains the code; Vercel support if the platform is at fault |
| Content system down | Sanity status page, then Sanity support |
| Leads not arriving | The CRM administrator first — the website reports honestly whether it delivered |
| Domain or DNS | The registrar |
| A compliance or Fair Housing concern | **Debra's broker, immediately.** Not a developer question |
| A legal, tax, lending or individualised financial question | The relevant licensed professional. Neither the site nor its maintainers may answer these |
| A credential may be exposed | `docs/SECURITY_AND_ACCESS_HANDOFF.md` §6 — **revoke first, investigate second** |
| An accessibility barrier reported by a visitor | Treat as a defect, not feedback. `/accessibility` is a public commitment |

---

## 5. What support does not exist

| Gap | Consequence |
| --- | --- |
| No alerting | A failed deployment or a broken form is noticed by a person, not a system |
| No error tracking | A runtime error is only visible in Vercel logs, if someone looks |
| No uptime monitoring | An outage is discovered by a visitor |
| No on-call | There is no response-time commitment, and none should be promised to the owner |
| No support contract | Who fixes what, and how quickly, is not agreed |

**The cheapest meaningful improvements**, in order: an uptime check on the home
page with email alerts; Vercel deployment-failure notifications to an address the
owner reads; an error tracker. None is a release blocker, and all three are
recorded as non-blocking follow-up in `docs/PROJECT_CLOSEOUT_STATUS.md` §11.

---

## 6. Before you report a problem

Have these ready. Without them most reports cannot be chased.

1. The exact URL.
2. What you expected, and what happened.
3. Device and browser.
4. A screenshot, and the exact text of any error message.
5. When it started, and whether it is every time or sometimes.
6. For a developer: the deployment ID and commit SHA from Vercel.
