# Technical Debt Register

## TD-001 — Application scaffold not initialized

- **Severity:** Critical
- **Impact:** Build, type-safety, lint, browser, accessibility, and performance gates could not run.
- **Resolution:** The approved 22-route Next.js application is consolidated under `apps/web` with strict TypeScript, Tailwind CSS 4, ESLint, static tests, full CI, and Vercel preview validation.
- **Status:** Resolved in PR #3

## TD-002 — Production integrations not configured

- **Severity:** Critical
- **Impact:** CRM, IDX, analytics, maps, reviews, booking, and Clara production workflows cannot be verified end to end.
- **Reason:** Provider selection, credentials, test accounts, compliance approvals, and adapters are not yet implemented.
- **Recommended Fix:** Confirm providers and credentials, define environment schemas, then implement server-side adapters with honest unavailable states.
- **Status:** Open

## TD-003 — Compliance release language pending approval

- **Severity:** High
- **Impact:** Public launch is blocked until brokerage, licensing, Fair Housing, Equal Housing Opportunity, privacy, terms, IDX attribution, and accessibility language are reviewed.
- **Reason:** Required legal/compliance reviewers and final business facts are external dependencies.
- **Recommended Fix:** Record verified business facts and approvals in the release checklist before production publication.
- **Status:** Open

## TD-004 — Reproducible dependency lockfile pending

- **Severity:** High
- **Impact:** Dependency resolution can change between installations even when source code does not.
- **Reason:** The governed monorepo was consolidated from npm and pnpm branches without adopting a final workspace lockfile.
- **Recommended Fix:** Generate and commit the npm lockfile from the consolidated workspace, switch CI to `npm ci`, and validate a clean install.
- **Status:** Open

## TD-010 — Sanity Content Lake not provisioned

- **Severity:** High
- **Impact:** The blog is served from the committed bootstrap content source in `apps/web/content/articles`. Editors cannot create, edit, preview, or publish until a Sanity project exists, and the live create/edit/preview/publish workflow cannot be verified.
- **Reason:** No Sanity account, project ID, or API token is available to this repository.
- **Recommended Fix:** Follow `docs/12-governance/CMS_ENVIRONMENT.md` §"One-time provisioning", then set the documented variables in Vercel. No rendering code changes are required — the app switches sources on `NEXT_PUBLIC_SANITY_PROJECT_ID`.
- **Status:** Open

## TD-011 — Production domain not attached to the Vercel project

- **Severity:** High
- **Impact:** `https://daffordablehomes.com` does not serve this application. Canonicals, Open Graph URLs, JSON-LD, and the sitemap already point at the apex, so search engines are directed to an origin the project does not yet serve.
- **Reason:** The domain is registered but is not added to the `daffordablehomes-platform` Vercel project, whose only domains are `*.vercel.app`. Adding a domain and creating DNS records requires account access.
- **Recommended Fix:** Add the apex and `www` in Vercel → Settings → Domains, set `www` to redirect to apex, and create the DNS records Vercel displays. No code change is needed at cutover.
- **Status:** Open

## TD-012 — Preview deployments are SSO-protected, blocking automated edge verification

- **Severity:** Medium
- **Impact:** Runtime verification of a preview deployment cannot be automated. Vercel deployment protection is set to `all_except_custom_domains`, so every `*.vercel.app` preview returns a 302 to the Vercel SSO endpoint. Runtime evidence currently comes from the CI `runtime-qa` job, which builds and boots the same commit.
- **Recommended Fix:** Either attach the production domain (TD-011), which is exempt from the protection rule, or scope deployment protection so automation can reach preview builds.
- **Status:** Open

## TD-013 — `sanity schema validate` blocked by an upstream dependency skew

- **Severity:** Low
- **Impact:** The Sanity CLI's `schema validate` command aborts with `SyntaxError: The requested module '@portabletext/sanity-bridge' does not provide an export named 'compileSchemaDefinitionToPortableTextMemberSchemaTypes'`. Schema correctness is instead covered by `apps/studio` typechecking (`tsc --noEmit`, which type-checks every `defineType`/`defineField`) and by `tests/static/cms.test.mjs`, which asserts every required field carries `rule.required()`, that descriptive alt text is enforced, and that every block type has both a schema definition and a frontend renderer.
- **Reason:** `sanity@4.22` ships `@portabletext/block-tools@4.1.11`, which pins `@portabletext/sanity-bridge@^1`, while the editor path uses v3. A pnpm `overrides` entry forcing a single version was tried and did not resolve it, so it was reverted rather than left in as an ineffective pin.
- **Recommended Fix:** Re-run `pnpm --filter @daffordablehomes/studio schema:validate` after the next `sanity` release that realigns `block-tools`. The Studio itself, `sanity dev`, and `dataset import` are unaffected.
- **Status:** Open

