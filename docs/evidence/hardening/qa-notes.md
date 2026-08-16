# PR #23 Hardening QA

At 375px and 390px, the persistent header CTA is hidden at the narrowest breakpoint, leaving the official logo and 44px menu toggle comfortably reachable. The hero buttons remain stacked and readable, the logo maintains aspect ratio, and no horizontal overflow or broken portrait crop is visible. This is the intended accessibility tradeoff for narrow widths and text enlargement.

At 768px, the prior tablet fix remains intact. The mobile navigation header is balanced, the Debra context remains visible, the hero copy is no longer unnaturally narrow, CTA labels stay on one line, and the portrait/caption crop is intact.

At 1440px, the approved desktop composition remains intact: horizontal navigation, official logo, Debra context, hero headline, portrait, and CTA hierarchy remain balanced. At a 320px narrow-viewport proxy for 200% text enlargement, the header hides the persistent CTA and keeps the official logo plus menu toggle fully visible; the hero copy and CTAs remain readable with no horizontal clipping. The development-only Next issue indicator is visible in local captures but is not production UI.
