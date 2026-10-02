import { professionalDetails } from "@/lib/business-facts"

/**
 * Brokerage, licence, phone and office, as far as each has been verified.
 *
 * Renders nothing at all while every fact is unconfirmed, so it can sit in a
 * footer or aside today and fill in on its own once `lib/site.ts` is updated.
 * Styling is the caller's: it only adds the list semantics.
 */
export function ProfessionalDetails({ className, label }: { className?: string; label: string }) {
  const details = professionalDetails()
  if (details.length === 0) return null

  return (
    <ul className={["professional-details", className].filter(Boolean).join(" ")} aria-label={label}>
      {details.map((detail) => (
        <li key={detail.key}>
          <span className="professional-details-label">{detail.label}:</span>{" "}
          {detail.href ? <a href={detail.href}>{detail.value}</a> : detail.value}
        </li>
      ))}
    </ul>
  )
}
