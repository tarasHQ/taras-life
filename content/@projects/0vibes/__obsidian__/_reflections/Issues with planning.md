I would argue against focusing on 004. We must create template on 003. 004 is basically placeholder because I don't know how 003 will look like at the end.

So.

Let's start from highest level. Canvases for navigation/overview/meaning. Purely human-related.

1. Like I need to have a "Why I need this phase?" Brief list of points.

# Why I need this phase?

- ### To have necessary functionality to remove legacy client
- ### To have high quality foundation for further dev

It's just motivational thing, in case I'll doubt myself.

2. Next is constraints of the phase. I don't know whether I need it. Like idea in my mind is to force constraints to avoid like doing unexpected major refactor in the middle of planned work. Then it delays completion of the phase, which makes me demotivated.

I need to think about my issues during execution.

3. Like once I overfocused on AUTH view, spent like 4 days on it, which made me demotivated by the lack of progress and to drop the project for a month. (it was cumulative issue, auth view was the last straw)

4. Another thing is that without a clear structure - I can fall into vibe coding. Where I just allow LLM to do the work and that's it. Why? Because I had 2000 lines long plan. After a break, to proceed from the middle is a nightmare, like I need to read all of that to understand what's happening. So I can be in the loop during the dev. So that's why I want further decomposition of the phase into steps/subphases/etc. So I won't be overwhelmed by everything.

4.1 And to help with issues of reading many files to catch up - at the end of the plan we can write context-handoff to the next file. So it will start with everything it will need from previous phases. But again it's not clear how to do it properly

5.What other issues I had? Hm...
Let's think. Big files - major issue but I kinda touched it above.
Complexity. But, also, decomposition + high level overview of canvas.

---

6.Layers of planning.

Ok. it's not as much an issue as just reflection on amount of layers.

1. Do I need layer where I have all phases? Like `project-level layer` of canvas. Yes. Why? Long-term overview of the progress. I can also pre-create future modular phases and place them on canvas unlinked to do when there'll be a good moment for that. Also project-wide motivation. Progress feeling. Structure/overview. Links. Everything is helpful
2. `Phases`. Yes. Why? Well. Opposite of phases is my previous idea to have just .md files stacked around the features, so when we develop the feature - we have all related docs near it right in codebase. BUT - it's janky. 90% of content of such files is either outdated or just useless. So new approach of phases to capture temporary things under the phase, and extract invariants/nuances/requirements/short-term future features/etc. into single README.md - seems like a very good idea. So phase is a development-related entity that helps with DEVELOPMENT - REFLECTION/PLANNING/EXECUTING. While continuity of all long-term things are extracted into README.md.
3. `Phase-canvas`. Yes. Why? Nice 2d overview, I phase get complicated  - I can create links/dependencies between implementation steps. Also it's nicely showing progress of implementing the phase. So I would say it's like highest-level plan for the phase. And also navigation. Without it, there may be like 10-20 .md files + some additional sub canvases + images. When you open that folder - it can get confusing. While canvas allows to structure and group and link and preview - makes navigation and comprehension of that structure super easy.
4. `Sub-phases/steps/etc`. Now that's where shit gets unclear. Because like
   1. `do I need separate steps/files OR do I need to split the whole phase into multiple ones`. I would argue though that steps are better. Because like now in 003 - we work on branch mostly. I don't need to move between 3 phases to capture all things I want to have.
   2. So it leaves us only with further decomposition into sub-entities.
      1. What do you think about higher proposition of creating step-plans that will have context handoff of previous step plan?
   3. And also we have to think about how it should work canvas-wise. Seems like to have "step # - NAME \n one sentence description" is kinda ok? And below it we embed minimally step's .md plan. So navigation is easy. Everything is in the view. When step finished - its node and plan gets greyed out (i have special snippet for that to do that easily)
   4. And structure of that step plan should be also probably split in two distinctly separated sections. Top one is high-level of that plan. And bottom one is for code/implementation stuff.
5. And further layers than that seems to be unnecessary.

---

What do you think?
