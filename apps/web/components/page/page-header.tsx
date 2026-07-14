import Link from "next/link"
import { Fragment, type ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"

export type Crumb = { label: string; href?: string }

export function PageHeader({
  eyebrow,
  title,
  intro,
  description,
  crumbs,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string
  description?: string
  crumbs?: Crumb[]
  children?: ReactNode
}) {
  const summary = intro ?? description

  return (
    <section className="border-b border-border bg-muted/40">
      <Container className="py-12 md:py-16">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              {crumbs.map((crumb, i) => (
                <Fragment key={crumb.label}>
                  <li>
                    {crumb.href ? (
                      <Link href={crumb.href} className="rounded hover:text-primary">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-foreground">
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
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {summary && <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{summary}</p>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  )
}
