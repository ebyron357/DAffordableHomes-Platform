import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const recoveredAppBundle = "assets/index-BT_aM9Xt.js";
const rejectedPortrait = "debra-portrait_922a2df0.jpg";
const primaryDebraPhoto = "debra-allen-primary-about.webp";
const origin = "https://daffordablehomes-platform.vercel.app";

const articles = [
  {
    slug: "naca-homebuying-dallas-fort-worth",
    eyebrow: "NACA HOMEBUYER FIELD GUIDE",
    title: "Using NACA to Buy a Home in Dallas–Fort Worth",
    description: "Learn how the NACA homebuying process works, when to begin a DFW home search, and how Debra Allen supports the real-estate side of a purchase.",
    readingTime: "10 MIN READ",
    hero: "couple-consultation_25d3a592.jpg",
    heroAlt: "A couple discussing a home purchase with a housing professional",
    heroCaption: "Preparation first. Property search second. Every approval remains with the responsible program and lending professionals.",
    inline: "planning-table.png",
    inlineAlt: "An open planning notebook beside a pen and coffee",
    inlineCaption: "A clear paper trail and a realistic household budget make every later decision easier.",
    portrait: "debra-allen-primary-about.webp",
    portraitAlt: "Debra Allen smiling in a yellow blazer at a kitchen counter",
    portraitPosition: "48% center",
    accent: "FIELD NOTES · DFW",
    related: [
      ["/programs/naca", "NACA program guide", "Understand the official process and Debra’s independent role."],
      ["/areas/garland", "Garland buyer guide", "Prepare for an address-specific North Texas search."],
      ["/calculators/affordability", "Affordability calculator", "Test a responsible planning range before touring."],
    ],
  },
  {
    slug: "homes-for-heroes-north-texas",
    eyebrow: "COMMUNITY HERO FIELD GUIDE",
    title: "Homes for Heroes Guidance in North Texas",
    description: "A clear guide for community heroes planning a North Texas purchase, sale, or move—without unsupported promises about eligibility or benefits.",
    readingTime: "9 MIN READ",
    hero: "hero-family_b1fab939.jpg",
    heroAlt: "A family standing together in front of a home",
    heroCaption: "The strongest plan starts with the household—not a label, slogan, or assumed benefit.",
    inline: "home-keys-moment_20083d77.jpg",
    inlineAlt: "A homeowner holding house keys near the front door",
    inlineCaption: "Verify eligibility, timing, transaction costs, and the complete terms before relying on any benefit.",
    portrait: "debra-allen-advisor-desk.webp",
    portraitAlt: "Debra Allen seated at her desk with a tablet",
    portraitPosition: "50% 35%",
    accent: "SERVICE · COMMUNITY · HOME",
    related: [
      ["/programs/homes-for-heroes", "Homes for Heroes guide", "Confirm current eligibility and program terms."],
      ["/calculators/down-payment", "Cash-to-close planner", "Estimate down payment, closing costs, and reserves."],
      ["/consultation?program=homes-for-heroes", "Talk with Debra", "Build a North Texas plan around your actual goals."],
    ],
  },
  {
    slug: "how-to-buy-home-garland-tx",
    eyebrow: "GARLAND FIRST-TIME BUYER FIELD GUIDE",
    title: "How to Buy a Home in Garland, Texas",
    description: "A step-by-step guide to budgeting, financing, touring, inspections, and closing on a home in Garland.",
    readingTime: "14 MIN READ",
    hero: "home-keys-moment_20083d77.jpg",
    heroAlt: "A new homeowner holding house keys at a front door",
    heroCaption: "A Garland purchase should be evaluated one address, one payment, and one inspection at a time.",
    inline: "black-family-home-pexels-7114188.webp",
    inlineAlt: "A family standing together inside their home",
    inlineCaption: "The right home supports the household’s daily life as well as its monthly budget.",
    portrait: "debra-allen-lifestyle-full-body.webp",
    portraitAlt: "Debra Allen standing at a kitchen island in a yellow blazer",
    portraitPosition: "center 35%",
    accent: "LOCAL GUIDE · GARLAND, TEXAS",
    related: [
      ["/areas/garland", "Garland market guide", "Review the property-specific questions that matter."],
      ["/calculators/affordability", "Affordability calculator", "Compare income, debt, rate, and cash assumptions."],
      ["/calculators/rent-vs-buy", "Rent vs. buy", "Explore simplified longer-term cost scenarios."],
    ],
  },
];

const copiedPhotos = [
  ["../apps/web/public/images/debra-allen-primary-about.webp", "debra-allen-primary-about.webp"],
  ["../apps/web/public/images/debra-allen-advisor-desk.webp", "debra-allen-advisor-desk.webp"],
  ["../apps/web/public/images/debra-allen-lifestyle-full-body.webp", "debra-allen-lifestyle-full-body.webp"],
  ["../apps/web/public/images/black-family-home-pexels-7114188.webp", "black-family-home-pexels-7114188.webp"],
  ["../apps/web/public/images/planning-table.png", "planning-table.png"],
];

const programMenu = `<details class="program-menu"><summary>Programs</summary><div><a href="/programs">All Programs</a><a href="/programs/naca">NACA</a><a href="/programs/homes-for-heroes">Homes for Heroes</a></div></details>`;
const primaryLinks = `<a href="/">Home</a><a href="/calculators">Calculators</a><a href="/neighborhoods">Neighborhoods</a>${programMenu}<a href="/blog" aria-current="page">Blogs</a><a href="/about">About Debra</a>`;
const legalLinks = `<a href="https://www.trec.texas.gov/information-about-brokerage-services-form">TREC Information About Brokerage Services</a><a href="https://www.trec.texas.gov/forms/consumer-protection-notice">TREC Consumer Protection Notice</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/accessibility">Accessibility</a>`;
const header = `<a class="skip" href="#main-content">Skip to main content</a><header class="site-header"><div class="nav"><a class="brand" href="/" aria-label="D'Affordable Homes — Home"><img src="/manus-storage/dah-logo_ff042b7b.png" alt="" width="36" height="36"><span><strong>D'Affordable</strong><small>Homes</small></span></a><nav class="desktop-nav" aria-label="Primary">${primaryLinks}<a class="button button-small" href="/consultation">Book Consultation</a></nav><details class="mobile-nav"><summary aria-label="Open navigation">Menu</summary><nav aria-label="Mobile navigation">${primaryLinks}<a class="button" href="/consultation">Book Consultation</a></nav></details></div></header>`;
const footer = `<footer class="site-footer"><div class="footer-grid"><section><p class="footer-kicker">D'Affordable Homes</p><h2>Clear guidance. Responsible decisions. A place to call home.</h2><p>North Texas homebuyer education and real-estate guidance with Debra Allen, REALTOR®.</p></section><nav aria-label="Footer"><h2>Explore</h2><a href="/">Home</a><a href="/calculators">Calculators</a><a href="/neighborhoods">Neighborhoods</a><a href="/programs">Programs</a><a href="/blog" aria-current="page">Blogs</a><a href="/about">About Debra</a><a href="/consultation">Book Consultation</a></nav><nav class="runtime-legal" aria-label="Legal and consumer notices"><h2>Legal &amp; Consumer</h2>${legalLinks}</nav></div><div class="footer-bottom"><span>© 2026 D'Affordable Homes. All rights reserved.</span><span>Equal housing opportunity · Educational information is not a lending commitment.</span></div></footer>`;
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const document = (title, description, body, head = "") => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#32182f"><title>${escapeHtml(title)} — D'Affordable Homes</title><meta name="description" content="${escapeHtml(description)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet"><link rel="stylesheet" href="/blog.css">${head}</head><body>${header}${body}${footer}</body></html>`;

function articleBody(source) {
  const start = source.indexOf("\n    >\n");
  const end = source.indexOf("\n    </ArticleFeature>");
  if (start < 0 || end < 0) throw new Error("Article JSX content was not found");
  return source.slice(start + 7, end)
    .replace(/<Link href="([^"]+)"[^>]*>/g, '<a href="$1">')
    .replaceAll("</Link>", "</a>")
    .replace(/ className="[^"]*"/g, "")
    .replaceAll('href="/book"', 'href="/consultation"')
    .replaceAll('href="/resources/calculators/affordability"', 'href="/calculators/affordability"')
    .replaceAll('href="/resources/calculators/mortgage-payment"', 'href="/calculator"')
    .replaceAll('href="/resources/calculators/closing-costs"', 'href="/calculators/down-payment"');
}

const stripTags = (html) => html.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
const slugify = (value) => stripTags(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
function enrichArticle(html, data) {
  const headings = [];
  let enriched = html.replace(/<h2(?: id="([^"]+)")?>([\s\S]*?)<\/h2>/g, (_, existingId, label) => {
    const id = existingId || slugify(label);
    headings.push([id, stripTags(label)]);
    return `<h2 id="${id}">${label}</h2>`;
  });
  const figure = `<figure class="article-break"><img src="/manus-storage/${data.inline}" alt="${escapeHtml(data.inlineAlt)}" width="1800" height="1200" loading="lazy" decoding="async"><figcaption>${data.inlineCaption}</figcaption></figure>`;
  enriched = enriched.replace("</section>", `</section>${figure}`);
  return { html: enriched, headings: headings.slice(0, 8) };
}

function relatedCards(items) {
  return items.map(([href, title, description]) => `<a class="related-card" href="${href}"><span>${title}</span><p>${description}</p><strong>Explore next <span aria-hidden="true">→</span></strong></a>`).join("");
}

function articleSchema(data) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    image: `${origin}/manus-storage/${data.hero}`,
    datePublished: "2026-08-05",
    dateModified: "2026-08-09",
    author: { "@type": "Person", name: "Debra Allen" },
    publisher: { "@type": "Organization", name: "D'Affordable Homes" },
    mainEntityOfPage: `${origin}/blog/${data.slug}`,
  }).replaceAll("<", "\\u003c");
}

await mkdir("blog", { recursive: true });
await mkdir("manus-storage", { recursive: true });
for (const [source, destination] of copiedPhotos) await copyFile(source, `manus-storage/${destination}`);

const recoveredApp = await readFile(recoveredAppBundle, "utf8");
if (!recoveredApp.includes(rejectedPortrait) && !recoveredApp.includes(primaryDebraPhoto)) throw new Error("The recovered homepage portrait reference could not be found");
const interceptedNavigation = 'S=xg(U=>{U.ctrlKey||U.metaKey||U.altKey||U.shiftKey||U.button!==0||(v?.(U),U.defaultPrevented||(U.preventDefault(),f(x,s)))})';
const nativeBlogNavigation = 'S=xg(U=>{x==="/blog"||U.ctrlKey||U.metaKey||U.altKey||U.shiftKey||U.button!==0||(v?.(U),U.defaultPrevented||(U.preventDefault(),f(x,s)))})';
const nativeStaticNavigation = 'S=xg(U=>{x.startsWith("/blog")||x.startsWith("/programs")||x.startsWith("/calculators/")||x==="/areas/garland"||x==="/privacy"||x==="/terms"||x==="/accessibility"||U.ctrlKey||U.metaKey||U.altKey||U.shiftKey||U.button!==0||(v?.(U),U.defaultPrevented||(U.preventDefault(),f(x,s)))})';
if (![interceptedNavigation, nativeBlogNavigation, nativeStaticNavigation].some((marker) => recoveredApp.includes(marker))) throw new Error("The recovered application navigation handler could not be found");
const normalizedApp = recoveredApp.replaceAll(rejectedPortrait, primaryDebraPhoto).replaceAll('label:"Resources"', 'label:"Blogs"').replaceAll(interceptedNavigation, nativeBlogNavigation);
await writeFile(recoveredAppBundle, normalizedApp);
await rm(`manus-storage/${rejectedPortrait}`, { force: true });

for (const data of articles) {
  const source = await readFile(`../apps/web/app/blog/${data.slug}/page.tsx`, "utf8");
  const enriched = enrichArticle(articleBody(source), data);
  const toc = enriched.headings.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("");
  const body = `<main id="main-content"><article class="editorial"><header class="article-masthead"><div class="article-masthead-inner"><div class="article-headline"><a class="breadcrumb" href="/blog"><span aria-hidden="true">←</span> Homebuyer journal</a><p class="eyebrow">${data.eyebrow}</p><h1>${data.title}</h1><p class="article-dek">${data.description}</p><div class="article-meta"><span>By Debra Allen, REALTOR®</span><span>Reviewed August 9, 2026</span><span>${data.readingTime}</span></div></div><figure class="article-hero-media"><img src="/manus-storage/${data.hero}" alt="${escapeHtml(data.heroAlt)}" width="1920" height="1440" fetchpriority="high"><figcaption>${data.heroCaption}</figcaption></figure></div></header><div class="article-layout"><aside class="article-toc" aria-label="Article contents"><p>IN THIS GUIDE</p>${toc}<a class="toc-consult" href="/consultation">Ask Debra a question <span aria-hidden="true">→</span></a></aside><div class="article-main"><p class="article-accent">${data.accent}</p><div class="article-body">${enriched.html}</div><section class="article-related" aria-labelledby="related-${data.slug}"><p class="eyebrow">KEEP PLANNING</p><h2 id="related-${data.slug}">Useful next steps</h2><div class="related-grid">${relatedCards(data.related)}</div></section></div><aside class="advisor-rail"><figure class="debra-card"><img src="/manus-storage/${data.portrait}" alt="${escapeHtml(data.portraitAlt)}" width="1153" height="1536" loading="lazy" decoding="async" style="object-position:${data.portraitPosition}"><figcaption>Debra Allen, REALTOR®</figcaption></figure><p class="eyebrow">LOCAL GUIDANCE</p><h2>Make the next decision with a clear plan.</h2><p>Bring your stage, questions, and priorities. Debra will help identify the next responsible real-estate step.</p><a class="button" href="/consultation">Book a Free Consultation</a></aside></div><section class="editorial-cta"><div><p class="eyebrow">READY WHEN YOU ARE</p><h2>Your home search deserves more than guesswork.</h2><p>Start with a conversation about the budget, timing, and daily life your next home needs to support.</p></div><a class="button button-light" href="/consultation">Plan with Debra <span aria-hidden="true">→</span></a></section></article></main>`;
  const structuredData = `<script type="application/ld+json">${articleSchema(data)}</script>`;
  await mkdir(`blog/${data.slug}`, { recursive: true });
  await writeFile(`blog/${data.slug}/index.html`, document(data.title, data.description, body, structuredData));
}

const [lead, ...secondary] = articles;
const leadStory = `<a class="lead-story" href="/blog/${lead.slug}"><figure><img src="/manus-storage/${lead.hero}" alt="${escapeHtml(lead.heroAlt)}" width="1920" height="1440" fetchpriority="high"></figure><div><p class="eyebrow">FEATURED GUIDE · ${lead.readingTime}</p><h2>${lead.title}</h2><p>${lead.description}</p><strong>Read the complete guide <span aria-hidden="true">→</span></strong></div></a>`;
const secondaryStories = secondary.map((data) => `<a class="story-card" href="/blog/${data.slug}"><figure><img src="/manus-storage/${data.hero}" alt="${escapeHtml(data.heroAlt)}" width="1920" height="1440" loading="lazy" decoding="async"></figure><div><p class="eyebrow">${data.eyebrow} · ${data.readingTime}</p><h2>${data.title}</h2><p>${data.description}</p><strong>Read the field guide <span aria-hidden="true">→</span></strong></div></a>`).join("");
const blogBody = `<main id="main-content"><section class="journal-hero"><div class="journal-hero-inner"><div><p class="eyebrow">THE D'AFFORDABLE HOMES JOURNAL</p><h1>Homebuyer clarity,<br><em>beautifully explained.</em></h1><p class="journal-dek">Practical North Texas guidance for the decisions that shape your purchase—from choosing a path to evaluating the property in front of you.</p><div class="journal-actions"><a class="button" href="#featured-guides">Explore the guides</a><a class="text-link" href="/consultation">Ask Debra a question <span aria-hidden="true">→</span></a></div></div><figure class="journal-portrait"><img src="/manus-storage/debra-allen-primary-about.webp" alt="Debra Allen smiling in a yellow blazer at a kitchen counter" width="1536" height="1229" fetchpriority="high"><figcaption><strong>Debra Allen</strong><span>REALTOR® · NORTH TEXAS</span></figcaption></figure></div></section><section class="journal-principles" aria-label="Editorial principles"><span>LOCAL CONTEXT</span><span>PLAIN-LANGUAGE ANSWERS</span><span>NO UNSUPPORTED PROMISES</span></section><section class="journal-content" id="featured-guides" aria-labelledby="featured-title"><div class="section-heading"><div><p class="eyebrow">FEATURED FIELD GUIDES</p><h2 id="featured-title">Start with the decision in front of you.</h2></div><p>Each guide separates what is known, what must be verified, and what you can do next.</p></div>${leadStory}<div class="story-grid">${secondaryStories}</div></section><section class="journal-note"><div class="journal-note-copy"><p class="eyebrow">FROM DEBRA'S DESK</p><blockquote>“A confident buyer is not someone who knows everything. It is someone who knows what to verify—and who is responsible for the answer.”</blockquote><p>These resources are educational. Program rules, property facts, financing, insurance, taxes, and eligibility should always be confirmed with the responsible source.</p><a class="text-link" href="/about">Meet Debra Allen <span aria-hidden="true">→</span></a></div><figure><img src="/manus-storage/debra-allen-advisor-desk.webp" alt="Debra Allen seated at her desk with a tablet" width="1153" height="1536" loading="lazy" decoding="async"></figure></section><section class="editorial-cta"><div><p class="eyebrow">YOUR NEXT CHAPTER</p><h2>Turn what you learned into a responsible plan.</h2><p>Talk through your goals, homebuying stage, and North Texas search priorities with Debra.</p></div><a class="button button-light" href="/consultation">Book a Free Consultation <span aria-hidden="true">→</span></a></section></main>`;
await writeFile("blog/index.html", document("Homebuyer Resources", "Premium, practical North Texas homebuyer field guides from Debra Allen.", blogBody));

// Apply the maintained production-integrity layer after regenerating the recovered shell.
await import("./production-repair.mjs");
