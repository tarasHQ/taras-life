---
publish: true
created: 2026-11-05T06:25:47.157Z
modified: 2026-11-05T12:12:08.741Z
published: 2026-11-05T12:12:08.741Z
ctime: 2026-11-05 08:25
isIntegrated: false
---

[← Project](../../_project.md)

# P 003 - Visual Identity

## Description & Meaning

> [!summary]  
>
> ### Description
>
> Everything a first-time visitor's eye registers **before reading a single word**: color (brown/golden/dark palette in three modes), typography (type scale + reading measure), accent layers (colorful headings, link design, selection), background experiments, and the tab favicon. Behavioral and compositional work is explicitly out of scope — later phases.
> Iteration infrastructure comes first: a visual test-page set living in the vault (`_static/markdown-tests`), synced into the site and intentionally published, so every visual decision is judged on real rendering — locally and on production.
>
> ### Visions
>
> > [!success]
> > Opening taras.life feels like _mine_ — a warm, considered identity in all three modes. Future phases inherit a visual base instead of fighting stock Quartz. The dark-low mode is good enough that I never feel the urge to replace it.
>
> > [!failure]
> > The site still looks like stock Quartz — and every later phase bakes that genericness deeper into content and components. Tweaks happen in a vacuum, judged against nothing, endlessly.

## Documents

| Reflections                                                                                                                | Ideas                                                                                         | Artifacts                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li>[[@projects/taras.life/__obsidian__/phases/003/_reflections/initial-reflection.md\|initial-reflection]]</li></ul> | <ul><li>[[@projects/taras.life/__obsidian__/phases/003/ideas/parking.md\|parking]]</li></ul> | <ul><li>[[@projects/taras.life/__obsidian__/phases/003/artifacts/implementation-possibilities-q7m2.md\|implementation-possibilities-q7m2]]</li><li>[[@projects/taras.life/__obsidian__/phases/003/artifacts/implementation-possibilities-q7z2.md\|implementation-possibilities-q7z2]]</li><li>[[@projects/taras.life/__obsidian__/phases/003/artifacts/refining-possibilities-k3f9.md\|refining-possibilities-k3f9]]</li></ul> |

---

## Persistent Storage

- **Locked decisions** live in `_reflections/initial-reflection.md` (§ Refinement pass + § Locked verdicts incl. the HOW pass)

## Exploration

- ### Links To Related files
  - ##### Created Files
    -
  - ##### Modified Files
    -
  - ##### Deleted Files
    -
  - ##### Context Files
    - Repo
      - `quartz/styles/theme.css` — SSOT of palette; will gain third `:root[saved-theme="dark-low"]` block (hand-written minimal derivation: text ramp + lifted `--light` background, chromatic shared with dark) and the accent-tier color vars (hybrid decision); ramp values iterated in browser.
      - `quartz/styles/syntax.css` — dark Shiki rules get an explicit two-selector list `[saved-theme="dark"], [saved-theme="dark-low"]` (no prefix trick).
      - `quartz/styles/base.css` — baked type-scale table (html 22px anchor), unitless line-height fix, article-scoped 80ch measure (NO escape hatch — wide blocks scroll internally), `text-wrap: balance` on headings, link design rework (pill death), selection styling, background experiments; home for accent rules if a new file is rejected.
      - `quartz/components/Head.tsx` — theme-color meta, SVG favicon + cheap apple-touch, inline zero-flash theme-init script rendered via `<script dangerouslySetInnerHTML>` (precedent: `quartz/components/pages/404.tsx`); currently links `static/icon.png`.
      - New `quartz/components/ThemeToggle.tsx` (+ colocated contract module) — single owner of the JS-side theme contract: storage key, attribute, mode list, cycle, OS-seed rule, inline-init snippet, `themechange` dispatch, icon/`color-scheme` CSS.
      - `quartz/plugins/emitters/componentResources.ts` — stylesheet assembly is `[...globalCss, theme, syntax, callouts, base].join()` wrapped in `@layer quartz-base`; adding a stylesheet file = one import + one array entry; `custom.css` stays outside the layer.
      - `quartz/util/theme.ts` + `quartz/util/theme.test.ts` — og-image palette parser keeps exactly 2 palettes (third block unmatchable by exact regexes, verified); extend the test fixture with a realistic dark-low block + `Object.keys(theme.colors).length === 2` assertion — the real-file SSOT test then auto-guards the real third block; favicon step may add an additive `chrome` field (verified safe: og-image reads specific palette keys only).
      - `custom-plugins/remark42/src/browser.ts` — `hasThemeDetail` guard widened to accept all three modes, then NARROWED internally to `"light" | "dark"` (dark-low → `"dark"`) before `changeTheme`; touches plugin source → `npm run build:plugins` + commit `dist/`.
      - `index.d.ts` — `themechange` union becomes `"light" | "dark" | "dark-low"` (raw payload).
      - `quartz.config.yaml` — `@quartz-community/darkmode` AND `@quartz-community/favicon` entries deleted; NO toggle entry (placement is loader-owned, not YAML).
      - `quartz/plugins/loader/config-loader.ts` — `loadQuartzLayout` imports `ThemeToggle` and inserts it into the `left` position at the toolbar priority (exact precedent: how `Head` is assigned); the component registry is NOT seeded with core components, so YAML placement of core components is not available.
      - `quartz/components/frames/DefaultFrame.tsx` — untouched by the toggle decision (frame stays purely structural); mobile `.sidebar.left` becomes a horizontal row — toggle ordering eyeballed there.
      - `node_modules/@quartz-community/darkmode/dist/components/index.js` — reference for the contract being re-owned: localStorage key `theme`, `saved-theme` attribute, binary cycle, OS listener that OVERWRITES stored choice, `themechange` on `document` with `detail: { theme }`, `color-scheme`/icon CSS.
      - `content/markdown-test.md`, `content/@journal/01 Daily/2026/10-October/October 30th Fri.md`, `content/Productivity/_reflections/how-much-time-should-i-work.md` — visual iteration test pages.
      - Vault folder `C:/Users/Taras/Documents/obsidian-vault/_static/markdown-tests/` → synced into `content/_static/markdown-tests/` — grouped test pages + index; relative links; each page with `id` + comments on; intentionally listed on production.
    - Obsidian
      - `__obsidian__/docs/AGENTS.md` - entry point to the project for LLMs.
      - `__obsidian__/docs/DEV_RULES.md` - read before writing any code.
      - `__obsidian__/ideas/pond-insights.md` - reference type scale (22px base, 1.125 ratio) starting values.
      - `__obsidian__/ideas/Capture.md` - gradient/grain/colorful-headings/favicon idea sources.
- ### Exploration Tips
  - **Validated facts (don't re-derive):**
    - og-image parser (`quartz/util/theme.ts`) uses EXACT selectors (`:root\s*\{`, `:root\[saved-theme="dark"\]`) — it cannot match a third block by construction; `theme.test.ts` already has a real-file SSOT test that will auto-parse the real third block once it exists.
    - og-image reads only specific palette keys (`colors.darkMode.light`, `.gray`, …) — additive fields on `ThemeData` are safe; existing keys must stay.
    - Old darkmode dep contract: localStorage key `theme`, `saved-theme` on `documentElement`, binary light↔dark cycle, OS-preference listener OVERWRITES the stored choice live, dispatches `themechange` on `document` with `detail: { theme }`, ships `color-scheme` + icon-switching CSS (must be re-owned).
    - micromorph patches ONLY `<body>`; the `<html saved-theme>` attribute and head contents persist across SPA nav — no theme re-init logic needed anywhere.
    - Inline-script mechanism: `<script dangerouslySetInnerHTML>` in JSX (precedent `404.tsx`); `JSResourceToScriptElement` also supports `inline` resources. `beforeDOMLoaded` component scripts become EXTERNAL `prescript.js` — not guaranteed pre-paint.
    - remark42 is the ONLY `themechange` consumer in the repo (site code + node\_modules searched).
    - No `font-size` on html/body anywhere (incl. popover.css); `line-height: 1.6rem` (length, not ratio) on p/li/tbody is a latent bug; table children use `2rem`.
    - `text-wrap: pretty` already exists on text elements; only `balance` (headings) is new. No article measure exists today — `.center`/`article` are constrained only by the grid track (`320px auto 320px`) and `.page`'s `calc(1200px + 300px)` cap.
    - Wide-content reality: `pre` and `.table-container` already have `overflow-x: auto` — wide blocks scroll internally (locked: no escape hatch at all).
    - `@quartz-community/favicon` emits a root `favicon.ico` that NOTHING references (Head links `static/icon.png`) — drop verified safe. No `theme-color` meta and no apple-touch-icon exist anywhere today.
    - Mermaid (CDN 11.4.0, bundled in `@quartz-community/obsidian-flavored-markdown`) follows `saved-theme`: `"dark"` → dark theme, anything else → light `"base"`. Dark-low edge case: check & record this phase.
    - The `unlisted: true` frontmatter flag exists (excluded from explorer/search/sitemap/RSS while still built) — test pages intentionally do NOT use it (published).
  - **Locked HOW decisions (this flow):** toggle inserted via `loadQuartzLayout` (Head precedent) — not YAML, not frame JSX; `themechange` dispatches the RAW mode (remark42 narrows internally); stylesheet organization = hybrid (palette/accent vars in `theme.css`, rules in `base.css` or a new file — a new file costs one import + one array entry in the assembly); type scale BAKED as rem table; measure = 80ch absolute, no escape hatch; favicon/theme-color = JS-refined by the toggle + build-derived values via an additive `ThemeData` field.
  - **Background bench is NOT a commitment:** the fixed pseudo-element (`body::before { position: fixed; inset: 0; z-index: -1 }`) is only the TESTING mechanism (avoids `background-attachment: fixed` mobile jank); gradient (fixed vs scrolling vs none) and grain (yes/no; doubles as banding dithering via SVG `feTurbulence`) are decided by living with them — verdict recorded, losers deleted. Z-index care: navigation progress bar is `9999`.
  - **`color-scheme` ownership:** darkmode package's bundled CSS owns `color-scheme: dark/light` + toggle icon switching — must be re-owned by the local component CSS, easy to forget.
  - **Contrast:** user checks manually (no audit script — rejected as headache given gradient plans). Serve loop already works and is tested.

---

---

---

## Steps

### ◎ [STEP 99 - End Of The Phase](./steps/99-end.md) - READY

Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.

\=== INSERT STEPS HERE ===

### Drafted Steps Recommendation

### ◎ [STEP 07 - Favicon & Meta](./steps/07-favicon-meta.md) - READY

Tab favicon + `theme-color` + cheap apple-touch — strictly last, generated from the established look. Media-query pair ships as no-JS default; toggle JS-refines icon href + `theme-color` on every mode change; `theme-color` build-derived via an additive `ThemeData.chrome` field (og-image untouched, test pin added); icon variant granularity = light/dark pair (dark-low→dark, remark42-narrowing philosophy); wiring landed with placeholder icon first, generated art drops in without contract changes; prompt recorded in `ideas/parking.md`; scope guard: no logo, no OG rework, no full favicon pack.

### ◎ [STEP 06 - Background Bench](./steps/06-background-bench.md) - READY

Experiment step, not a build step — deliverable is a lived-with verdict: gradient (fixed/scrolling/none) + grain (yes/no, doubles as banding dither). Fixed pseudo-element mechanism (testing only, never `background-attachment: fixed`); visibility trap handled consciously (base color may move body→html); experiments sequenced gradient-alone → grain-as-dither → grain-alone; run on production (no previews — same working mode as published test pages); verdicts recorded, losers deleted, "none" is a legitimate outcome.

### ◎ [STEP 05 - Accent Layers](./steps/05-accent-layers.md) - READY

Colorful headings, explicit link-design decision (pill death is the default direction, decided consciously first across the full variant matrix), coherent per-mode selection styling. Hybrid organization: accent variables in `theme.css` per mode block, accent rules as `base.css` sections — no new file. Manual contrast checking across all 3 modes (audit script rejected). Runs on step 04's settled typography.

### ◎ [STEP 04 - Typography](./steps/04-typography.md) - READY

Latent bugs first (html-level 22px anchor per verdict 9; `line-height: 1.6rem`/`2rem` → unitless), then baked 1.125-ratio rem scale table (no calc derivation) and article-scoped `max-width: 80ch` with NO escape hatch (wide blocks scroll internally); `text-wrap: balance` on headings; mobile anchor adjustment is a loop item, not a shipped default. Single-surface: `base.css`.

### ◎ [STEP 03 - Theme System](./steps/03-theme-system.md) - READY

The phase's architectural step: local `ThemeToggle` + colocated contract module replaces `@quartz-community/darkmode`. Key `theme` reused (free migration), OS seeds initial only, cycle light→dark→dark-low; inline zero-flash init in `Head.tsx` (404.tsx precedent) from contract constants; loader insertion via `loadQuartzLayout` (Head precedent); `themechange` dispatches RAW mode, `index.d.ts` widened, remark42 guard widened→narrowed internally (`build:plugins` + commit `dist/`); `color-scheme`/icon CSS re-owned (morphing SVG first, multi-icon fallback); config drops darkmode AND favicon; mermaid dark-low edge case checked & recorded; DEV\_RULES §Rendering Model 4 aligned.

### ◎ [STEP 02 - Palette Foundation](./steps/02-palette-foundation.md) - READY

CSS side of 3 modes, landed inert-first (before anything sets the attribute): ramp starting values for light+dark (Capture.md/pond-insights, refined by the iteration loop), hand-written third `:root[saved-theme="dark-low"]` block as minimal derivation over dark (text ramp + lifted `--light`, chromatic shared, explicit comment), `syntax.css` explicit two-selector list, OG 2-palette contract pinned in `theme.test.ts`. No TS work — that's step 03.

### ◎ [STEP 01 - Visual Test Pages](./steps/01-visual-test-pages.md) - READY

Iteration infrastructure first: vault `_static/markdown-tests` set (~5 grouped pages + index, relative links, `id` frontmatter + comments on, intentionally published) synced into `content/_static/markdown-tests/`. Verify sync → build → listed on production; confirm local serve loop. Becomes the judging surface for all later steps. Content-only — no code touched.

### ◎ [STEP 00 - Start Of The Phase](./steps/00-start.md) - READY

The flow is to start the planning in the right state of mind and with the properly prepared phase

---

---

---

## Meta-Plan Reflection

### User-issues

-

### LLM-issues

- ## Where LLM had troubles with this "system of projects"? (if it had any)
