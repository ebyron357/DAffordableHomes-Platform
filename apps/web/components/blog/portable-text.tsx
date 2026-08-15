import Link from "next/link"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { PortableTextBlock } from "@/lib/blog/types"
import { cn } from "@/lib/utils"

/**
 * Portable Text rendering rules. These are presentation rules only — no
 * article copy lives here.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 text-[1.0625rem] leading-8 text-foreground/90">{children}</p>,
    h2: ({ children, value }) => (
      <h2
        id={headingId(value)}
        className="mt-12 scroll-mt-28 font-serif text-[1.75rem] leading-tight text-foreground sm:text-[2rem]"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={headingId(value)}
        className="mt-9 scroll-mt-28 font-sans text-lg font-semibold tracking-tight text-foreground sm:text-xl"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-7 font-sans text-base font-semibold tracking-tight text-foreground">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 space-y-2.5 pl-1">{children}</ul>,
    number: ({ children }) => <ol className="mt-5 space-y-3 pl-1 [counter-reset:list]">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 text-[1.0625rem] leading-8 text-foreground/90 before:absolute before:left-0 before:top-[0.9em] before:size-1.5 before:rounded-full before:bg-accent">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="relative pl-9 text-[1.0625rem] leading-8 text-foreground/90 [counter-increment:list] before:absolute before:left-0 before:top-[0.15em] before:flex before:size-6 before:items-center before:justify-center before:rounded-full before:bg-muted before:font-sans before:text-xs before:font-semibold before:text-accent before:content-[counter(list)]">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? "#"
      const isInternal = href.startsWith("/")
      const className =
        "font-medium text-primary underline decoration-accent/50 underline-offset-4 transition-colors hover:decoration-accent"

      if (isInternal) {
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        )
      }
      return (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
          {children}
        </a>
      )
    },
  },
}

function headingId(value: unknown): string | undefined {
  const block = value as PortableTextBlock | undefined
  const text = block?.children?.map((child) => child.text).join("") ?? ""
  if (!text) return undefined
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 72)
}

export function ArticleProse({
  value,
  className,
}: {
  value: PortableTextBlock[] | null | undefined
  className?: string
}) {
  if (!value?.length) return null
  return (
    <div className={cn("[&>*:first-child]:mt-0", className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}
