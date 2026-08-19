import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { draftMode } from "next/headers"
import { ArticleView } from "@/components/blog/article-view"
import { getArticle, getPublishedArticleSlugs } from "@/lib/blog/source"
import { authorProfilePath, socialImageUrl } from "@/lib/blog/article-meta"
import { SITE } from "@/lib/site"

/**
 * Only published article slugs resolve. Next's router answers every other
 * /blog/<slug> request with a real HTTP 404 before rendering begins, which is
 * the only way to guarantee a genuine 404 status for this segment — calling
 * notFound() during a streaming render leaves the already-flushed 200.
 *
 * Unpublished work is previewed at /preview/<slug>, which is dynamic and
 * draft-only. Newly published CMS articles become routable on the next
 * deployment; the publish webhook triggers one when VERCEL_DEPLOY_HOOK_URL is
 * configured.
 */
export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getPublishedArticleSlugs()
  return slugs.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: "Article not found", robots: { index: false, follow: false } }

  const image = socialImageUrl(article)
  const socialAlt = (article.socialImage ?? article.featuredImage)?.alt ?? article.title

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription,
    alternates: { canonical: `/blog/${article.slug}` },
    authors: [{ name: article.author.name, url: `${SITE.url}${authorProfilePath(article)}` }],
    openGraph: {
      type: "article",
      title: article.seoTitle ?? article.title,
      description: article.seoDescription,
      url: `/blog/${article.slug}`,
      siteName: SITE.name,
      publishedTime: article.publishedAt,
      modifiedTime: article.reviewedAt ?? article.publishedAt,
      authors: [article.author.name],
      section: article.category?.title,
      images: image ? [{ url: image, alt: socialAlt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle ?? article.title,
      description: article.seoDescription,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const { isEnabled: isDraft } = await draftMode()

  return <ArticleView article={article} isDraft={isDraft} />
}
