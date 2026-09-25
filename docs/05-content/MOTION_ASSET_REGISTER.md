# Motion asset register

Canonical register for approved public-site motion. The same rules as the image
asset register apply, with three additions specific to moving imagery:

1. Motion is decorative. Every motion surface keeps an approved still as its
   poster, and that still carries the accessible name. Nothing that a visitor
   must read or act on may exist only inside a clip.
2. Motion never carries audio, controls, or baked-in text, and never autoplays
   for a visitor who asks for reduced motion.
3. Generatively produced motion is registered as generative, is never presented
   as a client, a testimonial, a listing, or a real transaction, and is never
   applied to Debra Allen's own photography.

## Delivery contract

Encodes are served same-origin from `apps/web/public/video`. The site
Content-Security-Policy declares no `media-src`, so media falls back to
`default-src 'self'`; a remote CDN URL would be blocked and must not be used.

`apps/web/lib/media/ambient-motion.ts` resolves each surface at build time and
only emits sources whose files are present, so the poster still renders wherever
an encode is absent.

| Surface | Expected files | Frame | Poster still | Status |
| --- | --- | --- | --- | --- |
| Homepage hero exterior | `video/hero-north-texas-exterior-1280.webm`, `video/hero-north-texas-exterior-1280.mp4`, `video/hero-north-texas-exterior-720.webm`, `video/hero-north-texas-exterior-720.mp4` | 16:9, silent, no audio track, 5–8s seamless loop, `object-fit: cover; object-position: 50% 50%` | `images/hero-north-texas-exterior.webp` (`-mobile.webp` at widths ≤1600px) | Not produced. No encode is approved, and none may be committed without its own row here. |
| ~~Homepage, "Local guidance should feel like local knowledge."~~ | ~~`video/home-neighborhood-*`~~ | — | ~~`images/black-family-home-pexels-7114188.webp`~~ | **Superseded.** The section this surface belonged to was replaced by the Figma homepage composition and no longer renders. |

## Required register entry before any clip is committed

A clip may not be committed until this table records its source model and
prompt, its license or rights basis, whether it is generative, its alt/poster
pairing, and the named approval. An unregistered clip is treated as unapproved
content and must not ship.
