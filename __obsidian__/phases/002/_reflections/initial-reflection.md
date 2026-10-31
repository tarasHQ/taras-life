---
ctime: 2026-10-31 23:16
isIntegrated: false
---

%%[[_static/templater/[T]reflections|Link To Template]]%%

###### Meta-reflection (On completion)
%%Awareness to avoid repeating friction or to improve what works%%
%%issues/friction/inconvenience. Also sometimes I reflect on high cost-low reward topic/issue. I need to be aware of those.%%
- 
---
## Remember
- If reflection is successful - act upon it right away. 
	- Use advantage of the brain filled with relative knowledge. It's easily compensates cognitive exhaustion.
- Highlight insights in the reflection. 

---

## Problems & Goals
%% To prevent drift from the initial target and ending the reflection without answering on what it was about%%
- 

---

## Raw
%%Free-form reflection with no rules%% 
- ### What I need (writing right away)
	- to be sure removal of scss is 100% a good thing we should do
	- to start having decisions persisting system throughout the project (readme's in submodules)
		- Idea is if someone would want to use my repo, so he won't question why something was removed while other things didn't.
	- To move from scss to css, since it seems like it's redundant
	- Remove unused/redundant styles. 
	- Remove fonts logic quartz-fonts
		- plugin + google fonts code too.
		- Not sure about other font logic, if there's any left. 
	- Delete saas plugin instances and esbuild-sass-plugin dep (possibly others too)
	- #### Theming generation, config, et[]()c

## LLM Refinement

%%Appended by LLM after exploration + discussion (flow: refining-reflection). Facts are verified against the codebase; decisions locked with user.%%

- ### Locked context decisions
	- **"Full rogue" on Quartz** — vendored tree is treated as a fork. No upstream merge-friendliness constraint; upstream-aligned code shape is no longer a valid argument against removals.

- ### Locked scope items (everything except theming)
	- #### SCSS → plain CSS conversion (full)
		- Convert all 6 `.scss` files (`quartz/styles/{base,callouts,custom,syntax,variables}.scss`, `quartz/components/styles/popover.scss`).
		- Sass feature inventory (verified): variables in 4/6 files, `@use` in 4/6, one mixin total (`face` in `custom.scss`, 24 `@font-face` rules), Sass maps in 2/6 (`variables.scss` breakpoints/grid → consumed by `base.scss`). No `@import`, no functions, no loops, no conditionals.
		- Conversion mapping: nesting → native CSS nesting; Sass vars → literals or CSS custom properties; `face` mixin → literal `@font-face` blocks; breakpoint/grid maps → literal media queries.
		- Toolchain removal: `esbuild-sass-plugin` dep + both `sassPlugin` instances in `quartz/cli/handlers.js` (default `css-text` + `.inline.scss` as `css`), transitive `sass`/`sass-embedded` (1.104.1) drop from lockfile, worker `.scss` stub in `quartz/processors/parse.ts` updated.
		- Verify whether the second `sassPlugin` instance (`*.inline.scss`) is dead before removal.
	- #### Dead dependency pruning
		- `@quartz-community/quartz-fonts` — in `package.json` but NOT in `quartz.config.yaml` → dead, remove.
		- Unused `@use "sass:color"` in `callouts.scss` — remove (moot after CSS conversion).
	- #### Google Fonts machinery deletion (vendored-tree surgery, OK under full rogue)
		- `googleFontHref()`, `googleFontSubsetHref()`, `processGoogleFonts()` in `quartz/util/theme.ts`.
		- Fetch/download branch in `quartz/plugins/emitters/componentResources.ts` (`fontOrigin === "googleFonts"` paths).
		- Google preconnect/link block in `quartz/components/Head.tsx` (behind `cdnCaching && fontOrigin === "googleFonts"` — currently dormant).
		- `fontOrigin` (+ related `cdnCaching`?) from `quartz-plugins.schema.json` and config; Google Fonts settings in `quartz/cli/templates/*.yaml`.
		- Invariant being encoded: this site never fetches fonts from the network, ever.
		- KEEP untouched: local font setup (24 woff2 in `quartz/static/fonts/`, `@font-face` rules, 3 preloads in `Head.tsx`, `_headers` cache rule).
	- #### Dead-CSS audit (one-time, manual)
		- Audit rendered HTML against styles: unused callout types, `syntax.scss` dual-theme need, popover CSS while popovers disabled, Quartz-demo leftovers in vendored `base.scss`, possible CSS from removed plugins (graph, latex, encrypted-pages, reader-mode, tags…).
		- Caution: micromorph SPA nav + dynamic DOM (search, popovers, theme toggle) — verify off-initial-paint usage; don't prune aggressively.
		- Tooling (CSS coverage etc.) — NOT in scope unless user requests.
	- #### Decision persistence (READMEs)
		- Create READMEs where controversial decisions land, at minimum `quartz/styles/README.md` (SCSS removal rationale, theming decisions). Follow precedent of `quartz/static/fonts/README.md`.
		- Keep AGENTS.md "Removed plugins" table pattern updated alongside.

- ### Locked: theming — both palettes + native toggle STAY; build-time generation REMOVED
	- #### User decision (final, after deliberation)
		- Light AND dark palettes both stay — rationale: readers outdoors need light mode, night readers want dark. Single-palette options (light-only / dark-only) were considered and rejected.
		- Native toggle stays: `@quartz-community/darkmode` component fully untouched (`saved-theme` attribute mechanism, `themechange`, `localStorage`, `prefers-color-scheme` handling).
		- Consequences: `syntax.scss` dark Shiki rules and Shiki dual-theme config STAY. Remark42 theme sync (`browser.ts`) stays untouched — NO plugin rebuild needed for this item.
	- #### Removal scope (generation side only)
		- Two separable systems identified:
			1. **Build-time generation** (`joinStyles()` in `quartz/util/theme.ts`, single call site `componentResources.ts`) — generates 9 palette + 4 font vars actually consumed, PLUS ~60 unconsumed Obsidian-compat aliases (`--background-primary`, `--text-normal`, `--color-base-*`, `--nav-item-*`, `--tag-*`, …) and 3 unused `--accent-h/s/l`. Orphans ship on every page.
			2. **Runtime dark-mode switch** (`@quartz-community/darkmode` component, `saved-theme` attribute on `<html>`) — attribute → CSS selector mechanism, independent of how variables were generated. Consumers: `syntax.scss`, darkmode component CSS, `custom-plugins/remark42/src/browser.ts`.
		- LOCKED: remove generation + config surface (`theme.colors`/`typography` in YAML, `Theme`/`ColorScheme` types, schema) + orphan aliases; hardcode BOTH palettes + fonts as static `:root` / `:root[saved-theme="dark"]` custom properties. Runtime attribute mechanism + darkmode component preserved. Preserve `@layer quartz-base` arrangement.
		- Sequencing note: if SCSS conversion and theming flattening both happen, theme vars should land as static CSS in the same pass to avoid touching the same files twice.

- ### Locked: high-level plan structure (discussion stage complete)
	- #### Order constraints (drive the step sequencing)
		- Theming flattening rides the SCSS→CSS pass (each stylesheet touched once).
		- Dead-CSS audit precedes conversion (prune while converting, not after).
		- `joinStyles()` dies only after CSS carries static vars.
		- Toolchain cleanup only after no `.scss` remain.
		- Docs last (document the final state).
	- #### Steps
		- **01 — Groundwork & audits**: verify `*.inline.scss` sassPlugin instance dead; one-time dead-CSS audit (rendered HTML vs stylesheets, callout types, popover-disabled check, removed-plugin leftovers); capture current generated theme CSS as literal source for hardcoding. No code changes.
		- **02 — SCSS → CSS + static theming** (one step, subtasks inside; size approved by user): convert 6 files, hardcode both palettes as `:root` / `:root[saved-theme="dark"]` custom properties, apply dead-CSS pruning, expand `face` mixin, inline breakpoint/grid maps.
		- **03 — Remove generation machinery + Google Fonts**: `joinStyles()`, `Theme`/`ColorScheme` types, `fontOrigin`/`cdnCaching` from config+schema, Google branch in `componentResources.ts`, Google block in `Head.tsx`, template yaml cleanup. Same-file overlap → one step.
		- **04 — Toolchain cleanup**: both `sassPlugin` instances out of `quartz/cli/handlers.js`, worker `.scss` stub in `parse.ts`, deps out: `esbuild-sass-plugin`, `@quartz-community/quartz-fonts`, transitive `sass`/`sass-embedded`.
		- **05 — Docs & final verification**: `quartz/styles/README.md`, AGENTS.md updates, `npm run check`/`test`/`build` + manual smoke (dark toggle, Remark42 widget theming, fonts, popovers/search).
	- #### Explicitly NOT steps
		- Remark42 changes (untouched — verified), Shiki config (stays), darkmode component (untouched).
	- #### User resolutions
		- 02 granularity: one step, approved.
		- Verification cadence: every step ends with `npm run check && npm run build` + visual smoke; deeper verification in 05.
		- Plan-file naming conflict (AGENTS.md `DD-MM-YYYY - NAME.md` vs LLM.md `_plan.md`): fixed by user.
