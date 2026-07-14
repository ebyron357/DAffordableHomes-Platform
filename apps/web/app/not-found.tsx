import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-serif text-sm font-semibold uppercase tracking-[0.18em] text-accent">Page not found</p>
        <h1 className="mt-4 text-balance font-serif text-4xl text-foreground">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          The page may have moved, or the link may be out of date. Let&apos;s get you back to a helpful next step.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/start" variant="outline">
            Find Your Next Step
          </Button>
        </div>
      </div>
    </Container>
  )
}
