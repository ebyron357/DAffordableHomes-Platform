# CMS environment and publishing workflow

D'Affordable Homes publishes editorial content through Sanity. This document
lists every environment variable the integration needs, what each one does, and
how the publish → live flow works. **No secret value appears in this repository.**

## Architecture

| Piece | Location | Purpose |
| --- | --- | --- |
| Sanity Studio | `apps/studio` | Editing UI, schemas, validation, preview links |
| Schemas | `apps/studio/schemas` | `article`, `author`, `category`, `program`, `area` + 18 editorial blocks |
| Query layer | `apps/web/lib/cms` | Client, GROQ queries, draft client, typed results |
| Renderers | `apps/web/components/blog` | One renderer per supported block type |
| Migration payload | `content/sanity/articles.ndjson` | `sanity dataset import` input |
| Bootstrap source | `apps/web/content/articles/*.json` | Serves the blog until the Content Lake is provisioned |

The app reads Sanity whenever `NEXT_PUBLIC_SANITY_PROJECT_ID` is set. Until then
it serves the committed bootstrap documents, which are byte-identical to the
documents in the import payload — so the site never depends on unprovisioned
infrastructure, and switching over changes no rendering code.

## Environment variables

### Web application (`apps/web`) — set in Vercel

| Name | Scope | Required for | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Reading from Sanity | Sanity project ID. Setting it switches the app off the bootstrap source. |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | Reading from Sanity | Defaults to `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public | Reading from Sanity | Defaults to `2026-08-01`. |
| `SANITY_API_READ_TOKEN` | **Server only** | Draft preview | Sanity token with **Viewer** rights. Never expose to the browser. |
| `SANITY_PREVIEW_SECRET` | **Server only** | Draft preview | Guards `/api/preview/enable`. Travels in a URL, so it must differ from the revalidate secret. |
| `SANITY_REVALIDATE_SECRET` | **Server only** | Publish webhook | Guards `/api/revalidate`. Send it as the `x-revalidate-secret` header where possible. |
| `VERCEL_DEPLOY_HOOK_URL` | **Server only** | Publishing brand-new slugs | Optional. See "New article slugs" below. |

### Studio (`apps/studio`) — set locally or in the Studio host

| Name | Purpose |
| --- | --- |
| `SANITY_STUDIO_PROJECT_ID` | Sanity project ID |
| `SANITY_STUDIO_DATASET` | Dataset name (default `production`) |
| `SANITY_STUDIO_PREVIEW_ORIGIN` | Site origin used by "Open preview" (default `https://daffordablehomes.com`) |
| `SANITY_STUDIO_PREVIEW_SECRET` | Must equal `SANITY_PREVIEW_SECRET` |

## One-time provisioning

1. Create the Sanity project and a `production` dataset.
2. Set the studio variables, then run the Studio:
   ```bash
   pnpm --filter @daffordablehomes/studio dev
   ```
3. Import the migrated content (idempotent; `--replace` overwrites by `_id`):
   ```bash
   pnpm --filter @daffordablehomes/studio dataset:import -- --replace
   ```
4. Create a **Viewer** token and **two different** random secrets — one for
   preview, one for revalidation; set the web variables in Vercel for Production
   and Preview.
5. Add a Sanity webhook:
   - URL: `https://daffordablehomes.com/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
   - Trigger: create, update, delete on `_type == "article"`
   - Projection: `{_type, slug}`
6. Redeploy. The app now reads from the Content Lake.

## Publishing workflow

1. Edit in the Studio. `status` starts at `draft`.
2. "Open preview" opens `/api/preview/enable`, which validates `SANITY_PREVIEW_SECRET`,
   turns on Next.js draft mode, and redirects to `/preview/<slug>`. That route
   renders only in draft mode, is never cached, is `noindex`, and is disallowed
   in `robots.txt`; it exists because a brand-new draft has no public URL yet.
   The banner's **Exit preview** link calls `/api/preview/disable`.
3. Set `status` to `published` and publish the document.
4. The webhook calls `/api/revalidate`, which purges the `article` cache tag, the
   per-article tag, `/blog`, the article path, and the sitemap.

Drafts are never publicly visible: published queries filter on
`status == "published" && publishedAt <= now()`, and draft reads require the
server-only token.

## New article slugs

`/blog/[slug]` sets `dynamicParams = false` so an unknown article URL returns a
real HTTP 404 rather than a 200 page with 404 content. A brand-new slug
therefore becomes routable when `generateStaticParams` next runs.

Set `VERCEL_DEPLOY_HOOK_URL` to a Vercel deploy hook and `/api/revalidate` will
trigger that rebuild automatically, so publishing stays a code-free operation.
Edits to existing articles go live through cache revalidation alone.

## Uploaded images

Assets uploaded through the Studio are served from `cdn.sanity.io`. That host is
allowed in `images.remotePatterns` in `apps/web/next.config.mjs`, and the CSP
permits `api.sanity.io` / `apicdn.sanity.io` for reads. Approved repository
assets referenced by path stay same-origin.

## Content Lake outages

Every Sanity read is wrapped so a failure logs and falls back to the committed
bootstrap documents rather than throwing. An editorial outage cannot take down
the homepage, the blog index, or the sitemap.

## Regenerating the migration payload

The three migrated articles are authored in `scripts/cms/source/`. To change them
before the Content Lake is live:

```bash
node scripts/cms/build-content.mjs        # rewrite app payload + NDJSON
node scripts/cms/build-content.mjs --check # CI: fail if the outputs are stale
```

Once Sanity is the source of truth, edit in the Studio instead — the bootstrap
source is no longer read.
