---
status: implemented
state: high-level
reviewedAtStep: ""
---

[← PLAN](../_plan_001.md)

## Description
Makes the comments area look native to the site from the outside — container spacing and borders, font and theme handoff through `custom_properties` — within the hard limit that the widget itself runs in a cross-origin iframe. This is the last step, done only once everything else is locked.

> [!note] Skipped
> Moved out of phase 001 by user decision. Kept as recorded future work — the "Deeper restyling" section below is the backlog material for whenever this is picked up.

## High-Level

### Intended outcome
- The comments block reads as part of the article: same horizontal rhythm, a deliberate separation from the last paragraph, no box-in-box look.
- The widget's font matches the site's body font; light and dark both look intentional rather than inherited.
- No layout shift when the frame appears, and the loading/error states are styled consistently with the site.
- A recorded verdict on whether container-level polish is enough, or whether an instance-level route is warranted later.

### Local invariants
- Our CSS stops at the container. Nothing inside the frame is reachable.
- `custom_properties` is applied at instance creation only — it cannot be changed on a live widget.
- Plugin styles live in the component's `css` string so Quartz minifies them into `@layer quartz-base`; they must not fight the site's existing layer order.
- Every change here is visual only — no behavioural code.

### Should NOT be done in this step
- Forking the Remark42 frontend via `REMARK_WEB_ROOT`.
- Injecting CSS at the Caddy layer.
- Redesigning Remark42's own UI.
- Changing fonts anywhere else on the site.

## Deeper restyling (recorded, not this phase)

Remark42 documents **no** server-side theme, custom-CSS or branding API: `theme`, `locale` and `no_footer` are client-side only, and no server default theme exists. Only three routes reach further, all with a real cost:

- `REMARK_WEB_ROOT` — same-named files in that directory win over the embedded frontend. It replaces the *whole* frontend, so it must be re-synced on every upgrade or users silently get a stale widget.
- `SIMPLE_VIEW` — server-side, but only minimizes the UI; it is not a styling hook.
- Caddy-layer HTML/CSS injection into the served frontend — undocumented, and breaks silently on upgrade.

## Discussion & Reflections

1. **Where the font comes from.**
   - (a) Hardcode the site's body font family in `custom_properties` — simple, duplicates the value.
   - (b) Publish the font family as a CSS custom property and read it at runtime — one value, but depends on that variable existing.
   - (c) Leave Remark42's default — safest, visibly foreign.
   - **Recommend (b)**, falling back to (a).

2. **Container treatment.**
   - (a) Nothing — the frame starts immediately.
   - (b) A rule and spacing matching article structure.
   - (c) A card with border and radius — visible, risks looking bolted on.
   - **Recommend (b)**, evaluating (c) visually before rejecting it.

3. **Whether to go past the container.**
   - (a) Stop here and record the verdict.
   - (b) Fork the frontend via `REMARK_WEB_ROOT` — total control, permanent re-sync burden.
   - (c) Inject CSS at Caddy — hacky and invisible to future readers.
   - **Recommend (a)** now; (b) only if (a) is demonstrably insufficient.

4. **Dark/light verification.** With both themes live and a toggle on the site, a theme edge case is the most likely thing to slip through.
   - (a) Manual check of both themes after a toggle.
   - (b) Automated visual snapshot — heavy for one widget.
   - (c) Skip — the theme code is trivial.
   - **Recommend (a)**, and treat "toggle mid-session" as the specific case to try.

_Reflection:_ (optional — compact notes from the user)
