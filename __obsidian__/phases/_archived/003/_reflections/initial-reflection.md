---
ctime: 2026-11-05 08:25
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

### Origin of this phase
- I was lost in options about what to do next (Capture.md has ~50 ideas of very different weight).
- LLM reconciled Capture.md against the repo first — important because some items are already done (P002 covered SCSS, theming, fonts) and one item contradicts reality: breadcrumbs marked [DISCARDED] in Capture but `@quartz-community/breadcrumbs` is still **enabled** in config. That contradiction needs resolving at some point (not necessarily this phase).
- Debt sweep (CLI removal, 30 locales, dead files/deps, emojimap.json, config pruning) was proposed as phase 003 but I rejected it: it can be done later, nothing blocks on it, and I need **movement** — visual work produces something you can *see* at every step, which is fuel.

### The organizing principle for this phase
- Everything a first-time visitor's eye registers **before reading a single word**: color, type, density, background, tab icon.
- Anything *behavioral* (fold logic, image loading, buttons, sticky headings) → later UX phases.
- Anything *compositional* (homepage layout, cards, "doing now" hooks) → seDamnparate later phase.

### Phase composition (5 steps)
1. **Palette + 3 modes** — brown/golden/dark ramp in `theme.css`; replace the binary darkmode npm dep with a local 3-mode component (light / dark / dark low-contrast).
2. **Typography** — type scale from pond-insights (base 22px, ratio 1.125 minor second, h1 2.027rem … p 1rem) + reading measure (~50–75 chars/line, center column ~750px desktop; consider smaller base on phones).
3. **Accent layers** — colorful headings (colors from Obsidian + "minimal's config" as separate CSS snippet, cf. turntrout.com/design), link style (underline, never highlight whole link), selection styling.
4. **Background bench** — test gradient (dark bottom → lighter top, no banding) and/or grain. Also test **fixed gradient**: pinned to viewport so scrolling reveals solid color. All experiments, keep only what survives living with it. Grain is "just curious", not a commitment.
5. **Favicon** — AI-generated website-style colored [T] icon, done **last** because it needs the established look to generate from. Scope trap to avoid: favicon can silently expand into favicon + apple-touch + logo + OG image. Strictly tab favicon (+ cheap apple-touch resize). Logo/OG are separate later moments — OG already inherits palette via `theme.css` build parsing so it won't look broken meanwhile.

### Decisions already locked (during discussion)
- **Dark primacy**, but **full light-theme support** — light is not a second-class citizen.
- **Three modes**: light, dark, dark low-contrast. Dark low-contrast = background gets a bit brighter, contrast softened. 
- Background treatment = **experiment, not commitment** (test bench step).
- Ramp values = starting point from Capture.md + pond-insights, then **live tweaking in browser** — the exact values are an iterate-on-real-pages loop (look at journal entry, long note, homepage), not a one-shot decision.
- Font scaling is part of step 2 (same decision as measure: "what does a comfortable line of text look like").

### Three-mode difficulty assessment (from repo exploration)
- Short answer: **not hard — day-scale, not phase-scale**. But not pure CSS: the toggle is a binary npm package.
- Consumers of `saved-theme` attribute, all exact-match on `"dark"`:
	- `theme.css` → needs 3rd `:root` block with new ramp values (easy).
	- `syntax.css` → dark Shiki colors; extend selector to also match dark-low (cheap).
	- remark42 plugin browser code → maps `"dark"`→dark, everything else→light; needs one-line mapping so widget follows dark-low.
	- og-image build-time parser (`quartz/util/theme.ts`) → parses only light/dark two-palette; map dark-low→dark (correct — OG shouldn't have 3 variants).
	- `@quartz-community/darkmode` npm package → **the real problem**: bundled inline script hard-codes binary light↔dark cycle, localStorage key `theme`, OS-preference listener that **overrides even a stored choice**. Needs replacement with a local component (~100 lines). Given repo went rogue (no upstream mergeability goal), replacing a dep with local code is the natural direction.
- Cycle order decision: `light → dark → dark-low → light` feels natural — dark-low as extension of dark, not peer of light.
- OS-change listener semantics change with 3 modes: "follow OS" only makes sense between light/dark; dark-low should probably be **sticky** once chosen.
- Step 1 is now the biggest step (contains the only architecture change). If early momentum wanted: tweak palette values first (~30 min, immediately visible), then do 3-mode work on top.
- Designing 3 modes at once is a forcing function for a **systematic** ramp (derivable dark-low = same hues, lifted bg, softened contrast) instead of hand-tweaking per color.

### Explicit exclusions (scope creep guards)
- Homepage composition / cards / "doing now" hooks — depends on identity but is its own design problem.
- Component chrome polish (sidebar, explorer styling, footer) — infinite; follow-up after identity exists.
- Image treatment (radius, async loading, blur placeholders) — behavioral + media phase.
- Breadcrumbs decision — parked, not this phase.
- Debt sweep items — parked entirely.

### Open questions carried forward
- Exact ramp values (browser iteration loop).
- Gradient fixed vs scrolling vs none; grain yes/no — resolved by testing, not deciding upfront.
- Where the favicon generation happens (which AI tool / Dore's painting variations idea from Capture.md).

---

## Refinement pass (refining-reflection flow, integrated decisions)
%%Output of running the refining-reflection flow on this reflection. Possibilities were brainstormed, validated against the codebase, discussed; locked decisions below. Full scratchpad: `../artifacts/refining-possibilities-k3f9.md`%%

- **3-mode component goes into core Quartz (Route A), not a plugin.** Replace `@quartz-community/darkmode` with a local `quartz/components/ThemeToggle.tsx` owning the whole theme contract (attribute, storage, cycle light→dark→dark-low, OS seeds initial only, `themechange`). No plugin boilerplate — the repo went rogue. Placement: toolbar is assembled by `resolveGroups()` (config-loader) into a Flex rendered in `.left.sidebar` by `DefaultFrame.tsx`; step must briefly explore inserting into that Flex assembly vs directly in the sidebar JSX to pick the placement.
- **Palette token rename REJECTED** — user is fine with `--light`-is-background naming; ramp values get hand-tweaked without renaming slots.
- **Latent typography bugs fixed BEFORE the scale:** no base `font-size` exists (browser default 16px) — anchor must be chosen (html-level vs article-scoped, blast radius on component chrome); `line-height: 1.6rem` is a length not a ratio (breaks smaller elements like code) — convert to unitless in the same commit.
- **Reading measure: 80ch** (not 65ch — user's heavy indentation needs more width), article-scoped `max-width` so sidebars/frames untouched, + `text-wrap: balance` (headings) and `text-wrap: pretty` (paragraphs); escape hatch for wide content (tables/code).
- **Link design must be decided explicitly and early in the accent step** — current internal-link highlight pill directly contradicts "underline, never highlight whole link"; variants (broken links, tag links) need coherent treatment. Pill death is the default direction, decide consciously.
- **Zero-flash theme init:** inline script in `<head>` setting `saved-theme` before first paint (current setup uses external `prescript.js` — good but not guaranteed pre-paint). Constants colocated with the toggle component.
- **Favicon step extended cheaply:** `theme-color` meta per mode + SVG favicon (possibly with per-mode media query), values derived from the theme parser for auto-sync. Also candidate: **drop `@quartz-community/favicon` plugin entirely** — it generates a `favicon.ico` that `Head.tsx` doesn't even reference; likely dead weight.
- **Iteration infrastructure first (new step 0-ish):** serve loop already works — the real work is a **visual test page folder** (not one mega page): 3 list types, indentations, headings in and outside lists, codeblocks, mermaid, callouts, tables, links, etc. Needs its own dedicated planning block.
- **Contrast audit script REJECTED** — with gradient experiments planned it'd be a maintenance headache; user checks contrast manually, starting now.
- **`color-scheme` + mode CSS re-owned locally** as part of the component rewrite (package CSS owned `color-scheme` and icon switching — silent breakage if forgotten).
- **Remark42 guard nuance (step-level decision):** remark42's browser code validates `themechange` details and accepts only `"light" | "dark"` — an event carrying `"dark-low"` would be silently dropped. So either the new toggle dispatches the widget-facing value (normalizing dark-low → `"dark"` before/at dispatch), or remark42's `hasThemeDetail` guard is widened. The `index.d.ts` union update covers the type side; which side normalizes is decided during step-writing.
- **OG-image contract stays 2-palette:** parser already ignores a third block (validated); add a one-line comment (and optionally a test) stating extra `saved-theme` blocks are intentionally outside the OG contract.


---

## Locked verdicts (Stage E, integrated 2026-11-05)

%%Final user verdicts of the initial-planning flow. This is the record referenced by the plan's Persistent Storage.%%

1. ❌ **rejected** — user removed Goals/Visions-as-goals from the template: plans don't carry verifiable per-step goals. "Done when we're done"; user stays aware of the over-perfectioning risk.
2. ✅ **6-step inventory, strict dependency order**: 01 test pages → 02 palette+3-modes → 03 typography → 04 accents → 05 background bench → 06 favicon.
3. ✅ **reversed vs proposal** — test pages are intentionally **listed/published** (checked on production), NOT unlisted. They live in the vault at `C:/Users/Taras/Documents/obsidian-vault/_static/markdown-tests/` and reach `content/_static/markdown-tests/` via the syncer. No exclusion work at all.
4. ✅ **~5 grouped test pages** (type specimen; lists & indentation; code/tables/mermaid; callouts & links; background sandbox), step-owned; **relative links** (Obsidian relative-links setting + identical Quartz parsing).
5. ✅ **Mermaid dark-low edge case**: check & record this phase; proper handling likely in a later change. (Validated: mermaid CDN script picks `theme:"dark"` only when `saved-theme === "dark"`, else `"base"`.)
6. ✅ **reversed vs proposal** — test pages SHOULD carry comments: frontmatter `id` on each page (future comment-style testing). The original "no id" hygiene rule is dead.
7. ✅ **accepted both parts**: (a) zero-flash **inline init script in `Head.tsx`** with constants shared with the toggle via build-time import (inline precedent: `404.tsx`; validated that component `beforeDOMLoaded` strings go to external `prescript.js`, which is not guaranteed pre-paint); (b) **remark42 normalized at dispatch** (toggle sends widget-facing `"dark"` for dark-low; remark42 guard stays untouched). %%UPD: clause (b) superseded by HOW-pass verdict 2 below — the guard is widened + narrowed internally instead.%% CSS remains the styling SSOT (`theme.css`); the toggle component module is the single owner of the JS-side contract.
8. ✅ **dark-low = minimal derivation over the dark block** — only text-ramp vars overridden, chromatic values shared with dark.
9. ❌ **dissolved** — font-size is one page-wide knob anchored at **html level**; rem-sized chrome is verified during the normal iteration loop. No A/B ritual.
10. ✅ **as architecture, out of phase 003 scope** — `__obsidian__/docs/DECISIONS.md` decision-log convention proposed; user will add the flow-level change to meta-planning iterations manually.

**Extra folded decision:** drop `@quartz-community/favicon` inside step 02's `quartz.config.yaml` edit (alongside `@quartz-community/darkmode` removal) — one config-touch instead of two.

**Open for step-writing only:** toggle placement (Flex assembly vs sidebar JSX in DefaultFrame). %%RESOLVED by HOW-pass verdict 3 below — loader insertion (a′).%%

---

## Locked verdicts — HOW pass (implementation, 2026-11-05)

%%User verdicts of the second initial-planning run focused on HOW to implement the locked WHATs above. Supersedes any conflicting detail above (notably verdict 7b). Scratchpad artifact: `../artifacts/implementation-possibilities-q7z2.md` (write-once).%%

1. ✅ **Theme contract colocated module** — one module next to `ThemeToggle` owns the whole JS-side contract (storage key, attribute, modes, cycle, OS-seed rule, inline-init snippet); `Head.tsx` imports the constants at build time and renders the init via `<script dangerouslySetInnerHTML>` (404.tsx precedent). Storage key `theme` reused → existing visitors' stored choice migrates for free. OS listener seeds initial only (replaces the dep's overwrite-on-OS-change behavior).
2. ✅ **`themechange` dispatches the RAW mode** (`"light" | "dark" | "dark-low"`; `index.d.ts` widened). remark42's guard accepts all three and NARROWS internally to `"light" | "dark"` (dark-low → `"dark"`) before `changeTheme` — the event becomes a reliable styling hook for future plugin-styling phases, and future consumers never need workarounds. Costs `npm run build:plugins` + committed `dist/` in step 02.
3. ✅ **Toggle placement = loader insertion (a′)** — `loadQuartzLayout` imports `ThemeToggle` into the `left` position at the toolbar priority, exactly like `Head` is assigned today. The component registry is not seeded with core components (verified), so YAML placement is unavailable; frame JSX stays untouched. Not locked against future relocation — chosen as the least-mess path now.
4. ✅ **Stylesheet organization = hybrid** — palette/accent color variables live in `theme.css` (they're theme-category), accent rules live in `base.css` or a new file (a new file = one import + one array entry in the `componentResources.ts` assembly — verified nearly free).
5. ✅ **Dark-low block hand-written** — minimal derivation over dark: text ramp + lifted `--light` background, chromatic shared; `syntax.css` gets explicit `[saved-theme="dark"], [saved-theme="dark-low"]` selectors (no prefix trick); OG-contract comment at the block.
6. ✅ **Fixed pseudo-element = background TESTING mechanism only** — `body::before { position: fixed; inset: 0; z-index: -1 }` instead of `background-attachment: fixed` (mobile jank). NOT a commitment: gradient (fixed/scrolling/none) and grain (yes/no; doubles as banding dither via SVG `feTurbulence`) are decided by living with them; verdict recorded, losers deleted.
7. ✅ **Type scale BAKED** as a rem table (base 22px, ratio 1.125); no calc-derivation — the ratio won't change often and values will be hand-tweaked anyway.
8. ✅ **Measure = 80ch absolute, NO escape hatch** — wide blocks (`pre`, `.table-container`) already scroll internally via `overflow-x: auto`; the column never stretches. An escape hatch can be added later if living with it proves bad.
9. ✅ **OG 2-palette pinned by test** — dark-low block added to `theme.test.ts`'s inline fixture + a two-palette assertion; the real-file SSOT test auto-guards the real third block.
10. ✅ **Favicon & theme-color = full (b)** — the toggle JS-refines `<link rel="icon">` + `theme-color` on every mode change; values build-derived via an additive `ThemeData` field (verified safe: og-image reads specific palette keys only); a media-query pair ships as the no-JS/static default either way; the favicon plugin drop is verified safe (its `favicon.ico` output is referenced by nothing).
