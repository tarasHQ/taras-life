# Writing Steps

From initial refined reflection(**what** I want to do) -> to properly explored, brainstormed high level plan (**how** to do it on high-level without focusing on code too much) -> to current flow of writing steps(**how** to do it on low-level)

**Why it's needed?**

- Implementation/Execution of the plan (which steps are represent) is major part of the phase, and it needs separate focused attention and shouldn't be taken lightly.

## Rules

- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.
- **IMPLEMENTATION-READY** - Writing steps resolves and discusses HOW to implement, not just WHAT to achieve. Don't mark a step ready while its central approach is unresolved; ordinary, lowest-level coding details stay for implementation.
- **COMPLEXITY STOP** - If the approach needs substantially more machinery than agreed, its assumptions fail, or investigation repeatedly stalls without a viable route — stop. Don't silently expand scope or keep layering workarounds.
  - Explain what changed, why the approach became costly, and reasonable alternatives with trade-offs.
  - Wait for user approval, then update the affected step before continuing. Until resolved, the step isn't implementation-ready.
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
    - Goal of exploration is to understand the phase and integration points enough to structure the steps; deeper exploration happens per step in C.
    - Verify decisive facts in relevant source/docs; don't rely only on exploration summaries. Record those facts in the step so implementation doesn't repeat the investigation.
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
    - If user accepts it - LLM starts the per-step loop from C1.
- ### \[LOOP] C - Implementation Exploration & Discussion
  - [ ] **C1** - \[LLM] - First Pass: Exploration & Approaches
    - Understand the step's data flow and constraints, identify reasonable implementation approaches, and provisionally recommend one. Identify assumptions that could make it fail or become disproportionately complex.
    - If user priorities determine the direction, or verification itself needs substantial work - discuss first, then continue verification in C2.
    - After exploration, respond with concrete approaches, provisional recommendation and WHY, and specific questions for C2. Distinguish verified facts from assumptions. The recommendation isn't approved yet.
    - MANDATORY - end the response by reading `C:\Users\Taras\Documents\obsidian-vault\@system\projects\shared\loop-continuation.md` to continue automatically to C2 without asking the user to continue. (because tool call automatically continues agentic loop)
  - [ ] **C2** - \[LLM] - Second Pass: Verify & Challenge
    - Verify the decisive assumptions, integration costs and complexity of the provisional recommendation. Check the strongest alternative enough for a credible comparison; change the recommendation if warranted. Don't just seek confirmation.
    - Keep both passes proportional to the step; reuse verified facts rather than repeat broad exploration. No exhaustive investigation of every alternative is required.
  - [ ] **C3** - \[LLM + USER] - Discuss the Approach
    - Discuss the grounded recommendation: HOW, WHY, integration points, meaningful alternatives, trade-offs and remaining uncertainty.
    - Check whether the proposed approach is proportionate to the requirement. Don't approve complexity merely because it technically works.
    - Resolve questions that could substantially change the approach and get user approval before writing. If investigation itself is needed as a step - label it explicitly, don't disguise it as implementation.
- ### \[LOOP] D - Writing the Steps
  - [ ] **D1** - \[LLM]
    - Reads template for steps `C:\Users\Taras\Documents\obsidian-vault\@system\projects\shared\templates\step-template.md`
    - **LOW-LEVEL IMPLEMENTATION** - Write the selected approach and concrete changes per affected file, not just requirements like "implement X." A fresh implementing LLM shouldn't need to choose the mechanism or repeat design exploration.
      - Specify what is added/changed/removed, important functions/data and their responsibilities, and how files connect. Include relevant ordering and fallback/error behavior.
      - Group tightly connected files under one task when useful. Include meaningful tests with scenarios and expected results.
      - Keep details in the step file, not the phase plan. Full function bodies and routine coding details aren't required.
    - Starts writing steps incrementally.
      - If this flow was run on the job that was done partially (like steps 0-5 is done, and 6-10 need to be written) - LLM just continues from the last step.
    - The writing happens in single response where LLM uses 2 tools to:
      1. Write step file
      2. Updates the plan
    - Nuance for updating the plan without re-reading it on every step.
      - Use edit tool. And use name of the previous step as the anchor for replacement. new string will contain whole new step + the name of previous step. In that manner whole new block can be safely inserted.
    - Plan scope: when updating the plan — phase-level knowledge only; step-scoped detail lives in the step files. When updating exploration, remove stale/no-longer-relevant entries in the same pass.
    - Steps should be written in descending order in-between existing step-99 and step-00. (highest step is first/above)
  - [ ] **D2** - \[LLM + USER]
    - Discussion.
    - If LLM sees any issues/open questions with the step - it asks user. If everything is straightforward - LLM just waits for user to approve the created step
  - [ ] **D3** - \[LLM]
    - On user approval LLM restarts the loop for the next step and starts from **C1**.
- ### The End
