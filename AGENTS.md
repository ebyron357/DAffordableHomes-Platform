# AGENTS.md — D'Affordable Homes Execution Rules

This file governs every human or AI agent working in this repository.

## 1. Source of truth

Read these files before changing code or content:

1. `README.md`
2. `ARCHITECTURE.md`
3. `PROJECT_ROADMAP.md`
4. `docs/02-brand/BRAND_VOICE.md`
5. `docs/03-product/PRODUCT_REQUIREMENTS.md`
6. `docs/09-ai-clara/CLARA_SPEC.md` when touching AI
7. `docs/12-governance/PUBLISHING_STANDARD.md`

When instructions conflict, the more specific governing document wins. Do not silently invent requirements.

## 2. Required workflow

For every task:

1. Audit the existing repository and relevant documentation.
2. State the implementation plan in the work log or pull request.
3. Implement the smallest complete solution.
4. Test behavior, accessibility, responsive layouts, error handling, and security boundaries.
5. Update documentation and the roadmap status.
6. Report files changed, tests run, unresolved dependencies, and confidence.

Do not claim completion when required integrations, credentials, content, approvals, or provider access are missing.

## 3. Product rules

- Education comes before lead capture or property search.
- Every page must help the visitor understand a concern, learn one clear idea, identify a practical next step, and reach Debra when appropriate.
- Use the brand voice: warm, clear, confident, realistic, nonjudgmental, and never pushy.
- Do not use guarantees, fear tactics, shame, fake urgency, or claims that everyone qualifies.
- Never fabricate listings, reviews, credentials, certifications, years of experience, families served, market data, loan outcomes, or testimonials.
- Do not use placeholder content in a production-ready deliverable. Clearly mark unresolved factual inputs in documentation rather than publishing them.

## 4. Accessibility requirements

Every public-facing change must support WCAG 2.2 AA, including:

- semantic landmarks and heading order
- keyboard operation and visible focus
- skip navigation
- sufficient color contrast
- text resizing to 200 percent
- accessible labels, validation, errors, and success states
- descriptive links and alternative text
- reduced-motion preferences
- captions or transcripts for meaningful video content
- no flashing or autoplay motion

ARIA is used only when native HTML cannot provide the required semantics.

## 5. Real-estate and trust requirements

- Preserve REALTOR® trademark usage.
- Treat brokerage, licensing, Fair Housing, Equal Housing Opportunity, and IDX disclosures as required release gates.
- MLS/IDX data must come only from an approved provider and must display required attribution.
- Clara must never promise approval or provide legal, tax, lending, or individualized financial advice.
- External professionals must be identified when a question belongs to a lender, attorney, inspector, tax professional, or other licensed specialist.

## 6. Security and privacy

- Never commit API keys, access tokens, client records, protected financial information, or production credentials.
- All privileged integrations run server-side.
- Validate and sanitize all user input.
- Add rate limiting and spam protection to public forms and AI endpoints.
- Minimize collected data and document retention behavior.
- Use secure headers and a restrictive Content Security Policy compatible with approved integrations.

## 7. Engineering standards

- TypeScript strict mode.
- Reusable, documented components with accessible defaults.
- Server Components by default; client components only when interaction requires them.
- No direct provider calls from presentation components.
- Integration adapters must expose stable internal interfaces.
- Loading, empty, error, and unavailable-provider states are required.
- Tests must cover calculations, form validation, safety rules, critical navigation, and integration fallbacks.
- Performance budgets and Core Web Vitals are release requirements, not optional cleanup.

## 8. Definition of done

A task is done only when:

- the acceptance criteria work end to end
- tests pass
- accessibility checks pass
- responsive behavior is verified
- analytics requirements are implemented or explicitly documented as blocked
- required compliance language is present
- documentation is current
- no secrets or fabricated content were introduced
- remaining dependencies are reported accurately
