---
publish: true
created: 2026-11-15T11:16:26.510Z
modified: 2026-11-02T11:22:17.462Z
published: 2026-11-02T11:22:17.462Z
ctime: 2026-11-01 11:29
isIntegrated: false
---

###### Meta-reflection (On completion)

-

---

## Remember

- If reflection is successful - act upon it right away.
  - Use advantage of the brain filled with relative knowledge. It's easily compensates cognitive exhaustion.
- Highlight insights in the reflection.

use

## Problems & Goals

- What it should contain? Ideally wide-narrow on implementation seems good
- But should it write steps? Should it have specific format? Stuff like that

---

## Raw

- Main issue was walls of text. It is discouraging from the get-go.
- Another issue is those decisions/invariants/etc. It feels stupid to me.
- Bigger issue though, that I have to rewrite plan template too which is discouraging as well.
- Then I have to adapt this flow for that plan.
- If I just act - the issue won't be solved. But I can look at it as it is.

---

- Start again.
- ### The issues
  - #### Walls of text
  - #### Meaningless categories
  - #### Duplicated description
- ### Persistent Storage
  - Will that be enough to cover everything I need to cover? If you would attend and maintain it - then yes. If you give this section to LLM - then no. That's the right answer.
- Only one category? What else it needs to have in plan?
  - Like steps will have exactly details. Steps overview in plan will have accumulation of plan's documents. My goals are MY goals. It's for meaning, not for objective measure of progress.
  - Nah, I think it's enough. `_exploration.md` though. Should it be separate file, because feels like it should be in the plan.
- Oh, initial planning should start `_exploration.md` work
  - Yeah, I just was distracted and didn't think this through. Should be in the plan. Unnecessary as separate file.
- Persistent storage feels off though. Like you have that flow of condensing steps. It may be easier to do that?
  - Like I can have the step flow to explore previous related steps. And that's it. Don't need to maintain the thing in the plan and bloat it doing so.
  - it works for past steps
  - for future steps it's not, files will be much bigger.
  - but for now - I'll just ignore it, it's minor issue. I don't have a optimal decision here right know, so I won't get stuck on it.
- Steps flow.
  - The issue is about drafting steps. I think I shouldn't do it in initial planning.
  - The thing with steps, is that sometimes they're very unevenly distributed. like steps 1 and 2 can have 5% of the work, then step 3 contains 60% of the work, step 4 is overlapped by the step 3, so it's basically skipped, and steps 5,6,7,8,9 could be done as a single step.
  - initial planning should be focused on exploring **HOW**s and filling out the exploration block in the plan. And updating background artifacts used for this.
  - Then the task is done. And a new task is open where the steps get the proper attention, where it won't be punished by like huge context of previous actions within the task.
  - Yeah.
- Do I need scoring system?
  - Like it will list all possibilities, and give them a score. Nah. If score will be low - higher chance I won't invest much attention into this. And might miss some implicit insights.
  - Also it can score something low, while it'll be very good for refactor/reducing cognitive load. But it'll be useless work for the task/phase at hand.
  - So no. Scoring not even not-recommended, but just simply harmful.
- Format of provided "possibilities"?
  - What I need from it? Well, I don't need to be surprised on every damn task invoking this flow.
  - But what's those possibilities should have?
  - **Name** - yeah. `[CATEGORY] Name`
  - **Benefit** - obvious one, I don't need possibilities without benefit.
  - **Complexity** - good one. To evaluate whether it's worth doing.
  - \~~**Description**~~ - obvious, but is it? Like description is kinda contains what I will describe below it. So it'll be duplicated information
  - **Description in Simpler Terms** - there may be 10+ things like that. If I don't know how 3 of them works in simpler terms, I'll have to run separate branch on each one. If all of them will have description that is always understandable to me - then it will save a lot of time.
  - is there anything else I'm interested in?
  - \~~**Drawbacks** - is it the same as cost? ~~
  - **Closed Doors** - description of those doors. But can I create an example? Plugin. Deployment. You build it on every step, instead of once locally. It closes doors to faster and more flexible deployment. Closed doors hardly can be considered as the cost. Experimental, but I'll add and see, if it'll be BS - I just remove it.
    - Clarification. I don't need closed doors period. I need closed advantageous doors, like I don't care if a door got closed that was useless)
  - Cost feels weird. Complexity maybe is the better one?
  - ###### Ordering
    - since llms are autoregressive - ordering of those matter.
    - Name first - obvious. Description in simpler terms - last, so it won't affect technicalities.
    - Benefit -> Complexity -> closed doors?
    - Yeah, good.
- Should initial planning draft recommended block of steps? Yeah. As a draft. Between 00 and 99. Simple list. ### Drafted Steps, and bulleted list with step per one point
