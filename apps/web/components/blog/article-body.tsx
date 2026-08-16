import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, CircleAlert, Info, Quote, Sparkles, X } from "lucide-react"

import { RichText } from "@/components/blog/portable-text"
import { Button } from "@/components/ui/button"
import { safeExternalUrl, safeInternalPath } from "@/lib/cms/links"
import type {
  ArticleBodyBlock,
  CalculatorCtaBlock,
  CalloutBlock,
  ChecklistBlock,
  ComparisonTableBlock,
  ComplianceDisclaimerBlock,
  ConsultationCtaBlock,
  EmbedBlock,
  FaqGroupBlock,
  HeroImageBlock,
  ImageGalleryBlock,
  InlineImageBlock,
  LinkCtaBlock,
  PortableTextBlock,
  PullQuoteBlock,
  QuickAnswerBlock,
  RelatedArticlesBlock,
  SourceListBlock,
} from "@/lib/cms/types"

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

function BlockHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="scroll-mt-28 text-[1.5rem] leading-tight sm:text-[1.75rem]">
      {children}
    </h2>
  )
}

/**
 * Blocks that break the reading measure use this wrapper so they stay aligned
 * with the prose column on small screens and breathe outward on large ones.
 */
function Bleed({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`my-12 lg:-mx-8 ${className}`}>{children}</div>
}

function isSafeEmbed(url: string): { src: string; provider: "youtube" | "vimeo" } | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== "https:") return null
  const host = parsed.hostname.replace(/^www\./, "")

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = parsed.searchParams.get("v")
    return id ? { src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`, provider: "youtube" } : null
  }
  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1)
    return id ? { src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`, provider: "youtube" } : null
  }
  if (host === "vimeo.com") {
    const id = parsed.pathname.split("/").filter(Boolean)[0]
    return id ? { src: `https://player.vimeo.com/video/${encodeURIComponent(id)}`, provider: "vimeo" } : null
  }
  return null
}

function EditorialImage({
  src,
  alt,
  focalPoint,
  className = "",
  sizes,
  priority = false,
}: {
  src: string
  alt: string
  focalPoint?: string
  className?: string
  sizes: string
  priority?: boolean
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
      style={focalPoint ? { objectPosition: focalPoint } : undefined}
    />
  )
}

function Figure({
  block,
  aspect,
  sizes,
}: {
  block: HeroImageBlock | InlineImageBlock
  aspect: string
  sizes: string
}) {
  return (
    <figure>
      <div className={`relative ${aspect} overflow-hidden rounded-lg bg-muted`}>
        <EditorialImage src={block.src} alt={block.alt} focalPoint={block.focalPoint} sizes={sizes} />
      </div>
      {(block.caption || block.credit) && (
        <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm leading-6 text-muted-foreground">
          {block.caption && <span>{block.caption}</span>}
          {block.credit && <span className="text-xs uppercase tracking-[0.08em]">{block.credit}</span>}
        </figcaption>
      )}
    </figure>
  )
}

/* -------------------------------------------------------------------------- */
/* Block renderers                                                            */
/* -------------------------------------------------------------------------- */

function QuickAnswer({ block }: { block: QuickAnswerBlock }) {
  return (
    <aside
      className="my-10 rounded-xl border border-accent/25 bg-accent/[0.06] p-6 sm:p-8"
      aria-labelledby={`${block._key}-heading`}
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        <Sparkles className="size-4" aria-hidden="true" />
        Quick answer
      </p>
      <h2 id={`${block._key}-heading`} className="mt-3 text-[1.5rem] leading-tight sm:text-[1.75rem]">
        {block.heading}
      </h2>
      <div className="mt-4 text-[1.0625rem] leading-8 text-foreground/90">
        <RichText value={block.body} compact />
      </div>
    </aside>
  )
}

function HeroImage({ block }: { block: HeroImageBlock }) {
  return (
    <Bleed>
      <Figure block={block} aspect="aspect-[16/9]" sizes="(min-width: 1024px) 46rem, 100vw" />
    </Bleed>
  )
}

function InlineImage({ block }: { block: InlineImageBlock }) {
  if (block.layout === "inset") {
    return (
      <div className="my-10 sm:float-right sm:ml-8 sm:w-1/2">
        <Figure block={block} aspect="aspect-[4/3]" sizes="(min-width: 640px) 22rem, 100vw" />
      </div>
    )
  }
  return (
    <Bleed>
      <Figure
        block={block}
        aspect={block.layout === "full" ? "aspect-[21/9]" : "aspect-[3/2]"}
        sizes="(min-width: 1024px) 46rem, 100vw"
      />
    </Bleed>
  )
}

function ImageGallery({ block }: { block: ImageGalleryBlock }) {
  if (!block.images?.length) return null
  return (
    <Bleed>
      {block.heading && <BlockHeading id={`${block._key}-heading`}>{block.heading}</BlockHeading>}
      <ul className={`mt-6 grid gap-4 ${block.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {block.images.map((image) => (
          <li key={image._key}>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <EditorialImage
                  src={image.src}
                  alt={image.alt}
                  focalPoint={image.focalPoint}
                  sizes="(min-width: 640px) 22rem, 100vw"
                />
              </div>
              {image.caption && (
                <figcaption className="mt-2 text-sm leading-6 text-muted-foreground">{image.caption}</figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </Bleed>
  )
}

function Embed({ block }: { block: EmbedBlock }) {
  const safe = isSafeEmbed(block.url)
  if (!safe) {
    return (
      <Bleed>
        <p className="rounded-lg border border-border bg-muted p-5 text-sm leading-7 text-muted-foreground">
          {safeExternalUrl(block.url) ? (
            <a
              href={safeExternalUrl(block.url) as string}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-accent underline underline-offset-4"
            >
              {block.title}
            </a>
          ) : (
            <span className="font-semibold">{block.title}</span>
          )}
          {block.description ? ` — ${block.description}` : null}
        </p>
      </Bleed>
    )
  }
  return (
    <Bleed>
      <figure>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <iframe
            src={safe.src}
            title={block.title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </div>
        <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
          {block.title}
          {block.description ? ` — ${block.description}` : null}
        </figcaption>
      </figure>
    </Bleed>
  )
}

function PullQuote({ block }: { block: PullQuoteBlock }) {
  return (
    <figure className="my-12 border-l-2 border-accent pl-6 sm:pl-8">
      <Quote className="size-6 text-accent/50" aria-hidden="true" />
      <blockquote className="mt-3 font-serif text-[1.5rem] leading-[1.35] text-foreground sm:text-[1.75rem]">
        {block.quote}
      </blockquote>
      {block.attribution && (
        <figcaption className="mt-4 text-sm font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {block.attribution}
        </figcaption>
      )}
    </figure>
  )
}

const calloutTones = {
  note: { icon: Info, ring: "border-accent/25 bg-accent/[0.06]", mark: "text-accent", label: "Note" },
  caution: { icon: CircleAlert, ring: "border-warning/35 bg-warning/[0.08]", mark: "text-warning", label: "Important" },
  success: { icon: Check, ring: "border-success/30 bg-secondary", mark: "text-success", label: "Good practice" },
} as const

function Callout({ block }: { block: CalloutBlock }) {
  const tone = calloutTones[block.tone] ?? calloutTones.note
  const Icon = tone.icon
  return (
    <aside className={`my-10 rounded-xl border p-6 ${tone.ring}`}>
      <p className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${tone.mark}`}>
        <Icon className="size-4" aria-hidden="true" />
        {tone.label}
      </p>
      {block.heading && <p className="mt-3 font-serif text-xl leading-snug">{block.heading}</p>}
      <div className="mt-3 leading-7 text-foreground/90">
        <RichText value={block.body} compact />
      </div>
    </aside>
  )
}

function ComplianceDisclaimer({ block }: { block: ComplianceDisclaimerBlock }) {
  return (
    <aside className="my-10 rounded-xl border border-border bg-muted/70 p-6" aria-label="Compliance notice">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <CircleAlert className="size-4" aria-hidden="true" />
        {block.heading ?? "Compliance notice"}
      </p>
      <div className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">
        <RichText value={block.body} compact />
      </div>
    </aside>
  )
}

function Checklist({ block }: { block: ChecklistBlock }) {
  const avoid = block.variant === "avoid"
  const Marker = avoid ? X : Check
  return (
    <section className="my-12 rounded-xl border border-border bg-card p-6 sm:p-8" aria-labelledby={`${block._key}-heading`}>
      {block.heading && <BlockHeading id={`${block._key}-heading`}>{block.heading}</BlockHeading>}
      {block.intro && <p className="mt-3 leading-7 text-muted-foreground">{block.intro}</p>}
      <ul className="mt-6 space-y-4">
        {block.items.map((item) => (
          <li key={item._key} className="flex gap-3.5">
            <span
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border ${
                avoid ? "border-destructive/35 bg-destructive/10" : "border-accent/35 bg-accent/10"
              }`}
              aria-hidden="true"
            >
              <Marker className={`size-3.5 ${avoid ? "text-destructive" : "text-accent"}`} />
            </span>
            <span className="leading-7">
              <span className="font-medium text-foreground">{item.label}</span>
              {item.detail && <span className="mt-1 block text-[0.9375rem] text-muted-foreground">{item.detail}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ComparisonTable({ block }: { block: ComparisonTableBlock }) {
  return (
    <Bleed>
      <section aria-labelledby={block.heading ? `${block._key}-heading` : undefined}>
        {block.heading && <BlockHeading id={`${block._key}-heading`}>{block.heading}</BlockHeading>}
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9375rem]">
            {block.caption && <caption className="sr-only">{block.caption}</caption>}
            <thead>
              <tr className="border-b border-border bg-muted/60">
                {block.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-5 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row._key} className="border-b border-border last:border-b-0">
                  {row.cells.map((cell, index) =>
                    index === 0 ? (
                      <th key={index} scope="row" className="px-5 py-4 align-top font-sans font-semibold text-foreground">
                        {cell}
                      </th>
                    ) : (
                      <td key={index} className="px-5 py-4 align-top leading-7 text-muted-foreground">
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {block.caption && <p className="mt-3 text-sm leading-6 text-muted-foreground">{block.caption}</p>}
      </section>
    </Bleed>
  )
}

export function FaqList({ faqs, idPrefix }: { faqs: FaqGroupBlock["faqs"]; idPrefix: string }) {
  return (
    <div className="mt-6 border-t border-border">
      {faqs.map((faq) => (
        <details key={faq._key} name={idPrefix} className="group border-b border-border">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-sans text-[1.0625rem] font-semibold marker:content-none hover:text-accent">
            {faq.question}
            <span
              className="mt-1 shrink-0 text-accent transition-transform group-open:rotate-45 motion-reduce:transition-none"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="pb-6 pr-10 leading-7 text-muted-foreground">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}

function FaqGroup({ block }: { block: FaqGroupBlock }) {
  return (
    <section className="my-12" aria-labelledby={`${block._key}-heading`}>
      <BlockHeading id={`${block._key}-heading`}>{block.heading ?? "Frequently asked questions"}</BlockHeading>
      {block.intro && <p className="mt-3 leading-7 text-muted-foreground">{block.intro}</p>}
      <FaqList faqs={block.faqs} idPrefix={block._key} />
    </section>
  )
}

export function SourceLinks({ sources }: { sources: SourceListBlock["sources"] }) {
  return (
    <ul className="mt-5 space-y-3.5">
      {sources.map((source) => {
        const href = safeExternalUrl(source.href)
        return (
          <li key={source._key} className="leading-7">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
              >
                {source.label}
              </a>
            ) : (
              <span className="font-medium">{source.label}</span>
            )}
            {source.publisher && <span className="ml-2 text-sm text-muted-foreground">{source.publisher}</span>}
          </li>
        )
      })}
    </ul>
  )
}

function SourceList({ block }: { block: SourceListBlock }) {
  return (
    <section className="my-12" aria-labelledby={`${block._key}-heading`}>
      <BlockHeading id={`${block._key}-heading`}>{block.heading ?? "Official sources"}</BlockHeading>
      {block.intro && <p className="mt-3 leading-7 text-muted-foreground">{block.intro}</p>}
      <SourceLinks sources={block.sources} />
    </section>
  )
}

function CtaShell({
  eyebrow,
  heading,
  body,
  children,
  emphasis = false,
}: {
  eyebrow: string
  heading: string
  body?: string
  children: React.ReactNode
  emphasis?: boolean
}) {
  return (
    <Bleed>
      <section
        className={
          emphasis
            ? "rounded-xl bg-primary p-7 text-primary-foreground sm:p-10"
            : "rounded-xl border border-border bg-card p-7 sm:p-8"
        }
      >
        <p
          className={`text-xs font-semibold uppercase tracking-[0.16em] ${
            emphasis ? "text-primary-foreground/70" : "text-accent"
          }`}
        >
          {eyebrow}
        </p>
        <p className={`mt-3 font-serif text-[1.5rem] leading-tight sm:text-[1.75rem] ${emphasis ? "" : "text-foreground"}`}>
          {heading}
        </p>
        {body && (
          <p className={`mt-3 max-w-2xl leading-7 ${emphasis ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
            {body}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>
      </section>
    </Bleed>
  )
}

function CalculatorCta({ block }: { block: CalculatorCtaBlock }) {
  return (
    <CtaShell eyebrow="Planning tools" heading={block.heading} body={block.body}>
      {block.calculators.map((calculator, index) => (
        <Button
          key={calculator._key}
          href={safeInternalPath(calculator.href, "/calculators")}
          variant={index === 0 ? "primary" : "outline"}
        >
          {calculator.label}
        </Button>
      ))}
    </CtaShell>
  )
}

function LinkCta({ block }: { block: LinkCtaBlock }) {
  return (
    <CtaShell
      eyebrow={block._type === "programCta" ? "Program guidance" : "Local guidance"}
      heading={block.heading}
      body={block.body}
    >
      <Button href={safeInternalPath(block.href)} variant="outline">
        {block.label}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </CtaShell>
  )
}

function ConsultationCta({ block }: { block: ConsultationCtaBlock }) {
  return (
    <CtaShell eyebrow="Next step" heading={block.heading} body={block.body} emphasis>
      <Button href={safeInternalPath(block.href, "/consultation")} variant="secondary">
        {block.label}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
      {block.secondaryHref && block.secondaryLabel && (
        <Button
          href={safeInternalPath(block.secondaryHref)}
          variant="ghost"
          className="border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
        >
          {block.secondaryLabel}
        </Button>
      )}
    </CtaShell>
  )
}

function RelatedArticleLinks({ block }: { block: RelatedArticlesBlock }) {
  return (
    <Bleed>
      <section aria-labelledby={`${block._key}-heading`}>
        <BlockHeading id={`${block._key}-heading`}>{block.heading ?? "Keep reading"}</BlockHeading>
        {block.intro && <p className="mt-3 leading-7 text-muted-foreground">{block.intro}</p>}
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {block.links.map((link) => (
            <li key={link._key}>
              <Link
                href={safeInternalPath(link.href)}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/50"
              >
                <span className="font-sans font-semibold text-foreground group-hover:text-accent">{link.label}</span>
                {link.description && (
                  <span className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">{link.description}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Bleed>
  )
}

/* -------------------------------------------------------------------------- */
/* Dispatcher                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Renders an article body. Consecutive rich-text blocks are grouped so
 * Portable Text can build correct list structures across sibling nodes.
 */
export function ArticleBody({ body }: { body: ArticleBodyBlock[] }) {
  const groups: { kind: "prose" | "custom"; nodes: ArticleBodyBlock[] }[] = []

  for (const node of body) {
    const kind = node._type === "block" ? "prose" : "custom"
    const last = groups.at(-1)
    if (last && last.kind === kind && kind === "prose") {
      last.nodes.push(node)
    } else {
      groups.push({ kind, nodes: [node] })
    }
  }

  return (
    <div className="text-[1.0625rem] leading-[1.75] text-foreground/90 sm:text-[1.125rem] sm:leading-[1.8]">
      {groups.map((group, index) =>
        group.kind === "prose" ? (
          <RichText key={`prose-${index}`} value={group.nodes as PortableTextBlock[]} />
        ) : (
          <ArticleBlock key={(group.nodes[0] as { _key: string })._key} block={group.nodes[0] as ArticleBodyBlock} />
        )
      )}
    </div>
  )
}

function ArticleBlock({ block }: { block: ArticleBodyBlock }) {
  switch (block._type) {
    case "quickAnswer":
      return <QuickAnswer block={block} />
    case "heroImage":
      return <HeroImage block={block} />
    case "inlineImage":
      return <InlineImage block={block} />
    case "imageGallery":
      return <ImageGallery block={block} />
    case "embed":
      return <Embed block={block} />
    case "pullQuote":
      return <PullQuote block={block} />
    case "callout":
      return <Callout block={block} />
    case "complianceDisclaimer":
      return <ComplianceDisclaimer block={block} />
    case "checklist":
      return <Checklist block={block} />
    case "comparisonTable":
      return <ComparisonTable block={block} />
    case "faqGroup":
      return <FaqGroup block={block} />
    case "sourceList":
      return <SourceList block={block} />
    case "calculatorCta":
      return <CalculatorCta block={block} />
    case "programCta":
    case "areaCta":
      return <LinkCta block={block} />
    case "consultationCta":
      return <ConsultationCta block={block} />
    case "relatedArticles":
      return <RelatedArticleLinks block={block} />
    default:
      return null
  }
}
