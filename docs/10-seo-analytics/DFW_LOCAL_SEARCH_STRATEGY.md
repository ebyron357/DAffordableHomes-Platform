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
