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

```meta-bind-button {fold}
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
      - Add there to test before/after -2 or -3 CQP on video. OR 20fps (only +33%)
    - [ ] Move uncompleted tasks
    - [ ] Make sure all day's reflections are linked under reflections
    - [ ] monitor OFF (seems like keeping on makes him die faster)

---

## OVERVIEW

---

> [!tldr] CONTEX
> Sleep Duration - **6:00**
>  
> Time Spent in Bed - **Low**
>  
> Approx. Dreams Compensation - **Something about increasing masculine traits**

---

## TASKS

- ### TODO
  - [ ] **META** Figure out where to accumulate such secondary tasks and where you can prioritize them, because flat list is stupid and limiting.
  - [ ] Ideally to go away from the minimal theme. It does add a lot of things that I don't use, and basically a deadweight. Like it's better to have 30 styles in CSS than like 2 plugins with 100 settings + a theme .
  - [ ] \[kinda priority] flow to compress png into webp from screenshot, so it won't harm neither website nor size of the vault. But also figure out if deskflow can do it, because right now it's half-supported. (or don't do it through deskflow)
    - priority because it adds another dimension to thinking + cognitive offload.
  - [ ] dataview -> move to that default rendering pipeline, current one doesn't have flashes BUT it's blocking rendering of the note, which is not good either. (worse)
  - [ ] folder icons - rename to where they used and resize other icons (260kb per icon is stupid)
  - [ ] FIX - templated creation of next journal entry. 23:53 - "This day already exists"
  - [ ] Templates for reflections - maybe shouldn't use project backlinks for now, until I figure out if there's gonna be "main index"
  - [ ] AHK - run separate user of vscode as admin to be able to edit the script?
  - [ ] Bring back screenshots of desktop. BUT ALSO add analysis routine. (not sure if it's good for the night, but you need to do it after you woke up? Or like after the first meal. So it influences the current day on top of extracting patterns/insights)
  - [ ] You need simple back/forward(automatic visibility if exists) navigation between journal entries. (or use calendar plugin for the time being)
  - [ ] You need a to select a block of text, press hotkey and save it as a reflection with link that replace selected text. (also it should have same frontmatter as current flow)
    - [ ] On top of it, current flow of templated reflections probably should force copy link into clipboard as well. These shouldn't be in the journaling, because they give constraints on the size.
      - or maybe you just use initial `_reflections` flow instead of limiting yourself within the journal entry?
  - [ ] 🔴[[plans/better-schedule-plan|better-schedule-plan]]
    - Tick tick becomes PIA. Limited too. Maybe there's something else? Maybe there's self-hosted things?
  - [ ] Rewrite remark42 plugin. Properly. With the new workflow.
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

==🟡SCOPE. TODAY. NOW. NOTHING ELSE MATTERS==
==🟡SCOPE. TODAY. NOW. NOTHING ELSE MATTERS==
==🟡SCOPE. TODAY. NOW. NOTHING ELSE MATTERS==
==🟡SCOPE. TODAY. NOW. NOTHING ELSE MATTERS==

```meta-bind-button {fold}
label: New Log Entry
style: default
icon: clock
cssStyle: "height: 24px; padding: 5px; font-size 11px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-time-entry.js
```

- ###### 14:53
  - Kinda worked again. Weird. How? Why? But I got this documented twice now and twice it's successful. Alternative would be to start half-dead and hopefully get up to speed in an hour or two, so it's definitely worth it.
    - I just wait for impulse. Try to bring my mind to the ground, to here and now. To focus on task. And then impulse of meaning signifies that I'm ready to work (hopefully)
- ###### 14:39
  - Ok. I'm ready. It's weird to feel that "cost-perspective shift", but it's there. I imagine like the task at hand becomes my whole world and I get surrounded by that task only. Don't know if it's the way, but I try what I can try.
  - But I want to sleep so much it's insane. 15 minute nap.
- ###### 14:35
  - Ate. Vacuumed my place. Now I'm discouraged. Will that timeframe shift will help me to work?
  - Definitely feels like there's a place for some kind of meditation to detach from the future.
  - Wouldn't mind taking a nap though... 6 hours isn't enough
- ###### 13:11
  - Ok. That Peterson's idea about timeframe is definitely makes a lot of sense. I'm curious how it'll be after usual post-first-meal-crash, though I have some cleaning to do after...
- ###### 11:35
  - Yeah...
  - Ok. What caused it this time?
  - I got anxious. Doubt it's coffee.
  - Chances are that it's wasted time on things that hardly even secondary in the priority list. So. Back to the primary.
  - This branch of behaviour hopefully will stop as I'll have proper workflow and will reduce drifting off the task.
- ###### 10:39
  - Scroll in obsidian keeps bugging me and I'm definitely spending too much time on it...
    - Seems like it's the theme that's the issue here
- ###### 09:13
  - ==Ok, rewriting planning gets overwhelming a bit== because of those "branches" and their amount too. And I can't use workflow, because old one is kinda bad, and this task is creating a new one.
    - So I shouldn't jump into the whole thing. I have to figure out meta-plan, and process it in structured and bite-sized chunks. Because it's about preserving resource of executive capacity. I can tackle it raw, but then I'll fuck up the rest of my day, I guess.
- ###### 08:43
  - Making bread takes too much time and throws me of the peak of compensation. So I have to do it 2 hours before the bed. Right after the second meal? I wait usually till meat gets cooked, so I can pre-measure stuff.
  - By the way - schedule gets useful again. Those alerts to eat. Now preplanned stuff around meals. it's truly worth it.
- ###### 08:05
  - Woke up. Got a nice present from the Google with unexpected charge that had to be blocked and stopped. But it wasn't. So yeah... Had a little money left, and those are nearing zero now.

---

## DREAM ANALYSIS

Still to lazy to do the whole thing. But I want to track it. I need to track it.
Dream was a manhunt on me. Like literally man-hunt.
When I woke up - for some reason I decided to listen to "dark folk". These Nordic-Viking-like songs. It feels like the dream compensation was like "you know about those timeframes" - now you have to act on it. Because that's what men do. Act. Not think or reflect or feel. I'm talking on symbolical level though.

It seems like the dream hints me towards this trait of masculinity.
Very well those men in my dream might as well hunt me in my puer representation. Because result of that dream was me starting to hunt them. And when I woke up - I wanted to like say "why the hell I was running from the captivity?", like I had to attack the damn guy with a rock or something else heavy. And just kill him by beating into a pulp - even wording of this is like "manly-man-talk" of aggression and action. So that's aftertaste of autonomous compensation.

But conscious compensation would say something like - to hunt negative aspect of puer aeternus archetype, you have to embrace that masculinity honestly. Because if I force puer within a puer - it'll end up in self-victimization.

So it's like forcing puer to work, but in a mature way. Honest and humble. It feels crippling, but that attitude changes everything.

Also - I definitely need to have morning routine as short as possible. Wake up and straight to work seems like nice way to start a day.

**CAT** - it was the topic of the dream too. My attachment to her make her a huge burden. Nah. Wrong wording. My relationships with her makes her a huge burden. There's definitely some pathological projection of mother complex going on. Or something along those lines. So cat keeps me in puer. That's why I woke up seeking here, but when she came - it felt wrong. Like too much affection is goin on. It's hard to pinpoint, but it's real thing.
