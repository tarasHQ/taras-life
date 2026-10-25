---
ctime: 2026-10-24 17:08
isIntegrated: false
---

[← Project](../../_project.md)

# Phase 001 - Remark42 plugin rewrite

## Description & Meaning
%%A few sentences about rough direction of the plan, just to get initial constraints on brainstorming. Goals and visions that will sustain meaning in the user through the whole process of planning and implementation%%

> [!summary]  
> ### Description
> Plugin was vibecoded. It accumulates a lot of "temporary" code around it that doesn't follow established standards and best practices. The goal of this plan is to rewrite it properly. And as the secondary goal - to gain more knowledge about how quarts/plugins/remark42 works. 
>  
> ### Goals
> #### Completion Goal #1 - Plugin is properly rewritten and locked in
>  
> #### Completion Goal #2 - README for the plugin is in the place and also properly written.
> 
> ### Visions
> > [!success] 
> > It's blocking further development of the website. If you don't do it - it'll cause issues with everything else you do, which will also add cognitive load to that and make it harder. When you do that - many doors will open to more interesting and rewarding things.
>
> > [!failure] 
> > It'll nag me constantly. Builds would be in the wrong flow. I'll have to make workarounds. If new plugins arrive - it'll be PIA with them as well. So it's not important to do now, but if we take 1 month down the line - it'll suck out 10x energy than I'll spend on rewriting it properly right now. 

## Documents
%%Dataviewjs snippet that renders list of documents from phase's inner folders%%

```dataviewjs
await cJS(c => c.RenderReflectionHelpers.renderColumns(dv, this.container));
```


## High Level Planning
%%A place to have all high-level things that must persists through all steps.%%

### User-input
%%Goal is to keep user input raw and untouched, so it won't drift away between many tasks. Among many options can include: order of implementation, rules, nuances, wishes, open questions, features, invariants, etc.%%
- We need to rewrite the plugin so that it is aligned with quartz plugin flow.
- My additions
	- **`no_footer`**: true - to hide footer with links to remark42. - for remark frontend config. 
	- custom_properties: {} - after we're done, to play with css a bit, to make it look nicer maybe. But it'll be like the last step before ending the phase
- It must be very well written, so I can lock it down long term. No performance issues too. 
- I'm a bit curious about how to load it. Like I want to each page load be quick. Performance and reliability is the top priority. 

---

### LLM-input 
%%Where LLM allowed to create, maintain. research and persist high-level information that needs to be persisted independently from steps-scope%%
- #### Decisions
	- **D1 — Documented compiled-package model (locked; revised at step 01).** Author the plugin in TypeScript/TSX, compile it explicitly, and commit `dist/`. Package exports `"."` and `"./components"` resolve to built JavaScript. Every site-generation path (`npm run build`, `npx quartz build`, `--serve`, Workers Builds) consumes that prepared output without compiling the plugin.
		- Source changes require an explicit plugin build before testing, previewing or committing. A consistency gate must fail if rebuilding changes tracked output or produces missing/untracked output; its implementation belongs to steps 02 and 07. Site generation does not promise to rebuild changed source.
		- JSX/TSX is supported through compilation; `h()` is optional. No native TypeScript execution, erasable-only syntax restriction, explicit `.ts` runtime-import policy or special Node ≥ 22.18 floor is required. Use Quartz's supported Node version and the repository's version pin.
		- No Quartz loader patch is planned. Step 01 is closed as superseded, not verified: the native-TypeScript spike and its unconditional-build fallback are unnecessary after choosing the documented model. Step 02 establishes and verifies the permanent package/build workflow. The build-tool choice is made in step 02, not implied by this decision.
	- **D1a — No size guardrails.** No byte-budget test, no size note in the plugin README, no separate minification stage. Accepted because the browser bootstrap is small and growth would be explicit; this does not prohibit ordinary bundler options in D1's plugin build.
	- **D2′ — Configuration is code, documented block as transport (decided at step 03; supersedes the curated-options contract D2).** There is no options block, no config file and no transport mapping. The component renders Remark42's documented integration verbatim: an inline `var remark_config` object in `index.tsx` — values hardcoded at their point of use, docs-shaped (snake_case), including per-page `url` derived from the frozen thread base and per-page `page_title` — plus the `#remark42` container and Remark42's own `embed.mjs` script tag. The DOM is the only transport: the step-06 runtime re-reads the fresh config block on SPA navigation and stays config-ignorant at authoring time. The plugin entry in `quartz.config.yaml` carries `layout` only; the factory throws if options are ever supplied. Rationale: private, single-site, identity-frozen (D4) plugin — a configurable surface for never-changing values was machinery for nothing (~7 touchpoints per new key, rot-prone allowlists, an invented data-attribute mapping that existed only to rebuild in the browser what the build already had); a typo in the literal is a `tsc` failure before any build. Accepted risk: no `</script>` escaping beyond `JSON.stringify` (site-owned values, declined by user; one-line future fix). Changing a value = edit the literal + explicit plugin rebuild (D1) + site rebuild. Reserved: `theme`/`components` (step 06), loader-control fields consumed before query serialization (step 05 question).
	- **D3 — Retired at step 03 (was: bad options fail the build).** With configuration in code (D2′) there is no runtime options contract to validate. Residual fail-loud path: the factory throws if Quartz ever supplies an options object again; its build-abort behaviour is verified once empirically in step 03, which also closes the original throw-point question (component factory during layout construction is the uncaught point; import errors can be swallowed by `componentLoader`; render errors reach `trace()` → `process.exit(1)`).
	- **D4 — Identity.** `comment-id` → `id` (final name). Thread URL frozen as `${threadBaseUrl}/${id}` = `https://taras.life/comments/<id>`. No page-URL fallback. `comments: false` is the explicit opt-out. The key rename does not orphan threads, because the URL derives from the value, not the key.
	- **D5 — Loading behaviour.** Viewport gating with a preload margin (~600px `rootMargin`). No container → no Remark42 request. Our bootstrap ships site-wide and must be a hard no-op without a container.
		- Amended at step 06 (live-tested): the gate applies to **every** mount, not only the first module download — each mount's iframe fetches `iframe.html` + the thread data, which is the per-mount traffic D5 protects. The module download itself is a one-time cost; a cached module does not entitle an ungated remount.
	- **D6 — Scope frozen.** Counters, last-comments, notifications, extra OAuth and `/comments/<id>` redirects are out of this phase. Counters and last-comments are permanently out.
	- **D7 — Styling boundary.** The widget lives in a cross-origin iframe, so our CSS cannot reach it. Styling = container CSS + `custom_properties` (creation-time only) + theme selection. Instance-level Remark42 theming on the LXC is the future path for anything deeper — recorded for later exploration, not part of this phase.
	- **D9 — Git hooks via lefthook.** Quality gates move to the dev machine: `pre-push` runs the full gate chain sequentially, fast-fail first — `check:types && check:format && test && build` (composition avoids a duplicated `verify-dist` pass: `check` is not run whole because `build` already contains `plugin:fresh`; full site build included deliberately so content-pipeline breakage is caught on push rather than by CI, at the cost of build-time latency per push). `pre-commit` carries the Axon-style README-review hook (`.lefthook/warnChangedReadmes.mjs`, glob-gated to code paths so `content/`/`__obsidian__/` commits never trigger it), ported properly but shipped **disabled** (`skip: true`) until repo restructuring settles — enabling is deleting one line in `lefthook.yml`. Chosen over husky for one-SSOT YAML config, glob filtering, and built-in CI/`LEFTHOOK=0` skips; lefthook's binary arrives as an optional platform dep from the npm registry (esbuild-style, no runtime downloads) and its postinstall writes `.git/hooks/` shims; a root `prepare` script (`lefthook install`) makes that wiring deterministic on any fresh `npm install`/`npm ci` — **verified on this machine** (shims present after clean install; pre-push gate blocks broken pushes). Hooks are local dev tooling — no conflict with D1's no-install-time-magic rule (that ban was about build output reproducibility, not tooling).
	- **D8 — Written from scratch; the old plugin is reference-only.** The rewrite does not refactor the existing implementation. The previous code now sits at `custom-plugins/remark42-old/`: not configured, not imported, not built, and nothing is transcribed from it. `quartz.config.yaml` already points at the new path `custom-plugins/remark42`, so the switch is atomic with the first commit that populates it. The old folder is deleted at step 07 once the new plugin is verified; git history remains the fallback if a behavioural detail is needed.
-	Consequence: the site renders a comments container but has no working widget until step 06. The work lands directly on `main`; the user accepts the broken deployment window for the duration of the phase (step 02, Discussion 8).
	- Steps 03–05 still reshape configuration, identity and markup; step 02's render is a throwaway scaffold that reproduces the current DOM contract so deployed HTML does not change in the meantime.
- #### Plan
	- Steps, in implementation order:
		- `01-loading-topology-spike` — closed as superseded, not verified. D1 adopts the documented compiled-package model; no separate loading spike is required. Temporary hook changes were restored and useful checks moved to their relevant implementation steps.
		- `02-package-lock-in` — author a new self-contained compiled-package skeleton **from scratch** at `custom-plugins/remark42` (the previous implementation stays untouched and unreferenced at `custom-plugins/remark42-old/`, deleted at step 07): community types, no host imports, declared dependencies, explicit build workflow, committed `dist/`, built exports, tightened tsconfig and root guards. Copy `fixtures/` into the new package. Remove reliance on automatic plugin compilation in the root site-build hook. Verify clean-checkout site generation/component rendering from committed output and the normal Workers deployment.
		- `03-options-contract` — configuration is code: the documented embed block is the transport, hardcoded inline in the component; YAML options removed; residual guard proven to abort the build (full record: `steps/03-options-contract.md`).
		- `04-identity-id-rename` — D4.
		- `05-render-component` — build-time Preact component, compiled from TS/TSX: container markup, data contract, `css`, bootstrap injection.
		- `06-browser-runtime` — D5: visibility gating, ownership of the module's import-time side effects, SPA lifecycle, theme, error and timeout handling. Compare the live loader with the fixture when validating runtime assumptions; optionally capture the old widget's network behaviour before replacing its runtime if useful, not as a packaging prerequisite.
		- `07-tests-and-docs` — tests authored against the new contract, plugin README as SSOT, deletion of `custom-plugins/remark42-old/` in full, `PLAN.md`/`REMARK42.md`/the test note, AGENTS.md sync.
		- `08-visual-polish` — D7.
	- Rule: no separate topology spike gates the rewrite. Step 02 verifies the actual package it establishes; step 06 owns runtime/network investigation. Do not silently substitute native source imports or loader changes if package verification fails; record the actual failure and discuss it. Rebuild explicitly after source changes.
- #### Nuances
	- **Runtime import is plain Node `import()`** inside the CLI process — no TS/JSX loader is registered. D1 supplies compiled JavaScript, so Node never needs to execute the plugin's TypeScript/TSX source. `.node-version` pins 22.22; confirm the actual Workers Builds version during step 02's deployment check against the supported project runtime, not a native-type-stripping requirement.
	- **Current root build hooks are transitional.** `npx quartz plugin install` reads `quartz.lock.json`, which is `{"plugins": {}}` — remark42 was never installed by it. `build:local-plugins` currently generates the ignored `dist/`. Under D1, an explicit plugin build prepares committed output; site generation must not depend on that root hook.
	- **Step 02 is atomic.** Git does not track empty directories. `custom-plugins/remark42` is empty on disk and absent from a clean checkout, while `quartz.config.yaml` already names it; `installPlugin` throws `Local plugin path does not exist` for a missing local source. The package, its committed `dist/` and the config that points at it must land in one commit.
	- **`.npmrc` makes peer declarations inert.** It sets `legacy-peer-deps=true` (and `engine-strict=true`), so npm runs in legacy mode: `peerDependencies` install nothing and validate nothing. Dependency guarantees have to be explicit checks (e.g. a single-Preact resolve check) rather than declarations.
	- **Repo hygiene facts.** `.prettierignore` already lists `custom-plugins/remark42/dist/`, but its "third-party code" comment stops being true once `dist/` is first-party. The root `.gitignore` has no `custom-plugins/` rule; the old plugin carries its own `.gitignore` that ignores its `dist/`. A bare `dist/` pattern in `.prettierignore` already covers every depth.
	- **CI exists and AGENTS.md omits it.** `.github/workflows/ci.yaml` runs `npm ci`, `npm run build`, `npm run check`, a separate `npm --prefix custom-plugins/remark42 run typecheck`, then `npm test`, on PRs and `main`, with `.node-version` and npm caching. Once `prebuild` stops compiling the plugin, CI's `npm run build` doubles as the clean-checkout proof. AGENTS.md describes delivery as Workers Builds only — sync at step 07.
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
%%Rendered by dataview for the user%%
```dataviewjs
await cJS(c => c.PlanStepsList.renderSteps(dv, this.container));
```

## Meta-Plan Reflection
(llms should ignore this. it's for future phases/templates.)
### Issues
- **Planning flow is bad**
	- You dumped lots of text at once. That was the issue. It just overwhelmed you. Then you don't follow it. And now you're paying the price because you don't know jack shit about this.
		- and you did this in the wrong state of mind, which made you not-read or forget most of the things. 
- **other**
	- Navigation is kinds PIA. I have to switch between vscode and obsidian. 
		- the issue is that you get overwhelmed by the amount of docs and text.
			- Like right now one thing was changed - 5 docs were edited. I'm like not even want to do anything with it. There's just damn walls of text I don't care about. This fucking LLMs...
- **getting overwhelmed**
	- The issue was too much issues. Like I explored stuff until 100k context, and then everything went apart. So what I had to do, is to use branches and slowly, step by step, explore all possibilities. And work on each one. Step by step. 
- **plan**
	- Issue with high-level block. As a user it was hard to write initial thing. It should be kind prompt-like. Not like decisions/invariants. Just give the user free form. 
	- For llm's high level though - it gets big really quickly. 
	- High level - must contain links block, with related links, so I don't have to re-type them each time in each new task.
- **rendered list of steps** 
	- completed step should be much more dimmed
	- We need some minimal borders around both table and list.
- **steps**
	- takes lots of time to re-explore all stuff I did while I was writing initial step contents. So each step should have "comprehensive exploration" section where LLM leaves links/notes/tips about how to research everything on the topic quickly. without many loops of back and forth. 
	- Discussion and reflection - should have brief template as well, kinda like I had with kilo code. Autoregressive. Recommended choice. Explain in simple words. Also - I should add rule to automatically add at the end user input point. like `- USER INPUT: ` so I can type right away the answer
	- Crucial. Make sure each step is optimally sized. So there's no like huge multi-hour step 01, while step 02 and 03 are done in 10 minutes. Step should be bite-sized. 
		- **ESPECIALLY FOR CONTEX**. This is the main measurement for whether step is small or big. (besides complexity), if we need to read 50k tokens worth of files before we even start the discussion - step is too big for sure. 
	- another big one. plan initial steps through artifacts. or in conversation. But not all at once. but one by one. 
		- like you write down somewhere top-level overview of planned steps. then do some exploration on implementations. write down description/high level. 
			- **KEY ISSUE - what if context is overfilled before all steps are written?**
- **tasks**
	- completion flow doesn't go as separate block. it's just another task at the end like `### 99 - completion flow`, so LLM won't repeat it.
- **artifacts**
	- maybe it makes more sense for llm to write its output into .md files? Like I'm repeating the same thing right now. First task was exploring 10 minutes about how quartz proposes to write plugins, and now, in a new task, I'm wasting another 5-10 minutes on the same damn issue. 
- **planning.md**
	- too vague. implementation starts without discussion. llm dumps everything at once. no granularity or control. It's just a mess. Too vague for sure. You shouldn't have single bullet list for that. Each block should be separate, each point should be properly described. You need to have "completion conditions" on each block/loop to have clear stops.
		- **IMPORTANT**. Like it's not a joke, there must be **routine** to this, if it's different every time - you're getting overwhelmed.
		- Like that planning block must be hyper important and be the center of gravity for the whole task. 
		- Like it should have its own section in agents, to clarify its importance. 
	- **TLDR** - you lack routine in this. Process is chaotic and unpredictable. That's adds a lot of friction.
### What's good
- having SSOT on shared decisions/invariants/nuances/etc.
	- like with the notion that we now have remark42-old folder, I don't have to mention it in each step. SSOT for everything. Good. 
- Condensation logic - definitely good. 
- **Routine** - routine is super good. When you manage to have it - it reduces complexity and feeling overwhelmed by A LOT.
