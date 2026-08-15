import Link from "next/link"

import { BlogFigure } from "@/components/blog/blog-image"
import { Prose } from "@/components/blog/portable-text"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type {
  ArticleBlock,
  ArticleFaq,
  ArticleImage,
  ArticleSource,
  ArticleSummary,
  CalloutTone,
} from "@/lib/blog/types"

/* ------------------------------------------------------------------ */
/* Shared editorial primitives                                         */
/* ------------------------------------------------------------------ */

/** Reading-width column. Long-form copy stays around 68 characters per line. */
export const READING_WIDTH = "mx-auto w-full max-w-[46rem]"

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{children}</p>
  )
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

function QuickAnswer({ heading, content }: { heading: string; content: Parameters<typeof Prose>[0]["value"] }) {
  return (
    <aside
      className={cn(
        READING_WIDTH,
        "relative overflow-hidden rounded-xl border border-accent/25 bg-accent/[0.04] p-7 sm:p-9",
      )}
      aria-label={heading}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-accent" />
      <SectionLabel>{heading}</SectionLabel>
      <Prose value={content} className="mt-4 text-[18px] leading-[1.7] sm:text-[19px]" />
    </aside>
  )
}

const CALLOUT_TONES: Record<CalloutTone, { frame: string; bar: string; label: string }> = {
  note: {
    frame: "border-border bg-muted/60",
    bar: "bg-accent",
    label: "Note",
  },
  important: {
    frame: "border-accent/30 bg-accent/[0.05]",
    bar: "bg-accent",
    label: "Important",
  },
  caution: {
    frame: "border-warning/40 bg-warning/[0.07]",
    bar: "bg-warning",
    label: "Caution",
  },
}

function Callout({
  tone,
  heading,
  content,
}: {
  tone: CalloutTone
  heading?: string
  content: Parameters<typeof Prose>[0]["value"]
}) {
  const style = CALLOUT_TONES[tone] ?? CALLOUT_TONES.note
  return (
    <aside
      className={cn(READING_WIDTH, "relative overflow-hidden rounded-xl border p-6 sm:p-7", style.frame)}
      aria-label={heading ?? style.label}
    >
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1", style.bar)} />
      {/* The tone is named in text, never signalled by colour alone. */}
      <SectionLabel>{style.label}</SectionLabel>
      {heading && <p className="mt-2 font-semibold text-foreground">{heading}</p>}
      <Prose value={content} className="mt-3 text-[16px] leading-[1.7]" />
    </aside>
  )
}

function ComplianceDisclaimer({
  heading,
  content,
}: {
  heading?: string
  content: Parameters<typeof Prose>[0]["value"]
}) {
  return (
    <aside
      className={cn(READING_WIDTH, "rounded-xl border border-border bg-card p-6 sm:p-7")}
      aria-label={heading ?? "Compliance notice"}
    >
      <SectionLabel>{heading ?? "Compliance notice"}</SectionLabel>
      <Prose value={content} className="mt-3 text-[15px] leading-[1.75] text-muted-foreground" />
    </aside>
  )
}

function Checklist({
  heading,
  intro,
  items,
}: {
  heading?: string
  intro?: string
  items: string[]
}) {
  const headingId = `checklist-${slugify(heading ?? "checklist")}`
  return (
    <section
      className={cn(READING_WIDTH, "rounded-xl border border-border bg-card p-7 sm:p-9")}
      aria-labelledby={headingId}
    >
      <SectionLabel>Checklist</SectionLabel>
      <h2 id={headingId} className="mt-3 font-serif text-[26px] leading-tight sm:text-[30px]">
        {heading}
      </h2>
      {intro && <p className="mt-3 leading-[1.7] text-muted-foreground">{intro}</p>}
      <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[16px] leading-[1.65]">
            <span
              aria-hidden="true"
              className="mt-[0.35em] h-4 w-4 shrink-0 rounded-[3px] border-2 border-accent"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ComparisonTable({
  heading,
  caption,
  columns,
  rows,
}: {
  heading?: string
  caption?: string
  columns: string[]
  rows: Array<{ _key: string; cells: string[] }>
}) {
  const headingId = `table-${slugify(heading ?? "comparison")}`
  return (
    <section className={cn(READING_WIDTH)} aria-labelledby={headingId}>
      <SectionLabel>Compare</SectionLabel>
      <h2 id={headingId} className="mt-3 font-serif text-[26px] leading-tight sm:text-[30px]">
        {heading}
      </h2>
      {/* Horizontal scroll is confined to the table, never the page body. */}
      <div className="mt-6 -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[34rem] border-collapse text-left text-[15px]">
          {caption && (
            <caption className="caption-bottom pt-4 text-left text-sm leading-6 text-muted-foreground">
              {caption}
            </caption>
          )}
          <thead>
            <tr className="border-b-2 border-primary/20">
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="py-3 pr-6 align-bottom text-[11px] font-semibold uppercase tracking-[0.14em] text-accent last:pr-0"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._key} className="border-b border-border align-top last:border-b-0">
                {row.cells.map((cell, index) => (
                  <td
                    key={`${row._key}-${index}`}
                    className={cn(
                      "py-4 pr-6 leading-[1.65] last:pr-0",
                      index === 0 && "font-semibold text-foreground",
                      index > 0 && "text-muted-foreground",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function FaqSection({ heading, faqs }: { heading?: string; faqs: ArticleFaq[] }) {
  if (faqs.length === 0) return null
  const headingId = "article-faqs"
  return (
    <section className={cn(READING_WIDTH)} aria-labelledby={headingId}>
      <SectionLabel>Direct answers</SectionLabel>
      <h2 id={headingId} className="mt-3 font-serif text-[30px] leading-tight sm:text-[36px]">
        {heading ?? "Frequently asked questions"}
      </h2>
      <div className="mt-7 border-t border-border">
        {faqs.map((faq) => (
          <details key={faq._key} className="group border-b border-border">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-semibold leading-[1.5] marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <span>{faq.question}</span>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-accent transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-6 pr-10 text-[16px] leading-[1.75] text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function OfficialSources({
  heading,
  sources,
}: {
  heading?: string
  sources: ArticleSource[]
}) {
  if (sources.length === 0) return null
  const headingId = "article-sources"
  return (
    <section
      className={cn(READING_WIDTH, "rounded-xl border border-border bg-muted/50 p-7 sm:p-9")}
      aria-labelledby={headingId}
    >
      <SectionLabel>Verify it yourself</SectionLabel>
      <h2 id={headingId} className="mt-3 font-serif text-[26px] leading-tight sm:text-[30px]">
        {heading ?? "Official sources and review notes"}
      </h2>
      <p className="mt-3 text-[15px] leading-[1.75] text-muted-foreground">
        Program rules and public resources can change. Confirm current requirements with the
        organization responsible for the decision.
      </p>
      <ul className="mt-6 divide-y divide-border border-t border-border">
        {sources.map((source) => (
          <li key={source._key} className="py-4">
            <a
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary underline decoration-accent/50 underline-offset-[3px] hover:decoration-accent"
            >
              {source.label}
            </a>
            {source.publisher && (
              <span className="mt-1 block text-sm text-muted-foreground">{source.publisher}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Quote({ text, attribution, role }: { text: string; attribution?: string; role?: string }) {
  return (
    <figure className={cn(READING_WIDTH, "border-l-2 border-accent pl-7")}>
      <blockquote className="font-serif text-[24px] leading-[1.45] text-foreground sm:text-[28px]">
        {text}
      </blockquote>
      {attribution && (
        <figcaption className="mt-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{attribution}</span>
          {role && <span> · {role}</span>}
        </figcaption>
      )}
    </figure>
  )
}

function VideoEmbed({
  url,
  title,
  provider,
  description,
}: {
  url: string
  title: string
  provider: "youtube" | "vimeo"
  description?: string
}) {
  const embedUrl = toEmbedUrl(url, provider)
  if (!embedUrl) return null
  return (
    <figure className={cn(READING_WIDTH)}>
      <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {description && (
        <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">{description}</figcaption>
      )}
    </figure>
  )
}

function ImageGallery({ heading, images }: { heading?: string; images: ArticleImage[] }) {
  return (
    <section className={cn(READING_WIDTH)} aria-label={heading ?? "Image gallery"}>
      {heading && <SectionLabel>{heading}</SectionLabel>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {images.map((image) => (
          <BlogFigure
            key={image.src + image.alt}
            image={image}
            ratio="aspect-[4/3]"
            sizes="(min-width: 640px) 23rem, 100vw"
          />
        ))}
      </div>
    </section>
  )
}

function InlineCta({
  label,
  heading,
  description,
  href,
  buttonLabel,
  variant = "default",
}: {
  label: string
  heading: string
  description: string
  href: string
  buttonLabel: string
  variant?: "default" | "prominent"
}) {
  const headingId = `cta-${slugify(heading)}`
  const prominent = variant === "prominent"
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        READING_WIDTH,
        "rounded-xl p-7 sm:p-9",
        prominent
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-card",
      )}
    >
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.18em]",
          prominent ? "text-primary-foreground/70" : "text-accent",
        )}
      >
        {label}
      </p>
      <h2
        id={headingId}
        className={cn(
          "mt-3 font-serif text-[26px] leading-tight sm:text-[30px]",
          prominent && "text-primary-foreground",
        )}
      >
        {heading}
      </h2>
      <p
        className={cn(
          "mt-3 text-[16px] leading-[1.7]",
          prominent ? "text-primary-foreground/85" : "text-muted-foreground",
        )}
      >
        {description}
      </p>
      <Button
        href={href}
        variant={prominent ? "secondary" : "primary"}
        size="lg"
        className="mt-7"
      >
        {buttonLabel}
      </Button>
    </section>
  )
}

export function RelatedArticles({
  heading,
  articles,
}: {
  heading?: string
  articles: ArticleSummary[]
}) {
  if (articles.length === 0) return null
  const headingId = "related-articles"
  return (
    <section className={cn(READING_WIDTH)} aria-labelledby={headingId}>
      <SectionLabel>Related</SectionLabel>
      <h2 id={headingId} className="mt-3 font-serif text-[26px] leading-tight sm:text-[30px]">
        {heading ?? "Keep reading"}
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {articles.map((related) => (
          <article
            key={related._id}
            // `relative` anchors the card-wide click target below. Without it the
            // absolutely positioned overlay resolves against a distant ancestor
            // and covers unrelated parts of the page.
            className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/50"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              <BlogFigure
                image={related.featuredImage}
                ratio="aspect-[16/10]"
                sizes="(min-width: 640px) 22rem, 100vw"
                showCaption={false}
                className="h-full [&>div]:h-full [&>div]:rounded-none [&>div]:border-0"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                {related.category.title}
              </p>
              <h3 className="mt-3 font-serif text-[21px] leading-[1.25]">
                <Link href={`/blog/${related.slug}`} className="group-hover:text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {related.title}
                </Link>
              </h3>
              <p className="mt-3 line-clamp-3 text-[15px] leading-[1.65] text-muted-foreground">
                {related.excerpt}
              </p>
              <p className="mt-4 pt-1 text-sm text-muted-foreground">{related.readingTime}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Switchboard                                                         */
/* ------------------------------------------------------------------ */

/**
 * Maps one CMS block to one renderer. Every schema type in
 * `sanity/schema/objects/blocks.ts` has a case here; an unknown type renders
 * nothing rather than throwing, so a newly added schema type can never take
 * down a published page.
 */
export function ArticleBlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block._type) {
    case "richTextBlock":
      return <Prose value={block.content} className={READING_WIDTH} />

    case "quickAnswer":
      return <QuickAnswer heading={block.heading} content={block.content} />

    case "heroImage":
      // The hero is rendered by the article header; skip it in the body flow.
      return null

    case "inlineImage":
      return (
        <BlogFigure
          image={block.image}
          ratio={block.size === "full" ? "aspect-[21/9]" : "aspect-[16/9]"}
          sizes={block.size === "full" ? "100vw" : "(min-width: 768px) 46rem, 100vw"}
          className={block.size === "full" ? "w-full" : READING_WIDTH}
        />
      )

    case "imageGallery":
      return <ImageGallery heading={block.heading} images={block.images} />

    case "videoEmbed":
      return (
        <VideoEmbed
          url={block.url}
          title={block.title}
          provider={block.provider}
          description={block.description}
        />
      )

    case "quote":
      return <Quote text={block.text} attribution={block.attribution} role={block.role} />

    case "callout":
      return <Callout tone={block.tone} heading={block.heading} content={block.content} />

    case "complianceDisclaimer":
      return <ComplianceDisclaimer heading={block.heading} content={block.content} />

    case "checklist":
      return <Checklist heading={block.heading} intro={block.intro} items={block.items} />

    case "comparisonTable":
      return (
        <ComparisonTable
          heading={block.heading}
          caption={block.caption}
          columns={block.columns}
          rows={block.rows}
        />
      )

    case "faqBlock":
      return <FaqSection heading={block.heading} faqs={block.faqs} />

    case "officialSourcesBlock":
      return <OfficialSources heading={block.heading} sources={block.sources} />

    case "calculatorCta":
      return (
        <InlineCta
          label="Plan with numbers"
          heading={block.heading}
          description={block.description}
          href={block.href}
          buttonLabel={block.buttonLabel}
        />
      )

    case "programCta":
      return (
        <InlineCta
          label="Program guidance"
          heading={block.heading}
          description={block.description}
          href={block.href}
          buttonLabel={block.buttonLabel}
        />
      )

    case "areaGuideCta":
      return (
        <InlineCta
          label="Local guidance"
          heading={block.heading}
          description={block.description}
          href={block.href}
          buttonLabel={block.buttonLabel}
        />
      )

    case "consultationCta":
      return (
        <InlineCta
          label="Next step"
          heading={block.heading}
          description={block.description}
          href="/consultation"
          buttonLabel={block.buttonLabel}
          variant="prominent"
        />
      )

    case "relatedArticlesBlock":
      return <RelatedArticles heading={block.heading} articles={block.articles} />

    default:
      return null
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
}

function toEmbedUrl(url: string, provider: "youtube" | "vimeo"): string | null {
  try {
    const parsed = new URL(url)
    if (provider === "youtube") {
      const id =
        parsed.searchParams.get("v") ??
        (parsed.hostname.endsWith("youtu.be") ? parsed.pathname.slice(1) : null)
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    const id = parsed.pathname.split("/").filter(Boolean).pop()
    return id ? `https://player.vimeo.com/video/${id}` : null
  } catch {
    return null
  }
}
