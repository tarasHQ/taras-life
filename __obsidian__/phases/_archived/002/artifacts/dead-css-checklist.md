[← PLAN](../_plan_002.md)

# [C3] Dead-CSS Checklist — Resolutions

Resolved on paper in step 01 (task 01.4). Decisions are consumed by step 02 **during** conversion (files touched once). Rule applied throughout: prune conservatively within this checklist only; off-initial-paint usage wins ties.

## (a) Selectors referencing removed-plugin features

> [!resolved] 01.4 finalized — user confirmed the keep-all callout decision; checklist is complete and binding for step 02.

Grep over `quartz/styles/` + `quartz/components/styles/` for `graph|katex|latex|decrypt|reader-mode|tag`. Result: only math/typst hits in `base.scss`. Graph, decrypt, reader-mode, tag-page selectors: **zero hits — nothing to decide.**

| Hit | Where in `base.scss` | Decision | Rationale / guard |
| --- | --- | --- | --- |
| `.katex` (in the big text-color selector list `p, ul, text, a, …`) | color list near top | **REMOVE** | LaTeX plugin removed; no math engine; no math content |
| `.math` + `.math-display` | same color list + own display rule | **REMOVE** — verify first | Guard: before deleting in 02.4, grep the installed `@quartz-community/obsidian-flavored-markdown` dist for `math`/`katex` class emission; delete only if it never emits them |
| `mjx-container.MathJax` rules (3 rule blocks under `article`) | blockquote/MathJax region | **REMOVE** | MathJax shipped with the removed latex plugin |
| `.katex-display` | own rule near end | **REMOVE** | same as `.katex` |
| `.typst-doc`, `g[class~="typst-text"]`, `path[class~="typst-shape"]` | color list + stroke rule | **REMOVE** | No typst plugin in config; typst syntax never authored |

## (b) Callout types — styled vs. used

Styled in `callouts.scss`: note (default), abstract, info, todo, tip, success, question, warning, failure, danger, bug, example, quote.

Used in `content/`: only `>[!tldr]` (in `markdown-test.md:60` — a test page).

- **Open question to verify in 02.4:** does the callouts transformer alias `tldr` → `abstract` (emitting `data-callout="abstract"`, so abstract styling applies) or emit `data-callout="tldr"` verbatim (falls back to default note styling)? Obsidian's own mapping is tldr → abstract; verify against the installed plugin's dist. The decision below holds either way.
- **RESOLVED (user-confirmed): KEEP all styled callout types.** Rationale: total cost is a few hundred bytes; `markdown-test.md` is the standing rendering reference and may exercise more types over time; authoring flexibility preserved; the conservative-prune rule prefers keeping on ties. (The aggressive alternative — pruning the 11 unused types — saves almost nothing and forecloses callouts the user may author later.)

## (c) Popover CSS

**KEEP** — resolved at planning ([C14]): popovers power linked-note hover previews (enabled via `enablePopovers`). No action; recorded for completeness.

## (d) Incidental Quartz-demo leftovers in `base.scss`

None beyond the (a) hits. Checked and explicitly KEPT:

- `.desktop-only` / `.mobile-only` — consumed by layout `display:` options (e.g. spacer is `display: mobile-only`).
- `.navigation-progress` — SPA router progress bar (`enableSPA: true`).
- `.transclude` — block references/transclusions (`parseBlockReferences: true`).
- `.external-embed.youtube`, `iframe.pdf` — YouTube/PDF embeds enabled.
- `code.mermaid` pre handling — mermaid enabled.

## Post-implementation resolution (step 02)

The mandated verification for `.math` FIRED: the installed `@quartz-community/obsidian-flavored-markdown` dist **does** emit `math-display` / `math-inline` classes (dist `className: ["language-math", "math-display"]`). The checklist's own condition ("delete only if it never emits them") is therefore unmet for `.math*`. **User decision (step 02): REMOVE anyway** — no math is authored and no math engine is attached, so the selectors can only target markup from a removed feature; if math ever returns, its styling returns with it. `.katex`, `.katex-display`, `mjx-container.MathJax`, and `typst-*` remain never-emitted removals (verified).
