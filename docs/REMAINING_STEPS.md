# Remaining steps to complete the project

**As of:** 2026-10-03
**Closure state:** `BLOCKED - OWNER ACTION REQUIRED` (unchanged; see `PROJECT_CLOSEOUT_STATUS.md`)

This is the one ordered list of what is left. The detailed instructions already
exist; each step links to them rather than repeating them.

## The short version

The website is built. It passes every automated gate in the repository, its
forms and booking calendar are wired to GoHighLevel, and every page is
structured to be found, quoted and trusted by search engines and AI assistants.

**What it cannot do yet is rank, because it is not live.**
`daffordablehomes.com` still serves an old GoHighLevel page, so Google, Bing
and the AI assistants index that page instead of this one. Most of what stands
between the site and real search traffic is a set of decisions and accounts
only Debra (and her broker) can supply.

### About "ranking in every key area"

No one can guarantee a search position, and anyone who promises one is not
being straight with you. What this project controls — and has done — is making
every page technically eligible, clearly structured, and the best honest answer
to the question it targets. What decides the rest is:

1. **Being live** on the real domain, verified with Google and Bing.
2. **A verified Google Business Profile.** "Realtor Garland TX" is won in the
   map pack, which is entirely Business Profile and reviews — no website change
   competes there.
3. **Consistent name, address and phone** across the site, the profile and the
   major directories.
4. **Real reviews** from real clients.
5. **Time, and a steady supply of useful, sourced articles.**

Steps 1–4 below are those levers, in order of effect.

---

## Part A — Owner steps, in order

| # | Step | Why it matters | How |
| --- | --- | --- | --- |
| 1 | **Move the accounts into Debra's name** — Vercel (currently the `tradeiq` team), domain registrar, GitHub, and delete the duplicate Vercel project that fails every build | Whoever owns the accounts owns the site | `CLIENT_HANDOFF.md` Part 2 and §3.5 |
| 2 | **Supply the verified business facts** — brokerage name, Texas licence number, office address written `Street, City, ST 12345`, phone, the cities Debra actually serves, and the links to her own public profiles (Google Business Profile, Realtor.com/Zillow/HAR agent pages, LinkedIn, business Facebook) | Turns on the footer details, the `RealEstateAgent` local markup with a structured address, and `sameAs` links that tie the site to Debra elsewhere. Without them local search grades **F**. | Fill in `UNVERIFIED_TRUST_FACTS` in `apps/web/lib/site.ts` (one line each), or send them to the developer. `CLIENT_HANDOFF.md` §3.1 |
| 3 | **Broker sign-off on compliance language** — Texas IABS and Consumer Protection Notice placement, Fair Housing, Equal Housing Opportunity, REALTOR® usage | Hard launch gate; this repository cannot certify legal wording | `CLIENT_HANDOFF.md` §3.2, `RELEASE_CHECKLIST.md` |
| 4 | **Connect GoHighLevel** — one Inbound Webhook workflow (`GHL_PROGRAM_LEAD_WEBHOOK_URL`), the field mapping, and the booking calendar link (`GHL_BOOKING_URL`); then one test submission per form and one test booking | Until this is done **no form reaches Debra**; each says so honestly instead of pretending | `docs/08-integrations/GHL_SETUP.md` — complete step by step |
| 5 | **Decide about text messages** — if GoHighLevel will text leads, approve SMS consent wording (carrier A2P 10DLC rules) | Automated texts to leads without that consent are a compliance risk | `GHL_SETUP.md` → "Before turning on text messages" |
| 6 | **Approve the homepage hero photograph** — the one open visual sign-off. The four business facts the conversion copy relies on (free consultation, no commitment, Debra replies personally, phone or video) were **confirmed on 2026-10-03** and need nothing further | The hero still is an owner-review gate in the roadmap | Review on the Vercel preview; the confirmed facts and where they appear are in `docs/05-content/CONVERSION_COPY.md` §1 |
| 7 | **Create the Sanity project** and import the seed | Lets Debra publish and correct articles herself | `docs/13-cms/SANITY_SETUP.md` |
| 8 | **Point `daffordablehomes.com` at the new site**, and redirect any old GoHighLevel page URLs that had traffic | **Nothing ranks until this happens** | `CLIENT_HANDOFF.md` Part 5, `DEPLOYMENT_AND_RECOVERY_RUNBOOK.md` |
| 9 | **Verify with Google Search Console and Bing Webmaster Tools**; submit `https://daffordablehomes.com/sitemap.xml` to both; request indexing for the home page, `/programs/naca`, `/first-time-buyers` and `/calculators/affordability` | Bing also feeds ChatGPT search and Copilot answers | Paste the tokens into `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION`, redeploy, click Verify. `CLIENT_HANDOFF.md` §3.6 |
| 10 | **Create and verify a Google Business Profile** (real estate agent), with the exact name, address and phone from step 2 | The only way into the "realtor garland tx" map pack | `CLIENT_HANDOFF.md` §3.6 |
| 11 | **List the business consistently** — Bing Places, Apple Business Connect, Realtor.com, Zillow, HAR.com, Yelp — same name, address and phone, each linking to the site | Consistency is what local search trusts | `DFW_LOCAL_SEARCH_STRATEGY.md` §10 owner plan |
| 12 | **Ask past clients for Google reviews** — real ones, never incentivised or written for them | Reviews drive map-pack position and are what AI assistants quote | — |
| 13 | **Choose analytics** (GA4 and/or Microsoft Clarity) and whether a consent banner is required | No traffic or conversion data exists until then; the privacy page will need updating | `ARCHITECTURE.md` → Analytics |
| 14 | **Supply the ClientVerse audit values** (`CLIENTVERSE_ENDPOINT`, `CLIENTVERSE_DEPLOYMENT_URL`, `CLIENTVERSE_TOKEN`) | Release-certification gate that has never run | `PROJECT_CLOSEOUT_STATUS.md` blocker 5 |
| 15 | **Sign off** | Handover is not complete until it is recorded | `CLIENT_HANDOFF.md` Part 7, `FINAL_CLIENT_ACCEPTANCE.md` |

## Part B — Search, answer-engine and AI-assistant readiness, by area

| Area | Where it stands | What is left, and who |
| --- | --- | --- |
| **Technical SEO** | **A.** Every sitemap route returns 200, has a self-canonical, a unique title ≤ 60 characters and description 70–160, one H1, ordered headings, alt text, valid JSON-LD; share images everywhere; placeholder pages kept out of the index; robots and sitemap correct | Nothing on the code side. Lighthouse and Core Web Vitals on the production domain after step 8 |
| **On-page targeting** | Every query in the keyword research with a page has that page titled and answered in the searcher's wording (`DFW_LOCAL_SEARCH_STRATEGY.md` §10–11) | One gap with real demand and no page: **"credit score to buy a house"** (8,100/month, low difficulty). Needs a sourced article Debra approves — see Part C |
| **Structured data** | WebSite, Organization and Person graph on every page; BreadcrumbList on 28 of 31 routes; FAQPage on 13, each for questions the page visibly shows; Article with cited sources on every guide; WebApplication on all five calculators; ProfilePage on `/about`; Service on the program pages, linked to Debra by `@id` | `RealEstateAgent` (local business), the structured address and `sameAs` switch on by themselves after step 2 |
| **Answer engines (AEO)** | Question-led headings and direct answers on the program pages, the Garland guide, every article, all five calculators and `/first-time-buyers`, each in matching FAQ markup | Articles have no featured image of their own, so they are not eligible for Google's article rich result until one is added per article in the CMS (Debra, after step 7) |
| **AI assistants (GEO)** | `/llms.txt` maps the site, including every calculator's method and what the site does **not** do; AI crawlers are allowed; all content is server-rendered; Debra, the business and the third-party programs are distinct, linked entities | Profiles (step 2), reviews (step 12) and mentions on other reputable sites are what make assistants confident enough to name Debra |
| **Local search** | **F — blocked.** All markup and display are built and waiting | Steps 2, 10, 11, 12 |
| **Speed** | Lab: home 91, inner pages 94 (mobile, throttled) | Field data begins at launch; re-measure after step 8 |
| **Off-site authority** | None yet | Local chamber of commerce and community listings, lender and inspector partners, NACA workshop and community-event pages that link back — earned, never bought |

## Part C — Content to write next (Debra reviews each before it publishes)

From the keyword research, ranked by demand against difficulty. Each must
follow `PUBLISHING_STANDARD.md`: one clear concern, official sources linked and
dated, no amount or eligibility rule that is not sourced, and "your lender
decides" wherever it is the lender's decision.

1. **What credit score do you need to buy a house?** — 8,100/month, KD 24.
   Ranges differ by loan type and lenders set their own; cite the agencies'
   current pages (HUD for FHA, VA, USDA, Fannie Mae / Freddie Mac) on the day it
   is written, because these rules change.
2. **First-time homebuyer programs in Texas, explained** — 6,600/month. A
   long-form guide around the official-sources list already on `/programs`.
3. **How the NACA program works, step by step** — extend the existing NACA
   guide rather than adding a page.
4. **Homes for Texas Heroes vs. Homes for Heroes** — low competition, and
   nobody else explains the difference.
5. **One article a month after that**, chosen from Search Console queries where
   the site ranks 4–20 (step 9 makes that data available).

## Part D — Engineering follow-ups (not blocking launch)

| Item | Status |
| --- | --- |
| Analytics event layer (bookings, form submissions, quiz completions, calculator use) | Waits on step 13; the event names exist in `lib/analytics.ts` |
| Formatting check, dependency audit, secret scanning and Lighthouse budgets in CI | `docs/12-governance/CI_PLAN.md` items 3, 9, 10 |
| Rate limiting shared across server instances (today it is per instance) | `lib/rate-limit.ts` documents the limit; move to Vercel Firewall or a shared store when traffic warrants |
| MLS / IDX property search | Needs a contracted provider; until then `/homes` shows an honest unavailable state |
| Clara, the AI homeownership guide | v1.2, per `docs/09-ai-clara/CLARA_SPEC.md` |
| `/testimonials` and `/market-reports` back in the index | Only once they hold real, permissioned testimonials and sourced market data |
| Manual keyboard and screen-reader review (WCAG 2.2 AA) | Release gate; automated checks pass but do not replace a person |

## Part E — The first 90 days after launch

- **Week 1:** confirm Search Console and Bing show the sitemap processed and the
  key pages indexed; fix anything flagged under Page indexing.
- **Month 1:** Business Profile live with photos, services and weekly posts;
  first reviews requested; directory listings consistent.
- **Months 2–3:** publish the Part C articles in order; review Search Console
  monthly for pages ranking 4–20 and strengthen those first; re-run Lighthouse
  on the production domain.
- **Every quarter:** the operating review in `PROJECT_ROADMAP.md`.
