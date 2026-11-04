# Pond Insights

Extracted knowledge from TurnTrout.com (TurnTrout.com-main repo snapshot) for reuse in this project.

## Colors

- **Refs**: `C:/Users/Taras/Dev/_other/TurnTrout.com-main/quartz/styles/theme.css` (palette SSOT) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/quartz/styles/base.css` (::selection, variable usage) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/quartz/util/theme.ts` (build-time parser) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/quartz/plugins/emitters/componentResources.ts` (stylesheet assembly) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/__obsidian__/artifacts/the-pond-design.md` (design rationale, accent tier)
- **SSOT**: single file `quartz/styles/theme.css`; build parses it (`parseThemeData()`) and feeds palette to plugins (e.g. Shiki) — colors are not duplicated in `quartz.config.yaml`.
- **Structure**: 2 tiers — grayscale/base ramp + chromatic accents, expressed as semantic roles, never raw hex in component CSS.
- **Base ramp** (light / dark values):
	- `--light` — page/popover/checkbox bg: `#faf8f8` / `#161618`
	- `--lightgray` — structural subtlety (borders, hr, inline code bg, table lines): `#e5e5e5` / `#393639`
	- `--gray` — informational subtlety (checked todos, hints): `#b8b8b8` / `#646464`
	- `--darkgray` — body text, icons, selection text: `#4e4e4e` / `#d4d4d4`
	- `--dark` — max emphasis (headings, bold, inline code, TOC): `#2b2b2b` / `#ebebec`
- **Chromatic roles** (in same hierarchy): `--secondary` `#284b63` / `#7b97aa` (links, blockquote borders, progress bar); `--tertiary` `#84a59d` both modes (link hover, selection bg).
- **Extras**: `--highlight` `rgba(143,159,169,.15)` both modes (internal-link bg, code highlights); `--textHighlight` `#fff23688` / `#b3aa0288` (marker).
- **Dark mode**: same variable names, values re-mapped; only overridden vars declared in `:root[saved-theme="dark"]`, rest inherit from `:root`. Attribute set pre-paint by darkmode script (localStorage `theme` → `prefers-color-scheme` fallback, follows OS changes live).
- **Selection**: `::selection { background: color-mix(in srgb, var(--tertiary) 60%, rgba(255,255,255,0)); color: var(--darkgray); }` — works in both modes because tertiary is constant.
- **Contrast discipline**: every text/bg pair hand-tuned to 5:1 contrast ratio; five text rungs exist because each serves a distinct emphasis level.
- **Payoff**: restyling whole site = editing ~9 declarations per mode, nothing else.
- **Design doc** (`__obsidian__/artifacts/the-pond-design.md` in that repo) sketches a planned accent tier: `--red/--maroon/--orange/--yellow/--gold/--green/--teal/--sky/--blue/--purple/--lavender/--pink` + `--midground` (border step). Not implemented in the snapshot; naming is Catppuccin-style, `#303446` fallback = Catppuccin Frappé base. Also: build remaps naive `color:red` in old content to themed red; syntax highlight colors standardized to theme.
- **To get real accent values** (if wanted): read live site's emitted stylesheet `:root` block — ground truth, since snapshot predates the redesign.

## Layout Stability / Image Sizing

- **Refs**: `C:/Users/Taras/Dev/_other/TurnTrout.com-main/__obsidian__/artifacts/the-pond-design.md` (source of the quote + design rationale) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/package.json` (sharp dependency, unused by any such transformer in snapshot) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/quartz/plugins/` (transformer wiring point, implementation absent in snapshot)
- **Goal**: eliminate CLS (Cumulative Layout Shift) — images loading async otherwise reflow the page once their dimensions become known.
- **Mechanism**: browsers derive implicit `aspect-ratio` from explicit `width`/`height` attributes on `<img>` and reserve the box before any bytes download; CSS still controls rendered size, attributes only communicate the ratio. Derived height = rendered width ÷ ratio.
- **Implementation**: build-time transformer walks hast for `<img>` (and similar embeds), reads intrinsic dimensions of the asset (sharp's metadata read — cheap, no full decode), writes `width`/`height` attributes before HTML emission. "Linked assets" phrasing covers remote URLs too (needs build-time fetch).
- **Status in snapshot**: NOT implemented (aspirational, from `the-pond-design.md`); `sharp` is in `package.json` but unused by any such transformer. Live site likely has it.
- **Pair-with guardrails**: `loading="lazy"` + `decoding="async"` on offscreen images.
- **Port note for our repo**: natural fit = rehype transformer visiting `img` nodes + sharp metadata; nothing CSS-side needed.

## Scroll Restoration

- **Refs**: `C:/Users/Taras/Dev/_other/TurnTrout.com-main/__obsidian__/artifacts/the-pond-design.md` (§"Solution: Preempt the page paint", quotes; links historical `quartz/static/scripts/instantScrollRestoration.js`, absent from snapshot) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/quartz/components/scripts/spa.inline.ts` (current SPA router — no save/restore)
- **Problem**: back/refresh restores scroll before images reserve space → restored offset drifts as layout grows; browser-native `scrollRestoration` is unreliable+racy on static sites.
- **Solution shape**: inline pre-paint script (NOT external, NOT `beforeDOMLoaded` — must run before first frame); sets `history.scrollRestoration = "manual"` to stop native restoration fighting; reads stored position from multiple stores (`history.state` / `sessionStorage` / `localStorage` — different nav paths populate different ones).
- **rAF loop**: instead of one-shot restore, adjusts position each frame for ~3s to absorb late-loading content growth below restore point, imperceptibly.
- **Key insight — user vs layout-shift disambiguation**: script can't tell user scroll from layout shift by deltas; instead treats causes as disjoint: `wheel`/`touchstart`/`pointerdown`/`keydown` listeners, `passive: true` + `once: true`, set `userInteracted` → cancel adjustment loop. Layout shifts cannot emit input events.
- **SPA interplay**: with micromorph SPA nav, back/forward = `popstate` → `navigate(isBack)` which doesn't scroll (body patched in place, scroll preserved naturally) → restoration script only matters on full page loads (first visit, refresh, external back); safe to always run (no-op when nothing stored).
- **Port note for our repo**: inline via `additionalHead` in Head.tsx; complements image aspect-ratio feature (that one shrinks the 3s correction need).

## Typography / Type Scale

- **Refs**: typescale.com (generator used) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/__obsidian__/artifacts/the-pond-design.md` (§"Sizing", line-length rationale) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/quartz/styles/base.css` (stock heading sizes — not adopted)
- **Chosen scale** (generated on typescale.com, base 22px, ratio 1.125 — "minor second"):
	- h1 — 2.027rem · h2 — 1.802rem · h3 — 1.602rem · h4 — 1.424rem · h5 — 1.266rem · h6 — 1.125rem
	- p — 1rem · small — 0.889rem · extra — 0.79rem
- **Locking principle**: every size derives from ONE root variable via `calc()` from a single `--scale` (or bake the table's rem values verbatim) so no two adjacent steps can ever drift off-ratio; root `html { font-size: 22px }` makes the rem values land at intended px.
- **Readability hint** (from his doc, adapted): consider reducing base size on tablets/phones (e.g. 20px there vs 22px desktop) — target ~50–75 chars/line; his center column is 750px ≈ 75 chars on desktop.
- **Status in his snapshot**: stock Quartz sizes hardcoded (h1 1.75rem…), his doc's responsive ladder unimplemented — ignored per decision above.
