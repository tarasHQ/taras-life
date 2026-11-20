##### When Done

- [x] **Doublecheck with LLM**&#x20;
  - Run LLM task on the projects directory to make sure everything is aligned. Very useful for this amount of details.

## Issues

- [x] **Writing temporary artifacts may be distracting**&#x20;
  - The issue is that I'm not using auto approval. It's like a swipe for tiktok? A major pathological functionality. But then it means when it runs those first steps of flow where it explores -> brainstorms -> explores -> answers - there's 2 points where it'll ask for confirmation.
  - But I doubt I can do anything low-effort about it.
  - I created in shared folder a file. And ask llm to read it after their response. It'll continue the loop in theory. But also LLMs may finish response and then ask to read the file. So I'll see.
- [x] Do changes right away, don't wait for the iteration to end
- [x] Name in lists of issues/possibilities/etc. as heading, to have colorful headings
- [x] Exploration cleanup with update.&#x20;
  - one issue of bloater
- [x] **Initial planning updates plan for locked-down high level, and initial-reflection for low-level**&#x20;
  - To avoid bloating the plan. Because it tries to give hints for steps in the plan. Avoid this behavior. Writing steps sources from initial-reflection and plan. Those aren't meant to be huge. So it's safe.
- [x] **Steps needs additional reasoning/exploration/context generation step before writing**&#x20;
  - Right now it doesn't think much. Or explore. It just writes those steps. Add in the loop some context generation.
  - UPD. Ok, let's reflect on this.
    - What is my issue with steps? High/low levels. Like current flow does good job up until steps. High level is of good quality. Edge cases caught and covered. But steps... it's just something wrong with them.
    - What? Well, in recent task - they were written to abstractly. And missed a major pitfall in which I fell during implementation. Tasks were "implement model" and "write tests" basically.
    - Which is obviously bad. Writing steps means actually writing their implementation. Because only then I can run code-review BEFORE implementation and have useful results. And also...
    - Ok, I'm yapping, it's obvious that it's better.
  - Yeah, it makes sense to go low-level for writing steps flow. Because I thought that maybe we keep high altitude, and go low only during implementation. But no, it's not sustainable.
  - This flow allows to have separate proper reasoning with doing 90% of implementation, like what's left is 10% + actually writing the code.
  - BUT, this allows to rune code review before actual implementation, so I can avoid making mess. Like changing 10 files in a step, to run code-review AFTER, which tells me that there was much better and cleaner way to do things.
  - And I won't create subtask flows for this. I must be manual. Because LLM will abuse it. Like we write the step, make sure that it's in good shape, maybe I add a few things. THEN I do code review when I'm ready to actually do it.
  - Even more.
    - Adding two-step exploration. A bit simpler than others. But LLM just needs it. It doesn't know what it'll list as result of exploration. So often it proposes suboptimal things, compared to the task when it runs second exploration pass.
    - And also I'm discussing with LLM how to optimally go even lower in steps. To make them much more grounded. Because if they're not - I might as well just have them in the plan. LLM shouldn't guess. Make it detailed. Then code review abstracts issues to "my level". And then when the step aligned with both me and llm (that don't guess) - we write code.
  - ⭐Biggest thing here is that it offloads a lot of refining on LLM, so it's not one-shot presentation. Which means I can work on secondary task that is more actionable. So there's potential to cover Puer and Senex at the same time.
- [x] **Tests**&#x20;
  - I hate creating tests while I'm doing initial implementation. Like I don't know how it'll look like in the end - and an LLM already locks that in with a test. And then I have to maintain both.
- [x] **List 5-10...**&#x20;
  - The issue is that it forces LLM to list weak things just to get into that required amount of points.
  - So remove this requirement. Because flows with

## Big Issues

- [x] **What about code-review explanation/exam when I'm hopeless?**&#x20;
  - Right know I don't want to do this. It feels as a chore. I'm not interested. How to deal with it to not just ignore/skip.
  - Ignore. It turned out to be unnecessary complexity for the flow. Exam should stay, but not mandatory. Because it lists questions that sometimes make me think. So it's net positive. Mildly.
  - I'll switch to multiple-choice exam. Like it's either I skip exam, or have it easier so I actually would do it. And do I need to do it? - yes. Because I'm in constant state of overwhelm. It's hard for me to purposefully go into increased complexity of proper understanding.
- [x] **Code-review missed a bug**&#x20;
  - Maybe it needs separate flows for bug-searching?
  - Because if you point it at 15 things - it's easier to miss important ones.
  - > push further and refine flows, because there's obvious gap between writing steps/implementing steps. Like you can push it further, and have code review BEFORE implementation.
  - I think that maybe writing code should be on writing steps phase? Like what if writing steps will write snippets of code in addition to current description of tasks. Then implementing steps starts from code-review. It refines implementation. And implementation itself becomes purely mechanical.
  - Ok. I added bug search as priority. Don't have anything good besides that.
- [x] \[HUGE]**Make LLM output reasoning conclusion to compensate for absent reasoning block**&#x20;
  - The issue is that while it's insane context size saver - it kinda makes context too dense even? So maybe through the system prompt you should enforce some kind of reasoning conclusion output on every turn, so LLM won't re-reason on same things.
  - Created \<meta\_answer> rule for system prompt on each response.
- [x] **Update the system prompt**&#x20;
  - You didn't reviewed it for a long time.
  - [ ] Change default model
  - [ ] Remove useless stuff
  - [ ] Autoregressive search + meta answer - useful? Or include reasoning offload in those?

## Ideas

- [x] \[DISCARDED] **DECISIONS.md** (Questionable)&#x20;
  - Idea is to lock some decisions in SSOT.
  - Problem is that I kinda plan to do this through readme.
  - So it's either this or that. Both are redundant.
