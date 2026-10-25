---
status: waiting
state: full
reviewedAtStep: "06"
---

[← PLAN](../_plan_001.md)

## Description
Rewrites the browser half — the only part of the plugin a visitor pays for. It finds the container, waits until comments are about to be seen, loads Remark42 once, and keeps the widget correct across SPA navigation, theme changes, slow networks and failures without ever affecting the article itself.

## High-Level

### Intended outcome
- Zero Remark42 traffic until the container is within roughly 600px of the viewport; zero work at all on pages without a container.
- One module load per session and one live instance at a time, correct across `nav`/`prenav`, back/forward, and rapid navigation.
- The widget's light/dark matches the site's theme at the moment it appears, and follows later theme changes without a reload.
- Any failure — offline, 5xx, timeout, blocked — appears inside the container and is recoverable; the article is never affected.
- `window.REMARK42` and `window.remark_config` end up in a state we define, not whatever the module's import-time side effects leave behind.
- Validate assumptions about the served `embed.mjs` against the fixture copied into `custom-plugins/remark42/fixtures/` when implementing the runtime. A manual live comparison belongs here, not in a packaging spike; investigate drift and coordinate fixture/test updates with step 07.
- If an old-versus-new network comparison is useful, capture the previous widget from `custom-plugins/remark42-old/` before it is deleted at step 07: page/time/cache conditions, request chain, transfer and decoded sizes, and no-container traffic. This baseline is optional and not a prerequisite for starting the rewrite or establishing the package; no new capture tooling or byte-budget gate is required.

### Local invariants
- The browser receives a JavaScript resource string, not TypeScript or a Node module. Build-time compilation/bundling is allowed by D1; the shipped bootstrap has no static module imports or bundled runtime dependencies. Loading the external Remark42 module is deliberate and viewport-gated.
- Strict no-op without a container — no observers, no timers, no network.
- Per-page data comes only from the DOM; site-wide config is baked in at build time.
- Only `embed` is ever requested. No counter module, no last-comments module.
- Never re-render Quartz, never touch `window.location`, never assume a container's lifetime.

### Should NOT be done in this step
- Counters, last-comments, redirects, analytics.
- Styling inside the frame, or any theme design.
- Option parsing or validation (step 03).
- Markup changes (step 05).

## Discussion & Reflections

1. **Owning the import-time side effects.** The captured module auto-instantiates from `window.remark_config` and dispatches a ready event on import.
   - (a) Seed `window.remark_config` before importing and let the module bootstrap itself — least code, matches upstream expectations, leaves a global visible to everything else.
   - (b) Import with no global, clean up whatever the auto-run creates, then use the SPA API — more code, no lingering global.
   - (c) Defensively delete and reset globals around every import — paranoid and hard to reason about.
   - **Recommend (b)** if the auto-run is harmless without a container, otherwise (a) with the global documented.

2. **Gating technique.**
   - (a) IntersectionObserver with ~600px rootMargin — no traffic for most readers, a tiny delay for the rest.
   - (b) Load after `load` plus `requestIdleCallback` — simple, but every page pays the download and a TLS handshake.
   - (c) Load immediately — worst for performance, simplest code.
   - **Recommend (a).**

3. **Theme handoff.**
   - (a) Push `changeTheme` on each Quartz theme event and once after load.
   - (b) Read the computed background colour and map it to light/dark — robust to future themes, more fragile.
   - (c) Rely on Remark42's default — wrong half the time.
   - **Recommend (a).**

4. **Failure UX.**
   - (a) A message plus a retry control inside the container — explicit and user-controlled.
   - (b) Silent failure with a console error — invisible to readers and to you.
   - (c) Automatic retry loop — recovers from blips, can hammer a server that is down.
   - **Recommend (a).**

5. **Evidence moved from superseded step 01.** Native-TypeScript loading is no longer under investigation. Any baseline captured from `custom-plugins/remark42-old/` and any live-loader comparison serve concrete frontend decisions here, not proof of the standard package model. Automated regression tests stay network-free; preserve manual comparison provenance for step 07's fixture/upgrade instructions.
   - **Fixture fact correcting item 1's premise:** the captured auto-run is NOT harmless without a container — `createInstance` → `g()` throws `Remark42: Can't find root node.` when `#remark42` is absent. Under a gated dynamic import this is moot (import only after the container is confirmed present), but (b)'s "clean up whatever the auto-run creates" framing must be re-evaluated against this.
   - **Tension item 6 (from step 05):** the step-05 contract ships the `embed.mjs` module tag docs-verbatim and **eager**; D5 requires zero traffic before the container is near viewport. Resolving this likely means removing the static tag in favour of a gated dynamic `import()` — that is a markup change against the step-05 contract and must be recorded as a step-05 deviation + contract update here, not silently.

## Comprehensive Exploration [WRITTEN AT THE STEP 05, fresh context]

### Read first (in order)
1. `__obsidian__/docs/DEV_RULES.md` — § Rendering Model: `nav`/`prenav`/`themechange` semantics, `addCleanup`, site-wide script strings, subscribe-once rules. Non-negotiable for this step.
2. `custom-plugins/remark42/fixtures/remark42-v1.18.0-embed.mjs` — the loader contract: auto-bootstrap at import (`p()` → `g(window.remark_config)`), iframe reuse via `:scope > iframe[data-remark42-iframe]`, non-iframe container children wiped on `inited`, `destroy`/`changeTheme` on `window.REMARK42`, `REMARK42::ready` dispatched, `hash`/`hashchange` handling, 5s reveal timeout fallback. Also protocol-mismatch check on `host`.
3. `custom-plugins/remark42/src/index.tsx` header JSDoc — the locked step-05 markup contract (don't re-read step 05's file).
4. `custom-plugins/remark42/build.mjs` — how `src/browser.ts` becomes the embedded IIFE string (constraints on what the bootstrap source may import).

### Facts already established (no re-research needed)
- `afterDOMLoaded` strings ship site-wide, once per full page load, deduplicated; never re-executed on SPA nav → all route work driven by `nav`.
- Event reality: only `nav` (detail.url), `prenav`, `themechange` (detail.theme) fire; `themechange` does NOT fire on initial load — read `document.documentElement.getAttribute("saved-theme")` first, then subscribe.
- Cleanup order per nav: `prenav` → cleanups flushed → micromorph patches body → head patched → `nav`. `window.addCleanup` is a no-op when SPA is off — never depend on it for correctness.
- On SPA nav the runtime must re-read fresh config from `script#remark42-config` text (inline scripts don't re-execute); absent-id pages have no container at all — no-op must hold.
- Loader-control fields (`__colors__`, `styles`, `onReveal`) are destructured out before query serialization — they are not config keys; `theme`/`components` are reserved keys (D2′).
- Production emits per-script hashed files loaded via postscript orchestrator; `--serve` bundles monolithically (emission asymmetry, harmless).
- The current `src/browser.ts` is the step-02 placeholder (console.debug only) — full replacement target.

### Where to look for Quartz SPA internals
- `quartz/components/scripts/spa.inline.ts` (or equivalent) for `spaNavigate`, `addCleanup`, event dispatch order — read via `explore`, not full read.

### Suggested flow for the step (per planning discipline)
1. Discussion round on items 1–4 with the fixture facts on the table → lock decisions. **Done at step 06.**
2. THEN write `## Implementation` block with the user. **Done at step 06.**
3. Live-vs-fixture comparison once the runtime design is settled (optional old-widget capture before step 07 deletes `remark42-old/`).

_Reflection:_ (optional — compact notes from the user)

### Locked decisions (step 06 discussion round)
- **Item 1 → (b′), locked.** Let `embed.mjs` auto-start on the first gated import (the import only ever happens with `#remark42` confirmed present, so the fixture's throw path is unreachable); manage the widget afterward through the handles the module leaves on the global: `window.REMARK42.destroy()` / `.createInstance(config)`. Module code executes once per page load; every SPA remount is a local `createInstance` call, never a re-download.
- **Item 2 → (a), locked.** IntersectionObserver gating with ~600px `rootMargin`; the eager `<script type="module" src=…embed.mjs>` tag is **removed** from the markup and replaced by a dynamic `import()` in the bootstrap — recorded as a step-05 markup-contract deviation (task 05). Dynamic import and module tags have identical fetch/CORS/cache semantics; the import additionally yields a catchable load failure (feeds item 4).
- **Item 3 → (a), locked.** Read `saved-theme` on `document.documentElement` at each mount, apply via `changeTheme` once the instance exists; one `themechange` subscription on `document` (the darkmode package dispatches it there) for the module's lifetime, never re-subscribed per nav.
- **Item 4 → (a, amended), locked.** Watchdog timeout per mount; on expiry the container's placeholder is replaced by a failure note. **No retry button** — a reader who cares reloads the page. Watchdog is cleared on a successful reveal signal.

---

## Implementation [WRITTEN AT THE STEP |06|]

### 01 - Gated loader authoring in browser.ts
- [x] Replace the step-02 placeholder in `src/browser.ts` with the real runtime; keep the file a **hard no-op without `#remark42`**: no observer, no timer, no network, no subscriptions beyond the module-level ones.
- [x] Config is read **only from the DOM**: locate `script#remark42-config`, parse the `remark_config` object out of its text content; take `host` and all integration values from the parsed object — the bootstrap hardcodes nothing (site-wide config is baked into markup at build time, D2′).
- [x] Gate per container with an `IntersectionObserver` (`rootMargin` ≈ `"600px"`); create the observer **only after** a container is confirmed present; disconnect once fired.
- [x] On first approach: dynamic `import()` of `${host}/web/embed.mjs` with the URL built in a **variable**, so esbuild's pass-1 bundling cannot resolve it — verify the emitted IIFE keeps a runtime `import(...)`.
- [x] After the first import, subsequent mounts go through the persisted `window.REMARK42.createInstance(config)` handle; guard against a double-import while the first is in flight.
- [x] Types: no `any`; module globals typed via a local `type` (no `interface`), `import type` only; explicit return types on exported functions.

### 02 - SPA lifecycle wiring
- [x] Register exactly once, at module top level, on `document`: `nav`, `prenav`, `themechange` (all confirmed dispatched on `document`; `themechange` by `@quartz-community/darkmode`).
- [x] On `prenav`: destroy the live instance (`window.REMARK42.destroy()`) so the iframe, listeners and MutationObserver die before micromorph patches the body; tolerate "nothing mounted yet".
- [x] On `nav` (fires on first load too, after component scripts): re-read container + fresh config. No container (absent-`id` page) → ensure destroyed, stay a no-op. Container present → arm the viewport gate; **every** mount is gated (the original "module cached → mount immediately" branch was falsified by live testing — deviation 5).
- [x] Use `window.addCleanup` for per-nav teardown as belt-and-braces, but never depend on it for correctness (no-op when SPA is off; the full page load is the cleanup then).
- [x] Rapid navigation: mounting is idempotent — an in-flight mount for a superseded page must not leak a second instance; every mount is preceded by a destroy of the previous one.

### 03 - Theme handoff
- [x] At each mount, read `document.documentElement.getAttribute("saved-theme")` (`"light" | "dark"`) and apply it to the freshly mounted instance via `window.REMARK42.changeTheme(theme)`.
- [x] A single module-lifetime `themechange` listener on `document` pushes `changeTheme(detail.theme)` to the live instance (no-op when nothing is mounted); never re-subscribed per nav; holds no DOM references.

### 04 - Failure watchdog
- [x] On each mount, start a watchdog timer; clear it on a confirmed successful reveal.
- [x] Success signal: (MutationObserver variant chosen — see runtime header) listen on `window` for `message` events where `event.source === iframe.contentWindow` and `event.data.inited === true` (the loader's own reveal protocol, visible from the parent side); a MutationObserver on the container (its non-iframe children are wiped on `inited`) is the simpler fallback if message filtering proves brittle — pick one, verify live.
- [x] On expiry: stop waiting, replace the container's `Loading comments…` placeholder with a short failure note; clear timer and observers. No retry button (user reloads). The import-rejection path (offline/blocked) surfaces through the same note.
- [x] Never touch the article: all failures stay inside the container.

### 05 - Markup change: removing the eager tag (step-05 deviation)
- [x] In `src/index.tsx`: delete the `<script type="module" src="${host}/web/embed.mjs" />` tag; the bootstrap in `browser.ts` becomes the sole loader of the module.
- [x] Update the header JSDoc markup contract accordingly (it currently states the tag is "docs-verbatim and eager" — that becomes false).
- [x] Record the deviation in step 05's record block: one-line note that step 06 removed the eager module tag in favour of gated dynamic import, reason D5.

### 06 - Plugin rebuild and bundling verification
- [x] Explicit plugin rebuild per the D1 workflow (`npm run build:plugins` in the package), commit regenerated `dist/`.
- [x] Verify pass-1 output: the external dynamic import survives bundling as a runtime import (no esbuild resolution error, no inlined fetch of the URL).
- [x] `npm run check` and `npm test` in the package still green; `build.mjs` post-build assertions still hold (assertion marker updated to "loading the embed module" with the placeholder removal).

### 07 - Manual browser verification (live, against the real host)

> **Caught implementation deviations (tasks 01–06):** (1) theme handoff is implemented as `theme` injection into the config copy *before* mounting, not a post-mount `changeTheme` call — same locked outcome, strictly better mechanism (iframe is created with the correct `colorScheme`/query param; no light flash on a dark site); `changeTheme` remains in use for live `themechange` events. (2) The reveal-success signal is the MutationObserver variant, not message filtering. (3) The gate observer stays armed through its initial `isIntersecting: false` callback (IO always fires once up front with current state — disconnecting there would have broken the gate entirely). (4) A `REMARK42::ready` fallback covers the module's deferred auto-run (import during parse → `DOMContentLoaded` → handles not yet on the global at adopt time). (5) Found by live testing: the "module cached → mount immediately on nav" branch was removed — **every** mount now waits on the viewport gate, because each mount's iframe fetches iframe.html + thread data, the expensive per-mount traffic D5 protects; the original branch fired that traffic right after any SPA navigation.
- [ ] Full page load on an opted-in post, DevTools network open: **zero** `comments.taras.life` traffic until the container is ~600px from viewport, then exactly one `embed.mjs` request and the iframe fetch.
- [ ] No-container pages (absent `id`, 404, bases, excalidraw): zero observers/timers/network — no remark42 traces in DevTools.
- [ ] SPA navigation post → post: widget remounts with the new thread's URL/title (check the iframe `src` query params); post → non-post: instance destroyed; back/forward correct.
- [ ] Theme: mount in dark → widget dark; toggle after mount → widget follows without reload.
- [ ] Failure path: block `comments.taras.life` (DevTools request blocking) → failure note appears after watchdog expiry, article unaffected.
- [ ] Optional: before step 07 deletes `remark42-old/`, capture the old widget's network behaviour for comparison (conditions, request chain, sizes, no-container traffic) — only if useful, not a gate.

### 99 - Completion flow
- [ ] Decisions block above: user confirms which entries belong in the plan/READMEs; remove the block.
- [ ] Frontmatter: `status: implemented`, then `state: condensed` after Run #2 rewriting.
- [ ] Confirm downstream alignment: step 07 (tests authored against the new runtime contract, fixture/test coordination) and step 08 (`custom_properties`, styling) unaffected in their premises.
