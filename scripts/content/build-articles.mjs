#!/usr/bin/env node
/**
 * Reproducible article migration build.
 *
 * Reads the committed migration sources in `scripts/content/articles/*.mjs` and
 * emits two artefacts:
 *
 *   apps/web/content/articles/<slug>.json   canonical resolved documents the
 *                                           application serves when no Sanity
 *                                           project is configured
 *   content/sanity/articles.ndjson          Sanity import payload consumed by
 *                                           scripts/sanity/import-articles.mjs
 *                                           (or `sanity dataset import`)
 *
 * Running this script twice produces byte-identical output: every key is
 * derived from a per-document counter, never from randomness or the clock.
 *
 * Usage:  node scripts/content/build-articles.mjs [--check]
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createKeyFactory, createProse, pt } from "./portable-text.mjs"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const articlesOutDir = join(repoRoot, "apps/web/content/articles")
const ndjsonOutPath = join(repoRoot, "content/sanity/articles.ndjson")

const ARTICLE_MODULES = [
  "naca-homebuying-dallas-fort-worth",
  "homes-for-heroes-north-texas",
  "how-to-buy-home-garland-tx",
]

/** Shared reference documents. Facts here are limited to verified information. */
const AUTHORS = {
  "debra-allen": {
    _id: "author.debra-allen",
    name: "Debra Allen",
    credential: "REALTOR®",
    profileUrl: "/about",
    bio: "Homeownership advisor and REALTOR® guiding first-time buyers and families across Garland and Dallas–Fort Worth.",
  },
}

const CATEGORIES = {
  "naca-field-guide": {
    _id: "category.naca-field-guide",
    title: "NACA field guide",
    description: "How the NACA process works and where real-estate representation fits alongside it.",
  },
  "community-heroes": {
    _id: "category.community-heroes",
    title: "Community heroes",
    description: "Buying, selling, and coordinated-move planning for service, education, and healthcare households.",
  },
  "garland-field-guide": {
    _id: "category.garland-field-guide",
    title: "Garland field guide",
    description: "Step-by-step local guidance for buying a home in Garland and the surrounding region.",
  },
}

const PROGRAMS = {
  naca: {
    _id: "program.naca",
    title: "NACA",
    href: "/programs/naca",
    boundary:
      "NACA controls its workshops, counseling, qualification, mortgage terms, property requirements, and official approvals.",
  },
  "homes-for-heroes": {
    _id: "program.homes-for-heroes",
    title: "Homes for Heroes",
    href: "/programs/homes-for-heroes",
    boundary:
      "Homes for Heroes controls its eligibility, enrollment, specialist network, reward structure, terms, and disclosures.",
  },
}

const AREAS = {
  garland: {
    _id: "area.garland",
    title: "Garland",
    href: "/areas/garland",
    description: "Editorial and search focus for Garland, Texas and the surrounding North Texas region.",
  },
}

/** Block constructors bound to one document's deterministic key factory. */
function createBlockFactory(key, prose) {
  const withKeys = (items) => (items ?? []).map((item) => ({ _key: key(), ...item }))

  return {
    richText: (content) => ({ _type: "richTextBlock", _key: key(), content: pt(content) }),
    quickAnswer: (heading, content) => ({
      _type: "quickAnswerBlock",
      _key: key(),
      heading,
      content: pt(content),
    }),
    heroImage: (image) => ({ _type: "heroImageBlock", _key: key(), image }),
    inlineImage: ({ image, width = "content" }) => ({ _type: "inlineImageBlock", _key: key(), image, width }),
    gallery: ({ heading = null, images }) => ({ _type: "imageGalleryBlock", _key: key(), heading, images }),
    video: ({ title, url, description = null, poster = null }) => ({
      _type: "videoEmbedBlock",
      _key: key(),
      title,
      url,
      description,
      poster,
    }),
    quote: ({ quote, attribution = null, role = null }) => ({
      _type: "quoteBlock",
      _key: key(),
      quote,
      attribution,
      role,
    }),
    callout: ({ heading = null, tone = "insight", content }) => ({
      _type: "calloutBlock",
      _key: key(),
      heading,
      tone,
      content: pt(content),
    }),
    complianceDisclaimer: ({ heading = "Important notice", content }) => ({
      _type: "complianceDisclaimerBlock",
      _key: key(),
      heading,
      content: pt(content),
    }),
    checklist: ({ heading, intro = null, items }) => ({
      _type: "checklistBlock",
      _key: key(),
      heading,
      intro,
      items: withKeys(items.map((item) => ({ detail: null, ...item }))),
    }),
    comparisonTable: ({ heading, caption = null, columns, rows }) => ({
      _type: "comparisonTableBlock",
      _key: key(),
      heading,
      caption,
      columns,
      rows: withKeys(rows),
    }),
    faq: ({ heading = "Frequently asked questions", faqs }) => ({
      _type: "faqBlock",
      _key: key(),
      heading,
      faqs: withKeys(faqs),
    }),
    officialSources: ({ heading = "Official sources and review notes", intro = null, sources }) => ({
      _type: "officialSourcesBlock",
      _key: key(),
      heading,
      intro,
      sources: withKeys(sources),
    }),
    calculatorCta: ({ calculator, heading, body = null, href, label = "Open the calculator" }) => ({
      _type: "calculatorCtaBlock",
      _key: key(),
      calculator,
      heading,
      body,
      href,
      label,
    }),
    programCta: ({ program, heading, body = null, href, label = "Read the program guidance" }) => ({
      _type: "programCtaBlock",
      _key: key(),
      program,
      heading,
      body,
      href,
      label,
    }),
    areaGuideCta: ({ area, heading, body = null, href, label = "Open the area guide" }) => ({
      _type: "areaGuideCtaBlock",
      _key: key(),
      area,
      heading,
      body,
      href,
      label,
    }),
    consultationCta: ({ heading, body = null, href = "/consultation", label = "Book a consultation" }) => ({
      _type: "consultationCtaBlock",
      _key: key(),
      heading,
      body,
      href,
      label,
    }),
    relatedArticles: ({ heading = "Continue your plan", links }) => ({
      _type: "relatedArticlesBlock",
      _key: key(),
      heading,
      links: withKeys(links),
    }),
    prose,
  }
}

function normalizeImage(image) {
  if (!image) return null
  return {
    url: null,
    src: image.src ?? null,
    dimensions: image.dimensions ?? null,
    alt: image.alt,
    caption: image.caption ?? null,
    credit: image.credit ?? null,
    focalPoint: image.focalPoint ?? null,
  }
}

async function buildAll() {
  const raw = []

  for (const slug of ARTICLE_MODULES) {
    const module = await import(`./articles/${slug}.mjs`)
    const key = createKeyFactory(`${slug.split("-")[0]}-`)
    const prose = createProse(key)
    const block = createBlockFactory(key, prose)
    raw.push(module.build({ key, prose, block }))
  }

  const bySlug = new Map(raw.map((entry) => [entry.slug, entry]))

  const resolved = raw.map((entry) => {
    const author = AUTHORS[entry.authorSlug]
    const category = CATEGORIES[entry.categorySlug]
    if (!author) throw new Error(`Unknown author "${entry.authorSlug}" for ${entry.slug}`)
    if (!category) throw new Error(`Unknown category "${entry.categorySlug}" for ${entry.slug}`)

    return {
      id: `article.${entry.slug}`,
      slug: entry.slug,
      title: entry.title,
      eyebrow: entry.eyebrow,
      excerpt: entry.excerpt,
      readingTime: entry.readingTime,
      publishedAt: entry.publishedAt,
      reviewedAt: entry.reviewedAt,
      status: entry.status,
      seoTitle: entry.seoTitle ?? null,
      seoDescription: entry.seoDescription,
      featuredImageLayout: entry.featuredImageLayout,
      featuredImage: normalizeImage(entry.featuredImage),
      socialImage: normalizeImage(entry.socialImage),
      author: {
        name: author.name,
        credential: author.credential ?? null,
        profileUrl: author.profileUrl ?? null,
        bio: author.bio ?? null,
      },
      category: { title: category.title, slug: entry.categorySlug, description: category.description ?? null },
      programs: (entry.programSlugs ?? []).map((programSlug) => {
        const program = PROGRAMS[programSlug]
        if (!program) throw new Error(`Unknown program "${programSlug}" for ${entry.slug}`)
        return { title: program.title, slug: programSlug, href: program.href, boundary: program.boundary ?? null }
      }),
      areas: (entry.areaSlugs ?? []).map((areaSlug) => {
        const area = AREAS[areaSlug]
        if (!area) throw new Error(`Unknown area "${areaSlug}" for ${entry.slug}`)
        return { title: area.title, slug: areaSlug, href: area.href, description: area.description ?? null }
      }),
      body: entry.body,
      faqs: (entry.faqs ?? []).map((faq, index) => ({ _key: `faq-${index + 1}`, ...faq })),
      officialSources: (entry.officialSources ?? []).map((source, index) => ({
        _key: `src-${index + 1}`,
        publisher: null,
        ...source,
      })),
      disclaimer: entry.disclaimer ?? null,
      relatedLinks: (entry.relatedLinks ?? []).map((link, index) => ({ _key: `rel-${index + 1}`, ...link })),
      relatedArticles: (entry.relatedArticleSlugs ?? []).map((relatedSlug) => {
        const related = bySlug.get(relatedSlug)
        if (!related) throw new Error(`Unknown related article "${relatedSlug}" for ${entry.slug}`)
        return {
          slug: related.slug,
          title: related.title,
          excerpt: related.excerpt,
          readingTime: related.readingTime,
          eyebrow: related.eyebrow,
        }
      }),
    }
  })

  const ndjson = []
  for (const author of Object.values(AUTHORS)) {
    ndjson.push({
      _id: author._id,
      _type: "author",
      name: author.name,
      slug: { _type: "slug", current: author._id.replace("author.", "") },
      credential: author.credential,
      profileUrl: author.profileUrl,
      bio: author.bio,
    })
  }
  for (const [slug, category] of Object.entries(CATEGORIES)) {
    ndjson.push({
      _id: category._id,
      _type: "category",
      title: category.title,
      slug: { _type: "slug", current: slug },
      description: category.description,
    })
  }
  for (const [slug, program] of Object.entries(PROGRAMS)) {
    ndjson.push({
      _id: program._id,
      _type: "program",
      title: program.title,
      slug: { _type: "slug", current: slug },
      href: program.href,
      boundary: program.boundary,
    })
  }
  for (const [slug, area] of Object.entries(AREAS)) {
    ndjson.push({
      _id: area._id,
      _type: "area",
      title: area.title,
      slug: { _type: "slug", current: slug },
      href: area.href,
      description: area.description,
    })
  }

  for (const entry of raw) {
    const image = entry.featuredImage
      ? {
          _type: "articleImage",
          src: entry.featuredImage.src ?? null,
          alt: entry.featuredImage.alt,
          caption: entry.featuredImage.caption ?? null,
          credit: entry.featuredImage.credit ?? null,
          focalPoint: entry.featuredImage.focalPoint ?? null,
        }
      : undefined

    ndjson.push({
      _id: `article.${entry.slug}`,
      _type: "article",
      title: entry.title,
      slug: { _type: "slug", current: entry.slug },
      eyebrow: entry.eyebrow,
      excerpt: entry.excerpt,
      author: { _type: "reference", _ref: AUTHORS[entry.authorSlug]._id },
      category: { _type: "reference", _ref: CATEGORIES[entry.categorySlug]._id },
      readingTime: entry.readingTime,
      featuredImage: image,
      featuredImageLayout: entry.featuredImageLayout,
      publishedAt: entry.publishedAt,
      reviewedAt: entry.reviewedAt,
      status: entry.status,
      seoTitle: entry.seoTitle,
      seoDescription: entry.seoDescription,
      body: entry.body,
      faqs: (entry.faqs ?? []).map((faq, index) => ({ _key: `faq-${index + 1}`, _type: "faqItem", ...faq })),
      officialSources: (entry.officialSources ?? []).map((source, index) => ({
        _key: `src-${index + 1}`,
        _type: "officialSource",
        ...source,
      })),
      disclaimer: entry.disclaimer,
      relatedLinks: (entry.relatedLinks ?? []).map((link, index) => ({
        _key: `rel-${index + 1}`,
        _type: "relatedLink",
        ...link,
      })),
      relatedArticles: (entry.relatedArticleSlugs ?? []).map((relatedSlug) => ({
        _type: "reference",
        _key: `art-${relatedSlug}`,
        _ref: `article.${relatedSlug}`,
      })),
      programs: (entry.programSlugs ?? []).map((programSlug) => ({
        _type: "reference",
        _key: `prg-${programSlug}`,
        _ref: PROGRAMS[programSlug]._id,
      })),
      areas: (entry.areaSlugs ?? []).map((areaSlug) => ({
        _type: "reference",
        _key: `area-${areaSlug}`,
        _ref: AREAS[areaSlug]._id,
      })),
    })
  }

  return { resolved, ndjson }
}

function serializeArticle(article) {
  return `${JSON.stringify(article, null, 2)}\n`
}

function serializeNdjson(documents) {
  return `${documents.map((document) => JSON.stringify(document)).join("\n")}\n`
}

const checkOnly = process.argv.includes("--check")
const { resolved, ndjson } = await buildAll()

mkdirSync(articlesOutDir, { recursive: true })
mkdirSync(dirname(ndjsonOutPath), { recursive: true })

const outputs = [
  ...resolved.map((article) => [join(articlesOutDir, `${article.slug}.json`), serializeArticle(article)]),
  [ndjsonOutPath, serializeNdjson(ndjson)],
]

let drift = 0
for (const [path, contents] of outputs) {
  if (checkOnly) {
    let current = ""
    try {
      current = readFileSync(path, "utf8")
    } catch {
      current = ""
    }
    if (current !== contents) {
      drift += 1
      process.stderr.write(`Article artefact out of date: ${path}\n`)
    }
  } else {
    writeFileSync(path, contents)
  }
}

if (checkOnly) {
  if (drift > 0) {
    process.stderr.write(`${drift} generated article artefact(s) differ. Run: node scripts/content/build-articles.mjs\n`)
    process.exit(1)
  }
  process.stdout.write(`Article artefacts are up to date (${outputs.length} files).\n`)
} else {
  process.stdout.write(`Wrote ${outputs.length} article artefacts.\n`)
}
