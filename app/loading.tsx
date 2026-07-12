import { Container } from "@/components/ui/container"

export default function Loading() {
  return (
    <Container className="py-24">
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 text-center">
        <span className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden="true" />
        <p className="text-muted-foreground">Loading&hellip;</p>
      </div>
    </Container>
  )
}
