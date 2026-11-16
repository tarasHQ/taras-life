---
publish: true
created: 2026-11-05T12:07:05.299Z
modified: 2026-11-05T12:07:16.163Z
published: 2026-11-05T12:07:16.163Z
status: ready
state: full
---

[← PLAN](../_plan_003.md)

## Description

Run the **background bench**: gradient (fixed vs scrolling vs none) and grain (yes/no) experiments on the fixed pseudo-element mechanism — an _experiment step_, not a build step.

The deliverable is a **lived-with verdict, not a feature**. Every variant gets implemented cheaply, lived with on real pages, and judged; losers are deleted; the verdict is recorded. A fully legitimate outcome is **"none"** — solid `--light` background wins and the entire mechanism gets deleted. Nothing here is a commitment (locked HOW verdict 6: the fixed pseudo-element is the _testing_ mechanism, chosen over `background-attachment: fixed` because of mobile jank).

**Experiments run on production.** No previews exist and deploys are push-triggered — living with a variant means the live site carries it, same working mode as the published test pages (locked verdict 3). Conscious continuation, not a surprise.

**Coupled verdicts, sequenced deliberately:** dark-bottom→lighter-top over a tall viewport is the textbook 8-bit banding case. Order: gradient alone first (observe banding on the sandbox page) → grain as dithering (does it fix banding?) → grain alone (aesthetic texture on solid bg). Testing together conflates two verdicts; if gradient bands and grain fixes it, they win as a pair.

## High-Level

### List of related files or folders

- `quartz/styles/base.css` — the mechanism (fixed pseudo-element layer) + final resting place of whatever survives (sections with banner comments, consistent with the no-new-file decision from step 05).
- `quartz/styles/theme.css` — per-mode background variables: gradient endpoints + grain intensity, defined inside each mode block so dark-low's lifted `--light` automatically shifts its endpoints.
- `quartz/styles/base.css` baseline — read first: **where the background color currently lives** (`body` vs `html`) — determines the visibility trap handling below.
- Judging surfaces: `md-tests-bg` sandbox page (tall, sparse — the banding observatory) for banding specifically; **all real pages** (journal entry, long note) for the live-with-it verdict — background shows everywhere, the sandbox alone can't render a verdict.

### Intended outcome

- The fixed-layer mechanism implemented and verified working in all three modes.
- Each experiment variant actually lived with for its trial period; verdicts recorded in the plan's Exploration notes.
- Surviving configuration finalized as clean CSS; **all losers deleted** — including the mechanism itself if "none" wins. No dead experiment CSS ships permanently.
- Banding question answered with evidence (observed on the sandbox page, with and without grain).

### Local invariants

- **Mechanism = testing only** (locked verdict 6): `body::before { content: ""; position: fixed; inset: 0; z-index: -1 }` — never `background-attachment: fixed` (mobile Safari jank is the reason the mechanism exists).
- **Visibility trap handled consciously**: negative z-index paints behind the parent stacking context's opaque background — if `body` carries `background-color: var(--light)`, the layer is invisible. Expected fix: base color moves to `html` (body background transparent). The `--light` token is untouched; only its carrier element may change. Verify against the actual baseline before assuming.
- **Per-mode values in `theme.css`**: gradient endpoints and grain intensity are variables inside each mode block (hybrid organization) — dark-low's lifted background flows into its gradient for free.
- **Grain source: SVG `feTurbulence` data-URI first** (no asset, cheap to try); PNG tile in `static/` only if data-URI quality/perf disappoints. Decision made inside the step, recorded with the verdict.
- **Containing-block guard**: `position: fixed` resolves to the viewport only if no ancestor (html/body) carries `transform`/`filter`/`perspective`/`will-change` — verify none is introduced by this or later steps.
- **Z-index care**: navigation progress bar sits at `9999` (validated); the background layer stays at `-1` behind all content — confirm no stacking interaction.
- DEV\_RULES do not apply to `quartz/` CSS; universal-UI lens applies — verdict must hold on real phones (production test pages make this verifiable), not just desktop.

### Should NOT be done in this step

- No verdict-by-argument — only by living with it. No variant is kept or killed from the armchair.
- No per-section/diagonal background art (would need a different mechanism than one full-viewport layer — a closed door, recorded in the HOW artifact).
- No accent/typography/selection changes — flat-surface colors settled in step 05; only the background layer moves here.
- No new stylesheet files (consistent with step 05's decision).
- No permanent architecture claims — if kept, the layer is still one deliberate CSS block, not infrastructure.

---

## Tasks

- [ ] **Baseline read**: where does the background color live today (`body`? `html`? both?), what `content-visibility`/overflow patterns in `base.css` could interact with a fixed full-viewport layer.
- [ ] **Implement the mechanism**: `body::before` fixed layer + per-mode gradient/grain variables in `theme.css`; move base color to `html` if the visibility trap applies (per baseline); body background transparent.
- [ ] **Verify the mechanism before experimenting**: layer visible in all three modes, behind all content, progress bar unaffected, no containing-block interference, print output not wrecked (hide the layer in `@media print` if needed).
- [ ] **Experiment 1 — fixed gradient, no grain**: dark bottom → lighter top from per-mode vars; live with it; observe banding on the sandbox page (tall viewport).
- [ ] **Experiment 2 — grain as dithering**: add `feTurbulence` grain layer on the same pseudo-element; does banding disappear? Does grain-alone-as-texture appeal? Record both roles separately.
- [ ] **Experiment 3 — scrolling gradient** (gradient tied to document, not viewport): live with it; compare against fixed.
- [ ] **Live-with periods on real usage** — journal entry, long note, daily browsing; check on a real phone (production); note dark-low's shifted endpoints specifically.
- [ ] **Record verdicts** in the plan's Exploration notes: gradient fixed/scrolling/none; grain yes/no (+ source decision); any per-mode intensity notes.
- [ ] **Delete the losers**: remove losing variants' CSS and variables; if "none" wins — remove the mechanism entirely and restore the simple solid background; leave `theme.css`/`base.css` cleaner than the experiment found them.
- [ ] **Final pass**: `npm run check` green; quick full-mode visual sweep after deletions.
