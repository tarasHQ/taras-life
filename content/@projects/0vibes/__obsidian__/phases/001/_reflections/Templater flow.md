---
publish: true
created: 2026-10-22T08:17:12.068Z
modified: 2026-10-08T18:39:38.527Z
published: 2026-10-08T18:39:38.527Z
isIntegrated: true
---

Ok, so.what’s the issue.
Is it safe to figure out templates right now? To get it out of the way?
I think that yes, because you only create one thing

Back to templates.
So, I’ll have those 3 templates + template to create a phase. Will that be sufficient?
Like structure is there. 3 templates are files-only, so if something changed - it’s..

ok. we do it now

Next question. Interactivity

### Reflections

What I need to type?
Well, location. Through autocomplete
Also name, but if that would work through native thing, where focus title of created not - that would be better.
Do I need frontmatter?
for processing marker? Or use name \[R] ? I think frontmatter will be better performance wise.

So. location through AC.
Name native focus or input window.
Frontmatter in template for isIntegrated.
And also let’s put frontmatter ctime as well. As a date only.

---

### Plan

Interactivity - none. Template purely to either some very manual flow or to be re-used by phase creation

---

### Step

- interactivity
  - Do I need it? Nah. Like 1st it’ll create automatically. But then what? Yeah, you need it. What if you want manually add some additional steps?
  - ac for \_project.md files. To get root of project
  - then ac for phases inside root of project/phases/
  - then ac for name OR focus on creation

---

### IDEAS

repeat steps probably or reflections

---

I want to think about steps. What if that flow from higher can/should be done in those steps? Like for example, I was planning dataview - you do a step DataView.js or something and put it in there. And as I go through the thing - I offload things in there.
So steps won’t be only divided plan, but also that thing I’m missing to reduce cognitive complexity. When Implementation happens - that’s where you’ll spend your time as well.

But where? bottom? Or top? Top. We have that abstract block - that’s where we’ll add another block for these kind of things

---

### Phase Structure

- Interactivity
  - Same as with reflections, to get which \_project.md root folder needs the phase.
  - then phase number
  - then phase name? - nah, it may change a bit, or I may not know what exactly I need to do. So no, no name.
- What it does
  - creates phase folder (fail if folder exists and is not empty)
  - creates \_reflections and ideas and artifacts
  - creates plan using plan templates
  - creates steps/00-step preparation, to make sure that everything is ready.
  -
