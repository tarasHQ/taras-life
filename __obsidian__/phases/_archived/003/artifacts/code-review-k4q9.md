# code-review-k4q9 — step 03 (theme system) — bug hunt only

%%Write-once temp artifact (C1 exploration → C2 appended points). Never edited after C2.%%
%%Scope per user: bugs only; no style/refactor/design points.%%

## C1 — Self-reflective exploration (questions only, no answers)

- ### Contract module (`quartz/components/scripts/themeContract.ts`)
	- Does the inline init script handle every failure path (localStorage throw, matchMedia throw, stale stored value) without ever leaving the attribute unset or set to an invalid mode?
	- Is the OS-seed rule implemented exactly as locked (seed only when nothing valid stored, no persistent listener)?
	- Does the delegated click listener survive micromorph body patches, and can it double-register anywhere (dedup, multiple component instances)?
	- Does `readMode`'s "missing attribute → light" fallback ever disagree with the CSS default (`:root` = light)?
	- Is the claim about `*.inline.ts` export-stripping (the reason for the plain `.ts` name) accurate against `quartz/cli/handlers.js`?
	- Any browser that chokes on the ES5-style script bodies?

- ### `ThemeToggle.tsx` + `theme-toggle.css`
	- Does every `saved-theme` value (incl. missing attribute) have an icon branch, or does a glyph leak?
	- Is `import toggleStyles from "./styles/theme-toggle.css"` actually supported by this repo's build pipeline (esbuild loaders), or is this component the first/only css-as-string import — potential build breaker?
	- Does the component CSS survive Lightning CSS minification and land where the `:root[saved-theme=...]` selectors still match (layering vs theme.css)?
	- Is the "geometry mirrors the replaced darkmode package (20×32)" claim verifiable or just asserted?

- ### `Head.tsx` inline init
	- Is the script truly placed before the stylesheet links in emitted HTML (pre-paint guarantee)?
	- On SPA nav the `<head>` is patched — does the inline script re-execute, and is re-execution harmless (idempotent re-read of storage)?
	- Does the comment reference the right contract file path?

- ### Loader insertion (`config-loader.ts`)
	- Is the toggle seeded into `left` for **every** `buildLayoutForEntries` call (default + per-page-type), or can a page-type override silently drop it?
	- Does a `positions: { left: [] }`-style clearing override wipe the core component too — and is that semantics intended?
	- Is the toolbar group placement (`priority 30`, `group: "toolbar"`) faithful to where the old dep sat — verifiable without git history?
	- Does the import path (`../../components/ThemeToggle`) resolve correctly from `quartz/plugins/loader/`?

- ### remark42 adaptation (`custom-plugins/remark42/src/browser.ts`)
	- **Mount-time theme mapping**: does `currentTheme()` handle `dark-low`, or does it fall into the binary `=== "dark"` check and yield `"light"` on initial mount?
	- Does the widened `hasThemeDetail` guard accept all three raw modes, and is the internal narrowing a real type guard (no `as` narrowing)?
	- Is the committed `dist/` actually rebuilt (contains `dark-low`), so `verify:dist` passes?
	- Does the mount-time mapping and the event-time mapping (`toRemarkTheme`) agree with each other?

- ### `theme.css` — `color-scheme` re-ownership
	- Do all three blocks declare it (light/dark/dark-low→dark)?
	- Does the newly added non-variable declaration inside `:root` / `:root[saved-theme="dark"]` interact badly with the og-image parser (`quartz/util/theme.ts`) or the real-file SSOT test in `theme.test.ts`?

- ### Config cleanup
	- Are both plugin entries (`darkmode`, `favicon`) gone from `quartz.config.yaml`?
	- Is `darkmode` gone from `package.json` **and** `package-lock.json`?
	- Is `favicon` gone from `package.json`/lockfile too — or is a dead dependency left shipping?
	- Does anything still reference the favicon plugin's emitted `favicon.ico`?

- ### Types / consumers
	- Is the `index.d.ts` union widened to the raw 3-value mode?
	- Are there OTHER consumers of `saved-theme` or `themechange` in the repo (excalidraw plugin's `darkMode: auto`, search, graph, etc.) that still assume the binary light/dark world and would misbehave under `dark-low`?
	- Does the remark42 `SiteThemeMode` mirror of the `index.d.ts` union have a drift guard?

- ### Step bookkeeping
	- Was `__obsidian__/docs/DEV_RULES.md` §Rendering Model 4 actually aligned (attribute/storage ownership retargeted)? Current file shows no trace of such guidance — removed or never done? (No git access to verify.)
	- Which end-to-end verification items (fresh visit, migration, zero-flash ×3, remark42 ×3, check/test/build) remain unproven without a running build/browser?

---

## C2 — Drafted bug list (bugs only, per user scope)

### [BUG] remark42 mounts the widget as `light` while the page is in `dark-low`
- **Description** — `currentTheme()` in `custom-plugins/remark42/src/browser.ts` maps the mount-time attribute with a binary check: `getAttribute("saved-theme") === "dark" ? "dark" : "light"`. Under `dark-low` it returns `"light"`, so every widget mount (initial viewport-gated mount **and** every SPA remount, since each mount re-reads `currentTheme()`) injects `theme: "light"` into `remark_config` while the page renders dark-low.
- **How To Do This** — Route `currentTheme()` through the same narrowing used for events: read the raw attribute, validate it against the 3-value set, and map `dark-low → "dark"` (i.e. reuse/parametrize `toRemarkTheme`, e.g. `toRemarkTheme(readSiteTheme() ?? "light")`). Rebuild + commit `dist/`.
- **Benefit** — Removes the exact failure class this step existed to prevent: the widget's `colorScheme`/iframe is created against the wrong theme, giving a light comments block (or a light flash) on a dark-low page — persistently, until the visitor happens to click the toggle. The event path is already correct; this fixes the mount path to match it.
- **Complexity** — Trivial: a few lines in one function, reusing the existing mapping; one plugin rebuild + `dist/` commit (already the established flow).
- **Closed Advantageous Doors** — None of substance; if anything it *opens* the door to later mode-aware widget behavior since the read path becomes mode-aware instead of binary.
- **Description In Simpler Terms** — When the comments widget first appears on screen, it asks "what theme is the site in?" — but it only knows the words "light" and "dark". In the new third mode (`dark-low`) the answer it computes is literally "light", so the comments load in the wrong look. The click-driven path already translates the new mode correctly; the first-appearance path was never updated to do the same.

### [BUG] `@quartz-community/favicon` left as a live dependency after its config entry was deleted
- **Description** — The step deleted the `@quartz-community/favicon` entry from `quartz.config.yaml` (and the darkmode dep was uninstalled from `package.json` + lockfile), but `@quartz-community/favicon` is still listed in `package.json` dependencies and still present in `package-lock.json` — a dead dependency that ships in the lockfile and installs on every `npm ci` (CI included).
- **How To Do This** — `npm uninstall @quartz-community/favicon` (regenerates both `package.json` and `package-lock.json`); confirm nothing in build output references the root `favicon.ico` it used to emit (step facts say nothing does — `Head.tsx` links `static/icon.png`).
- **Benefit** — Lockfile/dependency truth: CI installs, audits, and Renovate-style bumps stop carrying a package that can never run; removes a future confusion trap ("why is this installed?"). Also aligns the tree with the step's own stated intent ("both dead after this step").
- **Complexity** — One command + lockfile review; zero runtime risk since the plugin is disabled/removed from config.
- **Closed Advantageous Doors** — Only closes the (rejected-by-config) ability to re-enable the favicon plugin without reinstalling; step 07 builds its own favicon approach, so nothing is lost.
- **Description In Simpler Terms** — We fired the favicon package from its job, but it's still on the payroll: every clean install still downloads and pins it. One command removes it for good.

### [BUG — to validate] `color-scheme` lines inside `theme.css` `:root` blocks vs the og-image parser and the SSOT test
- **Description** — The re-owned `color-scheme: light/dark;` declarations are the first non-`--variable` declarations inside the three `:root` blocks of `theme.css`. The build-time og-image parser (`quartz/util/theme.ts`) and the real-file SSOT test (`quartz/util/theme.test.ts`) were written against variable-only blocks (step 02 state); whether their regexes tolerate interleaved non-variable declarations is unverified. If the parser captures block content wholesale or asserts on structure, the added lines could shift parsed values or fail the test.
- **How To Do This** — Read the parser's block-matching/variable-extraction regexes in `quartz/util/theme.ts` and the real-file SSOT test's assertions in `theme.test.ts`; confirm `color-scheme` lines are ignored by construction; if they're not, scope the parser to `--` prefixed declarations.
- **Benefit** — Protects the pinned 2-palette OG contract and keeps `npm test` green; verifies the "parser untouched" invariant actually holds with the new lines present.
- **Complexity** — Read-only verification; likely a non-issue (parsers typically match `--var: value` patterns), but the cost of being wrong is a broken build or a silently wrong OG palette.
- **Closed Advantageous Doors** — None.
- **Description In Simpler Terms** — The build step that generates social-media preview images "reads" the theme file with a pattern-matching rule written before we added the new lines. We need to confirm it ignores those lines rather than choking on them or picking up wrong values.

### [BUG] Stale contract-path comment in `Head.tsx`
- **Description** — The zero-flash comment in `Head.tsx` says the contract is "owned by components/scripts/theme.inline.ts" — the actual contract module is `components/scripts/themeContract.ts` (the `.inline.ts` name was rejected during implementation, per the contract module's own NOTE). A comment pointing at a nonexistent file actively misleads the next reader.
- **How To Do This** — Update the comment to name `themeContract.ts`.
- **Benefit** — Comments are load-bearing here (they encode the single-owner invariant); a wrong path breaks the "quickly understand without reading every line" contract.
- **Complexity** — One-line edit.
- **Closed Advantageous Doors** — None.
- **Description In Simpler Terms** — A note in the code points to a file that doesn't exist (the plan changed during implementation). Fix the note.

### [BUG — minor] `hasThemeDetail`'s `as` casts lack the boundary-justification the file's other casts carry
- **Description** — `custom-plugins/remark42/src/browser.ts` establishes a convention (with explicit justifying comments) that `as` is only legitimate at validated boundaries: `getRemark42Global`/`setWindowRemarkConfig` carry "Same boundary as…" comments. `hasThemeDetail` uses `(event as { detail?: unknown }).detail` and `(detail as { theme?: unknown }).theme` with no such comment — cast-then-check rather than check-then-cast, which sits in tension with DEV_RULES §3's letter ("`as` only where a runtime check has already established the shape").
- **How To Do This** — Either add the same one-line boundary-justification comment ("reading a possibly-absent property off an untyped Event; the guard below establishes the shape"), or restructure to a runtime-safe property read without casts.
- **Benefit** — Keeps the file's own documented discipline intact; the pattern exists precisely so future readers don't learn "casts are fine here" from an uncommented example.
- **Complexity** — A comment or a small refactor; trivial.
- **Closed Advantageous Doors** — None.
- **Description In Simpler Terms** — The file has a rule about when a certain shortcut is allowed, and explains it every time it's used — except in one place, where the shortcut appears with no explanation.

### [BUG — edge] Excalidraw embeds follow the OS theme, not the site theme, under `dark-low`
- **Description** — `@quartz-community/obsidian-plugin-excalidraw` is configured with `darkMode: auto`, which (per its own semantics) keys off `prefers-color-scheme`, not `saved-theme`/`themechange`. With the OS on light and the visitor on `dark-low`, diagrams render light on a dark page. The step locked "no new themechange consumers", so this may be consciously deferred — but it was neither checked nor recorded the way the mermaid edge case was.
- **How To Do This** — Verify the plugin's actual darkMode source (OS vs attribute), then either record the observation next to the mermaid verdict in the plan's Exploration notes (consistency with locked verdict 5's treatment) or defer explicitly to a later step.
- **Benefit** — Closes an unrecorded dark-low visual edge case of the same class the step promised to check and record (mermaid got that treatment; excalidraw did not).
- **Complexity** — Mostly read-and-record; no code change required to discharge it.
- **Closed Advantageous Doors** — None (recording a verdict closes nothing).
- **Description In Simpler Terms** — Embedded drawings pick their colors from your computer's setting, not from the site's toggle. In the new dimmed mode the page and the drawings can disagree. The plan promised to check-and-record such cases (it did for diagrams); this one slipped through unrecorded.

### [BUG — minor] Remaining minor issues
- **DEV_RULES §Rendering Model 4 alignment is unverified/absent** — the step task requires retargeting the attribute/storage ownership guidance from "the darkmode component" to the local ThemeToggle, but the current `__obsidian__/docs/DEV_RULES.md` contains no darkmode/`saved-theme`/ownership text at all. Without git history I can't tell whether the text was removed (task done) or never existed under that heading (task's premise off). User must confirm; if the alignment was skipped, the doc now silently contradicts the new owner.
- **`SiteThemeMode` mirror drift** — `browser.ts` re-declares the 3-value union locally ("mirrors the `themechange` union in `index.d.ts`") with no compile-time or test link between the two; a fourth mode added later silently passes the local guard only if someone remembers both sites. Accepted per plugin isolation rules (no host imports), but worth a cross-reference comment in `index.d.ts` pointing back at the mirror.
- **End-to-end verification items remain unproven** — fresh-visit OS seeding, stored-choice migration, zero-flash in all three modes, remark42 receiving events in all three modes, and `npm run check` + `npm test` green could not be executed in this environment (no shell); they remain the step's own verification loop obligations, not dischargeable by this review.
