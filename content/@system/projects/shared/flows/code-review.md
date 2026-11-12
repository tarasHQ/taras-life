# Code Review

A task that is purely focused on quality of code of the implemented step.

**Why it's needed?**

- Implementation flow usually have some additional explorations, discussion, rewrites/updates/etc., by the time it's done - context is too bloated for the proper code review.
- This flow allows to maintain high quality of the written code by fully specializing on a single task.

## Rules

- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.
- **TEMP ARTIFACTS ARE WRITE-ONCE** - `code-review-xxxx` etc. are written during the review stages and never edited or appended afterwards. Locked decisions/results go ONLY into durable documents (code, plan, steps) — never back into a temp artifact.

## Stages

- ### A - The Exploration
  - [ ] **A1** - \[USER]
    - Provides LLM with artifacts that will be used in the scope of this flow.
    - Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
  - [ ] **A2** - \[LLM]
    - LLM starts thorough exploration.
    - Goal of exploration is for LLM to know **WHAT** should've been implemented and **HOW** it was implemented, including its integration into the context of the phase.
- ### B - The Explanation Of Implementation
  - [ ] **B1** - \[LLM]
    - LLM responds to the user with a two-block response:
      1. proper explanation of implementation first
      2. Preemptive explanation in simpler terms, in case user won't understand something because of lack of knowledge/experience on the matter.
    - The goal of this answer is to ensure the user has good knowledge of what was done.
  - [ ] **B2** - \[LLM]  - THE EXAM
    - LLM must ensure that user has proper knowledge of what was done on low and high levels. For that, after the explanation - LLM must do an exam for the user and proceed only if user scores 90% correct responses.
    - Format of the exam
      - Goal isn't to catch the user on syntax technicalities, but to make sure he truly understand how things works in code and abstractly.
      - Questions that accept written answer only.
      - Expected answer should be under 2-3 sentences (not penalized if longer but correct).
      - Amount of questions should be sufficient to cover the step.
- ### C - The Code Review
  - **Tone** - Honest, Critical, Realistic, Efficient.
  - **C1** - \[LLM] - \*\*Response #1**
    - Using `write` tool.
    - Writes a temporary self-reflective exploration of all review possibilities in a temporary `.md`  file inside `artifacts/code-review-xxxx`, where last 4 digits are random \[a-z0-9] to avoid duplication.
    - Format is nested lists of questions/points/reflections/ideas (no answers/finalizations/recommendations)
  - [ ] **C2** - \[LLM] - \*\*Response #2**
    - Only `write` tool is allowed.
    - Using already created temporary `.md` file `artifacts/code-review-xxxx` in previous stage
      - Using append functionality of write tool.
      - This file is write-once. After this stage the artifact is never edited again — results/locked decisions go into durable documents in later stages.
    - LLM lists 5 to 15 of the most **(reasonable, low-level, radical, architectural)** implementation possibilities for the implemented step.
    - Those points may cover categories:
      - More streamlined code
      - Reduced lines of code
      - Bugs
      - Missed handling edge cases
      - Code Smells
      - Quick and dirty solutions instead of proper ones
      - Avoiding writing unnecessary files
      - More performant or secure code
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
    - **THE LAST POINT**
      - At the end of the list llm adds the last point under which it lists minor issues. Like wrong/outdated comments, importing/exporting issues, typos, ordering of the code in files, and other minor issues that should be fixed, but that aren't big enough to be covered under points above.
- ### D - Further Exploration
  - [ ] **D1** - \[LLM]
    - LLM starts second pass of thorough exploration focused on points it listed, to make sure descriptions/solutions/benefits/etc. is accurate.
    - LLM does it by running multiple `explore` tools in parallel to research/validate/confirm/refine listed points that need additional research
    - **Rules of Execution of the Stage**:
      - Each explore tool call is a new subtask (without referencing older ones)
      - Max amount of parallel tool calls is **5**
      - Each exploration subtask should have evenly divided work. For example, if you have 3 small issues and 1 big one, you may give a big one its own exploration, and for small issues explore all 3 of them in a single subtask.
      - Follow-ups are allowed.
- ### E - Listing Findings
  - [ ] **E1** - \[LLM] - \*\*Response #1**
    - No writing/editing of files is allowed.
    - LLM responds to the user with confirmed/validated/refined points of code review.
    - In the same **FORMAT** that initial drafted list was written. From **FORMAT of every point**.
    - **CRUCIAL** - it must be a self-contained list without depending on user's knowledge of previously created temporary file and its contents.
  - [ ] **E2** - \[LLM] - \*\*Still Response #1**
    - Within the same response LLM writes a template for user response inside markdown codeblock
    - In this template it lists the number and name of the point and empty bullet point after for user to fill.
    - Each issue is separated by an empty line.
- ### F - Action
  - [ ] **F1** - \[LLM + USER]
    - Discussing the review
  - [ ] **F2** - \[LLM]
    - Implementing locked-in points from review and fixing the code
  - [ ] **F3** - \[LLM]
    - Making sure that the plan and steps are aligned with results of the current flow
- ### The End
