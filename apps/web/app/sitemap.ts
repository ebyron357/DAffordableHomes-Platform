import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"
import { AREA_LIST } from "@/lib/areas"
import { BUYER_RESOURCE_LIST } from "@/lib/buyer-resources"
import { PROGRAM_CARDS } from "@/lib/programs"

const routes = [
  "",
  "/about",
  "/accessibility",
  "/areas",
  "/blog",
  "/blog/naca-homebuying-dallas-fort-worth",
  "/blog/homes-for-heroes-north-texas",
  "/blog/how-to-buy-home-garland-tx",
  "/book",
  "/contact",
  "/events",
  "/equal-housing-opportunity",
  "/fair-housing",
  "/faq",
  "/first-time-buyers",
  "/homes",
  "/market-reports",
  "/neighborhoods",
  "/privacy",
  "/programs",
  "/resources",
  "/resources/calculators",
  "/resources/calculators/affordability",
  "/resources/calculators/closing-costs",
  "/resources/calculators/down-payment",
  "/resources/calculators/mortgage-payment",
  "/start",
  "/terms",
  "/testimonials",
  "/texas-brokerage-information",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const dynamicRoutes = [
    ...AREA_LIST.map((area) => `/areas/${area.slug}`),
    ...PROGRAM_CARDS.map((program) => `/programs/${program.slug}`),
    ...BUYER_RESOURCE_LIST.map((resource) => `/resources/${resource.slug}`),
  ]
  return [...routes, ...dynamicRoutes].map((route) => ({
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
          : route.startsWith("/blog/")
            ? 0.7
            : 0.6,
  }))
}
