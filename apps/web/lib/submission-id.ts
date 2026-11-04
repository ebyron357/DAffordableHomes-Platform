/**
 * A per-form submission ID, created once when the form loads.
 *
 * Every attempt from the same form sends the same value, so a visitor who
 * retries after a slow "unavailable" reply does not look like a new lead to the
 * CRM (see `submissionId` in lib/lead-delivery.ts). Where the browser cannot
 * make one (no secure context), nothing is sent and the server makes its own.
 */
export function newSubmissionId(): string | undefined {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : undefined
}
