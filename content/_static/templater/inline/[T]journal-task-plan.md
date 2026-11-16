<%\*
/\*\*

- Insert a plan link into an existing journal note.
- Create the plan beside that journal, then open it after insertion.
  \*/
  const { Notice, TFile, TFolder } = tp.obsidian;
  const journalFile = tp.config.target\_file;

// Prevent accidentally creating plans beside a new root-level note.
if (
!(journalFile instanceof TFile) ||
!journalFile.path.startsWith("Journal/")
) {
new Notice(
"Open a journal note, then use Templater: Open Insert Template modal.",
8000
);
return;
}

const rawName = await tp.system.prompt("Plan name");
if (rawName == null || !rawName.trim()) return;

// Keep the name usable as both a filename and a link target.
const planName = rawName
.trim()
.replace(/.md\$/i, "")
.replace(/\[\\/:\*?"<>|#^\[]\r\n]/g, "-")
.trim();

if (!planName || /^.+\$/.test(planName) || planName.endsWith(".")) {
new Notice("Please enter a valid plan name.");
return;
}

// Derive the location from the journal file, never the new-note setting.
const parentPath = journalFile.parent.path;
const plansPath = `${parentPath}/plans`;

const existingFolder = app.vault.getAbstractFileByPath(plansPath);

if (existingFolder && !(existingFolder instanceof TFolder)) {
new Notice(`Cannot create folder: a file already exists at ${plansPath}`);
return;
}

if (!existingFolder) {
await app.vault.createFolder(plansPath);
}

// Reuse an existing plan without overwriting its contents.
const planPath = `${plansPath}/${planName}.md`;
let planFile = app.vault.getAbstractFileByPath(planPath);

if (planFile && !(planFile instanceof TFile)) {
new Notice(`Cannot create plan: a folder already exists at ${planPath}`);
return;
}

if (!planFile) {
planFile = await app.vault.create(planPath, "");
}

// Use an explicit relative Markdown link, regardless of vault settings.
// Encode the filename so spaces and parentheses cannot break the link.
const relativeTarget = "./plans/" + encodeURIComponent(planFile.name)
.replace(/(/g, "%28")
.replace(/)/g, "%29");

tR += `[${planName}](${relativeTarget}) `;

// Wait until insertion finishes before changing the active tab.
tp.hooks.on\_all\_templates\_executed(async () => {
await app.workspace.getLeaf("tab").openFile(planFile);
});

// Open the plan in a new tab once the journal link has been inserted.
tp.hooks.on\_all\_templates\_executed(async () => {
await app.workspace.getLeaf("tab").openFile(planFile);
});

-%>
