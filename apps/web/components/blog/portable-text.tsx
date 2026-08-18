import { PortableText, type PortableTextComponents } from "next-sanity"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { toSafeHref } from "@/lib/safe-path"
import type { RichText } from "@/lib/blog/types"

/**
 * Portable Text rendering rules.
 *
 * Typography lives here, article copy never does. Headings, lists and links
 * are rendered from the editor's structure so heading hierarchy stays intact
 * for assistive technology and for search.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 first:mt-0">{children}</p>,
    h2: ({ children, value }) => (
      <h2
        id={headingId(value)}
        className="mt-14 scroll-mt-28 font-serif text-[30px] leading-[1.15] first:mt-0 sm:text-[36px]"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={headingId(value)}
        className="mt-10 scroll-mt-28 font-sans text-xl font-semibold tracking-tight text-foreground sm:text-[22px]"
      >
        {children}
      </h3>
    ),
    h4: ({ children, value }) => (
      <h4 id={headingId(value)} className="mt-8 scroll-mt-28 font-sans text-lg font-semibold">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-2 border-accent pl-6 font-serif text-xl leading-[1.6] text-foreground/90">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 space-y-2.5 pl-1 [&>li]:relative [&>li]:pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-accent">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="leading-[1.75] before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
        {children}
      </li>
    ),
    number: ({ children }) => <li className="leading-[1.75] pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      // Runtime allowlist, not just Studio validation: content can arrive by
      // direct API mutation, and a stored `javascript:` href rendered into an
      // anchor is script execution on click. Unsafe values render as plain
      // text rather than a link that goes somewhere unexpected.
      const href = toSafeHref(String(value?.href ?? ""))
      if (!href) return <>{children}</>

      const linkClass =
        "font-medium text-primary underline decoration-accent/50 underline-offset-[3px] transition-colors hover:decoration-accent focus-visible:decoration-accent"

      if (href.startsWith("/")) {
        return (
          <Link href={href} className={linkClass}>
            {children}
          </Link>
        )
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {children}
        </a>
      )
    },
  },
}

function headingId(value: unknown): string | undefined {
  const block = value as { children?: Array<{ text?: string }> } | undefined
  const text = block?.children?.map((child) => child.text ?? "").join("")
  if (!text) return undefined
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
}

/** Renders Portable Text with the site's editorial typography. */
export function Prose({ value, className }: { value: RichText; className?: string }) {
  return (
    <div className={cn("text-[17px] leading-[1.75] text-foreground/90 sm:text-[18px]", className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}
