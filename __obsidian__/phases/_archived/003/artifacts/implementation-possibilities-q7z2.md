# Implementation Possibilities — Phase 003 (HOW pass)

%%Scope: the locked WHATs from `../_reflections/initial-reflection.md` (Refinement pass + Locked verdicts) are fixed input. This artifact explores HOW to implement them. Write-once: never edited after creation; locked results go only into the plan/steps.%%

---

## B1 — Self-reflective exploration (questions, no answers)

### Theme contract & toggle (step 02)
- Where exactly does the zero-flash inline init live, and how do its constants (storage key, attribute, mode list) stay in sync with the toggle component? Options floating: build-time import into `Head.tsx` JSX string vs esbuild `define` vs duplicated literals.
- Is a plain TS import into `Head.tsx` enough (Head renders to string in Node at build time — no browser bundling involved for the inline string)?
- Does `saved-theme` need re-application after SPA nav? (micromorph patches only the body; `<html>` attribute should persist — verify, don't assume)
- OS-listener semantics: "OS seeds initial only" — does the matchMedia listener get removed after seeding, or kept but ignored once a stored choice exists? Interplay with dark-low stickiness (locked: dark-low is sticky)?
- Storage key: reuse the old darkmode dep's key `theme` so existing visitors' stored choice migrates for free, or fresh key (clean but resets everyone to OS seed on first visit after deploy)?
- Icon implementation: per-mode inline SVGs swapped by CSS attribute selectors vs one morphing SVG vs JS-swapped `src`. Who owns `color-scheme` declarations — per-block in `theme.css` (styling SSOT) vs the toggle component CSS?
- `themechange` payload: verdict 7 says normalize dark-low → `"dark"` at dispatch (remark42 guard untouched); plan exploration says widen `index.d.ts` union to include `"dark-low"`. Both can't describe the same event payload. What is the contract?
- Does the toggle need its own CSS file at all, or can icon/color-scheme CSS live in `theme.css`/`base.css`?

### Palette & dark-low (step 02)
- "Only text-ramp vars overridden, chromatic shared" — but the locked description also says the *background* gets brighter. Does `--light` (bg slot) count as part of the overridden set? Needs an explicit list for the third block.
- `syntax.css` dark selector: explicit two-selector list vs `[saved-theme^="dark"]` prefix trick.
- og-image parser: confirm by construction (`extractBlock` regexes) that a third block can't be matched; what's the cheapest pin (comment vs test fixture)?

### Typography (step 03)
- html-level `font-size: 22px`: any reason to prefer `%`/`rem`-on-html form? Blast radius on rem-sized chrome (6rem paddings etc.) — accepted via verdict 9, but worth listing what gets eyeballed.
- `line-height: 1.6rem` → unitless: one value for p/li/tbody or per-element? What does the table's `2rem` become?
- Scale encoding: baked rem table (typescale.com values verbatim) vs `--ratio`/`--base` + `calc()` derivation.
- Measure: where does `max-width: 80ch` attach (`.center > article`)? How does it interact with the grid's auto center column and the 1200px page max?
- Wide-content escape hatch: `:has(pre, table, .mermaid)` auto-widening vs frontmatter flag vs the existing full-width frame — which mechanics?

### Accents (step 04)
- Colorful headings: hand-bake an accent tier into `theme.css` as named vars (pond-insights naming suggestion) vs raw hex inline in a rules file.
- New stylesheet file(s) (`accents.css`, background later) → touches the vendored assembly argument order in `componentResources.ts`; vs growing `base.css` (~600 lines already). Which trade?
- Link rework ("pill death"): what's the full treatment matrix — internal, external, broken, tag-link, `:has(> img)` exception, hover state? Underline thickness/offset for 22px base?

### Background bench (step 05)
- Fixed gradient: `background-attachment: fixed` vs `position: fixed` pseudo-element layer — mobile Safari repaint behavior.
- Banding: does the grain layer double as dithering, or is a separate subtle noise needed even when grain is rejected?
- Grain source: SVG `feTurbulence` data-URI in CSS vs generated tiny PNG asset in `static/`. Per-mode intensity?

### Favicon & meta (step 06)
- SVG favicon with embedded `prefers-color-scheme` media query covers OS-based modes only; user-chosen dark-low won't be reflected unless JS swaps the `<link rel="icon">`. How far to go?
- `theme-color` meta: static light/dark media pair vs JS-updated on mode change; where do the color values come from — extend `parseThemeData` (additive) or hardcode?
- `@quartz-community/favicon` drop: verify nothing references its `favicon.ico` output before deleting.

---

## B2 — Possibilities list (formatted points)

### [ARCHITECTURE] Theme contract as one colocated module
- **Description** — All JS-side theme logic (storage key, attribute name, mode list, cycle order, OS-seeding rule, inline init snippet) lives in a single module colocated with the new `ThemeToggle` component; `Head.tsx` imports the constants at build time to render the inline script.
- **How To Do This** — Export `THEME_KEY` / `THEME_ATTR` / `MODES` / cycle from the toggle module; `Head.tsx` (renders to string in Node at build time) builds the inline script as a template literal from those constants and emits it via `<script dangerouslySetInnerHTML>` following the `404.tsx` inline precedent. Decide the storage key: reusing the old dep's `theme` key migrates existing visitors' stored choice for free.
- **Benefit** — Contract drift becomes structurally impossible: the toggle, the pre-paint init, and any future consumer all read one source. The whole mode system is documented in one file, which is exactly what a "went rogue" repo needs since there's no upstream contract to lean on.
- **Complexity** — Low-to-medium. The code itself is small (~100-line component, one inline snippet); the risk is verification work: confirming the string truly lands pre-paint, that Preact's script escaping behaves, and that nothing re-initializes after micromorph nav (html attribute should persist — verify).
- **Closed Advantageous Doors** —
    - External `prescript.js`-style init (reintroduces the not-guaranteed pre-paint the inline approach exists to kill).
    - Moving theme config into `quartz.config.yaml` (recreates the cfg.colors chain the repo already killed).
- **Description In Simpler Terms** — One file owns everything about "which mode is on and how it gets set before the first paint". Nothing else is allowed to know these details, so no two pieces of the site can ever disagree about the theme.

### [ARCHITECTURE] `themechange` payload contract — resolve the verdict-7 vs widened-union tension
- **Description** — Locked verdict 7 says the toggle normalizes dark-low → `"dark"` at dispatch (remark42's guard stays untouched), while the plan's exploration section says `index.d.ts`'s `themechange` union becomes `"light" | "dark" | "dark-low"`. Both cannot describe the same event payload — the contract must be picked deliberately, not drifted into.
- **How To Do This** — Options: (a) dispatch only the widget-facing normalized value (`"dark"` for dark-low) and leave the union at two values — simplest, remark42 just works; (b) dispatch the raw mode in `detail.theme` plus a second field (e.g. `detail.widgetTheme`) for normalized — honest but two fields to maintain; (c) dispatch raw and widen remark42's guard — contradicts locked verdict 7. Decide during step-writing; document the choice in the toggle module.
- **Benefit** — remark42 keeps working without touching its committed `dist/`; future consumers get a predictable event. Making the payload contract explicit prevents the classic silent-drop bug (an event value a guard doesn't recognize is ignored without any error).
- **Complexity** — Trivial code-wise; the cost is a conscious decision plus a doc comment. Option (b) also implies updating `hasThemeDetail`-style guards in any consumer.
- **Closed Advantageous Doors** —
    - (a) closes other consumers distinguishing dark-low from dark *via this event* (they can still read the `saved-theme` attribute).
    - (b) commits every future consumer to understanding a two-field payload.
- **Description In Simpler Terms** — Decide what the single "theme changed" announcement actually says when the new third mode is active: does it say "dark-low" honestly, or tell comment widgets "dark" so they understand it?

### [ARCHITECTURE] Toggle placement: Flex group member vs hardcoded sidebar JSX
- **Description** — The old darkmode dep reaches the page as a `toolbar` Flex group member assembled by `resolveGroups()` from `quartz.config.yaml`. The replacement can either keep that mechanism (register component + YAML layout entry) or be rendered directly in `DefaultFrame.tsx`'s `.left.sidebar` JSX.
- **How To Do This** — (a) Config path: register the component in the component registry, add a YAML entry with `group: toolbar` where darkmode's entry sits now. (b) Direct path: render `<ThemeToggle />` inside `DefaultFrame`'s left sidebar and delete the YAML entry along with the darkmode one.
- **Benefit** — (a) preserves YAML-driven repositioning and the group/grow semantics (search grows in the same row). (b) removes registry indirection and one config surface; given the repo explicitly dropped upstream mergeability, direct rendering is the smaller, more honest system.
- **Complexity** — Both low. (b) needs a check of mobile layout: `.sidebar.left` becomes a horizontal row on mobile, so ordering/basis of the toggle within it must be eyeballed.
- **Closed Advantageous Doors** —
    - (b) closes YAML-driven repositioning of the toggle and makes extracting it back into a plugin later harder.
    - (a) perpetuates the config-loader indirection for a single core control.
- **Description In Simpler Terms** — Either keep the button as a configurable "slot" in the site's settings file, or nail it directly into the page frame's code. Nailing it is simpler; the slot is more flexible.

### [SIMPLIFICATION] Stylesheet organization: new files vs folding into existing files
- **Description** — Accent layers (step 04) and background experiments (step 05) add real CSS. Adding new files means editing the vendored assembly argument order in `componentResources.ts`; folding means growing already-large files.
- **How To Do This** — (a) New `accents.css` (and later `background.css`) appended to the assembly argument list after `base.css`, documented in `styles/README.md`'s cascade section. (b) Sections inside `base.css` under clear banner comments. (c) Hybrid: accent *color variables* in `theme.css` (palette SSOT), accent *rules* in `base.css`.
- **Benefit** — (a) keeps the styles module's file semantics clean (each file = one concern), matching the README's design intent; (c) keeps palette values in the SSOT so build-time parsing sees them.
- **Complexity** — (a) is a one-line-but-structural edit to a vendored emitter plus a README update; (b) is zero-risk mechanically but continues bloating a 600-line file.
- **Closed Advantageous Doors** —
    - (b) closes later per-file layering granularity (can't reorder/relayer accents independently).
    - (a) commits to maintaining the assembly-order documentation as files multiply.
- **Description In Simpler Terms** — New stylesheet files are tidier but require touching the build's "glue the CSS files together" code once; stuffing everything into the big existing file avoids that but makes it messier over time.

### [ROBUSTNESS] Dark-low block authoring + `syntax.css` selector strategy
- **Description** — Dark-low is a minimal derivation over the dark block (locked): a third `:root[saved-theme="dark-low"]` block overriding only the ramp + background, sharing chromatic values with dark. `syntax.css`'s dark Shiki rules must match both dark modes.
- **How To Do This** — Write the third block by hand with an explicit list of overridden variables (`--light` lifted background counts as part of the derivation even though it's not a "text" color — make the block's comment say exactly which vars are intentionally included). For `syntax.css`, use the explicit selector list `[saved-theme="dark"], [saved-theme="dark-low"]` rather than the obscure `[saved-theme^="dark"]` prefix match. Add the one-line comment near the block: extra `saved-theme` blocks are intentionally outside the OG-image contract.
- **Benefit** — Explicit list is self-documenting and future-proof for review; the parser's regexes (`:root\s*\{` and the exact dark selector) cannot match the new block by construction, so og-image stays a 2-palette contract without any code change.
- **Complexity** — Trivial. The only real work is the ramp values themselves, which are the browser-iteration loop anyway.
- **Closed Advantageous Doors** —
    - The prefix-selector trick (worse readability, breaks if a mode named `darkish-light` ever existed).
    - Build-time generation of the third block (unnecessary machinery for ~6 declarations).
- **Description In Simpler Terms** — Write the third color scheme by hand, copying the dark block and changing only the handful of values that make it softer; make code-block colors follow both dark variants by listing both in the selector.

### [PERFORMANCE] Fixed gradient via a fixed pseudo-element, not `background-attachment: fixed`
- **Description** — The background bench includes a viewport-pinned gradient variant. The classic `background-attachment: fixed` is notoriously janky/ignored on mobile Safari and can force repaints on scroll.
- **How To Do This** — Keep `body { background-color: var(--light) }` as the solid base; add `body::before { content: ""; position: fixed; inset: 0; z-index: -1; background: linear-gradient(...) }` driven by palette vars (per-mode gradient values in `theme.css`). Layer grain as a second background layer on the same pseudo-element — an SVG `feTurbulence` data-URI — which also serves as banding dithering.
- **Benefit** — Buttery scroll in every browser including iOS; one element carries both gradient and grain so the experiments compose naturally; per-mode values stay in the styling SSOT.
- **Complexity** — Low. Main care points: z-index stacking against existing fixed elements (navigation progress bar), and checking that `content-visibility`/overflow patterns in `base.css` don't clip the layer.
- **Closed Advantageous Doors** —
    - `background-attachment: fixed` one-liner (simpler but worse cross-platform).
    - Per-section/diagonal background art later (would need a different mechanism than one full-viewport layer).
- **Description In Simpler Terms** — Pin the gradient with an invisible fixed layer behind everything, instead of the classic "fixed background" CSS trick that is buggy on phones. The same layer can carry the grain texture, which also hides gradient banding.

### [TYPOGRAPHY] Scale encoding: baked rem table vs calc-derived
- **Description** — The 1.125-ratio scale (base 22px, h1 2.027rem … small 0.889rem) can be baked verbatim or derived from `--base`/`--ratio` via `calc()`.
- **How To Do This** — Bake the typescale.com values into `base.css` heading rules (replacing stock 1.75/1.4/1.12rem…), with `html { font-size: 22px }` as the anchor and a mobile media query dropping the anchor (e.g. 20px) if the iteration loop says so. Keep a comment linking back to `pond-insights.md` for the ratio rationale.
- **Benefit** — Zero abstraction: every size is greppable and hand-tweakable in the browser-iteration loop, which is exactly the locked working style ("live tweaking"). A calc system pays off only if the ratio itself is expected to change often.
- **Complexity** — Trivial either way; baked is fewer moving parts.
- **Closed Advantageous Doors** —
    - "Change ratio once, everything re-derives" workflow (irrelevant if values end up hand-tuned off-ratio anyway — which the iteration loop encourages).
- **Description In Simpler Terms** — Hardcode the size table instead of building it from a formula. Since the values will be tweaked by eye anyway, a formula would just be a second thing to keep in sync.

### [TYPOGRAPHY] Measure implementation + wide-content escape hatch mechanics
- **Description** — Article-scoped `max-width: 80ch` (locked) plus an escape hatch for wide content (tables, code, mermaid).
- **How To Do This** — `.center > article { max-width: 80ch; margin-inline: auto; }` (+ `text-wrap: balance` on headings — `pretty` on paragraphs already exists in `base.css`). Escape hatch options: (a) `:has(pre, .table-container, .mermaid)` auto-widening — fragile and all-or-nothing, can cause layout jumps; (b) frontmatter flag → page class (explicit, per-page control); (c) rely on the existing full-width frame for extreme pages. Lean (b) or (c); decide during step-writing after seeing real wide content on the test pages.
- **Benefit** — Reading measure lands exactly where the content lives, leaving sidebar/grid untouched; an explicit escape hatch keeps the cap honest instead of silently dissolving wherever one table appears.
- **Complexity** — Low; the interplay to verify is the grid's auto center column and mobile (where the measure may exceed the viewport and should just be `100%`).
- **Closed Advantageous Doors** —
    - (a) closes fine-grained per-page control and risks reflow jumps when a wide block is far down the page.
    - (b) adds small authoring ceremony per wide page.
- **Description In Simpler Terms** — Cap the text column at roughly 80 characters for comfortable reading, and give individual pages with huge tables or code a deliberate way to use more width — rather than the layout auto-deciding and jumping around.

### [BLIND SPOT] Favicon & theme-color per-mode strategy
- **Description** — A static SVG favicon with an embedded `prefers-color-scheme` media query covers OS-based modes, but the user's *chosen* mode (dark-low) isn't reflected in the tab unless JS swaps the icon; `theme-color` (mobile browser chrome) has the same mismatch.
- **How To Do This** — (a) Cheap: single SVG favicon with an internal `@media (prefers-color-scheme: dark)` block; static `<meta name="theme-color">` pair with media attributes. (b) Full: the toggle (which already knows the mode) also swaps `<link rel="icon">` and updates `theme-color` on every mode change; color values exported at build time by extending `parseThemeData` additively (e.g. a `chrome` section) so they can't drift from `theme.css` — without touching the og-image 2-palette contract.
- **Benefit** — (b) makes the browser tab always match the chosen mode — a small but very visible "this site is considered" signal, aligned with the phase's vision; build-derived values keep the SSOT honest.
- **Complexity** — (a) trivial; (b) low-medium: parser extension + a hook in the toggle's mode-change path + no-JS fallback decision (ship the media-query pair as the static default regardless).
- **Closed Advantageous Doors** —
    - (a) closes exact per-mode tab fidelity (acceptable fallback: ship both — media-query defaults + JS refinement).
- **Description In Simpler Terms** — The little icon and address-bar color in the browser tab can automatically follow the visitor's chosen mode, but only with a few lines of JS; without it they follow the operating system's setting, which is usually right but not always.

### [SAFETY] Pin the OG 2-palette contract with a test fixture
- **Description** — The og-image parser must keep returning exactly two palettes even after `theme.css` grows a third block. Currently true by construction (regexes), but nothing asserts it.
- **How To Do This** — Extend `quartz/util/theme.test.ts`: fixture CSS containing light + dark + a realistic `dark-low` block; assert `parseThemeData` returns exactly light/dark palettes with unchanged pinned values. Optionally one more test: a `--light:`-style comment inside the dark-low block must not leak into parsed values (parser strips comments — pin that too).
- **Benefit** — Future palette edits (which this phase will do a lot of) can't silently change og-image output or trip the parser; the "extra blocks are intentionally outside the OG contract" decision becomes executable documentation.
- **Complexity** — Trivial; the test file already exists and pins real values on purpose.
- **Closed Advantageous Doors** — None meaningful.
- **Description In Simpler Terms** — Add a small automatic check that proves adding a third color mode doesn't confuse the social-media image generator.
