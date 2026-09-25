/**
 * Link hardening for CMS-supplied URLs.
 *
 * Schema validation constrains most href fields, but a document can reach the
 * renderer from an import, a migration, or a compromised editing path. Every
 * href that originates in content is normalised here so a `javascript:` or
 * `data:` value can never become a navigation target.
 */

/** Site-relative paths only. Anything else collapses to the safe default. */
export function safeInternalPath(value: string | undefined, fallback = "/"): string {
  const path = (value ?? "").trim()

  // The WHATWG URL parser removes every tab, newline, and carriage return before
  // it parses, so a value has to be rejected for containing them rather than
  // checked around them: "/\t//host" clears the protocol-relative guard below,
  // then resolves to "//host" in the browser and navigates off-origin. No
  // control character belongs in a site path, so all of them are refused here
  // rather than stripped, which keeps what is validated identical to what is
  // returned.
  if (/[\u0000-\u001F\u007F]/.test(path)) return fallback

  // Reject protocol-relative URLs and any scheme, including obfuscated ones.
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return fallback
  if (/^\/[^/]*:/.test(path)) return fallback
  return path
}

/** External links must be https. Anything else is dropped by the caller. */
export function safeExternalUrl(value: string | undefined): string | null {
  const raw = (value ?? "").trim()
  try {
    const url = new URL(raw)
    return url.protocol === "https:" ? url.toString() : null
  } catch {
    return null
  }
}

/**
 * Image sources must resolve somewhere `next/image` is configured to load from:
 * the Sanity CDN for uploaded assets, or a same-origin path for an approved
 * repository asset. Any other host throws at render time and would take the
 * whole article down, so an unusable source is dropped and the caller renders
 * without the image instead.
 */
export function safeImageSrc(value: string | undefined): string | null {
  const raw = (value ?? "").trim()
  if (!raw) return null

  if (raw.startsWith("/")) {
    const path = safeInternalPath(raw, "")
    return path === "" ? null : path
  }

  const url = safeExternalUrl(raw)
  if (!url) return null
  return new URL(url).hostname === "cdn.sanity.io" ? url : null
}
