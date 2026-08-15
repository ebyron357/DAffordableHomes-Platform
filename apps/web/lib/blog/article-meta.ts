import { imageUrl } from "@/sanity/lib/image"
import { safeHref } from "./safe-href"
import type { Article, ArticleImage } from "./types"
import { SITE } from "@/lib/site"

/** Absolute canonical URL for a published article. */
export function articleUrl(slug: string): string {
  return `${SITE.url}/blog/${slug}`
}

/**
 * Resolves an article image to a URL from either source: an uploaded Content
 * Lake asset or an approved repository asset path.
 */
export function resolveImageSrc(image: ArticleImage | null | undefined): string | null {
  if (!image) return null
  return image.url ?? imageUrl(image.asset) ?? image.src ?? null
}

/**
 * The author's on-site profile path.
 *
 * `profileUrl` is a free-form CMS string, so it is sanitised and constrained to
 * a same-origin path before it reaches a link or the JSON-LD graph. Anything
 * else falls back to the canonical /about page.
 */
export function authorProfilePath(article: Article): string {
  const target = safeHref(article.author.profileUrl)
  return target?.kind === "internal" && target.href.startsWith("/") ? target.href : "/about"
}

/** Absolute URL for the social card, if the article has usable artwork. */
export function socialImageUrl(article: Article): string | undefined {
  const src = resolveImageSrc(article.socialImage) ?? resolveImageSrc(article.featuredImage)
  if (!src) return undefined
  return src.startsWith("http") ? src : `${SITE.url}${src}`
}

/** Long-form date rendering, pinned to UTC so server and client agree. */
export function formatArticleDate(value: string): string {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}
