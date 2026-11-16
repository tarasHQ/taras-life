---
ctime: 2026-11-16 10:40
isIntegrated: false
---

[← Project](../../_project.md)

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
- Explorer is a build-time, flat list of matching entry pages in immediate subfolders of the content root only; deeper entry pages are reached through page content. An optional frontmatter title supplies the section label; otherwise use the filename without its extension and first underscore. Sort entries alphabetically and place the homepage as `Home` at the bottom.
- An optional entry-page frontmatter icon selects a locally maintained SVG; use a default SVG when no icon is specified. Keep only selected icons in the project rather than shipping an entire icon library.
- Bake the complete Explorer and used icon definitions into each page's HTML. Define each icon once per page and reuse it by namespaced ID; style icons in shared theme-aware CSS. No separate Explorer/icon fetch or browser-side list construction; browser code may handle mobile interaction. Check actual output size and SPA behavior.
- The original desktop direction is an always-visible Explorer without a heading that folds it. On mobile, use a compact floating button on the right, with room to later add scroll-up/down buttons as a vertical group. The menu opens from the right and fits its content rather than using a fixed percentage or pixel width.
- Vault structure is the navigation SSOT. Quartz Syncer renders Dataview queries to HTML before syncing content to Quartz; generic entry-page listings provide deeper navigation.
- Own a focused internal Explorer rather than adapt the community package. Beyond optional title and icon presentation metadata, no explicit navigation map, hierarchy overrides, or dedicated navigation-validation system; add capabilities later only if needed.

## Exploration
%%Contains related exploratory knowledge to make initial exploration in the task more efficient.%%

- ### Links To Related files
  %%Format is a link inside inline codeblock [file-size-in-kb-from-explore-tool] - 1-2 sentence description of files contents and how it's related to the whole phase.%%
	- ##### Created Files
		- 
	- ##### Modified Files
		- 
	- ##### Deleted Files
		- 
	- ##### Context Files
		- `__obsidian__/docs/AGENTS.md` - entry point to the project for LLMs.
		- `__obsidian__/phases/004/_reflections/initial-reflection.md` - agreed direction, scope, and open interaction details.
		- `__obsidian__/phases/004/ideas/parking.md` - original notes and consolidated later decisions; the latter supersede conflicting earlier ideas.
		- `quartz.config.yaml` - current community Explorer registration and layout placement.
		- `quartz/components/README.md` - static component rendering and browser resource conventions.
		- `quartz/components/types.ts`, `quartz/plugins/pageTypes/dispatcher.ts` - build-time page data available to components, including source paths and published slugs.
		- `quartz/plugins/loader/config-loader.ts` - component registration and layout integration.
		- `quartz/components/scripts/spa.inline.ts`, `quartz/styles/base.css` - SPA lifecycle and responsive layout constraints.
		- `C:/Users/Taras/Dev/_other/quartz/explorer-main` - source code of quartz's explorer plugin. For reference. We must do our own thing that's optimal for current flow.
- ### Exploration Tips
  %%Free form. Concise. For more precise exploration. Goal is to avoid misleading/wrong/inefficient exploration. Optional. Should be really concise though %%
	- Match entry names against original relative paths; use actual published slugs for links. Page data can also include virtual pages, so distinguish them from source entries.
	- Confirm the internal component's registration path and mobile/SPA interaction details during step-writing; don't assume the community package's design is suitable.

---
---
---

## Steps


### ◎ [STEP 99 - End Of The Phase](./steps/99-end.md) - READY
Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.

=== INSERT STEPS HERE ===

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




