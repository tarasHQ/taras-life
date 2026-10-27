<%\*
// ================================================================
// TEMPLATE: Execution Step Note Generator
//
// LLM RULE:
// DON'T USE <> TAGS in comments. It breaks further rendering of markdown in obsidian.
//
// WHAT THIS DOES:
// Creates a new execution step note inside a phase's "steps/" folder.
//
// SINGLE SOURCE OF TRUTH (SSOT):
// The step note content is NOT hardcoded here. It is extracted at runtime from
// PLANNING.md (project root) between two&#x20;
// markers (the same marker string is used as the opening AND closing boundary).
// The LLM flow reads the very same template from PLANNING.md directly, so both
// creation paths (manual Templater / LLM) can never drift apart.
//
// EXTRACTION PIPELINE (applied to the marker-delimited block):
// 1. Slice text between the 1st and 2nd occurrence of the extraction marker.
// 2. Strip the outer markdown code fence (`markdown ... `), if present.
// 3. Shed template-only comments:
//      - a line whose trimmed content starts with "//" → the whole line is dropped
//      - an inline " //" (space-delimited) → the line is truncated from that point
//    Blank lines left behind are NOT touched — the SSOT template must be kept clean.
// 4. Replace |PHASE\_NUMBER| with the selected phase number (e.g. 004) so the
//    "[← PLAN](../_plan_|PHASE_NUMBER|.md)" backlink points at the real plan note.
//    This placeholder name is also the contract for LLM-created steps.
//    All other fill-in markers (|TEXT|, |TASK\_NUMBER|, ...) stay untouched.
// 5. Output the result VERBATIM, including the SSOT frontmatter (status/state/reviewedAtStep).
//    This template adds nothing (no ctime, no isIntegrated) — SSOT is authoritative.
//
// HOW IT WORKS:
// 1. Prompts you to pick the Project and the Phase.
//    (No auto-mode: this template always needs project/phase context to locate
//    PLANNING.md. LLM-created steps bypass Templater entirely by design.)
// 2. Locates PLANNING.md (prefers the project root, falls back to vault-wide).
// 3. Runs the extraction pipeline; aborts deterministically if markers are missing.
// 4. Ensures the "steps/" folder exists in that phase.
// 5. Finds a safe unique name (untitled\_step, untitled\_step\_2, etc.).
// 6. Moves the file to phases/NNN/steps/ and triggers the inline title rename box.
// ================================================================

// ================================================================
// 0. CONFIG — the single place to adjust names / paths / prompts.
//    NOTE: Other templates have their own CFG block; if a SHARED value changes
//    (projectFileName, phasesDirName, stepsDirName, ...), update it there as well.
// ================================================================
const CFG = {
// --- Project & phase discovery -------------------------------------------
projectFileName: "\_project.md",
promptSelectProject: "Select Project:",
phasesDirName: "phases",
promptSelectPhase: "Select Phase:",

```
// --- SSOT extraction (PLANNING.md) ------------------------------------------
planningFileName: "PLANNING.md",
extractionMarker: "%%TEMPLATE-MARKER-FOR-EXTRACTION-START%%",
phasePlaceholder: "|PHASE_NUMBER|",   // replaced by the selected phase number
substitutePhasePlaceholder: true,     // set false to keep the placeholder verbatim

// --- Target folder ------------------------------------------------------------
stepsDirName: "steps",

// --- Default note naming (collision-safe: "..._2", "..._3", ...) ----------------
defaultNoteName: "untitled_step",
counterSeparator: "_",

// --- UX / environment --------------------------------------------------------------
titleEditCommand: "workspace:edit-file-title",
titleEditDelayMs: 200,
```

};

// ================================================================
// 1. Select Project (auto-select if only 1 project exists)
// ================================================================
const projectFiles = app.vault.getMarkdownFiles()
.filter(f => f.name === CFG.projectFileName);

if (projectFiles.length === 0) {
new Notice(`No '${CFG.projectFileName}' found in vault!`);
return;
}

let selectedProjectFile = projectFiles\[0];
if (projectFiles.length > 1) {
selectedProjectFile = await tp.system.suggester(
projectFiles.map(f => f.parent ? f.parent.path : f.path),
projectFiles,
false,
CFG.promptSelectProject
);
if (!selectedProjectFile) return; // User pressed Escape
}

const projectRoot = selectedProjectFile.parent ? selectedProjectFile.parent.path : "";
const phasesDirPath = projectRoot ? `${projectRoot}/${CFG.phasesDirName}` : CFG.phasesDirName;

// ================================================================
// 2. Select Phase (newest first, e.g. 004, 003, ...)
// ================================================================
const allFolders = app.vault.getAllLoadedFiles().filter(f => f.children);
const phaseFolders = allFolders
.filter(f => f.path.startsWith(phasesDirPath) && f.path !== phasesDirPath && f.parent && f.parent.path === phasesDirPath)
.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

if (phaseFolders.length === 0) {
new Notice(`No phases found under ${phasesDirPath}!`);
return;
}

const selectedPhase = await tp.system.suggester(
phaseFolders.map(f => f.name),
phaseFolders,
false,
CFG.promptSelectPhase
);
if (!selectedPhase) return;

// ================================================================
// 3. Locate PLANNING.md — prefer the project root, fall back vault-wide
// ================================================================
let planningFiles = app.vault.getMarkdownFiles()
.filter(f => f.name === CFG.planningFileName && f.parent && f.parent.path === projectRoot);

if (planningFiles.length === 0) {
planningFiles = app.vault.getMarkdownFiles()
.filter(f => f.name === CFG.planningFileName);

```
if (planningFiles.length === 1) {
    planningFiles = [planningFiles[0]];
} else if (planningFiles.length > 1) {
    const picked = await tp.system.suggester(
        planningFiles.map(f => f.parent ? f.parent.path : f.path),
        planningFiles,
        false,
        `Multiple '${CFG.planningFileName}' found — select the one for this project:`
    );
    if (!picked) return;
    planningFiles = [picked];
}
```

}

if (planningFiles.length === 0) {
new Notice(`No '${CFG.planningFileName}' found in project root '${projectRoot}'!`);
return;
}

const planningContent = await app.vault.read(planningFiles\[0]);

// ================================================================
// 4. Extraction pipeline — see header comment for step-by-step description
// ================================================================
const firstMarker = planningContent.indexOf(CFG.extractionMarker);
if (firstMarker === -1) {
new Notice(`Extraction marker not found in ${CFG.planningFileName}! Aborted.`);
return;
}
const secondMarker = planningContent.indexOf(CFG.extractionMarker, firstMarker + CFG.extractionMarker.length);
if (secondMarker === -1) {
new Notice(`Only ONE extraction marker found in ${CFG.planningFileName} — a closing marker is required! Aborted.`);
return;
}

let extracted = planningContent.slice(firstMarker + CFG.extractionMarker.length, secondMarker);

// 4.2 Strip the outer markdown code fence, if present
extracted = extracted
.replace(/^\s\*`[a-zA-Z0-9]*[ \t]*\r?\n/, "")
    .replace(/[ \t]*`\s\*\$/, "");

// 4.3 Shed template-only comments ("//" rules described in the header comment)
extracted = extracted.split(/\r?\n/)
.map(line => {
if (line.trim().startsWith("//")) return null; // whole-line comment → drop line
const inlineIdx = line.indexOf(" //");          // inline comment → truncate from " //"
return inlineIdx === -1 ? line : line.slice(0, inlineIdx).trimEnd();
})
.filter(line => line !== null)
.join("\n");

// 4.4 Substitute the phase number placeholder (SSOT contract, also used by the LLM flow)
if (CFG.substitutePhasePlaceholder) {
extracted = extracted.split(CFG.phasePlaceholder).join(selectedPhase.name);
}

const stepNote = extracted;

// ================================================================
// 5. Ensure target 'steps' folder exists
// ================================================================
const stepsPath = `${selectedPhase.path}/${CFG.stepsDirName}`;
if (!app.vault.getAbstractFileByPath(stepsPath)) {
await app.vault.createFolder(stepsPath);
}

// ================================================================
// 6. Collision-safe default name (e.g. untitled\_step, untitled\_step\_2)
// ================================================================
let finalName = CFG.defaultNoteName;
let counter = 1;
while (app.vault.getAbstractFileByPath(`${stepsPath}/${finalName}.md`)) {
counter++;
finalName = `${CFG.defaultNoteName}${CFG.counterSeparator}${counter}`;
}

// ================================================================
// 7. Move file into place, then focus the title for editing
// ================================================================
await tp.file.move(`${stepsPath}/${finalName}`);

setTimeout(() => {
app.commands.executeCommandById(CFG.titleEditCommand);
}, CFG.titleEditDelayMs);
-%>
<% stepNote %>
