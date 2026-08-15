/**
 * Module-resolution hook for importing the TypeScript seed directly.
 *
 * Node strips TypeScript types natively, but it does not perform TypeScript's
 * extensionless resolution. The seed uses extensionless relative imports
 * (required by Next's tsconfig), so this hook appends `.ts` / `/index.ts` when
 * a specifier has no extension.
 */

import { stat } from "node:fs/promises"
import { fileURLToPath, pathToFileURL } from "node:url"

async function exists(url) {
  try {
    return (await stat(fileURLToPath(url))).isFile()
  } catch {
    return false
  }
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    const base = new URL(specifier, context.parentURL)
    for (const candidate of [`${base.href}.ts`, `${base.href}/index.ts`]) {
      if (await exists(candidate)) {
        return { url: candidate, format: "module-typescript", shortCircuit: true }
      }
    }
  }
  return nextResolve(specifier, context)
}

export { pathToFileURL }
