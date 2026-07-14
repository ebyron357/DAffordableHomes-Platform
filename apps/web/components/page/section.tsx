import type { ReactNode } from "react"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

export function Section({
  children,
  className,
  muted = false,
}: {
  children: ReactNode
  className?: string
  muted?: boolean
}) {
  return (
    <section className={cn("py-14 md:py-20", muted && "bg-muted/40", className)}>
      <Container>{children}</Container>
    </section>
  )
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-foreground [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </div>
  )
}
