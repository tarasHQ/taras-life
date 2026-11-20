---
publish: true
created: 2026-11-15T11:16:26.540Z
modified: 2026-10-28T18:51:08.331Z
published: 2026-10-28T18:51:08.331Z
ctime: 2026-10-28 18:26
isIntegrated: false
---

###### Meta-reflection (On completion)

- Add point in here
- Remember to act upon successful reflection, to give in to exhaustion.
- Insights seem to be useless. Like you either act on reflection right away, or not.
  - yeah. Highlight insights inside reflection. That way you'll have them in the context, and not detached.

---

## Problems & Goals

- I don't know how flows should look like so I would be motivated to use them.
- Like right now it feels like as if it's a bit burden maybe? But that's because LLM wrote that one flow. It's stupid. I need something done by me.

---

## Raw

- Ok. here we go.
- So the issue is that I don't feel like those flows are worth it. BUT.
- Without them - I'm at mercy of LLM. No structure. No routine. No nothing. Chaos. Which makes me overwhelmed. This is an issue. I can't have high speed situation if I'm overwhelmed.
- ### Apply flow to current "task"
  - I'm not sure it's applicable because it's meant to be written by me mostly.
  - But let's try anyways.
  - So, what's the issue right now?
    - Yesterday I wrote a plan that was too high-level. When implementation started - lots of additional work popped up. Including current workflows. Like I wrote those in theory. But in practice I have nothing.
    - So, the workflow I would use, that initial planning + steps drafting. It would've helped. Nah. It's stupid. I can't fit current task in honest flow.
- ### Focus on the flow
  - #### Properties
    - **Repeatable**
      - Means using a template. So current flow of LLM.md acting as hub + absolute links is good.
    - **Read-only**
      - if all tasks will write summary or something - it will bloat it.
    - **Sequential**
      - Expected. Structure. Which means you don't have to think about "optimal order of execution". Makes it very action-oriented.
    - **Identifiable Steps**
      - Number, not bullet. Name. Not description.
      - It feels like these make "probability anchors" for LLM. Harder to miss/ignore/hallucinate, because "meaning" attached to it. It's not like one bullet point among 50 others.
      - Don't use words/numbers that overlap with projects. Steps/phases/01/001/ those terms from the plan template. Like instead of numbers - use letters. ABC. Instead of steps - use stages OR chunks OR actions OR etc. Make flow distinct from the execution of the flow.
    - **Reliable**
      - If I would have to fight LLM to keep up with flows - it would be an issue.
      - So the flow must have another kind of "anchors", to, both - make sure LLM follows the flow AND increase probability of LLM to follow the flow.
        - like simple big rule for LLMs at the start of the flow like
          - "on each response write the step of the flow you're executing."
          - "You must execute each step separately and report on its completion to the user"
    - **Explicit**
      - Ties into reliability. If the flow is implicit, not a bit verbose - LLM will forget about it. Or importance of the flow will be reduced.
    - **Controllable Chaos. NOT Overwhelming Tyranny**
      - As in life. LLMs are chaotic systems. You can't place/expect strict order following. Instead you must at least not fight with it OR, at the very best, make it into a win.
        - Practically though?
  - #### Flow
    - You combine those properties into a file then?
    - rule at the start. Explicit. Each response should contain feedback towards execution of the flow.
    - So, I can lock that. The issue I had - is that I confused two things. flow itself and content of specific flow. Flow itself is solved in block above. Like you ==should extract it and put it inside \`\_flows/\` as  \`\_rules.md\`==-  Whatever you create, if it's aligned with those rules - that flow will likely to be better than without those rules. And they're restrictive but also permissive at the same time, so it's not trying to work against LLM's nature.
- ### initial reflection
  - A bit more compact flow. But the thing is - sometimes you don't know what you need. You write initial reflection. Then you need to defend it against LLM critique. Like you need LLM to go scorched earth on your reflection. ==HUGE==, because otherwise you're in your bubble. And it's damn hard to rely on honesty, because it's a finite resource.
    - To not make things too complex - idea here is to just run separate task with simple flow before you go to planning.
      - But efficient one. you ask LLM to run exploration based on your reflection. The you make checkpoint.
        - \#1 - you discuss and refine reflection. with adding like "llm input at the bottom". Like (planning is about implementing reflection), this one is about figuring out what I want and need.
        - \#2 - then you revert to checkpoint, you attach refined reflection. And send LLM scorched earth on it. And try to defend it. with KEY RULE - LLM must appeal to my honesty. "Think about it honestly", "Be honest", etc.
          - And you write that as defense block in the same reflection.
  - Now you have not projection of your bubble. But something much more reliable and meaningful and honest. NOW you can plan it.
- ### initial planning
  - the thing of this is that it's should go wide before going narrow. Which means it has to be at least 2-step conversation.
  - Oh. oh. this shit needs additional folder. for sure. Here's what I think
    - it wasn't meaningless because of its idea being stupid. It was meaningless because I got an nuclear warhead and named it as dynamite stick.
    - So.  that's the key thing where everything gets bad in current flow. And where you put unnecessary constraints on LLM too.
  - You start to plan. With that plugin for example. You start to go into "recommended" too soon. Instead, you should prioritize order and go wide. Through docs.
  - #### specifics.
    - ##### First step - Categorization of the Issue
      - \#1 - I want to write a plugin. Give me categories on this.
        - Returns: implementation, deploying, location, integration.
      - \#2 - Write down each category with you recommendation and 2 additional options in separate file according to the provided template.
        - Template frames this findings as mere suggestion. And has internal rules that allow broad options,. Like basically it's like a big prompt
        - Returns: a set of files on each main category about what you want to do.
    - ##### Second Step - You go WIDE
      - ==🟡HUGE INSIGHT - You were saying that it gets boring when you wait for LLMs response, and because of that it's slow and boring. This flow of wide then narrow - provides you with lots of options. You can run 5 tasks in parallel on each file. And then have an hour of focused work on each one==
      - \#1 - You attach each document. It's self-contained. All you have to do is attach it + maybe agents and llm.md?
        - Returns:
          - 3-5 high-level, architectural, radically different options. (unbiased) that autoregressive property of llm could be helpful.
            - each one have description how it's useful and what's its cost. Also it would have description in simple terms, in case I won't understand it.
          - THEN we have scores on each one.
            - so previous unbiased tokens will less affect that first high level block and scoring.
          - NOW we have recommended option with 3 choices of low level implementation with table, score and recommendation at the bottom.
      - \#2 - You either choose or discuss further on each task on each document.
        - Returns:
          - a set of locked categorical decisions.
    - ##### Third Step - You go NARROW
      - \#1 new task - Category by category. What is needed to be locked in plan - the rest locked in steps.
        - ### Styling
          - 1
          - 2
          - 3
        - ### Coding client-side
          - step 1
          - step 2
          - step 3
        - ### Deployment
          - step 1
          - step 2
          - step 3
      - \#2
    - ##### Forth Step - Delegating to Next Flows
      - making sure nothing is forgotten.

---

==at this point you are ready to implementation==
Plan is done. Steps are done.

Gaps:

- Exam. Where? Would you have enough brainpower for the exam?
- Code review-flow. It's truly useful to just run separate task in parallel while you're finalizing the step. because that LLM has all those edits, it has initial state and completed state with everything in-between. And bloated context from wrong edits, user edits, in-task discussions and so on.
  - You run this in clean air with sole purpose of code quality. So it doesn't have to think about other options or something.
  - Should you ask it to explain the changes? as step 2?
  - Yeah. Also you may use that exam rule in here.
  - Like idea is to watch the code still, but not to the point of you writing it.

---

- ### Reflection
  - Should I write all steps? Implementation. Because it may drift as I go... No. If you refine that initial planning, it won't drift. It drifts only if you underprepare/research
  - If I split by categories. maybe I can split steps by them too?
    - Again. Plugin. Recent. Steps 1-3 on deployment. You don't have 30 flat steps. You have categories on them. Deployment doesn't care about styling or how how the plugin will communicate with the server.
  - With plugins. it would've been nice if it mentioned radical high gain changes. Like it was very restricted. 90% of such changes would probably be easily discarded BS. But those 10% will be huge.
- ### Riding the Chaos
  - Is it possible? Or it's just BS quote?
  - Well. What is positive nature of chaos? Potential. Upward transformation. Treasure. Adventure.
    - Ok. here's the thing. The more orderly you are - the bigger capacity to confront the chaos. Seems like. Because you're not like constantly being teared apart my 1000 minor things.
    - How flows themselves would handle Chaos?
  - So by that I see some external evaluator or something.
  - But my project have minimal abilities yet. I have to manage this within what I have in my grasp.
  - Well, I have explore tool. Won't be hard to create additional one. That can be more interactive. I already have functionality for interactivity. It can be done in an hour or less.
  - #### The New Tool
    - So, this may be interesting if done properly. It's limiting, and the project isn't a main target. But it's a huge waste of the potential. Like it's literally 2 heads better than 1. Considering that I can have more than 2 too.
    - But is that touching the flow or not? It's chaos - it has potential, but it won't be easy. '
    - Do I need it? What capabilities this posses?
      - Evaluation
      - Verification
      - Side tasks
    - What would be the issue in my flow?
    - Like take initial planning for example. It's kinda sequential task. I can't plan step 4 if step 1 isn't planned.
    - I really start to doubt that this branch of thought is worth it.
    - ##### Code review.
      - That's it. Implementation of steps is a flow in itself. And code logic is kinda big cognitive load. So you can have a tool that is focused solely on code review. It will reduce issues that stem from you or LLM missing some pieces.
        - Because current context will be bloated for proper code review, but also it is good for task finalization. So there's that.
    - what else? The issue with planning is that it's like proper discussion i//debate. you have a topic to discuss. Then you bring 5 arguments and the other side brings 5 arguments. Now you discuss 10 things. Then it's a 100.
      - So this hints on think-through subtasks.
      - Imagine previous task with fonts
      - but wait, how it's different from branching and then going back with context handoff? Code review is kinda low-effort if you just prepare a prompt.
    - Like if my project was more complete, then sure - huge advantage. But at this point - nah.
    - So I will stop this branch of thought.
    - Or leave it open when I'll work on flows. So if there will be situation where this idea can be inserted naturally - then we'll use it.
