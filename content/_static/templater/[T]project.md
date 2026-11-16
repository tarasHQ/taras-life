<%\*
// ============================================================================
// TEMPLATE \[T]project — Master entry point for the project planning workflow
//
// LLM RULE:
// DON'T USE <> TAGS in comments. It breaks further rendering of markdown in obsidian.
//
// WHAT THIS DOES:
// Single trigger for all project templates. Shows a suggester built from the
// configurable list below, then includes the chosen template into the current
// note — the chosen template executes as if it had been inserted directly.
//
// WHY THIS EXISTS:
// All project templates live together in ONE folder (templatesRoot below)
// instead of Templater's configured folder. This master is the only file that
// must stay inside Templater's configured folder.
//
// CONFIGURATION (single place for the whole workflow):
// - templatesRoot: where the project templates live.
// - templates: the ONLY templates offered to run here. Hard-guarded content
//   templates (\[T]step-start, \[T]step-end) are intentionally NOT listed —
//   they are invoked programmatically by \[T]phase.
//
// HOW CHILD TEMPLATES RESOLVE EACH OTHER:
// The root path is passed down through window.\_\_projectTemplatesRoot, so
// children never depend on Templater's configured folders. A child run
// standalone self-locates via its own file path instead.
// ============================================================================

// ============================================================================
// 0. CONFIG — the single place to adjust the templates root and the run list.
// ============================================================================
const CFG = {
// Root folder that holds all project templates.
templatesRoot: "@system/projects/\_templater",

```
// Configurable run list: display label → template file name inside templatesRoot.
// Add/remove entries to control what is manually triggerable.
templates: {
    "Phase — create new phase": "[T]phase",
    "Plan — phase plan note (manual mode)": "[T]plan",
    "Idea — quick idea capture": "[T]ideas",
},
```

};

// Expose the root to child templates before including them.
window.\_\_projectTemplatesRoot = CFG.templatesRoot;

// 1. Build the suggestion list from the configured run list.
const entries = Object.entries(CFG.templates);
if (entries.length === 0) {
new Notice("No templates configured in \[T]project.");
return;
}

// 2. Let the user pick which template to run.
const picked = await tp.system.suggester(
entries.map((\[label]) => label),
entries.map((\[, name]) => name),
false,
"Select project template to run:"
);
if (!picked) return; // User pressed Escape

// 3. Resolve the chosen template inside templatesRoot.
const templatePath = `${CFG.templatesRoot}/${picked}.md`;
const templateFile = app.vault.getAbstractFileByPath(templatePath);
if (!templateFile) {
new Notice(`Template not found: ${templatePath}`);
return;
}

// 4. Include it — the chosen template executes within the current note.
// tp.file.include RETURNS the rendered content of the child template; that
// value must be emitted as this template's output. If it is discarded, the
// master template's total output is empty and Templater overwrites the target
// note (the phase plan) with 0 bytes at the end of the run.
const included = await tp.file.include(templateFile);
-%><% included %>
