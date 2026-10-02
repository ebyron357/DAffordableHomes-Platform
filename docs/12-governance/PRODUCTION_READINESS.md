# Production Readiness Summary

**Status:** `BLOCKED - OWNER ACTION REQUIRED` — not approved for production launch  
**Last updated:** 2026-10-02 (assessed at commit `d350db2`)  
**Owner:** Engineering, with Debra Allen as product and compliance owner

> The per-requirement register with evidence is now
> `docs/PROJECT_CLOSEOUT_STATUS.md`. This page is the thirteen-gate summary; where
> the two differ, the closeout status is the one assessed against current code.

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
| 6. Testing | Passing, with a gap | 128 static tests, typecheck, lint and the production build pass. Four browser gates now run **in CI** on every pull request as the `runtime-qa` job: route crawl, contrast, quiz and portrait-crop safety. Public production smoke evidence remains pending because there is no production deployment. |
| 7. Accessibility | In progress | Landmarks, skip link, heading order, alt text, form labels, focus visibility and touch targets (WCAG 2.2 SC 2.5.8) are asserted in CI across 33 routes and 5 viewports; contrast passes 36 documented pairs. **Manual keyboard and screen-reader review by a person remains pending** and is not substituted by any automated check. |
| 8. Performance | Blocked | Lighthouse and Core Web Vitals release evidence have not been recorded against the current production deployment. |
| 9. SEO | In progress | Canonical calculator and consultation paths are restored in the Next.js app, but live deployment and canonical-domain verification remain pending. |
| 10. Security | In progress | Two scoped Content Security Policies (public and Studio-only), baseline headers, and redirects, all asserted against the **served** headers. Both public lead endpoints now carry server-side rate limiting, honeypot and timing checks, bounded and allow-listed input, and shared server-side address validation — `/api/leads/program` had none of the first or last of those before `d350db2`. The limiter is per serving instance, not fleet-wide. Dependency audit, static analysis and secret scanning are not in CI; production environment verification remains pending. |
| 11. Documentation | In progress | Governance and implementation records are current for the integration candidate; provider runbooks remain pending. |
| 12. Deployment Readiness | In progress | Vercel preview passes the full quality gate on the working project. A **duplicate** Vercel project, `d-affordable-homes-platform-web`, fails on every branch including `main` from its own Root Directory misconfiguration and should be deleted; no code change fixes it. Hero approval, domain cutover and production deployment evidence remain pending. |
| 13. Rollback Readiness | In progress | Rollback checklist exists; the production rollback path must be tested after approval. |

## Next highest-priority work

Item 3 of the previous list — automated accessibility and browser smoke coverage —
is done: the four browser gates run in CI on every pull request. The rest stands,
reordered by what actually blocks release.

Owner and external, and not resolvable in code:

1. Verified business facts: brokerage, licence number and state, business address, phone number, confirmed service-area cities. Every one is `null` today, so the site displays no phone number, brokerage or licence.
2. Compliance sign-off by a **named** reviewer on brokerage, licensing, Fair Housing, Equal Housing Opportunity and REALTOR® language.
3. CRM webhook URLs, then a test lead **observed arriving**. All four webhook variables are unset, so neither lead form delivers.
4. Hero crop approval.
5. ClientVerse release certification: its three values are unset, so the check reports `BLOCKED` and has never executed. Its absence from a pull request is not a pass.

Engineering, once the above are unblocked or in parallel:

6. Verify the real Vercel project settings — root directory, production branch, production artifact, canonical domain — with direct access evidence, and delete the duplicate project.
7. Record Lighthouse and Core Web Vitals evidence against a production-like deployment, and correct any release-blocking regression.
8. Perform and record a manual WCAG 2.2 AA review, keyboard and assistive technology. The automated gates supplement this; they do not replace it.
9. Create the Sanity project and transfer it to the owner, then verify publish, unpublish, preview and a dataset export/restore.
10. Transfer every account to the owner and complete the sign-off in `docs/FINAL_CLIENT_ACCEPTANCE.md` and `CLIENT_HANDOFF.md` Part 7.
