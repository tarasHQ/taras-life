---
status: implemented
state: condensed
reviewedAtStep: "02"
---

[← PLAN](../_plan_001.md)

## Description
Established the new plugin package at `custom-plugins/remark42`, written **from scratch** under Quartz's documented compiled-package model (D1): TypeScript/TSX source, declared dependencies, an explicit esbuild build, committed `dist/`, exports pointing to built JavaScript. Site generation consumes that output and never compiles the plugin. The previous implementation stays untouched and unreferenced at `custom-plugins/remark42-old/` (deleted at step 07). The render is a throwaway scaffold reproducing the current DOM contract so deployed HTML does not change until steps 03–05 reshape it.

## What Was Built

### Package & tooling
- `custom-plugins/remark42/` — `package.json` (`quartz-local-remark42`, workspace member, `quartz` manifest with component `Remark42` registered under `remark42`, `defaultEnabled: false`; `exports` `.`/`./components` → `./dist/index.js`), `tsconfig.json` (extends root; no `types`/`typeRoots` workaround — typechecks on root defaults alone), `build.mjs` (esbuild pass 1: `src/browser.ts` → minified IIFE string; pass 2: `src/index.tsx` → node ESM with virtual `remark42:browser` module; output-dir override for the gate; post-build assertions).
- `scripts/check-imports.mjs` — dependency-free Windows-safe guard over `src/` only: no `quartz/` host imports, no escapes out of `src/`, no Node builtins (`node:*` and bare names).
- `scripts/verify-dist.mjs` — dependency-free freshness gate: rebuilds into `os.tmpdir()`, diffs against committed `dist/` (changed/missing/extra → fail), asserts every `dist/` file is git-tracked (`git ls-files` run with `cwd: dist/` so paths align), asserts `preact/jsx-runtime` resolves to one realpath from root and plugin entry (`.npmrc` makes `peerDependencies` inert, so this is the enforcement, not a declaration).
- Scaffold sources: `src/index.tsx` (component reading `host`/`siteId`/`threadBaseUrl` + `comment-id` frontmatter; renders the exact old DOM contract: `<section class="remark42-comments" aria-label="Comments">`, `<h2>Comments</h2>`, `div#remark42` with `data-comment-id`/`data-remark42-host`/`data-remark42-site-id`/`data-remark42-url`/`data-remark42-title`, `<p role="status">Loading comments…</p>`; thread URL `${threadBaseUrl}/${id}`; renders `null` without a non-empty string id or with `comments: false`; minimal presence guard on options — real validation is step 03), `src/browser.ts` (no-op placeholder bootstrap), `src/browser-script.d.ts`. `@quartz-community/types` confirms its `QuartzComponent` has no `displayName` — registration comes solely from the manifest.
- `fixtures/` (provenance README + `remark42-v1.18.0-embed.mjs`) lives in the new package; verified byte-identical to the old copy, so git saw no fixture change.
- Root scripts: `prebuild` and `build:local-plugins` deleted; added `build:plugins`, `plugin:fresh`, `check:types`, `check:format`; `check` = types + format + freshness; `build` = `plugin:fresh && npx quartz build` (decision 11a). Plugin typecheck folded into root `check` via workspace script; CI's duplicate "Check Remark42 types" step deleted and steps reordered (check → test → build, fast failures first).
- `.prettierignore` comment split: `fixtures/` = third-party, `dist/` = first-party generated output (both stay ignored).
- `remark42-old/test/` deleted (git-tracked at the pre-move `remark42/test/` paths — the physical move had never been a git operation; see deviations). The `CUSTOM EDIT BY TARAS.` comment on `linkLocalPlugin` in `gitLoader.ts` was already in its final intended form from planning; no edit needed.

### Verification (all green)
- Local: `npm install` (workspace linked, lockfile regenerated), `npm run build:plugins`, `plugin:fresh`, `check`, `test`.
- Clean checkout: wiped `node_modules`/`.quartz/`/`public` → `npm ci` → `npm run check` → `npm test` → `npm run build`.
- HTML: `remark42-shell-test.html` carries the exact DOM contract with `data-remark42-url="https://taras.life/comments/remark42-shell-test"`; `index.html`/`404.html` render nothing; identical component-CSS set on all pages. Bootstrap ships in `static/scripts/script-1-c040109a.js`, loaded transitively by the `postscript-*.js` orchestrator (production emits per-script hashed files; `--serve` bundles monolithically — 54 vs 44 emitted files is the documented asymmetry).
- Bare `npx quartz build` and `npx quartz build --serve` both pass with no plugin compilation.
- Deployment (Workers Builds, version `5144fbd7-692c-4666-bec8-d533a470b16e`, 2026-10-25): build command `git fetch --unshallow || true; npm run build` → `npx wrangler deploy`; node `22.22.3`, npm `10.9.2` (matches `.node-version`); the gate itself ran in the pipeline (`verify:dist passed` on a foreign machine) and `NODE_ENV` concern is disproven in practice (esbuild-as-devDependency worked pre-build); live page has the container, `script-1-c040109a.js` → HTTP 200, no plugin compilation in the log. Widget does nothing until step 06 — accepted (Discussion 8).
- Atomic commit landed on `main`; commit-alone sufficiency proven by both the wiped local tree and the Workers clean-install.

## Caught Implementation Deviations
- **Plan syntax bug**: the plan's task texts carried `npm run --workspace <pkg> run <script>`, which is invalid npm syntax (`run` is parsed as the script name). Fixed in the implemented scripts to `npm run <script> --workspace <pkg>`.
- **`verify-dist.mjs` path bug**: original `git ls-files -- dist` from the plugin root produced `dist/…` paths that never matched listings relative to `dist/`; fixed by running `git ls-files` with `cwd: distDir`.
- **Strict-mode fix**: `frontmatter` is possibly `undefined` at the access site; added an explicit `!frontmatter` early return (same render-nothing semantics as before).
- **Git history discovery**: the old plugin was tracked at `custom-plugins/remark42/**`, so the physical move surfaced as deletions+untracked rather than renames. `remark42-old/` was left untracked on disk (git history at the pre-move paths is the fallback); stale docs `custom-plugins/PLAN.md|README.md|REMARK42.md` restored and kept until step 07.
- **Postscript orchestrator discovery** (corrects a plan expectation): production HTML does not reference component scripts directly; `postscript-*.js` dynamically imports the hashed `static/scripts/script-*.js` files.
- **For step 07**: AGENTS.md references `./docs/DEV_RULES.md` but the file lives at `__obsidian__/docs/DEV_RULES.md` — fix during AGENTS.md sync.
- User's root `README.md` and `__obsidian__/` changes were ignored as out of scope for this step.

## Steps Alignment Check
Steps 03–08 remain aligned with what was built: 03 (options contract) and 04 (identity) replace scaffold behaviour that exists only to hold the DOM contract; 05 (render component) already has the compile pipeline it needs; 06 (browser runtime) owns the real bootstrap and has its fixture in place; 07 owns README/tests/old-folder deletion/AGENTS sync and inherits the recorded deployment facts above. No conflicts found.
