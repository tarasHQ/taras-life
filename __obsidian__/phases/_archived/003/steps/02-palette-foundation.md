---
status: implemented
state: condensed
---

[← PLAN](../_plan_003.md)

## Description
Lay the **CSS foundation of the three-mode system**: warm brown/golden starting ramp for light and dark, plus a hand-written third `:root[saved-theme="dark-low"]` block — landed inert-first, before any JS can set the attribute (step 03 owns the toggle). Ramp values are starting points from Capture.md + pond-insights, refined by the browser-iteration loop across steps 02–05; the mechanism (three coherent blocks, explicit derivation, pinned OG contract) is the deliverable.

## Implementation Summary
- **Palette + dark-low block** (`quartz/styles/theme.css`) — approved warm brown/golden starting values in the light and dark blocks; hand-written `:root[saved-theme="dark-low"]` as a minimal derivation over dark: overrides exactly the five ramp vars (`--light` lifted background + 4 text rungs softened toward midtones), chromatic four shared with dark verbatim; block comment enumerates the overridden set and carries the OG-contract note (parser matches only `:root` / `:root[saved-theme="dark"]`).
- **Syntax selectors** (`quartz/styles/syntax.css`) — dark Shiki rules follow both dark variants via the explicit two-selector list `[saved-theme="dark"], [saved-theme="dark-low"]` (no prefix trick).
- **OG contract pinned** (`quartz/util/theme.test.ts`) — fixture extended with a realistic dark-low block whose OG-contract comment doubles as a comment-decoy; new test pins exactly two palettes (`lightMode`/`darkMode` keys) and that dark values come from the dark block, never dark-low; real-file SSOT test pins moved to the new hexes + same two-palette key assertion.
- **Verification** — `npm run check` and `npm test` green; og-image clarified: the emitter produces **one image per page** via its single `colorScheme` option (default `lightMode`) — "two variants" was a planning-phase misreading; the 2-palette contract lives in the parser's data shape, which is what the tests pin. No regression.
- **Iteration status** — values landed as starting points; browser judging continues on the (now-landed) step 01 test pages across steps 02–05. Future value edits must move the pinned hexes in `theme.test.ts` with them.
