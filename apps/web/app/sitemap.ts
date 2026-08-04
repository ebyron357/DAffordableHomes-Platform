import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"

const routes = [
  "",
  "/about",
  "/accessibility",
  "/areas",
  "/areas/garland",
  "/blog",
  "/book",
  "/contact",
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
  "/resources/calculators",
  "/resources/calculators/affordability",
  "/resources/calculators/closing-costs",
  "/resources/calculators/down-payment",
  "/resources/calculators/mortgage-payment",
  "/start",
  "/terms",
  "/testimonials",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified,
    changeFrequency: route.startsWith("/programs") || route.startsWith("/areas") ? "monthly" : "quarterly",
    priority: route === "" ? 1 : route === "/programs" || route === "/areas/garland" ? 0.8 : 0.6,
  }))
}
