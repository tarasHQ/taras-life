---
status: implemented
state: condensed
reviewedAtStep: "01"
resolution: superseded
---

[← PLAN](../_plan_001.md)

## Outcome — superseded, not verified
The original spike was intended to prove native Node TypeScript loading without plugin compilation. The user instead selected Quartz's documented compiled-package model: author TypeScript/TSX, explicitly build the plugin, commit matching `dist/`, and let site generation consume built JavaScript.

A separate loading experiment is unnecessary for that established model. This step is closed as an architectural decision, not a successful technical verification. `status: implemented` records that administrative closure; `resolution: superseded` distinguishes it from an executed spike.

## Decisions retained
- D1 uses compiled JavaScript exports and committed `dist/`; source edits require an explicit rebuild.
- No native-TypeScript probe, special Node type-stripping floor, forced `h()` authoring, or Quartz loader patch.
- Use the existing package and normal production push/deploy flow; no separate spike plugin or preview environment.

## Cleanup
- Restored root `prebuild` to `npx quartz plugin install && npm run build:local-plugins` and restored its command-reference descriptions. Step 02 owns the permanent replacement of that preparation path.
- No plugin source, fixture, README, dependency, ignore rule or generated asset was changed for this step. The assistant did not stage, commit, push or deploy anything.
- No builds, tests, browser captures, live fixture comparisons or deployment checks were executed by the assistant. No verification result is claimed, and no local or remote passing state has been established.

## Handoff
- **02 — Package lock-in:** build the replacement package, commit matching output, establish its freshness check, and verify a clean checkout builds and renders the component without compiling it. Check the normal Workers deployment there; a complete browser widget is not expected until the runtime step.
- **06 — Browser runtime:** optionally capture the old widget's network behaviour before replacing its runtime, if useful for comparison. Compare the live loader with the fixture when validating assumptions about third-party behaviour. These are not packaging prerequisites.
- **07 — Tests and docs:** keep automated tests network-free, document manual fixture recapture on upgrades, and retain the package-loading/freshness regression checks. Use verified package/deployment requirements from step 02, not this unrun spike.

## Open documentation note
`DEV_RULES.md` still explains its erasable-syntax rule in terms of the superseded native-TypeScript model. Review that rationale before rewriting source; the coding restriction itself has not been relaxed by this step.
