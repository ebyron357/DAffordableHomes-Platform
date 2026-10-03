import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * A text link with a trailing arrow that wraps like ordinary text.
 *
 * `.dh-textlink` on its own is inline-flex, so a label long enough to wrap
 * becomes one full-width flex item and the arrow is pushed to the far edge.
 * Here the link stays inline and the last word is kept with the arrow, so
 * the two never separate on a narrow screen.
 */
export function ArrowLink({ href, label }: { href: string; label: string }) {
  const split = label.lastIndexOf(" ")
  const head = split === -1 ? "" : label.slice(0, split + 1)
  const tail = split === -1 ? label : label.slice(split + 1)
  return (
    <Link href={href} className="dh-textlink dh-arrow-link">
      {head}
      <span className="whitespace-nowrap">
        {tail}
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  )
}
