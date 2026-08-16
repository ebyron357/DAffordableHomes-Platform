#!/usr/bin/env node
/**
 * Reproducible content migration.
 *
 * Emits, from a single set of authored sources:
 *   apps/web/content/articles/<slug>.json  bootstrap content source read by the
 *                                          app until the Sanity Content Lake is
 *                                          provisioned (see lib/cms/source.ts)
 *   apps/web/content/taxonomy.json         authors / categories / programs / areas
 *   content/sanity/articles.ndjson         `sanity dataset import` payload
 *
 * Run:  node scripts/cms/build-content.mjs
 * Check (CI): node scripts/cms/build-content.mjs --check
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import naca from './source/naca-homebuying-dallas-fort-worth.mjs';
import heroes from './source/homes-for-heroes-north-texas.mjs';
import garland from './source/how-to-buy-home-garland-tx.mjs';
import { areas, authors, categories, programs } from './source/taxonomy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const articlesDir = path.join(repoRoot, 'apps/web/content/articles');
const taxonomyFile = path.join(repoRoot, 'apps/web/content/taxonomy.json');
const ndjsonFile = path.join(repoRoot, 'content/sanity/articles.ndjson');

const articles = [naca, heroes, garland];
const checkOnly = process.argv.includes('--check');

/** Documents are ordered so referenced documents import before referencing ones. */
const allDocuments = [...authors, ...categories, ...programs, ...areas, ...articles];

function assert(condition, message) {
  if (!condition) {
    console.error(`content: ${message}`);
    process.exitCode = 1;
  }
}

function validate() {
  const ids = new Set(allDocuments.map((doc) => doc._id));
  const slugs = new Set();

  for (const article of articles) {
    const label = article.slug?.current ?? article._id;
    assert(Boolean(article.title), `${label}: title is required`);
    assert(Boolean(article.slug?.current), `${label}: slug is required`);
    assert(Boolean(article.excerpt), `${label}: excerpt is required`);
    assert(Boolean(article.seoDescription), `${label}: seoDescription is required`);
    assert(Boolean(article.publishedAt), `${label}: publishedAt is required`);
    assert(Boolean(article.reviewedAt), `${label}: reviewedAt is required`);
    assert(Number.isFinite(article.readingTimeMinutes), `${label}: readingTimeMinutes is required`);
    assert(Boolean(article.featuredImage?.src), `${label}: featuredImage is required`);
    assert(
      (article.featuredImage?.alt ?? '').length >= 15,
      `${label}: featuredImage needs descriptive alt text`
    );
    assert(Array.isArray(article.body) && article.body.length > 0, `${label}: body needs at least one block`);
    assert(ids.has(article.author?._ref), `${label}: author reference ${article.author?._ref} is missing`);
    assert(ids.has(article.category?._ref), `${label}: category reference ${article.category?._ref} is missing`);

    for (const reference of [...(article.programs ?? []), ...(article.areas ?? [])]) {
      assert(ids.has(reference._ref), `${label}: reference ${reference._ref} is missing`);
    }

    for (const node of article.body) {
      if (node._type === 'inlineImage' || node._type === 'heroImage') {
        assert((node.alt ?? '').length >= 15, `${label}: ${node._type} needs descriptive alt text`);
      }
    }

    assert(!slugs.has(article.slug.current), `${label}: duplicate slug`);
    slugs.add(article.slug.current);
  }

  const keys = allDocuments.map((doc) => doc._id);
  assert(new Set(keys).size === keys.length, 'duplicate document _id values');
}

async function writeIfChanged(file, contents) {
  let previous = null;
  try {
    previous = await readFile(file, 'utf8');
  } catch {
    previous = null;
  }
  if (previous === contents) return false;
  if (checkOnly) {
    console.error(`content: ${path.relative(repoRoot, file)} is out of date — run node scripts/cms/build-content.mjs`);
    process.exitCode = 1;
    return false;
  }
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents);
  return true;
}

async function main() {
  validate();
  if (process.exitCode) return;

  let changed = 0;

  for (const article of articles) {
    const file = path.join(articlesDir, `${article.slug.current}.json`);
    if (await writeIfChanged(file, `${JSON.stringify(article, null, 2)}\n`)) changed += 1;
  }

  const taxonomy = { authors, categories, programs, areas };
  if (await writeIfChanged(taxonomyFile, `${JSON.stringify(taxonomy, null, 2)}\n`)) changed += 1;

  const ndjson = `${allDocuments.map((doc) => JSON.stringify(doc)).join('\n')}\n`;
  if (await writeIfChanged(ndjsonFile, ndjson)) changed += 1;

  if (process.exitCode) return;
  console.log(
    checkOnly
      ? `content: up to date (${articles.length} articles, ${allDocuments.length} documents)`
      : `content: wrote ${changed} file(s) — ${articles.length} articles, ${allDocuments.length} documents`
  );
}

await main();
