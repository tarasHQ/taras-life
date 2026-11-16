<%\*
// ================================================================
// TEMPLATE: Phase End Step Note (phases/NNN/steps/99-end.md)
//
// LLM RULE:
// DON'T USE <> TAGS in comments. It breaks further rendering of markdown in obsidian.
//
// WHAT THIS DOES:
// Content template for the phase's deterministic LAST step note
// (phases/NNN/steps/99-end.md), created automatically by \[T]phase.md.
//
// HARD GUARD:
// This template is NOT runnable manually. It only renders when invoked by
// \[T]phase.md through the shared \_\_phaseCaptureAuto context flag, which pins
// the exact target path. Any other invocation aborts deterministically.
//
// SELF-LOCATION:
// \[T]phase.md places the note at its final path BEFORE rendering, so the phase
// number is derived from the note's own grandparent folder name (e.g. "004")
// to build the "[← PLAN](../_plan_NNN.md)" backlink — no flags or placeholders.
// ================================================================

// ================================================================
// 0. CONFIG — the single place to adjust names / paths / prompts.
//    NOTE: autoCaptureContext must match \[T]phase.md, \[T]ideas.md and
//    \[T]reflections.md — it is the shared exact-path-scoped guard context.
// ================================================================
const CFG = {
// --- Guard context (hard guard: \[T]phase.md is the only allowed caller)
autoCaptureContext: "\_\_phaseCaptureAuto",

```
// --- Navigation (relative to the note's final location steps/ inside phases/NNN/)
backlinkToPlanPrefix: "[← PLAN](../_plan_",
backlinkToPlanSuffix: ".md)",

// --- UX / environment
ctimeFormat: "YYYY-MM-DD HH:mm",
```

};

// Hard guard: only \[T]phase.md may render this template, for the exact target path.
const autoContext = window\[CFG.autoCaptureContext];
if (autoContext?.targetPath !== tp.config.target\_file.path) {
new Notice("'\[T]step-end' is not runnable manually — it is created by \[T]phase.md only.");
return;
}

// Phase number comes from the note's final location: phases/NNN/steps/99-end.md
const phaseNumber = tp.config.target\_file.parent.parent.name;
-%>
---

ctime: <% tp.file.creation\_date(CFG.ctimeFormat) %>
status: ready
state: condensed
----------------

<% CFG.backlinkToPlanPrefix %><% phaseNumber %><% CFG.backlinkToPlanSuffix %>

## Description

Routinized finalization of the phase to have low cognitive load on mundane flows.

## Checklists

### Completion

- [ ] **Checking if phase is in `phases/_archived`, if not - ask user to move it**
- [ ] **Reflecting completion of the phase in the `_project.md`**

- [ ] **Make sure AGENTS.md (and other docs/) do not contradict new changes**&#x20;
- [ ] **There's no ideas in `ideas/*.md` left unchecked (discarded/extracted)**

### Post-completion

- [ ] **Reflecting on the phase**
  - [ ] Also - where routine was broken and where not. You should seek routine.
- [ ] **Making sure the information from the plan can safely die-off**
- [ ] **Making sure frontmatter is set properly**
- [ ] **Asking user to move the phase into /phases/archived/**
