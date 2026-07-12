"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { PRIMARY_NAV } from "@/lib/navigation"
import { SITE } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            href="/"
            className="rounded-md font-serif text-lg font-semibold leading-none tracking-tight text-foreground sm:text-xl"
          >
            <span className="text-primary">D&apos;Affordable</span> Homes
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {PRIMARY_NAV.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                        active ? "text-primary" : "text-foreground/80",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button href="/book" size="sm">
              Book a consultation
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background lg:hidden">
          <Container>
            <nav aria-label="Mobile" className="py-4">
              <ul className="flex flex-col gap-1">
                {[{ label: "Home", href: "/" }, ...PRIMARY_NAV].map((item) => {
                  const active = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex flex-col rounded-lg px-3 py-3 transition-colors hover:bg-muted",
                          active && "bg-muted",
                        )}
                      >
                        <span className="font-medium text-foreground">{item.label}</span>
                        {"description" in item && item.description ? (
                          <span className="text-sm text-muted-foreground">{item.description}</span>
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-4">
                <Button href="/book" className="w-full">
                  Book a consultation
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
