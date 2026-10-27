---
publish: true
created: 2026-10-24T14:08:40.363Z
modified: 2026-10-27T10:52:40.295Z
published: 2026-10-27T10:52:40.295Z
ctime: 2026-10-24 17:08
status: implemented
isIntegrated: true
---

[← Project](../../_project.md)

# P001 - Remark42 Plugin Rewrite

## Description & Meaning

> [!summary]  
>
> ### Description
>
> Plugin was vibecoded. It accumulates a lot of "temporary" code around it that doesn't follow established standards and best practices. The goal of this plan is to rewrite it properly. And as the secondary goal - to gain more knowledge about how quarts/plugins/remark42 works.
>  
>
> ### Goals
>
> #### Completion Goal #1 - Plugin is properly rewritten and locked in
>
>  
>
> #### Completion Goal #2 - README for the plugin is in the place and also properly written.
>
> ### Visions
>
> > [!success]
> > It's blocking further development of the website. If you don't do it - it'll cause issues with everything else you do, which will also add cognitive load to that and make it harder. When you do that - many doors will open to more interesting and rewarding things.
>
> > [!failure]
> > It'll nag me constantly. Builds would be in the wrong flow. I'll have to make workarounds. If new plugins arrive - it'll be PIA with them as well. So it's not important to do now, but if we take 1 month down the line - it'll suck out 10x energy than I'll spend on rewriting it properly right now.

## Documents

### Reflections

- [[@projects/taras.life/__obsidian__/phases/001/_reflections/initial-reflection|initial-reflection]]

### Ideas

- [[@projects/taras.life/__obsidian__/phases/001/ideas/parking|parking]]

### Artifacts

- [[@projects/taras.life/__obsidian__/phases/001/artifacts/README|README]]
- [[@projects/taras.life/__obsidian__/phases/001/artifacts/OLD-PLAN|OLD-PLAN]]

## High Level Planning

### User-input

- We need to rewrite the plugin so that it is aligned with quartz plugin flow.
- My additions
  - **`no_footer`**: true - to hide footer with links to remark42. - for remark frontend config.
  - custom\_properties: {} - after we're done, to play with css a bit, to make it look nicer maybe. But it'll be like the last step before ending the phase
- It must be very well written, so I can lock it down long term. No performance issues too.
- I'm a bit curious about how to load it. Like I want to each page load be quick. Performance and reliability is the top priority.

---

### LLM-input

- #### Decisions
  - **D1 — Documented compiled-package model (locked; revised at step 01).** Author the plugin in TypeScript/TSX, compile it explicitly, and commit `dist/`. Package exports `"."` and `"./components"` resolve to built JavaScript. Every site-generation path (`npm run build`, `npx quartz build`, `--serve`, Workers Builds) consumes that prepared output without compiling the plugin.
    - Source changes require an explicit plugin build before testing, previewing or committing. A consistency gate must fail if rebuilding changes tracked output or produces missing/untracked output; its implementation belongs to steps 02 and 07. Site generation does not promise to rebuild changed source.
    - JSX/TSX is supported through compilation; `h()` is optional. No native TypeScript execution, erasable-only syntax restriction, explicit `.ts` runtime-import policy or special Node ≥ 22.18 floor is required. Use Quartz's supported Node version and the repository's version pin.
    - No Quartz loader patch is planned. Step 01 is closed as superseded, not verified: the native-TypeScript spike and its unconditional-build fallback are unnecessary after choosing the documented model. Step 02 establishes and verifies the permanent package/build workflow. The build-tool choice is made in step 02, not implied by this decision.
  - **D1a — No size guardrails.** No byte-budget test, no size note in the plugin README, no separate minification stage. Accepted because the browser bootstrap is small and growth would be explicit; this does not prohibit ordinary bundler options in D1's plugin build.
  - **D2′ — Configuration is code, documented block as transport (decided at step 03; supersedes the curated-options contract D2).** There is no options block, no config file and no transport mapping. The component renders Remark42's documented integration verbatim: an inline `var remark_config` object in `index.tsx` — values hardcoded at their point of use, docs-shaped (snake\_case), including per-page `url` derived from the frozen thread base and per-page `page_title` — plus the `#remark42` container and Remark42's own `embed.mjs` script tag. The DOM is the only transport: the step-06 runtime re-reads the fresh config block on SPA navigation and stays config-ignorant at authoring time. The plugin entry in `quartz.config.yaml` carries `layout` only; the factory throws if options are ever supplied. Rationale: private, single-site, identity-frozen (D4) plugin — a configurable surface for never-changing values was machinery for nothing (~7 touchpoints per new key, rot-prone allowlists, an invented data-attribute mapping that existed only to rebuild in the browser what the build already had); a typo in the literal is a `tsc` failure before any build. Accepted risk: no `</script>` escaping beyond `JSON.stringify` (site-owned values, declined by user; one-line future fix). Changing a value = edit the literal + explicit plugin rebuild (D1) + site rebuild. Reserved: `theme`/`components` (step 06), loader-control fields consumed before query serialization (step 05 question).
  - **D3 — Retired at step 03 (was: bad options fail the build).** With configuration in code (D2′) there is no runtime options contract to validate. Residual fail-loud path: the factory throws if Quartz ever supplies an options object again; its build-abort behaviour is verified once empirically in step 03, which also closes the original throw-point question (component factory during layout construction is the uncaught point; import errors can be swallowed by `componentLoader`; render errors reach `trace()` → `process.exit(1)`).
  - **D4 — Identity.** `comment-id` → `id` (final name). Thread URL frozen as `${threadBaseUrl}/${id}` = `https://taras.life/comments/<id>`. No page-URL fallback. `comments: false` is the explicit opt-out. The key rename does not orphan threads, because the URL derives from the value, not the key.
  - **D5 — Loading behaviour.** Viewport gating with a preload margin (~600px `rootMargin`). No container → no Remark42 request. Our bootstrap ships site-wide and must be a hard no-op without a container.
    - Amended at step 06 (live-tested): the gate applies to **every** mount, not only the first module download — each mount's iframe fetches `iframe.html` + the thread data, which is the per-mount traffic D5 protects. The module download itself is a one-time cost; a cached module does not entitle an ungated remount.
  - **D6 — Scope frozen.** Counters, last-comments, notifications, extra OAuth and `/comments/<id>` redirects are out of this phase. Counters and last-comments are permanently out.
  - **D7 — Styling boundary.** The widget lives in a cross-origin iframe, so our CSS cannot reach it. Styling = container CSS + `custom_properties` (creation-time only) + theme selection. Instance-level Remark42 theming on the LXC is the future path for anything deeper — recorded for later exploration, not part of this phase.
  - **D9 — Git hooks via lefthook.** Quality gates move to the dev machine: `pre-push` runs the full gate chain sequentially, fast-fail first — `check:types && check:format && test && build` (composition avoids a duplicated `verify-dist` pass: `check` is not run whole because `build` already contains `plugin:fresh`; full site build included deliberately so content-pipeline breakage is caught on push rather than by CI, at the cost of build-time latency per push). `pre-commit` carries the Axon-style README-review hook (`.lefthook/warnChangedReadmes.mjs`, glob-gated to code paths so `content/`/`__obsidian__/` commits never trigger it), ported properly but shipped **disabled** (`skip: true`) until repo restructuring settles — enabling is deleting one line in `lefthook.yml`. Chosen over husky for one-SSOT YAML config, glob filtering, and built-in CI/`LEFTHOOK=0` skips; lefthook's binary arrives as an optional platform dep from the npm registry (esbuild-style, no runtime downloads) and its postinstall writes `.git/hooks/` shims; a root `prepare` script (`lefthook install`) makes that wiring deterministic on any fresh `npm install`/`npm ci` — **verified on this machine** (shims present after clean install; pre-push gate blocks broken pushes). Hooks are local dev tooling — no conflict with D1's no-install-time-magic rule (that ban was about build output reproducibility, not tooling).
  - **D10 — 404 report-a-broken-link thread (added at step 06.5; deliberate D6 scope exception).** The site's 404 page carries a comments section on one fixed thread: `id: "404"` → `https://taras.life/comments/404`. Identity is code-owned — injected into the virtual 404 page's generated frontmatter in `quartz/plugins/pageTypes/404.ts` (vendored edit, single call site, no scan participation); changing it orphans the thread, same discipline as `THREAD_BASE_URL`. Render path is config-driven: `byPageType["404"]` sets `template: default`, un-excludes remark42, excludes `@quartz-community/content-meta` (note: `byPageType.*.exclude` matches full scoped npm source names — bare names silently no-op). Intro copy lives in `quartz/components/pages/404.tsx` (vendored edit) because the Remark42 loader wipes non-iframe children of the container on init. Zero runtime changes — the step-06 runtime ships in `404.html` regardless of frame and mounts via the initial-load `nav` event. Per-URL threads, counters etc. remain out (D6).
  - **D8 — Written from scratch; the old plugin is reference-only.** The rewrite does not refactor the existing implementation. The previous code now sits at `custom-plugins/remark42-old/`: not configured, not imported, not built, and nothing is transcribed from it. `quartz.config.yaml` already points at the new path `custom-plugins/remark42`, so the switch is atomic with the first commit that populates it. The old folder was deleted at step 07; git history remains the fallback if a behavioural detail is needed.
  - Consequence: the site renders a comments container but has no working widget until step 06. The work lands directly on `main`; the user accepts the broken deployment window for the duration of the phase (step 02, Discussion 8).
  - **D11 — Guards, not a test suite (decided at step 07).** No test suite, no DOM harness, no new dependencies; the browser runtime stays manually verified (step 06 live testing showed a fake DOM harness would have encoded wrong assumptions as green). The rewrite is instead made defensible by two guards against its silent failure modes: (a) thread-identity drift and `comments`/`id` contradictions are caught by the manual `npm run check:comments` audit (`custom-plugins/remark42/scripts/comments-identity-audit.mjs`, rules imported from `src/thread-identity.ts` — one identity-policy home, also holding `THREAD_BASE_URL`); the audit is read-only, not wired into `check`/hooks/CI. (b) Invalid ids fail the build page-locally: the component validates only its own `id` (throws, naming the page, O(1)); duplicate detection lives solely in the audit — the per-render `allFiles` scan was removed.
  - Steps 03–05 still reshape configuration, identity and markup; step 02's render is a throwaway scaffold that reproduces the current DOM contract so deployed HTML does not change in the meantime.
- #### Plan
  - Steps, in implementation order:
    - `01-loading-topology-spike` — closed as superseded, not verified. D1 adopts the documented compiled-package model; no separate loading spike is required. Temporary hook changes were restored and useful checks moved to their relevant implementation steps.
    - `02-package-lock-in` — author a new self-contained compiled-package skeleton **from scratch** at `custom-plugins/remark42` (the previous implementation stays untouched and unreferenced at `custom-plugins/remark42-old/`, deleted at step 07): community types, no host imports, declared dependencies, explicit build workflow, committed `dist/`, built exports, tightened tsconfig and root guards. Copy `fixtures/` into the new package. Remove reliance on automatic plugin compilation in the root site-build hook. Verify clean-checkout site generation/component rendering from committed output and the normal Workers deployment.
    - `03-options-contract` — configuration is code: the documented embed block is the transport, hardcoded inline in the component; YAML options removed; residual guard proven to abort the build (full record: `steps/03-options-contract.md`).
    - `04-identity-id-rename` — D4.
    - `05-render-component` — build-time Preact component, compiled from TS/TSX: container markup, data contract, `css`, bootstrap injection.
    - `06-browser-runtime` — D5: visibility gating, ownership of the module's import-time side effects, SPA lifecycle, theme, error and timeout handling. Compare the live loader with the fixture when validating runtime assumptions; optionally capture the old widget's network behaviour before replacing its runtime if useful, not as a packaging prerequisite.
    - `07-tests-and-docs` — done: no test suite (deliberate, D11); defensible without one via guards — manual `npm run check:comments` audit (thread-identity drift, duplicates, `comments` contradictions, generated-HTML spot check) and page-local build-time `id` validation (the O(n²) per-render scan removed); `custom-plugins/remark42-old/` and stale test notes deleted; `AGENTS.md`/`DEV_COMMANDS.md` synced. Plugin README deliberately deferred to a separate task (outside this plan's steps).
    - `08-visual-polish` — D7.
  - Rule: no separate topology spike gates the rewrite. Step 02 verifies the actual package it establishes; step 06 owns runtime/network investigation. Do not silently substitute native source imports or loader changes if package verification fails; record the actual failure and discuss it. Rebuild explicitly after source changes.
- #### Nuances
  - **Runtime import is plain Node `import()`** inside the CLI process — no TS/JSX loader is registered. D1 supplies compiled JavaScript, so Node never needs to execute the plugin's TypeScript/TSX source. `.node-version` pins 22.22; confirm the actual Workers Builds version during step 02's deployment check against the supported project runtime, not a native-type-stripping requirement.
  - **Current root build hooks are transitional.** `npx quartz plugin install` reads `quartz.lock.json`, which is `{"plugins": {}}` — remark42 was never installed by it. `build:local-plugins` currently generates the ignored `dist/`. Under D1, an explicit plugin build prepares committed output; site generation must not depend on that root hook.
  - **Step 02 is atomic.** Git does not track empty directories. `custom-plugins/remark42` is empty on disk and absent from a clean checkout, while `quartz.config.yaml` already names it; `installPlugin` throws `Local plugin path does not exist` for a missing local source. The package, its committed `dist/` and the config that points at it must land in one commit.
  - **`.npmrc` makes peer declarations inert.** It sets `legacy-peer-deps=true` (and `engine-strict=true`), so npm runs in legacy mode: `peerDependencies` install nothing and validate nothing. Dependency guarantees have to be explicit checks (e.g. a single-Preact resolve check) rather than declarations.
  - **Repo hygiene facts.** `.prettierignore` already lists `custom-plugins/remark42/dist/`, but its "third-party code" comment stops being true once `dist/` is first-party. The root `.gitignore` has no `custom-plugins/` rule; the old plugin carries its own `.gitignore` that ignores its `dist/`. A bare `dist/` pattern in `.prettierignore` already covers every depth.
  - **Workers Builds settings are dashboard-owned.** `wrangler.jsonc` explicitly leaves the build command in the Cloudflare UI; verify the actual command and runtime in build logs. Step 02's deployment check uses the user's normal push/deploy flow, not a preview environment.
  - **`afterDOMLoaded` is site-wide.** All components' script strings are collected into `Set`s and emitted as hashed files loaded on every page, regardless of frontmatter. The bootstrap's cost is therefore per page view and it must be inert without a container.
  - **Emission asymmetry.** Production writes component scripts byte-for-byte (no minifier); `--serve` joins and minifies them with esbuild. Component CSS is always minified by Lightning CSS inside `@layer quartz-base`.
  - **`embed.mjs` has import-time side effects.** It calls `createInstance(window.remark_config)` and dispatches `REMARK42::ready`; its `destroy` deletes `window.REMARK42.changeTheme` and `.destroy`. It reads `window.remark_config.host` with a hardcoded fallback of `https://comments.taras.life`. The rewrite must own the `REMARK42` global deliberately and never depend on that fallback.
  - **Widget topology.** `embed.mjs` (~7 KB) creates a cross-origin `<iframe>` to `${host}/web/iframe.html?<params>`; `remark.mjs` (~60 KB) runs inside that frame, isolated from our page's main thread. Scalar config travels as query params; `custom_properties` is merged with `__colors__` and JSON-stringified into the iframe `name` attribute — creation-time only, matching the docs' "read once at load".
  - **`@quartz-community/types` is a runtime package**, so imports must be `import type`. Its `QuartzComponent` has no `displayName`, `head` or `content`; `css`/`beforeDOMLoaded`/`afterDOMLoaded` are `string | string[]`.
  - **`componentLoader` hides the real import error** behind `Plugin "<name>" declares components but failed to load them` — every resolution failure presents identically.
  - **Capture rule.** The fixture is re-captured on every Remark42 upgrade (`fixtures/`README`.md`); the vendored docs do not state a Remark42 version.
  - **No instance-level theming API exists.** Remark42 documents no server-side theme, custom-CSS or branding hook; `theme`, `locale` and `no_footer` are client-side only and no server default theme exists. The only routes past the iframe boundary are `REMARK_WEB_ROOT` (same-named files win over embedded ones, but the directory replaces the whole frontend and must be re-synced every upgrade), `SIMPLE_VIEW` (minimizes the UI only), and Caddy-layer injection into the served frontend (undocumented, upgrade-fragile). Recorded for step 08; out of scope for this phase.
  - **Explicit rebuilds, not install-time magic.** An npm workspace may still be useful for dependency ownership, but `prepare` is not a substitute for the documented build/commit workflow: it does not rebuild after every source edit. Development must rebuild `dist/` and restart the Quartz process when necessary; automatic plugin hot reload is not assumed. The consistency gate prevents committing or accepting stale generated output.
  - **Accepted limitation: the loader swallows the real import error.** A failed entry resolution reports only `Plugin "<name>" declares components but failed to load them`. No patch to `quartz/` is planned. Step 02's package verification must inspect freshly generated HTML and deployed component rendering, not accept a successful exit status alone; the residual options guard plus step 07's README and guards provide ongoing checks.
  - **Deployment window during the rewrite.** Production deploys from `main`. `quartz.config.yaml` already points at the new, empty `custom-plugins/remark42`, while the old code is a reference folder at `custom-plugins/remark42-old/`. From the first committed step until step 06 the new plugin renders a container but cannot load comments. 		Decided at step 02: work lands directly on `main`, and the user accepts the site having no comment area from step 02 until step 06. No branch and no `enabled: false` workaround.

---

---

---

## Steps

### Overview

#### Implemented

|Step|State|Reviewed at step|
|---|---|---|
|[[@projects/taras.life/__obsidian__/phases/001/steps/99-end\|99 — End]]|high-level|—|
|[[@projects/taras.life/__obsidian__/phases/001/steps/09-readme\|09 — Readme]]|high-level|—|
|[[@projects/taras.life/__obsidian__/phases/001/steps/08-visual-polish\|08 — Visual Polish]]|high-level|—|
|[[@projects/taras.life/__obsidian__/phases/001/steps/07-tests-and-docs\|07 — Tests and Docs]]|condensed|07|
|[[@projects/taras.life/__obsidian__/phases/001/steps/06.5-404-comments\|06.5 — 404 Comments]]|condensed|06|
|[[@projects/taras.life/__obsidian__/phases/001/steps/06-browser-runtime\|06 — Browser Runtime]]|condensed|06|
|[[@projects/taras.life/__obsidian__/phases/001/steps/05-render-component\|05 — Render Component]]|condensed|05|
|[[@projects/taras.life/__obsidian__/phases/001/steps/04-identity-id-rename\|04 — Identity Id Rename]]|condensed|04|
|[[@projects/taras.life/__obsidian__/phases/001/steps/03-options-contract\|03 — Options Contract]]|condensed|03|
|[[@projects/taras.life/__obsidian__/phases/001/steps/02-package-lock-in\|02 — Package Lock In]]|condensed|02|
|[[@projects/taras.life/__obsidian__/phases/001/steps/01-loading-topology-spike\|01 — Loading Topology Spike]]|condensed|01|
|[[@projects/taras.life/__obsidian__/phases/001/steps/00-start\|00 — Start]]|full|—|

### Details

#### ~~[99 — End \[—\]](@projects/taras.life/__obsidian__/phases/001/steps/99-end)~~

implemented — high-level

##### Description

Closes phase 001: the phase entry is finalized in `_project.md`, meta-planning lessons are captured, and nothing important is left unintegrated before the phase dies off.

---

#### ~~[09 — Readme \[—\]](@projects/taras.life/__obsidian__/phases/001/steps/09-readme)~~

implemented — high-level

##### Description

The plugin README was written and finalized by the user at `custom-plugins/remark42/README.md`. This closes the documentation task that step 07 deliberately deferred.

---

#### ~~[08 — Visual Polish \[—\]](@projects/taras.life/__obsidian__/phases/001/steps/08-visual-polish)~~

implemented — high-level

##### Description

Makes the comments area look native to the site from the outside — container spacing and borders, font and theme handoff through `custom_properties` — within the hard limit that the widget itself runs in a cross-origin iframe. This is the last step, done only once everything else is locked.

Skipped

Moved out of phase 001 by user decision. Kept as recorded future work — the "Deeper restyling" section below is the backlog material for whenever this is picked up.

---

#### ~~[07 — Tests and Docs \[07\]](@projects/taras.life/__obsidian__/phases/001/steps/07-tests-and-docs)~~

implemented — condensed

##### Description

Made the rewrite defensible without a test suite: the two silent failure modes (thread-identity drift, a plugin that loads nothing but builds fine) are guarded by a manual audit command and a page-local build check; the O(n²) per-render scan was removed; the old plugin and temporary test notes were deleted; AGENTS/DEV\_COMMANDS now match reality. The plugin README was deliberately deferred to a separate task.

---

#### ~~[06.5 — 404 Comments \[06\]](@projects/taras.life/__obsidian__/phases/001/steps/06.5-404-comments)~~

implemented — condensed

##### Description

Added the comments section to the site's 404 page so a lost visitor can report a broken link right where they got lost. Because every missing URL serves the same static `404.html` (`not_found_handling: "404-page"`), the thread is one deliberate fixed thread: `id: "404"` → `https://taras.life/comments/404` — the visitor names the broken link in the comment itself.

---

#### ~~[06 — Browser Runtime \[06\]](@projects/taras.life/__obsidian__/phases/001/steps/06-browser-runtime)~~

implemented — condensed

##### Description

Implemented the browser runtime for the comments widget (`custom-plugins/remark42/src/browser.ts`), replacing the step-02 placeholder. It gates every Remark42 mount behind a ~600px viewport IntersectionObserver, loads `embed.mjs` at most once per page load, keeps exactly one live widget instance across SPA navigation, matches the site theme, and degrades failures to an in-container note. Live-verified end-to-end on the deployed Worker against the real backend.

---

#### ~~[05 — Render Component \[05\]](@projects/taras.life/__obsidian__/phases/001/steps/05-render-component)~~

implemented — condensed

##### Description

Locked the build-time markup contract. Most of the render already existed from steps 02–04 (package pipeline, docs-verbatim `remark_config` block, identity); this step fixed the four markup decisions the discussion had reserved, documented the contract as the interface step 06 may rely on, and verified the built output.

---

#### ~~[04 — Identity Id Rename \[04\]](@projects/taras.life/__obsidian__/phases/001/steps/04-identity-id-rename)~~

implemented — condensed

##### Description

Renames the note-level `comment-id` frontmatter key to `id` and makes every identity error fail the build instead of staying silent. The rename is invisible to Remark42: the thread URL derives from the value, so the same note keeps the same thread and every existing comment stays put.

---

#### ~~[03 — Options Contract \[03\]](@projects/taras.life/__obsidian__/phases/001/steps/03-options-contract)~~

implemented — condensed

##### Description

Defines how the site configures the plugin. Originally planned as a validated YAML options contract (D2/D3); rewritten mid-step by three user decisions into its final form: **configuration is code, and the transport is Remark42's own documented page contract** — no options block, no config file, no mapping layer.

---

#### ~~[02 — Package Lock In \[02\]](@projects/taras.life/__obsidian__/phases/001/steps/02-package-lock-in)~~

implemented — condensed

##### Description

Established the new plugin package at `custom-plugins/remark42`, written **from scratch** under Quartz's documented compiled-package model (D1): TypeScript/TSX source, declared dependencies, an explicit esbuild build, committed `dist/`, exports pointing to built JavaScript. Site generation consumes that output and never compiles the plugin. The previous implementation stays untouched and unreferenced at `custom-plugins/remark42-old/` (deleted at step 07). The render is a throwaway scaffold reproducing the current DOM contract so deployed HTML does not change until steps 03–05 reshape it.

---

#### ~~[01 — Loading Topology Spike \[01\]](@projects/taras.life/__obsidian__/phases/001/steps/01-loading-topology-spike)~~

implemented — condensed

---

#### ~~[00 — Start \[—\]](@projects/taras.life/__obsidian__/phases/001/steps/00-start)~~

implemented — full

##### Description

The flow to start the planning in the best state of mind.\
**Importance shouldn't be understated**

- It looks very simple and obvious right NOW, but when your perspective is shifted - you don't see it that way.
- Without proper following of these rules - you'll end up stranded in the desert.
- And overwhelmed on top of it - this is how you start the race you're meant to lose.
