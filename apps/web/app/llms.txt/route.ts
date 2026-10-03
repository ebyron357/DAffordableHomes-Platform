import { listArticles } from "@/lib/blog/source"
import { CALCULATOR_GUIDES, calculatorPath } from "@/lib/content/calculator-guides"
import { SITE } from "@/lib/site"

/**
 * /llms.txt — a plain-text map of the site for AI assistants and answer engines
 * (https://llmstxt.org).
 *
 * Generated, not hand-maintained: the guide list comes from the same CMS read
 * as the sitemap, so a newly published article appears here without a code
 * change. Every description below is copy the site already publishes. The
 * closing section states what the site does not do, because an assistant that
 * summarises this site must not attribute loan approvals, listings or
 * unverified credentials to it.
 */

export const revalidate = 3600

const PAGES: ReadonlyArray<readonly [string, string, string]> = [
  ["Find your next step", "/start", "A short, education-first starting point for renters and buyers in Dallas–Fort Worth."],
  ["First-time buyers", "/first-time-buyers", "How buying a first home works, step by step, before you look at listings."],
  ["Homebuyer programs", "/programs", "Program-specific guidance for buyers and community heroes in Garland and Dallas–Fort Worth, plus links to the official Texas (TDHCA, TSAHC), City of Garland, City of Dallas and Dallas County homebuyer assistance programs."],
  ["NACA homebuyer help", "/programs/naca", "How the NACA program works (workshop, counseling, qualification) and real-estate guidance for NACA buyers. NACA controls qualification, financing terms and official requirements."],
  ["Homes for Heroes help", "/programs/homes-for-heroes", "Buying and selling guidance for military, veterans, first responders, teachers and healthcare workers. Explains that the national Homes for Heroes program is separate from TSAHC's Homes for Texas Heroes loan program."],
  ["Garland, Texas homebuyer guide", "/areas/garland", "Search preparation, local home styles and evaluating a property in Garland."],
  ["Areas", "/areas", "Garland and the Dallas–Fort Worth communities around it, written from local knowledge."],
  ["Planning calculators", "/calculators", "Estimate a monthly payment, affordability, cash to close, down payment, and renting versus buying."],
  ["Frequently asked questions", "/faq", "Plain answers to the questions buyers ask first."],
  ["About Debra Allen", "/about", `${SITE.realtorName}, who leads ${SITE.name}.`],
  ["Guides and articles", "/blog", "Long-form homebuyer guides for North Texas, with their sources listed."],
]

const POLICIES: ReadonlyArray<readonly [string, string]> = [
  ["Fair Housing", "/fair-housing"],
  ["Equal Housing Opportunity", "/equal-housing-opportunity"],
  ["Accessibility statement", "/accessibility"],
  ["Privacy policy", "/privacy"],
  ["Terms of use", "/terms"],
]

const link = (title: string, path: string, note?: string) =>
  `- [${title}](${SITE.url}${path})${note ? `: ${note}` : ""}`

export async function GET() {
  const { articles, state } = await listArticles()

  const guides =
    state.status === "unavailable" || articles.length === 0
      ? [link("All guides", "/blog")]
      : articles.map((article) => link(article.title, `/blog/${article.slug}`, article.excerpt))

  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `Guidance is led by ${SITE.realtorName}, with an editorial focus on ${SITE.localContentFocus.join(" and ")}. ` +
      "Education comes first: visitors can read and use every planning tool without sharing contact details.",
    "",
    "## Start here",
    "",
    ...PAGES.map(([title, path, note]) => link(title, path, note)),
    "",
    "## Planning calculators",
    "",
    "Each runs in the browser, saves nothing, and is a planning estimate rather than a quote or approval.",
    "",
    ...Object.values(CALCULATOR_GUIDES).map((tool) => link(tool.name, calculatorPath(tool.slug), tool.summary)),
    "",
    "## Guides",
    "",
    ...guides,
    "",
    "## Policies",
    "",
    ...POLICIES.map(([title, path]) => link(title, path)),
    "",
    "## What this site does not do",
    "",
    "- It does not approve loans, quote rates, or give legal, tax, lending or individualized financial advice. Those questions belong to a lender, attorney or tax professional.",
    "- It does not publish MLS listings, prices, market statistics, testimonials or reviews that it cannot verify. Where a source is not connected, the page says so.",
    "- Program eligibility (NACA, Homes for Heroes and others) is decided by each program, not by this site.",
    "- Availability for a specific transaction or area is confirmed directly with Debra.",
    "",
  ].join("\n")

  // Caching follows `revalidate` above, the same contract as the sitemap.
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } })
}
