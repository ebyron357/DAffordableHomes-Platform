import Image from "next/image"
import Link from "next/link"
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

/**
 * Interior-route composition primitives.
 *
 * These exist so an interior page can be written as fields, splits and
 * icon-supported pathways instead of as a stack of white boxes each holding a
 * heading, a paragraph and a button. The styling lives in the `.dh-*` layer in
 * globals.css; this file is the vocabulary pages compose with.
 */

export type BandTone = "page" | "white" | "alt" | "navy" | "teal" | "green"

export function Band({
  tone = "page",
  tight = false,
  className,
  children,
  ...rest
}: {
  tone?: BandTone
  tight?: boolean
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<"section">, "className" | "children">) {
  return (
    <section className={cn("dh-band", `dh-band-${tone}`, tight && "dh-band-tight", className)} {...rest}>
      <Container>{children}</Container>
    </section>
  )
}

/** Kicker + heading + lede. `row` puts an action opposite the heading. */
export function BandLead({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  titleId,
  lede,
  as: Heading = "h2",
  aside,
}: {
  eyebrow?: string
  eyebrowIcon?: ComponentType<{ className?: string }>
  title: string
  titleId?: string
  lede?: string
  as?: "h2" | "h3"
  aside?: ReactNode
}) {
  const lead = (
    <div className="dh-lead">
      {eyebrow && (
        <p className="dh-kicker">
          {EyebrowIcon && <EyebrowIcon aria-hidden="true" />}
          {eyebrow}
        </p>
      )}
      <Heading id={titleId}>{title}</Heading>
      {lede && <p>{lede}</p>}
    </div>
  )

  if (!aside) return lead

  return (
    <div className="dh-lead-row dh-lead-row-spaced">
      {lead}
      {aside}
    </div>
  )
}

/**
 * Photograph and copy, neither one an inset of the other.
 *
 * The photograph sits on a brand plate — an offset teal or green rectangle —
 * which is what keeps an image from reading as a card floating on white, and
 * what puts painted brand area on pages that otherwise have none.
 */
export function Split({
  media,
  children,
  reverse = false,
  weight = "even",
  plate = "teal",
  ratio = "4 / 5",
  sizes = "(max-width: 1000px) 100vw, 620px",
}: {
  media: {
    src: string
    alt: string
    objectPosition?: string
    caption?: { label: string; title: string }
    priority?: boolean
  }
  children: ReactNode
  reverse?: boolean
  weight?: "even" | "media" | "copy"
  plate?: "teal" | "green" | "none"
  ratio?: string
  sizes?: string
}) {
  return (
    <div
      className={cn(
        "dh-split",
        weight === "media" && "dh-split-wide-media",
        weight === "copy" && "dh-split-wide-copy",
        reverse && "dh-split-reverse",
      )}
    >
      <div className="dh-split-media">
        <div className={cn(plate !== "none" && "dh-split-frame", plate === "green" && "dh-split-frame-green")}>
          <figure className="dh-split-figure" style={{ aspectRatio: ratio }}>
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes={sizes}
              priority={media.priority}
              style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
            />
            {media.caption && (
              <figcaption className="dh-split-caption">
                <span>{media.caption.label}</span>
                <strong>{media.caption.title}</strong>
              </figcaption>
            )}
          </figure>
        </div>
      </div>
      <div className="dh-split-copy">{children}</div>
    </div>
  )
}

export type FeatureTone = "teal" | "green" | "gold" | "navy"

export type Feature = {
  title: string
  body: string
  href?: string
  icon: ComponentType<{ className?: string }>
  tone?: FeatureTone
  action?: string
}

/**
 * Icon-supported pathway row.
 *
 * Icons are here to say what a thing *is* before the reader parses a sentence —
 * a map pin for a place, a calculator for a tool, a key for a purchase. Every
 * entry has to earn one; this component is not a place to build an icon wall.
 */
export function Features({
  items,
  rule = "teal",
  className,
}: {
  items: readonly Feature[]
  rule?: "teal" | "gold" | "green"
  className?: string
}) {
  return (
    <ul
      className={cn(
        "dh-features",
        rule === "gold" && "dh-features-gold",
        rule === "green" && "dh-features-green",
        className,
      )}
    >
      {items.map((item) => {
        const inner = (
          <>
            <span className={cn("dh-feature-icon", item.tone && `dh-feature-icon-${item.tone}`)}>
              <item.icon aria-hidden="true" />
            </span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            {item.href && (
              <span className="dh-feature-link">
                {item.action ?? "Open"} <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            )}
          </>
        )

        return (
          <li key={item.title}>
            {item.href ? (
              <Link href={item.href} className="dh-feature-card">
                {inner}
              </Link>
            ) : (
              <div className="dh-feature">{inner}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Numbered process. Ordered list, because the order is the meaning. */
export function Steps({ items }: { items: readonly { title: string; description: string }[] }) {
  return (
    <ol className="dh-steps">
      {items.map((step, index) => (
        <li key={step.title} className="dh-step">
          <span className="dh-step-mark">
            <span className="dh-step-num">{index + 1}</span>
            <span className="dh-step-rule" aria-hidden="true" />
          </span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </li>
      ))}
    </ol>
  )
}

/**
 * Honest status strip.
 *
 * Where the site has to say a provider is not connected or a detail is not yet
 * verified, the words stay exactly as honest as they were — only the shape
 * changes, from a warning panel adrift in an empty page to a brand-coloured
 * strip with a next action beside it.
 */
export function StatusStrip({
  icon: Icon,
  title,
  children,
  onDark = false,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  children?: ReactNode
  onDark?: boolean
}) {
  return (
    <div className={cn("dh-status", onDark && "dh-status-on-dark")} role="status">
      <span className="dh-status-icon">
        <Icon aria-hidden="true" />
      </span>
      <div>
        <strong>{title}</strong>
        {children}
      </div>
    </div>
  )
}

/** Image-led closing band. The photograph must be an approved asset. */
export function CtaBand({
  eyebrow,
  title,
  titleId,
  body,
  image,
  children,
}: {
  eyebrow?: string
  title: string
  titleId?: string
  body?: string
  image?: { src: string; objectPosition?: string }
  children?: ReactNode
}) {
  return (
    <section className="dh-cta" aria-labelledby={titleId}>
      {image && (
        <Image
          src={image.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
          className="dh-cta-image"
        />
      )}
      <span className="dh-cta-scrim" aria-hidden="true" />
      <Container>
        <div className="dh-cta-inner">
          {eyebrow && <p className="dh-kicker">{eyebrow}</p>}
          <h2 id={titleId}>{title}</h2>
          {body && <p>{body}</p>}
          {children && <div className="dh-cta-actions">{children}</div>}
        </div>
      </Container>
    </section>
  )
}

/** Q&A disclosure list. */
export function QaList({ items }: { items: readonly { question: string; answer: string }[] }) {
  return (
    <div className="dh-qa">
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
