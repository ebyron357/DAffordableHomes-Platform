/**
 * Replay window for the Sanity publish webhook (/api/revalidate).
 *
 * `next-sanity`'s `parseBody` verifies the HMAC signature but accepts a valid
 * signature of any age, so a captured request could be replayed indefinitely to
 * force revalidation. The signature header carries its own millisecond
 * timestamp (`t=<ms>,v1=<sig>`) and the signature covers it, so once the
 * signature is valid the timestamp is authentic and can be bounded.
 */
export const SANITY_SIGNATURE_HEADER = "sanity-webhook-signature"

/** How far a signed webhook's timestamp may be from now, either side, allowing for clock skew. */
export const SIGNATURE_MAX_AGE_MS = 5 * 60_000

export function isFreshSignature(header: string | null, now = Date.now()): boolean {
  const timestamp = Number(/^t=(\d+)[, ]/.exec(header?.trim() ?? "")?.[1])
  return Number.isFinite(timestamp) && Math.abs(now - timestamp) <= SIGNATURE_MAX_AGE_MS
}
