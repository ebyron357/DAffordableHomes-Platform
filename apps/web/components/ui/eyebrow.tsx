import { cn } from "@/lib/utils"

/**
 * Small uppercase kicker above a heading.
 *
 * Colour is chosen with `tone`, not by passing a text-colour class. `cn` is a
 * plain joiner rather than tailwind-merge, so a colour passed through
 * `className` does not override the base one — both classes are emitted and
 * whichever happens to come later in the generated stylesheet wins. That is
 * how a gold eyebrow on a navy masthead silently rendered in dark teal.
 */
export type EyebrowTone = "accent" | "gold" | "white"

const TONES: Record<EyebrowTone, string> = {
  accent: "text-accent",
  /* Lightened gold: 4.5:1 on deep navy, where the brand value is not. */
  gold: "text-[#e6bd55]",
  white: "text-white",
}

export function Eyebrow({
  children,
  className,
  tone = "accent",
}: {
  children: React.ReactNode
  className?: string
  tone?: EyebrowTone
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
