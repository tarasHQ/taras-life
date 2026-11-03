---
status: implemented
state: condensed
---

[← PLAN](../_plan_002.md)

## Description
%%What this step is about, in 2-4 sentences%%
Groundwork and audits. **No code changes** — nothing under `quartz/`, `content/`, or tooling is modified. Produced the reference oracles and recorded audit results that make steps 02–04 mechanical instead of exploratory. All durable findings live in the plan's Exploration section and in the phase artifacts referenced below.

---

## Tasks
- 01.1 — **Sass-expanded oracle capture** — four captures in `artifacts/oracle/` (base/custom/popover/variables), sanity-verified: composition order syntax→callouts→base, all 24 `@font-face`, literal grids, no Sass residue. Key finding ([C7]): sass emits double-paren media conditions (`@media all and ((max-width: 800px))`) — step 02 must reproduce them verbatim, no normalization.
- 01.2 — **css-text flow invariant ([C1])** — chain verified end-to-end (handlers.js `sassPlugin type:"css-text"` → `.scss` imports yield CSS text → `joinStyles()` → `@layer quartz-base` → Lightning CSS minify → content-hashed `index-<hash>.css`). Binding contract for 02.1/04: `loader: { ".css": "text" }`, `parse.ts` worker stub extended to `.css`, `index.d.ts` wildcard swapped; `cssImports: true` dropped as vestigial.
- 01.3 — **Theme-consumer audit** — only `joinStyles()` reads `configuration.theme` at runtime (call site `componentResources.ts`); `Head.tsx` Google block is dormant under current config; `cfg.ts` import is type-only. Clears step 03 for theme surgery.
- 01.4 — **[C3] dead-CSS checklist** — resolved in `artifacts/dead-css-checklist.md` with user confirmation: math/typst selectors REMOVE (with `.math` class verify-guard before deletion), callout types KEEP all, popover KEEP ([C14]), no demo leftovers beyond those hits.
- 01.5 — **Generated theme CSS capture** — `oracle/generated-theme.css` valid (light `:root` + dark palette block + ~60 orphan aliases + `--accent-h/s/l`); HSL literals hand-verified against `hexToHsl`; scratch capture script deleted after the run.

---

## Should NOT be done in this step
- No SCSS→CSS conversion, no file deletions, no dependency removals, no toolchain edits (steps 02/04).
- No byte-diffing of build output ([C12] supersedes it).
- No README writing ([C15] → step 06).
- No removal decisions beyond the bounded [C3] checklist.
