/**
 * Link sanitisation for CMS-authored URLs.
 *
 * Every href in an article — Portable Text link marks, CTA targets, related
 * links, official sources, embeds — originates in the Content Lake and is
 * therefore untrusted input from the perspective of the rendered page. A
 * Studio writer, or anyone holding a write token, must not be able to emit a
 * `javascript:` URL, a `data:` URL, or a protocol-relative link that silently
 * sends readers off-origin.
 *
 * Anything that does not match an allowed shape resolves to `null`, and the
 * renderers fall back to plain text rather than emitting an anchor.
 */

/** Internal path: exactly one leading slash, and not a backslash escape. */
const INTERNAL_PATH = /^\/(?![/\\])/

const ALLOWED_PROTOCOLS = new Set(["https:", "mailto:", "tel:"])

export type SafeHref =
  | { kind: "internal"; href: string }
  | { kind: "external"; href: string }
  | null

export function safeHref(value: string | null | undefined): SafeHref {
  if (typeof value !== "string") return null

  const href = value.trim()
  if (href.length === 0) return null

  // Reject control characters, which can be used to smuggle a scheme past a
  // naive prefix check.
  if (/[\u0000-\u001f\u007f]/.test(href)) return null

  if (href.startsWith("#")) return { kind: "internal", href }

  if (INTERNAL_PATH.test(href)) return { kind: "internal", href }

  let parsed: URL
  try {
    parsed = new URL(href)
  } catch {
    return null
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return null

  return { kind: "external", href: parsed.toString() }
}

/**
 * Resolves a redirect target supplied on a request. Only same-origin paths are
 * accepted; everything else falls back to the caller's default.
 */
export function safeRedirectPath(value: string | null | undefined, fallback: string): string {
  if (typeof value !== "string") return fallback
  const target = value.trim()
  if (!INTERNAL_PATH.test(target)) return fallback
  if (/[\u0000-\u001f\u007f]/.test(target)) return fallback
  return target
}
