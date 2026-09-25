"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { FIGMA_HOME_CTA, FIGMA_HOME_NAV } from "@/lib/figma-home"

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
}

export function FigmaHomeHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 900px)")
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setOpen(false)
    }
    closeOnDesktop()
    desktopQuery.addEventListener("change", closeOnDesktop)
    return () => desktopQuery.removeEventListener("change", closeOnDesktop)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="fh-header">
      <div className="fh-shell fh-header-inner">
        <Link href="/" className="fh-brand" aria-label="D'Affordable Homes — Home">
          {/* Current approved brand asset (640×427). Rendered at a fixed height so the
              aspect ratio is preserved; `sizes` keeps next/image from serving a blurry
              downscale on high-DPI screens. */}
          <Image
            src="/images/daffordable-homes-official-logo.png"
            alt="D'Affordable Homes — Affordable, Accessible, Achievable"
            width={640}
            height={427}
            sizes="(max-width: 760px) 90px, 111px"
            quality={90}
            className="fh-logo"
            priority
          />
        </Link>

        <nav aria-label="Primary" className="fh-desktop-nav">
          <ul>
            {FIGMA_HOME_NAV.map((item) => {
              const active = isActivePath(pathname, item.href)
              return (
                <li key={item.label} className={item.condensed ? undefined : "fh-nav-wide-only"}>
                  <Link href={item.href} aria-current={active ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <Link href={FIGMA_HOME_CTA.searchHomes.href} className="fh-btn fh-btn-navy fh-header-cta">
          {FIGMA_HOME_CTA.searchHomes.label}
        </Link>

        <button
          type="button"
          className="fh-menu-toggle"
          aria-expanded={open}
          aria-controls="figma-home-mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {open ? (
        <div id="figma-home-mobile-menu" className="fh-mobile-menu">
          <nav aria-label="Mobile">
            <ul>
              {FIGMA_HOME_NAV.map((item) => {
                const active = isActivePath(pathname, item.href)
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Link
              href={FIGMA_HOME_CTA.searchHomes.href}
              className="fh-btn fh-btn-navy fh-btn-block"
              onClick={() => setOpen(false)}
            >
              {FIGMA_HOME_CTA.searchHomes.label}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
