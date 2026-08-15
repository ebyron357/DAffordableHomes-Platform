import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { getArticleSummaries } from "@/lib/cms/articles"

/**
 * Surfaces the newest CMS-published field guides on the homepage so editorial
 * work is visible from the front door. Renders nothing when nothing is
 * published, rather than showing an empty shell.
 */
export async function LatestGuides() {
  const articles = (await getArticleSummaries()).slice(0, 3)
  if (articles.length === 0) return null

  return (
    <section className="border-t border-border py-14 md:py-20" aria-labelledby="latest-guides-heading">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Field guides</p>
            <h2 id="latest-guides-heading" className="mt-3 text-[1.875rem] leading-tight sm:text-[2.5rem]">
              Answers before decisions
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              Long-form North Texas guidance with named authorship, review dates, and sources you can check.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            All field guides
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className={`mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 ${articles.length >= 3 ? "lg:grid-cols-3" : ""}`}>
          {articles.map((article) => (
            <li key={article._id}>
              <Link href={`/blog/${article.slug}`} className="group flex h-full flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={article.featuredImage.src}
                    alt={article.featuredImage.alt}
                    fill
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    style={
                      article.featuredImage.focalPoint ? { objectPosition: article.featuredImage.focalPoint } : undefined
                    }
                  />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {article.eyebrow ?? article.category.title}
                </p>
                <h3 className="mt-2.5 text-balance text-[1.375rem] leading-snug group-hover:text-accent">
                  {article.title}
                </h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-7 text-muted-foreground">{article.excerpt}</p>
                <p className="mt-5 text-sm text-muted-foreground">{article.readingTimeMinutes} minute read</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
