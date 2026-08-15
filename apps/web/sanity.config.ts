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
    visionTool({ defaultApiVersion: SANITY_API_VERSION }),
  ],
  document: {
    productionUrl: async (previous, { document }) => {
      const slug = (document as { slug?: { current?: string } }).slug?.current
      if (document._type !== "article" || !slug) return previous
      return `/api/draft-mode/enable?slug=${encodeURIComponent(slug)}`
    },
  },
})
