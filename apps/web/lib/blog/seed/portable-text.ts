/**
 * Deterministic Portable Text authoring helpers for the migration seed.
 *
 * The seed is the reproducible migration payload for content that already
 * existed in production before the CMS migration. Keys must be stable so the
 * NDJSON export produces byte-identical documents on every run, which keeps
 * re-imports idempotent instead of creating duplicate blocks.
 *
 * Inline syntax supported while authoring seed copy:
 *   `**bold**`          -> strong mark
 *   `[label](/href)`    -> link markDef
 *
 * Everything else is treated as literal text, so migrated copy stays verbatim.
 */

import type {
  PortableTextBlock,
  PortableTextMarkDef,
  PortableTextSpan,
  RichText,
} from "../types"

/**
 * FNV-1a. Small, dependency-free, and stable across Node versions — good enough
 * for content keys, which only need to be unique and reproducible.
 */
function stableKey(prefix: string, input: string, index: number): string {
  let hash = 0x811c9dc5
  const source = `${prefix}:${index}:${input}`
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return `${prefix}${hash.toString(36)}`
}

type InlineParts = {
  children: PortableTextSpan[]
  markDefs: PortableTextMarkDef[]
}

const INLINE_PATTERN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g

function parseInline(text: string, keySeed: string): InlineParts {
  const children: PortableTextSpan[] = []
  const markDefs: PortableTextMarkDef[] = []
  let cursor = 0
  let spanIndex = 0

  const pushSpan = (value: string, marks: string[]) => {
    if (!value) return
    children.push({
      _type: "span",
      _key: stableKey("s", value, spanIndex++),
      text: value,
      marks,
    })
  }

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const start = match.index ?? 0
    pushSpan(text.slice(cursor, start), [])

    if (match[1] !== undefined) {
      pushSpan(match[1], ["strong"])
    } else {
      const label = match[2] ?? ""
      const href = match[3] ?? ""
      const markKey = stableKey("l", `${keySeed}${href}`, markDefs.length)
      markDefs.push({ _type: "link", _key: markKey, href })
      pushSpan(label, [markKey])
    }

    cursor = start + match[0].length
  }

  pushSpan(text.slice(cursor), [])

  if (children.length === 0) {
    pushSpan("", [])
  }

  return { children, markDefs }
}

function block(
  style: PortableTextBlock["style"],
  text: string,
  index: number,
  listItem?: PortableTextBlock["listItem"],
): PortableTextBlock {
  const { children, markDefs } = parseInline(text, `${style}${index}`)
  const result: PortableTextBlock = {
    _type: "block",
    _key: stableKey("b", `${style}${listItem ?? ""}${text}`, index),
    style,
    markDefs,
    children,
  }
  if (listItem) {
    result.listItem = listItem
    result.level = 1
  }
  return result
}

type RichTextNode =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "h4"; text: string }
  | { kind: "blockquote"; text: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "numbers"; items: string[] }

export const p = (text: string): RichTextNode => ({ kind: "p", text })
export const h2 = (text: string): RichTextNode => ({ kind: "h2", text })
export const h3 = (text: string): RichTextNode => ({ kind: "h3", text })
export const h4 = (text: string): RichTextNode => ({ kind: "h4", text })
export const blockquote = (text: string): RichTextNode => ({ kind: "blockquote", text })
export const ul = (...items: string[]): RichTextNode => ({ kind: "bullets", items })
export const ol = (...items: string[]): RichTextNode => ({ kind: "numbers", items })

/** Builds a Portable Text array from the authoring helpers above. */
export function richText(...nodes: RichTextNode[]): RichText {
  const blocks: PortableTextBlock[] = []
  let index = 0

  for (const node of nodes) {
    if (node.kind === "bullets" || node.kind === "numbers") {
      const listItem = node.kind === "bullets" ? "bullet" : "number"
      for (const item of node.items) {
        blocks.push(block("normal", item, index++, listItem))
      }
      continue
    }
    blocks.push(block(node.kind === "p" ? "normal" : node.kind, node.text, index++))
  }

  return blocks
}

/** Flattens Portable Text to plain text — used for reading time and JSON-LD. */
export function toPlainText(blocks: RichText): string {
  return blocks
    .map((entry) => entry.children.map((child) => child.text).join(""))
    .join("\n")
}
