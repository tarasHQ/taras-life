# Initial Planning

From initial refined reflection(**what** I want to do) -> to properly explored, brainstormed high level plan (**how** to do it on high-level without focusing on code too much)

**Why it's needed?**

- To explore all possibilities of implementation, so user can lock-in the optimal one.

## Rules

- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.

## Stages

- ### A - Exploration
  - [ ] **A1** - \[USER]
    - Provides LLM with artifacts that will be used in the scope of this flow
    - Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
  - [ ] **A2** - \[LLM]
    - LLM starts thorough exploration.
    - Goal of exploration is to be ready to list many possibilities of implementation of user's artifacts.
- ### B - Brainstorm
  - [ ] **B1** - \[LLM] - \*\*Response #1**
    - Responds with a one-off self-reflective exploration of implementation possibilities (plain response; no tools except the required final continuation read).
    - Format is nested lists of questions/points/reflections/ideas (no answers/finalizations/recommendations).
    - MANDATORY - end the response by reading `C:\Users\Taras\Documents\obsidian-vault\@system\projects\shared\loop-continuation.md` to continue automatically without asking the user to continue.
  - [ ] **B2** - \[LLM] - \*\*Response #2**
    - LLM lists of the most **(reasonable, high-level, radical, architectural)** implementation possibilities (anywhere from 1 to 15) for provided user's artifacts (plain response; no tools except the required final continuation read).
    - Those points may cover categories:
      - More streamlined code&#x20;
      - Reduced lines of code&#x20;
      - Avoiding writing unnecessary files
      - More performant or secure code
      - Missed blind spots/edge cases
      - "High Reward" preemptive refactorings
      - Better long-term decisions
      - Other, not listed high-impact categories.
    - **FORMAT of every point**
      - **Name** - `### [CATEGORY] Name-of-the-point`
      - **Description** - 1-3 sentences description of the point.
      - **How To Do This** - 1-3 sentences describing how to do the point.
      - **Benefit** - a paragraph on how this point is beneficial
      - **Complexity** - a paragraph or less about how complex is this point
      - **Closed Advantageous Doors** - bulleted list of others paths that will get closed/hard to mover/transfer to if this point will be accepted.
      - **Description In Simpler Terms** - a paragraph of description in simpler terms (non-advanced) about this point. Goal is to preemptively explain it in a bit more easier wording, so user won't get stuck on unknown technicalities.
    - MANDATORY - end the response by reading `C:\Users\Taras\Documents\obsidian-vault\@system\projects\shared\loop-continuation.md` to continue automatically without asking the user to continue.
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
    - **CRUCIAL** - it must be a self-contained list without depending on the user's knowledge of the earlier brainstorm responses.
  - [ ] **D2** - \[LLM] - \*\*Still Response #1**
    - Within the same response LLM writes a template for user response inside markdown codeblock
    - In this template it lists the number and name of the point and empty bullet point after for user to fill.
    - Each issue is separated by an empty line.
- ### E - The Discussion
  - [ ] **E1** - \[LLM + USER]
    - User will respond for clarification
    - Goal of the discussion is to refine ideas/possibilities/artifacts based on user feedback.
    - Discussion goes until the user is approved moving to the next stage.
- ### F - Filling Out the Plan and Drafting the Steps
  - [ ] **F1** - \[LLM]
    - LLM fills out the `_plan_xxx.md`'s **exploration section** with concise related links/tips on exploration for future tasks on this plan based on experience with current exploration.
    - Plan scope: phase-level knowledge only — step-scoped detail belongs in step files, not the plan. When updating exploration, remove stale/no-longer-relevant entries in the same pass.
    - **Between** 00 and 99 steps - inserts ### Drafted Steps Recommendation block, with suggested order/granularity of steps as simple bulleted list with one point per list (will be deleted when actual steps arrive)
      - steps are sorted "Highest step number on the top, lowest on the bottom"
  - [ ] **F2** - \[LLM + USER]
    - Through user's approval - LLM updates user's artifacts to be aligned with locked-in decisions/refining from current flow-task.
  - [ ] **F3** - \[LLM]
    - [ ] Writing a prompt for user (inside markdown codeblock) to run a writing steps flow in a clean task without current context.
- ### The End
