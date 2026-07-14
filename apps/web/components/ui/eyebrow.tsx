import { cn } from "@/lib/utils"

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent",
        className,
      )}
    >
      {children}
    </span>
  )
}
