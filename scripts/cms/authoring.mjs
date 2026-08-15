/**
 * Authoring helpers for the D'Affordable Homes editorial seed content.
 *
 * These helpers produce Sanity-compatible Portable Text / block content. The
 * same documents are:
 *   1. committed to `apps/web/content/articles/*.json` (the bootstrap content
 *      source used until the Sanity Content Lake is provisioned), and
 *   2. exported to `content/sanity/articles.ndjson` for
 *      `sanity dataset import` (the reproducible migration path).
 *
 * `_key` values are derived deterministically from the document slug and the
 * node position so repeated runs produce byte-identical output.
 */

import { createHash } from 'node:crypto';

function keyFor(seed) {
  return createHash('sha1').update(seed).digest('hex').slice(0, 12);
}

/**
 * Parses a very small inline markup dialect used by the source files:
 *   **bold**            -> strong mark
 *   [text](/path)       -> internal link (Next <Link>)
 *   [text](https://...) -> external link (rel="noreferrer")
 */
function parseInline(text, seed) {
  const spans = [];
  const markDefs = [];
  const pattern = /(\*\*(?<bold>[^*]+)\*\*)|(\[(?<label>[^\]]+)\]\((?<href>[^)]+)\))/g;
  let cursor = 0;
  let index = 0;
  let match;

  const push = (value, marks) => {
    if (!value) return;
    spans.push({ _type: 'span', _key: keyFor(`${seed}:span:${index++}`), text: value, marks });
  };

  while ((match = pattern.exec(text)) !== null) {
    push(text.slice(cursor, match.index), []);
    const groups = match.groups ?? {};
    if (groups.bold !== undefined) {
      push(groups.bold, ['strong']);
    } else {
      const markKey = keyFor(`${seed}:link:${index}`);
      const href = groups.href;
      markDefs.push(
        href.startsWith('/')
          ? { _type: 'internalLink', _key: markKey, path: href }
          : { _type: 'link', _key: markKey, href }
      );
      push(groups.label, [markKey]);
    }
    cursor = match.index + match[0].length;
  }
  push(text.slice(cursor), []);

  if (spans.length === 0) push('', []);
  return { spans, markDefs };
}

function textBlock(style, text, seed, listItem, level) {
  const { spans, markDefs } = parseInline(text, seed);
  const node = {
    _type: 'block',
    _key: keyFor(seed),
    style,
    markDefs,
    children: spans,
  };
  if (listItem) {
    node.listItem = listItem;
    node.level = level ?? 1;
  }
  return node;
}

/** Factory bound to a document slug so keys stay stable and unique. */
export function blocks(slug) {
  let counter = 0;
  const next = (label) => `${slug}:${counter++}:${label}`;

  const api = {
    p: (text) => textBlock('normal', text, next('p')),
    h2: (text) => textBlock('h2', text, next('h2')),
    h3: (text) => textBlock('h3', text, next('h3')),
    h4: (text) => textBlock('h4', text, next('h4')),
    ul: (items) => items.map((item) => textBlock('normal', item, next('ul'), 'bullet', 1)),
    ol: (items) => items.map((item) => textBlock('normal', item, next('ol'), 'number', 1)),

    quickAnswer: ({ heading, paragraphs }) => ({
      _type: 'quickAnswer',
      _key: keyFor(next('quickAnswer')),
      heading,
      body: paragraphs.map((text) => textBlock('normal', text, next('quickAnswer.p'))),
    }),

    heroImage: ({ src, alt, caption, credit }) => ({
      _type: 'heroImage',
      _key: keyFor(next('heroImage')),
      src,
      alt,
      ...(caption ? { caption } : {}),
      ...(credit ? { credit } : {}),
    }),

    inlineImage: ({ src, alt, caption, credit, layout }) => ({
      _type: 'inlineImage',
      _key: keyFor(next('inlineImage')),
      src,
      alt,
      layout: layout ?? 'wide',
      ...(caption ? { caption } : {}),
      ...(credit ? { credit } : {}),
    }),

    imageGallery: ({ heading, images }) => ({
      _type: 'imageGallery',
      _key: keyFor(next('imageGallery')),
      ...(heading ? { heading } : {}),
      images: images.map((image, position) => ({
        _key: keyFor(`${slug}:gallery:${position}:${image.src}`),
        ...image,
      })),
    }),

    embed: ({ title, url, provider, description }) => ({
      _type: 'embed',
      _key: keyFor(next('embed')),
      title,
      url,
      provider: provider ?? 'youtube',
      ...(description ? { description } : {}),
    }),

    pullQuote: ({ quote, attribution }) => ({
      _type: 'pullQuote',
      _key: keyFor(next('pullQuote')),
      quote,
      ...(attribution ? { attribution } : {}),
    }),

    callout: ({ tone, heading, paragraphs }) => ({
      _type: 'callout',
      _key: keyFor(next('callout')),
      tone: tone ?? 'note',
      ...(heading ? { heading } : {}),
      body: paragraphs.map((text) => textBlock('normal', text, next('callout.p'))),
    }),

    complianceDisclaimer: ({ heading, paragraphs }) => ({
      _type: 'complianceDisclaimer',
      _key: keyFor(next('complianceDisclaimer')),
      ...(heading ? { heading } : {}),
      body: paragraphs.map((text) => textBlock('normal', text, next('compliance.p'))),
    }),

    checklist: ({ heading, intro, items }) => ({
      _type: 'checklist',
      _key: keyFor(next('checklist')),
      ...(heading ? { heading } : {}),
      ...(intro ? { intro } : {}),
      items: items.map((item, position) => ({
        _key: keyFor(`${slug}:checklist:${position}:${item.label}`),
        label: item.label,
        ...(item.detail ? { detail: item.detail } : {}),
      })),
    }),

    comparisonTable: ({ heading, caption, columns, rows }) => ({
      _type: 'comparisonTable',
      _key: keyFor(next('comparisonTable')),
      ...(heading ? { heading } : {}),
      ...(caption ? { caption } : {}),
      columns,
      rows: rows.map((cells, position) => ({
        _key: keyFor(`${slug}:row:${position}:${cells[0]}`),
        cells,
      })),
    }),

    faqGroup: ({ heading, intro, faqs }) => ({
      _type: 'faqGroup',
      _key: keyFor(next('faqGroup')),
      ...(heading ? { heading } : {}),
      ...(intro ? { intro } : {}),
      faqs: faqs.map((faq, position) => ({
        _key: keyFor(`${slug}:faq:${position}:${faq.question}`),
        question: faq.question,
        answer: faq.answer,
      })),
    }),

    sourceList: ({ heading, intro, sources }) => ({
      _type: 'sourceList',
      _key: keyFor(next('sourceList')),
      ...(heading ? { heading } : {}),
      ...(intro ? { intro } : {}),
      sources: sources.map((source, position) => ({
        _key: keyFor(`${slug}:source:${position}:${source.href}`),
        ...source,
      })),
    }),

    calculatorCta: (value) => ({ _type: 'calculatorCta', _key: keyFor(next('calculatorCta')), ...value }),
    programCta: (value) => ({ _type: 'programCta', _key: keyFor(next('programCta')), ...value }),
    areaCta: (value) => ({ _type: 'areaCta', _key: keyFor(next('areaCta')), ...value }),
    consultationCta: (value) => ({ _type: 'consultationCta', _key: keyFor(next('consultationCta')), ...value }),
    relatedArticles: ({ heading, intro, links }) => ({
      _type: 'relatedArticles',
      _key: keyFor(next('relatedArticles')),
      ...(heading ? { heading } : {}),
      ...(intro ? { intro } : {}),
      links: links.map((link, position) => ({
        _key: keyFor(`${slug}:related:${position}:${link.href}`),
        ...link,
      })),
    }),
  };

  return api;
}

export { keyFor };
