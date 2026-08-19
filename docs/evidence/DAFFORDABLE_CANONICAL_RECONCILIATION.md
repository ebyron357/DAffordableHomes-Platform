# D’Affordable Homes Canonical Reconciliation

**Status:** Repository-side reconciliation complete; external release gates remain blocked where account access or live deployment evidence is required.

**Canonical production application:** `apps/web`

**Reconciliation branch:** `manus/daffordable-canonical-reconciliation`

**Baseline:** `main` at `770b386557b1a40fc6ec055611d67249621553ba`

**Integrated CMS lineage:** Reviewed PR #22, reconciled with the approved Warm Residential Editorial lineage from PR #23.

## Executive decision

The repository now has one explicit production application under `apps/web`. The recovered Manus tree remains available only as historical reference and is marked accordingly. PR #22’s useful CMS architecture was integrated once, while the approved PR #23 homepage and site-chrome treatment remained authoritative wherever the two branches overlapped.

The public blog now has one CMS-shaped content access layer and a single dynamic article route, `/blog/[slug]`, with the three existing published article URLs preserved. The repository continues to serve the committed article dataset when Sanity is not configured, so a missing Content Lake connection does not produce an empty or broken public blog. Sanity project creation, credentials, content import, and live deployment verification remain external release actions rather than claims of completion.

## Route ownership and canonicalization

| Legacy or competing path | Canonical owner | Current behavior | Status |
|---|---|---|---|
| `/book` | `/consultation` | Permanent redirect | PASS |
| `/calculator` | `/calculators/mortgage-payment` | Permanent redirect | PASS |
| `/resources/calculators` | `/calculators` | Permanent redirect | PASS |
| `/resources/calculators/affordability` | `/calculators/affordability` | Permanent redirect | PASS |
| `/resources/calculators/closing-costs` | `/calculators/closing-costs` | Permanent redirect | PASS |
| `/resources/calculators/down-payment` | `/calculators/down-payment` | Permanent redirect | PASS |
| `/resources/calculators/mortgage-payment` | `/calculators/mortgage-payment` | Permanent redirect | PASS |
| `/naca` | `/programs/naca` | Permanent redirect, explicitly defined in `next.config.mjs` | PASS |
| `/consultation` | Consultation and lead capture | Canonical public page | PASS |
| `/calculators` | Calculator hub | Canonical public page | PASS |
| `/resources` | Planning-resource overview | Canonical public page with canonical metadata | PASS |
| `/areas` | Verified local-area index | Canonical public page | PASS |
| `/neighborhoods` | Neighborhood guide index | Canonical public page with canonical metadata | PASS |
| `/homes` | Homes/search doorway | Canonical public page with canonical metadata | PASS |
| `/blog` | CMS-backed article index | Canonical public page | PASS |
| `/blog/[slug]` | CMS-backed article detail | Single dynamic article route with fixed published slugs | PASS |
| `/studio` | Sanity Studio | First-party editorial workspace, not public search content | PASS; external configuration required |
| `/preview/[slug]` | Draft-only article preview | Dynamic, noindex, preview-only route | PASS |
| `recovered-manus/` | None | Historical reference only | PASS |

## CMS consolidation

The retained production path is:

```text
Sanity Studio (/studio)
  → Sanity Content Lake when configured
    → apps/web/lib/cms and apps/web/lib/blog/source.ts
      → apps/web/app/blog/page.tsx
      → apps/web/app/blog/[slug]/page.tsx
      → shared article/block renderers
  → committed article dataset fallback when CMS is unavailable
```

The implementation preserves the existing article URLs, uses sanitized CMS-authored links, supports draft preview through validated preview endpoints, exposes revalidation through the protected endpoint, and keeps unknown article slugs out of the published static set.

## SEO, AEO, and technical checks

The reconciled app contains the following repository-verified controls:

- Self-referencing canonicals are present on the audited public pages, including previously missing utility, legal, local, and resource pages.
- Legacy calculator, consultation, and NACA doorway paths redirect to one canonical owner.
- `sitemap.xml` and `robots.txt` return HTTP 200 locally, and the sitemap includes the canonical public routes and published article URLs.
- The root entity graph identifies the site, organization, and Debra Allen as the authoring person without inventing unverified brokerage, license, service-area, or certification facts.
- CMS article links pass through the safe-href sanitizer; executable, data, protocol-relative, malformed, and insecure destinations are rejected.
- The public site retains security headers including CSP and anti-sniffing controls; Sanity Studio receives a scoped policy rather than loosening the public-site policy.
- The footer includes a qualified, accessible ClientVerse vendor attribution link and required TREC notices.

## Verification evidence

The following checks were run against the reconciled local production build:

| Check | Result |
|---|---|
| Frozen workspace install | PASS |
| TypeScript typecheck | PASS |
| ESLint | PASS; the test runner still emits environment warnings because this sandbox uses Node 22 while the workspace declares Node 24 |
| Static/regression suite | PASS — 68 tests |
| Next.js production build | PASS — 48 generated pages |
| Public-route crawl | PASS — 33 representative routes returned HTTP 200 |
| Self-referencing canonical extraction | PASS on audited public routes |
| Legacy redirect verification | PASS — all listed legacy routes returned 308 to canonical destinations |
| Sitemap | PASS — HTTP 200, 5,707 bytes in the local production run |
| Robots | PASS — HTTP 200, 163 bytes in the local production run |
| Full internal-link scan | PASS — 33 pages, 31 unique internal targets, 0 errors |
| Mobile, keyboard, and visual evidence | Existing repository evidence retained; a fresh external browser audit still requires an accessible deployment target |

## Release blockers that were not falsely marked complete

The repository cannot prove the following without external account access or a reachable deployment endpoint:

1. The Sanity project and dataset must be created, environment variables must be configured in the deployment project, and the authored NDJSON import must be executed with a write token.
2. A live deployment must be verified for the expected commit SHA, configured domain, and production response.
3. The ClientVerse centralized audit must be run with its endpoint, deployment URL, and token. The workflow intentionally fails closed when those values are absent.
4. The production apex and `www` domain cutover must be checked from an environment that can reach the domain and deployment provider.

These are external release gates, not reasons to weaken the repository controls or silently claim certification.

## Reconciliation decisions

| Source | Decision | Reason |
|---|---|---|
| PR #23 Warm Residential Editorial reset | Retained as authoritative for overlapping homepage, footer, and visual-shell files | It is the approved design lineage and preserves the intended editorial treatment |
| PR #22 CMS closeout | Integrated once for CMS, blog routing, safe links, draft preview, revalidation, attribution, and release-gate hardening | It consolidates the editorial system without replacing the approved homepage direction |
| PR #20 | Superseded by the reviewed CMS closeout | It is an earlier closeout branch with overlapping architecture and unstable merge status |
| PR #21 | Superseded by the reviewed CMS closeout | It contains competing CMS file locations and an earlier closeout state |
| `recovered-manus/` | Retained as reference only | It is not the canonical Next.js application and must not be deployed as a second site |

## Final verdict

**Repository-side canonicalization: PASS.** The project has one production app, one consultation owner, one calculator owner, one NACA owner, one article route, explicit legacy redirects, canonical metadata, and a documented CMS fallback.

**Client handoff / production launch: NO-GO until the external blockers are completed.** The correct next action is to configure and import Sanity, run the ClientVerse audit, verify the deployed SHA and domain, then repeat the live browser and performance checks against the actual public deployment.

## Vercel deployment evidence

The pushed reconciliation commit was received by the linked Vercel project and reached `READY`:

| Field | Evidence |
|---|---|
| Project | `daffordablehomes-platform` (`prj_Frv8mBWD4VUITT18qP0yCK4TBKpV`) |
| Deployment | `dpl_8UmZmxxiVCg7ABKRew6mncCTZwfT` |
| Commit SHA | `92feaf278f4db1a09b15fa511457bdb827a98e25` |
| Branch | `manus/daffordable-canonical-reconciliation` |
| Deployment state | `READY` |
| Preview alias | `https://daffordablehomes-platform-git-manus-daffordable-3a9d6b-tradeiq.vercel.app` |
| GitHub author email observed by Vercel | `26610300+ebyron357@users.noreply.github.com` |

The deployment URL remains protected by Vercel Authentication. Direct unauthenticated HTTP requests return a Vercel SSO redirect, and the temporary share URL also redirected to SSO in the available browser session. Therefore the deployment state and SHA are verified, but authenticated visual/browser inspection of the deployed application remains an external-access blocker. Local production-browser evidence is retained separately from the Vercel deployment metadata.
