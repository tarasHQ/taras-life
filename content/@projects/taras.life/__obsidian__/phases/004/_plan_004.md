---
publish: true
created: 2026-11-16T13:03:56.365Z
modified: 2026-11-19T22:31:50.728Z
published: 2026-11-19T22:31:50.728Z
ctime: 2026-11-16 10:40
isIntegrated: false
---

[← Project](../../_project.md)

# P 004 - Structure & Explorer

## Description & Meaning

> [!summary]  
>
> ### Description
>
> Build a focused, internal Explorer and update the vault structure to support it. The Explorer is a flat map of top-level entry pages; those pages use generic Dataview listings to provide deeper navigation. Create entry pages where needed as one step of this phase. More specific and visually refined pages are future work.
>
>  
>
> ### Visions
>
> > [!success]
> > Vision on success. What about implementing these goals pulls you into enthusiasm?
>
> > [!failure]
> > Vision on failure. What if you fail to implement this? Is there something negative that pushes you into action?

## Documents

| Reflections                                                                                                                | Ideas                                                                                         | Artifacts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li>[[@projects/taras.life/__obsidian__/phases/004/_reflections/initial-reflection.md\|initial-reflection]]</li></ul> | <ul><li>[[@projects/taras.life/__obsidian__/phases/004/ideas/parking.md\|parking]]</li></ul> | <ul><li>[[@projects/taras.life/__obsidian__/phases/004/artifacts/code-review-k7m2.md\|code-review-k7m2]]</li><li>[[@projects/taras.life/__obsidian__/phases/004/artifacts/critique-k3f9.md\|critique-k3f9]]</li><li>[[@projects/taras.life/__obsidian__/phases/004/artifacts/critique-q8v3.md\|critique-q8v3]]</li><li>[[@projects/taras.life/__obsidian__/phases/004/artifacts/implementation-possibilities-n7q2.md\|implementation-possibilities-n7q2]]</li><li>[[@projects/taras.life/__obsidian__/phases/004/artifacts/refining-possibilities-k4t7.md\|refining-possibilities-k4t7]]</li><li>[[@projects/taras.life/__obsidian__/phases/004/artifacts/refining-possibilities-k7m2.md\|refining-possibilities-k7m2]]</li></ul> |

---

## Persistent Storage

- Root homepage: `index.md`. A folder entry page is `_<folder-name>.md` inside that folder; matching is case-insensitive and otherwise includes all characters (e.g. `@system/_@system.md`).
- Explorer is a build-time, flat list of matching entry pages in immediate subfolders of the content root only; deeper entry pages are reached through page content. Use the existing processed title as the section label; if it is missing, empty, or identical to the entry filename stem, use the filename without its extension and first underscore. An explicitly authored title equal to that stem follows the same fallback; do not distinguish title provenance. Sort entries alphabetically by displayed label and place the homepage as `Home` at the bottom.
- An optional entry-page frontmatter icon selects a locally maintained SVG; use a default SVG when no icon is specified, and no icon for an unrecognized or unusable selection. Keep only selected icons in the project rather than shipping an entire icon library.
- Bake the complete Explorer and used icon definitions into each page whose resolved frame/layout renders Explorer; preserve sidebar-free frames and explicitly cleared left slots. Define each icon once per page and reuse it by namespaced ID; style icons in shared theme-aware CSS. No separate Explorer/icon fetch or browser-side list construction; browser code may handle mobile interaction. Check SPA behavior through practical browsing after implementation.
- Desktop retains the complete visible left sidebar (title, Search/theme toolbar, Explorer, future widgets), without an Explorer folding heading. On mobile, keep a simple always-sticky top bar for title/Search/theme and use a lower-right floating toggle to open only navigation/widgets as a full-viewport non-modal panel sliding from the right over a translucent blurred background. The open panel covers the bar. Render each widget once: explicit top-control metadata distinguishes the stationary region from default left-slot panel contents; controls are outside the moving panel. Search stays unchanged and outside its transform/hiding; no use of the main-column `header` slot, duplicate Search, or browser-time widget relocation. The frame/sidebar controller, not Explorer, owns this presentation. No focus-management/accessibility-specific work, page-scroll lock, gestures, or no-JavaScript fallback. Scroll-aware header behavior and extra floating buttons remain deferred.
- Vault structure is the navigation SSOT. Quartz Syncer renders Dataview queries to HTML before syncing content to Quartz; the user has already verified this works. Generic entry-page listings provide deeper navigation.
- Own a focused internal Quartz component rather than adapt or package the community Explorer. Beyond optional title and icon presentation metadata, no explicit navigation map, hierarchy overrides, or dedicated navigation-validation system; add capabilities later only if needed.
- Highlight the current top-level section's entry, including when viewing that entry itself; highlight `Home` on the homepage.
- Accept existing watch-mode partial rebuild behavior: unchanged pages can retain stale baked Explorer markup after entry changes, additions, or deletions. Document this limitation and the full-rebuild remedy in the relevant local README; do not add invalidation machinery for it.

## Exploration

- ### Context Files
  - `__obsidian__/docs/AGENTS.md` - project instructions and module README conventions.
  - `__obsidian__/phases/004/steps/02-internal-explorer.md` - condensed implementation record, verification limits, and Step 03 handoff for the internal Explorer and two-region sidebar.
  - `__obsidian__/phases/004/_reflections/initial-reflection.md`, `__obsidian__/phases/004/ideas/parking.md` - historical direction and decisions; mobile ownership/width and accessibility notes there are superseded by this plan and Step 02.
  - `quartz/components/README.md`, `quartz/plugins/loader/config-loader.ts`, `quartz.config.yaml` - component conventions, internal Explorer placement, and sidebar region configuration.
  - `quartz/components/explorerNavigation.ts`, `quartz/components/types.ts`, `quartz/plugins/pageTypes/dispatcher.ts` - navigation model and processed page-data handoff.
  - `quartz/build.ts`, `quartz/cli/handlers.js` - full and watch build behavior; partial rendering does not refresh every page's baked Explorer.
  - `quartz/components/frames/DefaultFrame.tsx`, `quartz/components/scripts/spa.inline.ts`, `quartz/styles/base.css` - two-region sidebar rendering, SPA lifecycle, and responsive layout.
  - `node_modules/@quartz-community/search/README.md`, `node_modules/@quartz-community/search/dist/components/index.js` - Search overlay and shortcut behavior; Search remains in the stationary sidebar region.
  - `node_modules/@quartz-community/note-properties/README.md`, `node_modules/@quartz-community/note-properties/dist/index.js` - installed frontmatter transformer; supplies a filename-stem title when the authored title is missing or empty.
- ### Exploration Tips
  - Match existing page data's source-relative paths and use Quartz's published slugs for links. Current generated 404 and `.base` page paths do not match the entry convention; don't add speculative virtual-page tracking.
  - Reuse existing parsed title and icon metadata. Accept the identical-to-filename title fallback rather than introducing provenance tracking, additional parsing, or a separate registry; keep tests focused.
  - Watch rebuilds may leave stale Explorer copies on unchanged pages; document the full-rebuild remedy rather than adding invalidation machinery.
  - Trust the already-verified Dataview/Syncer workflow. Determine vault authorship and needed entries with the user rather than assuming synced `content/` is the authoring source.
  - Step 02 records the observed mobile menu and Search scroll-fix checks, but detailed outcomes for the other Search smoke checks were not reported. Step 03 owns comprehensive review: navigation/back/forward, repeated panel use, resizing, themes, icons, phone scrolling/safe areas, cleared left slots, and Search click/shortcut, layering, Escape/focus, and result navigation. Source inspection and automated checks are not browser proof.

---

---

---

## Steps

### ◎ [STEP 99 - End Of The Phase](./steps/99-end.md) - READY

Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.

### Remaining Step — Draft Structure

- **03 — Vault entry pages and end-to-end review:** Determine needed generic Dataview entry pages and their vault-authoring workflow with the user; apply title/icon selections, verify synced output, and browse navigation, sticky mobile top controls/separate widgets panel, existing Search, themes, and SPA history together.

### %%◉ [STEP 02 - Internal Explorer & Mobile Sidebar](./steps/02-internal-explorer.md) - IMPLEMENTED

Implemented the internal Explorer and two-region mobile sidebar. Verification limits and the comprehensive browser review handoff are recorded in the condensed step.%%

### %%◉ [STEP 01 - Explorer Navigation Model](./steps/01-explorer-navigation-model.md) - IMPLEMENTED

Implemented the build-time navigation model for the internal Explorer, including entry discovery, labels, ordering, destinations, and icon selections. The implementation was reviewed and passed automated verification.%%

### ◎ [STEP 00 - Start Of The Phase](./steps/00-start.md) - READY

The flow is to start the planning in the right state of mind and with the properly prepared phase

---

---

---

## Meta-Plan Reflection

### User-issues

-

### LLM-issues

- ## Where LLM had troubles with this "system of projects"? (if it had any)
