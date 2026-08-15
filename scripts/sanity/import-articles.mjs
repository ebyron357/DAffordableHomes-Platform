#!/usr/bin/env node
/**
 * Reproducible Sanity import for the migrated articles.
 *
 * Reads `content/sanity/articles.ndjson` (produced by
 * `node scripts/content/build-articles.mjs`) and creates or replaces every
 * document in the configured dataset. Running it repeatedly is safe: each
 * document has a stable `_id`, so the import is idempotent.
 *
 * Required environment variables (never committed):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET      (defaults to "production")
 *   SANITY_API_WRITE_TOKEN          editor or deploy token with write access
 *
 * Usage:
 *   node scripts/sanity/import-articles.mjs            apply the import
 *   node scripts/sanity/import-articles.mjs --dry-run  validate without writing
 *
 * The equivalent Sanity CLI path is:
 *   npx sanity dataset import content/sanity/articles.ndjson <dataset> --replace
 */

import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const ndjsonPath = join(repoRoot, "content/sanity/articles.ndjson")

const dryRun = process.argv.includes("--dry-run")
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"
const token = process.env.SANITY_API_WRITE_TOKEN ?? ""
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-01"

const documents = readFileSync(ndjsonPath, "utf8")
  .split("\n")
  .filter((line) => line.trim().length > 0)
  .map((line, index) => {
    try {
      return JSON.parse(line)
    } catch (error) {
      throw new Error(`Invalid NDJSON on line ${index + 1}: ${error.message}`)
    }
  })

const counts = documents.reduce((accumulator, document) => {
  accumulator[document._type] = (accumulator[document._type] ?? 0) + 1
  return accumulator
}, {})

process.stdout.write(`Parsed ${documents.length} documents from ${ndjsonPath}\n`)
for (const [type, count] of Object.entries(counts).sort()) {
  process.stdout.write(`  ${type}: ${count}\n`)
}

if (dryRun) {
  process.stdout.write("Dry run complete. No documents were written.\n")
  process.exit(0)
}

if (!projectId || !token) {
  process.stderr.write(
    "BLOCKED: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN must both be set to import into Sanity.\n",
  )
  process.exit(2)
}

const mutations = documents.map((document) => ({ createOrReplace: document }))

const response = await fetch(
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}?returnIds=true`,
  {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  },
)

const payload = await response.json()

if (!response.ok) {
  process.stderr.write(`Sanity import failed (HTTP ${response.status}):\n${JSON.stringify(payload, null, 2)}\n`)
  process.exit(1)
}

process.stdout.write(`Imported ${payload.results?.length ?? mutations.length} documents into ${dataset}.\n`)
