# Deployment and Recovery Runbook

**Assessed at commit `d350db2`, 2026-10-02.**

> **Nothing in this runbook has been exercised against a production release,
> because there has never been one.** The procedures are correct for the
> platform and the repository as they stand; they are not a record of a tested
> recovery. Each section says which parts are untested.

Short checklists live in `docs/12-governance/DEPLOYMENT_CHECKLIST.md`,
`ROLLBACK_CHECKLIST.md` and `POST_RELEASE_MONITORING.md`. This document is the
procedure behind them.

---

## 1. The deployment topology

| Piece | Value |
| --- | --- |
| Framework | Next.js 16 App Router, React 19, Tailwind CSS 4 |
| Runtime | Node 24 |
| Package manager | pnpm 11.9.0, pinned by `packageManager`, lockfile committed |
| Host | Vercel |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Output directory | `apps/web/.next` (set in `vercel.json`) |
| Working project | `daffordablehomes-platform` — `prj_Frv8mBWD4VUITT18qP0yCK4TBKpV` |
| Team | `tradeiq` — **must move to the owner before sign-off** |
| Production domain | **None attached** |

### The duplicate project — read this before debugging a red deployment

A second Vercel project, `d-affordable-homes-platform-web`
(`prj_zbCDLJd83aFPMKgLhtpHMVn29XlK`), **fails every build on every branch,
including `main`.** Its Root Directory is set to `apps/web`, which doubles with
`vercel.json`'s `outputDirectory: apps/web/.next`, so the output lookup fails at
`apps/web/apps/web/.next` with `NEXT_OUTPUT_DIR_MISSING`. The Next build itself
succeeds; only the output lookup fails.

**This is not an application fault and no code change fixes it.** It is fixable
only in the Vercel dashboard, and the right fix is to delete the project — it
duplicates the working one. Until someone does, every pull request carries one
permanently red check.

---

## 2. Deploying

### Preview — automatic

Every pull request gets a preview deployment on the working project, SSO-protected
and not indexed. This is where review happens.

### Production — procedure

1. **Gate.** `docs/12-governance/RELEASE_CHECKLIST.md` complete, approvals recorded. Do not proceed while any release-gating check is failing, blocked, or absent. The ClientVerse certification is currently `BLOCKED`, so **this gate is not passable today.**
2. **Verify the target.** Confirm the Vercel project, that the production branch is `main`, the Root Directory, and that `outputDirectory` is not doubled.
3. **Environment.** Every variable from `docs/ADMIN_OPERATIONS_MANUAL.md` Part 3 set in the Vercel production environment. Confirm no `NEXT_PUBLIC_` prefix carries a secret.
4. **Promote.** Deploy from `main`, or promote the reviewed preview deployment. Record the deployment ID and the commit SHA.
5. **Verify, in this order.** Home, one calculator, `/blog` and one article, an unknown article slug returns a real **404**, `/naca` returns **308** to `/programs/naca`, one lead form submits and the response is honest, the required notice pages render.
6. **Check the served headers**, not the config: CSP on a public page, and the separate Studio CSP on `/studio`.
7. **Record** the result in `CHANGELOG.md` and the deployment ID alongside the SHA.
8. **Monitor** per `docs/12-governance/POST_RELEASE_MONITORING.md`.

### Attaching the domain

In Vercel → the working project → **Domains**, add `daffordablehomes.com` and the
`www` host, then set the DNS records Vercel shows at the registrar. Certificates
are issued and renewed by Vercel automatically once DNS resolves.

**Verify against the live domain itself**, not the `.vercel.app` preview host.
A cutover is not done until the real domain serves the site over HTTPS with a
valid certificate and the canonical host redirects as intended.

---

## 3. Rollback

Trigger conditions are in `docs/12-governance/ROLLBACK_CHECKLIST.md`.

### Fastest path — Vercel instant rollback

Vercel → the project → **Deployments** → the last known-good deployment →
**Promote to Production**. This re-points production at an artifact that already
built, so it takes effect in seconds and does not depend on a successful build.

**Preserve evidence first** where it is safe to: capture the failing deployment's
build and runtime logs before you promote over it.

### When the bad change is in the code

```bash
git revert <sha>          # a single commit
git revert -m 1 <sha>     # a merge commit
pnpm test:all
git push -u origin main
```

Prefer the Vercel promote for speed, then revert in Git so the next deployment
does not reintroduce the fault.

### When the fault is configuration, not code

An environment variable, a domain setting, or the Root Directory. No deployment
rolls that back — fix it in the dashboard and redeploy. The duplicate-project
failure in §1 is exactly this class.

### Content, not code

A bad article is not a deployment problem. Set its publication state back to draft
in the Studio and publish that change; the live page updates within about a
minute. Never roll back a deployment to undo an editorial mistake.

**Untested:** the production rollback path has never been exercised. Test it once,
deliberately, on the first production release — promoting a known-good deployment
and back — rather than discovering it during an incident.

---

## 4. Backup and restore

### Code

Git is the backup. Every commit is on GitHub, and the working tree is
reproducible from the lockfile. To restore a build exactly:

```bash
git clone https://github.com/ebyron357/DAffordableHomes-Platform
cd DAffordableHomes-Platform
git checkout <sha>
pnpm install --frozen-lockfile
pnpm build
```

Nothing in a build depends on a machine-local file. The only external inputs are
the environment variables in §2 step 3.

### Content

Articles live in the Sanity Content Lake, **not** in this repository. Git does not
back them up.

```bash
npx sanity dataset export production ./backup-$(date +%F).tar.gz
npx sanity dataset import ./backup-2026-10-02.tar.gz production --replace
```

Run the export on a schedule once the project exists — weekly is reasonable for
this publishing volume. Keep the archives somewhere the owner controls, not only
on a developer's laptop.

**`--replace` overwrites the dataset.** Import into a fresh dataset first and look
at it before replacing anything live.

**Untested:** no export has been taken and no import has been verified, because no
Sanity project exists.

### What has no backup, by design

The three launch guides are also committed as a seed in this repository, so they
survive any CMS loss. Lead submissions are never stored by the application — they
are forwarded to the CRM and the CRM is their only record. Backing them up is the
CRM's responsibility; see `docs/DATA_LIFECYCLE_AND_OFFBOARDING.md`.

---

## 5. Disaster recovery

Recovery targets are aspirational until tested. They are stated so there is
something to measure against, not as a guarantee.

| Scenario | Impact | Recovery | Realistic time |
| --- | --- | --- | --- |
| Bad deployment | Site broken or wrong | Promote the last good deployment (§3) | Minutes |
| Vercel project deleted | Site offline | Recreate the project, connect the repository, restore environment variables, redeploy, re-attach the domain | Hours — the long pole is re-entering environment variables, which is why §1 of the security handoff insists they be recorded outside the dashboard |
| Vercel account lost | Site offline, no dashboard | Recreate under the owner's account from the Git repository. **This is why the project must not stay under someone else's team.** | Hours |
| Sanity dataset lost or corrupted | Articles unavailable; the site serves the committed seed and shows an honest unavailable state for the rest | Import the most recent export (§4) | Hours, bounded by export age |
| Sanity account lost | No editing; published content still served from cache and seed | Recreate the project, import an export, update `NEXT_PUBLIC_SANITY_PROJECT_ID`, redeploy | Hours |
| Domain or DNS lost | Site unreachable by name | Recover at the registrar; re-point DNS. **No technical recovery substitutes for owning the domain.** | Hours to days, outside anyone's control |
| CRM webhook broken | Lead forms return an honest error and direct visitors to the consultation page. **No enquiry is silently lost — but none is captured either.** | Fix or reissue the webhook URL, update Vercel, redeploy | Hours |
| GitHub repository lost | No deployment pipeline; the running site is unaffected | Push a local clone to a new remote and reconnect Vercel | Hours |

### Single points of failure

- **Account ownership.** Vercel under `tradeiq` and Sanity nonexistent are the two largest recovery risks today, and neither is a technical problem.
- **No alerting.** Nobody is notified when a deployment or a check fails. Discovery is by someone looking. Tracked as non-blocking follow-up.
- **The Content Lake** is the only home for articles written after launch, until an export schedule exists.

---

## 6. Pre-release verification

Run before any production promotion. All of it passes on `d350db2`.

```bash
pnpm install --frozen-lockfile
pnpm test:all
pnpm build
sh scripts/qa/serve.sh 3111 "$PWD/.qa-server.log"
pnpm qa:contrast && pnpm qa:audit && pnpm qa:quiz && pnpm qa:faces
git checkout -- qa-evidence/   # unless rendering genuinely changed
```

| Gate | Expected |
| --- | --- |
| `pnpm test` | 128 pass, 0 fail |
| `pnpm typecheck` | exit 0 |
| `pnpm lint` | exit 0, zero warnings |
| `pnpm build` | 46/46 routes |
| `qa:contrast` | 36 pairs, 0 failures |
| `qa:audit` | 33 routes, 29 links, 0 console errors, 0 failures |
| `qa:quiz` | 16/16 paths, 0 non-200 CTAs |
| `qa:faces` | worst top crop under the 12% ceiling |

**None of this substitutes for the ClientVerse release certification**, which has
never executed, or for the manual WCAG 2.2 AA review, which has never been
recorded. See `docs/PROJECT_CLOSEOUT_STATUS.md` §5.
