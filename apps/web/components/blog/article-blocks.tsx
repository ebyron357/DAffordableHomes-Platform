import Link from "next/link"
import { AlertTriangle, ArrowRight, Calculator, Check, Compass, Lightbulb, MapPin, Play, Quote } from "lucide-react"
import { safeHref } from "@/lib/blog/safe-href"
import type { ArticleBodyBlock } from "@/lib/blog/types"
import { ArticleFigure } from "./article-image"
import { ArticleFaqs, ArticleRelatedLinks, ArticleSources } from "./article-modules"
import { ArticleProse } from "./portable-text"
import { cn } from "@/lib/utils"

/**
 * Frontend renderers for every editorial block the CMS can produce.
 *
 * These components own layout and typography only. All copy comes from the
 * content source.
 */

const CALLOUT_TONES = {
  insight: { icon: Lightbulb, ring: "border-accent/35 bg-accent/[0.06]", label: "Insight" },
  caution: { icon: AlertTriangle, ring: "border-warning/45 bg-warning/[0.08]", label: "Important" },
  key: { icon: Compass, ring: "border-primary/30 bg-primary/[0.05]", label: "Key point" },
} as const

function CtaPanel({
  eyebrow,
  icon: Icon,
  heading,
  body,
  href,
  label,
}: {
  eyebrow: string
  icon: typeof ArrowRight
  heading: string
  body?: string | null
  href: string
  label: string
}) {
  // CMS-authored destination: rendered only when it resolves to a safe URL.
  const target = safeHref(href)
  if (!target) return null

  return (
    <aside className="mt-12 overflow-hidden rounded-2xl border border-border bg-primary text-primary-foreground">
      <div className="px-6 py-8 sm:px-9 sm:py-10">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">
          <Icon className="size-4" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-2xl font-serif text-2xl leading-tight sm:text-[1.75rem]">{heading}</h2>
        {body ? <p className="mt-4 max-w-2xl leading-7 text-primary-foreground/85">{body}</p> : null}
        <Link
          href={target.href}
          className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-sm bg-primary-foreground px-5 py-3 text-[15px] font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
        >
          {label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  )
}

export function ArticleBlock({ block }: { block: ArticleBodyBlock }) {
  switch (block._type) {
    case "richTextBlock":
      return <ArticleProse value={block.content} className="mt-10 first:mt-0" />

    case "quickAnswerBlock":
      return (
        <aside
          aria-label={block.heading}
          className="mt-10 rounded-2xl border border-accent/30 bg-accent/[0.06] p-6 first:mt-0 sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{block.heading}</p>
          <ArticleProse
            value={block.content}
            className="mt-3 [&_p]:mt-4 [&_p]:text-[1.0625rem] [&_p]:leading-8 [&_p:first-child]:mt-0"
          />
        </aside>
      )

    case "heroImageBlock":
      return <ArticleFigure image={block.image} sizes="(min-width: 1024px) 44rem, 100vw" className="mt-10" />

    case "inlineImageBlock":
      return (
        <ArticleFigure
          image={block.image}
          sizes={block.width === "wide" ? "(min-width: 1440px) 72rem, 100vw" : "(min-width: 1024px) 44rem, 100vw"}
          aspect={block.width === "wide" ? "aspect-[21/9]" : "aspect-[16/9]"}
          className={cn("mt-10", block.width === "wide" && "lg:-mx-24")}
        />
      )

    case "imageGalleryBlock":
      return (
        <section className="mt-12">
          {block.heading ? (
            <h2 className="font-serif text-[1.75rem] leading-tight text-foreground">{block.heading}</h2>
          ) : null}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {block.images.map((image, index) => (
              <ArticleFigure
                key={`${image.alt}-${index}`}
                image={image}
                sizes="(min-width: 640px) 22rem, 100vw"
                aspect="aspect-[4/3]"
              />
            ))}
          </div>
        </section>
      )

    case "videoEmbedBlock":
      return (
        <section className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <Play className="size-4" aria-hidden="true" />
            Watch
          </p>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-foreground">{block.title}</h2>
          {block.description ? <p className="mt-3 leading-7 text-muted-foreground">{block.description}</p> : null}
          {safeHref(block.url) ? (
            <a
              href={safeHref(block.url)?.href}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-primary underline decoration-accent/50 underline-offset-4"
            >
              Open the recording
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </section>
      )

    case "quoteBlock":
      return (
        <figure className="mt-12 border-l-4 border-accent pl-6 sm:pl-8">
          <Quote className="size-6 text-accent" aria-hidden="true" />
          <blockquote className="mt-3 font-serif text-xl leading-9 text-foreground sm:text-2xl">
            {block.quote}
          </blockquote>
          {block.attribution ? (
            <figcaption className="mt-4 text-sm text-muted-foreground">
              {block.attribution}
              {block.role ? <span className="block text-xs uppercase tracking-wide">{block.role}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      )

    case "calloutBlock": {
      const tone = CALLOUT_TONES[block.tone ?? "insight"]
      const Icon = tone.icon
      return (
        <aside className={cn("mt-12 rounded-2xl border p-6 sm:p-8", tone.ring)}>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <Icon className="size-4" aria-hidden="true" />
            {tone.label}
          </p>
          {block.heading ? (
            <h2 className="mt-3 font-serif text-2xl leading-tight text-foreground">{block.heading}</h2>
          ) : null}
          <ArticleProse value={block.content} className="mt-2" />
        </aside>
      )
    }

    case "complianceDisclaimerBlock":
      return (
        <aside className="mt-12 rounded-2xl border border-border bg-muted p-6 sm:p-8" aria-label="Important notice">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {block.heading ?? "Important notice"}
          </p>
          <ArticleProse
            value={block.content}
            className="mt-2 [&_p]:text-[0.9375rem] [&_p]:leading-7 [&_p]:text-muted-foreground"
          />
        </aside>
      )

    case "checklistBlock":
      return (
        <section className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-serif text-2xl leading-tight text-foreground">{block.heading}</h2>
          {block.intro ? <p className="mt-3 leading-7 text-muted-foreground">{block.intro}</p> : null}
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {block.items.map((item, index) => (
              <li key={item._key ?? index} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"
                >
                  <Check className="size-3" />
                </span>
                <span className="text-[0.9375rem] leading-7 text-foreground/90">
                  {item.label}
                  {item.detail ? <span className="mt-1 block text-sm text-muted-foreground">{item.detail}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )

    case "comparisonTableBlock":
      return (
        <section className="mt-12">
          <h2 className="font-serif text-[1.75rem] leading-tight text-foreground">{block.heading}</h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[36rem] border-collapse text-left text-[0.9375rem]">
              {block.caption ? (
                <caption className="caption-bottom px-5 py-4 text-left text-sm leading-6 text-muted-foreground">
                  {block.caption}
                </caption>
              ) : null}
              <thead className="bg-muted">
                <tr>
                  {block.columns.map((column) => (
                    <th key={column} scope="col" className="px-5 py-4 font-semibold text-foreground">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {block.rows.map((row, index) => (
                  <tr key={row._key ?? index}>
                    <th scope="row" className="px-5 py-4 align-top font-semibold text-foreground">
                      {row.header}
                    </th>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-5 py-4 align-top leading-7 text-muted-foreground">
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

    case "faqBlock":
      return <ArticleFaqs heading={block.heading} faqs={block.faqs} id={`faq-${block._key}`} />

    case "officialSourcesBlock":
      return (
        <ArticleSources
          heading={block.heading}
          intro={block.intro}
          sources={block.sources}
          id={`sources-${block._key}`}
        />
      )

    case "calculatorCtaBlock":
      return (
        <CtaPanel
          eyebrow="Plan with real numbers"
          icon={Calculator}
          heading={block.heading}
          body={block.body}
          href={block.href}
          label={block.label}
        />
      )

    case "programCtaBlock":
      return (
        <CtaPanel
          eyebrow="Program guidance"
          icon={Compass}
          heading={block.heading}
          body={block.body}
          href={block.href}
          label={block.label}
        />
      )

    case "areaGuideCtaBlock":
      return (
        <CtaPanel
          eyebrow={`${block.area} area guide`}
          icon={MapPin}
          heading={block.heading}
          body={block.body}
          href={block.href}
          label={block.label}
        />
      )

    case "consultationCtaBlock":
      return (
        <CtaPanel
          eyebrow="Talk it through"
          icon={ArrowRight}
          heading={block.heading}
          body={block.body}
          href={block.href}
          label={block.label}
        />
      )

    case "relatedArticlesBlock":
      return (
        <div className="mt-12">
          <ArticleRelatedLinks heading={block.heading} links={block.links} id={`related-${block._key}`} />
        </div>
      )

    default:
      return null
  }
}

export function ArticleBody({ blocks }: { blocks: ArticleBodyBlock[] }) {
  return (
    <div>
      {blocks.map((block) => (
        <ArticleBlock key={block._key} block={block} />
      ))}
    </div>
  )
}
