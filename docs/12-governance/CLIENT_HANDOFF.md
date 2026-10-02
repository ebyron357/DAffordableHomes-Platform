# Client Handoff

The single index for transferring this site to its owner. Everything else in
`docs/` is reference; this document says who does what, in what order, and what
is still outstanding.

Two audiences, separated deliberately:

- **Part 1–4** are for **Debra Allen**, the site's owner. No command line.
- **Part 5–6** are for whoever maintains the code after handover.

> **Status of this document.** It describes the handover process. It is not a
> record that handover happened. Part 7 is the sign-off, and it is unticked.

### The rest of the closeout set

This document stays the index for *who does what, in what order*. The documents
required by `docs/PROJECT_COMPLETION_STANDARD.md` carry the detail:

| Document | What it is for |
| --- | --- |
| `docs/PROJECT_CLOSEOUT_STATUS.md` | Every requirement with a status and evidence, and the current closure state |
| `docs/CLIENT_USER_MANUAL.md` | The complete owner's manual. Part 4 below is its short version |
| `docs/ADMIN_OPERATIONS_MANUAL.md` | Roles, invitations, environment variables, the API surface |
| `docs/SECURITY_AND_ACCESS_HANDOFF.md` | Secrets by name, account ownership, the security baseline, and what is not covered |
| `docs/DEPLOYMENT_AND_RECOVERY_RUNBOOK.md` | Deploying, rolling back, backup, restore, disaster recovery |
| `docs/DATA_LIFECYCLE_AND_OFFBOARDING.md` | What is collected, where it rests, subject requests, offboarding, shutdown |
| `docs/TROUBLESHOOTING_AND_SUPPORT.md` | Symptom to cause, escalation, and the support that does not exist |
| `docs/CLIENT_ACCESS_HANDOFF_TEMPLATE.md` | Blank template. Complete it **outside** this repository — never commit a filled copy |
| `docs/FINAL_CLIENT_ACCEPTANCE.md` | The acceptance record. Unsigned |

---

## Part 1 — What you are receiving

An education-first website for D'Affordable Homes: 33 public pages, a
homebuying-path quiz, planning calculators, three long-form guides, and three
forms — `/start`, the program pages, and the message form on `/contact` and
`/consultation` — built to route enquiries to your CRM once its webhook
addresses are set (Part 3.3). Until then each form tells the visitor plainly
that it was not sent, rather than accepting a message and losing it.

**What you can change yourself, with no developer:** every article — write,
edit, preview before publishing, unpublish. See Part 4.

**What needs a developer:** page layout, new page types, navigation, colours,
the quiz questions, the calculators, and the trust facts in Part 3.

### What is deliberately missing right now

The site is built to refuse to invent facts about your business. Until you
supply them (Part 3), these are genuinely absent rather than filled with
plausible-looking placeholders:

| Missing | Consequence today |
| --- | --- |
| Your phone number | No phone number appears anywhere on the site |
| Your brokerage name | No brokerage is named |
| Your licence number and state | No licence is displayed |
| Your confirmed service-area cities | Structured data lists no service area; page copy stays regional |
| CRM webhook URLs | **The lead forms do not deliver.** They return an honest "temporarily unavailable" and point the visitor at the consultation page |
| A Sanity CMS project | The three launch guides are served from code. You cannot yet edit them yourself |

None of these are defects. Each is a value only you can provide.

---

## Part 2 — Accounts and credentials

A handover is not complete while the site's accounts belong to someone else. For
each service below, the account must be **in your name, with you as owner**, and
the previous holder's access removed or reduced once you are in.

| Service | What it does | Who must own it | Status |
| --- | --- | --- | --- |
| **Domain registrar** | Holds `daffordablehomes.com` | You | To confirm |
| **Vercel** | Builds and hosts the site | You | Currently under the `tradeiq` team |
| **GitHub** | Stores the source code | You, or your developer with you as owner | Currently `ebyron357` |
| **Sanity** | The content system you write articles in | You | Not yet created |
| **GoHighLevel** (or your CRM) | Receives lead-form enquiries | You | Webhook URLs not yet supplied |

### Why this matters

If the Vercel project stays under someone else's team, you cannot move, rebuild,
or recover your own website without them. Transfer the projects, or create them
fresh in your own accounts and redeploy. Either is fine; leaving them is not.

**No credential belongs in the repository.** CI rejects any committed `.env`
file. Every secret lives in the Vercel dashboard or the GitHub Actions secret
store. `.env.example` lists what is needed without any values.

---

## Part 3 — What you must supply before launch

### 3.1 Business facts

These live in one file, `apps/web/lib/site.ts`, and are all `null` today:

```
brokerageName        licenseNumber        licenseState
businessAddress      phoneNumber          serviceAreas
```

Send your developer the real values; filling them in is the whole change. Each
one appears on its own once it is set, and nothing shows while it is `null`
(`apps/web/lib/business-facts.ts`):

- brokerage, licence, phone and office in both footers, on `/contact`, and on
  `/about` in place of its "published once they are confirmed" notice;
- the phone number as a tap-to-call link;
- once **both** the address and the phone number are set, a local-business
  listing (`RealEstateAgent`) in the site's search markup, with the service
  areas and brokerage when those are set too.

Your broker should approve the wording and placement before the values go in —
Texas expects the sponsoring broker's name wherever a licence holder
advertises. `tests/static/programs.test.mjs` asserts the service-area lists are
empty today and changes with them.

Three further fields are optional and stay `null` unless you want them shown,
because an unverified number here would be a fabricated credential:
`yearsOfExperience`, `familiesServed`, `certifications`.

### 3.2 Compliance language — the hard launch gate

`TECH_DEBT.md` records this as **TD-003, open**. Public launch is blocked until
the following are reviewed and approved, and the reviewer is named in
`RELEASE_CHECKLIST.md`:

- Brokerage and licensing disclosure
- Fair Housing language
- Equal Housing Opportunity language
- REALTOR® mark usage
- Privacy policy, reflecting the providers actually in use
- Terms of use
- Accessibility statement
- IDX attribution — only if MLS data is added later; the site publishes none today

**Texas has its own required disclosures for a real-estate website, and the
exact set is your broker's call, not ours.** Ask your brokerage's compliance
contact what must appear and where. No legal text has been drafted or guessed at
in this repository, and none should be.

### 3.3 CRM delivery

Four webhook URLs, from your CRM, set in Vercel → Settings → Environment
Variables:

```
LEAD_WEBHOOK_URL
PROGRAM_LEAD_WEBHOOK_URL
GHL_PROGRAM_LEAD_WEBHOOK_URL
NEXT_STEP_LEAD_WEBHOOK_URL
```

`LEAD_WEBHOOK_URL` receives the `/contact` and `/consultation` message form;
when it is not set, that form uses the program webhook instead, so a single
GoHighLevel webhook in `GHL_PROGRAM_LEAD_WEBHOOK_URL` is enough for both.
`/start` needs its own `NEXT_STEP_LEAD_WEBHOOK_URL`.

Until these exist the forms are honest about being unavailable rather than
accepting an enquiry and dropping it. After setting them, send one test enquiry
through each form — `/start`, `/programs/naca`, `/programs/homes-for-heroes`,
`/contact` and `/consultation` — and confirm it arrives.

### 3.4 Content system

Follow `docs/13-cms/SANITY_SETUP.md` — it is complete and step-by-step. In
summary: create a project at sanity.io/manage, add the site's CORS origins,
create a Viewer token, set five environment variables in Vercel, then import the
three existing guides so they keep their current URLs.

### 3.5 Hosting cleanup

A second, broken Vercel project — `d-affordable-homes-platform-web`
(`prj_zbCDLJd83aFPMKgLhtpHMVn29XlK`) — fails on every commit. Its Root Directory
is `apps/web` while `vercel.json` sets the output directory to `apps/web/.next`,
so it looks in `apps/web/apps/web/.next` **after a completely successful build**.
No code change fixes it without breaking the working project.

Delete that project, or correct its Root Directory. The working one is
`daffordablehomes-platform`.

---

## Part 4 — Day-to-day, once you are live

### Publish an article

1. Go to `https://daffordablehomes.com/studio` and sign in.
2. **Articles → Drafts → Create.**
3. Fill in every required field — the Studio will not let you publish without
   them: title, slug, eyebrow, excerpt, author, category, publish date, reading
   time, SEO description, and at least one body block.
   A **featured image is optional**. Leave it empty and the article shows the
   brand plate instead. Only attach a photograph that is genuinely of that
   article's subject and cleared for use — and give it real alt text describing
   what is in it.
4. Use the **Presentation** tool to read it as a page before anyone else can.
5. Set `publicationState` to `published` and press **Publish**.

It appears on `/blog`, at its own URL, and in the sitemap.

**Never change the slug of an article that is already published.** The URL is a
promise to everyone who has linked to or bookmarked it.

### Correct a business fact

Phone number, brokerage, licence, service areas: these are in code, not the
Studio. Send them to your developer. This is intentional — they are compliance
statements, not content.

### Something looks wrong on the live site

`docs/12-governance/ROLLBACK_CHECKLIST.md` is the procedure. The short version:
Vercel keeps every previous deployment and can roll back to the last good one in
a couple of clicks. Do that first, diagnose second.

### An article shows "temporarily unavailable"

The content system is unreachable. Published articles are held in memory and
keep serving where they can; a page with nothing cached says so honestly rather
than 404ing, because a 404 would tell readers the article had been withdrawn.
It clears when Sanity is reachable again. If it persists, check status.sanity.io.

---

## Part 5 — Launch sequence

In order. Each step assumes the one above it is done.

1. Business facts supplied (3.1) and wired in.
2. Compliance language approved (3.2) and the reviewer named in
   `RELEASE_CHECKLIST.md`.
3. Hero imagery approved — see `PROJECT_ROADMAP.md`; the gate is open and the
   current stills are registered as candidates in
   `docs/05-content/IMAGE_ASSET_REGISTER.md`.
4. CRM webhooks set (3.3) and one test enquiry confirmed through each form.
5. Sanity project created, variables set, three guides imported, URLs verified
   unchanged (3.4).
6. Duplicate Vercel project removed (3.5).
7. Work merged to `main`.
8. `daffordablehomes.com` and `www` attached to the `daffordablehomes-platform`
   project; DNS set at the registrar.
9. Full gate set re-run **against the live domain**, not the preview.
10. `docs/12-governance/DEPLOYMENT_CHECKLIST.md` and
    `POST_RELEASE_MONITORING.md` worked through.
11. Accounts transferred (Part 2) and Part 7 signed.

---

## Part 6 — For the maintaining developer

### Repository map

| Concern | Location |
| --- | --- |
| Application | `apps/web` (Next.js App Router, React, TypeScript strict) |
| Business facts and trust gating | `apps/web/lib/site.ts` |
| CMS schema, client, queries | `apps/web/cms/`, `apps/web/lib/blog/` |
| Migration seed for the three guides | `apps/web/lib/blog/seed/` |
| Static tests | `tests/static/*.test.mjs` |
| Browser gates | `scripts/qa/` |
| Contrast gate | `scripts/check-contrast.mjs` |
| Governance rules every contributor follows | `AGENTS.md` |

### Running the gates

```bash
pnpm install --frozen-lockfile
pnpm test:all                                  # typecheck, lint, tests, build

pnpm build
sh scripts/qa/serve.sh 3111 "$PWD/.qa-server.log"
pnpm qa:contrast                               # WCAG AA pairs
pnpm qa:audit                                  # route crawl, structure, responsive
pnpm qa:quiz                                   # quiz end-to-end
pnpm qa:faces                                  # portrait crop safety
```

All of these run in CI on every pull request. `qa-evidence/` is tracked;
regenerating it produces JPEG re-encode noise, so discard it with
`git checkout -- qa-evidence/` unless rendering actually changed.

### Ground rules

Read `AGENTS.md` first — it governs this repository and is not optional. The two
that catch people out:

- **Never fabricate** listings, reviews, credentials, certifications, statistics,
  loan outcomes or testimonials. If a fact is unverified it stays `null` and the
  UI shows an honest gap.
- **Never convert a skipped, blocked or no-op check into a pass.** A green tick
  that means nothing is worse than a red one that means something.

---

## Part 7 — Handover sign-off

Unticked until each is true and evidenced.

- [ ] Business facts supplied and live on the site
- [ ] Compliance language approved; reviewer named in `RELEASE_CHECKLIST.md`
- [ ] Hero imagery approved and the roadmap gate closed
- [ ] Lead delivery verified end to end with a test enquiry through every form
- [ ] Owner has published, previewed and unpublished an article unaided
- [ ] Domain live, HTTPS valid, `www` and apex both resolving
- [ ] Full gate set passed against the live domain
- [ ] Duplicate Vercel project removed
- [ ] Domain registrar account in the owner's name
- [ ] Vercel project in the owner's account
- [ ] Sanity project in the owner's account
- [ ] CRM account in the owner's name
- [ ] GitHub repository ownership settled
- [ ] Prior holders' access reduced or removed
- [ ] Owner has walked through Part 4 with the developer present
- [ ] Rollback procedure demonstrated once, on a real deployment

**Handover date:** _not yet_
**Owner sign-off:** _not yet_
