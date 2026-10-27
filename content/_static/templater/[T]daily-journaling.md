<%\*
// === Dynamic path based on today's date ===
const year = tp.date.now("YYYY");
const month = tp.date.now("MMMM");
const fileName = tp.date.now("MMMM Do, YYYY"); // October 16th, 2026

const targetFolder = `@journal/${year}/${month}`;
const fullPath = `${targetFolder}/${fileName}`;

// Create the year/month folders if they don't exist
if (!app.vault.getAbstractFileByPath(targetFolder)) {
await app.vault.createFolder(targetFolder);
}

// Rename + move the new note
await tp.file.move(fullPath);
-%>

```meta-bind-button {fold}
style: primary
label: New Journal Entry
icon: notebook-pen
cssStyle: "background-color: #363124; font-size: 0.8rem;color: var(--text-normal);"
actions:
  - type: templaterCreateNote
    templateFile: "_static/templater/[T]daily-journaling.md"
    openNote: true
    openIfAlreadyExists: true
```

---

```meta-bind-button
label: Remove Morning Checklist
style: default
icon: trash-2
cssStyle: "height: 22px; min-height: 0; padding: 0 6px; font-size: 11px; line-height: 1; gap: 4px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-remove-checklist.js
```

- ##### MORNING CHECKLIST
  - [ ] Day scene
  - [ ] Check webcam (exposure)
  - [ ] Check IP cam (quality, delay)
    - [ ] Move to "day position"
  - [ ] Check all elements are present on the canvas
  - [ ] Check TickTick schedule
    - [ ] correct day, scheduled, scaled
    - [ ] red "now" line is there
  - [ ] Start stager timer
  - [ ] Fill Context block

```meta-bind-button
label: Remove Night Checklist
style: default
icon: trash-2
cssStyle: "height: 22px; min-height: 0; padding: 0 6px; font-size: 11px; line-height: 1; gap: 4px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-remove-checklist.js
```

- ##### NIGHT CHECKLIST
  - ###### AFTER NEW RECORDING
    - [ ] Check audio delay to webcam
    - [ ] Night scene
    - [ ] Check IP cam (quality, delay)
      - [ ] Move to "night position"
    - [ ] Check TickTick schedule (correct day, scheduled)
    - [ ] Set time of next sleep for stager timer.
  - ###### BEFORE SLEEP
    - [ ] Write overview of the current day
    - [ ] Create journal for the next day
    - [ ] Move uncompleted tasks
    - [ ] Make sure all day's reflections are linked under reflections
    - [ ] monitor OFF (seems like keeping on makes him die faster)

---

## OVERVIEW

---

> [!tldr] CONTEX
> Sleep Duration - **0:00**
>  
> Time Spent in Bed - **TODO**
>  
> Approx. Dreams Compensation - **TODO**

---

## TASKS

- ### TODO
  - \[ ]
- ### Priority
  - \[ ]
- ### Completed
  - [ ] copy\_from\_here
  - \[ ]

---

## REFLECTIONS

-

---

## TIME LOG

```meta-bind-button {fold}
label: New Log Entry
style: default
icon: clock
cssStyle: "height: 24px; padding: 5px; font-size 11px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-time-entry.js
```

---

## DREAM ANALYSIS

### Dream #1 - NAME

- #### Raw Dream
  - ##### Tips
    - `Ignore mistakes, formatting, structure, goal is to capture the raw fleeting dream without being distracted by all of it`
  -
- #### Location & Environment
  - ##### Tips
    - \`What you feel when you go/are there in real life?
    - `If it's unreachable/unknown - how would you feel being there in real life?`
    - `Is feeling positive/negative?`
    - `Why would dream use this location/environment and not other ones?`
  -
- #### Analyze figures, what they represent, why they're there? \*\*
  - ##### Tips
    - `Why that figure there, how situation would unfold without that figure?`
    - `Is it positive or negative figure, how you feel about them, which emotions comes up? `
    - `Can it be the Shadow, or the Anima?`
    - `Is it internal representation or external relationships?`
  -
- #### Emotional/Rememberable scenes
  - ##### Tips
    - `If there's particularly rememberable scenes - analyze why they're rememberable, what's their charge, what's so valuable in them, what they're hinting on? `
  -
- #### Direction/Tendency
  - ##### Tips
    - `How it starts and how it ends establishes the direction/tendency of the dream which gives another perspective on it.`
    - `Direction is overlapping with compensation, but you should focus on positive/negative property`
  - **First sentence is**
  - **Last sentence is**
  - **Direction of the dream is**,
- #### Final feelings
  - ##### Tips
    - `Aftertaste of the dream. Feeling about the dream as a whole.`
  -
- #### Hooks From the Past
  - ##### Tips
    - `Your ego was one-sided recently - where/when it might've been like that?`
    - `If dream is repeatable - then there's reoccuring tendency to behave in a certain manner - find it, look in the past for a pattern, not a one-off fluke`
  -
- #### Likely Compensation
  - ##### Tips
    - `Which type of compensation is present? Does it inspire you? Does it deflate over-inflated ego? or does it confronts wrong actions/attitude by showing dreams into opposite direction?`
    - `Keep remembering that it shows you blind spots, so the answer isn't what's obvious, because you already see it. You must approach compensation from unexpected angle. `
  -
