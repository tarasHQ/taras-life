# "Scorched Earth" Critique

**Why this flow is needed?**

- To make sure that the user doesn't make decisions based feedback from echo chamber.

## Rules

- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.

## Stages

- ### A - Initial Exploration
  - [ ] **A1** - \[USER]
    - Provides LLM with artifacts that set the scope of the attack & discussion.
    - Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
  - [ ] **A2** - \[LLM]
    - LLM starts thorough exploration.
    - Goal of exploration is to be able to steelman user's reflection first and THEN attack it.
- ### B - Brainstorm
  - **Tone** - Honest, Critical, Realistic, Efficient.
  - [ ] **B1** - \[LLM] - \*\*Response #1**
    - Responds with a one-off self-reflective exploration of attack surface in. (no tools, just plain response)
    - Format is nested lists of questions/points/reflections/ideas (no answers/finalizations/recommendations)
    - MANDATORY - response ends with reading `C:\Users\Taras\Documents\obsidian-vault\@system\projects\shared\loop-continuation.md`, because if response ends in tool call - you will get next turn automatically without user needing to manually continue it.
  - [ ] **B2** - \[LLM] - \*\*Response #2**
    - LLM lists weakest points (anywhere from 1 to 15) in provided artifacts(and further research) - still no tools, just plain response.
    - Those points may cover issues from categories:
      - Blind Spots
      - Security issues
      - Performance issues
      - High Effort - Low Reward ideas
      - Short term fixes over proper long-term decisions.
      - Other, not listed and high-impact categories.
    - **FORMAT of every point**
      - **Name** - `### [CATEGORY] Name-of-the-point`
      - **Steelman case** for advantages of the point.
      - **Attacking** the point by providing disadvantages.
      - **Recommending** another approach
      - **Describing** why that approach is better
      - **Description In Simpler Terms** - a paragraph of description in simpler terms (non-advanced) about this point. Goal is to preemptively explain it in a bit more easier wording, so user won't get stuck on unknown technicalities.
    - **THE SIZE OF THE PHASE point**
      - Separate point at the end of the list that just suggests whether the phase is too big or too small.
      - Like if there's like 100 hours worth of LLM-assisted work in a single phase - that's probably too much. And on the opposite side of the pole - if a phase has 5 hours of work - that's too little as well, and user should consider expanding the phase (or do nothing and to just be aware of it).
      - Format is 2 paragraphs
        - First paragraph is description of the size issue
        - Second paragraph is 2-3 recommended solutions to the size issue
    - MANDATORY - response ends with reading `C:\Users\Taras\Documents\obsidian-vault\@system\projects\shared\loop-continuation.md`, because if response ends in tool call - you will get next turn automatically without user needing to manually continue it.
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
    - In the same **FORMAT** that initial drafted list was written. From **FORMAT of every point**.
    - **CRUCIAL** - it must be a self-contained list without depending on user's knowledge of previously created temporary file and its contents.
  - [ ] **D2** - \[LLM] - \*\*Still Response #1**
    - Within the same response LLM writes a template for user response inside markdown codeblock
    - In this template it lists the number and name of the point and empty bullet point after for user to fill.
    - Each issue is separated by an empty line.
- ### E - The Discussion
  - **Tone** - Honest, Critical, Realistic, Efficient.
  - [ ] **E1** - \[LLM + USER]
    - User will respond. If he pushes back - LLM must preserve tone of the attack stage and not give up easily based on weak arguments.
    - LLM must appeal to the user's honesty.
    - Goal of the discussion is to make user 100% sure in his decisions by going "scorched earth" on them.
- ### The End
