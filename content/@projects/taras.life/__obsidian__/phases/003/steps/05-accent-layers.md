---
publish: true
created: 2026-11-05T12:01:13.693Z
modified: 2026-11-05T12:05:42.944Z
published: 2026-11-05T12:05:42.944Z
status: ready
state: full
---

[← PLAN](../_plan_003.md)

## Description

Add the **accent layers** — the colorful, opinionated touches that make the site look _considered_ rather than stock: colorful headings, a coherent link design language, and selection styling.

This step runs on top of step 04's settled typography (sizes and measure are final before colors are judged — colors evaluated next to a different column width or scale read differently, so the iteration loop stays monotonic). Its hardest work is a **design decision, not code**: the current internal-link highlight _pill_ directly contradicts the stated direction ("underline, never highlight whole link"), and links are the most frequently rendered element on every page — flipping their treatment mid-loop would invalidate prior color judgments. So the link language is decided explicitly and first.

Organization (locked hybrid verdict + user decision): **accent color variables in `theme.css`** (theme-category, build-parsed SSOT); **accent rules as sections in `base.css`** — no new stylesheet file.

## High-Level

### List of related files or folders

- `quartz/styles/theme.css` — gains the accent-tier color variables (per mode block, alongside the ramp).
- `quartz/styles/base.css` — accent rule sections under clear banner comments (headings, links, selection).
- Judging surfaces: step 01 test pages — the type-specimen page (headings), callouts-&-links page (full link matrix), plus real pages; local serve loop.
- Reference: `__obsidian__/ideas/Capture.md` (colorful-headings idea source; Obsidian + "minimal's config" palettes; turntrout.com/design reference — borrow the _idea_, pick values against our own ramps).

### Intended outcome

- Headings carry per-level color accents, coherent across all three modes (values judged against light, dark, and dark-low backgrounds — manual eyeballing only; the contrast-audit script is rejected, locked).
- A single explicit link design language covers the full matrix: internal, external, broken, tag links, hover state — the pill is dead by default direction, but that's a conscious decision made in this step, not an accident.
- Text selection styling is coherent in all three modes (current mix of `--tertiary` at 60% + white-alpha likely breaks in dark-low — this step fixes it against the real modes).
- All accent values are theme-category variables in `theme.css`, so future modes/palette work inherits them for free.

### Local invariants

- **Hybrid organization**: accent _variables_ → `theme.css` per mode block; accent _rules_ → `base.css` sections with banner comments. No new stylesheet file, no `componentResources.ts` assembly edits.
- **Link design decided explicitly and first**, in one pass across all variants — never discovered mid-iteration. Pill death is the default direction (stated intent), but the decision is written down consciously with its alternative (pill-for-internal/underline-for-external) considered before killing it.
- **Colored-heading contrast checked manually across all three modes** — no audit script (rejected as a headache given gradient plans; user checks contrast starting now).
- Heading accents must clear the ramp's chromatic values where shared (dark-low shares dark's chromatic set — accent vars that follow chromatic values inherit that sharing; accent vars that need per-mode variants get per-mode entries explicitly).
- Accent-tier variables are **named, not inline hex** — every accent color exists as a `theme.css` variable so rules stay semantic and future retunes are one-place edits.
- DEV\_RULES do not apply to `quartz/` CSS; universal-UI lens applies (accents must hold from phone to 4K, three modes).

### Should NOT be done in this step

- No callout/tag/code-inline styling decisions unless they fall out of the link/selection language naturally — treat as future phases if scope starts pulling.
- No background gradient/grain work (step 06 owns the background bench; accent step judges flat surfaces only).
- No typography changes — sizes/measure/rhythm are settled; only colors move here.
- No component chrome (sidebar, explorer, footer) accenting — explicitly excluded as infinite scope; follows after identity exists.
- No `themechange`/JS work — accents are pure CSS over the existing three-mode attribute system.

---

## Tasks

- [ ] **Decide the link design language first** (before any color values): for each of internal / external / broken / tag links — underline? color? hover state? Write the decision into the step file's task or a short design note as it's made. Pill death confirmed or consciously reversed.
- [ ] **Define the accent-tier variables** in `theme.css`: heading accent colors (per level or per the decided scheme), link colors, selection color — per mode block, hand-tuned against the three backgrounds in the loop.
- [ ] **Implement heading accents** in `base.css`: per-level colors referencing the accent vars; judge h1–h6 hierarchy readability in all three modes (the Obsidian/minimal palettes may be dark-tuned — verify they survive light mode, adjust per-mode where they don't).
- [ ] **Implement the link rework** in `base.css`: remove the internal-link pill (background + padding + radius) and apply the decided language to the full variant matrix, including the `:has(> img)` exception if images-in-links need it and hover states for a 22px base.
- [ ] **Implement selection styling**: coherent per-mode selection color from the accent vars; verify in dark-low specifically (the current white-alpha mix is the suspected failure case).
- [ ] **Iterate on the loop**: judge accents on the test pages + real pages across all three modes; tune values by eye; record findings that rise above value-noise in the plan's Exploration notes.
