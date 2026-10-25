---
status: waiting
state: high-level
reviewedAtStep: "01"
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

_Reflection:_ (optional — compact notes from the user)
