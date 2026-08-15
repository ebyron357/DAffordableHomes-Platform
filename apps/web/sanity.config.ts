"use client"

import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { defineLocations, presentationTool } from "sanity/presentation"
import { structureTool } from "sanity/structure"
import { apiVersion, dataset, projectId, studioBasePath } from "./sanity/env"
import { schemaTypes } from "./sanity/schema"

/**
 * Embedded Sanity Studio configuration.
 *
 * The project id and dataset come from environment variables only. When they
 * are absent the Studio route renders a configuration notice instead of
 * mounting the Studio (see app/studio/[[...tool]]/page.tsx).
 */
export default defineConfig({
  name: "daffordable-homes",
  title: "D'Affordable Homes",
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Articles")
              .child(
                S.list()
                  .title("Articles")
                  .items([
                    S.listItem()
                      .title("Published")
                      .child(
                        S.documentList()
                          .title("Published articles")
                          .filter('_type == "article" && status == "published"')
                          .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Drafts")
                      .child(
                        S.documentList()
                          .title("Draft articles")
                          .filter('_type == "article" && status == "draft"'),
                      ),
                    S.listItem()
                      .title("Archived")
                      .child(
                        S.documentList()
                          .title("Archived articles")
                          .filter('_type == "article" && status == "archived"'),
                      ),
                    S.divider(),
                    S.documentTypeListItem("article").title("All articles"),
                  ]),
              ),
            S.divider(),
            S.documentTypeListItem("author").title("Authors"),
            S.documentTypeListItem("category").title("Categories"),
            S.documentTypeListItem("program").title("Programs"),
            S.documentTypeListItem("area").title("Areas"),
          ]),
    }),
    /*
     * Presentation drives draft preview. It calls /api/preview/enable, which
     * delegates authorisation to Sanity before any draft-mode cookie is set,
     * and previews land on /preview/<slug> — a dynamic, noindex, draft-only
     * route, so unpublished slugs are viewable without weakening the real 404
     * that /blog/<slug> returns to the public.
     */
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || undefined,
        preview: "/blog",
        previewMode: {
          enable: "/api/preview/enable",
          disable: "/api/preview/disable",
        },
      },
      resolve: {
        locations: {
          article: defineLocations({
            select: { title: "title", slug: "slug.current", status: "status" },
            resolve: (doc) =>
              doc?.slug
                ? {
                    locations: [
                      { title: doc.title || "Preview", href: `/preview/${doc.slug}` },
                      ...(doc.status === "published"
                        ? [{ title: `${doc.title || "Article"} (published)`, href: `/blog/${doc.slug}` }]
                        : []),
                    ],
                  }
                : null,
          }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion, defaultDataset: dataset }),
  ],
})
