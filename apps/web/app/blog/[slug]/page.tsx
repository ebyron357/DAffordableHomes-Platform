import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { draftMode } from "next/headers"

import { ArticleView } from "@/components/blog/article-view"
import { getArticle, getArticleSlugRecords } from "@/lib/cms/articles"
import { absoluteUrl, articleCanonical } from "@/lib/cms/structured-data"
import { SITE } from "@/lib/site"

export const revalidate = 300

/**
 * Only slugs returned by `generateStaticParams` are routable, so an unknown
 * article URL is rejected by the router and returns a real 404.
 *
 * With `dynamicParams: true`, Next serves the on-demand ISR render of this
 * segment with HTTP 200 even when the page calls `notFound()`, which would make
 * every mistyped article URL look like a live page to a crawler. Closing the
 * segment is the behaviour that is actually correct for SEO.
 *
 * Publishing a new article therefore still requires no code change: the Sanity
 * publish webhook (`/api/revalidate`) purges the article cache and, when
 * `VERCEL_DEPLOY_HOOK_URL` is configured, triggers the rebuild that re-runs
 * `generateStaticParams` against the Content Lake.
 */
export const dynamicParams = false

export async function generateStaticParams() {
  const records = await getArticleSlugRecords()
  return records.map((record) => ({ slug: record.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  // Draft mode must describe the draft, not the published document it replaces.
  const { isEnabled: isDraft } = await draftMode()
  const article = await getArticle(slug, { draft: isDraft })
  if (!article) return { title: "Article not found", robots: { index: false, follow: false } }

  if (isDraft) {
    return {
      title: `Draft preview — ${article.title}`,
      description: article.seoDescription,
      robots: { index: false, follow: false, nocache: true },
    }
  }

  const canonical = articleCanonical(article)
  const socialImage = absoluteUrl(article.socialImage?.src ?? article.featuredImage.src)

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.seoTitle || article.title,
      description: article.seoDescription,
      url: canonical,
      siteName: SITE.name,
      publishedTime: article.publishedAt,
      modifiedTime: article.reviewedAt,
      authors: [article.author.displayName || SITE.realtorName],
      ...(socialImage
        ? { images: [{ url: socialImage, alt: article.socialImage?.alt ?? article.featuredImage.alt }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.seoDescription,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()
  const article = await getArticle(slug, { draft: isDraft })

  if (!article) notFound()

  return <ArticleView article={article} isDraft={isDraft} />
}
