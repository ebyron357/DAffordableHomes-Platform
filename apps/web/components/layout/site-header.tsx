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

// Prior approved logo asset retained in the repository: dah-logo_ff042b7b.png.
function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1101px)")
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setOpen(false)
    }
    closeOnDesktop()
    desktopQuery.addEventListener("change", closeOnDesktop)
    return () => desktopQuery.removeEventListener("change", closeOnDesktop)
  }, [])

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
    <header className="site-header">
      <Container>
        <div className="site-header-inner">
          <Link href="/" aria-label="D'Affordable Homes — Home" className="brand-lockup">
            <Image src="/images/daffordable-homes-official-logo.png" alt="D'Affordable Homes — Affordable, Accessible, Achievable" width={640} height={427} className="brand-logo" priority />
            <span className="brand-context"><strong>Debra Allen</strong><span>REALTOR® · Garland + DFW</span></span>
          </Link>

          <nav aria-label="Primary" className="desktop-primary-nav">
            <ul>
              {PRIMARY_NAV.map((item) => {
                const active = isActivePath(pathname, item.href)
                return <li key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} className={cn(active && "active")}>{item.label}</Link></li>
              })}
            </ul>
          </nav>

          <div className="header-actions"><Button href="/consultation" size="sm">Talk with Debra</Button></div>

          <button ref={toggleRef} type="button" className="mobile-menu-toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      {open && <div id="mobile-menu" className="mobile-menu"><Container><nav aria-label="Mobile"><p className="mobile-menu-intro">Debra Allen, REALTOR®<br /><span>Garland + Dallas–Fort Worth</span></p><ul>{PRIMARY_NAV.map((item) => { const active = isActivePath(pathname, item.href); return <li key={item.href}><Link href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)} className={cn(active && "active")}>{item.label}</Link></li> })}</ul><Button href="/consultation" className="w-full" onClick={() => setOpen(false)}>Talk with Debra</Button></nav></Container></div>}
    </header>
  )
}
