"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { PRIMARY_NAV } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <Container>
        <div className="flex min-h-18 items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="flex flex-col rounded-sm text-[15px] font-semibold leading-none tracking-tight text-foreground sm:text-lg"
          >
            <span>D&apos;AFFORDABLE HOMES</span>
            <span className="mt-1 text-[11px] font-normal tracking-normal text-muted-foreground">Homeownership guidance</span>
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {PRIMARY_NAV.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-sm px-2.5 py-2 text-[13px] font-medium transition-colors hover:bg-muted",
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

          <div className="hidden items-center gap-2 xl:flex">
            <Button href="/book" size="sm">
              Schedule a Consultation
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-primary p-2 text-primary xl:hidden"
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
        <div id="mobile-menu" className="border-t border-border bg-background xl:hidden">
          <Container>
            <nav aria-label="Mobile" className="py-4">
              <ul className="flex flex-col gap-1">
                {PRIMARY_NAV.map((item) => {
                  const active = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
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
                  Schedule a Homebuyer Consultation
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
