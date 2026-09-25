import Image from "next/image"
import Link from "next/link"
import { Fragment, type ComponentType, type ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { BrandMotif, type BrandMotifVariant } from "@/components/page/brand-motif"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

export type Crumb = { label: string; href?: string }

/**
 * Masthead tone.
 *
 * The default is `navy`. A painted-area audit found the interior routes were
 * near-white almost end to end — the trust anchor barely present and teal,
 * green and gold with no painted area at all. The masthead is the one surface
 * every interior route shares, so giving it the brand field is what puts
 * D'Affordable Homes in the first viewport of eighteen pages at once.
 *
 * `teal` is for routes where a second navy field would immediately follow.
 * There is no light variant: the whole point of this surface is that it paints.
 */
export type PageHeaderTone = "navy" | "teal"

export type PageHeaderMedia = {
  src: string
  alt: string
  /** Crop rule from docs/05-content/IMAGE_ASSET_REGISTER.md. */
  objectPosition?: string
  caption?: { label: string; title: string }
  priority?: boolean
}

/**
 * Icons here are decorative: the label beside them carries the meaning, so
 * both render sites pass `aria-hidden`. TypeScript does not check hyphenated
 * JSX attributes against the props type, so a narrower declaration compiles
 * either way — this one says what is actually passed.
 */
type DecorativeIcon = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>

export type PageHeaderFact = { label: string; icon?: DecorativeIcon }

/**
 * Shared interior masthead.
 *
 * Two columns, always. The previous version was type on the left of a navy
 * band and nothing on the right, which is how every interior route opened with
 * roughly half its first viewport as empty colour. The right column now takes
 * either an approved photograph or the brand's architectural linework, so the
 * page opens as residential real estate rather than as a document title.
 */
export function PageHeader({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  intro,
  description,
  crumbs,
  children,
  facts,
  media,
  motif = "roofline",
  tone = "navy",
}: {
  eyebrow?: string
  eyebrowIcon?: DecorativeIcon
  title: string
  intro?: string
  description?: string
  crumbs?: Crumb[]
  children?: ReactNode
  /** Verified positioning qualifiers. Never metrics — see lib/site.ts. */
  facts?: readonly PageHeaderFact[]
  media?: PageHeaderMedia
  motif?: BrandMotifVariant
  tone?: PageHeaderTone
}) {
  const summary = intro ?? description

  return (
    <section className={cn("dh-masthead", tone === "teal" ? "dh-masthead-teal" : "dh-masthead-navy")}>
      <Container>
        <div className="dh-masthead-inner">
          <div className="dh-masthead-copy">
            {crumbs && crumbs.length > 0 && (
              <nav aria-label="Breadcrumb">
                <ol className="dh-crumbs">
                  {crumbs.map((crumb, i) => (
                    <Fragment key={crumb.label}>
                      <li>
                        {crumb.href ? (
                          <Link href={crumb.href}>{crumb.label}</Link>
                        ) : (
                          <span aria-current="page">{crumb.label}</span>
                        )}
                      </li>
                      {i < crumbs.length - 1 && (
                        <li aria-hidden="true">
                          <ChevronRight className="size-4" />
                        </li>
                      )}
                    </Fragment>
                  ))}
                </ol>
              </nav>
            )}

            {eyebrow && (
              <p className="dh-kicker">
                {EyebrowIcon && <EyebrowIcon aria-hidden="true" />}
                {eyebrow}
              </p>
            )}

            <h1>{title}</h1>
            {summary && <p className="dh-masthead-lede">{summary}</p>}

            {facts && facts.length > 0 && (
              <ul className="dh-masthead-facts">
                {facts.map((fact) => (
                  <li key={fact.label}>
                    {fact.icon && <fact.icon aria-hidden="true" />}
                    {fact.label}
                  </li>
                ))}
              </ul>
            )}

            {children && <div className="dh-masthead-actions">{children}</div>}
          </div>

          <div className="dh-masthead-aside" aria-hidden={media ? undefined : "true"}>
            {media ? (
              <figure className="dh-masthead-figure">
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  /* The covering width, not the frame width: both mastheads are
                     filled by an image wider than the box they sit in. */
                  sizes="(max-width: 1000px) 100vw, 620px"
                  style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
                  priority={media.priority}
                />
                {media.caption && (
                  <figcaption className="dh-split-caption">
                    <span>{media.caption.label}</span>
                    <strong>{media.caption.title}</strong>
                  </figcaption>
                )}
              </figure>
            ) : (
              <BrandMotif variant={motif} className="dh-motif dh-masthead-ornament" />
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
