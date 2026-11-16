---
ctime: 2026-11-05 08:25
status: implemented
isIntegrated: true
---

[← Project](../../../_project.md)

# P 003 - Visual Identity
%%[Internal User Link to Template]([T]plan.md) LLMs should ignore both the link and the paths it hints on%%

## Description & Meaning
%%A few sentences about rough direction of the plan, just to get initial constraints on brainstorming. Goals and visions that will sustain meaning in the user through the whole process of planning and implementation%%

> [!summary]  
> ### Description
> Everything a first-time visitor's eye registers **before reading a single word**: color (brown/golden/dark palette in three modes), typography (type scale + reading measure), accent layers (colorful headings, link design, selection), background experiments, and the tab favicon. Behavioral and compositional work is explicitly out of scope — later phases.
> Iteration infrastructure comes first: a visual test-page set living in the vault (`_static/markdown-tests`), synced into the site and intentionally published, so every visual decision is judged on real rendering — locally and on production.
> ### Visions
> > [!success] 
> > Opening taras.life feels like *mine* — a warm, considered identity in all three modes. Future phases inherit a visual base instead of fighting stock Quartz. The dark-low mode is good enough that I never feel the urge to replace it.
>
> > [!failure] 
> > The site still looks like stock Quartz — and every later phase bakes that genericness deeper into content and components. Tweaks happen in a vacuum, judged against nothing, endlessly.

## Documents
%%Dataview query for user. Renders list of documents from phase's inner folders. %%

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

## Persistent Storage
%%Bullet list only for important high-level things that MUST persists between steps. AS CONCISE AS POSSIBLE. %%
- **Locked decisions** live in `_reflections/initial-reflection.md` (§ Refinement pass + § Locked verdicts incl. the HOW pass)


## Exploration
%%Contains related exploratory knowledge to make initial exploration in the task more efficient.%%

- ### Links To Related files
  %%Format is a link inside inline codeblock [file-size-in-kb-from-explore-tool] - 1-2 sentence description of files contents and how it's related to the whole phase.%%
	- ##### Created Files
		- Vault `C:/Users/Taras/Documents/obsidian-vault/_static/markdown-tests/` — 6-page visual test set (source of truth; authored here only).
		- `content/_static/markdown-tests/` — synced copy of the test set; published judging surface for the remaining steps.
		- `quartz/components/ThemeToggle.tsx` — build-time toggle component; cycle + dispatch + morphing-SVG icon live in its client script/CSS.
		- `quartz/components/scripts/themeContract.ts` — SSOT of the JS-side theme contract: storage key, attribute, `THEME_MODES`, inline init + toggle scripts; `index.d.ts` points here for the `themechange` union.
		- `quartz/components/styles/theme-toggle.css` — icon-switching CSS colocated with the toggle.
	- ##### Modified Files
		- `quartz/styles/theme.css` — palette, heading accents, and per-mode background colors.
		- `quartz/styles/base.css` — typography, accent styling, and the chosen scrolling background.
		- `quartz/styles/syntax.css` — dark Shiki rules widened to the explicit `[saved-theme="dark"], [saved-theme="dark-low"]` two-selector list.
		- `quartz/util/theme.test.ts` — dark-low fixture block with comment-decoy; 2-palette contract test (`lightMode`/`darkMode` keys only, dark values from the dark block); SSOT real-file pins moved to the new hexes.
	- ##### Deleted Files
		- 	
	- ##### Context Files
		%%Phase is not implemented yet — only context; created/modified/deleted sections fill in after implementation.%%
		- Repo
			- `quartz/styles/theme.css` — SSOT of palette; will gain third `:root[saved-theme="dark-low"]` block (hand-written minimal derivation: text ramp + lifted `--light` background, chromatic shared with dark); ramp values iterated in browser.
			- `quartz/styles/syntax.css` — dark Shiki rules get an explicit two-selector list `[saved-theme="dark"], [saved-theme="dark-low"]` (no prefix trick).
			- `quartz/components/Head.tsx` — theme-color metadata, SVG favicon and Apple touch icon links, and inline zero-flash theme initialization.
			- New `quartz/components/ThemeToggle.tsx` (+ colocated contract module) — single owner of the JS-side theme contract: storage key, attribute, mode list, cycle, OS-seed rule, inline-init snippet, `themechange` dispatch, icon/`color-scheme` CSS.
			- `quartz/plugins/emitters/componentResources.ts` — stylesheet assembly is `[...globalCss, theme, syntax, callouts, base].join()` wrapped in `@layer quartz-base`; adding a stylesheet file = one import + one array entry; `custom.css` stays outside the layer.
			- `quartz/util/theme.ts` + `quartz/util/theme.test.ts` — og-image palette parser keeps exactly 2 palettes (third block unmatchable by exact regexes, verified); extend the test fixture with a realistic dark-low block + `Object.keys(theme.colors).length === 2` assertion — the real-file SSOT test then auto-guards the real third block; favicon step may add an additive `chrome` field (verified safe: og-image reads specific palette keys only).
			- `custom-plugins/remark42/src/browser.ts` — `hasThemeDetail` guard widened to accept all three modes, then NARROWED internally to `"light" | "dark"` (dark-low → `"dark"`) before `changeTheme`; touches plugin source → `npm run build:plugins` + commit `dist/`.
			- `index.d.ts` — `themechange` union becomes `"light" | "dark" | "dark-low"` (raw payload).
			- `quartz.config.yaml` — darkmode, favicon AND excalidraw entries removed; NO toggle entry (placement is loader-owned, not YAML).
			- `quartz/plugins/loader/config-loader.ts` — `loadQuartzLayout` imports `ThemeToggle` and inserts it into the `left` position at the toolbar priority (exact precedent: how `Head` is assigned); the component registry is NOT seeded with core components, so YAML placement of core components is not available.
			- `quartz/components/frames/DefaultFrame.tsx` — untouched by the toggle decision (frame stays purely structural); mobile `.sidebar.left` becomes a horizontal row — toggle ordering eyeballed there.
			- `content/markdown-test.md`, `content/@journal/01 Daily/2026/10-October/October 30th Fri.md`, `content/Productivity/_reflections/how-much-time-should-i-work.md` — visual iteration test pages.
			- Vault folder `C:/Users/Taras/Documents/obsidian-vault/_static/markdown-tests/` → synced into `content/_static/markdown-tests/` — grouped test pages + index; relative links; each page with `id` + comments on; intentionally listed on production.
		- Obsidian
			- `__obsidian__/docs/AGENTS.md` - entry point to the project for LLMs.
			- `__obsidian__/docs/DEV_RULES.md` - read before writing any code.
			- `__obsidian__/ideas/pond-insights.md` - reference type scale (22px base, 1.125 ratio) starting values.
			- `__obsidian__/ideas/Capture.md` - gradient/grain/colorful-headings/favicon idea sources.
- ### Exploration Tips
  %%Free form. Concise. For more precise exploration. Goal is to avoid misleading/wrong/inefficient exploration. Optional. Should be really concise though %%
	- **Validated facts (don't re-derive):**
		- og-image parser (`quartz/util/theme.ts`) uses EXACT selectors (`:root\s*\{`, `:root\[saved-theme="dark"\]`) — it cannot match a third block by construction; `theme.test.ts` already has a real-file SSOT test that will auto-parse the real third block once it exists.
		- og-image reads only specific palette keys (`colors.darkMode.light`, `.gray`, …) — additive fields on `ThemeData` are safe; existing keys must stay.
		- Old darkmode dep contract: localStorage key `theme`, `saved-theme` on `documentElement`, binary light↔dark cycle, OS-preference listener OVERWRITES the stored choice live, dispatches `themechange` on `document` with `detail: { theme }`, ships `color-scheme` + icon-switching CSS (must be re-owned).
		- micromorph patches ONLY `<body>`; the `<html saved-theme>` attribute and head contents persist across SPA nav — no theme re-init logic needed anywhere.
		- Inline-script mechanism: `<script dangerouslySetInnerHTML>` in JSX (precedent `404.tsx`); `JSResourceToScriptElement` also supports `inline` resources. `beforeDOMLoaded` component scripts become EXTERNAL `prescript.js` — not guaranteed pre-paint.
		- remark42 is the ONLY `themechange` consumer in the repo (site code + node_modules searched).
		- No `font-size` on html/body anywhere (incl. popover.css); `line-height: 1.6rem` (length, not ratio) on p/li/tbody is a latent bug; table children use `2rem`.
		- `text-wrap: pretty` already exists on text elements; only `balance` (headings) is new. No article measure exists today — `.center`/`article` are constrained only by the grid track (`320px auto 320px`) and `.page`'s `calc(1200px + 300px)` cap.
		- Wide-content reality: `pre` and `.table-container` already have `overflow-x: auto` — wide blocks scroll internally (locked: no escape hatch at all).
		- `@quartz-community/favicon` emits a root `favicon.ico` that NOTHING references (Head links `static/icon.png`) — drop verified safe. No `theme-color` meta and no apple-touch-icon exist anywhere today.
			- Mermaid (CDN 11.4.0, bundled in `@quartz-community/obsidian-flavored-markdown`) — CHECKED (step 03, from bundle code): its inline script re-initializes on every `themechange` with `theme = saved-theme === "dark" ? "dark" : "base"`, while `themeVariables` are re-derived live from the CSS custom properties (`--light`, `--darkgray`, `--secondary`, …). So dark-low renders mermaid's light `"base"` theme but with dark-low's own palette variables — imperfect (no true dark mermaid theme) but coherent with the page and no broken/white diagrams. Proper dark-low mermaid theming remains a later change if it ever bothers.
		- The `unlisted: true` frontmatter flag exists (excluded from explorer/search/sitemap/RSS while still built) — test pages intentionally do NOT use it (published).
		- Phantom deps post-mortem (step 03 review): `@quartz-community/utils` declares `github-slugger` as an OPTIONAL peer but imports it unconditionally at module top level — a packaging bug upstream. It only worked because darkmode/favicon/excalidraw transitively provided it. Any future dependency removal can re-expose undeclared peers: after removing a package, run the full `npm test` immediately, not just the build.
	- **Locked HOW decisions (this flow):** toggle inserted via `loadQuartzLayout` (Head precedent) — not YAML, not frame JSX; `themechange` dispatches the RAW mode (remark42 narrows internally); stylesheet organization = hybrid (palette/accent vars in `theme.css`, rules in `base.css` or a new file — a new file costs one import + one array entry in the assembly); type scale BAKED as rem table; measure = 80ch absolute, no escape hatch; favicon = one fixed icon for all modes; theme-color = JS-refined by the toggle with build-derived values via an additive `ThemeData` field.
	- **`color-scheme` ownership:** darkmode package's bundled CSS owns `color-scheme: dark/light` + toggle icon switching — must be re-owned by the local component CSS, easy to forget.
	- **Contrast:** user checks manually (no audit script — rejected as headache given gradient plans). Serve loop already works and is tested.

---
---
---

## Steps


### %%◉ [STEP 99 - End Of The Phase](./steps/99-end.md) - IMPLEMENTED
The phase was archived, its project record and documentation aligned, and remaining observations left in the phase record by user decision. The user skipped review and retrospective.%%

=== INSERT STEPS HERE ===

### Drafted Steps Recommendation
%%Deleted — actual steps are being written now.%%

### %%◉ [STEP 07 - Favicon & Meta](./steps/07-favicon-meta.md) - IMPLEMENTED
A single favicon and an Apple touch icon were added, alongside browser-chrome colors that follow the selected theme. The user reports the result green; a locally installed Chrome app showing the old icon was deferred without a confirmed cause.%%

### %%◉ [STEP 06 - Background Bench](./steps/06-background-bench.md) - IMPLEMENTED
The scrolling gradient was chosen and grain discarded; the user observed no banding and reports `npm run check` green. Grain's effect on banding was not established, and print behavior remains unconfirmed.%%

### %%◉ [STEP 05 - Accent Layers](./steps/05-accent-layers.md) - IMPLEMENTED
Link design decided explicitly with the user in one pass before any values: external = solid thin underline, internal = dashed (broken = dashed + 0.5 opacity), tag links = chip without underline; the internal-link pill and its images-in-links exception removed. Full h1–h6 heading color ladder landed as `--heading-1..6` accent vars across all three mode blocks (dark & dark-low share one set) with per-level colors in `base.css` — values are deliberate temporary plumbing for the user's own eyeball pass. Selection reworked to a single rule (`--secondary` 35% translucent, `color: inherit`) that composes correctly on all three backgrounds, replacing the white-alpha mix that washed out on dark-low.%%

### %%◉ [STEP 04 - Typography](./steps/04-typography.md) - IMPLEMENTED
Latent bugs fixed first in `base.css`: `html { font-size: 22px }` is the single rem anchor, and the length-based line-heights (`p/li/tbody` 1.6rem, table children 2rem) are unitless ratios (`a.internal` 1.4 and the code figure 1.6 were already ratios). The baked 1.125-ratio heading scale (h1 2.027rem … h6 1.125rem, pond-insights verbatim) replaced the ad-hoc stock sizes, and the article-h1 2rem special case was removed as subsumed. Article content is capped at `max-width: 80ch; margin-inline: auto` with no escape hatch; headings gained `text-wrap: balance` (merged into the shared heading rule). Code-review outcomes folded in: body-level `line-height: 1.6` baseline so non-p/li containers (blockquotes, figcaptions) stop falling back to browser `normal`; inline `code` unified at `0.85em` to match `pre > code`; duplicate `position: relative` in the code-figure rule dropped; `popover.css` font-size/line-height resets removed entirely — the popover (appended into `body` by the client script) now inherits the 22px base + 1.6 rhythm, since its `font-size: initial` would have pinned text at the browser's 16px default and ignored the anchor. Open loop items: on the desktop grid the center track (~850px) is narrower than 80ch at 22px base, so the measure only binds on wide/minimal frames — verify the active knob in devtools and tune the right one; checkbox/theme-toggle px sizes are proportionally smaller against 22px text — eyeball on the lists page; `balance` weighs the heading's SVG anchor link when breaking multi-line headings — one devtools glance. Chrome remains verify-only per locked verdicts.%%

### %%◉ [STEP 03 - Theme System](./steps/03-theme-system.md) - IMPLEMENTED
Local `ThemeToggle` + colocated `themeContract.ts` replaced `@quartz-community/darkmode`: reused `theme` key (existing visitors migrate for free), OS seeds the initial value only, cycle light→dark→dark-low, `themechange` dispatches the RAW 3-value mode. Zero-flash init inlined in `Head.tsx` from contract constants; toggle inserted via `loadQuartzLayout` (left/toolbar, Head precedent); `color-scheme` + icon CSS re-owned (morphing SVG icon). remark42 guard widened then narrowed internally — and a mount-time binary-read bug found by review was fixed; `dist/` rebuilt + committed. Config dropped darkmode, favicon AND excalidraw; `github-slugger` made a declared root dep (phantom peer exposed by the removals); mermaid dark-low behavior checked & recorded; the `@quartz-community/types/globals` import landmine documented in `index.d.ts`.%%

### %%◉ [STEP 02 - Palette Foundation](./steps/02-palette-foundation.md) - IMPLEMENTED
Warm brown/golden starting ramp landed in `theme.css` for light and dark, plus the hand-written `:root[saved-theme="dark-low"]` block (5 ramp vars overridden, chromatic shared with dark, OG-contract comment on the block). `syntax.css` dark Shiki rules follow both dark variants via the explicit two-selector list. OG 2-palette contract pinned in `theme.test.ts` (fixture + real-file SSOT test); check/tests green. Clarified: og-image emits one image per page (single `colorScheme` option) — the 2-palette contract lives in the parser's data shape. Ramp values remain starting points, judged on the step 01 test pages across steps 02–05.%%

### %% ◉ [STEP 01 - Visual Test Pages](./steps/01-visual-test-pages.md) - IMPLEMENTED
Vault set created at `C:/Users/Taras/Documents/obsidian-vault/_static/markdown-tests/` — index + 5 grouped pages (type, lists, code/tables/mermaid, callouts/links, background sandbox), all with stable `id` frontmatter and relative-only internal links. Synced into `content/_static/markdown-tests/`, built, confirmed in sitemap, and verified on production: listed, comments widget loading, SPA navigation working. Local serve loop confirmed; content-only, no code touched.%%

### %%◎ [STEP 00 - Start Of The Phase](./steps/00-start.md) - IMPLEMENTED
The flow is to start the planning in the right state of mind and with the properly prepared phase%%



%%
### Info On Steps
- `state` - state of the step's contents
	- `condensed` or `◉` - after implementation's completion flow, state was condensed to be token-efficient. 
	- `full` or `◎` - high level and implementation blocks are written and step is ready for implementation.
	- `high-level` or `○` - only top high-level block is written and implementation block is not
	- `placeholder` - minimal file to just hold the place until there's time to do high-level/implementation blocks
- `status` - `ready/postponed/implemented/skipped` - self-explanatory statuses.
%%

---
---
---

## Meta-Plan Reflection
%%Plan structure, navigation, planning workflows, exploration, execution. Meta stuff. To improve meta plan%%
### User-issues
- 
### LLM-issues
- Where LLM had troubles with this "system of projects"? (if it had any)
	- 




