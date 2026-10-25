---
status: waiting
state: high-level
reviewedAtStep: "01"
---

[← PLAN](../_plan_001.md)

## Description
Rewrites the build-time half of the plugin as a small Preact component that renders one comments container for opted-in notes and supplies the browser bootstrap as a string. TypeScript/TSX source is compiled by the explicit package build; Quartz imports the committed JavaScript output.

## High-Level

### Intended outcome
- For an opted-in content page: exactly one container element carrying the thread URL. For every other page: nothing at all — not an empty wrapper.
- A clear split between what is fixed per site (host, site id, footer, properties — baked into the shared script at build time) and what varies per page (the thread URL — carried in the DOM). This split is what makes one shared script correct site-wide.
- The container's markup is a documented contract: element type, attributes, and what the runtime may assume about it.
- The package entry and component exports resolve to compiled `dist/` JavaScript. JSX/TSX is supported through the package build; native Node TypeScript loading is not used.

### Local invariants
- No `displayName` — the community type does not have it — and no `head`/`content` usage.
- Render is pure: no `window`, no timers, no side effects, no reads outside the passed props.
- All markup uses Preact VNodes, preferably JSX/TSX following the documented component examples; `h()` is also valid. No string concatenation of HTML.
- The runtime must not depend on markup details that this step does not promise.

### Should NOT be done in this step
- Any browser logic: gating, loading, theme, errors (step 06).
- Typography, spacing or visual polish (step 08).
- Option parsing or validation (step 03).
- Identity rules (step 04).

## Discussion & Reflections

1. **Container identity.** The captured module looks up `document.getElementById("remark42")` and reuses an existing iframe it finds there.
   - (a) Give the container `id="remark42"` — works with the module's own auto-bootstrap and iframe reuse, but hardcodes a third-party id into our markup.
   - (b) Use our own attribute and only the SPA API — clean, provided the module's import-time auto-run is a no-op without `#remark42`.
   - (c) Both id and attribute — belt and braces, slight duplication.
   - **Recommend (b)** once the auto-run is confirmed harmless, otherwise (a).

2. **What travels in the DOM.**
   - (a) Thread URL only; all site config baked into the shared script — smallest HTML, but changing site config means touching the component.
   - (b) Full config in data attributes — flexible, duplicates config on every page.
   - (c) One JSON blob attribute — flexible, unreadable in DevTools.
   - **Recommend (a).**

3. **Placeholder markup inside the container.**
   - (a) Nothing — the frame appears when it appears.
   - (b) "Loading comments…" text — honest, but flashes and shifts layout.
   - (c) A fixed-height skeleton — no shift, but the height is a guess.
   - **Recommend (a)**, adding a `min-height` only if step 08 shows a real shift.

4. **Does this step ship any CSS at all?**
   - (a) None — everything in step 08.
   - (b) A hard minimum (separation from the last paragraph) so the widget is never glued to the text.
   - (c) The full look now.
   - **Recommend (b)**, expanded in step 08.

_Reflection:_ (optional — compact notes from the user)
