Ok. What options do I have?

- ### Style current basic UI
  - Feels too soon. It’s premature to style things without having complex design
- ### Move to familiarization with Server + refactor
  - 65 files caused me a big headache. Server has like 200. I need to add things, to see progress. So for now I’ll stop.
    - ###### But what about api? What if new client2 approach won’t fit it?
      - API files are low in amount. So IF there will be need I’ll deal with them. But for now - I’ll delay
- ### Proceed expanding client2 to match old client functionality
  - Seems reasonable. Foundation is there - now improve on complexity.

---

Imagination of path #3.
Ok, so I started a thing.
I must figure out what to do.
I have basic project list, task list.
I need chat now.

- Input box
  - Model selector
  - Mode selector
  - Send button
  - Context size (but maybe not, since it’s tied to server)
- Chat itself
  - My messages
  - LLM messages
  - Tools (including subtasks)
- MM
  - nodes, ordering, etc.

---

But I have issues with imagining it. Because it became suddenly super complex. I don’t know neither layout nor architecture.

- Do it blindly so later I’ll have to re-do it? Meh.
- I’m just not in the mood. But remember puer aeternus - work.

Ok. Again. What if I don’t think about future of coding the thing. Maybe like it’s too much. What if I focus today only on thinking things through?

Well, that works.

---

So, for layout/style:

- Check other popular UIs
- Discuss functionality of UI.
  - Like main point isn’t to make it beautiful, it’s not like a game. UX must be good. Cognitive load of UI must be low.
  - These things will downsize space of choices.
- Lock in app purpose and layout. Additional constraints.
  - Like is it full-screen app, or “side-window” one?
  - I know that I’m moving to kinda side-window/tab, but like should I support full-screen layout then?
  - Purpose. Unknown for now. Figure out precisely.
    - Is it app for devs? Is it app for like general life or research or study? Is it both? Should it be both? Is there something more?
- Main thing - keep making things modular, especially UI itself. If it’ll be easy to adjust things - then I won’t be afraid so much to lock-in decisions.

So, as result, next step isn’t to just blindly code. But figure out much bigger things that will set constraints on choices.

### Insight

You get overwhelmed because the end of refactor and familiarization marks the time where I’ll need to actually implement things and make very hard long-term decisions.
So obviously I’ll dodge, because I don’t know exactly what this app is about.
By locking-in constraints, I won’t be overwhelmed by infinite amount of possibilities.

---

### What else to do before moving  to the next phase?

- Reformat DEV\_RULES.md. Noisy.
- Try to automate some rules through linter.
- Think about README - I would leave it as is, but at least save insights somewhere, so they won’t be forgotten.
- merge branch, if next client2 phase will need server updates as well, current client may get broken, I won’t be able to use it in the dev.
