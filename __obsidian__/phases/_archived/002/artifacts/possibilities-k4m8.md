# Possibilities Exploration — Phase 002 (Styling / Fonts / Theming cleanup)

%%Temporary self-reflective exploration. Questions and possible explanations only —
no answers, no recommendations. Input: 002/_reflections/initial-reflection.md %%
%%Companion exploration facts are summarized at the bottom for reference.%%

---

## 1. SCSS → CSS removal: is it 100% a good thing?

- ### What is SCSS actually doing here?
	- Only 6 `.scss` files exist. Usage counts:
		- Sass variables in 4/6 files (`variables.scss`, `base.scss`, `callouts.scss`, `custom.scss`)
		- `@use` in 4/6 (mostly `sass:map`, `sass:color` — color is imported but apparently unused)
		- One mixin total (`face` in `custom.scss`, generates 24 `@font-face` rules)
		- Sass maps in 2/6 (`variables.scss` breakpoints/grid, consumed by `base.scss`)
		- No `@import`, no `@function`, no loops, no conditionals anywhere
	- Does the codebase actually *use* Sass as a language, or does it merely pass through it?
	- Is the complexity concentrated in one file (`variables.scss`) rather than spread out?

- ### What replaces each Sass feature in plain CSS?
	- Nesting → native CSS nesting (browser support? Lightning CSS lowering for older targets?)
	- Sass variables → CSS custom properties? Or just literals for build-time-only values?
		- Question: are Sass variables ever *content-bearing* (grid maps, breakpoints) vs. cosmetic?
	- The `face` mixin → 24 literal `@font-face` blocks?
		- Question: is hand-maintained repetition acceptable, or is the mixin earning its keep?
	- Breakpoint/grid maps in `variables.scss` → inline media queries with literal values?
		- Question: how many call sites consume the maps? Is consistency of breakpoints lost without them?

- ### What breaks / what's the blast radius?
	- `esbuild-sass-plugin` is wired in `quartz/cli/handlers.js` (two `sassPlugin` instances, one for `.inline.scss`).
		- Question: does anything actually use `*.inline.scss`? Is that a dead second plugin instance?
	- `quartz/processors/parse.ts` has a worker-stub that replaces `.scss` with empty text.
		- Question: does that stub survive/need changing after conversion to `.css`?
	- `lightningcss` is already in the toolchain — could it absorb responsibilities Sass held?
	- Removal candidates: `esbuild-sass-plugin`, transitive `sass` + `sass-embedded` (~heavy deps)
	- Question: is this a vendored-tree merge-surface concern? (Quartz upstream still uses SCSS — every converted file becomes a merge conflict point at upgrade time.)

- ### Possible framings of the decision
	- "Remove the Sass dependency" (toolchain simplification)
	- "Convert the stylesheet language" (source migration, vendored divergence)
	- "Reduce installed weight" (dependency pruning only, keep SCSS)
	- Are these three framings separable, or bundled?

---

## 2. Unused / redundant styles

- ### What does "redundant" mean concretely here?
	- Styles for removed plugins whose CSS survived removal? (removed-plugin list in AGENTS.md is long: graph, latex, encrypted-pages, reader-mode, stacked-pages, tags…)
	- Selector-level dead code inside kept files (e.g. callout types never authored, popover styles if popovers disabled)?
	- Whole files conditionally imported but effectively inert (`syntax.scss` both themes? `callouts.scss` if callouts unused?)
	- Question: does the vendored `base.scss` carry Quartz-demo styling this blog never renders?

- ### How would dead CSS be detected?
	- Manual audit against rendered HTML snapshots?
	- Lightning CSS pruning (it does tree-shake unused selectors in some configurations)?
	- Runtime unused-CSS coverage tooling (Puppeteer/Playwright `CSS.coverage`)?
	- Question: is one-time manual audit enough for a curated personal blog, or is repeatable tooling wanted?

- ### Risks
	- micromorph SPA navigation + dynamically inserted DOM (popovers, search, dark-mode toggle) — styles used only off-initial-paint.
	- Callout types authored in Obsidian in the future.
	- Question: is aggressive pruning worth regression risk on a site where CSS total size is already small?

---

## 3. Fonts logic removal

- ### What actually exists (facts)
	- `@quartz-community/quartz-fonts` is in `package.json` but NOT in `quartz.config.yaml` → dead dependency?
	- Google Fonts machinery in vendored tree is dormant under `fontOrigin: local`:
		- `googleFontHref()`, `googleFontSubsetHref()`, `processGoogleFonts()` in `quartz/util/theme.ts`
		- Google fetch/download branch in `quartz/plugins/emitters/componentResources.ts`
		- Google preconnect/link block in `quartz/components/Head.tsx` (behind `cdnCaching && fontOrigin === "googleFonts"`)
		- `fontOrigin` schema field in `quartz-plugins.schema.json`
		- Google Fonts settings in `quartz/cli/templates/*.yaml`
	- Active local setup: 24 woff2 files + `face` mixin in `custom.scss` + 3 preloads in `Head.tsx` + `_headers` cache rule.

- ### Distinguishable sub-decisions
	- Remove dead dependency `@quartz-community/quartz-fonts` from `package.json`?
	- Remove dormant Google Fonts code branches from the *vendored* tree?
		- Question: vendored code is meant to stay merge-friendly with upstream — is pruning dormant upstream features a maintenance win or a merge-conflict tax?
		- Counter-framing: unused code paths are attack/complexity surface for a *personal* fork that rarely upgrades.
	- Remove the `fontOrigin` config option entirely and hardcode "local"?
		- Question: does anything else read `fontOrigin`/`cdnCaching`?
	- Keep the local `@font-face` setup untouched (it's the working system)?

- ### Possible explanations for the confusion in the reflection
	- "Remove fonts logic" may have meant the plugin + Google code, but the wording ("Remove fonts logic quartz-fonts / plugin + google fonts code too. Not sure about other font logic") suggests uncertainty about what else exists.
	- Question: is the intent "no network font fetching, ever" as an invariant, or "delete all font-related code"?

---

## 4. Theming generation, config, etc.

- ### Current architecture (facts)
	- `quartz.config.yaml` → `theme.colors.lightMode/darkMode` + `theme.typography`
	- `quartz/util/theme.ts` `joinStyles()` generates `:root` custom properties + dark-mode override via `:root[saved-theme="dark"]`
	- Styles consume `var(--light)`, `var(--bodyFont)`, etc.
	- `syntax.scss` uses `saved-theme` attribute for Shiki themes.

- ### Open questions
	- Is the generated theme system overkill for a single-author site with one palette pair?
		- Possible explanation: keeping config-driven theming preserves upstream merge compatibility and Obsidian-synced config habits.
		- Possible explanation: flattening to static `:root` CSS removes a code path nobody exercises (does anything else call `joinStyles`?).
	- `saved-theme` attribute mechanism: is the dark-mode toggle JS part of kept client runtime? Does it stay regardless?
	- Are there orphan theme aliases generated ("theme-compatible aliases and accent HSL values") that nothing consumes?
	- Question: is theming part of this phase's scope, or a separate later phase? (Reflection line is truncated: "Theming generation, config, et…")

---

## 5. Decision persistence (READMEs in submodules)

- ### The stated want
	- Decisions persisting through the project, so a third party reading the repo isn't confused why X was removed while Y stayed.

- ### Current README landscape (facts)
	- Only 4 READMEs exist: root, `custom-plugins/remark42/`, `quartz/static/fonts/`, one archived-phase artifact.
	- Missing: `quartz/styles/` (would be the natural home for phase-002 decisions), `custom-plugins/` root, `scripts/` (doesn't exist as a dir? audit script lives somewhere), `content/`.

- ### Open questions
	- Is the AGENTS.md "Removed plugins" table the right SSOT for removal rationale, or do submodules need their own READMEs?
	- Possible explanation: one system-level doc (AGENTS.md) vs. per-module READMEs are different audiences (agent onboarding vs. human browsing a folder).
	- Question: what granularity — a README per vendored subsystem (`quartz/styles/`, `quartz/plugins/`) or only where controversial decisions land?

---

## Companion facts (from exploration, for context)

- SCSS compilation lives in `quartz/cli/handlers.js` (esbuild context, two `sassPlugin` calls: default `css-text` + `.inline.scss` as `css`).
- Global stylesheet assembly lives in `quartz/plugins/emitters/componentResources.ts` → `joinStyles(theme, googleFontsStyleSheet, globalCss, baseStyles)`, wrapped in `@layer quartz-base`, then Lightning CSS minify → `index.css`.
- `sass` resolves transitively at 1.104.1 via `esbuild-sass-plugin`.
- `quartz/static/fonts/README.md` already documents the local-font wiring (good precedent for decision persistence).
