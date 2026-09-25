/**
 * Module-resolution hook for importing the app's TypeScript modules directly
 * from Node (the seed exporter and the unit tests both do this).
 *
 * Node strips TypeScript types natively, but it does not implement two things
 * the app's tsconfig relies on:
 *
 *  - TypeScript's extensionless resolution (`./foo` -> `./foo.ts`).
 *  - The `@/*` path alias, which maps to `apps/web/*`.
 */

import { stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../apps/web")

async function exists(url) {
  try {
    return (await stat(fileURLToPath(url))).isFile()
  } catch {
    return false
  }
}

/** Tries `<base>.ts` then `<base>/index.ts`, returning the first that exists. */
async function resolveTs(baseHref) {
  for (const candidate of [baseHref, `${baseHref}.ts`, `${baseHref}/index.ts`]) {
    if (/\.tsx?$/.test(candidate) && (await exists(candidate))) {
      return { url: candidate, format: "module-typescript", shortCircuit: true }
    }
  }
  return null
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = pathToFileURL(path.join(WEB_ROOT, specifier.slice(2))).href
    const resolved = await resolveTs(base)
    if (resolved) return resolved
  }

  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    const base = new URL(specifier, context.parentURL).href
    const resolved = await resolveTs(base)
    if (resolved) return resolved
  }

  return nextResolve(specifier, context)
}
