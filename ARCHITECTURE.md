# D'Affordable Homes Platform Architecture

**Status:** Locked foundation architecture  
**Version:** 1.0  
**Deployment model:** Vercel-hosted Next.js platform with server-side integration adapters

## 1. Architectural objective

Build a modular digital homeownership platform that supports education, planning, compliant property exploration, lead conversion, AI guidance, analytics, and future client experiences without rebuilding the core application.

The public website must remain useful when an optional integration is unavailable. No provider outage may erase core educational content or create false data.

## 2. System overview

```text
Search / Maps / Social / Direct Traffic
                  │
                  ▼
        Next.js Platform on Vercel
     ┌────────────┼─────────────┐
     │            │             │
  Content      Planning      Property
  & SEO         Tools         Exploration
     │            │             │
     └────────────┼─────────────┘
                  ▼
          Server Integration Layer
  ┌─────────┬─────────┬─────────┬──────────┐
  │ GHL CRM │ MLS/IDX │ Google  │ Clara AI │
  │         │         │ APIs    │ Service  │
  └─────────┴─────────┴─────────┴──────────┘
                  │
                  ▼
      Analytics, logging, and governance
```

## 3. Application structure

The implementation should use a workspace that can expand without coupling all features together.

```text
apps/
  web/                       # Next.js public platform and future authenticated portal
packages/
  ui/                        # accessible design-system components
  content/                   # content schemas, parsers, and editorial utilities
  calculators/               # pure mortgage and affordability calculation logic
  integrations/              # GHL, IDX, Maps, Reviews, YouTube, calendar adapters
  clara/                     # prompts, policy, retrieval, tools, and evaluation assets
  analytics/                 # event taxonomy and provider adapters
  config/                    # shared TypeScript, lint, and test configuration
docs/
tests/
.github/
```

Phase 1 may begin as a single Next.js application, but module boundaries must match this target structure so packages can be extracted without redesign.

## 4. Frontend rules

- Next.js App Router, React, and TypeScript strict mode.
- Server Components by default.
- Client Components only for interactive calculators, quizzes, maps, filters, media controls, and similar behavior.
- Tailwind CSS backed by semantic design tokens rather than one-off values.
- Motion must be optional, restrained, and disabled or reduced through `prefers-reduced-motion`.
- Responsive design begins with mobile layouts.
- Every route includes metadata, canonical handling, structured data where appropriate, and accessible heading order.

## 5. Content architecture

The platform must support these content types:

- pages
- educational articles
- FAQs
- guides and downloads
- neighborhood guides
- local market reports
- events and workshops
- videos
- testimonials and client stories with explicit permission
- resource recommendations

Content must be structured, versioned, reviewable, and separable from page presentation. The first release may use repository-managed content. A headless CMS can be introduced through an adapter when editorial scale requires it.

## 6. Integration boundaries

### GoHighLevel

GHL owns CRM records, pipelines, forms, calendars, email, SMS, workflows, tags, custom fields, opportunities, conversations, and review-request automation.

The website must communicate with GHL through server-side endpoints or approved embeds. It must not expose private API credentials in browser code.

### MLS/IDX

Property data must come from a contracted, approved MLS/IDX provider. The adapter must preserve provider attribution, update rules, required disclaimers, and display restrictions.

The platform must show an honest unavailable state when the provider is not configured. It must never replace missing live data with fabricated listings.

### Google services

Use adapters for Maps, Business Profile or Reviews where authorized, YouTube, GA4, Search Console, and optional Google Calendar. Third-party scripts must be loaded intentionally and documented in the privacy and cookie model.

### Analytics

Track meaningful product events through a provider-neutral event layer. The initial providers may include GA4 and Microsoft Clarity, but feature code should emit internal event names rather than call vendors directly.

## 7. Clara AI architecture

Clara is a server-side educational assistant, not a generic chatbot.

Required layers:

1. brand and behavior policy
2. approved knowledge retrieval
3. user-intent classification
4. safety and regulated-topic guardrails
5. approved tools, such as resource lookup and booking handoff
6. response generation
7. citations or source references when knowledge is retrieved
8. escalation to Debra or the correct licensed professional
9. audit logging with privacy minimization
10. quality and safety evaluations

AI provider access must sit behind an internal interface so the model vendor can change without rewriting the experience.

## 8. Security architecture

- HTTPS only.
- Secrets stored in Vercel environment variables or an approved secret manager.
- Strict input validation and output encoding.
- Rate limiting for forms, quizzes with lead capture, and Clara endpoints.
- Bot and spam controls with an accessible fallback.
- Security headers and a documented Content Security Policy.
- Least-privilege integration credentials.
- Dependency scanning and automated updates subject to tests.
- No sensitive financial documents should be uploaded in the public MVP.

## 9. Reliability and fallback behavior

Every external dependency requires:

- timeout handling
- clear user-safe error messaging
- logging without leaking private data
- retry rules where safe
- a non-deceptive fallback
- health visibility for operators

Examples:

- IDX unavailable: preserve educational navigation and invite the visitor to contact Debra; do not display fake inventory.
- GHL unavailable: preserve form input locally only when an approved secure retry mechanism exists; otherwise explain that booking is temporarily unavailable.
- Clara unavailable: show curated next-step resources and consultation options.

## 10. Performance budgets

Release targets:

- Lighthouse Performance 95+
- Accessibility 100
- Best Practices 100
- SEO 100
- LCP under 2.5 seconds
- INP under 200 milliseconds
- CLS under 0.1

Avoid unnecessary client JavaScript, oversized media, blocking third-party scripts, and uncontrolled animation.

## 11. Future expansion

The architecture must allow addition of:

- authenticated client portal
- buyer progress dashboard
- Homeownership Academy
- referral program
- seller resources
- team member experiences
- partner directory
- Spanish-language content
- additional markets
- online courses and memberships
- mobile application

These are future modules, not justification for premature complexity in v1.0.
