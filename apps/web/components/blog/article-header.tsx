import Link from "next/link"

import { BlogImage } from "@/components/blog/blog-image"
import { Container } from "@/components/ui/container"
import type { Article } from "@/lib/blog/types"
import { formatArticleDate } from "@/lib/blog/format"

/**
 * Article masthead: breadcrumb, eyebrow, headline, standfirst, byline, and the
 * article's own hero image. Each article gets a distinct hero crop, which is
 * what makes the three guides feel individual without leaving the design system.
 */
export function ArticleHeader({ article }: { article: Article }) {
  const authorLabel = article.author.role
    ? `${article.author.name}, ${article.author.role}`
    : article.author.name

  return (
    <header className="border-b-4 border-brand-gold bg-primary">
      <Container className="pt-8 pb-12 md:pt-10 md:pb-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#a9c0d3]">
            <li>
              <Link href="/" className="inline-block py-1 underline-offset-4 hover:text-white hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="inline-block py-1 underline-offset-4 hover:text-white hover:underline">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="max-w-full truncate font-medium text-white" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e6bd55]">
              {article.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[18ch] font-serif text-[40px] leading-[1.06] text-white sm:text-[54px] lg:text-[60px]">
              {article.title}
            </h1>
            <p className="mt-6 max-w-[52ch] text-[18px] leading-[1.65] text-[#dbe6ef] sm:text-[19px]">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/25 pt-6 text-sm text-[#a9c0d3]">
              <span className="font-medium text-white">By {authorLabel}</span>
              <span aria-hidden="true" className="hidden h-4 w-px bg-white/30 sm:block" />
              <time dateTime={article.publishedAt}>
                Published {formatArticleDate(article.publishedAt)}
              </time>
              {/* Shown whenever the editor has set one, including when it
                  matches the publish date. A reviewed date is what tells a
                  reader the page is maintained; hiding it on the articles
                  where it equals publication made the newest guides look the
                  least cared for, and it disagreed with the blog index. */}
              {article.reviewedAt && (
                <time dateTime={article.reviewedAt}>
                  Reviewed {formatArticleDate(article.reviewedAt)}
                </time>
              )}
              <span>{article.readingTime}</span>
            </div>
          </div>

          <figure className="relative aspect-[4/5] overflow-hidden rounded-xl border-4 border-white/10 bg-primary sm:aspect-[3/2] lg:aspect-[4/5]">
            <BlogImage
              image={article.featuredImage}
              sizes="(min-width: 1024px) 38rem, (min-width: 640px) 90vw, 100vw"
              priority
            />
          </figure>
        </div>
      </Container>
    </header>
  )
}
