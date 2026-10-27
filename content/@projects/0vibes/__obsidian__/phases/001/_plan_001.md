---
publish: true
created: 2026-10-22T08:17:12.056Z
modified: 2026-10-20T15:51:13.626Z
published: 2026-10-20T15:51:13.626Z
isIntegrated: false
ctime: 2026-10-03 10:05
---

[← Project](@projects/0vibes/__obsidian__/_project.md)

# Phase 001 - ARCHITECTURE OF PLANNING

```markdown
1. READ THE WHOLE DAMN THING EVERY TIME

2. APPLY IT TO THE PLAN

3. THEN DELETE

---

# GENERAL RULES
1. Description should be manually written by user
2. When you'll be hopeless - this answer must keep you productive
3. Be as honest as possible, be the Fool
4. Avoid possession by positive/negative complexes
The issue is that you're either making dishonest goals. They're either too complex, or too vague, or too optimistic. As result - they're not sustain you through the storm. 

# GOALS
1. Every goal of the plan should be clearly defined and achievable. 
2. 
```

## Meaning

### Why should I spend time an energy on this plan?

- Without the structure in planning/capturing/reflecting/implementing - I will be constantly overwhelmed.
- Plans will be different every time. Flow will be different. Reflections will be all over the place.
- So I'm spending time and energy now, to NOT spend 100x more later.
- To have centralized and flexible structure that helps me and not works against me

### Goals

- #### ~~Templated flow for phases/plans/steps/reflections
  - Why? - Low friction. Automatic structure. No unnecessary cognitive load.
- #### ~~Fill up this plan
  - Why? - As a first template to test in the battle and see how to make it useful in real conditions
  - Why? - To make it help me from the start. To use it to tackle the a bit complex problem.
- #### ~~Extract insights artifacts/chats
  - Why? - To have everything I need to process in a single place, instead of re-reading/re-looking a bunch of text
  - `agents.md`, `llm task`, check reflections/ideas.
- #### ~~Redistribute unrelated features
  - Why? - To not think about things that are note related to the current phase.
- #### ~~`Temp Extraction.md` - figure out structure
  - Goal is to have AGENTS\_PLAN.md out of it.
  - High level first. Skeleton. Based on insights.
  - Low level next.
  - Why? - single file to rule them all.
- #### ~~Polish templates based on the first experience
  - Why? To avoid boiler plate or something that is having unnecessary friction.
  - So it's all templates format & structure.
    - Step 00-preparation especially. To not be a thing that I don't care about.

### Vision

- When I start code implementation - everything is ready. Low friction phases. Structure is nice. AGENTS\_PLAN.md is useful both to me and LLM. I don't have to think/track other files.
- Big one - on complex problems I don't have to track lots of related things or even unrelated ones.
- The whole flow allows me to be less exhausted and move through the implementation more efficiently.

## High Level

(Custom block to contain invariants/rules/abstract nuances/etc.)

HAVE NO IDEA WHAT SHOULD BE HERE (maybe current phase to easy to have anything here. )

### Reflections

- [[@projects/0vibes/__obsidian__/phases/001/_reflections/agents contents|agents contents]]
- [[@projects/0vibes/__obsidian__/phases/001/_reflections/Explorer View Suboptimal|Explorer View Suboptimal]]
- [[@projects/0vibes/__obsidian__/phases/001/_reflections/steps-contents|steps-contents]]
- [[@projects/0vibes/__obsidian__/phases/001/_reflections/Templater flow|Templater flow]]
- [[@projects/0vibes/__obsidian__/phases/001/_reflections/How to start 002|How to start 002]]

### Ideas

No files found

### Artifacts

- [[@projects/0vibes/__obsidian__/phases/001/artifacts/Temp extraction|Temp extraction]]

---

---

---

## Implementation Steps

- ### 08 - TickTick ideas to obsidian.
  - [ ] Create business block (I guess?)
  - [ ] Website block too
  - [ ] Check all lists from ticktick
- ### 07 - Deadline & Scripts
  - [x] Also think about dataview.js progress bar (or custom plugin can be better) Near implementation steps heading
  - [ ] Update helpers to track if file has isIntegrated property. If does - highlight in red if false (or something like that)
    - [[Temp extraction]]
- ### ~~06 - Template contents part 2
  - Step files.
    - [[steps-contents]]
- ### ~~05 - Template contents part 1
  - \_plan.md
    - Including inline steps
  - \_reflections.md
    - What do I need here from current reflection experience?
      - \==Unify goals/problems/insight - why? if you have multiple issues, it gets a bit confusing to orient in there.
      - h2 header is goal name
        - h3 - a problem description
        - h3 - insights
        - pre-create all headings
      - Repeat
      - triple separatort
      - h2 RAW
      - Each section - place multiple empty bullet points
      -
- ### ~~04 - AGENTS\_PLAN.md
  - Create it
  - Fill it
  - Use Meta-insights below.
  - DON'T DO OTHER THINGS
- ### ~~03 - Dispersing unrelated features
  - Either into readmes or in 003
  - Probably 003 will be better since readmes aren't that much popular
    - though for branch/task it might be worth it to split. short-term into 003, and long-term into readmes.
  - Just get it out of the way.
- ### ~~02 - EXTRACTING INSIGHTS
  - \~~Issue: I had some work on current, and it's all over the place. I need to bring all insights together.
- ### ~~01 - MINOR THINGS
  - \~~Issue: Doesn't allow me to hot-reload user scripts. So if I change something I must reload whole obsidian
  - \~~Issue: navigation within project's folder is deep and tedious with current obsidian explorer.
  - \~~Issue: poor performance on scroll
  - \~~Issue: 3 columns layout for dataviewjs
  - \~~Issue: Making scripts configurable
  - \~~Issue: better ibeam cursor
  - \~~Issue: cursor-smith bug report
- ### ~~00 - PREPARATION [open](00-preparation.md)
  - Make sure that the phase is ready for implementation.
