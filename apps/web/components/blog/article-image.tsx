import Image from "next/image"
import type { ArticleImage as ArticleImageValue } from "@/lib/blog/types"
import { cn } from "@/lib/utils"

/**
 * Renders an article image from either source the CMS supports: a Content Lake
 * asset URL or an approved repository asset path. Alternative text is required
 * by the schema, so it is always present here.
 */
export function ArticleImage({
  image,
  sizes,
  className,
  priority = false,
}: {
  image: ArticleImageValue
  sizes: string
  className?: string
  priority?: boolean
}) {
  const src = image.url ?? image.src
  if (!src) return null

  return (
    <Image
      src={src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      style={image.focalPoint ? { objectPosition: image.focalPoint } : undefined}
    />
  )
}

export function ArticleFigure({
  image,
  sizes,
  aspect = "aspect-[16/9]",
  className,
  priority = false,
}: {
  image: ArticleImageValue
  sizes: string
  aspect?: string
  className?: string
  priority?: boolean
}) {
  const src = image.url ?? image.src
  if (!src) return null

  return (
    <figure className={className}>
      <div className={cn("relative overflow-hidden rounded-xl border border-border bg-muted", aspect)}>
        <ArticleImage image={image} sizes={sizes} priority={priority} />
      </div>
      {image.caption || image.credit ? (
        <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
          {image.caption}
          {image.credit ? <span className="ml-2 text-xs uppercase tracking-wide">{image.credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
