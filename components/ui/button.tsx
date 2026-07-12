import Link from "next/link"
import { cloneElement, isValidElement, type ComponentProps, type ReactElement, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "outline" | "ghost"
type Size = "sm" | "md" | "lg"

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60"

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
}

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonAsChild = CommonProps & {
  asChild: true
  children: ReactElement<{ className?: string }>
  href?: never
}

type ButtonAsLink = CommonProps & {
  href: string
  asChild?: false
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">

type ButtonAsButton = CommonProps & {
  href?: undefined
  asChild?: false
} & Omit<ComponentProps<"button">, "className" | "children">

export function Button(props: ButtonAsChild | ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children } = props
  const classes = cn(base, variants[variant], sizes[size], className)

  if (props.asChild) {
    if (!isValidElement(children)) {
      throw new Error("Button with asChild requires exactly one valid React element child.")
    }

    return cloneElement(children, {
      className: cn(classes, children.props.className),
    })
  }

  if (props.href) {
    const { variant: _v, size: _s, className: _c, children: _ch, href, asChild: _a, ...rest } = props
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    href: _h,
    asChild: _a,
    ...rest
  } = props as ButtonAsButton

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
