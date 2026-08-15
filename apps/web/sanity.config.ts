"use client"

/**
 * Sanity Studio configuration, mounted by the app at `/studio`.
 *
 * Project and dataset come from environment variables only. When they are
 * absent the Studio route renders a configuration notice instead of loading
 * this config, so a missing variable is visible rather than a blank screen.
 */

import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { defineLocations, presentationTool } from "sanity/presentation"
import { structureTool } from "sanity/structure"

import {
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  STUDIO_BASE_PATH,
} from "./cms/env"
import { schemaTypes } from "./cms/schema"
import { structure } from "./cms/structure"

export default defineConfig({
  name: "daffordablehomes",
  title: "D'Affordable Homes",
  basePath: STUDIO_BASE_PATH,
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    /*
     * Presentation owns draft preview. It mints a single-use secret in the
     * Content Lake and hands it to `/api/draft-mode/enable`, so only an
     * authenticated Studio session can turn on draft rendering. Do not replace
     * this with a hand-built preview link: a link an editor can copy is a link
     * anyone can copy.
     */
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: {
        /*
         * Maps an article document to the URL it renders at. Without this,
         * Presentation opens at "/" and selecting a draft never reaches the
         * article — the preview link would exist but go nowhere.
         */
        locations: {
          article: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Untitled article",
                  href: doc?.slug ? `/blog/${doc.slug}` : "/blog",
                },
                { title: "Blog index", href: "/blog" },
              ],
            }),
          }),
        },
      },
    }),
    visionTool({ defaultApiVersion: SANITY_API_VERSION }),
  ],
})
