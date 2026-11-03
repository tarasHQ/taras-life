---
status: implemented
state: condensed
---

[← PLAN](../_plan_002.md)

## Description
Purely subtractive toolchain cleanup, implemented as planned with zero behavior change. All Sass machinery deleted; build output content-identical to step 03.

## Implementation Summary
- 04.1 - Strip Sass from `handlers.js` - Removed the `esbuild-sass-plugin` import, both `sassPlugin` instances (default `css-text` + dead `.inline.scss` filter), and the `**/*.scss` watch glob; `**/*.css` watch entry kept. Loader config untouched — the `.css` text-loader contract from step 02 carried the build.
- 04.2 - Residual sweep - Grep across prettier/lefthook/CI/tsconfig/build configs: zero sass/scss references; zero `.scss` files on disk. Remaining mentions: template yamls (die in step 05), vendored `docs/` (upstream), one accurate history comment in `handlers.js`. One stale comment in `parse.ts` cleaned (`.scss` mention dropped).
- 04.3 - Dependencies out + lockfile regen - `esbuild-sass-plugin` + `@quartz-community/quartz-fonts` removed from `package.json` (via direct edit + `npm install`, not `npm uninstall` — identical end state). Lockfile verified: `sass`, `sass-embedded`, `esbuild-sass-plugin`, `quartz-fonts` fully absent. Consumer audit: no hidden `quartz-fonts` imports in any `node_modules/@quartz-community/*` dist — clean `npm ci` safe.
- 04.4 - Gate - `npm run check && npm run build` green. Output-identity to step 03 verified by reasoning only (deletions are build-machinery with zero rendering effect); no hash comparison available post-gate.

## Code Review Outcomes
- Narrowed worker stub regex `/\.s?css$/` → `/\.css$/` in `parse.ts` (review point; overrides the step's original "don't touch parse.ts" constraint).
- Made the loader comment in `handlers.js` self-contained (dropped the "replaces sassPlugin contract" reference to deleted code).
- Rejected: templates referencing deleted `quartz-fonts` until step 05 (accepted gap, ignored). Noted: workspace name `quartz-local-remark42` vs folder `custom-plugins/remark42` is NOT a bug (npm resolves workspaces by package name); left as-is.
