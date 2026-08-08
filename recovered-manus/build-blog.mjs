import { mkdir, readFile, writeFile } from "node:fs/promises";
const articles = [
  ["naca-homebuying-dallas-fort-worth", "NACA HOMEBUYER FIELD GUIDE", "Using NACA to Buy a Home in Dallas–Fort Worth", "Learn how the NACA homebuying process works, when to begin a DFW home search, and how Debra Allen supports the real-estate side of a purchase."],
  ["homes-for-heroes-north-texas", "COMMUNITY HERO FIELD GUIDE", "Homes for Heroes Guidance in North Texas", "A clear guide for community heroes planning a North Texas purchase, sale, or move—without unsupported promises about eligibility or benefits."],
  ["how-to-buy-home-garland-tx", "GARLAND FIRST-TIME BUYER FIELD GUIDE", "How to Buy a Home in Garland, Texas", "A step-by-step guide to budgeting, financing, touring, inspections, and closing on a home in Garland."],
];

const header = `<a class="skip" href="#main-content">Skip to main content</a><header class="site-header"><div class="nav"><a class="brand" href="/"><img src="/manus-storage/dah-logo_ff042b7b.png" alt="D'Affordable Homes"></a><nav aria-label="Primary"><a href="/">Home</a><a href="/calculators">Calculators</a><a href="/neighborhoods">Neighborhoods</a><a href="/blog">Resources</a><a href="/about">About Debra</a><a class="button" href="/consultation">Book Consultation</a></nav></div></header>`;
const footer = `<footer class="site-footer"><div><strong>D'Affordable Homes</strong><p>Real guidance, plain language, and someone in your corner.</p></div></footer>`;
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
for (const [slug, eyebrow, title, description] of articles) {
  const source = await readFile(`../apps/web/app/blog/${slug}/page.tsx`, "utf8");
  const article = articleBody(source);
  const body = `<main id="main-content"><section class="hero"><div class="hero-inner"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div></section><div class="content"><div class="content-grid"><article class="article-body">${article}</article><aside class="side"><p class="eyebrow">YOUR NEXT STEP</p><h2>Turn what you learned into a clear plan.</h2><p>Talk with Debra about your goals, questions, and the next responsible step.</p><a class="button" href="/consultation">Book a Free Consultation</a></aside></div></div></main>`;
  await mkdir(`blog/${slug}`, { recursive: true });
  await writeFile(`blog/${slug}/index.html`, document(title, description, body));
}

const cards = articles.map(([slug, eyebrow, title, description]) => `<article class="card"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${description}</p><a href="/blog/${slug}">Read the field guide →</a></article>`).join("");
const blogBody = `<main id="main-content"><section class="hero"><div class="hero-inner"><p class="eyebrow">HOMEBUYER RESOURCES</p><h1>Clear answers for the decisions ahead.</h1><p>Practical North Texas guidance to help you understand the process, prepare with confidence, and know what to ask next.</p></div></section><section class="content" aria-labelledby="guides"><p class="eyebrow">FEATURED GUIDES</p><h2 id="guides" style="font:600 clamp(2rem,4vw,3.5rem)/1.1 'Playfair Display',serif">Start with the question in front of you.</h2><div class="cards">${cards}</div></section></main>`;
await writeFile("blog/index.html", document("Homebuyer Resources", "Practical North Texas homebuyer field guides from Debra Allen.", blogBody));
