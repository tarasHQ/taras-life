---
publish: true
created: 2026-11-02T11:17:27.291Z
modified: 2026-11-02T16:44:44.089Z
published: 2026-11-02T16:44:44.089Z
ctime: 2026-11-02 13:17
isIntegrated: false
---

###### Meta-reflection (On completion)

-

---

## Remember

- If reflection is successful - act upon it right away.
  - Use advantage of the brain filled with relative knowledge. It's easily compensates cognitive exhaustion.
- Highlight insights in the reflection.

---

## Problems & Goals

- What it should contain, how it should flow?

---

## Raw

- Starts from usual exploration
- But it gets complex. The issue is including long-term vision. Website's code is small. My main project's code is big. If I'll do some big feature - I can push the 70k context limit(to have higher quality reasoning) pretty fast. So there's two ways to deal with it. Or, should I do code review now instead, and write steps after the meal + cleaning?
  - The issue with steps is that it likely need separate flow type. Loops. Yeah. I'll do code review and then only steps will be left after the meal.

---

- Ok. So about loops and all of that.
- Is that a real issue? - yes it is. I hate to be over 70k tokens on simple to medium hard tasks. With steps-writing flow without loops - I will be. For sure. So I must cover that preemptively.
- How? - well, there's two ways
  - ### High/Low
    - draft high level for all steps, then low level
  - ### Chunks
    - process steps in chunks.
    - This is preferable. Because high/low will have the same issue anyway, like you need to know whole thing before writing implementation.
    - Another benefit of chunks is that I may prepare them before actually working on them, so it won't be "I do as much as I can until context is full", but instead on the stage of preparing to write steps - I group them in chunks from the get-go. Like I plan steps in a way so they would be written in chunks. Without going over the top OR needing to restart a task mid-way.

---

- Ok, loops. Nothing smart. You have chunks. You have flow that supports starting either from the scratch or with chunks.
- But here's the thing. I need two types of flow.
- Plan steps. Then write steps. Should they be together? I would say YES for now.
- Ok, there's issue with how to write them. Ok, LLM should handle chunks.
- If user accepts - then what? LLM just one shots 10-20 files?
  - That's where the loop is needed.
  - I think that maybe it runs plan update and then creates each step with high-level block only.
  - Ok, let's think. We have plan and initial "reflection" artifact that contains everything on what to do and how to do on high level. With some suggestions on steps.
  - Polarities of this issue is writing everything all at once OR going through each step, step-by-step.
  - Is it bad? Step by step? I really don't think so. Especially in my flow where reasoning block is thrown out. And going step by step allows to have all reasoning focused on the step, and on the next turn LLM has pure result of the reasoning with no reasoning bloat.
  - So, now what?
- The issue is having to do 20 steps.... BUT, NO. If that issue is an issue - it was a mistake on planning stage.
  - Is it though? Like I shouldn't be limited by amount of steps. BUT. In this flow, before starting to write steps - we should discuss if there's any additive secondary tasks that make the flow harder, and if it's worth to extract it into step 95, and do after initial batch of steps is completed. That's the thing.
  - Because in that manner I will have everything contained under the phase. Yeah, phase may get a bit longer and harder to do, but opposite to this is like 3 phases on the same thing.
  - BUT. I will include consideration about size of the phase for critique flow.

---

- Do I need SSOT on phase's start/end steps? Instead of having them integrated into the plan...
  - nah, I don't need SSOT. Content isn't hard to do. For start - it's read only once then ignored. So I won't even have to update it mid-phase. For end - I will create a rule where this template will be used also as accumulation of phase-specific "end-phase-checks", like running some tests, or doing some visual inspection or measuring performance or whatever.
  - In case of changes, yeah, I'll have to maintain multiple places. But that's fine.
