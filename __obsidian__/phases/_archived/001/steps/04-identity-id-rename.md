---
status: implemented
state: condensed
reviewedAtStep: "04"
---

[← PLAN](../_plan_001.md)

## Description
Renames the note-level `comment-id` frontmatter key to `id` and makes every identity error fail the build instead of staying silent. The rename is invisible to Remark42: the thread URL derives from the value, so the same note keeps the same thread and every existing comment stays put.

## Record
**Identity policy (locked):** `id` is the single thread key, validated as `[a-z0-9-]+` with no length rule in code (generation is an Obsidian-side tooling concern; recommended shape goes to the step-07 README). Dot segments `.`/`..` rejected explicitly (they survive `encodeURIComponent` as path escapes). Absent id → no container, never an error. `comments: false` exempts the page entirely — the id is inert: unvalidated and excluded from duplicate detection (proven with a control note inside an otherwise-failing build). Duplicates fail the build because two notes sharing a thread is silent data mixing. The `/comments/<id>` URL is an internal Remark42 storage key, never a visited page (no redirects, D6) — the earlier "typeable URLs" concern was dismissed.

**Built:** new `custom-plugins/remark42/src/thread-identity.ts` — `checkThreadId` (non-throwing absent/valid/invalid classification), `buildThreadUrl` (frozen `${base}/${encodeURIComponent(id)}`), `scanThreadIdIssues` (skips opt-outs and absent ids; collects every invalid id and duplicate group; deterministically sorted so the failure text cannot depend on concurrent render order), `formatThreadIdIssues` (one aggregated `[Remark42]` error naming every offending page). Host `allFiles` treated as untrusted boundary data: structural types with `unknown` fields, runtime-narrowed. `src/index.tsx`: reads `frontmatter["id"]`, per-render scan throws the single aggregated error before any render (render errors reach `trace()` → exit 1, proven at step 03); frozen base hoisted to `THREAD_BASE_URL` beside the other config literals. `content/remark42-shell-test.md` migrated to `id`, same value. Nothing transcribed from remark42-old (D8).

**Mechanism deviation (deliberate):** the old plugin's duplicate scan cached `allFiles` by array identity to run once — that is module-level mutable state, forbidden under the concurrent build-time rendering rule, and its purpose (avoid repeated warnings) is void once the scan throws. The new scan runs per render; first throw ends the build, so semantics are identical: effectively once per published set.

**Verified (all green):** `npm run build:plugins` → `check` (incl. `plugin:fresh`) → `test` → `npx quartz build`; built `remark42-shell-test.html` carries `remark_config.url` byte-identical (`https://taras.life/comments/remark42-shell-test`) with the DOM contract intact and old `data-*` scaffold attributes gone; `index.html`/`404.html` render nothing; failing-build matrix — 8 offending temp notes (empty, whitespace, `.`, `..`, non-slug, numeric non-string, duplicate pair) produced exactly one aggregated error naming all 8 pages with the duplicate pair grouped on one line.

**Cosmetic accepted:** Quartz's trace path prints the aggregated error twice (interpolated into `Failed to emit from plugin PageTypeDispatcher` and again as the error body with stack). Exit code and message content are correct.

**Handoffs:** step 05 — markup polish only (the frozen DOM contract is now literally untouched); step 06 — the runtime must keep honouring absent-id → no container when re-reading the config block on SPA nav, and identity errors never reach the browser; step 07 — README (charset + id-generation guidance), plus two sync items discovered here: `__obsidian__/docs/DEV_COMMANDS.md` still documents the deleted `prebuild`/`build:local-plugins` flow, and the plugin has no `README.md` yet.

---
*Condensed at Completion Run #2: discussion trail and task checklist removed; locked policy, mechanism, verification evidence and pending limitations retained above.*
