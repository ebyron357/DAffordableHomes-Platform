import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  )
}
