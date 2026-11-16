---
publish: true
created: 2026-11-05T12:08:10.188Z
modified: 2026-11-05T12:08:37.447Z
published: 2026-11-05T12:08:37.447Z
status: ready
state: full
---

[← PLAN](../_plan_003.md)

## Description

Finish the visual identity's outermost layer: **tab favicon + `theme-color` + cheap apple-touch** — what the browser chrome shows before and around the page.

Strictly last because the icon is **generated from the established look** (palette, accents, background from steps 02–06 — generate from what exists, not from intention). But the step's _wiring_ is independent of the final artwork: the plumbing (metas, build-derived values, JS refinement) is landed with a placeholder icon first; the generated art drops in without touching contract code again.

The core subtlety: a static SVG favicon with an internal `prefers-color-scheme` media query follows the **OS**, not the visitor's _chosen_ mode (dark-low would render as whatever the media query says). `theme-color` has the same mismatch. Hence the locked full strategy (HOW verdict 10): **the media-query pair ships as the no-JS/static default, and the toggle JS-refines `<link rel="icon">` + `theme-color` on every mode change** — fallback + refinement, never alternatives.

Scope guard with teeth (the reflection's named trap): favicon silently expands into favicon + logo + apple-touch + OG image. This step is **tab favicon + cheap apple-touch resize only**. Logo and OG rework are separate later moments (OG already inherits palette via the `theme.css` build parsing, so it won't look broken meanwhile).

## High-Level

### List of related files or folders

- **Created:** the generated SVG favicon + resized PNG apple-touch icon in `quartz/static/` (alongside the existing `icon.png`, which this step replaces as the Head-referenced icon — it's placeholder-grade).
- `quartz/components/Head.tsx` — emits the icon `<link>`s (SVG + fallbacks), the static media-query `theme-color` pair; builds values from the build-derived data.
- `quartz/util/theme.ts` — **additive** extension of the parsed theme data: a `chrome` section (per-mode `themeColor` from each mode's `--light`); og-image contract untouched (validated: it reads specific palette keys only).
- `quartz/util/theme.test.ts` — fixture extended to pin the new `chrome` values (same protection pattern as the 2-palette pin).
- ThemeToggle + contract module (step 03's) — gains the mode-change refinement hook: update icon href + `theme-color` content on every mode change.
- `__obsidian__/ideas/parking.md` — records the AI-generation prompt (long-lived knowledge; regeneration will happen).
- Judging surface: production tabs + mobile browser chrome across all three modes.

### Intended outcome

- Tab favicon reflects the visitor's **chosen** mode (not just OS) in JS-enabled browsers; OS-based media-query behavior remains as the no-JS default.
- `theme-color` (mobile browser chrome) matches the active mode's background exactly, from build-derived values that can't drift from `theme.css`.
- Apple-touch icon exists as a cheap resize of the same identity — no separate design effort.
- The dropped favicon plugin's gap is fully closed: nothing references the removed `favicon.ico`; `Head.tsx` links the new assets.
- OG image output is untouched (2-palette contract holds; only additive data added).

### Local invariants

- **Media-query pair always ships** — the static default exists regardless of JS refinement; refinement only overrides at runtime.
- **`theme-color` values are build-derived** from `theme.css` via the additive `chrome` field — never hardcoded hex in `Head.tsx` (SSOT honesty; palette edits flow through automatically).
- **Additive only** on `ThemeData`: new field, no existing key changes — og-image reads specific palette keys (validated safe).
- **Icon variant granularity: light/dark pair**, dark-low → dark variant (same narrowing philosophy as remark42's guard). Three per-mode variants only if the identity genuinely demands it — decided in-step, recorded.
- **Toggle owns the runtime refinement** (it uniquely knows the chosen mode) — the hook lives in its mode-change path; the contract module stays the single owner of how mode maps to chrome values.
- **Generated-asset provenance recorded**: prompt + tool noted in `ideas/parking.md`; final SVG source in `quartz/static/`.
- DEV\_RULES do not apply to `quartz/` code; universal-UI lens applies (icon legibility at 16px tab size, all three modes).

### Should NOT be done in this step

- **No logo** (header/branding mark) — explicitly a later moment.
- **No OG-image rework** — it inherits palette already; at most verify it still builds.
- **No full favicon pack** (multi-size PNG set, maskable icons, manifest) — deliberately deferred by the scope guard.
- No palette or accent changes — chrome values are _derived_ from the settled palette, never picked independently here.
- No new `themechange` consumers — the toggle refines chrome itself; nothing else subscribes.

---

## Tasks

- [ ] **Extend the parser additively**: add the `chrome` section (per-mode `themeColor` derived from each block's `--light`) in `quartz/util/theme.ts`; extend `theme.test.ts` fixture to pin the new values; verify og-image output unchanged on a real build.
- [ ] **Wire `Head.tsx`**: emit the media-query `theme-color` pair + icon `<link>`s (SVG with internal `prefers-color-scheme` media + PNG fallback) from the build-derived values — placeholder icon acceptable at this stage.
- [ ] **Add the runtime refinement hook** to ThemeToggle/contract module: on every mode change (including initial seed), update `<link rel="icon">` href (light/dark variant mapping, dark-low→dark) and `theme-color` content; confirm the no-JS default still renders correctly with JS disabled.
- [ ] **Generate the icon**: AI-generate the site-styled \[T] favicon from the established look (steps 02–06 output); iterate until it reads clearly at 16px; record prompt + tool in `ideas/parking.md`; finalize SVG + apple-touch PNG resize in `quartz/static/`.
- [ ] **Replace `icon.png` references**: `Head.tsx` links the new assets; verify `static/icon.png` is either repurposed or left unreferenced deliberately (not deleted if anything else references it — check first).
- [ ] **Verify on production**: tab favicon + browser-chrome color across all three modes on desktop and mobile; mode changes reflected without reload; no-JS behavior sane; `npm run check` + `npm test` green.
