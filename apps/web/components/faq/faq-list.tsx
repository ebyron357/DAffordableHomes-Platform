import { Plus } from "lucide-react"
import type { FaqItem } from "@/lib/content/home"

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.question}>
          <details className="group rounded-xl border border-border bg-card p-5 [&_svg]:open:rotate-45">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-foreground marker:content-['']">
              {item.question}
              <Plus className="size-5 shrink-0 text-primary transition-transform" aria-hidden="true" />
            </summary>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{item.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  )
}
