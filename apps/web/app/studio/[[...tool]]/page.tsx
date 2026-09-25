import type { Metadata, Viewport } from "next"

import { StudioMount } from "@/components/studio/studio-mount"
import { Container } from "@/components/ui/container"
import { describeSanityConfig, isSanityConfigured } from "@/cms/env"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
}

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <Container className="py-20">
        <h1 className="font-serif text-4xl">Studio is not configured</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{describeSanityConfig()}</p>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          Set <code className="font-mono text-sm">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code className="font-mono text-sm">NEXT_PUBLIC_SANITY_DATASET</code> in the deployment
          environment, then redeploy. See{" "}
          <code className="font-mono text-sm">docs/13-cms/SANITY_SETUP.md</code>.
        </p>
      </Container>
    )
  }

  return <StudioMount />
}
