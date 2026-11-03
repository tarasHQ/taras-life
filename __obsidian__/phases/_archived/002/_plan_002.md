---
ctime: 2026-10-31 23:16
status: implemented
isIntegrated: true
---

[← Project](../../../_project.md)

# P 002 - Removing SCSS, Theming, Fonts plugin
%%[Internal User Link to Template]([T]plan.md) LLMs should ignore both the link and the paths it hints on%%

## Description & Meaning
%%A few sentences about rough direction of the plan, just to get initial constraints on brainstorming. Goals and visions that will sustain meaning in the user through the whole process of planning and implementation. Written by the user for the user.%%

> [!summary]  
> ### Description
> Remove redundant stuff and reduce cognitive complexity of the project. First sweep includes scss, fonts, themes. Don't maintain what you don't need. 
>  
> ### Visions
> > [!success] 
> > Vision on success. What about implementing these goals pulls you into enthusiasm? 
> > Reduced cognitive load from working on quartz. When I do styling - I don't have to work with "unknown" scss files, when I work with fonts - I don't have to go through the plugin I don't use or google fonts code while everything is self-hosted. It's streamlined and light. And more fun to work with
>
> > [!failure] 
> > Vision on failure. What if you fail to implement this? Is there something negative that pushes you into action?
> > With fonts it's minor inconvenience. While with scss/themes - it'll probably be a minor PIA to deal with. I'll have to learn saas, to know what I'm doing, which will be done for nothing, since the project is perfectly fine without saas features. And themes too, I don't want them neither plan to have them. Dark/light switch is all I need. So why should I maintain redundant code? 

## Documents
%%Dataviewjs snippet that renders list of documents from phase's inner folders%%

```dataview
TABLE WITHOUT ID
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/_reflections")), (f) => f.link) AS "Reflections",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/ideas")), (f) => f.link) AS "Ideas",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/artifacts")), (f) => f.link) AS "Artifacts"
FROM ""
WHERE startswith(file.folder, this.file.folder + "/") AND file.path != this.file.path
SORT file.name ASC
GROUP BY true
```

---

## Exploration
- %%Scoped by a phase it is in. %%
- %%Contains related exploratory knowledge to make initial exploration in the task more efficient.%%
- %%After each major workflow block - LLM shares its wins and losses in exploration in here. So further planning / implementation tasks in future would be more efficient in exploration part.%%
- ### Links To Related files
  %%Format is a link inside inline codeblock - 1-2 sentence description of files contents and how it's related to the whole phase.%%
	- ##### Created
		- `__obsidian__/phases/002/artifacts/implementation-possibilities-a4c7.md` - initial-planning exploration artifact; open implementation dimensions with the questions that got resolved during the discussion stage.
		- `__obsidian__/phases/002/steps/01-groundwork.md` - groundwork step (no code changes): oracle captures (sass-expanded SCSS, generated theme CSS), css-text flow invariant, resolved [C3] checklist.
		- `__obsidian__/phases/002/artifacts/oracle/` - the five machine-generated reference captures: `base.expanded.css` (syntax→callouts→base composition order + literal grids/breakpoints), `custom.expanded.css` (24 `@font-face` + heading weight), `popover.expanded.css`, `variables.expanded.css` (comments-only, as expected), `generated-theme.css` (joinStyles output incl. orphan aliases + accent HSL). First three were captured via PowerShell redirect → UTF-16LE; popover + theme re-captured UTF-8. Consumed by steps 02 (C6/C7 checks) and 06 (final review context).
		- `__obsidian__/phases/002/artifacts/dead-css-checklist.md` - resolved [C3] decisions: math/typst selectors REMOVE (verify `.math` class emission against the obsidian-flavored-markdown dist before deleting), callout types KEEP all (user-confirmed), popover KEEP ([C14]), demo leftovers checked and KEPT (desktop-only/mobile-only/navigation-progress/transclude/mermaid/youtube+pdf).
		- `__obsidian__/phases/002/steps/02-scss-to-css-theming.md` - the conversion step: 6 SCSS → 3 CSS (physical consolidation), static palettes hardcoded, C6 equivalence gate, [C1] loader replacement installed.
		- `__obsidian__/phases/002/steps/03-remove-generation-googlefonts.md` - generation machinery + Google Fonts removal: `joinStyles()` and friends die, emitter simplifies, config/schema theme surgery, local font stack untouched.
		- `quartz/util/theme.test.ts` - node:test suite pinning the `theme.css` parser written in step 03: 5 fixture cases (happy path, missing var names the var, commented-out decoy ignored, missing selector throws, unquoted font throws) + a real-SSOT guard reading `../styles/theme.css`.
		- `__obsidian__/phases/002/steps/04-toolchain-cleanup.md` - purely subtractive: sassPlugin instances + watch glob out of `handlers.js`, `esbuild-sass-plugin` + dead `quartz-fonts` deps out, lockfile regen, residual tooling-config sweep.
		- `__obsidian__/phases/002/steps/05-templates-cli-create-removal.md` - scaffolding removal ([C13] lean: full `create` path deletion), scoped-on-paper-first.
		- `__obsidian__/phases/002/steps/06-docs-final-verification.md` - READMEs written once at the end, AGENTS.md updates, multi-run semantic CSS review vs `public-legacy/`, [C9] checklist, manual smoke.
	- ##### Modified
		- `__obsidian__/phases/002/_reflections/initial-reflection.md` - SSOT for the phase; initial-planning decisions appended (C10–C16), old byte-diff/step-structure claims annotated as superseded in place.
		- Step-02 code changeset: `quartz/styles/{theme,syntax,callouts,base,custom}.css` + `quartz/components/styles/popover.css` created (all six SCSS originals deleted, re-confirmed absent post-review); `quartz/cli/handlers.js` (+ `loader: { ".css": "text" }`), `quartz/processors/parse.ts` (worker stub widened to `/\.s?css$/`), `index.d.ts` (`"*.css"` declaration), `quartz/plugins/emitters/componentResources.ts` (imports flipped), `.prettierignore` (`__obsidian__/`), `quartz.config.yaml` (comment).
		- Step-03 code changeset: `quartz/util/theme.ts` rewritten from the dead generator into a pure `theme.css` parser; `quartz.ts` (owns the `.css` import, injects `ThemeData` in-memory), `quartz/cfg.ts` (`theme` → optional build-time-only `ThemeData`), `quartz/plugins/emitters/componentResources.ts` (googleFonts branch deleted, `joinStyles()` call → plain fragment join), `quartz/components/Head.tsx` (dormant Google block + dead cdnjs preconnect out), `quartz.config.yaml` + `quartz/plugins/quartz-plugins.schema.json` (`configuration.theme` deleted), `quartz/styles/theme.css` (header comment wording).
	- ##### Deleted
		- Step-04 code changeset (no deletions of files; dependency removals): `quartz/cli/handlers.js` (esbuild-sass-plugin import, both `sassPlugin` instances, `**/*.scss` watch glob removed; loader comment made self-contained post-review), `quartz/processors/parse.ts` (stale `.scss` comment dropped; worker stub regex narrowed `/\.s?css$/` → `/\.css$/` post-review), `package.json` (`esbuild-sass-plugin` + `@quartz-community/quartz-fonts` out), `package-lock.json` regenerated (verified: `sass`, `sass-embedded`, `esbuild-sass-plugin`, `quartz-fonts` fully absent; no hidden consumers of quartz-fonts in node_modules dists — clean `npm ci` safe). Output-identity to step 03 verified by reasoning only (deletions are build-machinery; gate green) — no hash comparison against step-03 output was available post-gate.
	- ##### Context
		- `__obsidian__/docs/AGENTS.md` - entry point to the project for LLMs.
		- `public-legacy/` - user-provided pre-phase rendered output at repo root (includes test pages: markdown-test, remark-comments-load-test, remark42-shell-test). Reference source for the final semantic CSS review. NOT a byte-diff baseline.
		- `quartz/styles/*.scss` + `quartz/components/styles/popover.scss` - the 6 conversion targets. `base.scss` composes `syntax.scss` + `callouts.scss` via `@use`; `variables.scss` holds Sass vars + breakpoint/grid maps (highest semantic risk — silent wrong literals).
		- `quartz/util/theme.ts` - was the generator (`joinStyles()` etc., all died in step 03); now a pure parser of `theme.css` text (palettes + font families), fail-loud on structural drift, tested by `quartz/util/theme.test.ts`.
		- `quartz/plugins/emitters/componentResources.ts` - assembles core stylesheet: `[...globalCss, themeStyles, syntaxStyles, calloutStyles, baseStyles].join()` wrapped in `@layer quartz-base` (post-step-03 shape; `joinStyles`/googleFonts branch gone), `customStyles` appended outside the layer; Lightning CSS `transform()` minifies (no bundle/import inlining); output filenames are content-hash based (`index-<hash>.css`).
		- `quartz/cli/handlers.js` - post-step-04 state: esbuild context has the `.css` text loader and no sass plugins; watch glob covers `**/*.css` (no `**/*.scss`); `handleCreate()` template flow remains (dies in step 05).
		- `quartz/cli/plugin-data.js` - `TEMPLATES_DIR`, `createConfigFromTemplate()` / `createConfigFromDefault()`; missing template falls back to `default.yaml`, missing/invalid → `null`.
		- `quartz/cli/templates/*.yaml` - 4 templates (blog/default/obsidian/ttrpg), all with `fontOrigin: googleFonts`, `cdnCaching: true`, `@quartz-community/quartz-fonts` enabled. Slated for deletion.
		- `quartz/processors/parse.ts` - worker esbuild plugin stubs `.scss` loads as empty text (`loader: "text"`); needs `.css` equivalent.
		- `index.d.ts` - `declare module "*.scss"` block; needs swap to `.css`.
		- `quartz.config.yaml` - `configuration.theme` deleted in step 03 (schema too); YAML holds no palette — `ThemeData` is parsed from `theme.css` and injected in `quartz.ts`.
		- `quartz/plugins/quartz-plugins.schema.json` - theme property defs + `required` references removed in step 03; still NOT validated at build/runtime (only feeds the YAML-language-server `$schema` comment).
		- `quartz/components/Head.tsx` - Google Fonts block removed in step 03 (incl. the dead `cdnjs.cloudflare.com` preconnect); 3 local woff2 preloads (Atkinson 400/600, JetBrains Mono 400) STAY.
		- `custom-plugins/remark42/` - verified zero Sass/theme-var coupling (own esbuild build, syncs via `saved-theme` attribute). Never a build-risk suspect.
		- `node_modules/@quartz-community/darkmode/dist/` - `saved-theme` attribute mechanism on `document.documentElement`; stays untouched.
	- ##### Verification model (replaces per-step byte-diff)
		- Per step: `npm run check && npm run build` must pass.
		- Final verification (docs step): multiple independent LLM review runs over final CSS files vs `public-legacy/` contents — semantic comparison (every selector/variable accounted for: present, intentionally removed, or explained), NOT byte equality. Minified filenames are content-hash based, so hash changes are expected noise.
		- Fragment-level equivalence checks remain valid and required (they compare source fragments, not build output): C6 generated-vs-hardcoded theme block (captured in step 01) must match; step 02's map/breakpoint expansion checked against the sass-expanded oracle from step 01.


### Universal Tips
  %%Phase scoped. Free form. Concise. For more precise exploration. Goal is to avoid misleading/wrong/inefficient exploration. Optional. Should be really concise though. Filled only through LLM's experience. %%
	- No config↔schema validation exists anywhere → YAML/schema edits can't break the build. Lesson from step 03: the consumer audit missed that `@quartz-community/og-image` reads `cfg.theme` unguarded — grep plugin consumers (incl. `node_modules` plugin dists), not just repo code, before removing config fields.
	- `cssImports: true` on both sassPlugin instances was vestigial — zero plain-CSS `@import` in any `.scss`; it was NOT carried into the css-text loader replacement (moot since step 04 — the plugin is deleted).
	- Capture sass-expanded output of all 6 `.scss` files in step 01 (sass is still installed as a transitive dep until toolchain cleanup) — it's the reference oracle for map/breakpoint expansion, a capture not a verification mechanism.
	- SCSS composition is resolved by the Sass compiler (`@use`), not esbuild — a text loader will NOT inline files; composition must become explicit (locked: physical consolidation).
	- Vendored `docs/` mentions of scss are upstream reference material — ignore; AGENTS.md + styles README are the live docs.
	- `public-legacy/` contains test pages too — use them for review coverage of remark42 shell/load behaviour.
	- Sass emits DOUBLE parentheses when interpolating media conditions (`@media all and ((max-width: 800px))`, `@media all and not ((min-width: 1200px))`) — captured verbatim in the oracle. Step 02 conversions must copy these forms from the oracle; "cleaning" them to single-paren changes served CSS.
	- Do not import root `quartz.ts` from tsx scripts — its import graph reaches `.scss` and Node fails with `ERR_UNKNOWN_FILE_EXTENSION`. For config values, parse `quartz.config.yaml` directly with the repo's `yaml` dep.

---
---
---

## Steps

### %%◉ [STEP 99 - End Of The Phase](./steps/99-end.md) - IMPLEMENTED
Phase closed: project entry struck through + linked to archive; plan frontmatter finalized (implemented/integrated) and the post-move project link repaired; parking lot emptied (2 items resolved in-step, 1 extracted to `Capture.md` incl. the optional-peer deps lesson); meta-reflection filled; long-term knowledge confirmed extracted (step-06 README set + AGENTS.md); phase moved to `_archived/` by user.%%

### %%◉ [STEP 06 - Docs & final verification](./steps/06-docs-final-verification.md) - IMPLEMENTED
Closing step executed verification-first (user decision: READMEs written after review so they document the verified state). Multi-run semantic CSS review vs `public-legacy/` PASS — 3/3 independent runs converged (run 3 = full-aggregate selector diff; legacy-only rules all ledger-authorized math/katex/typst/MathJax or mechanical deltas; alias zero-consumers; 15/15 component bundles byte-identical). [C9] checklist all pass after triage; its one finding triggered the phase's final code change: `--titleFont` removed from `theme.css` (stale zero-consumer premise re-verified; gate green). READMEs written once, user-authored from LLM skeletons ("for you — by you"): styles (deep), util, cli, processors, emitters, static/fonts (rewritten stale), + quartz/ parent (user-added scope). AGENTS.md updated directly by LLM (Overview + §01.1 plain-CSS toolchain wording); user rejected the proposed §01.3 removed-subsystems section — AGENTS.md stays minimal. Manual smoke user-confirmed pass. Code review declined (both offers).

### %%◉ [STEP 05 - Templates & CLI create-flow removal](./steps/05-templates-cli-create-removal.md) - IMPLEMENTED
Full removal of the `create` CLI path ([C13] lean), scope expanded mid-step by user decision: all git/upstream CLI machinery died too (`upgrade`/`update`, `sync`, `restore` + handlers + orphaned helpers/constants), leaving CLI = `build` + `plugin *` + `tui`; templates dir physically deleted. `helpers.js` reduced to `symlinkOrCopySync` alone, `constants.js` to `version`/`fp`/`cacheFile`, dead wrappers (`handlePluginRestore`/`handlePluginCheck`/`handlePluginUpdate`) swept, unused `LOCKFILE_PATH` import+export dropped. Deviations: Tier-3 explicitly DROPPED by user (deprecated aliases + external plugin-install subsystem stay), and two contradictions resolved mid-step (`cwd` deleted; alias-target assumption corrected). Gate GREEN; dep audit removed `@clack/prompts`, `github-slugger`, `unist-util-visit` — final. Lesson: zero-source-import greps cannot clear optional-peer deps — optional peer = host provides (`@napi-rs/simple-git` broke the build; `sharp` kept on the same grounds).%%

### %%◉ [STEP 04 - Toolchain cleanup](./steps/04-toolchain-cleanup.md) - IMPLEMENTED
Purely subtractive completion confirmed: `handlers.js` lost the `esbuild-sass-plugin` import, both `sassPlugin` instances (default css-text + dead `.inline.scss`), and the `**/*.scss` watch glob (`**/*.css` watch entry kept); the stale `.scss` mention in `parse.ts`'s worker-stub comment was cleaned (regex `/\.s?css$/` untouched per step constraint). Residual sweep found zero sass/scss references in prettier/lefthook/CI/tsconfig/build configs and zero `.scss` files on disk (vendored `docs/` + one accurate history comment in `handlers.js` excepted; template yamls remain, dying in step 05). `esbuild-sass-plugin` + `@quartz-community/quartz-fonts` dropped from `package.json`; lockfile regen verified — all four names (`sass`, `sass-embedded`, `esbuild-sass-plugin`, `quartz-fonts`) absent from `package-lock.json`. Gate `npm run check && npm run build` green. DEVIATION: deps were removed by editing `package.json` directly + `npm install` instead of `npm uninstall` — identical end state.%%

### %%◉ [STEP 03 - Remove generation machinery + Google Fonts](./steps/03-remove-generation-googlefonts.md) - IMPLEMENTED
Generation machinery + Google Fonts fully removed: `joinStyles()`, both google font fns, `processGoogleFonts()`, `GoogleFontFile`, `hexToHsl`, and all theme types are gone; the emitter assembles the core stylesheet as a plain fragment join inside the unchanged `@layer quartz-base` wrapper, and `Head.tsx` lost the dormant Google block (plus the dead `cdnjs.cloudflare.com` preconnect) with local woff2 preloads intact. DEVIATION: `@quartz-community/og-image` reads `cfg.theme` unguarded, so full removal was impossible — `theme` was deleted from yaml + schema, while `ThemeData` is derived from `theme.css` by the rewritten pure, unit-tested `quartz/util/theme.ts` and injected in-memory in `quartz.ts`; the palette SSOT is `theme.css` alone. Gate green; grep clean except template yamls + vendored docs (step 05/06 scope) and the `plugin-data.js` default (dies with the create-flow in 05).%%

### %%◉ [STEP 02 - SCSS → CSS + static theming](./steps/02-scss-to-css-theming.md) - IMPLEMENTED 
All six SCSS sources became plain CSS verified against the step-01 oracles: `custom.css` (24 literal `@font-face` + heading weight pin), `popover.css` (flat, double-paren media kept), and — after the code review reopened [C10] — a split instead of a monolith: `theme.css` (hardcoded palettes + font vars), `syntax.css` (Shiki rules), `callouts.css` (callout rules), `base.css` (layout/typography; grids/breakpoints as literals; math/katex/typst selectors REMOVED per user decision after the emission guard fired positive). Cascade order (theme → syntax → callouts → base) is enforced by argument order in the emitter's `joinStyles()` call. [C1] css-text replacement installed (`loader: { ".css": "text" }` in handlers.js, parse.ts stub widened to `/\.s?css$/`, `index.d.ts` swapped, emitter imports flipped); hardcoded palettes passed the C6 diff (deltas = documented orphan alias list only); `**/*.css` added to the serve watch glob (review fix); `__obsidian__/` added to `.prettierignore` so oracle artifacts stay verbatim; gate green with zero `.scss` imports. Nesting-lowering in the built output verified against a fresh build (no residue for declared targets). Post-review re-delete of the six `.scss` files confirmed on disk (verdict: PASS; zero `.scss` remain).%%

### %%◉ [STEP 01 - Groundwork, audits & reference capture](./steps/01-groundwork.md) - IMPLEMENTED
No code changes. Four sass-expanded oracle captures landed in `artifacts/oracle/` (sanity-verified: composition order syntax→callouts→base, literal grids `320px auto 320px`, all 24 `@font-face`, no Sass residue) plus the generated theme CSS block from `joinStyles()` (captured via scratch tsx script parsing `quartz.config.yaml` directly — importing root `quartz.ts` dies on `.scss` in tsx; HSL literals hand-verified). KEY FINDING recorded as a [C7] mandate: sass emits double-paren media forms (`@media all and ((max-width: 800px))`) — step 02 must reproduce them verbatim, no normalization. [C1] css-text flow invariant recorded with the full chain map (handlers.js/emitter/parse.ts/index.d.ts); theme-consumer audit confirmed only `joinStyles()` reads theme config at runtime (clears step 03); [C3] dead-CSS checklist finalized in `artifacts/dead-css-checklist.md` (math/typst REMOVE with a `.math` verify-guard, callouts KEEP all per user, popover KEEP).%%

### %% ◉ [STEP 00 - Start Of The Phase](./steps/00-start.md) - IMPLEMENTED
The flow to start the planning in the right state of mind and with the properly prepared phase — completed: all start checklists are checked (phase renamed in `_project.md`, docs/ideas/reflections read, code familiarized, phase size verified as bite-sized).%%

%%
### Info On Steps
- `status` - `ready/postponed/implemented/skipped` - self-explanatory statuses.
- `state` - state of the step's contents
	- `placeholder` - minimal file to just hold the place until there's time to do high-level/implementation blocks
	- `high-level` or `○` - only top high-level block is written and implementation block is not
	- `full` or `◎` - high level and implementation blocks are written and step is ready for implementation.
	- `condensed` or `◉` - after step written and then implemented - completion flow of the step condenses the file to make it token-efficient. That's when this state (`condensed`) is applied.
%%

---
---
---

## Meta-Plan Reflection
%%Plan structure, navigation, planning workflows, exploration, execution. Meta stuff. To improve meta plan%%
### User-issues
### LLM-issues
- **Verification-first order in step 06 was right** — READMEs were written against the verified picture and the review's one defect (titleFont) was fixed before any doc shipped. Keep this order for future phases whose closing step is docs.
- **Oracle-capture groundwork (step 01) paid for itself across 02–06** — cheap insurance for any semantic-preserving rewrite; repeat the pattern.
- **Premises decay between steps** — "titleFont STAYS (revised [C2])" was itself stale by step 06. Consumer premises must be re-verified at point of use, not trusted from planning.
- **Exploration ledgers drifted toward per-step changelogs** — user trimmed them at close-out. Future phases: keep ledgers to file-level facts, leave narrative to step files.
