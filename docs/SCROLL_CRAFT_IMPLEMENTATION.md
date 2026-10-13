# Scroll Craft implementation

Development snapshot: 2026-10-13. Implemented and locally verified; production deployment is not claimed.

## Approved scope

Homepage buyer/seller pathways, introductory guidance and existing decorative key/roofline artwork. The /start next-step scroll action now also respects reduced motion.

The owner approved appropriate Scroll Craft website interactions on 2026-10-13. This document records this implementation and introduces no new governance gate.

## Source and integration decision

Reviewed `nateherkai/scroll-craft` at commit `75d81f74e83692add18cd7a8a8e078b8a887a579`: README, skill instructions, device references, and engine/CSS behavior. Source: https://github.com/nateherkai/scroll-craft/tree/75d81f74e83692add18cd7a8a8e078b8a887a579

This site adopts its flow-reveal and scoped scroll-progress patterns through a small React controller. It does not load the upstream engine or its global brand reset: those include cinematic/video/pinning behavior this existing service website does not need. The controller uses `data-sc-in`, optional `data-sc-track` and `--sc-p` on the existing semantic markup. No animation package, generated media, fonts, tracking or paid service was added.

## Behavior and accessibility

- Content is server rendered and visible with JavaScript disabled or unsupported animation APIs.
- Entrance motion runs once per target: at most 16px over 520ms, starting at readable opacity.
- The operating system reduced-motion preference disables entrance/depth motion and smooth anchor scrolling. Changes to that preference during the session cancel active animations.
- Keyboard focus settles any active entrance animation immediately.
- Depth is desktop-only, scoped to explicit decorative targets; no document height or reading order changes.
- Native wheel/touch scrolling remains intact. No pinned sections or scroll interception.
- Observers, media listeners, animations and pending animation frames are cleaned up on unmount.
- Frames are requested only following scroll/resize/intersection events, never by a perpetual rendering loop.

## Verification

- TypeScript, lint, production build and 173 static test cases: pass locally.
- Browser scenarios: 1440x900 desktop, 390x844 mobile, reduced-motion, and JavaScript disabled: pass.
- Actual scroll entrances observed: 7 desktop / 7 mobile.
- No hidden enhanced content, horizontal overflow, uncaught page errors, or measured layout shifts in those local scenarios.
- Live reduced-motion switch cancels active animation; keyboard focus reaches content.
- Desktop/mobile screenshots visually inspected.

Local verification evidence is retained in the portfolio execution evidence package, `scroll-realestate/daffordable-browser-qa.json`, build/test logs and screenshots. These are Chromium viewport simulations, not physical-device results. Local CLS is not production Core Web Vitals, and no field performance claim is made.

## Rollback and review

Revert the feature commit to restore the previous presentation. Forms, provider configuration, business copy, identity, licensed imagery and deployment policy are unchanged. Review the pull request and its preview before an authorized merge/deployment.
