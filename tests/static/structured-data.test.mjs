import assert from 'node:assert/strict';
import { register } from 'node:module';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

/**
 * Structured-data coverage tests.
 *
 * FAQs can reach the page from two places — the article's own `faqs` field and
 * a `faqBlock` in the body. Both render. Emitting FAQPage JSON-LD from only one
 * of them ships visible FAQs with no matching structured data, which is exactly
 * the kind of gap a source-text assertion cannot see.
 */

register('../../scripts/sanity/ts-resolver.mjs', import.meta.url);


const { collectFaqs } = await import(
  pathToFileURL('apps/web/lib/blog/structured-data.ts').href
);

const faq = (question, answer = 'An answer long enough to be real.') => ({
  _key: question.slice(0, 6),
  question,
  answer
});

test('FAQ JSON-LD covers FAQs supplied only on a body block', () => {
  // The block renders these on the page. If structured data came from
  // `article.faqs` alone, the page would show FAQs with no FAQPage JSON-LD.
  const article = {
    faqs: [],
    body: [{ _type: 'faqBlock', _key: 'f1', faqs: [faq('Block only?')] }]
  };

  const collected = collectFaqs(article);
  assert.equal(collected.length, 1);
  assert.equal(collected[0].question, 'Block only?');
});

test('FAQ JSON-LD covers article-level FAQs with no block', () => {
  const article = { faqs: [faq('Article only?')], body: [] };
  assert.deepEqual(collectFaqs(article).map((f) => f.question), ['Article only?']);
});

test('a populated block wins over a different article-level list', () => {
  // The route renders the block and NOT the article-level list, so JSON-LD
  // that included both would publish FAQs no visitor can see.
  const article = {
    faqs: [faq('Article question?')],
    body: [{ _type: 'faqBlock', _key: 'f1', faqs: [faq('Block question?')] }]
  };

  assert.deepEqual(collectFaqs(article).map((f) => f.question), ['Block question?']);
});

test('multiple FAQ blocks are combined', () => {
  const article = {
    faqs: [],
    body: [
      { _type: 'faqBlock', _key: 'f1', faqs: [faq('First?')] },
      { _type: 'richTextBlock', _key: 'r', content: [] },
      { _type: 'faqBlock', _key: 'f2', faqs: [faq('Second?')] }
    ]
  };

  assert.deepEqual(collectFaqs(article).map((f) => f.question), ['First?', 'Second?']);
});

test('a block reusing the article FAQs does not duplicate them', () => {
  // The migrated articles do exactly this: article-level faqs plus a faqBlock
  // that resolves to the same list.
  const shared = [faq('Shared question?'), faq('Second question?')];
  const article = {
    faqs: shared,
    body: [{ _type: 'faqBlock', _key: 'f1', faqs: shared }]
  };

  assert.equal(collectFaqs(article).length, 2);
});

test('an article with no FAQs anywhere collects none', () => {
  assert.deepEqual(collectFaqs({ faqs: [], body: [] }), []);
  assert.deepEqual(
    collectFaqs({ faqs: [], body: [{ _type: 'richTextBlock', _key: 'r', content: [] }] }),
    []
  );
});
