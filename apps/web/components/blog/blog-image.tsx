import Image from "next/image"

import { BrandMotif, type BrandMotifVariant } from "@/components/page/brand-motif"
import { cn } from "@/lib/utils"
import type { ArticleImage } from "@/lib/blog/types"

/**
 * Renders an article image from either source — a Sanity CDN asset or an
 * approved repository asset under `/public` — with the same crop, sizing and
 * accessibility behaviour.
 *
 * `alt` is always the editor-supplied description; the schema makes it
 * required, so there is no decorative fallback to guess at here.
 */
export function BlogImage({
  image,
  sizes,
  className,
  imageClassName,
  priority = false,
}: {
  image: ArticleImage
  sizes: string
  className?: string
  imageClassName?: string
  priority?: boolean
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      style={image.focalPoint ? { objectPosition: image.focalPoint } : undefined}
      className={cn("object-cover", className, imageClassName)}
    />
  )
}

/**
 * Figure wrapper with a fixed aspect ratio. Images never stretch: the frame
 * defines the ratio and the image covers it from its focal point.
 */
export function BlogFigure({
  image,
  sizes,
  ratio = "aspect-[16/9]",
  className,
  priority = false,
  showCaption = true,
}: {
  image: ArticleImage
  sizes: string
  ratio?: string
  className?: string
  priority?: boolean
  showCaption?: boolean
}) {
  const caption = showCaption ? image.caption : undefined
  return (
    <figure className={className}>
      <div className={cn("relative overflow-hidden rounded-lg border border-border bg-muted", ratio)}>
        <BlogImage image={image} sizes={sizes} priority={priority} />
      </div>
      {(caption || image.credit) && (
        <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
          {caption}
          {image.credit && (
            <span className="block text-xs uppercase tracking-[0.12em] text-muted-foreground/80">
              {image.credit}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * What a card or masthead shows when an article has no `featuredImage`.
 *
 * The register (`docs/05-content/IMAGE_ASSET_REGISTER.md`) allows four
 * photographs, three of which are Debra. Using her portrait as the picture for
 * a guide about Garland, or about the Homes for Heroes programme, said the
 * article was about her rather than about the subject — so those two articles
 * now carry no `featuredImage` at all, and land here.
 *
 * This is the same answer the interior mastheads already give when no licensed
 * photograph exists for a slot: brand field, architectural linework, and the
 * article's own category in type. It claims nothing, it is not a labelled empty
 * well, and it disappears the moment an editor sets `featuredImage` in Sanity.
 *
 * The motif is `aria-hidden`: it is ornament, and nothing it draws is the sole
 * carrier of any meaning. The category label is real text, because on the
 * article masthead it is the only place the category is stated — the eyebrow
 * there is the article's own, not the category's. On a card it repeats the
 * category the card already shows, which is a short duplicate rather than a
 * barrier.
 */
export function ArticlePlate({
  category,
  variant = "roofline",
  className,
}: {
  category?: string
  variant?: BrandMotifVariant
  className?: string
}) {
  return (
    <div className={cn("dh-article-plate", className)}>
      <BrandMotif variant={variant} className="dh-motif dh-article-plate-art" />
      {category && <span className="dh-article-plate-label">{category}</span>}
    </div>
  )
}

/**
 * Which linework fits an article, decided from CMS data rather than a slug.
 *
 * Keyed on the category an editor already chose, so a new article picks up a
 * sensible motif without a code change, and an unknown category falls back to
 * the North Texas roofline.
 */
export function plateVariantFor(categorySlug: string | undefined): BrandMotifVariant {
  switch (categorySlug) {
    case "homebuyer-programs":
      return "keys"
    default:
      // The North Texas roofline. It fills the tall 4:5 masthead frame where
      // the single-stroke route curve left most of the plate empty.
      return "roofline"
  }
}
