import type { MetadataRoute } from "next"
import { getPublishedArticleSlugs } from "@/lib/blog/source"
import { SITE } from "@/lib/site"

/** Static routes. Article routes are generated from published CMS content. */
const routes = [
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
  const lastModified = new Date()
  const articles = await getPublishedArticleSlugs()

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified,
    changeFrequency:
      route.startsWith("/blog") || route.startsWith("/programs") || route.startsWith("/areas")
        ? "monthly"
        : "yearly",
    priority:
      route === ""
        ? 1
        : route === "/blog" || route === "/programs" || route === "/areas/garland"
          ? 0.8
          : 0.6,
  }))

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE.url}/blog/${article.slug}`,
    lastModified: new Date(`${article.reviewedAt}T12:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticEntries, ...articleEntries]
}
