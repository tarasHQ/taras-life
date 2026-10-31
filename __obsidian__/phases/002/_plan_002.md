---
ctime: 2026-10-31 23:16
isIntegrated: false
---

[← Project](../../_project.md)

# P 002 - Removing SCSS, Theming, Fonts plugin
%%[Internal User Link to Template]([T]plan.md) LLMs should ignore both the link and the paths it hints on%%

## Description & Meaning
%%A few sentences about rough direction of the plan, just to get initial constraints on brainstorming. Goals and visions that will sustain meaning in the user through the whole process of planning and implementation%%

> [!summary]  
> ### Description
> 
>  
> ### Goals
> #### Completion Goal #1 - Name
> Description
>  
> #### Completion Goal #2 - Name
> Description
>  
> #### Completion Goal #3 - Name
> Description
>  
> ### Visions
> > [!success] 
> > Vision on success. What about implementing these goals pulls you into enthusiasm? 
>
> > [!failure] 
> > Vision on failure. What if you fail to implement this? Is there something negative that pushes you into action?

## Documents
%%Dataviewjs snippet that renders list of documents from phase's inner folders%%

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


## High Level Planning
%%A place to have all high-level things that must persists through all steps.%%

### User-input
%%Goal is to keep user input raw and untouched, so it won't drift away between many tasks. Among many options can include: order of implementation, rules, nuances, wishes, open questions, features, invariants, etc.%%
- #### Decisions
  %%Why X? or why X and not Y? Can be in Q&A format%%
	- 
- #### Plan
- #### Nuances
- #### Out of Scope

---

### LLM-input S
%%Where LLM allowed to create, maintain. research and persist high-level information that needs to be persisted independently from steps-scope%%
- #### Decisions
- #### Plan
- #### Nuances

---
---
---

## Steps
%%State icons: ○ high-level, ◎ full, ◉ condensed.%%
%%To create a new step - use [step template](./steps/_step-template.md)%%

### ◉ [STEP 99 - End Of The Phase](./steps/99-end.md)
Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.

### ◉ [STEP 00 - Start Of The Phase](./steps/00-start.md)
The flow is to start the planning in the right state of mind and with the properly prepared phase

---
---
---

## Meta-Plan Reflection
%%Plan structure, navigation, planning workflows, exploration, execution. Meta stuff. To improve meta plan%%
### User-Issues
- 
### LLM-Issues
- 
