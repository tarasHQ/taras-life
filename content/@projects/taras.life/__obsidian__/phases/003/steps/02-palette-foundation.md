---
publish: true
created: 2026-11-05T11:58:15.614Z
modified: 2026-11-05T11:58:27.878Z
published: 2026-11-05T11:58:27.878Z
status: ready
state: full
---

[← PLAN](../_plan_003.md)

## Description

Lay the **CSS foundation of the three-mode system**: ramp starting values for light and dark, and a hand-written third `:root[saved-theme="dark-low"]` block — landed **before** any JS can set the attribute.

Sequencing rationale: this step deliberately precedes the theme system (step 03) so the dark-low mode is styled from its first breath. A toggle emitting `"dark-low"` without this block would match no `:root[saved-theme=…]` selector and silently fall back to light-mode values. Landed inert-first, there is no broken intermediate state.

This is a **value step as much as a mechanism step**: ramp values are _starting points_ from Capture.md + pond-insights, then refined by the browser-iteration loop (locked working style) across steps 02–05. The mechanism (three coherent blocks, explicit derivation) is the deliverable; exact hex values stay tunable.

## High-Level

### List of related files or folders

- `quartz/styles/theme.css` — **SSOT of palette**; gains the third `:root[saved-theme="dark-low"]` block and carries the starting ramp values for all three modes.
- `quartz/styles/syntax.css` — dark Shiki rules get the explicit two-selector list `[saved-theme="dark"], [saved-theme="dark-low"]`.
- `quartz/util/theme.ts` — read-only context: the og-image parser whose 2-palette contract stays untouched (exact regexes `:root\s*\{` / `:root\[saved-theme="dark"\]` cannot match a third block — validated).
- `quartz/util/theme.test.ts` — extended: dark-low block added to the inline fixture + two-palette assertion.
- Value sources (Obsidian): `__obsidian__/ideas/pond-insights.md` (type-scale reference + ramp starting points), `__obsidian__/ideas/Capture.md` (palette direction: brown/golden/dark).
- Judging surface: the step 01 test pages + real pages (journal entry, long note) via the local serve loop.

### Intended outcome

- `theme.css` contains three coherent mode blocks: `:root` (light), `:root[saved-theme="dark"]`, `:root[saved-theme="dark-low"]`.
- Dark-low is a **minimal derivation over dark** (locked verdict 8): only the text ramp overridden + the lifted `--light` background; chromatic values shared with dark — not re-picked independently.
- Syntax highlighting follows both dark variants (explicit selector list).
- OG-image 2-palette contract pinned by test — future palette edits (this phase does many) can't silently break the og-image output.

### Local invariants

- **Hand-written block, explicit list** (locked HOW verdict 5): no CSS `color-mix()` derivation, no build-time generation. The block's comment states **exactly which variables are intentionally overridden** (including `--light` — the lifted background is part of the derivation even though it's not a "text" color).
- **No prefix trick** in `syntax.css` — explicit `[saved-theme="dark"], [saved-theme="dark-low"]` (readability over `[saved-theme^="dark"]`, which would also catch hypothetical future modes).
- **OG-contract comment** at the third block: extra `saved-theme` blocks are intentionally outside the og-image 2-palette contract.
- `--light`-is-background naming **stays** (token rename rejected in refinement pass) — ramp values get hand-tweaked without renaming slots.
- All 9 existing slots keep their keys; dark-low overrides a _subset_ — no new slots invented at this stage (if living with dark-low reveals a need for new slots, that's a loop-loop discovery, added consciously).
- DEV\_RULES explicitly do not apply to `quartz/` code, but the test extension still follows the pragmatic-testing rule: it protects a real non-trivial invariant (OG 2-palette), not implementation trivia.

### Should NOT be done in this step

- No TS/JS work: no toggle, no inline init, no config changes, no remark42 — that's step 03's single lockstep surface.
- No accent-tier variables (step 05 owns those in `theme.css`).
- No background gradient/grain values (step 06 experiments on the step 01 sandbox page).
- No `color-scheme` declarations yet — the darkmode dep still owns them until step 03 re-owns them.
- No final ramp verdicts — values are starting points; the loop decides.

---

## Tasks

- [ ] **Read current `theme.css`** and record the existing light/dark 9-slot values as the baseline (for the git history and as dark-low's derivation base).
- [ ] **Draft light + dark ramp starting values** from Capture.md direction (brown/golden/dark) + pond-insights references — written into the existing two blocks as the iteration starting points.
- [ ] **Write the third block** `:root[saved-theme="dark-low"]`: copy dark's chromatic values verbatim, override only the text-ramp variables + lift `--light`; comment lists the overridden set explicitly and carries the OG-contract note.
- [ ] **Iterate the ramp in the browser** on the test pages + real pages (journal entry, long note) across all three modes — this is the locked working style, not a one-shot decision. (Sets values only; no structural CSS.)
- [ ] **Extend `syntax.css`**: dark Shiki rule selectors → `[saved-theme="dark"], [saved-theme="dark-low"]`.
- [ ] **Extend `theme.test.ts`**: add a realistic dark-low block to the inline fixture; assert `parseThemeData` returns exactly two palettes with pinned light/dark values; pin that comment text inside the dark-low block cannot leak into parsed values.
- [ ] **Run `npm run check`** (typecheck + prettier) and the test suite; verify og-image generation still produces two variants on a real build.
- [ ] **Record loop findings** (which values moved, any dark-low slot that proved insufficient) in the plan's Exploration notes if they rise above value-noise.
