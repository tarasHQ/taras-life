# Code Review

A task that is purely focused on quality of code of the implemented step.

**Why it's needed?**

- Implementation flow usually have some additional explorations, discussion, rewrites/updates/etc., by the time it's done - context is too bloated for the proper code review.
- This flow allows to maintain high quality of the written code by fully specializing on a single task.

## Rules

- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.

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
    - LLM must ensure that user has proper knowledge of what was done on low and high levels. For that, after the explanation - LLM must do an exam for the user.
    - Format of the exam
      - Goal isn't to catch the user on syntax technicalities, but to make sure he truly understand how things works in code and abstractly.
      - Multiple-choice exam.
      - Amount of questions should be sufficient to cover the step.
- ### C - The Code Review
  - **Tone** - Honest, Critical, Realistic, Efficient.
  - **C1** - \[LLM] - \*\*Response #1**
    - Responds with a one-off self-reflective exploration of review possibilities (plain response; no tools except the required final continuation read).
    - Format is nested lists of questions/points/reflections/ideas (no answers/finalizations/recommendations).
    - MANDATORY - end the response by reading `C:\Users\Taras\Documents\obsidian-vault\@system\projects\shared\loop-continuation.md` to continue automatically without asking the user to continue.
  - [ ] **C2** - \[LLM] - \*\*Response #2**
    - LLM lists **(reasonable, low-level, radical, architectural)** refinement possibilities (anywhere from 1 to 15) for the implemented step (plain response; no tools except the required final continuation read).
    - Those points may cover categories:
      - Top Priority: Bugs
      - More streamlined code
      - Reduced lines of code
      - Missed handling edge cases
      - Code Smells
      - Styling overlapping or unnecessary/redundant rules
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
    - MANDATORY - end the response by reading `C:\Users\Taras\Documents\obsidian-vault\@system\projects\shared\loop-continuation.md` to continue automatically without asking the user to continue.
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
    - **CRUCIAL** - it must be a self-contained list without depending on the user's knowledge of the earlier review responses.
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
    - Aligning plan and steps with results of the review:
      - Step files: unrestricted — record outcomes, decisions, loop items there.
      - Plan: CONTRADICTION FIXES ONLY. If the plan's description of the step
        is factually wrong (e.g. counts of what was done) — correct it to match
        the step file, keeping the plan's existing level of detail on HIGH-LEVEL.
      - NEVER copy review outcomes, open loop items, code-level details
        (selectors, values, mechanisms) into the plan or step description —
        those live in the step file. If a loop item needs to survive, it goes
        into the step file's own section, not the plan.
- ### The End
