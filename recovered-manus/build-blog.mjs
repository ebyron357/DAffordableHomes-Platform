import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const recoveredAppBundle = "assets/index-BT_aM9Xt.js";
const rejectedPortrait = "debra-portrait_922a2df0.jpg";
const primaryDebraPhoto = "debra-allen-primary-about.webp";
const articles = [
  ["naca-homebuying-dallas-fort-worth", "NACA HOMEBUYER FIELD GUIDE", "Using NACA to Buy a Home in Dallas–Fort Worth", "Learn how the NACA homebuying process works, when to begin a DFW home search, and how Debra Allen supports the real-estate side of a purchase.", "debra-allen-primary-about.webp", "Debra Allen smiling in a yellow blazer at a kitchen counter", "48% center"],
  ["homes-for-heroes-north-texas", "COMMUNITY HERO FIELD GUIDE", "Homes for Heroes Guidance in North Texas", "A clear guide for community heroes planning a North Texas purchase, sale, or move—without unsupported promises about eligibility or benefits.", "debra-allen-advisor-desk.webp", "Debra Allen seated at her desk with a tablet", "50% 35%"],
  ["how-to-buy-home-garland-tx", "GARLAND FIRST-TIME BUYER FIELD GUIDE", "How to Buy a Home in Garland, Texas", "A step-by-step guide to budgeting, financing, touring, inspections, and closing on a home in Garland.", "debra-allen-lifestyle-full-body.webp", "Debra Allen standing at a kitchen island in a yellow blazer", "center 35%"],
];

const approvedPhotos = [
  "debra-allen-primary-about.webp",
  "debra-allen-advisor-desk.webp",
  "debra-allen-lifestyle-full-body.webp",
];

const primaryLinks = `<a href="/">Home</a><a href="/calculators">Calculators</a><a href="/neighborhoods">Neighborhoods</a><a href="/blog" aria-current="page">Blogs</a><a href="/about">About Debra</a>`;
const header = `<a class="skip" href="#main-content">Skip to main content</a><header class="site-header"><div class="nav"><a class="brand" href="/" aria-label="D'Affordable Homes — Home"><img src="/manus-storage/dah-logo_ff042b7b.png" alt=""><span><strong>D'Affordable</strong><small>Homes</small></span></a><nav class="desktop-nav" aria-label="Primary">${primaryLinks}<a class="button" href="/consultation">Book Consultation</a></nav><details class="mobile-nav"><summary aria-label="Open navigation">Menu</summary><nav aria-label="Mobile navigation">${primaryLinks}<a class="button" href="/consultation">Book Consultation</a></nav></details></div></header>`;
const footer = `<footer class="site-footer"><div class="footer-grid"><section><h2>D'Affordable Homes</h2><p>Real guidance for first-time buyers and families ready to own their future.</p></section><nav aria-label="Footer"><h2>Navigate</h2>${primaryLinks}<a href="/consultation">Book Consultation</a></nav><section><h2>Ready to start?</h2><p>Your first consultation is free. Let's talk.</p><a class="button" href="/consultation">Book a Free Session</a></section></div><div class="footer-bottom"><span>© 2026 D'Affordable Homes. All rights reserved.</span><span>Guidance for first-time buyers &amp; families</span></div></footer>`;
const document = (title, description, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — D'Affordable Homes</title><meta name="description" content="${description.replaceAll('"', '&quot;')}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet"><link rel="stylesheet" href="/blog.css"></head><body>${header}${body}${footer}</body></html>`;

function articleBody(source) {
  const start = source.indexOf("\n    >\n");
  const end = source.indexOf("\n    </ArticleFeature>");
  if (start < 0 || end < 0) throw new Error("Article JSX content was not found");
  return source.slice(start + 7, end)
    .replace(/<Link href="([^"]+)"[^>]*>/g, '<a href="$1">')
    .replaceAll("</Link>", "</a>")
    .replace(/ className="[^"]*"/g, "")
    .replaceAll('href="/book"', 'href="/consultation"')
    .replaceAll('href="/resources/calculators/affordability"', 'href="/calculators"')
    .replaceAll('href="/resources/calculators/mortgage-payment"', 'href="/calculators"');
}

await mkdir("blog", { recursive: true });
await mkdir("manus-storage", { recursive: true });
for (const photo of approvedPhotos) {
  await copyFile(`../apps/web/public/images/${photo}`, `manus-storage/${photo}`);
}

const recoveredApp = await readFile(recoveredAppBundle, "utf8");
if (!recoveredApp.includes(rejectedPortrait) && !recoveredApp.includes(primaryDebraPhoto)) {
  throw new Error("The recovered homepage portrait reference could not be found");
}
const normalizedApp = recoveredApp
  .replaceAll(rejectedPortrait, primaryDebraPhoto)
  .replaceAll('label:"Resources"', 'label:"Blogs"');
await writeFile(recoveredAppBundle, normalizedApp);
await rm(`manus-storage/${rejectedPortrait}`, { force: true });

for (const [slug, eyebrow, title, description, photo, photoAlt, photoPosition] of articles) {
  const source = await readFile(`../apps/web/app/blog/${slug}/page.tsx`, "utf8");
  const article = articleBody(source);
  const body = `<main id="main-content"><section class="hero"><div class="hero-inner"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div></section><div class="content"><div class="content-grid"><article class="article-body">${article}</article><aside class="side"><figure class="debra-card"><img src="/manus-storage/${photo}" alt="${photoAlt}" width="1153" height="1536" style="object-position:${photoPosition}"><figcaption>Guidance from Debra Allen, REALTOR®</figcaption></figure><p class="eyebrow">YOUR NEXT STEP</p><h2>Turn what you learned into a clear plan.</h2><p>Talk with Debra about your goals, questions, and the next responsible step.</p><a class="button" href="/consultation">Book a Free Consultation</a></aside></div></div></main>`;
  await mkdir(`blog/${slug}`, { recursive: true });
  await writeFile(`blog/${slug}/index.html`, document(title, description, body));
}

const cards = articles.map(([slug, eyebrow, title, description]) => `<article class="card"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${description}</p><a href="/blog/${slug}">Read the field guide →</a></article>`).join("");
const blogBody = `<main id="main-content"><section class="hero"><div class="hero-inner debra-intro"><div><p class="eyebrow">HOMEBUYER RESOURCES</p><h1>Clear answers for the decisions ahead.</h1><p>Practical North Texas guidance to help you understand the process, prepare with confidence, and know what to ask next.</p></div><figure class="debra-photo"><img src="/manus-storage/debra-allen-primary-about.webp" alt="Debra Allen smiling in a yellow blazer at a kitchen counter" width="1536" height="1229"><figcaption>Debra Allen, REALTOR®</figcaption></figure></div></section><section class="content" aria-labelledby="guides"><p class="eyebrow">FEATURED GUIDES</p><h2 id="guides" style="font:600 clamp(2rem,4vw,3.5rem)/1.1 'Playfair Display',serif">Start with the question in front of you.</h2><div class="cards">${cards}</div></section></main>`;
await writeFile("blog/index.html", document("Homebuyer Resources", "Practical North Texas homebuyer field guides from Debra Allen.", blogBody));
