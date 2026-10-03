# Dallas–Fort Worth local search, AEO, and GEO strategy

**Status:** Implemented foundation  
**Primary local-content market:** Garland, Texas  
**Regional context:** Dallas–Fort Worth / North Texas  
**Governing principle:** Local relevance without unsupported service-area, market-data, affiliation, or transaction claims.

## 1. Entity model

The platform consistently identifies:

- D'Affordable Homes as the business and website entity
- Debra Allen as the REALTOR® and human service provider
- Garland, Texas as the first local-content market
- Dallas–Fort Worth as the regional search context
- NACA and Homes for Heroes as independent third-party programs
- Debra's role as real-estate guidance and representation, separate from program qualification, lending, eligibility, savings, rebates, or official administration

Root WebSite, Organization, and Person schema is implemented without publishing an unverified address, phone number, brokerage, license number, or service area.

## 2. Published route architecture

- `/programs`
- `/programs/naca`
- `/programs/homes-for-heroes`
- `/areas`
- `/areas/garland`

The legacy `/naca` route permanently redirects to `/programs/naca`.

## 3. Local SEO implementation

Each published page includes:

- unique title and description
- canonical URL
- Open Graph metadata where appropriate
- semantic heading structure
- visible breadcrumb navigation (every route with the shared masthead; §11)
- BreadcrumbList schema, emitted from those same breadcrumbs
- crawlable internal links
- sitemap inclusion
- robots discovery
- answer-ready local copy
- clear conversion paths
- guarded service-area language

`areaServed` is omitted from Service schema until verified service communities are added to the canonical market configuration.

## 4. AEO implementation

Program and Garland pages use:

- question-based headings
- direct answers immediately after the question
- plain-language program boundaries
- visible FAQ sections
- FAQPage schema only for visible FAQ content
- step-by-step process explanations
- concise definitions of Debra's role
- official-source handoffs where third-party program rules are required

## 5. GEO implementation

Generative engines can distinguish:

- Debra from D'Affordable Homes
- D'Affordable Homes from NACA
- D'Affordable Homes from Homes for Heroes
- real-estate support from mortgage or program administration
- editorial market focus from verified service-area coverage

Content avoids hidden text, fake authors, schema spam, unsupported superlatives, copied city pages, and fabricated statistics.

## 6. City-page publication gate

A future city or community page must not be published by changing only the place name. It requires:

1. verified service relevance or a clearly labeled informational purpose
2. original buyer or seller questions
3. differentiated housing and property-evaluation context
4. useful program relationships
5. nearby-community context
6. approved imagery or an intentional no-image treatment
7. maintainable source records for any statistics
8. a clear conversion path

## 7. Geographic claims withheld

The repository does not currently verify:

- brokerage name
- Texas license number
- business address
- phone number
- exact service-area cities
- NACA affiliation or certification
- Homes for Heroes affiliation or approved-provider status
- transaction history in Garland or any named neighborhood

Those facts remain excluded from visible claims and structured data.

## 8. Recommended next local pages

Publish only after service-area verification and original content inputs:

1. Dallas
2. Mesquite
3. Rowlett
4. Richardson
5. Plano
6. Wylie
7. Rockwall
8. Grand Prairie
9. Irving
10. DeSoto / Duncanville / Cedar Hill regional cluster

The order should be adjusted using verified business coverage, Search Console demand, lead quality, and available local expertise—not city-name volume alone.

## 9. Audit status — 2026-10-02

Measured on a production build of the merged `main` (`2cd81d1`) and again
after the fixes below. Crawl of every sitemap route from raw server HTML (what
a crawler sees without JavaScript), plus Lighthouse in mobile mode.

### What this does not measure

**The site is not live.** `daffordablehomes.com` still serves a GoHighLevel
page branded "Refind Realty", so search and answer engines currently index that
page, not this one. Nothing below earns rankings until the domain is cut over
and the sitemap is submitted. There is no Search Console, Bing Webmaster or
analytics data, and no field Core Web Vitals — only lab numbers.

### Scorecard

| Area | Before | After | Evidence |
| --- | --- | --- | --- |
| Technical SEO | A− | **A** | 31 sitemap routes: all 200, self-canonical, unique titles ≤ 60 characters and descriptions 70–160, one H1, no skipped heading levels, alt text on every image, JSON-LD parses everywhere. Lighthouse SEO 100 on home, an article, a program page and About. |
| Social / share metadata | C+ | **A** | Share image on every route (was 1 of 33); `og:url` per route (23 pointed at `/`); share titles unique per route (23 shared the site default). |
| Structured data | B+ | **A−** | Article author resolves to the site Person `@id` with `jobTitle`; publisher carries its logo; topics spelled as published ("NACA", not "Naca"); Person gains the approved portrait and `knowsAbout`. |
| AEO | B | **B+** | FAQPage on 7 routes, cited official sources on every article, question-led headings. Article `image` stays omitted where an article has no photograph of its own subject — a deliberate choice (ACT-015), so those articles are not eligible for Google's article rich result until one is added in the CMS. |
| GEO | C+ | **B** | `/llms.txt` generated from site sources, including what the site does not do; AI crawlers allowed; content server-rendered. Missing until the owner supplies them: `sameAs` profiles, credentials, address and phone. |
| Local SEO | F | **F — blocked** | No verified NAP, licence, service area or Google Business Profile, so nothing for local results to use. The `RealEstateAgent` markup and the visible NAP are built (`lib/business-facts.ts`) and switch on by themselves once the address and phone are set in `lib/site.ts`; the grade moves only when real facts and a Business Profile exist. |
| Speed (lab) | — | **A− inner, B+ home** | Real-throttled Lighthouse (`--throttling-method=devtools`, median of 3) on a local HTTP/1.1 server: home 91 (LCP 2.78 s, TBT 166 ms, CLS 0.02); `/programs/naca` 94 (LCP 2.17 s, TBT 185 ms). Homepage LCP is the hero still and is bandwidth-bound on this server; a `<link rel=preload>` for it was tried and made no measurable difference, so it was not shipped. The simulated run's homepage 46 was a simulation artefact: a real trace at 4× CPU shows ~320 ms of long-task time and an idle page afterwards. Field data starts at launch. |

### Changed in this pass

- `lib/seo.ts`: one share card, applied explicitly wherever a route declares
  its own `openGraph` (Next replaces, not merges, that object).
- Layout: no static share title or description, `og:url: "./"`, no site-wide
  `robots` (it contradicted the 404's `noindex`).
- Titles over 60 characters and descriptions outside 70–160 rewritten with no
  new claims; CMS article titles drop the brand suffix when it would overflow.
- `/testimonials` and `/market-reports` are `noindex, follow` and out of the
  sitemap until they carry real content; `qa:audit` still crawls them.
- `/llms.txt`.
- `tests/static/search-metadata.test.mjs` pins each fix (mutation-checked).

### To reach A+

Owner-supplied, in order of effect: domain cutover; verified business facts
(unlocks `RealEstateAgent` markup with NAP and licence); Google Business
Profile and social profile URLs (`sameAs`); Search Console and Bing
verification with sitemap submission; analytics; a featured image per article;
real testimonials and market data before the two placeholder pages return to
the index.

## 10. Keyword research and the launch plan — 2026-10-02

Research run in OpenSEO (project "D'Affordable Homes", `daffordablehomes.com`)
for 47 credits. National US volumes and keyword difficulty (KD, 0–100) for 55
candidate queries, then live top-10 results from Garland, Texas for eight of
them. Local-area volumes were not bought (about 116 credits per seed), so the
volumes below are national; treat them as relative demand, not Garland counts.

### Where the demand is

| Query | Monthly searches (US) | KD | Who ranks in Garland today | Our page |
| --- | --- | --- | --- | --- |
| naca | 90,500 | 14 | naca.com | `/programs/naca` |
| how much house can i afford | 90,500 | 47 | national calculators | `/calculators/affordability` |
| naca program | 40,500 | 26 | naca.com, lenders | `/programs/naca` |
| rent vs buy calculator | 14,800 | 49 | national calculators | `/calculators/rent-vs-buy` |
| credit score to buy a house | 8,100 | 24 | — | no page yet |
| down payment calculator | 8,100 | 49 | national calculators | `/calculators/down-payment` |
| first time home buyer texas | 6,600 | 9 | TDHCA, TSAHC, lenders; AI overview | `/programs`, `/first-time-buyers` |
| first time home buyer programs texas | 6,600 | 33 | as above | `/programs` |
| steps to buying a house | 6,600 | 9 | Garland results are off-topic (dance studio, a band) | `/first-time-buyers` |
| homes for heroes | 6,600 | 38 | homesforheroes.com | `/programs/homes-for-heroes` |
| down payment assistance texas | 1,900 | 18 | TDHCA, TSAHC | `/programs` |
| my first texas home program | 720 | 0 | TDHCA | not targeted — see note below |
| closing cost calculator texas | 720 | 28 | — | `/calculators/closing-costs` |
| naca dallas | 260 | 3 | naca.com, NACA workshop sign-up, NBC DFW | `/programs/naca` |
| homes for texas heroes | 260 | 9 | TSAHC flyer, lenders, Reddit | `/programs/homes-for-heroes` |
| dallas homebuyer assistance program | 210 | 0 | City of Dallas, BCL of Texas | `/programs` |
| realtor garland tx | 170 | 0 | **Google local pack** (Westshore, Decorative, TexasSoldEm), then portals | none — needs a Google Business Profile |

### What the results say

1. **The biggest, easiest demand is NACA.** "naca" and "naca program" are high
   volume at low difficulty, and the results are naca.com plus a thin layer of
   lenders and news. An independent, plain-language explainer can earn a place
   under the official site; it should never compete with naca.com on the brand
   name itself.
2. **"First time home buyer" searches in Texas are answered by agencies.**
   TDHCA, TSAHC and the City of Dallas lead, with an AI overview on top. The way
   in is to explain those programs honestly and link to them, not to restate
   their amounts.
3. **"Homes for heroes texas" is a mix-up.** Garland searchers mostly get
   TSAHC's *Homes for Texas Heroes* loan program, which is a different program
   from the national *Homes for Heroes*. Saying so plainly is useful and rare.
4. **"Realtor garland tx" is won in the map pack, not the web results.** Three
   local agents with Google Business Profiles hold the pack; the organic results
   are Realtor.com and Redfin. No on-site change competes here; a verified
   Business Profile does.
5. **Calculator queries are big and hard (KD 47–49).** The pages now use the
   searcher's wording, but expect them to rank slowly against national tools.

### Changed on the site in this pass

- Titles and headings use the searcher's wording, with no new claims:
  "Steps to Buying a House, Explained" (`/first-time-buyers`), "How Much House
  Can I Afford? Calculator", "Closing Cost Calculator", "Down Payment Calculator
  and Planner", "NACA Program Help in Garland and DFW".
- `/programs/naca` answers "How does the NACA program work?" and "Where can I
  find a NACA workshop near Dallas?", in wording consistent with the sourced
  NACA guide. Both are in the page's `FAQPage` markup.
- `/programs/homes-for-heroes` answers "Is Homes for Heroes the same as Homes
  for Texas Heroes?" — no, with who runs each.
- `/programs` gains an "Official sources" section linking to TDHCA, TSAHC, the
  City of Garland, the City of Dallas and Dallas County. It names who runs each
  program and links to the agency's own page; it states no amount, limit or
  eligibility rule of its own (`search-metadata.test.mjs` enforces that).
- `/llms.txt` describes the same.
- "My First Texas Home" is not named on the site. Third-party pages attribute it
  to TDHCA, but TDHCA's own homebuyer page did not show the name when checked on
  2026-10-02 (it renders its content with script). Name it only once a TDHCA
  page confirms it.
- `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` emit the ownership
  `<meta>` tags once set in Vercel (`lib/seo.ts`), so verification needs no code
  change.

### Owner launch plan, in order of effect

1. **Point `daffordablehomes.com` at the new site.** Nothing ranks until it
   does. After cutover, redirect any old GoHighLevel URLs that had traffic.
2. **Verify the site with Google Search Console and Bing Webmaster Tools** —
   paste each "HTML tag" token into the Vercel variables above, redeploy, click
   Verify, then submit `https://daffordablehomes.com/sitemap.xml` to both.
3. **Create and verify a Google Business Profile** for Debra as a real estate
   agent. Use the exact name, address and phone that go into `lib/site.ts`, the
   same everywhere. This is the only route into the "realtor garland tx" map
   pack. Add the brokerage only once the broker approves the wording.
4. **Supply the verified business facts** (`CLIENT_HANDOFF.md` §3.1). The
   footer details and `RealEstateAgent` markup switch on by themselves.
5. **Ask past clients for Google reviews** once the profile exists — real ones
   only, never incentivised or written for them.
6. **Consistent listings** on the major directories (Realtor.com and Zillow
   agent profiles, HAR.com, Yelp, Bing Places, Apple Business Connect) with the
   same name, address and phone, linking to the site.
7. **Connect Search Console and GA4 to the OpenSEO project** so it can find
   pages ranking 4–20 that are close to page one.

### Content to write next (needs Debra's review and sources)

Ranked by demand ÷ difficulty. Each must follow the publishing standard: one
concern, official sources, no amounts that are not sourced and dated.

1. **"What credit score do you need to buy a house?"** — 8,100/month, KD 24.
   General ranges by loan type, from official sources, with "your lender
   decides" up front.
2. **"First-time homebuyer programs in Texas, explained"** — 6,600/month,
   KD 9–33. A long-form guide around the official-sources list now on
   `/programs`, sourced and dated.
3. **"How the NACA program works, step by step"** — the existing NACA guide is
   the natural home; extend it rather than adding a page.
4. **"Homes for Texas Heroes vs. Homes for Heroes"** — 260 + 260/month, low KD,
   and nobody explains the difference.
5. **Garland homebuyer FAQs** once local volumes justify them; the national data
   shows little Garland-specific demand beyond "homes for sale garland tx"
   (3,600/month, transactional), which needs IDX listings this site does not
   have.

## 11. Structure and answer-readiness pass — 2026-10-03

A crawl of every sitemap route's raw server HTML (no JavaScript) measured, per
route, the words inside `<main>`, the internal links, visible breadcrumbs and
the structured-data types. It found the pages aimed at the largest queries in
§10 were the thinnest on the site, and that §3's "each published page includes
BreadcrumbList schema" was true of four routes.

| Route | Query it targets (§10) | Before | After |
| --- | --- | --- | --- |
| `/calculators/affordability` | how much house can i afford — 90,500 | 148 words, 2 links, no breadcrumbs, site graph only | 614 words, 6 links, BreadcrumbList + WebApplication + FAQPage |
| `/calculators/rent-vs-buy` | rent vs buy calculator — 14,800 | 111 words, 2 links | 554 words, 6 links, same markup |
| `/calculators/down-payment` | down payment calculator — 8,100 | 155 words, 2 links | 590 words, 6 links, same markup |
| `/calculators/closing-costs` | closing cost calculator texas — 720 | 136 words, 2 links | 587 words, 6 links, same markup |
| `/calculators/mortgage-payment` | — | 187 words, pre-redesign layout | 570 words, shared masthead, same markup |
| `/first-time-buyers` | steps to buying a house — 6,600, KD 9 | 533 words, no page-level markup | 786 words, FAQPage + BreadcrumbList |
| every masthead route | — | BreadcrumbList on 4 of 31 routes | on 28 of 31 (not `/`, `/blog`, `/start`, which have no trail) |

### Changed

- **Breadcrumbs from one source.** `PageHeader` emits `BreadcrumbList` from the
  same `crumbs` it renders (`lib/seo.ts` → `breadcrumbJsonLd`), so the visible
  trail and the markup cannot disagree. The three hand-written copies on
  `/programs`, `/areas/garland` and the program pages are gone; a test fails if
  one comes back. The calculators and the five policy pages gained trails.
  Only the last crumb is `aria-current="page"` — "Learn" on
  `/first-time-buyers` used to claim it too.
- **Calculator guides.** After each tool: a direct answer to the question the
  page is searched for, what the estimate includes and leaves out, three or four
  questions people ask next (visible, and in `FAQPage`), and links to the two
  most related tools and one guide. Every statement about method is built from
  constants the arithmetic itself uses (`lib/calculators.ts` →
  `lib/content/calculator-guides.ts`); a test re-derives them and fails on any
  percentage that is not one of the calculators' own rules, any dollar amount,
  or any "typical"/"average" market claim. `WebApplication` markup names each
  tool as free and links its publisher to the site Organization.
- **`/first-time-buyers` FAQ** answering "What are the steps to buying a
  house?", when to talk to a lender, who is involved, and whether Texas has
  first-time-buyer programs (named agencies, no amounts).
- **Entities.** `/about` is a `ProfilePage` whose `mainEntity` is the site
  Person. The program pages' `Service.provider` now references that Person by
  `@id`; it was an anonymous Person named "Debra Allen, REALTOR®", which read
  as a second entity. `sameAs` is emitted from `profileUrls` in `lib/site.ts`
  (empty, so nothing today). The `RealEstateAgent` address is published as a
  structured `PostalAddress` when written "Street, City, ST 12345"; a plain
  string, which Google's local results do not accept, was what would have
  shipped the day the address was filled in.
- **`/llms.txt`** lists each calculator with a one-line description of its
  method, from the same guide content.
- FAQPage covers 13 routes. A later pass the same day removed it from the
  homepage, where it described four questions the page no longer showed —
  markup for content a visitor cannot see is a structured-data violation —
  and added a visible "Common worries" group to `/faq`
  (`docs/05-content/CONVERSION_COPY.md`).

### Still not measured

The site is still not live on `daffordablehomes.com`, so §9's caveat stands: no
Search Console, field Core Web Vitals or ranking data exists, and none of this
earns a position until the domain is cut over. The owner's ordered list is
`docs/REMAINING_STEPS.md`.
