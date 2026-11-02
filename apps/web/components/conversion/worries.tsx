import { ArrowLink } from "@/components/page/arrow-link"
import { COMMON_WORRIES, type Worry } from "@/lib/content/conversion"

/**
 * The worries that stop people booking, answered in the open.
 *
 * Deliberately not an accordion: a visitor who is unsure whether their credit
 * or savings rule them out should not have to guess that the answer is behind
 * a disclosure. Each worry is a heading so a screen-reader user can move
 * between them. `headingLevel` follows the section the list sits in.
 */
export function WorriesList({
  items = COMMON_WORRIES,
  headingLevel = "h3",
}: {
  items?: readonly Worry[]
  headingLevel?: "h3" | "h4"
}) {
  const Heading = headingLevel
  return (
    <ul className="dh-worries">
      {items.map((item) => (
        <li key={item.worry}>
          <Heading>&ldquo;{item.worry}&rdquo;</Heading>
          <p>{item.answer}</p>
          {item.link && <ArrowLink href={item.link.href} label={item.link.label} />}
        </li>
      ))}
    </ul>
  )
}
