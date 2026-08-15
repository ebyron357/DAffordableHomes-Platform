"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { PRIMARY_NAV } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  /** Escape closes the menu and returns focus to the control that opened it. */
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <Container>
        <div className="flex min-h-[72px] items-center justify-between gap-5 py-3">
          <Link
            href="/"
            aria-label="D'Affordable Homes — Home"
            className="flex items-center gap-3 rounded text-[15px] font-semibold leading-tight tracking-tight text-foreground sm:text-lg"
          >
            <Image
              src="/manus-storage/dah-logo_ff042b7b.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="leading-none">
              <span className="block font-semibold">D&apos;Affordable</span>
              <span className="mt-0.5 block text-xs font-normal tracking-normal text-muted-foreground">Homes</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {PRIMARY_NAV.map((item) => {
                const active = isActivePath(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative rounded-sm px-3 py-2 text-[13.5px] font-medium transition-colors hover:bg-muted hover:text-accent",
                        "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors",
                        active ? "text-accent after:bg-accent" : "text-foreground/80 after:bg-transparent",
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
            <Button href="/consultation" size="sm">Book Consultation</Button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-primary p-2 text-primary transition-colors hover:bg-muted lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-background lg:hidden">
          <Container>
            <nav aria-label="Mobile" className="py-4">
              <ul className="flex flex-col gap-1">
                {PRIMARY_NAV.map((item) => {
                  const active = isActivePath(pathname, item.href)
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
                        {item.description ? <span className="text-sm text-muted-foreground">{item.description}</span> : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-4">
                <Button href="/consultation" className="w-full" onClick={() => setOpen(false)}>
                  Book Consultation
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
