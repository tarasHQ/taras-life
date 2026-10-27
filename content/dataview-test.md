# Project "0vibes"

## YOUR reasons to work on it
- ### Cost
	Cheapest way to use LLMs, because you'll have full control over context + philosophy that user should work as well.
- ### Psychoanalysis
	You talk with LLM. It can search among other chats. Insights are easily sent into Anki
- ### Dev
	Branching allows to have context-efficient exploration inside a task. No auto-approve allows to avoid the temptation of vibe coding.
- ### Knowledge
	Since philosophy is to heavily involve human in the loop - you'll know your next projects much better than through other apps
- ### Your child - Love it
	This project is your child that will be very beneficial (if you have healthy relationship with it)


```dataviewjs
await cJS(c => c.RenderReflectionHelpers.renderColumns(dv, this.container));
```


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



# ==RECONSIDER  CANVAS==
It makes things monumental. Was stupid for the plan. But for phases... Maybe?

## Future Phases
- #### Phase 00X - Styles
	- Colors from .css files, instead of inline ones
	- remove tailwind classes that are not used/needed (llm loves to do that)
		- create stable and robust styled layout and framework, so it's easy to expand upon it

## Phases

### Phase 004 - UNTITLED_PHASE [open](_plan_004.md)

#### ==[ACTIVE] Phase 001 - ARCHITECTURE OF PLANNING== [open](@projects/0vibes/__obsidian__/phases/001/_plan_001.md)





