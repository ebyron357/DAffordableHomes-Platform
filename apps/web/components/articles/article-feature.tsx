import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SITE } from "@/lib/site"

export type ArticleFaq = {
  question: string
  answer: string
}

export type ArticleSource = {
  label: string
  href: string
}

export type ArticleRelatedLink = {
  label: string
  href: string
  description: string
}

function JsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, "\\u003c") }}
    />
  )
}

export function ArticleFeature({
  slug,
  eyebrow,
  title,
  description,
  readingTime,
  reviewedAt,
  faqs,
  sources,
  relatedLinks,
  notice,
  children,
}: {
  slug: string
  eyebrow: string
  title: string
  description: string
  readingTime: string
  reviewedAt: string
  faqs: ArticleFaq[]
  sources: ArticleSource[]
  relatedLinks: ArticleRelatedLink[]
  notice: ReactNode
  children: ReactNode
}) {
  const url = `${SITE.url}/blog/${slug}`
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: reviewedAt,
    dateModified: reviewedAt,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: SITE.realtorName,
      url: `${SITE.url}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    about: ["Homebuying", "Dallas–Fort Worth", "Garland, Texas"],
  }
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blogs", item: `${SITE.url}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  }

  return (
    <>
      <JsonLd value={articleSchema} />
      <JsonLd value={faqSchema} />
      <JsonLd value={breadcrumbSchema} />

      <article>
        <header className="border-b border-border bg-card">
          <Container className="py-12 md:py-20">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary hover:underline">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/blog" className="hover:text-primary hover:underline">Blogs</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{title}</span>
            </nav>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{eyebrow}</p>
                <h1 className="mt-4 max-w-5xl font-serif text-[42px] font-normal leading-[1.08] sm:text-[58px]">{title}</h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span>By {SITE.realtorName}</span>
                  <span>{readingTime}</span>
                  <time dateTime={reviewedAt}>Reviewed {new Date(`${reviewedAt}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                </div>
              </div>
              <aside className="border-l-4 border-accent bg-muted p-6" aria-label="Editorial standard">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">D&apos;Affordable Homes editorial standard</p>
                <p className="mt-3 leading-7 text-muted-foreground">Answer-first, locally relevant guidance with clear program boundaries, visible sources, and practical next steps.</p>
              </aside>
            </div>
          </Container>
        </header>

        <Container className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:py-16">
          <div className="space-y-10 text-[17px] leading-8 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:leading-tight [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-6 [&_p]:text-foreground/90 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            {children}

            <section aria-labelledby="article-faq-heading" className="border-t border-border pt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Direct answers</p>
              <h2 id="article-faq-heading" className="mt-3">Frequently asked questions</h2>
              <div className="mt-6 border-t border-border">
                {faqs.map((faq) => (
                  <details key={faq.question} className="border-b border-border py-5">
                    <summary className="cursor-pointer list-none pr-8 font-semibold marker:content-none">{faq.question}</summary>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section aria-labelledby="article-sources-heading" className="border-t border-border pt-10">
              <h2 id="article-sources-heading">Official sources and review notes</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">Program rules and public resources can change. Confirm current requirements with the organization responsible for the decision.</p>
              <ul className="mt-5 space-y-3 text-sm">
                {sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline underline-offset-4">{source.label}</a>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="border-l-4 border-accent bg-muted p-6 text-sm leading-7 text-muted-foreground" aria-label="Important notice">
              {notice}
            </aside>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Related resources">
            <div className="border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Continue your plan</p>
              <div className="mt-4 divide-y divide-border">
                {relatedLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block py-4 first:pt-0 last:pb-0">
                    <span className="font-semibold text-foreground hover:text-primary">{link.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">{link.description}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Button href="/consultation" className="w-full">Book consultation</Button>
          </aside>
        </Container>
      </article>
    </>
  )
}
