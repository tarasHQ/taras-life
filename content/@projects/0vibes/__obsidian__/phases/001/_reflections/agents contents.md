---
publish: true
created: 2026-10-22T08:17:12.068Z
modified: 2026-10-23T15:26:13.412Z
published: 2026-10-23T15:26:13.412Z
isIntegrated: true
ctime: 2026-10-03 19:24
---

[← Plan](@projects/0vibes/__obsidian__/phases/001/_plan_001.md)

## Problems & Goals

> [!abstract] To prevent drift, specify exactly the problem you are addressing

- Figure out good layout for agents.md plan
- Figure out contents of that file
- Figure out contents of the plan

## Insights

> [!lightbulb] Condense insights to keep them actionable and easy to review

- ### ~~Structure of the AGENTS\_PLAN.md
  - #### ~~Structure of the obsidian/ folder
    - 2 blocks.
      - Raw structure
  - #### ~~Rules
    - Symlink logic, so LLM would exactly know how to reliably address it
      - use overwrite tool on absolute paths
      - or use ./**obsidian** on relative paths + overwrite and edit
    - all file names in lower case
    - steps will be mostly created by LLM, so template for naming and placing steps as ./steps/05-step-name.md
    - General idea
      - h3 or h4 - **obsidian**/ rules
    - ##### Steps
      - since it's only LLM-generated files
      - (rule: steps under 15 lines long can be inserted directly into the plan)
      - rules - steps sorting by number (highest number on top)
      - can have step 05.5 if we need to include a step in-between
      - - Rules of how to create steps.
          - Each step must be isolated. Why? Feels like it should be, don't know. Too tired
          - We need more rules about how steps should be done.
          - And these rules must be also inside
  - ##### ~~Flow
    - Template phase
    - Reflect to get whole scope of the problem
    - Filling up the plan
      - Goals, whys, your high-planning, reflections, artifacts (if any)
    - Checking down 00-preparation step
    - LLM gets AT THIS POINT involved to generate steps.
    - **Do I need flow though?**
      - YES I DO. Keep plan clean. LLM must know when its time comes.
      - Then we clarify with clean separator
        - PLACE INSIDE THE PLAN TEMPLATE
        - \==========================
        - LLM allowed to touch only text below
        - \==========================
  - #### ~~Decisions
    - Either here or inside separate file
      - Templates should be self-documenting.
      - Like lots of things from this reflection. Decisions for me. To not forget why I chose what I chose.
    - and decisions from the file - dissolve them. web-app related into client2/src/readme. project related - into packages/readme
- ### ~~Structure of the plan
  - #### ~~h2 RULES
    - codeblock because it’s distinct from other things
    - h2 because it allows to collapse it
  - #### ~~h2 Meaning
    - h3 - Completion Goals (or other name)
    - h3 - Positive vision
    - h3 - Negative vision
  - #### ~~h2 user-input or user-planning
    - Block of YOUR high level planning. Unedited by LLM.
    - Example. You want to implement the plan in specific order. You write that down in there. THEN you include LLM and it’ll already know what your view on the task.
    - So, it's order of implementation. Things you think that is worth to do. Some long
    - structure
      - h3 - User Decisions
      - h3 - User High level plan
      - h3 - User Nuances
  - #### ~~h2 LLM planning
    - Idea is to preserve my own words, so LLM will less likely to drift away.
    - structure
      - h3 - Decisions
      - h3 - High-level plan
      - h3 - Nuances
  - #### ~~Steps
    - LLM generated block
    - 00-preparation not as a file, but inserted into \_plan.md  template.
      - So before implementation you just check it down and then collapse.
  - #### ~~Post-completion
    - What created unnecesary friction from the plan? (as a block in the plan to have feedback and self-improving flow)
  - #### ~~(NOT IN STRUCTURE) Changes
    - remove 00-preparation. Integrate in template. On completeion you just check things and move next.

---

## Raw

> [!quote] Free-form reflection with no rules or structure

- Ok. What do I think.
- Do I need structure? I would say yes. LLM reads it and instantly know what is where
- BUT. It’ll run explore tool anyway. or not. It’s pretty compact low-tokens blocks with some useful notes such as symlink folder. So let’s leave it

---

- Next. I want to know the flow. Me and LLM.
- What do I mean by that?
- You create a template, then you need to reflect on what exactly you need to do. You need to reflect first to have full scope of the problem. THEN you focus on filling up the plan.
- Then you go throug

---

- If I would have vision - do I need whys? Probably yes. Vision is positive. Whys are negative. But wait. No. Then just do positive/negative visions. Inside red and blue callouts. But like >callout name - and in same line write down the visions.

---

- Goals & steps
- Visions need goals. Like I can’t fill out visions without goals.
- And yes, I can’t use goals in steps because we need COMPLETION GOALS
- While steps is implementation goals.
- So this structure of goals enforce specific logic
  - Like you can’t use small goal for completion. So completion is like big-ass main targets.
- How it combines with visions?
  - Like that - goals describe grouped targets. Like for this phase we have templates engine, we have agents\_plan and we have contents of templates.
    - This is 3 main goals
  - Visions based around doing them and avoiding doing them.
- So main goals first. Then visions around them.

---

---

---

---

---

# Steps

- for the plan I'm lacking only steps here.
- Like I want using tasks list under step if it's inside plan (too big for separate file. )
- So how can I approach this?
  - headings
    - Then sorted list of steps(highest number at the top)
    - \==\[ACTIVE] at the end. To easily copypaste
    - strike through for completed plans
  - One-sentence description
- ### Template in agents or keep in templater?
  - Because if it's LLM-generated files. I don't need template
  - and 00-preparation will be inside template
  - So I need template only inside AGENTS.md for LLM.
- ### Contents
  - #### Inline
    - A bunch of - \[ ] tasks, that describe themselfes in that point as well.
  - #### File
    - new reflection below

---
