import Link from "next/link"
import { PortableText, type PortableTextComponents } from "@portabletext/react"

import { safeExternalUrl, safeInternalPath } from "@/lib/cms/links"
import type { PortableTextBlock } from "@/lib/cms/types"

type HeadingValue = { children?: { text?: string }[] }

function headingId(value: unknown): string | undefined {
  const children = (value as HeadingValue | undefined)?.children ?? []
  const text = children.map((child) => child?.text ?? "").join(" ")
  if (!text) return undefined
  const id = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60)
  return id || undefined
}

/**
 * Rich-text renderer for editorial prose. Heading levels start at h2 because the
 * article title owns the single h1 on the page.
 */
export const proseComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 first:mt-0">{children}</p>,
    h2: ({ children, value }) => (
      <h2 id={headingId(value)} className="mt-14 scroll-mt-28 text-[1.75rem] leading-[1.2] sm:text-[2rem]">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={headingId(value)} className="mt-10 scroll-mt-28 font-sans text-lg font-semibold tracking-tight sm:text-xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => <h4 className="mt-8 font-sans text-base font-semibold">{children}</h4>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 space-y-2.5 pl-1">{children}</ul>,
    number: ({ children }) => <ol className="mt-5 space-y-3.5 pl-1 [counter-reset:item]">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-accent">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="relative pl-9 [counter-increment:item] before:absolute before:left-0 before:top-0 before:font-sans before:text-sm before:font-semibold before:tabular-nums before:text-accent before:content-[counter(item)'.']">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={safeExternalUrl(value?.href as string | undefined) ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link
        href={safeInternalPath(value?.path as string | undefined)}
        className="font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {children}
      </Link>
    ),
  },
}

/** Compact rich text used inside callouts, notices, and quick answers. */
const compactComponents: PortableTextComponents = {
  ...proseComponents,
  block: {
    normal: ({ children }) => <p className="mt-3 first:mt-0">{children}</p>,
    h2: ({ children }) => <p className="mt-4 font-serif text-xl leading-snug first:mt-0">{children}</p>,
    h3: ({ children }) => <p className="mt-4 font-sans font-semibold first:mt-0">{children}</p>,
    h4: ({ children }) => <p className="mt-3 font-sans font-semibold first:mt-0">{children}</p>,
  },
}

export function RichText({ value, compact = false }: { value: PortableTextBlock[]; compact?: boolean }) {
  if (!value?.length) return null
  return <PortableText value={value} components={compact ? compactComponents : proseComponents} />
}

export { headingId }
