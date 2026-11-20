# Implementing Steps

Efficient and focused implementation of steps.

**Why it's needed?**

- Implementation/execution of the plan is major part of the phase, and it needs separate focused attention and shouldn't be taken lightly.
- Doing proper implementation is as important as planning it.

## Rules

- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.
- **IMPLEMENTATION EXPLANATIONS** - After each meaningful implementation batch, explain how the changed code works using the actual files and main functions/components. Connect the intended behavior to the concrete mechanism: what triggers it, what it reads, and what it changes or produces. Explain consequential design choices and non-obvious supporting code.
  - Use direct, plain language without assuming framework knowledge. Introduce technical terms through their role in this code; avoid childish analogies, unexplained jargon, exhaustive line-by-line commentary, and merely restating the task. Use short code excerpts only when they help.
  - Distinguish what was implemented, what was verified, and what remains uncertain. Keep explanations proportional to the change. Do not require user approval for routine details already covered by the agreed approach.
  - A batch is one understandable piece of behavior, not necessarily every tool call or the entire step. Before a batch, briefly explain what will be changed and why; after it, explain the resulting code based on what was actually written.
- **COMPLEXITY STOP** - If the approach needs substantially more machinery than agreed, its assumptions fail, or investigation repeatedly stalls without a viable route — stop. Don't silently expand scope or keep layering workarounds.
  - Explain what changed, why the approach became costly, and reasonable alternatives with trade-offs.
  - Wait for user approval, then update the affected step before continuing. Until resolved, the step isn't implementation-ready.
- **99-end.md** can be used also to accumulate phase specific end-phase-task. Checks/evaluations/"things to come back to when the phase is done"/tests/end-of-phase-discussions/etc.
- **EVERY WRITE INTO HIGH-LEVEL DOCS SHOULD CONSIDER ITS SCOPE** - you don't write about minute details into high-level plan or agents.md.
- **HIGH-LEVEL DOCS CARRY NO CODE FACTS** — the plan never contains selectors, property names, values, component names, or mechanisms. It answers "what and why at phase level"; step files answer "how". A plan edit longer than ~5 sentences(of avg. length) for one step is a smell — put it in the step file instead.
- **No mentioning steps/phases in the code or non-phase .md files** - like "this will be done in step X phase Y", or that is completed in step X. Don't pollute general documents with steps and phases. Even comments in the code should mention those only where they're meaningful.

---

rizzing

## Stages

- ### A - The Exploration
  - [ ] **A1** - \[USER]
    - Provides LLM with artifacts that will be used in the scope of this flow
    - Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
  - [ ] **A2** - \[LLM]
    - LLM starts thorough exploration.
    - LLM avoids reading temporary artifacts of planning/critique/code-review flows.
      - avoiding directly reading initial-reflection is preferable too.
    - Goal of exploration is to have all the knowledge related to implementing the current step both, in isolation and as integrated part of the phase.
- ### B - The Implementation
  - [ ] **B1** - \[LLM + USER]
    - If there's any missed open decisions or confusion - discussion with the user should be done first.
    - If there's not open decisions/confusion - proceed to implementation.
  - [ ] **B2** - \[LLM]
    - Implementing the step.
    - Explain each meaningful implementation batch according to **IMPLEMENTATION EXPLANATIONS**.
    - No autonomy to make decisions beyond what was agreed upon with the user.
    - Undiscussed actions are forbidden.
    - Making decisions on your own is forbidden.
- ### C - The Step Completion Flow
  - [ ] **C1** - \[LLM] - Finalizing the Current Note
    - [ ] Setting up corresponding state and/or status

  - [ ] **C2** - \[LLM]
    - [ ] Writing prompts inside markdown codeblock. Should Include links to main documents `AGENTS.md` and `LLM.md`
      - First one for Code Review flow in a clean task without current context.
      - Second one for Step Completion flow in a clean task without current context.
    - [ ] **Asking if the user will run Code Review flow and waiting for the answer**

  - [ ] **C3** - \[LLM] - Finalizing the Step In the Plan
    - In the List of Steps:
      - [ ] Settings an icon to corresponding frontmatter status of the step.
      - [ ] Rewriting description from "what should've been implemented" to what "what was implemented"
      - [ ] Commenting the step inside single `%%comment-block%%`placing first `%%` tag right after the icon in heading, and placing second `%%` tag at the end of the new "implemented" step description.
        - This will render for user in smaller dimmed font, hence, signifying completion of the phase.
        - Example of where first `%%` should be placed `### %%◉ [STEP XX... `
    - In Other Parts of the Plan:
      - [ ] Making sure plan does not contradict to what was done in the current step. Like situations when fact X in plan says one thing, but implemented fact X in the step does different thing.
      - [ ] (Only if necessary) Updating exploration section.
        - [ ] Only paths to related files with concise 1 sentence description. Nothing else. Concise.
        - [ ] Plan scope: phase-level knowledge only — step-scoped detail belongs in step files, not the plan. Remove stale/no-longer-relevant exploration entries in the same pass.
      - [ ] Updating step in list of steps
        - Implemented description should be concise. 5 sentences max. Do not include in there implementation nuances or technical details.

  - [ ] **C4** - \[LLM + USER] - Condensation of Current note
    - [ ] **LLM SHOULD ASK FOR USER APPROVAL BEFORE PROCEEDING**, in case other flows are still working on this step.
      - [ ] Additionally LLM should propose to the user to run a code review flow in parallel to this task.
    - If previous conditions are met:
      - [ ] Resolve temporary notes/open questions (if any) with the user. Ask him about what to do about them.
      - [ ] Remove temporary notes/investigations (if any)
      - [ ] Condense each task + subtasks to a single '- Task Name - Task Description in 1-3 sentences' bullet point
      - [ ] Make sure note's frontmatter status/states is updated
      - [ ] Structure of the file should be only `## Description` and `## Implementation Summary`

  - [ ] **C5** - \[LLM]
    - [ ] Responding to the user with a prompt (inside markdown codeblock) to start implementation of the next step in a clean task without current context.
