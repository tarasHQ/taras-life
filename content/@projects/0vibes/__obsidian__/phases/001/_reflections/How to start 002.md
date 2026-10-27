---
publish: true
created: 2026-10-22T08:17:12.068Z
modified: 2026-10-08T18:39:06.163Z
published: 2026-10-08T18:39:06.163Z
isIntegrated: true
---

# Goal

- Going to eat, but before want to have clear plan on how to approach this phase.

# Insights

- So it’s basically 2 points. Planning for low-effort planning flow, and templater for low-effort structure.
- Templater
  - Create separate templates for:
    - reflections (interactive)
    - phase’s plan.md
    - phase plan’s step.md
    - whole phase structure (including empty reflections/ideas + steps/ with 00-step.md)
  - Templates should be as SSOT from .md file that is now as temp extraction.
- Planning
  - You had a good progress on temp extraction. So just proceed with it.
  - combine agents.md + temp extraction into a single file.
  - Imagine flow of implementation of 002. Like you create empty stuff. Here you reflected. Now you need to create a plan. And from that - steps.
  - Talk with LLM, extract that task you discussed as well

# Raw

- So what’s the scope
  - Templater - for templated creation of structure
    - Key things
      - \_reflections
      - phase’s plan
      - phase plan’s step
    - But what about creating whole phase at once?
      - Now I don’t need a plan
      - Steps - I might want to, though not sure
      - Reflections for sure.
    - What if for templater we do only phase structure + reflections?
      - But if we do phase structure we might as well do plans/steps as well
    - Interactivity?
      - like I run templater, and choose plan files is \_plan.md so it only needs to know for which phase I need it to insert it there.
    - Do I need ssot templates? It comes down to LLMs. Will they create empty reflections, plans, steps? Or I mean those files without template?
  - Phase plan
    - it mostly self-explanatroy
  - So, you would have structure of templates + kinda agents.md for planning.
    - Is this enough to proceed to 003 planning + implementation?
    - Do I need dataviewjs scripts to parse child outline or something? Like we can have  `_project` to automatically parse phase numbers and titles + link them through relative markdown, on top of it, we can extract some uniform block as description or something, if needed.
      - The only issue is whether we need that project.md. But I think that yes. We place there phases + plan future ones.
      - Ok, no. No dataview here.
  - And let’s think about flow in 003 from the scratch.
    - templater creates a phase. I add it to project.md manually, mark it active. link it.
      - Open plan - start to write what I have to write.
