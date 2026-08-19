import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const recoveredAppBundle = "assets/index-BT_aM9Xt.js";
const rejectedPortrait = "debra-portrait_922a2df0.jpg";
const primaryDebraPhoto = "debra-allen-primary-about.webp";
/*
 * Reference-only static bundle.
 *
 * This generator reproduces the historical Manus static site. It is NOT the
 * production release artefact — the production application lives in apps/web
 * and its blog is served from the CMS. Article copy is read from the canonical
 * migrated dataset so this reference material can never drift away from what
 * the production site publishes.
 */
const articlePhotos = {
  "naca-homebuying-dallas-fort-worth": ["debra-allen-primary-about.webp", "Debra Allen smiling in a yellow blazer at a kitchen counter", "48% center"],
  "homes-for-heroes-north-texas": ["debra-allen-advisor-desk.webp", "Debra Allen seated at her desk with a tablet", "50% 35%"],
  "how-to-buy-home-garland-tx": ["debra-allen-lifestyle-full-body.webp", "Debra Allen standing at a kitchen island in a yellow blazer", "center 35%"],
};

/** Routes that exist in the production app but not in this reference bundle. */
const legacyLinkFallbacks = {
  "/calculators/closing-costs": "/calculators",
  "/calculators/mortgage-payment": "/calculators",
  "/areas": "/areas/garland",
  "/book": "/consultation",
};

const escapeHtml = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const legacyHref = (href) => legacyLinkFallbacks[href] ?? href;

function renderSpans(block) {
  const marks = new Map((block.markDefs ?? []).map((definition) => [definition._key, definition]));
  return (block.children ?? [])
    .map((span) => {
      let html = escapeHtml(span.text);
      for (const mark of span.marks ?? []) {
        if (mark === "strong") html = `<strong>${html}</strong>`;
        else if (mark === "em") html = `<em>${html}</em>`;
        else if (marks.has(mark)) html = `<a href="${escapeHtml(legacyHref(marks.get(mark).href))}">${html}</a>`;
      }
      return html;
    })
    .join("");
}

function renderPortableText(blocks) {
  const html = [];
  let openList = null;
  for (const block of blocks ?? []) {
    if (block.listItem) {
      const tag = block.listItem === "number" ? "ol" : "ul";
      if (openList !== tag) {
        if (openList) html.push(`</${openList}>`);
        html.push(`<${tag}>`);
        openList = tag;
      }
      html.push(`<li>${renderSpans(block)}</li>`);
      continue;
    }
    if (openList) {
      html.push(`</${openList}>`);
      openList = null;
    }
    const style = block.style === "normal" || !block.style ? "p" : block.style;
    html.push(`<${style}>${renderSpans(block)}</${style}>`);
  }
  if (openList) html.push(`</${openList}>`);
  return html.join("");
}

function renderBlock(block) {
  switch (block._type) {
    case "richTextBlock":
      return renderPortableText(block.content);
    case "quickAnswerBlock":
      return `<section class="quick-answer"><h2>${escapeHtml(block.heading)}</h2>${renderPortableText(block.content)}</section>`;
    case "calloutBlock":
    case "complianceDisclaimerBlock":
      return `<section class="callout">${block.heading ? `<h2>${escapeHtml(block.heading)}</h2>` : ""}${renderPortableText(block.content)}</section>`;
    case "checklistBlock":
      return `<section><h2>${escapeHtml(block.heading)}</h2><ul>${block.items.map((item) => `<li>${escapeHtml(item.label)}</li>`).join("")}</ul></section>`;
    case "comparisonTableBlock":
      return `<section><h2>${escapeHtml(block.heading)}</h2><table>${block.caption ? `<caption>${escapeHtml(block.caption)}</caption>` : ""}<thead><tr>${block.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${block.rows.map((row) => `<tr><th scope="row">${escapeHtml(row.header)}</th>${row.cells.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></section>`;
    case "programCtaBlock":
    case "areaGuideCtaBlock":
    case "calculatorCtaBlock":
    case "consultationCtaBlock":
      return `<section class="cta"><h2>${escapeHtml(block.heading)}</h2>${block.body ? `<p>${escapeHtml(block.body)}</p>` : ""}<p><a href="${escapeHtml(legacyHref(block.href))}">${escapeHtml(block.label)}</a></p></section>`;
    default:
      return "";
  }
}

function renderArticle(document) {
  const body = document.body.map(renderBlock).join("");
  const faqs = document.faqs?.length
    ? `<section><h2>Frequently asked questions</h2>${document.faqs.map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join("")}</section>`
    : "";
  const sources = document.officialSources?.length
    ? `<section><h2>Official sources and review notes</h2><ul>${document.officialSources.map((source) => `<li><a href="${escapeHtml(source.href)}">${escapeHtml(source.label)}</a></li>`).join("")}</ul></section>`
    : "";
  const disclaimer = document.disclaimer?.length
    ? `<section class="callout"><h2>Important notice</h2>${renderPortableText(document.disclaimer)}</section>`
    : "";
  return `${body}${faqs}${sources}${disclaimer}`;
}

const articles = await Promise.all(
  Object.keys(articlePhotos).map(async (slug) => {
    const document = JSON.parse(await readFile(`../apps/web/content/articles/${slug}.json`, "utf8"));
    const [photo, photoAlt, photoPosition] = articlePhotos[slug];
    return [
      slug,
      (document.eyebrow ?? document.category?.title ?? "").toUpperCase(),
      document.title,
      document.seoDescription,
      photo,
      photoAlt,
      photoPosition,
      renderArticle(document),
    ];
  }),
);

const approvedPhotos = [
  "debra-allen-primary-about.webp",
  "debra-allen-advisor-desk.webp",
  "debra-allen-lifestyle-full-body.webp",
];

const primaryLinks = `<a href="/">Home</a><a href="/calculators">Calculators</a><a href="/neighborhoods">Neighborhoods</a><a href="/blog" aria-current="page">Blogs</a><a href="/about">About Debra</a>`;
const header = `<a class="skip" href="#main-content">Skip to main content</a><header class="site-header"><div class="nav"><a class="brand" href="/" aria-label="D'Affordable Homes — Home"><img src="/manus-storage/dah-logo_ff042b7b.png" alt=""><span><strong>D'Affordable</strong><small>Homes</small></span></a><nav class="desktop-nav" aria-label="Primary">${primaryLinks}<a class="button" href="/consultation">Book Consultation</a></nav><details class="mobile-nav"><summary aria-label="Open navigation">Menu</summary><nav aria-label="Mobile navigation">${primaryLinks}<a class="button" href="/consultation">Book Consultation</a></nav></details></div></header>`;
const footer = `<footer class="site-footer"><div class="footer-grid"><section><h2>D'Affordable Homes</h2><p>Real guidance for first-time buyers and families ready to own their future.</p></section><nav aria-label="Footer"><h2>Navigate</h2>${primaryLinks}<a href="/consultation">Book Consultation</a></nav><section><h2>Ready to start?</h2><p>Your first consultation is free. Let's talk.</p><a class="button" href="/consultation">Book a Free Session</a></section></div><div class="footer-bottom"><span>© 2026 D'Affordable Homes. All rights reserved.</span><span>Guidance for first-time buyers &amp; families</span></div></footer>`;
const document = (title, description, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — D'Affordable Homes</title><meta name="description" content="${description.replaceAll('"', '&quot;')}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet"><link rel="stylesheet" href="/blog.css"></head><body>${header}${body}${footer}</body></html>`;

await mkdir("blog", { recursive: true });
await mkdir("manus-storage", { recursive: true });
for (const photo of approvedPhotos) {
  await copyFile(`../apps/web/public/images/${photo}`, `manus-storage/${photo}`);
}

const recoveredApp = await readFile(recoveredAppBundle, "utf8");
if (!recoveredApp.includes(rejectedPortrait) && !recoveredApp.includes(primaryDebraPhoto)) {
  throw new Error("The recovered homepage portrait reference could not be found");
}
const interceptedNavigation = 'S=xg(U=>{U.ctrlKey||U.metaKey||U.altKey||U.shiftKey||U.button!==0||(v?.(U),U.defaultPrevented||(U.preventDefault(),f(x,s)))})';
const nativeBlogNavigation = 'S=xg(U=>{x==="/blog"||U.ctrlKey||U.metaKey||U.altKey||U.shiftKey||U.button!==0||(v?.(U),U.defaultPrevented||(U.preventDefault(),f(x,s)))})';
const nativeStaticNavigation = 'S=xg(U=>{x.startsWith("/blog")||x.startsWith("/programs")||x.startsWith("/calculators/")||x==="/areas/garland"||x==="/privacy"||x==="/terms"||x==="/accessibility"||U.ctrlKey||U.metaKey||U.altKey||U.shiftKey||U.button!==0||(v?.(U),U.defaultPrevented||(U.preventDefault(),f(x,s)))})';
if (!recoveredApp.includes(interceptedNavigation) && !recoveredApp.includes(nativeBlogNavigation) && !recoveredApp.includes(nativeStaticNavigation)) {
  throw new Error("The recovered application navigation handler could not be found");
}
const normalizedApp = recoveredApp
  .replaceAll(rejectedPortrait, primaryDebraPhoto)
  .replaceAll('label:"Resources"', 'label:"Blogs"')
  .replaceAll(interceptedNavigation, nativeBlogNavigation);
await writeFile(recoveredAppBundle, normalizedApp);
await rm(`manus-storage/${rejectedPortrait}`, { force: true });

for (const [slug, eyebrow, title, description, photo, photoAlt, photoPosition, article] of articles) {
  const body =`<main id="main-content"><section class="hero"><div class="hero-inner"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div></section><div class="content"><div class="content-grid"><article class="article-body">${article}</article><aside class="side"><figure class="debra-card"><img src="/manus-storage/${photo}" alt="${photoAlt}" width="1153" height="1536" style="object-position:${photoPosition}"><figcaption>Guidance from Debra Allen, REALTOR®</figcaption></figure><p class="eyebrow">YOUR NEXT STEP</p><h2>Turn what you learned into a clear plan.</h2><p>Talk with Debra about your goals, questions, and the next responsible step.</p><a class="button" href="/consultation">Book a Free Consultation</a></aside></div></div></main>`;
  await mkdir(`blog/${slug}`, { recursive: true });
  await writeFile(`blog/${slug}/index.html`, document(title, description, body));
}

const cards = articles.map(([slug, eyebrow, title, description]) => `<article class="card"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${description}</p><a href="/blog/${slug}">Read the field guide →</a></article>`).join("");
const blogBody = `<main id="main-content"><section class="hero"><div class="hero-inner debra-intro"><div><p class="eyebrow">HOMEBUYER RESOURCES</p><h1>Clear answers for the decisions ahead.</h1><p>Practical North Texas guidance to help you understand the process, prepare with confidence, and know what to ask next.</p></div><figure class="debra-photo"><img src="/manus-storage/debra-allen-primary-about.webp" alt="Debra Allen smiling in a yellow blazer at a kitchen counter" width="1536" height="1229"><figcaption>Debra Allen, REALTOR®</figcaption></figure></div></section><section class="content" aria-labelledby="guides"><p class="eyebrow">FEATURED GUIDES</p><h2 id="guides" style="font:600 clamp(2rem,4vw,3.5rem)/1.1 'Playfair Display',serif">Start with the question in front of you.</h2><div class="cards">${cards}</div></section></main>`;
await writeFile("blog/index.html", document("Homebuyer Resources", "Practical North Texas homebuyer field guides from Debra Allen.", blogBody));

// Apply the maintained production-integrity layer after regenerating the recovered shell.
await import("./production-repair.mjs");
