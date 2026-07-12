import type { ReactNode } from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

type Tone = "info" | "muted"

/**
 * Honest status notice. Used to communicate provider-unavailable and
 * content-in-preparation states without presenting fabricated data as real.
 */
export function Notice({
  title,
  tone = "info",
  children,
  className,
}: {
  title: string
  tone?: Tone
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex gap-4 rounded-xl border p-5",
        tone === "info" ? "border-primary/25 bg-primary/5" : "border-border bg-muted/50",
        className,
      )}
    >
      <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {children && <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>}
      </div>
    </div>
  )
}
