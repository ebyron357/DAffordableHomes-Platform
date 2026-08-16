import Image from "next/image"
import Link from "next/link"

import { Container } from "@/components/ui/container"
import { getArticleSummaries } from "@/lib/cms/articles"

/**
 * Surfaces the newest CMS-published field guides on the homepage so editorial
 * work is visible from the front door. Renders nothing when nothing is
 * published, rather than showing an empty shell.
 */
export async function LatestGuides() {
  const articles = (await getArticleSummaries()).slice(0, 3)
  if (articles.length === 0) return null

  return (
    <section className="editorial-section" aria-labelledby="latest-guides-heading">
      <Container>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Field guides</p>
            <h2 id="latest-guides-heading">Answers before decisions.</h2>
          </div>
          <p className="section-intro">
            Long-form North Texas guidance with named authorship, review dates, and sources you can check.
          </p>
        </div>

        <ul className="guide-grid">
          {articles.map((article) => (
            <li key={article._id}>
              <Link href={`/blog/${article.slug}`} className="guide-card">
                <span className="guide-thumb">
                  <Image
                    src={article.featuredImage.src}
                    alt={article.featuredImage.alt}
                    fill
                    sizes="(min-width: 901px) 30vw, (min-width: 761px) 45vw, 100vw"
                    className="object-cover"
                    style={
                      article.featuredImage.focalPoint ? { objectPosition: article.featuredImage.focalPoint } : undefined
                    }
                  />
                </span>
                <span className="pathway-kicker">{article.eyebrow ?? article.category.title}</span>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <span className="guide-meta">{article.readingTimeMinutes} minute read</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="guide-footer">
          <Link className="text-link" href="/blog">
            Read all field guides →
          </Link>
        </p>
      </Container>
    </section>
  )
}
