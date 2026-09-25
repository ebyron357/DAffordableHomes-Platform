import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"

import { schemaTypes } from "./schemas"

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? ""
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production"
const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? "https://daffordablehomes.com"

export default defineConfig({
  name: "daffordablehomes",
  title: "D'Affordable Homes",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
  document: {
    /**
     * "Open preview" opens the article in draft mode on the site. The preview
     * secret is supplied by the environment; it is never committed.
     */
    productionUrl: async (previous, { document }) => {
      const doc = document as { _type?: string; slug?: { current?: string } }
      const secret = process.env.SANITY_STUDIO_PREVIEW_SECRET
      if (doc._type !== "article" || !doc.slug?.current || !secret) return previous

      const url = new URL("/api/preview/enable", previewOrigin)
      url.searchParams.set("secret", secret)
      url.searchParams.set("path", `/preview/${doc.slug.current}`)
      return url.toString()
    },
  },
})
