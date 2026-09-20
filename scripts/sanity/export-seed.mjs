/**
 * Turns the migration seed into Sanity-importable NDJSON.
 *
 * The seed in `apps/web/lib/blog/seed` is the reproducible payload for the
 * three articles that existed before the CMS migration. This script converts it
 * into Content Lake documents so nobody has to retype them into the Studio.
 *
 *   node scripts/sanity/export-seed.mjs --out qa-evidence/sanity-seed.ndjson
 *
 * Images referenced by the seed are approved repository assets under
 * `apps/web/public`. They are emitted as `_sanityAsset` file references, which
 * `sanity dataset import` uploads automatically when given `--asset-base`.
 *
 * Output is deterministic: the same seed always produces identical NDJSON, so a
 * re-import updates documents in place instead of duplicating them.
 */

import { mkdir, writeFile } from "node:fs/promises"
import { register } from "node:module"
import path from "node:path"
import process from "node:process"
import { pathToFileURL } from "node:url"

const args = process.argv.slice(2)
const argOf = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}

const OUT = path.resolve(argOf("out", "qa-evidence/sanity-seed.ndjson"))
const PUBLIC_DIR = path.resolve("apps/web/public")

/* ------------------------------------------------------------------ */

const AUTHOR_ID = "author.debra-allen"

/**
 * Repository asset -> Sanity import directive.
 *
 * The `file://` path is written relative to the NDJSON file, which is how
 * `sanity dataset import` resolves it. Relative paths keep the generated file
 * portable across machines and safe to commit as evidence.
 */
function toSanityImage(image) {
  if (!image) return undefined
  const absolute = path.join(PUBLIC_DIR, image.src.replace(/^\//, ""))
  const relative = path.relative(path.dirname(OUT), absolute)
  return {
    _type: "articleImage",
    _sanityAsset: `image@file://./${relative.split(path.sep).join("/")}`,
    alt: image.alt,
    ...(image.caption ? { caption: image.caption } : {}),
    ...(image.credit ? { credit: image.credit } : {}),
  }
}

/** Body blocks: rewrite image blocks; everything else passes through. */
function toSanityBlock(block) {
  switch (block._type) {
    case "heroImage":
      return { _type: block._type, _key: block._key, image: toSanityImage(block.image) }
    case "inlineImage":
      return {
        _type: block._type,
        _key: block._key,
        size: block.size ?? "inset",
        image: toSanityImage(block.image),
      }
    case "imageGallery":
      return {
        _type: block._type,
        _key: block._key,
        heading: block.heading,
        images: block.images.map(toSanityImage),
      }
    case "relatedArticlesBlock":
      // Relationships live on the document, not the block.
      return { _type: block._type, _key: block._key, heading: block.heading }
    default:
      return block
  }
}

function categoryDoc(category) {
  return {
    _id: `category.${category.slug}`,
    _type: "category",
    title: category.title,
    slug: { _type: "slug", current: category.slug },
    ...(category.description ? { description: category.description } : {}),
  }
}

function authorDoc(author) {
  return {
    _id: AUTHOR_ID,
    _type: "author",
    name: author.name,
    ...(author.role ? { role: author.role } : {}),
    ...(author.bio ? { bio: author.bio } : {}),
    url: author.url ?? "/about",
  }
}

function articleDoc(article) {
  return {
    _id: article._id,
    _type: "article",
    title: article.title,
    slug: { _type: "slug", current: article.slug },
    eyebrow: article.eyebrow,
    excerpt: article.excerpt,
    author: { _type: "reference", _ref: AUTHOR_ID },
    category: { _type: "reference", _ref: `category.${article.category.slug}` },
    publishedAt: article.publishedAt,
    ...(article.reviewedAt ? { reviewedAt: article.reviewedAt } : {}),
    readingTime: article.readingTime,
    publicationState: "published",
    featuredImage: toSanityImage(article.featuredImage),
    ...(article.socialImage ? { socialImage: toSanityImage(article.socialImage) } : {}),
    body: article.body.map(toSanityBlock),
    faqs: article.faqs.map((faq) => ({ _type: "faq", ...faq })),
    sources: article.sources.map((source) => ({ _type: "officialSource", ...source })),
    notice: article.notice,
    relatedLinks: article.relatedLinks.map((link) => ({ _type: "relatedLink", ...link })),
    relatedArticles: article.relatedArticleSlugs.map((slug) => ({
      _type: "reference",
      _key: `rel-${slug}`,
      _ref: `article.${slug}`,
    })),
    programs: article.programs,
    areas: article.areas,
    ...(article.seoTitle ? { seoTitle: article.seoTitle } : {}),
    seoDescription: article.seoDescription,
  }
}

/* ------------------------------------------------------------------ */

async function main() {
  // The seed is TypeScript. Node strips types natively; the resolver hook
  // supplies TypeScript's extensionless import resolution. No build step.
  register("./ts-resolver.mjs", import.meta.url)

  const { SEED_ARTICLES } = await import(
    pathToFileURL(path.resolve("apps/web/lib/blog/seed/index.ts")).href
  )

  const documents = []
  const seenCategories = new Set()

  documents.push(authorDoc(SEED_ARTICLES[0].author))

  for (const article of SEED_ARTICLES) {
    if (!seenCategories.has(article.category.slug)) {
      seenCategories.add(article.category.slug)
      documents.push(categoryDoc(article.category))
    }
  }

  for (const article of SEED_ARTICLES) {
    documents.push(articleDoc(article))
  }

  await mkdir(path.dirname(OUT), { recursive: true })
  await writeFile(OUT, `${documents.map((doc) => JSON.stringify(doc)).join("\n")}\n`)

  console.log(`Wrote ${documents.length} documents to ${OUT}`)
  for (const doc of documents) {
    console.log(`  ${doc._type.padEnd(9)} ${doc._id}`)
  }
  console.log("")
  console.log("Import with:")
  console.log(`  npx sanity dataset import ${OUT} <dataset> --replace`)
  console.log(`  (run from apps/web so sanity.cli.ts supplies the project id)`)

  // Sanity checks on the payload itself, so a malformed seed fails here rather
  // than halfway through an import.
  const problems = []
  for (const doc of documents.filter((d) => d._type === "article")) {
    if (!doc.slug?.current) problems.push(`${doc._id}: missing slug`)
    if (!doc.featuredImage?.alt) problems.push(`${doc._id}: missing featured image alt text`)
    if (!doc.seoDescription) problems.push(`${doc._id}: missing SEO description`)
    if (!Array.isArray(doc.body) || doc.body.length === 0) problems.push(`${doc._id}: empty body`)
    if (!doc.publishedAt) problems.push(`${doc._id}: missing publish date`)
  }
  if (problems.length > 0) {
    console.error("\nSeed validation failed:")
    for (const problem of problems) console.error(`  ${problem}`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
