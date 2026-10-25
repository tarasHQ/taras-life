---
status: implemented
state: condensed
reviewedAtStep: "03"
---

[← PLAN](../_plan_001.md)

## Description
Defines how the site configures the plugin. Originally planned as a validated YAML options contract (D2/D3); rewritten mid-step by three user decisions into its final form: **configuration is code, and the transport is Remark42's own documented page contract** — no options block, no config file, no mapping layer.

## Record
**Design trail (why it ended this shape):** (1) curated/validated option surface rejected — ~7 code touchpoints per new key, rot-prone allowlists, machinery for nothing on a private single-site identity-frozen plugin; (2) separate config module rejected — import→extract→assign is not hardcoding; (3) `data-remark42-*` attribute transport rejected — an invented layer whose only job was letting the runtime rebuild in the browser what the build already had; the per-page `url` forces *some* DOM transport in every design, and the documented block is the only one authored from one place with a config-ignorant runtime.

**Built:** the component in `custom-plugins/remark42/src/index.tsx` renders the documented embed integration verbatim — inline docs-shaped `var remark_config` literal (`host`, `site_id`, frozen thread-base-derived `url`, `no_footer: true`, `custom_properties: {}`, per-page `page_title`) hardcoded at point of use, `#remark42` container, `embed.mjs` module tag. Inline script emitted via `dangerouslySetInnerHTML` (Quartz's own idiom; render pipeline verified free of post-render sanitization). `quartz.config.yaml` entry reduced to `source`/`enabled`/`layout`; the factory throws if options are ever supplied.

**Verified (user-run, all green):** plugin rebuild via root `npm run build:plugins` (`dist/` regenerated and committed), `npm run check` + `npm test`, bare `npx quartz build` with `remark42-shell-test.html` inspection, and the residual-guard proof (temporary options block → non-zero exit → restored green) — empirically closes D3's throw-point question: a factory throw during layout construction aborts the build.

**Accepted risk (user decision):** no `</script>` escaping beyond `JSON.stringify` — site-owned values, declined as guarding nothing; one-line `.replace` fix if ever needed. Also declined: a separate serializer function (single call site = ceremony).

**Handoffs:** step 04 — `comment-id` normalization feeding the `url` literal; step 05 — markup polish only (build-time render *is* the serialization) plus the loader-control fields (`__colors__`, `styles`, `onReveal`) question; step 06 — runtime re-reads the fresh config block on SPA nav (inline scripts don't re-execute), theme, embed lifecycle; step 07 — option tests re-scoped to constants-contract material, README gets the SSOT-shape decision; step 08 — fills `custom_properties` in the literal. Reserved keys `theme`/`components` → step 06.

**Plan sync:** D2/D3 entries replaced with a one-line pointer to this record at Completion Run #1 (user decision: remove from plan). Loader knowledge retained here only: `manifest.defaultOptions` is never merged for component-only plugins (factory receives `{...entry.options, ...tsOverrides}` or `undefined`).

---
*Condensed at Completion Run #2: full discussion trail, implementation checklist and completion flow removed; load-bearing decisions, verification evidence and pending limitations retained above.*
