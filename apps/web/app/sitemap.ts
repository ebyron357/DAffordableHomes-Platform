import type { MetadataRoute } from "next"

import { listArticles } from "@/lib/blog/source"
import { SITE } from "@/lib/site"

/**
 * Sitemap.
 *
 * Static routes are enumerated here; article entries come from the CMS, so a
 * newly published article is listed without a code change.
 */

export const revalidate = 3600

const staticRoutes = [
  "",
  "/about",
  "/accessibility",
  "/areas",
  "/areas/garland",
  "/blog",
  "/calculators",
  "/calculators/affordability",
  "/calculators/closing-costs",
  "/calculators/down-payment",
  "/calculators/mortgage-payment",
  "/calculators/rent-vs-buy",
  "/consultation",
  "/contact",
  "/equal-housing-opportunity",
  "/events",
  "/fair-housing",
  "/faq",
  "/first-time-buyers",
  "/homes",
  "/market-reports",
  "/neighborhoods",
  "/privacy",
  "/programs",
  "/programs/naca",
  "/programs/homes-for-heroes",
  "/resources",
  "/start",
  "/terms",
  "/testimonials",
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listArticles()

  const staticEntries = staticRoutes.map((route) => ({
    url: `${SITE.url}${route}`,
    changeFrequency:
      route.startsWith("/blog") || route.startsWith("/programs") || route.startsWith("/areas")
        ? ("monthly" as const)
        : ("yearly" as const),
    priority:
      route === ""
        ? 1
        : route === "/blog" || route === "/programs" || route === "/areas/garland"
          ? 0.8
          : 0.6,
  }))

  const articleEntries = articles.map((article) => ({
    url: `${SITE.url}/blog/${article.slug}`,
    lastModified: article.reviewedAt ?? article.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...articleEntries]
}
