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
