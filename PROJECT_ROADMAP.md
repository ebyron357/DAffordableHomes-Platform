# D'Affordable Homes Product Roadmap

**Roadmap model:** versioned product releases, not a one-time website project.

## Release principles

- Finish the trustworthy education and conversion foundation before adding advanced AI or portal complexity.
- Never publish fake or unverified business, listing, review, credential, market, or compliance information.
- Accessibility, compliance, security, analytics, and performance are part of each feature's acceptance criteria.
- External integrations are not considered complete until the live provider connection and fallback behavior are tested.

## Phase 0 — Repository and governance foundation

**Goal:** establish one source of truth before application development.

- [x] Create repository
- [x] Add project README
- [x] Add agent execution rules
- [x] Lock architecture
- [x] Create product roadmap
- [x] Commit brand voice standard
- [x] Commit complete product requirements
- [x] Commit Clara specification
- [x] Commit publishing and quality gate
- [x] Add issue templates and CI plan
- [ ] Confirm repository visibility and access policy
- [x] Add production execution logs, risk register, technical debt register, decision log, and changelog
- [x] Add release, deployment, rollback, post-release monitoring, and production-readiness checklists

**Exit gate:** any development agent can determine the product, architecture, constraints, and definition of done without guessing.

## v1.0 — Launch foundation

**Goal:** publish a fast, accessible, trustworthy education-first platform that converts visitors into informed consultation leads.

### Engineering foundation

- [ ] Initialize Next.js App Router application with TypeScript strict mode
- [ ] Configure Tailwind CSS and semantic design tokens
- [ ] Add linting, formatting, type checking, unit tests, browser tests, and accessibility tests
- [ ] Configure GitHub Actions build and quality checks
- [ ] Configure Vercel preview deployments
- [ ] Add environment validation with no public exposure of server credentials
- [ ] Add secure headers and initial Content Security Policy
- [ ] Add error, loading, not-found, and maintenance states

### Design system

- [x] Integrate approved Debra Allen photography and an authentic Black-family homepage hero with responsive, accessible image treatment
- [ ] Finalize approved logo assets and usage rules
- [ ] Lock colors, typography, spacing, radius, elevation, and motion tokens
- [ ] Build accessible buttons, links, cards, navigation, forms, alerts, dialogs, accordions, tabs, breadcrumbs, and media components
- [ ] Create documented responsive page patterns
- [ ] Verify WCAG 2.2 AA contrast and keyboard behavior

### Core routes

- [ ] Home
- [ ] About Debra
- [ ] First-Time Buyers
- [ ] NACA education
- [ ] Resources
- [ ] Blog and article template
- [ ] Neighborhood Guides and guide template
- [ ] Featured Listings or property-search entry point
- [ ] Events and Workshops
- [ ] Testimonials and success stories
- [ ] FAQ
- [ ] Contact and consultation booking
- [ ] Privacy Policy
- [ ] Terms of Use
- [ ] Accessibility Statement
- [ ] Fair Housing Statement
- [ ] Equal Housing Opportunity information

### Signature experience

- [ ] Build **Find Your Next Step**
- [ ] Ask a short set of accessible, non-discriminatory planning questions
- [ ] Explain the visitor's current stage without claiming qualification
- [ ] Recommend approved resources
- [ ] Offer consultation booking when appropriate
- [ ] Track completion and conversion events

### GHL integration

- [ ] Define fields, tags, pipeline stages, and consent requirements
- [ ] Implement server-side lead submission or approved accessible form embed
- [ ] Connect consultation calendar
- [ ] Connect workshop registration
- [ ] Verify email and SMS workflows
- [ ] Add retry, duplicate prevention, spam protection, and failure reporting
- [ ] Test every path with non-production test contacts

### MLS/IDX integration

- [ ] Select and contract approved provider
- [ ] Document provider display and attribution rules
- [ ] Implement search and listing detail integration
- [ ] Add compliant attribution and disclaimers
- [ ] Add unavailable-provider fallback
- [ ] Test mobile, keyboard, screen-reader, filters, pagination, and deep links

### Content and local authority

- [ ] Build initial educational content library
- [ ] Publish buyer journey and process content
- [ ] Publish locally relevant neighborhood and market content using verified facts
- [ ] Add workshop and community content
- [ ] Add video transcript and caption workflow
- [ ] Add accessible downloadable-resource workflow

### SEO and analytics

- [ ] Add metadata, canonical URLs, Open Graph, sitemap, and robots rules
- [ ] Add structured data appropriate to each route
- [ ] Create local internal-linking architecture
- [ ] Connect GA4, Search Console, and Microsoft Clarity with consent handling where required
- [ ] Implement event taxonomy for bookings, form submissions, quiz completions, downloads, CTA clicks, property searches, and video engagement
- [ ] Create launch dashboard

### v1.0 launch gate

- [ ] Content and factual approval by Debra
- [ ] Brokerage and licensing review
- [ ] Fair Housing and Equal Housing review
- [ ] IDX provider approval
- [ ] WCAG 2.2 AA audit
- [ ] Cross-browser and responsive QA
- [ ] Lighthouse and Core Web Vitals targets met
- [ ] Security and privacy review
- [ ] All GHL and analytics events verified
- [ ] Backup, rollback, and incident contacts documented

## v1.1 — Optimization and accessibility hardening

- [ ] Review real-user analytics and search behavior
- [ ] Resolve accessibility findings from manual assistive-technology testing
- [ ] Improve conversion paths without pressure tactics
- [ ] Expand local service-area and neighborhood content
- [ ] Add verified Google Reviews integration where authorized
- [ ] Improve media performance and third-party script budgets

## v1.2 — Growth tools and Clara

**Goal:** help visitors understand readiness and make a practical plan.

- [ ] Launch Clara with approved knowledge retrieval and safety evaluation
- [ ] Launch Buyer Readiness Quiz
- [ ] Launch mortgage calculator with clear assumptions
- [ ] Launch affordability planning tool with education-first disclosures
- [ ] Launch interactive homeownership roadmap
- [ ] Add personalized resource recommendations
- [ ] Add market report publishing workflow
- [ ] Add educational email automation
- [ ] Add monthly AI quality and safety review

## v1.3 — Community authority

- [ ] Community map
- [ ] Expanded event calendar
- [ ] Homebuyer workshop system
- [ ] Dance and community event content layer
- [ ] Client journey maps with documented permission
- [ ] Neighborhood match quiz using non-discriminatory criteria
- [ ] Multilingual content pilot when translation governance is ready

## v2.0 — Market leader platform

- [ ] Secure client portal
- [ ] Personalized buyer dashboard
- [ ] Homeownership progress tracker
- [ ] Document and task experience designed around privacy requirements
- [ ] Homeownership Academy
- [ ] Referral program
- [ ] Community event management
- [ ] Partner directory with disclosure and approval rules
- [ ] Team member expansion
- [ ] Seller education resources

## Future evaluation

These items require a separate business and architecture decision before implementation:

- native mobile application
- additional geographic markets
- paid courses or membership experiences
- advanced customer data platform
- direct document uploads containing sensitive financial information

## Quarterly operating review

Every quarter, review:

- accessibility
- performance and Core Web Vitals
- SEO and content freshness
- brand consistency
- GHL workflows
- Clara safety and answer quality
- analytics and conversion quality
- security and dependencies
- privacy and retention
- local market information
- visitor feedback and usability
