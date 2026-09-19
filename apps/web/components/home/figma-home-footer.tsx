import Link from "next/link"
import { FIGMA_FOOTER_LEGAL, FIGMA_FOOTER_LINKS } from "@/lib/figma-home"
import { SITE } from "@/lib/site"

function SocialGlyph({ label }: { label: "LinkedIn" | "Facebook" | "Instagram" }) {
  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.82-2.1 3.75-2.1 4.01 0 4.75 2.64 4.75 6.07V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z" />
      </svg>
    )
  }
  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.45 9.93v-7.02H7.9v-2.91h2.41V9.84c0-2.38 1.42-3.7 3.6-3.7 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.91h-2.22V22c4.79-.75 8.45-4.91 8.45-9.93z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2zM17.35 6.4a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15z" />
    </svg>
  )
}

export function FigmaHomeFooter() {
  return (
    <footer className="fh-footer" aria-labelledby="figma-footer-heading">
      <h2 id="figma-footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="fh-shell fh-footer-columns">
        <div>
          <p className="fh-footer-brand">{SITE.name}</p>
          <p className="fh-footer-blurb">
            Professional representation and trusted real-estate guidance across the Dallas–Fort Worth Metroplex.
            Approachable expertise.
          </p>
        </div>
        <nav aria-label="Quick links">
          <p className="fh-footer-label">Quick Links</p>
          <ul>
            {FIGMA_FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="fh-footer-label">Contact</p>
          <ul className="fh-footer-contact">
            <li>[Phone Placeholder]</li>
            <li>[Email Placeholder]</li>
            <li>[Address Placeholder — Dallas, TX]</li>
          </ul>
        </div>
        <div>
          <p className="fh-footer-label">Follow Us</p>
          <ul className="fh-social" aria-label="Social profiles are not published yet">
            <li>
              <span className="fh-social-well" aria-hidden="true">
                <SocialGlyph label="LinkedIn" />
              </span>
              <span className="sr-only">LinkedIn is not published yet</span>
            </li>
            <li>
              <span className="fh-social-well" aria-hidden="true">
                <SocialGlyph label="Facebook" />
              </span>
              <span className="sr-only">Facebook is not published yet</span>
            </li>
            <li>
              <span className="fh-social-well" aria-hidden="true">
                <SocialGlyph label="Instagram" />
              </span>
              <span className="sr-only">Instagram is not published yet</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="fh-shell fh-footer-bottom">
        <p>{"© "}2024 {SITE.name}. All rights reserved.</p>
        <nav aria-label="Legal">
          <ul>
            {FIGMA_FOOTER_LEGAL.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
