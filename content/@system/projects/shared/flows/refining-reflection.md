# Refining Reflection

**Why this flow is needed?**

- To avoid making suboptimal decisions because of the user's inexperience.
- To go WIDE before going NARROW. So decisions are made based on the full picture.

**When this flow is expected to run?**

- Invoked manually. When user wants to get big picture and see all possibilities of provided artifacts.

## Rules

- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.
- **TEMP ARTIFACTS ARE WRITE-ONCE** - `refining-possibilities-xxxx` etc. are written during the brainstorm stages and never edited or appended afterwards. Locked decisions/results go ONLY into durable documents (reflection, plan, steps) — never back into a temp artifact.

## Stages

- ### A - Exploration
  - [ ] **A1** - \[USER]
    - Provides LLM with artifacts that set the scope of the attack & discussion.
    - Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
  - [ ] **A2** - \[LLM]
    - LLM starts thorough exploration.
    - Goal of exploration is to be able to have context for brainstorming of radically different possibilities
- ### B - Brainstorm
  - [ ] **B1** - \[LLM] - \*\*Response #1**
    - Writes a temporary file with self-reflective exploration of all high-level possibilities in
    - Only `write` tool is allowed.
    - a temporary `.md` file inside `artifacts/refining-possibilities-xxxx`, where last 4 digits are random \[a-z0-9] to avoid duplication.
    - Format is nested lists of questions/points/reflections/ideas (no answers/finalizations/recommendations)
  - [ ] **B2** - \[LLM] - \*\*Response #2**
    - Only `write` tool is allowed.
    - Using already created temporary `.md` file `artifacts/refining-possibilities-xxxx` in previous stage
      - Using append functionality of write tool.
    - LLM writes in that file 5 to 10 **(reasonable, high-level, radical, architectural)** possibilities for improving user's artifacts.
    - **This file is write-once.** After this stage the artifact is never edited again — results/locked decisions go into durable documents in later stages.
    - Those points may cover categories:
      - Blind Spots
      - Security
      - Performance
      - Low Effort - High Reward ideas
      - Proper long-term decisions.
      - Other, not listed and high-impact categories.
    - **FORMAT of every point**
      - **Name** - `### [CATEGORY] Name-of-the-point`
      - **Description** - 1-3 sentences description of the point.
      - **How To Do This** - 1-3 sentences describing how to do the point.
      - **Benefit** - a paragraph on how this point is beneficial
      - **Complexity** - a paragraph or less about how complex is this point
      - **Closed Advantageous Doors** - bulleted list of others paths that will get closed/hard to mover/transfer to if this point will be accepted.
      - **Description In Simpler Terms** - a paragraph of description in simpler terms (non-advanced) about this point. Goal is to preemptively explain it in a bit more easier wording, so user won't get stuck on unknown technicalities.
- ### C - Further Exploration
  - [ ] **C1** - \[LLM]
    - LLM starts second pass of thorough exploration focused on points it listed in previous stage, to make sure descriptions/solutions/benefits/etc. is accurate.
    - LLM does it by running multiple `explore` tools in parallel to research/validate/confirm/refine listed points that need additional research
    - **Rules of Execution of the Stage**:
      - Each explore tool call is a new subtask (without referencing older ones)
      - Max amount of parallel tool calls is **5**
      - Each exploration subtask should have evenly divided work. For example, if you have 3 small issues and 1 big one, you may give a big one its own exploration, and for small issues explore all 3 of them in a single subtask.
      - Follow-ups are allowed.
- ### D - Listing Findings
  - [ ] **D1** - \[LLM] - \*\*Response #1**
    - No writing/editing of files is allowed.
    - LLM responds to the user with confirmed/validated/refined possibilities for improving user's artifacts.
    - In the same **FORMAT** that initial drafted list was written.
    - Each point - name, description, how to do this, benefit, complexity, closed advantageous door, description in simpler terms.
    - **CRUCIAL** - it must be a self-contained list without depending on user's knowledge of previously created temporary file and its contents.
  - [ ] **D2** - \[LLM] - \*\*Still Response #1**
    - Within the same response LLM writes a template for user response inside markdown codeblock
    - In this template it lists the number and name of the point and empty bullet point after for user to fill.
    - Each issue is separated by an empty line.
- ### E - The Discussion
  - [ ] **E1** - \[LLM + USER]
    - User will respond for clarification
    - Goal of the discussion is to refine ideas/possibilities/artifacts based on user feedback.
- ### F - Filling Out the Plan and Drafting the Steps
  - [ ] **F1** - \[LLM]
    - LLM fills out the `_plan_xxx.md`'s **exploration section** with concise related links/tips on exploration for future tasks on this plan based on experience with current exploration.
      - Since no files were touched - related links should only be under "Context Files" section
      - Plan scope: phase-level knowledge only — step-scoped detail belongs in step files or the flow's artifacts (from which steps are later written), not the plan. When updating exploration, remove stale/no-longer-relevant entries in the same pass.
  - [ ] **F2** - \[LLM + USER]
    - LLM asks for user's approval to update user's artifacts to be aligned with locked-in decisions/refining from current flow-task.
  - [ ] **F3** - \[LLM]
    - [ ] Writing a prompt for user (inside markdown codeblock) to start critique flow of the initial-reflection in a clean task without current context.
- ### The End
