---
status: waiting
state: high-level
reviewedAtStep: "|CURRENT_STEP_NUMBER_OR_00_IF_NO_STEPS to|"
---
%%text within |TEXT| should be filled by LLM%%
[← PLAN](../_plan_002.md)

## Description
|FILLED_BY_LLM|

## USER INPUT
%%written by user in case of additional feedback%%

## High-Level

### Intended outcome
|FILLED_BY_LLM|

### Local invariants
%%if any%%
|FILLED_BY_LLM|

### Should NOT be done in this step
|FILLED_BY_LLM|

## Discussion & Reflections
|FILLED_BY_LLM|

---
---
---
%%SECTION BELOW IS WRITTEN IN A SECOND PASS AFTER SECTION ABOVE IS LOCKED-IN%%

## Tasks
%%Contains list of tasks. Example of format to be used is in completion flow section%%


---

## Completion Flow
%%Should be copied 1:1 into a new step%%

### 01 - Finalizing the Current Note
- [ ] Setting up corresponding status  
- [ ] Commenting the step inside single `%%comment-block%%` starting right after the icon, and up until the end of the step description.

### 02 - Finalizing the Step In the Plan
- In List of Steps:
	- [ ] Settings an icon to corresponding frontmatter status of the step.  
	- [ ] Rewriting description from "what should've been implemented" to what "what was implemented"
	- [ ] Commenting the step inside single `%%comment-block%%`placing first `%%` tag right after the icon in heading, and placing second `%%` tag at the end of the new "implemented" step description.
- In Other Parts of the Plan:
	- [ ] Making sure plan does not contradict to what was done in the current step. Like situations when fact X in plan says one thing, but implemented fact X in the step does different thing. 

### 03 - Finalizing the Step In the Phase
- [ ] Updating `_exploration.md` in `artifacts/` folder, which is alongside the plan file of the phase. 

### 04 - Condensation of Current note
%%Goal is to shed all useless things, so this step can be token-efficiently read for context in the future. %%
- [ ] It starts in separate clean task. DO NOT allow user to run condensation if other things were executed in current task. 
- [ ] Condensation is NOT started automatically by the agent. ONLY through explicit command from the user. 
- If previous conditions are met:
	- [ ] Resolve temporary notes/open questions (if any) with the user. Ask him about what to do about them.
	- [ ] Remove temporary notes/investigations (if any)
	- [ ] Condense each task + subtasks to a single '- Task Name - Task Description in 1-3 sentences' bullet point
	- [ ] Remove completion flow block
	- [ ] Make sure note's frontmatter status/states is correct