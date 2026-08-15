# Sanity CMS — architecture and operations

The blog is CMS-driven. There is exactly one article route, `/blog/[slug]`, and
no per-article route file exists.

## Content flow

```
Sanity Studio (/studio)
  → Content Lake (published perspective)
    → sanity/lib/queries.ts (GROQ)
      → lib/blog/source.ts (content access layer)
        → app/blog/[slug]/page.tsx + app/blog/page.tsx
```

`lib/blog/source.ts` reads the Content Lake whenever
`NEXT_PUBLIC_SANITY_PROJECT_ID` is set. When it is not set, the application
serves `apps/web/content/articles/*.json` — the identical documents that
`scripts/sanity/import-articles.mjs` pushes into Sanity. That fallback exists so
the three preserved article URLs keep working in environments that have no
Content Lake credentials; it is never a second editing surface.

## Required environment variables

See `apps/web/.env.example`. Names only, never values:

| Variable | Required for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Live CMS reads, Studio | Without it the Studio route renders a configuration notice |
| `NEXT_PUBLIC_SANITY_DATASET` | Live CMS reads | Defaults to `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Live CMS reads | Defaults to `2026-08-01` |
| `SANITY_API_READ_TOKEN` | Draft preview | Viewer token; `/api/preview/enable` returns 501 without it |
| `SANITY_API_WRITE_TOKEN` | Migration import | Used only by the import script |
| `SANITY_REVALIDATE_SECRET` | Publish webhook | `/api/revalidate` returns 501 without it |
| `VERCEL_DEPLOY_HOOK_URL` | Publishing new slugs | Publishing triggers a deployment so a new slug becomes routable |

## Routing and 404 behaviour

`app/blog/[slug]/page.tsx` sets `dynamicParams = false`. Only published slugs
resolve; Next's router answers every other `/blog/<slug>` with a real HTTP 404
before rendering starts.

This is deliberate. With `dynamicParams = true`, `notFound()` runs after the
streaming response has already been flushed with a 200, which produces a soft
404 — verified against Next.js 16.2.11 in this repository. Static params are the
only configuration that yields a genuine 404 status for this segment.

The trade-off is that a newly published article becomes routable on the next
deployment. `/api/revalidate` triggers that deployment automatically when
`VERCEL_DEPLOY_HOOK_URL` is configured, and always revalidates the `article` and
`article:<slug>` cache tags so edits to already-routable articles go live
immediately.

## Editorial workflow

1. **Create / edit** — `/studio`, Articles → Drafts.
2. **Preview** — the document's "Open preview" action calls
   `/api/preview/enable?slug=<slug>`, which verifies the slug through the
   token-scoped draft client before enabling Next.js draft mode. A banner marks
   preview mode; "Exit preview" calls `/api/preview/disable`.
3. **Publish** — set `status` to `published` and publish the document. Schema
   validation blocks publication without a title, slug, excerpt, author,
   category, reading time, publish date, SEO description, at least one body
   block, and either a featured image with meaningful alternative text or the
   explicit editorial type-only treatment.
4. **Go live** — configure a Sanity webhook to `POST ${SITE_URL}/api/revalidate`
   with the `SANITY_REVALIDATE_SECRET` shared secret.

Unpublished documents never appear on the public site: every published read
filters on `status == "published"` and uses the `published` perspective, and the
draft-aware client is only constructed inside draft mode with a viewer token.

## Migration and seeding

```bash
# Regenerate the canonical dataset from the committed migration sources.
node scripts/content/build-articles.mjs

# Verify the committed artefacts match their sources (runs in CI).
node scripts/content/build-articles.mjs --check

# Validate the Sanity payload without writing.
node scripts/sanity/import-articles.mjs --dry-run

# Import into the configured dataset (idempotent, stable document ids).
NEXT_PUBLIC_SANITY_PROJECT_ID=… SANITY_API_WRITE_TOKEN=… \
  node scripts/sanity/import-articles.mjs

# Equivalent Sanity CLI path.
npx sanity dataset import content/sanity/articles.ndjson production --replace
```

Migration sources live in `scripts/content/articles/*.mjs`. Editing an article
there and re-running the build regenerates both
`apps/web/content/articles/<slug>.json` and `content/sanity/articles.ndjson`
deterministically.

## Editorial block inventory

| Block | Sanity type | Renderer |
| --- | --- | --- |
| Rich text | `richTextBlock` | `components/blog/article-blocks.tsx` → `ArticleProse` |
| Quick answer | `quickAnswerBlock` | `article-blocks.tsx` |
| Hero image | `heroImageBlock` | `article-blocks.tsx` → `ArticleFigure` |
| Inline image | `inlineImageBlock` | `article-blocks.tsx` → `ArticleFigure` |
| Image gallery | `imageGalleryBlock` | `article-blocks.tsx` |
| Video / embed | `videoEmbedBlock` | `article-blocks.tsx` |
| Quote | `quoteBlock` | `article-blocks.tsx` |
| Callout | `calloutBlock` | `article-blocks.tsx` |
| Compliance disclaimer | `complianceDisclaimerBlock` | `article-blocks.tsx` |
| Checklist | `checklistBlock` | `article-blocks.tsx` |
| Comparison table | `comparisonTableBlock` | `article-blocks.tsx` |
| FAQs | `faqBlock` | `article-modules.tsx` → `ArticleFaqs` |
| Official sources | `officialSourcesBlock` | `article-modules.tsx` → `ArticleSources` |
| Calculator CTA | `calculatorCtaBlock` | `article-blocks.tsx` → `CtaPanel` |
| Program CTA | `programCtaBlock` | `article-blocks.tsx` → `CtaPanel` |
| Area guide CTA | `areaGuideCtaBlock` | `article-blocks.tsx` → `CtaPanel` |
| Consultation CTA | `consultationCtaBlock` | `article-blocks.tsx` → `CtaPanel` |
| Related articles | `relatedArticlesBlock` | `article-modules.tsx` → `ArticleRelatedLinks` |

Ordered and unordered lists and heading levels are Portable Text styles inside
`richTextBody`, rendered by `components/blog/portable-text.tsx`.
