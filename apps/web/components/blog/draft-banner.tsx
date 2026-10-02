import { Container } from "@/components/ui/container"

/** Shown only in draft mode so an unpublished preview is never mistaken for live. */
export function DraftBanner({ slug }: { slug: string }) {
  return (
    <div className="border-b border-warning/40 bg-warning/10">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
        <p className="font-medium text-foreground">
          Draft preview — this version is not published.
        </p>
        <a
          href={`/api/draft-mode/disable?redirect=${encodeURIComponent(`/blog/${slug}`)}`}
          className="font-semibold text-primary underline underline-offset-[3px]"
        >
          Exit preview
        </a>
      </Container>
    </div>
  )
}
