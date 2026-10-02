/**
 * Validation shared by the public lead endpoints.
 *
 * Both `/api/leads/next-step` and `/api/leads/program` accept an email address
 * from an anonymous caller and forward it to the CRM. They had independent
 * copies of this logic, and only one of them had any: the program endpoint
 * checked that the address was non-empty and forwarded whatever arrived. A
 * single definition is what keeps the two from drifting apart again.
 */

/**
 * A deliberately permissive shape check: one @, something either side, a dot in
 * the domain, no whitespace. It rejects the values the client-side
 * `type="email"` was the only thing catching ("x", "@") without pretending to
 * decide whether a well-formed address is deliverable.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value)
}
