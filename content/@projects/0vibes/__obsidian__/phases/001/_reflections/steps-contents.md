---
publish: true
created: 2026-10-22T08:17:12.068Z
modified: 2026-10-24T14:45:16.573Z
published: 2026-10-24T14:45:16.573Z
isIntegrated: true
ctime: 2026-10-04 15:06
---

[← Plan](@projects/0vibes/__obsidian__/phases/001/_plan_001.md)

## Problems & Goals

-

## Insights

- ### Meta rules
  - Information in here shouldn't duplicate information in code.
    - Preserve what code can't cleanly communicate.
  - Don't overcomplicate things.
- ### Contents
  - ### Discussion
    - #### Why?
      - LLM rarely one shots good stuff. So during high-level generation, discussion block can be helpful.
    - #### Rules
      - Q & A format.
      - Questions to critique, improve, clarify, fix.
  - ### High Level
    - #### Why?
      - There is useful information of implementation that is not high-level enough for the plan, but at the same time will bloat implementation tasks. Objectives & Constraints are the place for this information
    - #### What should be here?
      - Intended outcome
      - Local invariants or exclusions (not covered by the plan)
      - Clear boundary for defining a completed step
      - Decisions that are not high-level enough to get into the plan.
      - What should NOT be done in this step.
    - #### Contents
      - Objective
      - Constraints
      - Decisions
      - Deviations
        - e.g. A planned abstraction was unnecessary because an existing module already owns that responsibility.
  - ### Context Gathering
    - #### Why?
      - Each step is started in a new task. So instead of LLM re-exploring what it needs to know - this section must give some tips on what and where LLM should explore.
    - #### What is preserved in here?
      - Related file paths with one-sentence description
        - Code files
        - READMEs
        - Local file of phase's folder
  - ### Implementation
    - #### Why?
      - Clean block for tracked implementation steps. Not bloated by high level or other stuff
    - #### Rules
      - Contents
        - H3 task\_number - task name
          - e.g. `### 03.1 - Subscription initialization`
        - Task list as `- [ ] Description of the task with up to 10 sentences.`
- ### Frontmatter state of step.
  - Creation time
    - This might be dodgy. But we can use templater script and see if it can catch LLM's file creation.
  - Status property - status of the step.
    - waiting - when step is planned, not postponed and not completed
    - implementation - step is being implemented
    - postponed - step must be done but exactly WHEN is unknown.
    - completed - step is completed.
  - State property - state of the step
    - high-level-step - step is filled only as high level, without much implementation details.
    - full-step - step is filled fully with high level planning and low level implementation steps
    - awaiting-review - step needs to be reviewed by the user.
  - ### Step Completion Flow
    - Why? - self documenting. PLANNING.md stays high-level and compact.
    - Placed as the separate block at the end of each state in markdown template.
    - Tasks
      - Make sure frontmatter properties set correctly.
      - Update step file for cleanup, so it won't have unnecessary information when we read it from further steps
        - **The goal is to remove working clutter—not produce a polished historical report.**
        - Remove temporary investigation notes that no longer matter.
        - Resolve or remove obsolete open questions.
        - Condense overly detailed execution tasks when they create reading noise.
        - Keep consequential decisions and intentional limitations.
        - Keep stable task identifiers if other documents reference them.
        - Preserve your original input rather than rewriting it into an LLM interpretation.
        - If the step is already compact, leave it alone.
  - ### Rules
  - Allow step number to be with decimal, to support unplanned scenarios, for which we can have in-between step like 05.5.
  - Steps will be file-only. No integrated ones into the file
    - Dataview JS will handle order and linking inside the plan
  - Naming
    - Files - lowercase. XX-name-of-step.md
  - Future steps 3-4-5 steps ahead - stay thin. Why? To allow flexible development process
- ### Plan-side
  - Templater
    - [ ] Create first step and last step during phase creation
      - Why?
        - Plan becomes leaner. LLM doesn't need to now about preparation checks and completion flow all the time.
      - Separate filled templates. They don't need to be aligned with templates of other steps because of their specificity.
      - Naming could be 00-START.md and 99-END.md
- ### LLM
  - Steps should be maintained to be read by LLM at any point of phase implementation.
  - If there's more than 10 steps - it would rational to use explore tool to figure out which step we should read.

---

### OLD RAW

- #### Reasons
  - You need \[ ]- so LLM can track tasks better
  - You need numbers, so LLM can track tasks better
  - To combine this
    - 4.1 - Name of the big task to do
      - -\[ ]  implementation task #1
  - So you have low level.
  - Now you need high level
  - Context first
    - Why?
      - If LLM will read previous 15 steps - it'll be o it'll be overwhelming and pollute context. Context handoff allows to avoid re-reading all those steps

- #### Contents
  - h2 - Accumulated Context
    - Rules:
      - Don't re-read previous steps unless there's absolute need for that.
      - Don't re-read ALL file paths unless all of those files are needed for proper implementation of the task
      - When task is completed
        - Update accumulated context
        - Finalize it in plan.md
        - Mark next step active (if any)
        - Fill summary or log.
    - Related file paths - 1 sentence description
    - ## Cumulative changes from previous steps
  - ## h2 - high level plan
  - h2 - implementation plan
  - h2 - log of implementation OR summary?

- Cumulative changes or context handoff - do I need it? Like there's a risk that it'll be bigger than many files.

- ### Steps
  - #### Structure
    - Log. Append-only: decisions & deviations made during work
  - #### Edge cases
    - Last step flow
    - Completion flow? do I need it?
    - Don't know the next step - what then, is it plan fault or you missing something?
  - #### Rules
    - Far steps stay thin. Don't make it super detailed because chances are that implementation will change as we go through it.

---

### Other

dataviewjs representation of the plan.
\- file-name is step name
\- first two number XX-name.md is ordering numbers
\- Inside each file we'll have description on at the top that will be parsed into dataviewjs.

- The issue is with LLMs. They don't see dataviewjs block.
  - What options do I have? duplication?
  - Or index.md in steps. But why? Doesn't make sense.
  - OR - very big and clear rule to ask llm to learn which steps are needed
    The thing is - these will be written by llm anyway. Ability to have decimal as number allows for inserting things in-between. Very unlikely you'll manually will do that often enough that it'll become tedious.
