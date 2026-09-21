import Link from "next/link"
import { Fragment, type ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Eyebrow, type EyebrowTone } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"

export type Crumb = { label: string; href?: string }

/**
 * Masthead tone.
 *
 * The default is `navy`. A painted-area audit of the previous build found the
 * interior routes were near-white almost end to end — the trust anchor barely
 * present and teal, green and gold with no painted area at all. The masthead is
 * the one surface every interior route shares, so giving it the brand field is
 * what puts D'Affordable Homes in the first viewport of eighteen pages at once.
 *
 * `light` stays available for routes where a dark masthead would fight the
 * content that follows — long legal copy, for instance.
 */
export type PageHeaderTone = "navy" | "teal" | "light"

const TONES: Record<PageHeaderTone, {
  section: string
  eyebrow: EyebrowTone
  title: string
  summary: string
  crumb: string
  crumbCurrent: string
}> = {
  navy: {
    section: "border-b-4 border-brand-gold bg-primary",
    eyebrow: "gold",
    title: "text-white",
    summary: "text-[#dbe6ef]",
    crumb: "text-[#a9c0d3] hover:text-white",
    crumbCurrent: "text-white",
  },
  teal: {
    section: "border-b-4 border-brand-gold bg-accent",
    eyebrow: "gold",
    title: "text-white",
    summary: "text-white/85",
    crumb: "text-white/75 hover:text-white",
    crumbCurrent: "text-white",
  },
  light: {
    section: "border-b border-border bg-muted/40",
    eyebrow: "accent",
    title: "text-foreground",
    summary: "text-muted-foreground",
    crumb: "text-muted-foreground hover:text-primary",
    crumbCurrent: "text-foreground",
  },
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  description,
  crumbs,
  children,
  tone = "navy",
}: {
  eyebrow?: string
  title: string
  intro?: string
  description?: string
  crumbs?: Crumb[]
  children?: ReactNode
  tone?: PageHeaderTone
}) {
  const summary = intro ?? description
  const t = TONES[tone]

  return (
    <section className={t.section}>
      <Container className="py-12 md:py-16">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", t.crumb)}>
              {crumbs.map((crumb, i) => (
                <Fragment key={crumb.label}>
                  <li>
                    {crumb.href ? (
                      <Link href={crumb.href} className="rounded underline-offset-4 hover:underline">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className={t.crumbCurrent}>
                        {crumb.label}
                      </span>
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
        {eyebrow && <Eyebrow tone={t.eyebrow}>{eyebrow}</Eyebrow>}
        <h1 className={cn("mt-4 max-w-3xl text-balance font-serif text-4xl leading-tight sm:text-5xl", t.title)}>
          {title}
        </h1>
        {summary && (
          <p className={cn("mt-5 max-w-2xl text-pretty text-lg leading-relaxed", t.summary)}>{summary}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  )
}
