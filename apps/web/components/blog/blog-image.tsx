import Image from "next/image"

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
