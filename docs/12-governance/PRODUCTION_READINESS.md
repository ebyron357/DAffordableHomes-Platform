# Production Readiness Summary

**Status:** Recovery closeout in progress — not approved for production launch  
**Last updated:** 2026-08-10  
**Owner:** Engineering, with Debra Allen as product and compliance owner

## Current assessment

The approved Manus website has been folded back into the governed monorepo as the visual source of truth, and `apps/web` is now the single authoritative production implementation. The recovered static Manus export remains in the repository only as a reference archive and regression aid. Local TypeScript, lint, static tests, and the production build can pass from the Next.js application, but production launch remains blocked by public deployment verification, canonical-domain verification, manual accessibility and responsive evidence, external form/CRM wiring, verified business details, compliance approval, and provider credentials.

## Production gates

| Gate | Status | Evidence or blocker |
| --- | --- | --- |
| 1. Repository Health | Passing | Required governance files, merge-marker protection, and environment-file protection pass in GitHub Actions. |
| 2. Architecture | In progress | `apps/web` is the only production implementation; `recovered-manus/` is reference-only. Vercel root-directory and production-project settings still require direct verification. |
| 3. Build | Passing | Next.js 16 production build passes locally from the governed workspace. |
| 4. Type Safety | Passing | Strict TypeScript passes for the web application and integrations package. |
| 5. Lint | Passing | Next.js and React ESLint rules pass with zero warnings. |
| 6. Testing | In progress | Static repository tests, route inventory checks, calculator tests, and the production build pass locally; browser automation and public production smoke evidence remain pending. |
| 7. Accessibility | In progress | Accessible landmarks, skip link, restored shell navigation, and honest fallback states exist; automated WCAG and manual keyboard/screen-reader evidence remain pending. |
| 8. Performance | Blocked | Lighthouse and Core Web Vitals release evidence have not been recorded against the current production deployment. |
| 9. SEO | In progress | Canonical calculator and consultation paths are restored in the Next.js app, but live deployment and canonical-domain verification remain pending. |
| 10. Security | In progress | CSP, redirects, and baseline security headers exist. High-severity `next`, `sharp`, `postcss`, and `nanoid` audit findings were remediated locally through version upgrades and overrides; one moderate audit finding remains. Rate limiting, form protection, and production environment verification remain pending. |
| 11. Documentation | In progress | Governance and implementation records are current for the integration candidate; provider runbooks remain pending. |
| 12. Deployment Readiness | In progress | Vercel preview passes the full quality gate; visual approval and production deployment evidence remain pending. |
| 13. Rollback Readiness | In progress | Rollback checklist exists; the production rollback path must be tested after approval. |

## Next highest-priority work

1. Verify the actual Vercel project settings, root directory, production branch, production artifact, and canonical domain with direct access evidence.
2. Complete human desktop/mobile visual review of the Manus-aligned Next.js deployment and record approval.
3. Add or restore automated accessibility and browser smoke coverage, then record manual WCAG 2.2 AA evidence.
4. Record Lighthouse performance evidence and correct release-blocking regressions.
5. Obtain verified brokerage, licensing, contact, compliance, GoHighLevel, IDX, analytics, and booking details before enabling provider-backed features.
