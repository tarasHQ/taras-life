---
status: implemented
state: condensed
reviewedAtStep: "06"
---

[← PLAN](../_plan_001.md)

## Description
Implemented the browser runtime for the comments widget (`custom-plugins/remark42/src/browser.ts`), replacing the step-02 placeholder. It gates every Remark42 mount behind a ~600px viewport IntersectionObserver, loads `embed.mjs` at most once per page load, keeps exactly one live widget instance across SPA navigation, matches the site theme, and degrades failures to an in-container note. Live-verified end-to-end on the deployed Worker against the real backend.

## What was implemented

### Runtime design (locked at the step-06 discussion round; refined by live testing)
- **Module loading**: gated dynamic `import()` of `${host}/web/embed.mjs` (URL built in a variable so esbuild's pass-1 bundling keeps it a runtime import). The module auto-mounts on import; the gated import only ever happens with `#remark42` present, so the loader's root-node throw is unreachable. The eager `<script type="module" src=…embed.mjs>` tag from step 05's markup was **removed** (step-05 deviation, recorded there) — it would have fetched Remark42 on every page load, violating D5.
- **Instance lifecycle**: first mount adopts the auto-run's handles (`window.REMARK42.destroy`/`.changeTheme`, with a `REMARK42::ready` fallback for the deferred auto-run when the module lands mid-parse); later mounts call the persisted `window.REMARK42.createInstance(config)` — module code never re-executes, no re-download.
- **Gating every mount** (D5 amendment, live-tested): the original "module cached → mount immediately on nav" branch was falsified — each mount's iframe fetches `iframe.html` + thread data, the expensive per-mount traffic D5 protects. Every mount, first or remount, waits on the viewport gate. Promoted into D5 in `_plan_001.md`.
- **SPA wiring**: `nav`/`prenav`/`themechange` subscribed exactly once on `document` (darkmode dispatches `themechange` there; it doesn't fire on initial load). `prenav` → full reset (destroy + clear observers/timers) before micromorph patches the body; `nav` → re-derive everything from the DOM, re-read `script#remark42-config` text, absent container/config → hard no-op. Generation counter kills stale in-flight mounts; `addCleanup` treated as belt-and-braces only.
- **Config ownership**: per-page config is parsed from `script#remark42-config`'s text (runtime shape-checked, `host`/`site_id` required) and written into `window.remark_config` before every mount — the loader's `createInstance` validates `site_id` against the global.
- **Theme**: `theme` is injected into the config copy **before** mount (iframe created with the correct `colorScheme` + query param, no flash); live `themechange` events push `changeTheme` through one module-lifetime listener.
- **Failure UX**: watchdog armed before any await (covers import + deferred auto-run + reveal; 15s, above the loader's own 5s reveal fallback). Success signal: MutationObserver on the container — the loader wipes all non-iframe children on `inited`, so "only the iframe remains" is a parent-side DOM-only check. On expiry or import rejection: destroy, replace placeholder with "Comments could not be loaded…" note. No retry button (locked); the article is never touched.
- **Defined steady-state** (verified live): after navigating away, `window.REMARK42` keeps `createInstance` (the remount handle) while `destroy`/`changeTheme` are gone (cleanup proof); `window.remark_config` retains the last mounted thread until the next mount overwrites it — read only at mount time, intended.

### Implementation deviations caught during the step
1. Theme applied via pre-mount config injection, not post-mount `changeTheme` (same outcome, no flash).
2. Reveal signal = MutationObserver variant, not cross-origin message filtering.
3. Gate observer must stay armed through its initial `isIntersecting: false` callback (IO always fires once up front with current state; disconnecting there would have broken the gate).
4. `REMARK42::ready` fallback for the module's deferred auto-run.
5. Every mount gated (see above; promoted to D5).
6. Steady-state globals documented (see above).

### Live verification (deployed Worker, real backend; localhost added to backend `ALLOWED_HOSTS` for the fast loop)
- Gate: zero `comments.taras.life` traffic until ~600px, then exactly one `embed.mjs` (4 kB) → iframe chain (`remark.mjs` 60 kB, `remark.css`, `config`/`status`/`user`/`find` fetches) with `url`, `page_title`, `theme` params intact.
- No-container pages: fully inert.
- SPA: post→post remounts the new thread without re-download; post→non-post destroys; back/forward and rapid nav clean.
- Theme: `theme=dark` in iframe params; toggle follows live.
- Failure: backend stopped on the LXC → failure note after watchdog expiry, article unaffected.

## Handoffs
- **Step 07** — tests authored against this contract (gate/adopt/destroy/remount/reveal/watchdog); plugin README as SSOT (should carry the runtime design + deviations 1–6 and the steady-state globals); deletion of `remark42-old/` (old-widget capture was skipped as no longer useful); AGENTS.md sync.
- **Step 08** — `custom_properties` fill, container `min-height` question, styling on a working widget.

---
*Condensed at Completion Run #2: discussion option trails, task checklist and verification instructions removed; locked design, deviations, verification evidence and handoffs retained.*
