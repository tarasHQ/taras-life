UPD. User input in plan doesn't make sense after flows are done. Reflection and refinements ARE user input.

---

# Todo

- [x] Use other dataview script that can be parsed by website. For docs. (in plan/project)
  - [x] Meta plan reflection block at the bottom to have a ssot for the feedback on the current iteration. What if I do this for LLMs too? Through completion flow?
- [x] Update phase creation script, to not parse step template, but to create a separate file `_step-template.md`
  - [x] Link that path of `/steps/_step-template.md` either inside each step or in plan under `## Steps` section
- [x] Should I rename the file? PLANNING.md reads a bit stupid. Interaction with llms? or like LLM.md? Yeah... agents is for like kinda autonomous context. planning is stupid. `LLM.md` is kinda focused on using those as a tool instead of overhyped agents/AI words. So yeah. LLM.md
- [x] Templates. Master script templater folder, move other ones into system/project, to have everything in one place

# \[DONE] README practice&#x20;

### Discussion

- It makes lot of sense to have readmes in each module/submodule. But structure is a bit chaotic now. Would be nice to have a predefined one. Also as template in separate file linked to planning or agents, so when I create new one - LLM can fill up the skeleton and then I do the writing.

### Contents

- **Simple Words** - cognitively seems to be easier to get the high level structure and then map it on low level instead of diving into low level right away.
- **Description** - low level. Kinda free form. Lock down
- **Decisions** - empty if none. Just like to lock down some things to not rehash it often, or to not forget why they were chosen.
- **Exploration** - like I did just now with fonts. I gave agents + fonts readme. It knows everything from that point onward to work on fonts without spending minutes on exploration (UPD. useless, readme is kinda this exploration blcok)

# Issues

## High Level&#x20;

- ### \[PARTLY DONE AT CODE REVIEW] Idea #999 Exam&#x20;
  - #### Discussion
    - From old kilo flow. It's just useful to have that flow where LLM is targeted to not solve the issue, but find issues in "the answer". Like you do initial draft. Then make it defend itself. And repeat until it starts to make sense.
    - Should I write this down manually though? Because it's FOR you BY you. LLM will accumulate walls of text there. But it's a bit of a friction. Like I would have to ask LLM to do like "exam" of understanding what we'll do. THEN it'll be lower friction and useful.
    - Like it's simple. Exams work. If you want to remember so much information - you must be tested for accountability. It's also long-term situation, because if you KNOW, like really KNOW about what you're doing, and not like stay on high level only. Then the task is easier to be done. It feels more like your product. And you're less likely to get overwhelmed.
    - But the question is WHEN.
      - It should happen soon for sure.
      - Either before even planning starts (and then one more after the plan)
      - OR make it like **usual routine that is run often**.
        - Like you did initial planning - exam.
        - You drafted steps - exam.
        - You're starting to implement step X - exam.
    - Exam though is a bit wrong word. But is it?
      - Like like
      - Like idea is to **invoke that feeling of "I want to get high score, I want to win".**
      - And I can't say to LLM that I'm inexperienced here. Because it might lean into oversimplification of code/comments/etc. So it should be separate file for sure = **Separate flow.**
    - But it shouldn't be like one-shot exam. It gives you questions (**NOT A B C, you must write the answer**), if you don't understand something - you explore in branches. What you didn't understand - gets into that plan's **Simpler Words** section written by you. So you lock that information down (later it can be extracted too)
    - **Summary**
      - So. Separate workflow. But required, not optional. Per each major phase (planning/drafting steps/implementing each step)
      - Template - figure out on-site. When you'll write it down. But main things is that there must be scoring. And there must be high coverage including notion that I'm inexperienced in this, so I need to be tested on kinda simple concepts as well.
      - Amount of questions... probably 20-30 for sure. To expect 1-2 sentences answers.
  - #### Solution
    - Discussion highlights.
    - **UPD** for code review it done in a compact manner that works. I mixed here other kind of exam for knowledge system, but that's for another discussion.
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
- ### \[DONE] Idea #99 Critique Flow&#x20;
  - #### Discussion
    - From old kilo flow. It's just useful to have that flow where LLM is targeted to not solve the issue, but find issues in "the answer". Like you do initial draft. Then make it defend itself. And repeat until it starts to make sense.
  - #### Solution
    - Extract old one from vscode, it should be in those sidebar markdown notes. It's good baseline.
    - **Separate file for workflow too**, as it is with a few other "flows". It should be called from the flow or manually. (flow preferably)
    - **Separate file for discussion?** So you can check all those issues in different tasks/branches.
      - With templated categories too? Like security/performance/modularity/non-duplication/best-practices/long-term-ready - so it's not asking llm about just give me list of something, but it's structured blocks of what interests me to make things better in the plan/steps/etc.
    - **UPD** done but without separate file for discussion. I can branch.
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
- ### \[DONE] Issue #8 LLM's High Level Block&#x20;
  - #### Discussion
    - The issue is that there's no hygiene or rules for llm's part in the plan. If it's uncontrolled - it just dumps walls of text. I don't know where it should belong though. Because if that wall of text used in multiple steps - it could make sense.
    - Ok, it needs refined high level block for sure, and maybe some workflow stuff.
    - Ok, what else do I need?
      - Like we would have separate flow that will have lots of information. It'll happen in separate temp file. That information then will be dissolved into plan + steps.
    - What is plan?
      - high level overview
      - steps storage
      - user "raw" input
    - Do LLMs need more stuff in the plan?
      - Like llm describe the plan in a bit more detailed way than my initial abstract description.
      - and it stores plan memory
    - Do we need state? Like through completion flow steps get finalized. in list they get description about what was done and this gets commented out. Nah. I just don't see what useful can be in that state.
    - Concepts in simple words - yay or nay?
      - The thing is, I might get unconsciously overloaded if there's only either 12km high abstractions OR ground implementation details in the plan. BUT. If I would have all concepts I don't understand described in the separate block at the very bottom - it may reduce that cognitive requirements for the plan = more executive capacity on implementation/planning than on comprehension.
      - it's super good especially after a break, or if implementation takes a multiple days. I can sleep on it, forget some stuff, you come back, read it - and you're up to the speed.
        - But the question is whether it should be separate task/flow?
        - I'm already pushing boundaries of capacity to keep everything in the mind... After this one I stop. And will iterate only when everything will be done and I'll see how it'll look like.
      - like you would need to know this BEFORE you make decisions. So this block should happen pretty soon.
        - Also must be in steps completion flow
      -
    - ##### Blocks
      - **Plan description** - There's one by user that's created at the very beginning. This one by LLM when lots of stuff were planned and refined.
        - **Persistent Steps Storage** - place for LLM to store information that is applicable to all/most steps. But with clarification, that it's not like "we implemented X, now next step should do Y". It's about nuances/invariants/facts. In a concise manner too.
          - Doesn't make sense to have separate file. It's by its nature should be always in context.
          - CONCISE. It shouldn't be walls of text.
      - **Steps** - since it's not covered by the script anymore.
        - table + list.
  - #### Solution
    - Read discussion.
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
- ### \[DONE] Issue #7 Intra-step Deviation Tasks&#x20;
  - #### Discussion
    - The issue was too much issues. Like I explored stuff until 100k context, and then everything went apart. So what I had to do, is to use branches and slowly, step by step, explore all possibilities. And work on each one. Step by step.
    - **Planning flow is bad**
      - LLM dumped lots of text at once. That was the issue. It just overwhelmed you. Then you don't follow it. And now you're paying the price because you don't know jack shit about this.
        - and you did this in the wrong state of mind, which made you not-read or forget most of the things.
      - you also need to decide before committing the phase, whether you need a separate branch for that.
    - What if I should heavily utilize artifacts for stuff like this?
      - `artifacts/_exploration.md` will reduce re-exploration time and quality
      - `artifacts/01-temp.md` will allow to offload everything into a single place that won't bloat either step itself or plan.
    - Like let's imagine. You got that 100k context. You have multiple issues pending. You just offload them in freeform. Also can ask LLM to do it. Start a new task focusing on one issue, for example.
    - If those issues are blocking current task - the same logic. Parallel task with context handoff into that file. LLM in current task reads that file and proceeds without blocks.
    - But what if you use step file for this? No. The issue with these issues is that they're often like perpendicular. Chances that step file will explode - huge. And for no reason.
      - While having separate temp flow allows to discuss, to explore option, to critique, etc. and, **crucial thing - it gets locked down in the file**, and now into your mind reducing executive capacity.
    - But it doesn't feel like that is all. There's something else that can be used preemptively. There must be something in the flow itself that prevents this.
      - Ok, discipline. To revert conversations.
  - #### Solution
    - `artifacts/XX-temp.md` - temp step file to offload current task (your mind). Because of exploration file, it's less friction to have parallel tasks on the same step if current task got bloated or something. That way the step logic is preserved.
      - So the solution is state of mind/attitude to utilize those "side steps", instead of pushing everything into one task/context.
    - **AHK templates** for now. You need one for context handoff. When the project's window is active and you press like alt + c - ahk pastes the text like:
      - \*"I want to revert conversation... write me context handoff in `markdown block` but limit scope to our recent this to USER\_INPUT."
      - So this kind of exploration is low friction.
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
- ### \[DONE] Issue #6 User's High-Level Block&#x20;
  - #### Discussion
    - **plan**
      - Issue with high-level block. As a user it was hard to write initial thing. It should be kind prompt-like. Not like decisions/invariants. Just give the user free form.
      - For llm's high level though - it gets big really quickly.
      - High level - must contain links block, with related links, so I don't have to re-type them each time in each new task.
    - It's true that it doesn't make sense to have similar stuff that is asked from LLM. For sure.
    - But it raises the question about how much I should do solo. Like it's a spectrum. From nothing, to like reading all the code and writing exact code to replace it.
    - I should have initial reflection for sure. From that - extract what's worth to be extracted, so it won't be like 100 lines of yapping. So yeah. **Free form**. Like if there's decisions to be made... but again - decisions are an LLM-term basically.
    - But absence of options create the same cognitive overload as abundance of choices. So there must be some. So, it's free form, but template will have some stuff right away.
      - Which stuff? (accent on user, so it's not like another LLM wrote it)
        - **Raw User Input** - to not think about unnecessary categorization for each 2 sentences.
        - **User Decisions** - if there's any controversial or nuanced decisions, that's the place for them.
        - **User Scope** - if there's risk of drift - that's the place to define scope of the phase, like if you're doing wiring + layout of ui - don't drift into styling.
        - **Links To Related Files** - stylings/designs/layouts/etc. to keep main plan clean
  - #### Solution
    - **Free form** + a few additional blocks to give a few options
      - **Raw User Input** - to not think about unnecessary categorization for each 2 sentences.
      - **User Scope** - if there's risk of drift - that's the place to define scope of the phase, like if you're doing wiring + layout of ui - don't drift into styling.
      - **Links To Related Files** - stylings/designs/layouts/etc. to keep main plan clean
      - **User Decisions** - if there's any controversial or nuanced decisions, that's the place for them.
    - **UPD** - doesn't have much sense. initial reflection basically IS that. Exploration section (new, not in separate file) - covers links too. So by the time plan is filled - there's nothing to fill for the user.
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
- ### \[DISCARDED] Issue #5 PLANNING.md Enforcement&#x20;
  - #### Discussion
    - **planning.md**
    - This file is central to everything. It should have separate block in agents. Flow have top priority over everything.
      - Like that planning block must be hyper important and be the center of gravity for the whole task.
    - too vague. implementation starts without discussion. llm dumps everything at once. no granularity or control. It's just a mess. Too vague for sure. You shouldn't have single bullet list for that. Each block should be separate, each point should be properly described. You need to have "completion conditions" on each block/loop to have clear stops.
      - **IMPORTANT**. Like it's not a joke, there must be **routine** to this, if it's different every time - you're getting overwhelmed.
      - Like it should have its own section in agents, to clarify its importance.
    - **TLDR** - you lack routine in this. Process is chaotic and unpredictable. That's adds a lot of friction.
  - #### Solution
    - **AGENTS.md** - planning md section as 00 or 01. Accent that this flow is of the utmost importance
    - **00-end template checkbox** to reflect where routine was kept, and where it was broken/interrupted, so it brings the dictionary of routine-seeking behaviour.
    - **UPD** - not needed. Most of the work happens through flows, which are covered by that file (now it's LLM.md), so yeah, ignore.
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
- ### \[DONE] Issue #4 Initial Planning + Steps&#x20;
  - #### Discussion
    - another big one. plan initial steps through artifacts. or in conversation. But not all at once. but one by one.
      - like you write down somewhere top-level overview of planned steps. then do some exploration on implementations. write down description/high level.
        - **KEY ISSUE - what if context is overfilled before all steps are written?**
    - The thing is - it really should be kinda split. Shouldn't it? Like first you do initial planning to understand what the hell you need to do. Like LLM does a bunch of exploration. You need completely separate flow for this one only
    - But should initial planning have some temp file in artifacts? In case I would need multiple tasks? Because exploration may be indeed too big. And dumping everything into the main plan may be excessive. So you use that artifact. out of it figure out the whole workflow of steps - write them down and now you know what goes into steps, and what should persist in the plan throughout whole execution.
    - Discussion and reflection - should have brief template as well, kinda like I had with kilo code. Autoregressive. Recommended choice. Explain in simple words. Also - I should add rule to automatically add at the end user input point. like `- USER INPUT: ` so I can type right away the answer
    - What if drafting steps would be combined with step template? Makes a lot of sense
    - ##### Initial planning
      - **Description:** should have restricted scope. Never leave high-level. First discussion with LLM that includes researching of codebase.
      - It's BY FAR the most important and the most hard phase of the plan.
      - Discussions and reflections as I had in kilo. Like it MUST have a task of seeking only issues. Yes it's PIA to go through all of them. But that's how to do it properly.
    - ##### Drafting Steps
      - Clear sizing/splitting rules
        - Size of the step should play important role. If whole scope is like writing 20 files, and we have step #3 doing 15 files - that's wrong step.
          - it's not about logical blocks, everything can be broken down into cleanly modularized pieces.
        - Size of files to read/edit - also very important. Explore returns sizes. So if we go beyond 200kb of files in a single step - split.
        - We can utilize substep splitting. step `03` into `03`, `03.1`, `03.2`
      - **"Do We Actually Need This Step?"**
        - It's a hard one because I'm often biased. So I may think that we need one, but then we don't. Should it be integrated into step implementation workflow?
        - I'm not sure - during drafting steps VS during implementing steps.
        - Your case was with test step. Turned out to be useless because by the time we reached it - the vision changed and code was much simpler. So you need
    - Here's another question - separate files? Like it might as well be in 00-start - it's perfect place to have this flow. And implementation from 01 onwards won't read 00-start, so it'll get automatically filtered out. And won't be like always present in main planning files LLM always reads
  - #### Solution
    1. **Separate Workflow for Initial Planning**
       - Besides exploration - you can also start filling out `_exploration.md` because lots of high-level research will be done on the codebase (but probably at the end of the flow)
       - use `artifacts/`
    2. **Separate for drafting steps**
       1. Copypaste of sizing/splitting rules from discussion above.
    3. **Do we ACTUALLY need this step?**
       - Inside step template. It should be reviewed during drafting AND during implementation.
    4. **This Flow is inserted into `00-start.md`**
       - (note in planning.md template - to never read 00-start.md unless specified by the user)
       - re-read discussion.
    - **UPD** Done, with some tweaks.
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template

## Low Level&#x20;

- ### Steps
  - ### \[DONE] Idea #4 Meta-workflows&#x20;
    - When you'll be creating all these flows - figure out primitive system to that. So it's flexible to add new one or remove one. Modularized. Low friction.
  - ### \[DISCARDED] Idea #3 Run exploration on done work to confirm it&#x20;
    - It's kinda like just getting second opinion. Experimental too. But it might catch if model hallucinates or something. Like LLM gives exploration agents, plans, planning. and says like "we did step 10 - can you confirm implementation?". That model is cheap, but might be useful as like fail-net against some blind spots.
    - UPD. Discarded cuz code-review flow.
  - ### \[DISCARDED] Idea #2 Revert Checkpoints&#x20;
    - For example, that idea with evaluating if the step is actually needed. Workflow makes LLM explore the step, when it has context - it makes this checkpoint. Then we diverge into discussing if this step is actually needed. Or other topics. We come back, I write "checkpoint passed" and we proceed in a clean branch? But like not through my actions - but through LLM's commands.
    - UPD. It's just another headache to control. That idea with AHK script to context handoff makes this low-friction already.
  - ### \[DISCARDED] Idea #1 Context Cleanup Checkpoints&#x20;
    - Workflow should have a place where LLM asks to stop and cleanup useless context. Before implementation, for example. Experimental a bit. But may be helpful.
    - UPD. Should be automatic. Through my project. Manual is confusing. And headache to control how and when it should happen. And then searching through all the files... Like just create flows that can handle a bit of waste, and also are efficient enough to not have a lot of waste in the first place.
  - ### \[DONE] Issue #4 Re-Exploration Time&#x20;
    - #### Discussion
      - takes lots of time to re-explore all stuff I did while I was writing initial step contents. So each step should have "comprehensive exploration" section where LLM leaves links/notes/tips about how to research everything on the topic quickly. without many loops of back and forth.
      - reflection.
    - #### Solution
      1. Templated file `artifacts/_exploration`
      2. Section with links and concise tips about exploration
         1. one sentence warning that it may be a bit outdated, and is used to only help with precise exploration.
         2. one sentence rule that this file should be very concise.
      3. Written/Updated during completion flow of the step
      4. Self-documenting.
         1. because it'll be updated at the end of the step, so it shouldn't bloat main files.
         2. header - comment.
      5. Headers
         1. Links - to files/folders (with `created/modified/deleted/context` statuses)
         2. Tips - if plan was missing some nuance or something. (but could be dangerous and may explode, but try and see. )
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
  - ### \[DONE] Issue #3 Additional Step Statuses&#x20;
    - #### Discussion
      - I need additional status for canceled/discarded steps (like for tests, when I decided to not do it, or for 08, when I decided to do it in another phase)
      - Do I need more? Also. Because it's not tracked anymore - do I need frontmatter?
        - I would say yes. Because I'm thinking about some minor helper scripts to parse and get like one-line status, like if something is not condensed or all steps are only high level. Stuff like that.
      - So what about specific statuses?
        - `skipped` vs `discarded`? - skipped is better. Like if I wanted to do tests for the X, but when it's written - it's too straightforward for tests so you don't write them.
        - `postponed` - if ordering gets different.
    - #### Solution
      - `skipped` - if the step turned out to be not worth to be implemented.
      - `postponed` - if it's better to implement the step later.
      - description of this - should vs shouldn't be in the planning?
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
- ## Tasks \[DONE]&#x20;
  - ### \[DONE] Issue #2 Completion Flow As a Task&#x20;
    - #### Discussion
      - completion flow doesn't go as separate block. it's just another task at the end like `### 99 - completion flow`, so LLM won't repeat it.
      - yeah, because llm was a bit confused about it. it was task in one case, in another case it wasn't. So yeah. Much easier to to make it a task and that's it
    - #### Solution
      - **Completion becomes a templated task at the end of the step**
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
- ## Artifacts \[DONE]&#x20;
  - #### ~~Issue #1 - Write exploration into .md~~
    - maybe it makes more sense for llm to write its output into .md files? Like I'm repeating the same thing right now. First task was exploring 10 minutes about how quartz proposes to write plugins, and now, in a new task, I'm wasting another 5-10 minutes on the same damn issue.
      - ### Let's think
        - Overlap is there. Sure. That particular issue was a poor separation of steps. And I was angry on top of it. So...
        - if it'll write it out - now you have to make sure it's not outdated, because if it is - you can lose a lot of time or make llm and yourself confused.
        - So no,

## Technical \[DONE]&#x20;

- ### \[DONE] Issue #3 - Frontmatter of the `_plan_xxx.md` and steps&#x20;
  - #### Discussion
    - same as with steps - `status` and `state`?
      - Here's question. Do I need it? Because with steps it's a bit obvious (not anymore though, because I'm not parsing it automatically). But with plan? If it's not parsed anywhere - then do I need it?
        - the thing with parsing, is that I can later do "archive" folder and store all phases there, to not have a "working" folder with 100 folders.
        - But then why not do kinda this flow from the start? you would have subfolders, to reduce amount of initial folders by 10. When phase 001 is done - it gets into those "`phases/archived/10/`" folder. And link is set once and for all.
        - At the same time you can have many temp/active/postponed phases in the main folder that are not fighting with archived ones. Yeah.
      - Back to the question. Does a plan needs frontmatter? - ties to the question whether we use dataview at all in such workflow. If yes - then yes. If no - than there's not much sense in frontmatter. Let's think.
  - #### Solution
    - **NO, you don't need frontmatter** - it's extremely frictionless to handle all of that manually but, you get a massive benefit of LLMs having overview of the project. So they don't have to like figure out from pieces what is going on.
      - So it's not a loss. It's a win.
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
  -
- ### \[DONE] Issue #2 - Poor Styling of HTML Dataview Block&#x20;
  - #### Discussion
    - use icons for showing state of the step (full/high-level/condensed)
      - ○ ◎ ◉ or 🟢🔵🟡
    - inner scrollable container, so 20 steps won't make me scroll forever. Keep it compact. Show maybe last 4?
      - Though I'm not sure whether you need it. Maybe dataview selector is better for table at least? (cuz you can then parse it into website on build time)
    - rendered list of steps
      - completed step should be much more dimmed
      - We need some minimal borders around both table and list.
      - Do I need js? Maybe bases could do the job?
        - The thing is - whether I want to preserve it for the website and LLMs.
  - #### Solution
    - **NO DATAVIEW** for this task. Manual template is more than enough.
      - include two as 00-start and 99-end steps, so you wouldn't even have to explain to LLM how those templates should look like. (but you kinda do, since you need comments)
    - **icons** - yes, but don't add more colors. ○ - high-level, ◎ - full, ◉ - condensed.
    - **list/table** - yes. on the screenshot in reflections
      - Do you need table? It's not readable in vscode. Like you might as well use list. Or maybe drop it completely? Yeah. F it. Not worth it seems like.
    - **scrollable container** - no. BUT you can use outline, since each step won't be as bullet point, so it'll get recognized.
    - **self-explanatory** - for this and everything onwards. use explanations only where they're needed. With this step - only icons and their description is added as comment under ## Steps. how to comment completed steps will go into the completion flow of step template
- ### \[DONE] Issue #1 - PIA Navigation&#x20;
  - #### Discussion
    - Navigation is kinds PIA. I have to switch between vscode and obsidian.
    - the issue is that you get overwhelmed by the amount of docs and text.
    - Like right now one thing was changed - 5 docs were edited. I'm like not even want to do anything with it.
  - #### Solution
    - tied to workflow.  The goal of proper workflow is to edit one file with text you're expect to be edited in a specific manner.
    - You get overwhelmed because it edit a lot of stuff with a lot of text at once. Which means creation of highly interactive harness around the planning.md

---

## Reflections&#x20;

- ### How flows should look like?
  - I'll try to nap. I have problem loaded. Let's see if 15 minutes will help me, because I'm like lost.
  - First of all - it's read only. It must be repeatable.
  - Then it must be identifiable. Not just flat list of points.
  - This discouragement is kinda helping me. Flows aren't going into the way I'll use them efficiently. I used LLM to get a bit of help and it instantly discouraged me.
    - Those flow were like high-level description. And now I have to do another loop to define them... That's hard...
  -
- ### Should I use template of the step inside planning?
  - Like I can pre-create 10-20 step files with phase template. And then LLM would know how to use them.
  - OR I can have template within steps folder as `_step-template.md` That way planning gets reduced to being a general rules/structure/workflow + hub that centralizes other modular workflows.
  - Do I need completion flow in each step? Like it might be better to have it separate. Because LLM usually needs to work through all the flows, and only then it's interested in the step template WHEN it creates steps.
- ### re-exploration
  - so, the first question is about where this should be stored? Per step feels too overlapping.
    - Maybe it's worth to have per-plan? Like somewhere in LLM section. **+ a rule on step completion to make sure that all links are up to date in the plan?** since we're updating the plan ANYWAY, by the way, so that thing of dropping dataview even a bigger win, because I can be much more proactive with the plan.
  - ok. it'll be list of links per plan? A bit bloated, don't you think?
  - what about artifacts? We can have `_exploration.md` in there linked into the plan. The question is whether I need that separately. Because you're proactive in this one. so it would be nice to have list of files we touch/need/create OH
    - **modified/created/deleted/context** - per each file. Worth it? Like yeah, since everything will be done within a step, so it's safe. But then exceptions and edge cases. You forget to mention that something was modified/created and now you not having all the info you need.
    - That doesn't make much sense to track... I think... But maybe it does. I try, if it won't work out - I'll delete it.
  - The thing is - I don't need those links because it's not mean to be used through obsidian/vscode. Like I use git and tabs and it covers 95% of cases. Besides me knowing what and when is changed. So it'll be separate templated file for sure. Created with creation of the phase
  - #### Extracted
    1. Templated file `artifacts/_exploration`
    2. Section with links and concise tips about exploration
       1. one sentence warning that it may be a bit outdated, and is used to only help with precise exploration.
       2. one sentence rule that this file should be very concise.
    3. Written/Updated during completion flow of the step
    4. Self-documenting.
       1. because it'll be updated at the end of the step, so it shouldn't bloat main files.
       2. header - comment.
    5. Headers
       1. Links - to files/folders
       2. Tips - if plan was missing some nuance or something. (but could be dangerous and may explode, but try and see. )
- ### am I locking in Quartz?
  - I think so. You'll go completely rogue on it without keeping compatibility with upstream. That'll be enough to free your hands and do whatever.
  - Astro is better, but it's weeks of work. I just can't. Like I'm barely holding on here. I must try this publicity idea first. And then see if it's worth to give up. Right now - work.
- ### on what this website should be about?
  - Like for astro - you need to have something that goes beyond typical 1:1 obsidian vault. That's the thing. If you want to stay 1:1 - quartz should do the trick, because it's covering lots of PIA stuff. Yeah it's not really optimal in many aspects, but you can fix it, since it's highly modular. Optimized too. So I would focus on extracting as much as possible from quartz.
  - I just don't want to spend like 3 weeks doing quartz, and then finding out that I could've done more in less time using astro. So I guess this pause is half-justified.
- ### on dataview in planning workflows
  - The issues.
    - **LLM can't read rendered dataview query/js**
    - **Website needs to parse every dataview query**
  - Pros
    - Reduces friction. Instead of using LLM to read another file and keep it up to date - query can parse that file into the plan/project, and keep it up to date automatically
      - But for what purpose it has to be up to date? Because right now it reads as if there's none.
      - Yeah, there's none. Worth having dataview
  - Pros of doing manual
    - with the plan - it's kind of obvious. You need it.
      - You start a step, you attach a plan anyways. And LLM should update it only on step completion flow. So it won't interfere with the task if LLM will read the plan once again at the end. That's fine.
    - With the project - it's even more obvious.
      - How often do you change status of phases? Like in ideal world where you have speed - it'll be 1-3 phases per day. Which is not much at all, so there's not much friction. BESIDES that, you'll have usual flow of moving the phase under archived/ folder, so there'll be some manual work.
  - **So, does it mean dataview won't be needed here at all?**
    - Well, there's that block that pulls up docs/artifacts/ideas list of files.
    - LLM doesn't need to know about those because most of it probably would be unrelated. I attach them into context only when I need it. Manually. So it's fine.
    - Wait a second. Seems like quartz syncer supports parsing dataview js queries. I need to test.
    - Got off track.
    - Ok, it renders it, but does it suboptimally.
    - Excalidraw plugin is BS too. Laggy. Limited. Practically no plugin one might say.
  - Previous point. Again.
    - At this point. Excalidraw isn't a blocking issue. I plan to use it with knowledge system, whenever it'll get developed. Dataview - the same. Besides that one point of aggregating docs under the same list and automatically. Like it really IS helpful, especially because I plan to track what was integrated. So it'll be highlighted if I wrote something and then forgot about it. But c'mon. Honestly - how stupid is this?
      - IF that's important - you don't forget so easily.
      - Nah, it's not only about that. those also act as expansions on ideas/issues/reflections, so I don't pollute steps/plan. basically I have either` _reflections` or `ideas` or `artifacts`. Do I need artifacts? yes I do. I develop some feature, I download docs or images around that feature and place them there. So it's contained where it's needed. If it's needed again - I may move into some other shared folder. But that's not the case. I need all 3. Like I probably would add even more as time goes.
      - So what options do I have?
        - It's either use dataview, parse, and figure out how to make it similar
        - or don't use dataview and link everything manually.
      - maybe I just update code of the dataview parser?
      - but no, it's obsidian plugin, so I can't.
      - bases then maybe?  - no. bs too.
  - Again.
    - Dataview seems to kinda work the best out of all options.
    - Everything else gets done manually. it's fine.
    - When knowledge system arrives - that'll be painful. The same with tasks, if I would want to integrate them into obsidian.
  - Again.
    - You can't predict what you would need. Let's be honest. knowledge system is kinda week+ away. Tasks... on the paper it's nice to have them in journal. But on practice - it's BS. no reminders, no dates, no reoccurrence and a bunch of other things. So I won't use this for tasks.
    - Databases. I think I got overfocused on views. Databases is just to have like a nice card-like view of knowledge. It can be done through new coded view. A bit PIA but not a major one.
    - Dataview for now used only in project/plan for those lists of docs. There's a way to target them too. So you do that and will figure out the rest later. WHEN you will need it.
- ### on style of plan's list/table
  - I need that list with descriptions. It proved to be useful for reducing cognitive load of parsing previous tasks. BUT. Here's the thing. It can be written manually. Steps too. Since they're supported by LLM and only curated by you. It's a bit PIA, cuz LLM would need to read plan to insert this block. BUT. It's preserves its usefulness + llm get to have overview too AND on website it's in original form as well, which means if there'll be lots of those - I wouldn't have to wait until everything gets parsed built by quartz. It will add time for sure.
  - So, let's lock this in. you have:
    - table of steps with relative links + state/status.
    - list of steps with descriptions. But how would I dim them? Comments. Makes lots of sense. ![[@system/projects/iterations/_attachments/Snipaste_2026-10-27_12-15-27 (2).webp|395]]
    - But that means you have to play with styles a bit, because all those styles within comments need override. But that's not a big issue. Not big at all.
