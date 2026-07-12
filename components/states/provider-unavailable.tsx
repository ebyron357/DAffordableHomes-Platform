import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlugZap } from "lucide-react"

type ProviderUnavailableProps = {
  title: string
  description: string
  /** Optional educational fallback links so the page is never a dead end. */
  fallback?: { label: string; href: string }[]
}

/**
 * Honest empty state for surfaces backed by a provider that is not connected
 * yet. We never render placeholder or fabricated data — instead we explain
 * what is coming and point people to education that is available right now.
 */
export function ProviderUnavailable({ title, description, fallback }: ProviderUnavailableProps) {
  return (
    <Card className="border-dashed">
      <div className="flex flex-col gap-4">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <PlugZap className="h-5 w-5" />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-foreground text-balance">{title}</h2>
          <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">{description}</p>
        </div>
        {fallback && fallback.length > 0 ? (
          <div className="flex flex-wrap gap-3 pt-1">
            {fallback.map((link) => (
              <Button key={link.href} href={link.href} variant="secondary" size="sm">
                {link.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
