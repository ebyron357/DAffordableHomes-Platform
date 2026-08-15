/**
 * Same-origin redirect target validation.
 *
 * Any endpoint that redirects to a caller-supplied path has to answer one
 * question: what will the *browser* do with this string in a `Location` header?
 * Validating the raw input is not enough, because browsers rewrite it first:
 *
 *  - Backslashes are normalised to forward slashes, so `/\evil.example`
 *    becomes the protocol-relative `//evil.example` and leaves the origin. A
 *    naive `startsWith("/")` check passes it.
 *  - Tabs, newlines and other control characters are stripped while re-parsing,
 *    so `/<TAB>/evil.example` can reform into `//evil.example`.
 *
 * This normalises the input the same way the browser will, then accepts only a
 * single-leading-slash absolute path.
 */
export function toSafeInternalPath(requested: string | null | undefined, fallback = "/"): string {
  if (!requested) return fallback

  const normalised = requested
    .replace(/\\/g, "/")
    // Tab, newline, CR and friends: stripped by the browser, so strip them here.
    .replace(/[\u0000-\u001f\u007f]/g, "")

  if (!normalised.startsWith("/")) return fallback
  // `//host` and `/\host` are protocol-relative: same prefix, different origin.
  if (normalised.startsWith("//")) return fallback

  return normalised
}
