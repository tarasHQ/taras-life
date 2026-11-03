# Implementation Possibilities — Phase 002 (temporary exploration artifact)
%%Created by LLM during initial-planning flow, stage B1. Format: nested questions + possible explanations. No answers/recommendations — decisions get locked in discussion (stage C).%%

## Scope status upfront
- Already locked by reflection (NOT re-opened here): full SCSS→CSS, theming flattening (both palettes hardcoded, generation removed), Google Fonts machinery deletion, dep pruning, dead-CSS as bounded checklist, stub READMEs, step order 01–05, verification baseline = `public-legacy` byte-diff.
- Open dimensions explored below: places where multiple viable implementations exist and the plan does not yet name one.

## A. How does `import styles from ".css"` become CSS text after sassPlugin dies? (C1 pinning)
- What exactly does `componentResources.ts` need from imports?
	- CSS as a runtime string to concatenate → text-based loading
		- esbuild loader map: `{ ".css": "text" }` in the same `buildApi.initialize` plugins block
		- a tiny onLoad plugin returning file text with `loader: "text"` (mirrors the existing `css-and-scripts-as-text` pattern in `parse.ts`)
		- a `.mjs`/`.ts` constant file generated at build time (pre-build step)
	- a real CSS bundle emitted by esbuild's native CSS pipeline
		- does esbuild then produce a separate `.css` chunk the emitter must collect instead of a JS string?
		- does that change how `@layer quartz-base` wrapping and `customStyles` appending work?
		- does `cssImports: true` behavior (handling of `@import` inside SCSS) have a native equivalent?
- Which option preserves the current "concatenate strings → wrap in @layer → minify" flow unchanged?
- Does the worker stub in `parse.ts` need the same treatment for `.css` (currently `.scss` only)?
- Is bundling CSS for the plugin's browser script (`custom-plugins/remark42`) affected? (it builds via its own `build.mjs`)

## B. Where do the hardcoded `:root` / `:root[saved-theme="dark"]` theme variables physically live?
- A new dedicated file (e.g. `quartz/styles/theme.css`) — a literal SSOT file for styling
	- does it become one of the files concatenated into the core stylesheet?
	- does its position in the concatenate order matter for the `@layer quartz-base` arrangement?
- Inside `base.css` directly
	- simpler file count, but mixes theming with layout
- Split per-concern (`variables.css` renamed / converted from `variables.scss`, theme block appended)
	- does keeping a "variables" file still mean anything once Sass variables die and maps are inlined?
- Does the file name/granularity affect the byte-diff deltas (file boundaries show in `@layer` ordering or comment headers)?

## C. What remains of `configuration.theme` after flattening?
- Full deletion of the `theme` block from `quartz.config.yaml` + `Theme`/`ColorScheme`/`ThemeKey`/`FontSpecification` types
	- is `fontOrigin` still read anywhere once the Google branch dies (e.g. "local" branch behavior in `componentResources.ts`)?
	- is `theme.typography` consumed outside `joinStyles()` — e.g. `Head.tsx` preloads, font-family strings in `custom.scss`, `processGoogleFonts`?
	- is `theme.colors` consumed anywhere besides `joinStyles()`?
- Keep a minimal block (`fontOrigin` only, or typography only) — where's the line between "config that still drives behavior" and "config that is now decoration"?
- What does the JSON schema lose, and does anything validate config against it at runtime (affects C5)?

## D. Conversion method for the 6 SCSS files
- Hand conversion file-by-file
	- full control of output shape, slower, transcription risk concentrated in maps/breakpoints (C7)
- One-time `sass` CLI compile of each file to expanded CSS as scaffolding, then manual restructure
	- mechanical nesting expansion done by the reference implementation itself, removes a whole error class
	- risk: adopting compiler output wholesale loses the human-readable structure the phase wants
- Mixed: hand-convert mechanical parts, compile-verify the map/breakpoint expansion against sass output
- Does `variables.scss`'s map-derived media queries and grid templates have any shape worth keeping as CSS custom properties vs inlining literals?

## E. What replaces `joinStyles()` exactly?
- Delete outright; inline concatenation + `@layer` wrapping into `componentResources.ts`
- Keep a small helper (renamed, reduced) — is there other call-site potential that justifies a util?
- Where does the removed googleFontsStyleSheet parameter's slot go in the signature?
- Does the C6 diff (generated vs hardcoded) require the generator to still exist in a runnable form at step 02, or can the diff be captured once in step 01?

## F. Dead-CSS checklist decision points (C3) — which items are actual keep/delete calls?
- Popover: component disabled but `popover.scss` + component code exist — delete CSS only, or CSS + component registration + bundle path?
- Removed-plugin selectors (graph, katex, encrypted-pages, reader-mode, tag pages): sweep or wait to spot incidentally?
- Callout types: which types actually appear in `content/` vs which are styled in `callouts.scss`?
- Demo leftovers in vendored `base.scss`: keep the checklist item or expand it into a per-section pass?

## G. Templates & schema handling (C5) — what does the verification actually decide?
- If templates are validated against the schema at build time → all 4 templates forced to lose Google Fonts keys
- If not → edit opportunistically vs leave with pointer comment vs delete keys partially
- Does `quartz-plugins.schema.json` losing `fontOrigin`/`cdnCaching`/`colors`/`typography` break the project config's own parsing (is the project's YAML validated against the same schema)?
- Is `@quartz-community/quartz-fonts` also listed in all 4 templates (confirmed present) — does template surgery also prune it there, or is template pruning a separate decision?

## H. Boundary conditions worth naming before step 02 starts
- What counts as an "intentional delta" list entry — one line per removed selector/variable, or grouped by category?
- Do comment header differences (e.g. removed `@use` lines, banner changes) count as deltas to review or noise to whitelist?
- Does minification normalize whitespace so converted nesting compiles to identical output, or can formatting alone produce diff noise?
- Where does the byte-diff script live (step-scoped script vs committed tool) — does it survive into step 05's final verification?
