import Link from "next/link"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { safeHref } from "@/lib/blog/safe-href"
import type { ArticleFaq, ArticleRelatedLink, ArticleSource } from "@/lib/blog/types"

/**
 * Shared editorial modules. Each one is the single renderer for its concept, so
 * a module reached through a body block and the same module reached through a
 * document-level field always look and behave identically.
 */

export function ArticleFaqs({ heading, faqs, id }: { heading?: string | null; faqs: ArticleFaq[]; id?: string }) {
  if (!faqs.length) return null
  const headingId = id ?? "article-faqs"

  return (
    <section aria-labelledby={headingId} className="mt-14 border-t border-border pt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Direct answers</p>
      <h2 id={headingId} className="mt-3 font-serif text-[1.75rem] leading-tight text-foreground sm:text-[2rem]">
        {heading ?? "Frequently asked questions"}
      </h2>
      <div className="mt-7 divide-y divide-border border-y border-border">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-sm font-semibold leading-7 text-foreground marker:content-none">
              <span>{faq.question}</span>
              <span
                aria-hidden="true"
                className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-border text-accent transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-[0.9375rem] leading-7 text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function ArticleSources({
  heading,
  intro,
  sources,
  id,
}: {
  heading?: string | null
  intro?: string | null
  sources: ArticleSource[]
  id?: string
}) {
  if (!sources.length) return null
  const headingId = id ?? "article-sources"

  return (
    <section aria-labelledby={headingId} className="mt-14 rounded-xl border border-border bg-card p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Verified references</p>
      <h2 id={headingId} className="mt-3 font-serif text-2xl leading-tight text-foreground">
        {heading ?? "Official sources and review notes"}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
        {intro ??
          "Program rules and public resources can change. Confirm current requirements with the organization responsible for the decision."}
      </p>
      <ul className="mt-6 space-y-3">
        {sources.map((source) => {
          // CMS-authored href: never rendered as an anchor unless it is a safe
          // absolute or local URL.
          const target = safeHref(source.href)
          if (!target) return null
          return (
          <li key={source.href}>
            <a
              href={target.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-2.5 rounded-sm text-[0.9375rem] font-medium text-primary underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              <ExternalLink className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {source.label}
                {source.publisher ? (
                  <span className="ml-2 font-normal text-muted-foreground no-underline">— {source.publisher}</span>
                ) : null}
              </span>
            </a>
          </li>
          )
        })}
      </ul>
    </section>
  )
}

export function ArticleRelatedLinks({
  heading,
  links,
  id,
}: {
  heading?: string | null
  links: ArticleRelatedLink[]
  id?: string
}) {
  if (!links.length) return null
  const headingId = id ?? "article-related"

  return (
    <section aria-labelledby={headingId}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{heading ?? "Continue your plan"}</p>
      <h2 id={headingId} className="sr-only">
        {heading ?? "Continue your plan"}
      </h2>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {links.map((link) => {
          const target = safeHref(link.href)
          if (!target) return null
          return (
          <li key={`${link.href}-${link.label}`}>
            <Link href={target.href} className="group flex items-start gap-3 py-4 transition-colors">
              <span className="min-w-0">
                <span className="block font-semibold leading-6 text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">{link.description}</span>
              </span>
              <ArrowUpRight
                className="mt-1 size-4 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
          )
        })}
      </ul>
    </section>
  )
}
