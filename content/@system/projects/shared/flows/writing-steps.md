# Writing Steps

From initial refined reflection(**what** I want to do) -> to properly explored, brainstormed high level plan (**how** to do it on high-level without focusing on code too much) -> to current flow of writing steps(**how** to do it on low-level)

**Why it's needed?**

- Implementation/Execution of the plan (which steps are represent) is major part of the phase, and it needs separate focused attention and shouldn't be taken lightly.

## Rules

- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.
- **TEMP ARTIFACTS ARE WRITE-ONCE** - planning-flow artifacts (`implementation-possibilities-xxxx` etc.) are never edited or appended in this flow. Their locked decisions were already integrated into the plan/reflection.
- If there's unexpected additional work - a step can be split into multiple ones.
  - Decimal points for numbering 05, 05.1, 05.2.
  - New steps are created using current flow.
  - New steps are inserted into the plan
- **STEP ORDER** - steps are WRITTEN ascending (01→07, dependency order) but LISTED descending (99→00 top-to-bottom): anchor each new step on the previous step's heading (inserts above); first step anchors on the `=== INSERT STEPS HERE ===` marker.

## Stages

- ### A - The Exploration
  - [ ] **A1** - \[USER]
    - Provides LLM with artifacts that will be used in the scope of this flow
    - Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
  - [ ] **A2** - \[LLM]
    - LLM starts thorough exploration.
    - Goal of exploration is to be ready to start planning/writing steps
- ### B - Planning the Structure of Steps
  - [ ] **B1** - \[LLM]
    - LLM proposes the structure of steps.
    - LLM ignores drafted structure of steps in the plan. It's only a rough reference and shouldn't be considered for proper structuring of the steps.
    - **Requirements:**
      - [ ] Description block at the start of the proposed structure
        - Contains HOWs and WHYs this structure is the optimal for the execution.
      - [ ] Correct Sizing
        - Step shouldn't cover significantly unproportional amount of work compared to other steps
        - Step shouldn't significantly overlap other steps
        - Step shouldn't need 100k tokens exploration before implementing it
        - Step should be logically modular
      - [ ] Self-sufficient
        - All the related knowledge, related links to files, locked decisions, invariants, etc. - is present in the step file.
  - [ ] **B2** - \[LLM + USER]
    - LLM discusses with user proposed structure
    - If user accepts it - LLM starts writing step, one-by-one.
- ### \[LOOP] C - Writing the Steps
  - [ ] **C1** - \[LLM]
    - Reads template for steps `C:\Users\Taras\Documents\obsidian-vault\@system\projects\shared\templates\step-template.md`
    - Starts writing steps incrementally.
      - If this flow was run on the job that was done partially (like steps 0-5 is done, and 6-10 need to be written) - LLM just continues from the last step.
    - The writing happens in single response where LLM uses 2 tools to:
      1. Write step file
      2. Updates the plan
    - Nuance for updating the plan without re-reading it on every step.
      - Use edit tool. And use name of the previous step as the anchor for replacement. new string will contain whole new step + the name of previous step. In that manner whole new block can be safely inserted.
    - Plan scope: when updating the plan — phase-level knowledge only; step-scoped detail lives in the step files (or planning-flow artifacts they were written from). When updating exploration, remove stale/no-longer-relevant entries in the same pass.
    - Steps should be written in descending order in-between existing step-99 and step-00. (highest step is first/above)
  - [ ] **C2** - \[LLM + USER]
    - Discussion.
    - If LLM sees any issues/open questions with the step - it asks user. If everything is straightforward - LLM just waits for user to approve the created step
  - [ ] **C3** - \[LLM]
    - On user approval LLM restarts the loop for the next step and starts from **C1**.
- ### The End
