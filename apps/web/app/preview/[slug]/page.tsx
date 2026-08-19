import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { ArticleView } from "@/components/blog/article-view"
import { Container } from "@/components/ui/container"
import { getArticle } from "@/lib/blog/source"

/**
 * Draft-only article preview.
 *
 * The public route `/blog/[slug]` is statically generated from published slugs
 * so unknown slugs return a real HTTP 404. That also means a brand-new draft
 * has no public route yet, so the Studio previews unpublished work here
 * instead.
 *
 * This route renders nothing without an active draft-mode session, which only
 * `/api/preview/enable` can start and only after Sanity has validated the
 * caller. It is never indexed.
 */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Article preview",
  robots: { index: false, follow: false, nocache: true },
}

export default async function ArticlePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled } = await draftMode()

  if (!isEnabled) {
    // No draft session: send readers to the published article, or 404.
    redirect(`/blog/${slug}`)
  }

  const article = await getArticle(slug)
  if (!article) notFound()

  return (
    <>
      <div className="bg-warning text-warning-foreground">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm font-medium">
          <span>
            Preview mode — unpublished content, not visible to the public (status: {article.status}).
          </span>
          <a href={`/api/preview/disable?redirect=/blog`} className="underline underline-offset-4">
            Exit preview
          </a>
        </Container>
      </div>
      <ArticleView article={article} isDraft={false} />
    </>
  )
}
