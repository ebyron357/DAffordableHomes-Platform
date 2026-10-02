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
- visible breadcrumb navigation
- BreadcrumbList schema
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
| Local SEO | F | **F — blocked** | No verified NAP, licence, service area or Google Business Profile, so no `RealEstateAgent`/`LocalBusiness` markup and nothing for local results to use. |
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
