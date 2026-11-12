---
status: implemented
state: condensed
---

[← PLAN](../_plan_003.md)

## Description
Landed the accent layers on top of step 04's settled typography: the accent-tier heading variables in `theme.css` (full h1–h6 color ladder across all three mode blocks), the explicit link design language rework in `base.css` (pill death, external solid / internal dashed / broken dashed+opacity / tags chip), and a single coherent `::selection` rule. Both design decisions were made explicitly with the user before any values were picked; the heading ladder values are deliberately temporary plumbing for the user's own eyeball pass.

## Implementation Summary
- **Link language decided first, one pass (user)**: external = solid thin underline; internal = dashed thin underline; broken = dashed + 0.5 opacity (wiki "doesn't exist yet" marker — texture alone rejected as ambiguous); tag links = no underline, `#` prefix kept. Pill death confirmed consciously against its alternative; the pill (background + padding + radius) and its `:has(> img)` exception removed together. Underline: 1.5px, offset 0.15em, muted `--gray`-mix color; hover flips text to `--tertiary` and underline to `currentColor`.
- **Heading accents (user decision: full ladder, values temporary)**: `--heading-1..6` variables added to all three mode blocks in `theme.css` — light got warm-only starting hues, dark got lighter/saturated versions, dark-low shares dark's ladder verbatim (chromatic-sharing rule extended to the ladder, block comment updated). Per-level `color: var(--heading-N)` applied inside the baked scale table in `base.css`; shared heading rule keeps `--dark` as fallback; heading anchor links switched to `color: inherit` so they follow their heading's accent.
- **Selection**: single `::selection` rule — `--secondary` at 35% translucent over the mode's own background, `color: inherit` — replacing the old `--tertiary`-60%-plus-white-alpha mix that washed out on dark-low. One rule composes correctly in all three modes by construction.
- **Open loop (user's eyeball pass)**: heading ladder values are starting plumbing, not settled identity — user tunes final colors himself on the live pages; link underline thickness/offset and the 35% selection mix are judged the same way. Anchor-in-heading color behavior (`inherit`) is a deliberate choice worth one glance.
