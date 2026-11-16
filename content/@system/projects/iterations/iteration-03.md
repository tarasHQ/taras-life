##### When Done

- [ ] **Doublecheck with LLM**&#x20;
  - Run LLM task on the projects directory to make sure everything is aligned. Very useful for this amount of details.

## Issues

- [ ] **Make LLM output reasoning conclusion to compensate for absent reasoning block**&#x20;
  - The issue is that while it's insane context size saver - it kinda makes context too dense even? So maybe through the system prompt you should enforce some kind of reasoning conclusion output on every turn, so LLM won't re-reason on same things.
- [ ] **Writing temporary artifacts may be distracting**&#x20;
  - The issue is that I'm not using auto approval. It's like a swipe for tiktok? A major pathological functionality. But then it means when it runs those first steps of flow where it explores -> brainstorms -> explores -> answers - there's 2 points where it'll ask for confirmation.
  - But I doubt I can do anything low-effort about it.
- [x] Do changes right away, don't wait for the iteration to end
- [x] Name in lists of issues/possibilities/etc. as heading, to have colorful headings
- [x] Exploration cleanup with update.&#x20;
  - one issue of bloater
- [ ] **Initial planning updates plan for locked-down high level, and initial-reflection for low-level**&#x20;
  - To avoid bloating the plan. Because it tries to give hints for steps in the plan. Avoid this behavior. Writing steps sources from initial-reflection and plan. Those aren't meant to be huge. So it's safe.
- [ ] **Steps needs additional reasoning/exploration/context generation step before writing**&#x20;
  - Right now it doesn't think much. Or explore. It just writes those steps. Add in the loop some context generation.
  - Seems like just asking to reason more does the job

## Ideas

- [ ] **DECISIONS.md** (Questionable)&#x20;
  - Idea is to lock some decisions in SSOT.
  - Problem is that I kinda plan to do this through readme.
  - So it's either this or that. Both are redundant.
