---
ctime: 2026-11-16 10:40
status: implemented
isIntegrated: false
---

[← Project](../../../_project.md)

# P 004 - Structure & Explorer
%%[Internal User Link to Template]([T]plan.md) LLMs should ignore both the link and the paths it hints on%%

## Description & Meaning
%%A few sentences about rough direction of the plan, just to get initial constraints on brainstorming. Visions will sustain meaning in the user through the whole process of planning and implementation%%

> [!summary]  
> ### Description
> Build a focused, internal Explorer and update the vault structure to support it. The Explorer is a flat map of top-level entry pages; those pages use generic Dataview listings to provide deeper navigation. Create entry pages where needed as one step of this phase. More specific and visually refined pages are future work.
> 
>  
> ### Visions
> > [!success] 
> > Vision on success. What about implementing these goals pulls you into enthusiasm? 
>
> > [!failure] 
> > Vision on failure. What if you fail to implement this? Is there something negative that pushes you into action?

## Documents
%%Dataview query for user. Renders list of documents from phase's inner folders. %%

```dataview
TABLE WITHOUT ID
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/_reflections")), (f) => f.link) AS "Reflections",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/ideas")), (f) => f.link) AS "Ideas",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/artifacts")), (f) => f.link) AS "Artifacts"
FROM ""
WHERE startswith(file.folder, this.file.folder + "/") AND file.path != this.file.path
SORT file.name ASC
GROUP BY true
```

---

## Persistent Storage
%%Bullet list only for important high-level things that MUST persists between steps. AS CONCISE AS POSSIBLE. %%
- Root homepage: `index.md`. A folder entry page is `_<folder-name>.md` inside that folder; matching is case-insensitive and otherwise includes all characters (e.g. `@system/_@system.md`).
- Explorer is a build-time, flat list of matching entry pages in immediate subfolders of the content root only; deeper entry pages are reached through page content. Use the existing processed title as the section label; if it is missing, empty, or identical to the entry filename stem, use the filename without its extension and first underscore. An explicitly authored title equal to that stem follows the same fallback; do not distinguish title provenance. Sort entries alphabetically by displayed label and place the homepage as `Home` at the bottom.
- An optional entry-page frontmatter icon selects a locally maintained SVG; use a default SVG when no icon is specified, and no icon for an unrecognized or unusable selection. Keep only selected icons in the project rather than shipping an entire icon library.
- Bake the complete Explorer and used icon definitions into each page whose resolved frame/layout renders Explorer; preserve sidebar-free frames and explicitly cleared left slots. Define each icon once per page and reuse it by namespaced ID; style icons in shared theme-aware CSS. No separate Explorer/icon fetch or browser-side list construction; browser code may handle mobile interaction. Check SPA behavior through practical browsing after implementation.
- Desktop retains the complete visible left sidebar (title, Search/theme toolbar, Explorer, future widgets), without an Explorer folding heading. On mobile, keep a simple always-sticky top bar for title/Search/theme and use a lower-right floating toggle to open only navigation/widgets as a full-viewport non-modal panel sliding from the right over a translucent blurred background. The open panel covers the bar. Render each widget once: explicit top-control metadata distinguishes the stationary region from default left-slot panel contents; controls are outside the moving panel. Search stays unchanged and outside its transform/hiding; no use of the main-column `header` slot, duplicate Search, or browser-time widget relocation. The frame/sidebar controller, not Explorer, owns this presentation. No focus-management/accessibility-specific work, page-scroll lock, gestures, or no-JavaScript fallback. Scroll-aware header behavior and extra floating buttons remain deferred.
- Vault structure is the navigation SSOT. Quartz Syncer renders DataviewJS listings during sync; generic entry-page trees provide deeper navigation. The trees exclude `@projects/0vibes` and need to be re-synced to reflect vault changes.
- Own a focused internal Quartz component rather than adapt or package the community Explorer. Beyond optional title and icon presentation metadata, no explicit navigation map, hierarchy overrides, or dedicated navigation-validation system; add capabilities later only if needed.
- Highlight the current top-level section's entry, including when viewing that entry itself; highlight `Home` on the homepage.
- Accept existing watch-mode partial rebuild behavior: unchanged pages can retain stale baked Explorer markup after entry changes, additions, or deletions. Document this limitation and the full-rebuild remedy in the relevant local README; do not add invalidation machinery for it.

## Exploration
%%Contains related exploratory knowledge to make initial exploration in the task more efficient.%%

- ### Context Files
	- `__obsidian__/docs/AGENTS.md` - project instructions and module README conventions.
	- `__obsidian__/phases/_archived/004/steps/02-internal-explorer.md` - condensed implementation record, verification limits, and Step 03 handoff for the internal Explorer and two-region sidebar.
	- `__obsidian__/phases/_archived/004/_reflections/initial-reflection.md`, `__obsidian__/phases/_archived/004/ideas/parking.md` - historical direction and decisions; mobile ownership/width and accessibility notes there are superseded by this plan and Step 02.
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
	- Entry pages are authored in the vault and synced to `content/`; the user reported that the trees and browser review worked, without detailed individual results.

---
---
---

## Steps


### ◎ [STEP 99 - End Of The Phase](./steps/99-end.md) - READY
Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.

### %%◉ STEP 03 - Vault Entry Pages & End-to-End Review - IMPLEMENTED
Added temporary folder-tree listings and clean titles to the vault's top-level entry pages, preserving existing icon choices and excluding the private project. The user reported the synced trees work and the requested browser review was done; individual review outcomes were not supplied.%%

### %%◉ [STEP 02 - Internal Explorer & Mobile Sidebar](./steps/02-internal-explorer.md) - IMPLEMENTED
Implemented the internal Explorer and two-region mobile sidebar. Verification limits and the comprehensive browser review handoff are recorded in the condensed step.%%

### %%◉ [STEP 01 - Explorer Navigation Model](./steps/01-explorer-navigation-model.md) - IMPLEMENTED
Implemented the build-time navigation model for the internal Explorer, including entry discovery, labels, ordering, destinations, and icon selections. The implementation was reviewed and passed automated verification.%%

### ◎ [STEP 00 - Start Of The Phase](./steps/00-start.md) - READY
The flow is to start the planning in the right state of mind and with the properly prepared phase



%%
### Info On Steps
- `state` - state of the step's contents
	- `condensed` or `◉` - after implementation's completion flow, state was condensed to be token-efficient. 
	- `full` or `◎` - high level and implementation blocks are written and step is ready for implementation.
	- `high-level` or `○` - only top high-level block is written and implementation block is not
	- `placeholder` - minimal file to just hold the place until there's time to do high-level/implementation blocks
- `status` - `ready/postponed/implemented/skipped` - self-explanatory statuses.
%%

---
---
---

## Meta-Plan Reflection
%%Plan structure, navigation, planning workflows, exploration, execution. Meta stuff. To improve meta plan%%
### User-issues
- 
### LLM-issues
- Where LLM had troubles with this "system of projects"? (if it had any)
	- 




