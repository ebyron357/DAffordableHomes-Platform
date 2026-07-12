import type { ReactNode } from "react"

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-2xl flex-col gap-5 text-pretty text-base leading-relaxed text-foreground/90 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
      {children}
    </div>
  )
}
