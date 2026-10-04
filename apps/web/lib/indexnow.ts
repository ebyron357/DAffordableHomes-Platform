/**
 * IndexNow (https://www.indexnow.org) — tells Bing, and the engines that share
 * its index (Copilot and ChatGPT search among them), that a URL changed, so it
 * is recrawled within hours instead of whenever the crawler next calls.
 *
 * The key is an ownership token, public by design: it is served at
 * /indexnow.txt so the engines can confirm the submitter controls the site. It
 * is read from `INDEXNOW_KEY` rather than committed, like the search-console
 * verification tokens in lib/seo.ts. The spec allows 8–128 characters of
 * letters, digits and dashes.
 */
export const INDEXNOW_KEY_PATH = "/indexnow.txt"

export function indexNowKey(env: Record<string, string | undefined> = process.env): string | undefined {
  const value = env.INDEXNOW_KEY?.trim()
  return value && /^[A-Za-z0-9-]{8,128}$/.test(value) ? value : undefined
}
