# AI Software Quality & Security — Project Adoption and Audit Record

Canonical governing standard: https://github.com/ebyron357/AI-Operating-Standards/blob/main/docs/AI_SOFTWARE_QUALITY_SECURITY_MASTER_STANDARD.md (Version 1.0, approved through AI-Operating-Standards PR #8). If this page and the canonical standard disagree, the canonical standard governs.

**Current status: FIRST AUDIT PASS COMPLETE — NOT RELEASE-READY.** One automated and code-review audit was performed on 2026-11-02 against `main` at `1ede04f`. It is evidence for the items below, not a certification of security, accessibility or compliance. Release still depends on the open findings, the manual checks listed under "Not yet verified", and the release gates in `docs/FINAL_CLIENT_ACCEPTANCE.md`.

## Mandatory checklist (verify against actual implementation)

Legend: `[x]` verified with evidence below · `[~]` audited, open findings remain · `[ ]` not yet verified · N/A with reason.

- [~] Visual consistency: typography, spacing, colors, gradients, shadows, cards and branding. *(Q-13: four duplicate colour-token systems, inconsistent heading scale.)*
- [~] Code hygiene: duplicate components, unused imports, dead routes, conflicting CSS, obsolete packages and AI-generated debris. *(Q-11, Q-12 fixed in PR #42; Q-18 duplicate footer legal data open.)*
- [x] Functional UI: no dead controls, fake charts, fabricated testimonials, production mock data, nonfunctional settings or false success messages. *(Verified; one wording item, Q-19.)*
- [~] Responsive design and accessibility: mobile navigation, dialogs, tables, tap targets, keyboard, labels, contrast, WCAG 2.2 AA evaluation. *(Automated pass clean after PR #41; manual screen-reader and cross-browser review pending.)*
- [~] Security: secret scanning, least-privilege server-side authorization, tenant isolation, safe rendering, protected uploads and APIs. *(Q-01, Q-03, Q-14 fixed in PR #40; Q-04, Q-15, Q-16 open.)*
- [~] Backend: persistence, validation, migrations, data integrity, backups, restore and observability. *(Validation verified; Q-05 delivery failures not retried or logged. Persistence and backups live in GoHighLevel and Sanity.)*
- [~] Integrations: real APIs, OAuth scopes, webhook signatures, retries and recovery. *(Webhook signatures verified; replay window fixed in PR #40; live GoHighLevel delivery unverified, TD-002.)*
- N/A Agent controls: the site runs no autonomous agents or AI endpoints in production.
- [~] Performance and discovery: Core Web Vitals, SEO, GEO, AEO, structured data, no deceptive injection. *(Local measurements and SEO audit pass; field Core Web Vitals not measured.)*
- [ ] Privacy and compliance: scoped HIPAA/NIST/government requirements and evidence; never claim certification without proof. *(HIPAA/NIST/government scope not applicable to a brokerage marketing site; Texas brokerage disclosures pending, Q-02 and TD-003.)*
- [~] Testing and release: lint, build, unit, E2E, accessibility, visual regression, security, CI, rollback and owner approval. *(Q-08, Q-09 fixed in PRs #40/#41; Q-10 and Q-20 open.)*
- [~] Documentation: architecture, owners, inventory, audit evidence and current governing standard. *(This record; risks and debt registered in `RISKS.md` and `TECH_DEBT.md`.)*

## Execution protocol
Inventory and verify first. Record severity P0-P3, evidence, reproduction, root cause, fix, tests and approval. Do not invent blockers or passing checks. Preserve working systems and data. Make repairs in reviewable branches; owner controls production release.

## Audit 2026-11-02 — method

- **Scope:** `apps/web`, `packages/integrations`, CI workflows and QA scripts at `main` `1ede04f`.
- **Code review:** API routes, lead delivery and validation, rate limiting, revalidate and draft-mode auth, headers/CSP, secrets (working tree and all 376 commits), components, content, CSS, tests.
- **Commands (all passed on `1ede04f`):** `npm run build` (49 static pages), `npm test` (246/246), `qa:contrast`, `qa:audit` (90 responsive checks, 29 internal links), `qa:quiz` (16/16 paths), `seo-audit.mjs` (1524 checks, 0 failures, 7 warnings), `qa:faces`, `scroll-craft-qa` (8/8), `pnpm audit --prod`.
- **Accessibility:** axe-core 4.12.1, WCAG 2.0–2.2 A/AA, 22 routes at 390px and 1280px; keyboard, menu, reduced-motion and form checks in Playwright.
- **Severity:** P0 deceptive or exploitable now · P1 fix before launch · P2 should fix · P3 minor.

## Evidence register

| ID | Sev | Finding | Evidence | Status |
| --- | --- | --- | --- | --- |
| Q-01 | P1 | Next.js 16.2.11 had critical/high advisories (image optimizer RCE and SSRF, ISR cache poisoning, Server Actions DoS); `pnpm audit --prod` 6 critical | `apps/web/package.json`, `pnpm-lock.yaml`; image optimization enabled in `next.config.mjs` | **Fixed (PR #40)** — Next 16.4.3, sharp 0.35.5, DOMPurify 3.4.17; critical 6 → 0 |
| Q-02 | P1 | Footer "Information About Brokerage Services" links to TREC's blank form page, not the brokerage's completed IABS | `components/layout/site-footer.tsx:35`, `lib/figma-home.ts:179` | **Open** — needs verified brokerage details (TD-003, RISK-006); confirm rule with the broker |
| Q-03 | P2 | Lead endpoints accepted cross-site `text/plain` POSTs without preflight, so any page could make visitors submit fabricated leads | `app/api/leads/*/route.ts` (no content-type or Origin check) | **Fixed (PR #40)** — `lib/request-guard.ts`: 415 non-JSON, 403 foreign Origin |
| Q-04 | P2 | Rate limit is in-memory per instance; resets on cold start and scale-out | `lib/rate-limit.ts:44` | **Open** — RISK-004; needs a durable store or Vercel WAF rule |
| Q-05 | P2 | Lead delivery has one 8s attempt, no retry, no failure log, no idempotency key; slow CRM replies can create duplicates | `lib/lead-delivery.ts:75-88` | **Open** — RISK-005 |
| Q-06 | P2 | Wide tables not keyboard-scrollable on phones (axe `scrollable-region-focusable`, WCAG 2.1.1) | `components/blog/blocks.tsx:165`, `components/calculators/homebuyer-calculators.tsx:319` | **Fixed (PR #41)** |
| Q-07 | P2 | Focus left the open mobile menu and landed off-screen behind the scroll lock (WCAG 2.4.7) | `components/home/figma-home-header.tsx:30` | **Fixed (PR #41)** |
| Q-08 | P2 | No automated accessibility scan in CI | no axe usage in `.github`, `scripts`, `tests` | **Fixed (PR #41)** — `pnpm qa:a11y`, 44 scans, 0 violations, runs in Browser QA |
| Q-09 | P2 | SEO audit not in CI and read the wrong browser-path variable | `scripts/qa/seo-audit.mjs:180` | **Fixed (PR #40)** — `pnpm qa:seo` runs in Browser QA |
| Q-10 | P2 | No browser test submits any lead form | `scripts/qa/*` | **Open** — TD-008 |
| Q-11 | P2 | 13 unrendered components (~640 lines), unused data, `src/lib/integration-status.ts`, unused `@sanity/image-url`, dead CSS | no importers | **Fixed (PR #42)** — 63/63 screenshots pixel-identical |
| Q-12 | P2 | Photography test read components no page renders, so it gave false assurance | `tests/static/repository.test.mjs:44-46` | **Fixed (PR #42)** |
| Q-13 | P2 | Four parallel colour-token systems with the same values, ~200 raw hex values, inconsistent heading scale | `app/globals.css` (`@theme`, `--fh-*`, `--dh-*`, `--dah-*`) | **Open** — TD-006 |
| Q-14 | P3 | Revalidate webhook accepted valid signatures of any age and echoed parser errors | `app/api/revalidate/route.ts:53-62` | **Fixed (PR #40)** — 5-minute window, generic error |
| Q-15 | P3 | Public CSP allows `script-src 'unsafe-inline'` | `next.config.mjs:37` | **Open** — TD-007 |
| Q-16 | P3 | No HSTS header in repository config | `next.config.mjs`, `vercel.json` | **Open** — TD-007; check whether Vercel's edge adds it |
| Q-17 | P3 | Contact form gave one generic error and no per-field `aria-invalid` (WCAG 3.3.1) | `components/contact/contact-form.tsx:145-152` | **Fixed (PR #41)** |
| Q-18 | P3 | Footer legal links duplicated in two modules | `site-footer.tsx:32`, `lib/figma-home.ts:179` | **Open** |
| Q-19 | P3 | `/testimonials` heading implies stories exist; the page has none yet (the status strip is honest) | `app/testimonials/page.tsx:56` | **Open** — reword or remove from nav until a verified story exists |
| Q-20 | P3 | No visual regression, post-deploy smoke test or rollback drill | `docs/12-governance/ROLLBACK_CHECKLIST.md` is manual only | **Open** — TD-008 |
| Q-21 | P3 | 24 high advisories remain in build and admin tooling (Sanity CLI chain, Next compiler chain); none on public routes | `pnpm audit --prod` after PR #40 | **Open** — TD-009 |

### Verified OK (no finding)
- Lead forms show success only when the server confirms delivery; with no webhook they return an honest 503 and say nothing was sent.
- No fabricated testimonials, statistics, ratings, listings, events or business facts; every trust fact is `null` until verified, and `/about` and `llms.txt` say so.
- All internal links and anchors resolve; redirect routes match `next.config.mjs`.
- Revalidate fails closed without its secret and rejects bad signatures; draft mode needs a Studio-minted secret; the disable route blocks open redirects.
- Webhook URLs come only from env and must be HTTPS (no SSRF); inputs are trimmed, length-capped and allowlisted; consent must be `true`.
- No secrets in the tree or history; Sanity read token is server-only; lead routes log no PII.
- Skip link, menu `aria-expanded`/`aria-controls`, Escape-to-close, labels, contrast, heading order, target size and reduced motion pass.
- CLS 0.000 on every audited route; LCP image prioritised; `robots.txt` blocks `/api/` and `/studio`; unknown routes return 404 with `noindex`.

### Not yet verified (required before release)
- Manual screen-reader pass (NVDA/VoiceOver) and zoom to 400%.
- Safari, Firefox and Edge.
- Field Core Web Vitals on the production deployment.
- Live GoHighLevel lead delivery (TD-002) and served production headers on Vercel.
- `clientverse-audit` workflow (needs its external service).

## Change log
- 2026-11-02 — PRs #40 (security), #41 (accessibility) and #42 (cleanup) merged: Q-01, Q-03, Q-06, Q-07, Q-08, Q-09, Q-11, Q-12, Q-14 and Q-17 fixed. Open: Q-02, Q-04, Q-05, Q-10, Q-13, Q-15, Q-16, Q-18, Q-19, Q-20, Q-21.
- 2026-11-02 — First audit pass recorded (Q-01 to Q-21) against `main` at `1ede04f`.
- 2026-10-28 — Standard adopted (PR #38). Status: NOT INSPECTED.
