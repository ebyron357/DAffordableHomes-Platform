# D'Affordable Homes Platform

> **Homeownership has steps. You don't have to learn them alone.**

D'Affordable Homes is an education-first digital homeownership platform led by **Debra Allen, REALTOR®**. It is designed for first-time buyers and renters who need clear guidance, practical planning tools, trustworthy resources, and a supported path from questions to keys.

## Product mission

Every digital interaction should help a visitor feel:

- I can breathe.
- I understand more than I did before.
- I know my next step.
- Debra can help me move forward.

## Core experiences

### Learn

Educational articles, videos, FAQs, buyer resources, neighborhood guides, NACA information, workshops, and local market reports.

### Plan

Buyer Readiness Quiz, mortgage and affordability tools, an interactive homeownership roadmap, personalized resource recommendations, and the signature **Find Your Next Step** experience.

### Explore

Compliant MLS/IDX search, featured listings supplied by an approved provider, neighborhood guides, community maps, and local market snapshots.

### Connect

Consultation booking, accessible forms, GHL CRM workflows, workshop registration, and **Clara — Your Homeownership Guide**.

## Locked architecture

- **Frontend:** Next.js, React, TypeScript
- **UI:** Tailwind CSS and accessible motion
- **Hosting:** Vercel
- **CRM and automation:** GoHighLevel
- **Property search:** approved MLS/IDX provider
- **Integrations:** Google Maps, YouTube, Google Reviews, GA4, Search Console, Microsoft Clarity, and optional Google Calendar
- **AI:** server-side Clara service with retrieval, safety guardrails, escalation, analytics, and provider abstraction

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the system boundary and implementation rules.

## Quality targets

- WCAG 2.2 AA on every public experience
- Lighthouse: 95+ Performance, 100 Accessibility, 100 Best Practices, 100 SEO
- LCP under 2.5 seconds
- INP under 200 milliseconds
- CLS under 0.1
- No fabricated listings, reviews, credentials, market statistics, approvals, or testimonials
- No secrets, tokens, private client data, or production credentials committed to Git

## Delivery phases

1. **v1.0 Launch:** core website, design system, GHL integration, IDX search, blog, resource library, consultation booking, and SEO foundations.
2. **v1.2 Growth:** Clara, readiness quiz, affordability tools, interactive roadmap, market reports, and email automation.
3. **v2.0 Market Leader:** client portal, personalized dashboards, Homeownership Academy, community event management, referral program, and optional mobile experience.

## Repository map

```text
.
├── AGENTS.md
├── ARCHITECTURE.md
├── PROJECT_ROADMAP.md
├── docs/
│   ├── 01-executive/
│   ├── 02-brand/
│   ├── 03-product/
│   ├── 04-design-system/
│   ├── 05-content/
│   ├── 06-accessibility/
│   ├── 07-compliance/
│   ├── 08-integrations/
│   ├── 09-ai-clara/
│   ├── 10-seo-analytics/
│   ├── 11-security/
│   └── 12-governance/
├── .github/               # issue templates and initial repository-health workflow
├── ACTIONS.md             # execution log and validation history
├── TECH_DEBT.md           # unresolved technical debt register
├── DECISIONS.md           # architecture decision log
├── RISKS.md               # production risk register
├── CHANGELOG.md           # notable repository changes
└── apps/                  # application code begins in Phase 1
```

## Current status

**Repository foundation in progress.** Governance documentation, production-readiness registers, issue templates, and an initial repository-health workflow are in place. The repository is **not production ready** until the Next.js application, CI quality gates, provider integrations, compliance approvals, accessibility audit, performance evidence, deployment checklist, rollback checklist, and post-release monitoring evidence are complete. See [`docs/12-governance/PRODUCTION_READINESS.md`](docs/12-governance/PRODUCTION_READINESS.md) for the current gate status.
