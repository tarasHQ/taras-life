---
status: implemented
state: condensed
reviewedAtStep: "05"
---

[← PLAN](../_plan_001.md)

## Description
Locked the build-time markup contract. Most of the render already existed from steps 02–04 (package pipeline, docs-verbatim `remark_config` block, identity); this step fixed the four markup decisions the discussion had reserved, documented the contract as the interface step 06 may rely on, and verified the built output.

## Record
**Locked markup contract (recorded in `src/index.tsx` header JSDoc):**
- Container `id="remark42"` — **forced, not preferred**: the fixture shows the loader's `createInstance` hardcodes `document.getElementById("remark42")` and takes no element argument, so any other id would break every (re)mount, SPA included. This killed discussion option (b) ("own attribute + SPA API"): its premises were false — the import-time auto-run throws without `#remark42`.
- `script#remark42-config` on the inline `remark_config` block — the step-06 SPA re-read selector (inline scripts don't re-execute after micromorph patches the body). User decision: id over a data attribute.
- `Loading comments…` paragraph **stays** (user decision: informational). Transient by design — the loader removes every non-iframe container child once the widget reports `inited`.
- `embed.mjs` module tag stays docs-verbatim and **eager**; reconciling its import-time auto-bootstrap with D5 viewport gating is step 06's problem — recorded as a tension, not solved here. Consequence already live: opted-in pages fetch the widget on full page loads until step 06 gates it.
- CSS unchanged: the minimal `.remark42-comments { width: 100%; margin-top: 1rem; }` rule; full styling is step 08.

**Markup diff:** exactly one attribute — `id="remark42-config"` added to the inline config script tag; contract documented in header JSDoc plus two brief JSX comments.

**Verified (all green):** `npm run build:plugins` (regenerated committed `dist/`), `npm run check` + `npm test`, `npx quartz build` with built-page inspection: `remark42-shell-test.html` — one section, single `script#remark42-config` with the docs-verbatim config, `url` intact (`https://taras.life/comments/remark42-shell-test`), paragraph present, module tag present; every other HTML page — zero remark42 traces; CSS emission unchanged (one hashed component stylesheet site-wide); `dist/index.js` confirmed carrying the new markup.

**Step-06 deviation:** the eager `embed.mjs` module tag was removed from the markup at step 06 — it fetched Remark42 on every page load, violating D5; the browser runtime is now the sole loader via gated dynamic `import()`. The contract line about the tag is obsolete; the tag no longer exists.

**Handoffs:** step 06 — owns the runtime against this contract: re-reads `script#remark42-config`'s text on SPA nav, honours absent-id → no container, owns the eager-module-tag/D5 gating tension, owns `theme`/`components` reserved keys; step 08 — `custom_properties` fill, `min-height` question, full styling.

---
*Condensed at Completion Run #2: discussion option trails and task checklist removed; locked contract, verification evidence and handoffs retained above.*
