/**
 * Migration seed — the reproducible payload for the three launch articles.
 *
 * These documents were migrated from the pre-CMS hardcoded routes on
 * `main @ 56b381f`. They exist for two reasons:
 *
 *  1. `scripts/sanity/export-seed.mjs` turns them into NDJSON that
 *     `pnpm sanity:import` pushes into the Content Lake, so nobody has to
 *     retype three long articles by hand.
 *  2. They are the fallback content source when Sanity environment variables
 *     are absent, which keeps `/blog` and the three preserved article URLs
 *     serving real content in every environment instead of 404ing on a
 *     misconfigured deploy.
 *
 * Once Sanity is configured, the Content Lake is authoritative and this seed
 * is no longer read at request time — see `lib/blog/source.ts`.
 */

import type { Article } from "../types"
import { garlandArticle } from "./articles/how-to-buy-home-garland-tx"
import { heroesArticle } from "./articles/homes-for-heroes-north-texas"
import { nacaArticle } from "./articles/naca-homebuying-dallas-fort-worth"

/** Ordered newest-first for listing pages. */
export const SEED_ARTICLES: Article[] = [
  nacaArticle,
  heroesArticle,
  garlandArticle,
]

export const SEED_ARTICLE_SLUGS = SEED_ARTICLES.map((article) => article.slug)
