---
status: implemented
state: condensed
---

[← PLAN](../_plan_002.md)

## Description
All six SCSS files became plain CSS verified against the step-01 oracles; Sass composition replaced by physical consolidation, both palettes + fonts hardcoded (joinStyles() still runs — dies in step 03). Includes the [C1] css-text replacement install and dead-CSS pruning applied during conversion.

## Tasks
- 02.1 — [C1] css-text replacement installed: `loader: { ".css": "text" }` in handlers.js esbuild context (build + serve), parse.ts worker stub widened to `/\.s?css$/`, `index.d.ts` swapped to `"*.css"`, emitter imports flipped; green checkpoint before any conversion. `cssImports: true` deliberately not preserved (vestigial).
- 02.2 — `custom.scss` → `custom.css`: face mixin expanded to 24 literal `@font-face` blocks verbatim from oracle (incl. Source Sans Pro Cyrillic aliasing comments), `$semiBoldWeight` → `600`; verified against oracle.
- 02.3 — `popover.scss` → `popover.css`: `$mobile` → literal `800px`, kept entirely ([C14]); verified against oracle.
- 02.4 — Consolidation: `syntax.scss` + `callouts.scss` merged in, preserving oracle output order (variables → syntax → callouts → base rules); nesting → native CSS nesting, Sass vars → literals; dead-CSS checklist decisions applied during conversion ([C3]: math/katex/typst REMOVED, callout types KEEP all, popover KEEP).
- 02.5 — `variables.scss` dissolved ([C7]): breakpoints → literal `@media` conditions, grid maps → literal tracks/gaps, `$sidePanelWidth` → `320px`; fragment-level diff vs oracle passed (incl. double-paren media forms, copied verbatim).
- 02.6 — Static theming ([C6] gate): consumed var set grep-confirmed (9 palette + 4 font vars); `:root` + `:root[saved-theme="dark"]` hardcoded from `quartz.config.yaml`; C6 diff vs generated-theme capture = exactly the documented orphan alias list.
- 02.7 — Dissolved originals deleted (syntax/callouts/variables + base/custom/popover once counterparts in place).
- 02.8 — Gate: `npm run check && npm run build` green; zero `.scss` in repo.

## Implementation Notes (condensed)
- **Code review: PASS** (fixes applied in-session). Review point #3 reopened [C10] → `base.css` split into `theme.css` (palettes + font vars), `syntax.css`, `callouts.css`, `base.css` (layout/typography only); cascade order now enforced by argument order in the emitter's `joinStyles()` call (theme → syntax → callouts → base). This supersedes the original "no new theme file ([C10])" line and the "imports flip only" emitter invariant.
- Review fixes: `**/*.css` added to handlers.js watch glob (scss entry stays until step 04); popover.css stale-breakpoints comment now points at base.css table; `.vscode/settings.json` gained `files.eol: "\n"`.
- Nesting lowering verified against fresh build (no `&` residue, no nested @media for declared targets). Explicit `Features.Nesting` DECLINED by user — see `../ideas/parking.md`.
- Math-removal override: `.math`/`.math-display` emission guard fired positive (obsidian-flavored-markdown dist emits them) but user confirmed REMOVE anyway — recorded in `../artifacts/dead-css-checklist.md`.
- `__obsidian__/` added to `.prettierignore` (oracle artifacts stay verbatim); `quartz.config.yaml` comment updated to reference `custom.css` (comment-only).
- The six `.scss` deletions (temporarily reverted for the review) re-confirmed absent from disk post-review.
