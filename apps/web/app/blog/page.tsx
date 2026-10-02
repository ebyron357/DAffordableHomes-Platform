import type { Metadata } from "next"
import Link from "next/link"
import { BadgeCheck, Calculator, ClipboardCheck, Compass, MapPin, Route, ShieldCheck } from "lucide-react"

import { ArticlePlate, BlogImage, plateVariantFor } from "@/components/blog/blog-image"
import { Band, BandLead, CtaBand, Features } from "@/components/page/editorial"
import { CLOSING_BAND_IMAGE } from "@/lib/content/imagery"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { formatArticleDate } from "@/lib/blog/format"
import { listArticles } from "@/lib/blog/source"
import type { ArticleSummary } from "@/lib/blog/types"
import { SITE } from "@/lib/site"

/**
 * Blog index, driven entirely by the CMS.
 *
 * The lead article gets a full editorial treatment; the rest run as a
 * two-column card grid. Adding a fourth article in Sanity needs no code change.
 *
 * Public wording is plain consumer language — "guides", "homebuyer resources".
 * The earlier "field guide" framing read as military kit rather than as help
 * for someone buying a house, and it appeared in the page title, the hero, the
 * section headings and the structured data all at once.
 */

export const revalidate = 3600

const TITLE = "Homebuyer Guides for North Texas"
const DESCRIPTION =
  "Practical homebuyer guides from Debra Allen, REALTOR® — clear answers, visible sources, and honest program boundaries for Garland and Dallas–Fort Worth."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `${TITLE} | D'Affordable Homes`,
    description:
      "Clear, practical homebuyer guides for Garland and Dallas–Fort Worth, with visible sources and honest program boundaries.",
    url: "/blog",
    type: "website",
  },
}

const NEXT_STEP_LINKS = [
  {
    href: "/first-time-buyers",
    title: "First-time buyer roadmap",
    body: "Understand the sequence before you start touring homes, so nothing arrives as a surprise at the worst moment.",
    icon: Route,
    tone: "teal" as const,
    action: "Walk the sequence",
  },
  {
    href: "/programs",
    title: "Homebuyer programs",
    body: "Learn what program information to verify before applying, and which decisions stay with the program itself.",
    icon: ClipboardCheck,
    tone: "navy" as const,
    action: "Compare programs",
  },
  {
    href: "/calculators",
    title: "Planning calculators",
    body: "Test monthly-payment and cash-to-close scenarios with your own numbers instead of a rule of thumb.",
    icon: Calculator,
    tone: "gold" as const,
    action: "Run the numbers",
  },
  {
    href: "/areas/garland",
    title: "Garland area guide",
    body: "A local starting point, with the practical questions a Garland search actually turns on.",
    icon: MapPin,
    tone: "green" as const,
    action: "Open the guide",
  },
] as const

/** Publication line shared by the lead article and the cards. */
function ArticleMeta({ article, showAuthor }: { article: ArticleSummary; showAuthor?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
      {showAuthor && <span className="font-medium text-foreground">By {article.author.name}</span>}
      <time dateTime={article.publishedAt}>Published {formatArticleDate(article.publishedAt)}</time>
      {/* Reviewed dates are what tell a reader this is maintained rather than
          posted once and left. Shown wherever the editor has set one. */}
      {article.reviewedAt && (
        <time dateTime={article.reviewedAt}>Reviewed {formatArticleDate(article.reviewedAt)}</time>
      )}
      <span>{article.readingTime}</span>
    </div>
  )
}

function LeadArticle({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
      <div className="order-2 lg:order-1">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Latest
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {article.category.title}
          </span>
        </div>
        <h2 className="mt-5 font-serif text-[34px] leading-[1.1] sm:text-[44px]">
          <Link href={`/blog/${article.slug}`} className="hover:text-primary">
            <span className="absolute inset-0" aria-hidden="true" />
            {article.title}
          </Link>
        </h2>
        <p className="mt-5 max-w-[54ch] text-[17px] leading-[1.7] text-muted-foreground sm:text-[18px]">
          {article.excerpt}
        </p>
        <div className="mt-7">
          <ArticleMeta article={article} showAuthor />
        </div>
        <p className="mt-7 inline-flex items-center gap-2 font-semibold text-primary underline decoration-accent/50 underline-offset-[4px] transition-colors group-hover:decoration-accent">
          Read the guide
          <span aria-hidden="true">→</span>
        </p>
      </div>

      <figure className="order-1 relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted lg:order-2 lg:aspect-[4/5]">
        {article.featuredImage ? (
          <BlogImage
            image={article.featuredImage}
            sizes="(min-width: 1024px) 40rem, 100vw"
            priority
            className="transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <ArticlePlate category={article.category.title} variant={plateVariantFor(article.category.slug)} />
        )}
      </figure>
    </article>
  )
}

function ArticleCard({ article, index }: { article: ArticleSummary; index: number }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/50">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {article.featuredImage ? (
          <BlogImage
            image={article.featuredImage}
            sizes="(min-width: 1024px) 28rem, (min-width: 640px) 45vw, 100vw"
            className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <ArticlePlate category={article.category.title} variant={plateVariantFor(article.category.slug)} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-sm text-accent">
            {String(index + 2).padStart(2, "0")}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {article.category.title}
          </span>
        </div>
        <h3 className="mt-4 font-serif text-[24px] leading-[1.2] sm:text-[26px]">
          <Link href={`/blog/${article.slug}`} className="group-hover:text-primary">
            <span className="absolute inset-0" aria-hidden="true" />
            {article.title}
          </Link>
        </h3>
        <p className="mt-4 flex-1 text-[15px] leading-[1.7] text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5">
          <span className="text-sm font-medium text-foreground">By {article.author.name}</span>
          <ArticleMeta article={article} />
        </div>
      </div>
    </article>
  )
}

/** Topic context derived from what is actually published — never invented. */
function CategoryRail({ articles }: { articles: ArticleSummary[] }) {
  const categories = [...new Map(articles.map((a) => [a.category.slug, a.category])).values()]
  if (categories.length === 0) return null

  return (
    <ul className="mt-8 flex flex-wrap gap-2" aria-label="Topics covered">
      {categories.map((category) => (
        <li
          key={category.slug}
          className="rounded-full border border-white/35 px-4 py-1.5 text-[13px] font-medium text-[#c4d4e2]"
        >
          {category.title}
        </li>
      ))}
    </ul>
  )
}

export default async function BlogIndexPage() {
  const { articles, state } = await listArticles()
  const [lead, ...rest] = articles
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE.url}/blog#webpage`,
    url: `${SITE.url}/blog`,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: [
      { "@type": "Thing", name: "First-time home buying" },
      { "@type": "Thing", name: "Homebuyer programs" },
      { "@type": "Place", name: "Garland, Texas" },
      { "@type": "Place", name: "Dallas–Fort Worth" },
    ],
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, position) => ({
        "@type": "ListItem",
        position: position + 1,
        url: `${SITE.url}/blog/${article.slug}`,
        name: article.title,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Navy masthead: the blog is a publishing surface for this brand, and it
          should look like it before a single article is read. */}
      <header className="border-b-4 border-brand-gold bg-primary">
        <Container className="py-14 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e6bd55]">
            Homebuyer guides
          </p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <h1 className="max-w-[16ch] font-serif text-[44px] leading-[1.04] text-white sm:text-[62px] lg:text-[72px]">
              Clear answers for the decisions ahead.
            </h1>
            <div>
              <p className="max-w-[46ch] text-[18px] leading-[1.65] text-[#dbe6ef]">
                Practical North Texas guidance to help you understand the process, prepare with
                confidence, and know what to ask next.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="/consultation" size="lg" className="!bg-brand-gold !text-[#16110a] hover:!bg-[#e6bd55]">
                  Book consultation
                </Button>
                <Button href="/calculators" variant="outline" size="lg" className="!border-white/70 !text-white hover:!bg-white/10">
                  Use the calculators
                </Button>
              </div>
            </div>
          </div>
          <CategoryRail articles={articles} />
        </Container>
      </header>

      {state.status === "unavailable" ? (
        <Container className="py-20">
          <div className="max-w-[62ch]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Temporarily unavailable
            </p>
            <h2 className="mt-3 font-serif text-[30px] leading-tight">
              The guide library isn&apos;t loading right now.
            </h2>
            <p className="mt-4 text-[17px] leading-[1.7] text-muted-foreground">
              Nothing has been removed — the content service is not responding. Please try again shortly. The planning
              tools and program pages are unaffected.
            </p>
          </div>
        </Container>
      ) : articles.length === 0 ? (
        <Container className="py-20">
          <p className="text-lg text-muted-foreground">
            No articles are published yet. Publish an article in the Studio and it will appear here.
          </p>
        </Container>
      ) : (
        <>
          <section className="py-14 md:py-20" aria-labelledby="lead-article-heading">
            <Container>
              <h2 id="lead-article-heading" className="sr-only">
                Latest guide
              </h2>
              {lead && <LeadArticle article={lead} />}
            </Container>
          </section>

          {rest.length > 0 && (
            <section
              className="border-t border-border py-14 md:py-20"
              aria-labelledby="more-guides-heading"
            >
              <Container>
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h2
                    id="more-guides-heading"
                    className="font-serif text-[30px] leading-tight sm:text-[36px]"
                  >
                    More guides
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {articles.length} {articles.length === 1 ? "guide" : "guides"} published
                  </p>
                </div>
                <div className="mt-10 grid gap-7 sm:grid-cols-2">
                  {rest.map((article, index) => (
                    <ArticleCard key={article._id} article={article} index={index} />
                  ))}
                </div>
              </Container>
            </section>
          )}
        </>
      )}

      <Band tone="alt" aria-labelledby="continue-planning-heading">
        <BandLead
          eyebrow="Continue planning"
          eyebrowIcon={Compass}
          title="Turn a useful answer into a clear next step"
          titleId="continue-planning-heading"
          lede="A guide is only worth reading if something changes afterwards. These are the four places a guide usually points."
        />
        <Features items={NEXT_STEP_LINKS} rule="gold" />
      </Band>

      <Band tone="teal" tight aria-labelledby="editorial-standard">
        <div className="dh-split dh-split-wide-copy">
          <div className="dh-split-copy">
            <p className="dh-kicker">
              <ShieldCheck aria-hidden="true" />
              How these guides are written
            </p>
            <h2 id="editorial-standard">Answers first, and nothing invented</h2>
          </div>
          <ul className="dh-checklist">
            <li>
              <BadgeCheck aria-hidden="true" />
              <span>
                <strong>You can see who wrote it and when</strong>
                Every guide carries an author and a reviewed date, so you know whether it is being kept current.
              </span>
            </li>
            <li>
              <BadgeCheck aria-hidden="true" />
              <span>
                <strong>No invented numbers</strong>
                No fabricated statistics, rankings, affiliations, testimonials, rebates or approval promises. If a
                figure is not verified, it is not published.
              </span>
            </li>
            <li>
              <BadgeCheck aria-hidden="true" />
              <span>
                <strong>Decisions stay where they belong</strong>
                Program rules stay with the program, lending stays with your lender, and each guide says so rather than
                guessing on their behalf.
              </span>
            </li>
          </ul>
        </div>
      </Band>

      <CtaBand
        eyebrow="After the reading"
        title="Bring the question the guide didn't answer"
        titleId="blog-cta-heading"
        body="Guides cover the general case. Your situation has specifics in it — that is exactly the conversation Debra is for."
        image={CLOSING_BAND_IMAGE}
      >
        <Link href="/consultation" className="dh-btn dh-btn-gold">
          Book a consultation
        </Link>
        <Link href="/start" className="dh-btn dh-btn-light-outline">
          Find your next step
        </Link>
      </CtaBand>

    </>
  )
}
