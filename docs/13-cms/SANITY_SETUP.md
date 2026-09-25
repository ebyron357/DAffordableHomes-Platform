# Sanity CMS — setup, migration, and publishing

The blog is CMS-driven. `/blog` and `/blog/[slug]` read articles from Sanity;
there are no per-article route files, and publishing a new article never
requires a code change.

This document covers what an operator has to do once, in Sanity and in Vercel,
to switch the site from the built-in migration seed to the live Content Lake.

---

## 1. What already exists in the repository

| Concern | Location |
| --- | --- |
| Studio (embedded) | `apps/web/app/studio/[[...tool]]/page.tsx`, `apps/web/sanity.config.ts` |
| Schema | `apps/web/cms/schema/` |
| Content Lake clients | `apps/web/cms/client.ts` |
| Environment resolution | `apps/web/cms/env.ts` |
| GROQ query layer | `apps/web/lib/blog/queries.ts` |
| Data source (Sanity ⇄ seed) | `apps/web/lib/blog/source.ts` |
| Draft preview | `apps/web/app/api/draft-mode/enable|disable/route.ts` |
| Publish revalidation | `apps/web/app/api/revalidate/route.ts` |
| Migration payload | `apps/web/lib/blog/seed/` |
| Migration exporter | `scripts/sanity/export-seed.mjs` |

### Production source of truth

**Once `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, Sanity is the only publishing
system for this site.** Articles are created, edited, reordered, previewed,
published and unpublished in `/studio`, and nothing in the repository
republishes, overrides or substitutes for what is in the Content Lake.

`apps/web/lib/blog/seed/` is **migration and bootstrap data, not a second
publishing path**. It has exactly two jobs:

1. The **reproducible migration payload** — `pnpm sanity:seed` turns it into
   NDJSON that `sanity dataset import` pushes into the Content Lake, so nobody
   retypes three long articles by hand.
2. The **content an unconfigured checkout renders**, so a local clone and a
   deploy that has not yet been pointed at a project serve real pages instead
   of 404ing.

#### Exactly what happens on a read

`lib/blog/source.ts` applies this ladder, in order. Every step reports its own
state, so the page and the logs always agree about what was served.

| Condition | What is served | `ReadState` |
| --- | --- | --- |
| Sanity not configured | The migration seed | `{ status: "ok", source: "seed" }` |
| Configured, Content Lake responds | Content Lake, on Next's data cache under the `article` tag | `{ status: "ok", source: "sanity" }` |
| Configured, read fails, this instance has served a good response before | That response again, with the time it was fetched | `{ status: "stale", source: "sanity", fetchedAt }` |
| Configured, read fails, nothing cached | Nothing — the reader is told the library is temporarily unavailable | `{ status: "unavailable", source: "sanity" }` |

The third row is the site's **own published content**, held per process — not
migration copy. The fourth row renders an honest "temporarily unavailable"
panel on `/blog` and on `/blog/[slug]`, and the article route returns
`robots: noindex` rather than a 404, because a 404 would tell readers and
crawlers that a published article had been withdrawn.

#### Why the previous behaviour was removed

Until this pass, any Content Lake read failure silently fell back to the seed.
That meant an outage could serve pre-migration copy as if it were current: an
editor who had corrected a figure, changed a reviewed date or unpublished an
article would have watched the old version reappear, with nothing on the page
or in the response saying why. Stale copy that looks current is worse than an
honest gap, so there is no longer any path from a configured Sanity project
back to the seed at request time.

`getContentSource()` reports which system is authoritative in the current
environment. `tests/static/cms.test.mjs` asserts the ladder above, and
`scripts/qa/site-audit.mjs` asserts at browser level that no per-article route
file exists, that every article URL in the sitemap is served by the single
`[slug]` route, and that the route pins no build-time slug set.

> The seed is data, not layout. No article copy lives in a route file or a
> renderer component.

#### Migrating the three launch articles

The three articles keep their public slugs — `how-to-buy-home-garland-tx`,
`naca-homebuying-dallas-fort-worth`, `homes-for-heroes-north-texas` — through
the migration, so no URL changes and no redirect is needed. Run the import in
section 4 before switching production traffic; after it, the Content Lake is
authoritative and edits are made in the Studio, never in
`apps/web/lib/blog/seed/`.

---

## 2. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**, for
Production, Preview and Development. Values are never committed.

| Name | Scope | Required for | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Reading published content, loading the Studio | Lowercase alphanumeric, from **sanity.io/manage** |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | Reading published content | Usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public | Optional | Defaults to `2026-08-01` |
| `SANITY_API_READ_TOKEN` | Server only | Draft preview | Viewer token, **sanity.io/manage → API → Tokens** |
| `SANITY_REVALIDATE_SECRET` | Server only | Publish webhook | Any long random string; must match the webhook secret |

The application degrades honestly rather than crashing:

- No `NEXT_PUBLIC_SANITY_PROJECT_ID` → the Content Lake is never contacted, the
  seed is served, and `/studio` renders a configuration notice.
- No `SANITY_API_READ_TOKEN` → draft preview returns HTTP 503 with an
  explanation instead of silently showing published content.
- No `SANITY_REVALIDATE_SECRET` → the webhook returns HTTP 503 instead of
  accepting unsigned requests.

---

## 3. One-time Sanity project setup

1. Create a project at <https://sanity.io/manage>. Note the **project ID** and
   create the `production` dataset (public read is fine; the schema has no
   private fields).
2. Add the CORS origins the Studio will be served from:
   - `https://daffordablehomes.com`
   - `https://www.daffordablehomes.com`
   - the Vercel preview origin, and `http://localhost:3000` for local work.
   Enable **Allow credentials** for each.
3. Create a **Viewer** token and set it as `SANITY_API_READ_TOKEN`.
4. Set the environment variables from section 2 and redeploy.
5. Open `https://daffordablehomes.com/studio` and sign in.

---

## 4. Migrating the three launch articles

From the repository root:

```bash
pnpm sanity:seed                       # writes qa-evidence/sanity-seed.ndjson
cd apps/web
npx sanity dataset import ../../qa-evidence/sanity-seed.ndjson production --replace
```

`--replace` is safe and re-runnable: document IDs and block `_key`s are
deterministic, so importing twice updates the same documents rather than
creating duplicates.

The import creates:

- `author.debra-allen`
- `category.homebuyer-programs`, `category.first-time-buyers`
- `article.naca-homebuying-dallas-fort-worth`
- `article.homes-for-heroes-north-texas`
- `article.how-to-buy-home-garland-tx`

Images referenced by the seed are approved repository assets under
`apps/web/public`; the importer uploads them to the Content Lake automatically.

### After importing — verify

1. `/blog` lists three articles.
2. Each preserved URL resolves and its slug is unchanged:
   - `/blog/naca-homebuying-dallas-fort-worth`
   - `/blog/homes-for-heroes-north-texas`
   - `/blog/how-to-buy-home-garland-tx`
3. `/blog/this-article-does-not-exist` returns HTTP **404**, not a 200 page.

**Never edit the slug of a published article.** The URL is the contract.

---

## 5. Publishing workflow

### Create

Studio → **Articles → Drafts → Create**. `publicationState` starts at `draft`,
so the article is invisible publicly until it is switched to `published`.

Required before the document validates: title, slug, eyebrow, excerpt, author,
category, publish date, reading time, featured image **with meaningful alt
text**, SEO description, and at least one body block.

### Preview a draft

Open the **Presentation** tool in the Studio and select the article. Presentation
mints a single-use preview secret in the Content Lake and hands it to
`/api/draft-mode/enable`, which validates it before turning on draft rendering.
A banner marks the page as an unpublished preview; **Exit preview** clears it.

Preview requires `SANITY_API_READ_TOKEN`.

> **Do not build your own preview link.** An earlier version of this endpoint
> accepted `?slug=<slug>` and only checked that the document existed. That is not
> authentication: any visitor who knew a published slug — all three are public —
> could obtain a draft-mode cookie and read unpublished editorial content. A
> preview link an editor can copy is a link anyone can copy; the secret has to
> come from an authenticated Studio session.

### Publish

Set `publicationState` to `published` and hit **Publish**. The article appears
on `/blog`, at `/blog/<slug>`, and in `/sitemap.xml`.

### Revalidation webhook

**sanity.io/manage → API → Webhooks → Create webhook**

| Field | Value |
| --- | --- |
| URL | `https://daffordablehomes.com/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type == "article"` |
| Projection | `{_type, "slug": slug.current}` |
| HTTP method | `POST` |
| API version | `v2021-03-25` |
| Secret | the same value as `SANITY_REVALIDATE_SECRET` |

The route verifies the signature before revalidating, then clears the `article`
cache tag and revalidates `/blog`, `/sitemap.xml`, and the article path.

The article route renders on demand, so a published change is visible on the
next request once the `article` cache tag is cleared. Without the webhook, the
tag expires on its own within the hour.

---

## 6. Editorial blocks

Every block below has exactly one schema type and exactly one renderer;
`tests/static/cms.test.mjs` fails if that parity breaks.

| Block | Schema type | Renderer |
| --- | --- | --- |
| Rich text | `richTextBlock` | `components/blog/blocks.tsx` → `Prose` |
| Headings (H2–H4) | `richText` style `h2`/`h3`/`h4` | `components/blog/portable-text.tsx` |
| Ordered list | `richText` list `number` | `components/blog/portable-text.tsx` |
| Unordered list | `richText` list `bullet` | `components/blog/portable-text.tsx` |
| Quick answer | `quickAnswer` | `QuickAnswer` |
| Hero image | `heroImage` | `ArticleHeader` (rendered in the masthead) |
| Inline image | `inlineImage` | `BlogFigure` |
| Image gallery | `imageGallery` | `ImageGallery` |
| Video / embed | `videoEmbed` | `VideoEmbed` |
| Quote | `quote` | `Quote` |
| Callout | `callout` | `Callout` |
| Compliance disclaimer | `complianceDisclaimer` | `ComplianceDisclaimer` |
| Checklist | `checklist` | `Checklist` |
| Comparison table | `comparisonTable` | `ComparisonTable` |
| FAQs | `faqBlock` | `FaqSection` |
| Official sources | `officialSourcesBlock` | `OfficialSources` |
| Calculator CTA | `calculatorCta` | `InlineCta` |
| Program CTA | `programCta` | `InlineCta` |
| Area guide CTA | `areaGuideCta` | `InlineCta` |
| Consultation CTA | `consultationCta` | `InlineCta` (prominent) |
| Related articles | `relatedArticlesBlock` | `RelatedArticles` |

Headings and lists are Portable Text styles rather than separate block objects,
which is how editors expect to write and what keeps heading hierarchy intact in
a single flowing document.

---

## 7. Editorial standards that the schema enforces

- **Alt text** is required, must be 10–180 characters, and is rejected if it is
  a filename or starts with a generic word like "image" or "photo".
- **SEO description** is required and length-bounded.
- **Reviewed date** cannot precede the publish date.
- **Reading time** must match the `N minute read` format.
- **Links** must be absolute `https`, site-relative, `mailto:` or `tel:`.

What the schema cannot enforce — and the publishing standard still requires —
is factual accuracy. Do not publish brokerage names, license numbers, service
areas, certifications, savings figures, testimonials, or affiliation claims that
have not been verified. See `docs/12-governance/PUBLISHING_STANDARD.md`.

---

## 8. Security notes

- `/studio` is `noindex, nofollow` via both the route metadata and an
  `X-Robots-Tag` header, and is disallowed in `robots.txt`.
- The Studio runs under its own Content Security Policy scoped to `/studio`.
  It permits `unsafe-eval`, which Sanity Studio requires; the public site's
  policy does not, and never receives that header.
- The read token is server-only. `cms/client.ts` and `lib/blog/source.ts` are
  marked `server-only`, so a client component importing them fails the build.
- The draft-mode endpoint requires a single-use secret minted by an
  authenticated Studio session; an anonymous request cannot enable draft mode.
- The public CSP is served to every route except `/studio`. The catch-all header
  rule carries a negative lookahead because Next keeps the *last* value for a
  duplicated header key — a plain `/(.*)` catch-all silently replaced the Studio
  policy and stopped the Studio from loading.
- Do not add a root-level `app/loading.tsx`. Its Suspense boundary lets Next
  flush the shell and commit HTTP 200 before a page can call `notFound()`,
  turning every 404 in the application into a soft 404.
