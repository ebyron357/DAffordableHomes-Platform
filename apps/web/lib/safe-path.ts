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

/**
 * Whether a CMS-supplied value is a safe same-origin path.
 *
 * Used by the Sanity schema validators so an editor cannot save a CTA or
 * related-link destination that leaves the origin. `startsWith("/")` is not
 * sufficient on its own: `//attacker.example` and `/\attacker.example` both
 * begin with a slash and both navigate off-site.
 */
export function isSafeInternalPath(value: string | null | undefined): boolean {
  if (!value) return false
  return toSafeInternalPath(value, "") === value
}

/** Schemes a CMS-supplied link is allowed to use. */
const SAFE_SCHEMES = ["https:", "http:", "mailto:", "tel:"]

/**
 * Runtime allowlist for a CMS-supplied href, returning `null` when the value
 * is not safe to put in an `href`.
 *
 * Schema validation runs in the Studio, so it only constrains what an editor
 * can save through the UI. Content can also arrive by direct API mutation or
 * dataset import, which bypasses it entirely — and a stored `javascript:` or
 * `data:` URL rendered into an anchor is script execution on click, from the
 * site's own origin. Renderers call this and fall back to plain text.
 */
export function toSafeHref(value: string | null | undefined): string | null {
  if (!value) return null

  const trimmed = value.trim()
  if (isSafeInternalPath(trimmed)) return trimmed

  let parsed: URL
  try {
    // A relative value that is not a safe internal path is already rejected
    // above, so anything reaching here must parse as absolute to be usable.
    parsed = new URL(trimmed)
  } catch {
    return null
  }

  return SAFE_SCHEMES.includes(parsed.protocol) ? trimmed : null
}
