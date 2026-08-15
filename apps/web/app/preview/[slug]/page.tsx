import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { draftMode } from "next/headers"

import { ArticleView } from "@/components/blog/article-view"
import { Container } from "@/components/ui/container"
import { getArticle } from "@/lib/cms/articles"

/**
 * Draft preview route.
 *
 * `/blog/[slug]` closes its param set so unknown public URLs return a real 404,
 * which also means a brand-new draft has no public route yet. This route gives
 * editors a working preview for exactly those articles without opening unknown
 * slugs to the public: it renders only when draft mode is on, is never cached,
 * and is excluded from indexing and the sitemap.
 */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false, nocache: true },
}

export default async function ArticlePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()

  // Not an error state — a visitor without draft mode simply belongs on the
  // public site. `notFound()` would render 404 content under a 200 status in
  // this Next version, so redirect instead of claiming a status we don't send.
  if (!isDraft) redirect("/blog")

  const article = await getArticle(slug, { draft: true })
  if (!article) {
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Draft preview</p>
          <h1 className="mt-4 text-balance text-4xl leading-tight">No document found for “{slug}”</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Check the slug in the Studio, or confirm the document has been saved at least once.
          </p>
          <p className="mt-8">
            <Link href="/api/preview/disable" className="font-semibold text-accent underline underline-offset-4">
              Exit preview
            </Link>
          </p>
        </div>
      </Container>
    )
  }

  return <ArticleView article={article} isDraft />
}
