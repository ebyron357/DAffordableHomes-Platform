import type { ReactNode } from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

type Tone = "info" | "muted" | "warning" | "success"

/**
 * Honest status notice. Used to communicate provider-unavailable, success,
 * warning, and content-in-preparation states without presenting fabricated data.
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
        tone === "info"
          ? "border-primary/25 bg-primary/5"
          : tone === "warning"
            ? "border-accent/40 bg-accent/10"
            : tone === "success"
              ? "border-success/35 bg-success/10"
              : "border-border bg-muted/50",
        className,
      )}
    >
      <Info
        className={cn(
          "mt-0.5 size-5 shrink-0",
          tone === "warning" ? "text-accent" : tone === "success" ? "text-success" : "text-primary",
        )}
        aria-hidden="true"
      />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {children && <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>}
      </div>
    </div>
  )
}
