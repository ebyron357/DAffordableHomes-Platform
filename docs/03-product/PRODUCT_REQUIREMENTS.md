# D'Affordable Homes Product Requirements

**Document type:** Product Requirements Document  
**Status:** Foundation specification  
**Primary owner:** Debra Allen, REALTOR®

## 1. Product vision

D'Affordable Homes is an education-first digital homeownership platform for first-time buyers and renters who need more than a property search. The platform helps people understand the process, assess where they are, create a practical plan, access trustworthy resources, explore homes through a compliant provider, and connect with Debra without pressure.

## 2. Primary outcomes

A successful visitor should be able to:

1. understand one confusing part of the homebuying process
2. identify a realistic next step
3. find an approved resource relevant to that step
4. explore homes or neighborhoods when appropriate
5. book a consultation or workshop without friction
6. feel supported rather than judged or sold to

## 3. Primary audiences

### First-time buyer who feels unsure

Needs plain-language education, reassurance, a sequence of steps, and a low-pressure consultation path.

### Renter preparing for future ownership

Needs readiness planning, affordability education, credit and savings resources, accountability, and time-based guidance without approval promises.

### NACA-curious buyer

Needs accurate introductory education, documentation guidance, process expectations, and a clear boundary between general information and advice from NACA or a qualified professional.

### Active buyer

Needs compliant property search, neighborhood information, verified market context, scheduling, and representation guidance.

### Community participant

Needs workshops, local events, educational videos, community partnerships, and a way to remain connected before becoming an active buyer.

## 4. Product principles

- Education before listings.
- Planning before pressure.
- One clear next step per experience.
- Accuracy before persuasion.
- Accessibility by default.
- Compliance is a release gate.
- External provider failures must be honest and recoverable.
- Personalization must not use discriminatory or Fair Housing-protected criteria.

## 5. Information architecture

### Primary navigation

- Home
- Start Here
- Learn
- Plan
- Explore
- Events
- About Debra
- Contact

### Core routes

- `/`
- `/start`
- `/first-time-buyers`
- `/naca`
- `/resources`
- `/resources/[slug]`
- `/blog`
- `/blog/[slug]`
- `/neighborhoods`
- `/neighborhoods/[slug]`
- `/market-reports`
- `/market-reports/[slug]`
- `/homes`
- `/homes/[provider-route]`
- `/events`
- `/events/[slug]`
- `/about`
- `/testimonials`
- `/faq`
- `/contact`
- `/book`
- `/privacy`
- `/terms`
- `/accessibility`
- `/fair-housing`
- `/equal-housing-opportunity`

Route names may evolve during UX design, but the content responsibilities may not be removed without product approval.

## 6. Core feature requirements

### 6.1 Home page

The home page must:

- explain who D'Affordable Homes serves
- establish the education-first brand promise
- introduce Find Your Next Step
- present Learn, Plan, Explore, and Connect pathways
- establish Debra's verified trust signals
- feature current educational resources or events
- offer one primary consultation CTA and context-specific secondary CTAs
- avoid leading with a generic listing search box

### 6.2 Find Your Next Step

The signature experience must:

- use a short, keyboard-accessible multi-step flow
- ask only questions necessary to recommend educational next steps
- avoid protected-class, steering, qualification, or discriminatory questions
- explain that results are educational and not loan approval or financial advice
- identify a general stage such as exploring, preparing, planning, or actively buying
- recommend approved resources
- offer a consultation when appropriate
- allow completion without submitting contact information
- request consent before sending lead information to GHL
- track start, completion, recommendation, and booking events

### 6.3 Resource library

The library must support:

- topic, journey-stage, format, and locality filters
- accessible search
- articles, videos, checklists, guides, events, calculators, and external resources
- editorial status and review date
- accessible downloadable files
- related resources and next-step CTA
- no publication of unverified financial, legal, tax, program, or market claims

### 6.4 Blog and educational content

Each article must:

- solve one defined problem
- teach one primary idea
- use plain language and a clear heading structure
- include verified sources when factual claims require them
- disclose dates for time-sensitive program or market information
- recommend one practical next step
- include relevant internal links
- include a trust signal and consultation option where appropriate

### 6.5 Neighborhood guides

Guides may include verified information about:

- location and transportation
- housing types and general market context
- parks, public amenities, community resources, businesses, and events
- official school-resource links without subjective school ranking claims
- verified property-search links

Guides must not steer users or characterize neighborhoods using protected classes or proxies. User-facing filters and recommendations must use neutral property and lifestyle criteria reviewed for Fair Housing risk.

### 6.6 Property exploration

Property search must:

- use an approved MLS/IDX provider
- preserve required attribution and disclosures
- display data freshness or provider information where required
- support keyboard and screen-reader navigation
- provide usable mobile filters
- expose loading, no-results, error, and unavailable states
- never display fabricated inventory

### 6.7 Calculators

Mortgage and affordability tools must:

- show all assumptions and inputs
- distinguish estimates from offers, approvals, quotes, or advice
- explain omitted costs and uncertainty
- avoid claiming what a specific user can afford or qualify for
- support keyboard input, validation, readable results, and screen readers
- keep calculation logic in testable pure functions
- avoid transmitting financial inputs unless the user separately consents

### 6.8 Buyer Readiness Quiz

The quiz must:

- educate rather than approve or reject
- use nonjudgmental wording
- explain scoring or stage logic in plain language
- avoid protected-class data
- recommend resources for each result
- allow anonymous completion
- require explicit consent before CRM submission
- include a disclaimer that the result is not lending, legal, tax, or financial advice

### 6.9 Interactive roadmap

The roadmap must:

- explain the journey from exploration through preparation, financing, search, contract, due diligence, closing, and early ownership
- allow users to open each step for education and resources
- distinguish typical process guidance from guaranteed timelines
- support future authenticated progress tracking without requiring it in v1

### 6.10 Events and workshops

Events must support:

- title, description, date, time, timezone, location or virtual details, accessibility information, capacity, registration status, and contact information
- GHL registration integration
- calendar download
- reminders and consent-aware communications
- cancellation and update notices
- event-specific analytics

### 6.11 Consultation booking

Booking must:

- explain what the consultation covers
- disclose any known cost or state clearly when free, only after factual confirmation
- identify what happens after booking
- use an accessible GHL calendar integration or server-side booking flow
- prevent duplicate submissions where practical
- provide confirmation, error, and alternative-contact states
- capture required consent for email or SMS communications

### 6.12 Testimonials and social proof

The platform may publish only approved, verifiable testimonials and media with permission. It must not fabricate, rewrite into materially different claims, or imply results are typical without appropriate context.

### 6.13 Clara

Clara requirements are governed by `docs/09-ai-clara/CLARA_SPEC.md`.

## 7. Trust and transparency requirements

The platform must make verified information available for:

- Debra's REALTOR® designation
- brokerage affiliation
- licensing details required by the applicable jurisdiction and brokerage
- service areas
- certifications only when confirmed
- Equal Housing Opportunity information
- Fair Housing statement
- consultation expectations
- what happens after contact
- when another professional is required

Unconfirmed trust facts must remain unpublished, not replaced with placeholders or estimates.

## 8. Accessibility requirements

All public features must target WCAG 2.2 AA. Manual validation must include:

- keyboard-only navigation
- visible focus
- screen-reader review of critical journeys
- zoom and text resizing to 200 percent
- color contrast
- form labels, instructions, errors, and confirmations
- reduced motion
- media captions or transcripts
- accessible PDF review

Automated checks alone do not constitute acceptance.

## 9. Compliance requirements

Before launch, confirm the applicable requirements for:

- REALTOR® trademark use
- brokerage advertising
- state real-estate licensing disclosure
- Fair Housing
- Equal Housing Opportunity
- MLS/IDX display and attribution
- privacy and data retention
- cookie and analytics consent where applicable
- email and SMS consent
- accessibility statement and contact process

This specification is a product control, not legal advice. Final compliance language must be reviewed by the appropriate brokerage, provider, or qualified professional.

## 10. Analytics requirements

Track at minimum:

- consultation CTA clicks
- booking starts and completions
- contact submissions
- Find Your Next Step starts and completions
- readiness quiz starts and completions
- calculator usage without collecting sensitive inputs by default
- guide downloads
- event registrations
- video engagement
- blog engagement
- resource searches and filters
- property searches and listing-detail views where provider rules allow
- returning visitor behavior
- lead source and conversion path

Event naming must be provider-neutral and documented.

## 11. Nonfunctional requirements

- mobile-first responsive behavior
- progressive enhancement for critical content
- secure server-side provider access
- clear fallback behavior
- content and route metadata
- optimized images and fonts
- performance budgets defined in `ARCHITECTURE.md`
- observability for integration errors
- privacy-minimized logging
- test coverage for critical journeys

## 12. Explicit exclusions from v1.0

Unless separately approved, v1.0 does not include:

- authenticated client portal
- storage of sensitive borrower financial documents
- loan prequalification or underwriting
- automated legal, tax, lending, or personalized financial advice
- native mobile application
- referral marketplace
- paid membership or course system
- multi-market expansion

## 13. Product acceptance definition

The launch is successful only when a representative visitor can complete the following without confusion or inaccessible barriers:

1. understand what D'Affordable Homes does
2. identify the correct starting path
3. learn from a resource
4. receive a useful next-step recommendation
5. explore verified property information when configured
6. book a consultation or event
7. understand privacy, Fair Housing, accessibility, and professional boundaries
