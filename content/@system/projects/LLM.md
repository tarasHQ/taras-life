# LLM.md

## Description of `__obsidian__/`

- ### Why it exists?
  - SSOT on project's planning, ideas, reflections. Everything related to the project is under a single folder.
  - `__obsidian__/` is junction target, and my obsidian vault has junction links to each folder in the project, which means that all my project who have this folder are accessible through my obsidian vault with benefits of using much-much better UX of working with markdown documents.
  - Main goal though is to reduce cognitive load through having structured planning routines and flows which have increased capacity for planning and implementing complex things.
- ### Structure of `__obsidian__/`
  - `_reflections/` - Project-wide reflections.
    - `artifacts/` - Storage for additional files/images/sounds/etc., scoped for the whole plan.
  - `docs/` - Project-related docs, such as `AGENTS.md`, `DEV_RULES`, etc. Described within `AGENTS.md`
  - `ideas/` - Project-wide capture of ideas of any kind to be implemented later through the phase workflow.
  - `phases/`
    - `_archived/` - Completed phases, to avoid long lists with dozens of phases under `phases/`
    - `XXX/` - Number of a phase, e.g. `003/` or `052/`
      - `_reflections/` - My phase-scoped reflections.
      - `artifacts/` - Storage for additional files/images/sounds/etc. scoped to the phase only.
      - `ideas/` - For phase-scoped idea capture, to process them later.
        - `parking.md` - empty file for quickly capturing/off-loading ideas
      - `steps/` - Implementation steps files
        - `00-start.md` - Baked-in phase-start step, created by the phase template. Checklist to start planning in the right state of mind.
        - `XX-step-name.md` - List of created step files when the phase is mature enough for implementation.
        - `99-end.md` - Baked-in phase-end step, created by the phase template. Checklists for the end of the phase (reflections, docs alignment, archiving).
      - `_plan_NNN.md` - High-level plan of the current phase, also is an entry to the phase. Its "## Exploration" section holds the phase-scoped exploration notes
  - `/_project.md` - Project's entry point. Overview of phases + reflections & ideas and their categorization

---

## Description of `@system/projects/`

- ### Why it exists?
  - SSOT on meta-planning, so I don't have to maintain the same files in multiple `__obsidian__/` directories across the multiple projects.
  - This directory is also the SSOT for all related knowledge on what is (and how to work with) `__obsidian__/`, `@system/projects` and internal Templater's templates.
  - Difference
    - `__obsidian__/` is project-specific, located at the root of project, accessed through usual relative paths.
    - `@system/projects/` is project-agnostic, located in a separate directory within my obsidian-vault, accessed by LLMs only through absolute paths, and operates at one level above all the projects.

- ### Structure of `@system/projects/`
  - `_reflections/` - reflections for meta-planning.
  - `_templater/` - Storage for Obsidian Templater plugin's templates for user-invoked creation of the phase
  - `iterations/` - Basically captures ideas/feedback for iterating and refining the meta-planning.
  - `shared/` - contents of this folders are meant to be used by LLMs in different projects on daily basis.
    - `flows/` - self-explanatory.
    - `templates/` - for LLMs to manually copy-paste them into their workflows.
  - `LLM.md` - LLM's entry point to the whole directory.

- ### Flows
  - #### Rules
    - LLMs should always interact with `@projects/` files through absolute paths, cuz it's in another external non-project location — resolve the relative wikilinks below against the base from the category comment.
    - LLMs are forbidden to read files with flows unless explicitly asked by the user.
    - [[shared/flows/_flow-creation-rules.md]] - internal rules for the creation of the flow, to make sure the flow isn't a bad one.
  - [[shared/flows/refining-reflection.md]] - to refine user's raw reflections, by showing all possibilities of that reflection
  - [[shared/flows/scorched-earth-critique.md]] - to discuss user's reflections/plans/ideas and separate the wheat from the chaff
  - [[shared/flows/initial-planning.md]] - to discuss and lock down user's ideas into the implementable form
  - [[shared/flows/writing-steps.md]] - to discuss and create implementable low-level steps.
  - [[shared/flows/implementing-steps.md]] - to properly implement steps and keep the whole phase up-to-date with changes.
  - [[shared/flows/code-review.md]] - to make sure implemented code is properly understood by the user and is of high quality.

- ### Templates
  - [[shared/templates/readme-template.md]] - to be used during creation/rewrite of module's `README.md`
  - [[shared/templates/step-template.md]] - to be used during creation/rewrite of step(-s) files in the phase.

- ### Obsidian Templater Plugin's Templates
  - \[\[\_templater/\[T]phase.md]]
    - the master template that runs creation of the phase
  - \[\[\_templater/\[T]plan.md]]
    - a template of the phase's plan
  - \[\[\_templater/\[T]step-start.md]]
    - a template of the 00 step, with checks and preparations before the work starts.
  - \[\[\_templater/\[T]step-end.md]]
    - a template of the 99 step, with checks and completions of the phase.
  - \[\[\_templater/\[T]ideas.md]]
    - a small template to quickly capture ideas
