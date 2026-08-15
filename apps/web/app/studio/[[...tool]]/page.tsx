import type { Metadata, Viewport } from "next"
import { NextStudio } from "next-sanity/studio"
import config from "@/sanity.config"
import { dataset, isSanityConfigured, studioBasePath } from "@/sanity/env"

/**
 * Embedded Sanity Studio.
 *
 * The Studio is never indexed, and it renders a configuration notice instead of
 * mounting when this environment has no Sanity project id.
 */
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Content Studio",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
}

export default function StudioPage() {
  if (!isSanityConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="font-serif text-3xl">Content Studio is not configured</h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          This environment has no Sanity project id, so the Studio cannot be mounted. Set the environment variables
          below and redeploy to enable editing at <code>{studioBasePath}</code>.
        </p>
        <ul className="mt-6 space-y-2 text-sm leading-7 text-muted-foreground">
          <li>
            <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> — required
          </li>
          <li>
            <code>NEXT_PUBLIC_SANITY_DATASET</code> — optional, currently <code>{dataset}</code>
          </li>
          <li>
            <code>SANITY_API_READ_TOKEN</code> — required for draft preview
          </li>
          <li>
            <code>SANITY_REVALIDATE_SECRET</code> — required for publish revalidation
          </li>
        </ul>
        <p className="mt-6 leading-7 text-muted-foreground">
          Published articles continue to be served from the committed canonical dataset while the Studio is
          unconfigured.
        </p>
      </div>
    )
  }

  return <NextStudio config={config} />
}
