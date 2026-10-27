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
//
// PLACEHOLDER STATUS:
// The body below is a simple placeholder. Replace it with real content; keep
// the structure aligned with the SSOT step template in PLANNING.md, but with a
// finalization flavor (meta-planning reflection, project index finalization,
// safe die-off verification).
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
isIntegrated: false
status: waiting
state: placeholder
reviewedAtStep: ""
------------------

<% CFG.backlinkToPlanPrefix %><% phaseNumber %><% CFG.backlinkToPlanSuffix %>

## Description

PLACEHOLDER — one paragraph in simple words: this step closes the phase safely and captures meta-planning lessons.

## High-Level

### Intended outcome

PLACEHOLDER — phase entry is finalized in `_project.md`, nothing important is left unintegrated, and the phase can safely die off.

### Local invariants

- PLACEHOLDER — invariants worth locking in for this step only.

### Should NOT be done in this step

- PLACEHOLDER — explicit non-goals to prevent scope creep.

## Discussion & Reflections

- PLACEHOLDER — key decisions/issues with options (quick / long-term / balanced).

## Implementation

### 01 - Reflecting on the phase

- [ ] PLACEHOLDER — meta-planning: what worked, what didn't, what caused friction.

### 02 - Finalizing the project index

- [ ] PLACEHOLDER — finalize the phase entry in `_project.md`.

### 03 - Verifying safe die-off

- [ ] PLACEHOLDER — make sure no important data is left unintegrated before the phase dies.

## Completion Flow

### Run #1

- Cleaning up "Decisions" block
  - USER must decide what goes into the plan/readmes or can be removed.
  - Remove the block
- Making sure frontmatter is set up properly
- STOP
