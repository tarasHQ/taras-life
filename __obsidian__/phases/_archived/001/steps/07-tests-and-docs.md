---
status: implemented
state: condensed
reviewedAtStep: "07"
---

[← PLAN](../_plan_001.md)

## Description
Made the rewrite defensible without a test suite: the two silent failure modes (thread-identity drift, a plugin that loads nothing but builds fine) are guarded by a manual audit command and a page-local build check; the O(n²) per-render scan was removed; the old plugin and temporary test notes were deleted; AGENTS/DEV_COMMANDS now match reality. The plugin README was deliberately deferred to a separate task.

## High-Level

### Intended outcome
- `npm run check:comments` (manual, root) audits every `content/` note: invalid ids, duplicate ids, `comments` contradictions (non-boolean, or `id` + `comments: false`), plus — when `public/` exists — that every commentable page's generated HTML carries the container and config markup, and sampled non-commentable pages don't. Rules are imported from `src/thread-identity.ts`, never duplicated. Not wired into `check`, hooks, or CI.
- Build-time validation is page-local: the component validates only its own `id` (throws, naming the page) and never touches `allFiles` — per-page cost O(1), no quadratic scan. Duplicate detection moved to the audit.
- Stale artifacts removed: `custom-plugins/remark42-old/`, `content/remark42-shell-test.md`, `content/remark-comments-load-test.md`. (`PLAN.md`/`REMARK42.md` did not exist — no-op.)
- `AGENTS.md` and `DEV_COMMANDS.md` reflect the final arrangement.

### Local invariants
- The audit is read-only, no network, manual-only. Exit codes: 0 clean, 1 findings, 2 could-not-run.
- Identity policy has one home (`src/thread-identity.ts`); `THREAD_BASE_URL` lives there too — a change is a deliberate migration event.
- No test suite, no DOM harness, no new dependencies. Runtime behaviour stays manually verified (step 06).

### Should NOT be done in this step
- Visual polish (step 08). README writing (deferred). Re-deciding locked decisions.

## Discussion & Reflections
- **Suite vs guards**: original step asked for lifecycle/viewport tests; concluded they'd assert our own fake DOM, not the browser (step 06's live testing found the D5 amendment a fake would have encoded green). Decided: guards only, no suite.
- **Automated vs manual**: user chose a standalone manual script over any automated run — simplicity over coverage, and it unlocked the O(n²) removal.
- **Plugin suite in root `npm test`**: moot — no plugin suite exists.
- **Old planning artifacts**: `PLAN.md`/`REMARK42.md` absent on disk; vault copies under `phases/001/artifacts/` are step-99 scope.

## Implementation [WRITTEN AT THE STEP |07|]

### 01 - Making validation page-local, moving duplicates to audit
- [x] `src/index.tsx`: component no longer uses `allFiles`; own-id validation throws naming the page (invalid id still aborts the build).
- [x] `src/thread-identity.ts`: `THREAD_BASE_URL` moved in; added `findOptOutIssues` (audit-only `comments` contradictions); headers updated (audit is the scan consumer).
- [x] Plugin rebuilt via `npm run build:plugins`; committed `dist/` fresh (`verify:dist` green).

### 02 - Authoring the audit script
- [x] `custom-plugins/remark42/scripts/comments-identity-audit.mjs` (tsx-run, imports `yaml` + `../src/thread-identity.ts`).
- [x] Checks: per-file id validity, cross-page duplicates (`scanThreadIdIssues`), `comments` contradictions (`findOptOutIssues`), malformed frontmatter.
- [x] Optional generated-HTML phase: commentable pages must carry `id="remark42-config"` + `<div id="remark42">`; negative sample of non-commentable pages; skipped when `public/` absent or `--no-public`. Bounded reads (one per commentable page + fixed sample).
- [x] Flags: `--root`, `--no-public`, `--sample <n>`, `--help`; deterministic sorted output; lists each thread URL so a base change is visible.

### 03 - Wiring and documentation
- [x] Root `package.json`: `"check:comments": "tsx custom-plugins/remark42/scripts/comments-identity-audit.mjs"` — not in `check`/`pre-push`/CI.
- [x] `DEV_COMMANDS.md`: added `check:comments` and `build:plugins`; removed false `prebuild` claim and nonexistent `npm --prefix custom-plugins/remark42 test`.

### 04 - Verification
- [x] Full gate green: `npm run check:types && npm run check:format && npm test && npm run build`.
- [x] `check:comments` green against current content (2 test notes present).
- [x] Behaviour confirmed: duplicate ids → build succeeds, audit fails naming both; invalid single id → build aborts.

### 05 - Cleanup
- [x] Deleted `custom-plugins/remark42-old/` (untracked; plain delete).
- [x] Deleted `content/remark42-shell-test.md`, `content/remark-comments-load-test.md` (stale pre-D5 runtime draft).
- [x] `PLAN.md`/`REMARK42.md`: absent, no-op recorded.

### 06 - Docs sync
- [x] `AGENTS.md` (§01, §01.2): `id` key + frozen thread URL; packaging boundary (committed `dist/`, explicit rebuild); validation split; no-test-suite policy; CI described.
- [x] `DEV_COMMANDS.md` synced (task 03).

## Completion Flow
### Run #1
- "Decisions" block: none in step; plan-level decisions D4/D5 unchanged. Step deviations recorded above and reflected in AGENTS.md.
- Frontmatter set (`implemented`/`condensed`, `reviewedAtStep: "07"`).
- USER CHECKPOINT — confirm before run #2.

### Run #2
- Condensed in place; work-notes removed; tasks collapsed to implemented summaries. Re-reading this step needs no other file.
