# Scroll Craft integration

Source: https://github.com/nateherkai/scroll-craft at
75d81f74e83692add18cd7a8a8e078b8a887a579 (v0.3.1). MIT, Nate Herk;
full notice in SCROLL_CRAFT_LICENSE.txt. Adapts the vendorable engine's
one-shot IntersectionObserver flow-entry pattern to a lifecycle-managed React group.

Plan and scope: trace decorative brand-colored rules on existing public content.
Keep text, links, forms and semantic structure available immediately. Use scoped
CSS only; no global upstream resets, typography/colors, video loop, scroll
interception, new dependencies, analytics or collected data. Existing business
logic, operational pages and production configuration are outside this change.

Rules initialize without a reverse transition, animate once on entry and then
unobserve. Live reduced motion completes rules immediately and stops observing;
turning motion back on does not replay. No-JS and missing-observer fallbacks are
static. React unmount disconnects observers and preference listeners.

Rollback: revert this integration commit; no schema or configuration migration.
Verification and deployment evidence are recorded below before release.

## Verification — 2026-10-19
- Frozen pnpm11.9/Node24 install PASS; typecheck/lint PASS; 173 tests PASS.
- Local build BLOCKED by Google Fonts network fetch (Inter/Source Serif4),
  unchanged from site configuration; hosted build required before merge.
- Local dev fallback-font browser: 8 PASS, 0 FAIL, 0 SKIP: desktop/mobile,
  normal/reduced/no observer/no JS, collapsed-to-entered rule, live preference,
  keyboard navigation/return, no overflow or uncaught errors. Screenshots inspected.
- Existing CI retains full route, quiz, contrast and portrait gates plus new
  scripts/scroll-craft-qa.mjs. No business-fact/domain/provider gate claimed closed.
