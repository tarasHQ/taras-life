```meta-bind-button
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

## OVERVIEW

Weird day. I did a lot, but feels slow and without progress. Although now proxmox is on the safe backup. SMB sharing setup properly. There's much better structure of obsidian-related directories.

I don't know how a month of such days would look like. Like will it be insanely productive, with changes that accumulate slowly, but are realized rapidly OR it's like a substitute for gaming and I'm wasting lots of time? I honestly don't know.

---

## TASKS

- [!] [better-schedule-plan](better-schedule-plan.md)
- [!] [quartz-website-plan](quartz-website-plan.md)
- ### Active
  - [ ] Youtube - wrong order of timestamps. You need to offset by one chapter
  - [ ] You need simple back/forward(automatic visibility if exists) navigation between journal entries.
  - [ ] You need a to select a block of text, press hotkey and save it as a reflection with link that replace selected text. (also it should have same frontmatter as current flow)
    - [ ] On top of it, current flow of templated reflections probably should force copy link into clipboard as well. These shouldn't be in the journaling, because they give constraints on the size.
      - or maybe you just use initial `_reflections` flow instead of limiting yourself within the journal entry?
  - [ ] \[IMPORTANT] when I updated junctions - obsidian updated ALL links in my project. Which means all links in all symlinked `__obsidian__/` folders will instantly get broken. So you can't use any markdown/wiki links in there to prevent massive headache in the future. give plain links inside `inline codeblock`
  - [ ] You hate it, but you must go through all of that llm generated mess on docs and extract/rewrite our agents.md as the main entry point for the LLM tasks.
    - [x] Imagine that you're not tired, and this is an act. The same with task, it's not complex, but perceived complex to achieve other means.
    - [x] ==Kinda worked, but it's hard to say whether I was ready to work without timer or thinking about the action of starting the timer made me work?==
- ### Completed
  - [x] Figure out a way to run a webcam config setup when day scene is activated, so you don't have to constantly deal with exposure/brightness resets.
  - [x] How to have SSOT on planning stuff? - `@meta` in obsidian + text links in `agents.md` of each project
  - [x] configured hotkey to switch deskflow without moving mouse back and forth
  - [x] keep social, it's huge. reflected on it + wrote readme
  - [x] figured out and locked symlinks/junctions flow - contents stay with projects
  - [x] set up git plugin autosync, so I don't have to do it manually or through vscode
  - [x] better obsidian layout on vertical monitor, so I can always keep left side panel.
  - [x] refactored grouped structure of top-level obsidian vault.
  - [x] lots of folders, use icons to reduce top-level cognitive load
  - [x] Start new structure. Phase 001. use the framework to establish the framework flow in the project. Symlink that folder into repo. Use obsidian and LFG
  - [x] optimizing backup sync job to avoid rehashing dozens of gigabytes every hour. And fixing some bugs.
  - [x] extract information for future proxmox upgrade.
  - [x] \[MAJOR] setting up proxmox backups on smb. [proxmox-backup-plan](proxmox-backup-plan.md)
  - [x] fixing deskflow portable "residue"
  - [x] Setting up proper and secure smb access to videos and pve backups folders
    - [x] figuring out sharing settings (to not use NTSF, but properly setup advanced sharing)
  - [x] move bluetooth usb dongle closer with usb extension
  - [x] Inverter has kinda low but a bit distracting voice of metal case resonating with fans. Make it quieter, but still it's there when my head position is very specific. Don't know how to fix it fully. Disassembled the whole thing. It's 100% tied to coolers, not the case.
    - [x] quieted down by itself. so I guess it's transient OR I'm getting used to it.
  - [x] Checking hdd drives, bringing them into the light, planning backups
  - [x] Fixed journaling script imprecise deletion
  - [x] Reflection on backups - figured out action
  - [x] Reduced friction of running everything up after PC boots by using `sizer` for stage timer, so it automatically sizes itself and places on correct spot through ctrl+win+z
  - [x] new layout for obs . preview is on separate window. better density.
  - [x] fixed OBS bad noise suppression settings

---

## REFLECTIONS

- ### 4 hours recording splits
  - Do I need 4 hours? Like script would do with 1 hour chunks with no problems. Even 30 minutes. I just need to check with LLMs to be sure I'm not missing something. None, to rewatch I use merged and sped up video, so it won't be an issue as well.
  - 60 minutes 24 files. if something gets corrupted - I lose an hour instead of 4. For free.
- ### Backups
  - The issue of previous day was because I wanted to backup whole proxmox containers. I don't have separate stable 24/7 source with like 50gb available (recording PC is not clear)
  - So either I do separate backups of valuable data, like comments database for remark42. OR I attach hdd drives and backup on them, though it'll take forever to upload like 30 gigs on them. Also noise. Also I'm a bit anxious about their health.
  - To this task is PIA. Yeah, have money for a nas a new drives would've been good... Ok, I need to connect old ones and see how it'll be noise wise and speed wise.
  - It's pretty quiet though. Not silent as it was, but it kinda on the same frequency as the invert so it's not distracting at all. But that way I get 10TB of storage
  - Let's see how fast it'll write 6gb - doable. Seems like 7tb one is a bit dying?
  - Hdd - I'll backup recordings too?
    - now, at 1440p, 20 minutes is 80mb. So that 240mb per hour, 5.5gb per day. Let's do 10, in case I'll increase quality further. 100 days would be 1TB. I have 10. Solved.
  - I'll use both drives as manual "raid 1". Because automatic one would be PIA to setup when I checked a 1-2 years ago. So like I can record a year, and then do timelapse on that one) 1 minute per day))
  - Should I backup temp files though? Or completed files? Like I can do both with no problems) That's good decision to bring those drives to life.
- ### Don't know what to do
  - #### You know what to do. Like tasks are there.
    - Clean up and refactor website's source project.
      - All the docs needs a proper structure and rewrite BY YOU.
      - Then you use that framework for further developing either for functionality or design.
    - Another thing to do is to add those navigation links to the journal.
      - And figure out those template tasks
    - Another thing to do is to read quartz/remark42 docs so you would know what is useful for you.
    - Also vacuuming today, missed. Either move or do.
  - #### So what's the issue then?
    - ==🟡maybe because I don't see the end of it? Like I can do this for a year. And I started to believe in it. That's why the unconscious compensated.==
    - Ok, I see it now. Like your hope lies at  the success of the project which isn't even touched because success of the project lies at the success of this publicity thing, which isn't really started, because I'm preparing stuff. Website is raw quartz basically.
      - So, just by writing I feel that meaning come back little by little. So the best I can do, is to set up proper structure on the website. Phase 001. Also I'll battle test my flow on smaller project that is less confusing.
      - after structure is done - you focus on layout/functionality. Style can always come later. Website must be usable and not "generic" looking.
      - With website you figure out flow on the vault.
      - When that shit is done - you're trying to go public to see if you can find any community around this.
      - if no? - then you know that you're alone in this. Though it seems like it's still helpful to make it public.
    - ==🟡That's it. I was needing the meaning instead of the structure. It's not perfect, but it'll do.&#x20;==
- ### Symlinks direction
  - #### target in obsidian, pointer in the project outside of the vault
    - can my project work with symlinks?
      - no by default, but 5 minutes to fix it. It's just creates another issues with thinking this through globally.
    - **CONS**
      - big one. it's just logical to have `__obsidian__/` within project's repo. Like if you'll get lucky and people will use this stuff, they don't have to like download `__obsidian__` from another repo, and place it in a current one.
  - #### target in the external project, obsidian has pointer
    - **CONS**
      - \~~link breaks -> project losses files (seems like they get pasted in obsidian BUT if moved in obsidian)
        - then don't move. today was one-off of major refactor
      - \~~obsidian has issues with symlinks
        - on theory, on practice you didn't have any besides today
      - public issues with git, it won't track symlink contents. (so you can't upload those within vault's repository)
        - \~~but that's if I need it. If I don't - it's not an issue

---

> [!tldr] CONTEX
> Sleep Duration - **5:24**
>  
> Time Spent in Bed - **Low**
>  
> Approx. Dreams Compensation - **Strong-ish elevation**
> Weirdly enough, previous day wasn't on the "low" side, especially last 4-5 hours that I spent on inverter. But still got like this "inspirational elevation"

---

## TIME LOG

```meta-bind-button
label: New Log Entry
style: default
icon: clock
cssStyle: "height: 24px; padding: 5px; font-size 11px;"
action:
  type: js
  file: _static/scripts/meta-bind/journal-time-entry.js
```

- ###### 23:47
  - ==🟡🫩You sleep 1 hour longer - you have 3-4 hours more productivity towards the night. That's the real math of how much you can work. having 18 hours in a day means shit if you're a damn vegetable for a quarter of it.==
- ###### 23:21
  - Nah, seems like I'm just messed up. Need to sleep more probably.
- ###### 22:41
  - Speed is meh... not low, but not high either
- ###### 22:01
  - this would be a good time for the second meal. But bread isn't ready yet. 1.7 hours left. This damn friction on some tasks. Like it's just paralyzing...
  - Timer? + Music? I'm not sure I have it in me.. ssdd
- ###### 21:44
  - Indulged a bit. Not on camera. Shameful. Not sure how to approach this. Stop recording or just privacy mode? Made me sad a bit. Also 5 hours of sleep pressing on me. Like it's more the number that is pressing than actual exhaustion.
  - I need to figure out some blur, so I can run recording when I'll watch movie or something, youtube probably won't like if I'll post recorded movies)
- ###### 21:24
  - I removed social category, but I must get it back. even if empty. This is big one. Like if I seek community - I must know how to act in it. That's exactly the category for reflections and plans about that.
- ###### 20:44
  - ==🟡☕COFFEE. Twice I managed to avoid mid-day crashing outs, and twice it was with coffee (or 3 times). Without butter, so it makes me a bit anxious/stressed that balances out with mid-day crash. You should try this on the next day, don't forget.==
- ###### 19:30
  - A bit drifting off. Need to get back on the point
- ###### 17:56
  - Discouragement is weaker, but still there. Damn hard to start when there's like no plan or structure... But is it? Cuz you had the same with that, and still it was hard to start.
- ###### 16:41
  - Yea, shit is not sustainable to push myself like that. Now I want a pizza and like carte blanche on my entertainment for like 30-60 minutes. If I had more money, maybe that wouldn't be so bad, but in this scenario... yeah...
  - yesterday though it was pretty nice. Like pizza made me too relaxed, but coffee woke me up and I had not bad day. fixed inverter too, which is like a really big thing for me. It's so quiet now, and that minor noise issue went away too...
  - It's just hard to say no, that's what is bothering me. Like I don't have that with my "normal" meals. And with pizza it's like yelling in my mind for hours. Distracting.
  - ==For sure I'll be discouraged after... I don't know what to do next. Don't have plan. Nothing is clear and structured. So yeah, after the meal there's descent into the abyss, which obviously I will avoid. But now I'm aware of it. Maybe it'll change something?==
  - ==🔴Huge breakthrough on recording though, 1440p at cqp of 33 turned out to be smaller than 1440p=>1080p downscale at cqp of 28 at the same time - quality is significantly better. HUGE win.== Kinda even interesting that the first day of recording was 35% bigger, with much worse quality. 2nd day was 2.2x bigger, quality still a bit worse. So yeah, that perfectionism with optimizing all details sometimes is very worthwhile.
- ###### 16:30
  - ==🟡Capacity to do things properly is a limited resource. After exhaustion you will accept suboptimal choices. Food is a one threat vector. Also seems like you can't work longer than 5-6 hours without some kind of a break to stay in high cognitive performance AND, crucially, also in high executive capacity.==
- ###### 15:27
  - Talked with dad for 10-15 minutes, energy levels get low. Need to recharge. Wouldn't mind another pizza... ==🟡so yeah, I have to eat on schedule, it's 6 hours after waking up. 5 hours should be good for the first meal==
  - Backups are done. Automated. Flexible. Efficient. So not only comments database, but the whole proxmox finally backed up to another PC. Ideally would be to do a cloud backup, but I just don't want to spend money of nice-to-haves. If there's fire and everything burns - those backups will be the least of my worries.
- ###### 14:49
  - Getting hungry. Probably that's how some impulsive food indulgence happens. I don't eat on plan, and then I'm too hungry to cook and limbic system just takes the steering.
- ###### 13:27
  - Doing good. I'm really curious about the sleep though. 5.5 hours is pushing it... But I just wake up at the time and that's it. Though 18-19 hours per day is kinda great. But it definitely doesn't justify that price of sleepiness waves.
- ###### 12:47
  - Have the state of mind to do things properly. That's good. Slow progress, but it established years-long practices that might save me insane amount of headache if I'll get unlucky.
- ###### 12:06
  - I'm a bit anxious out of nowhere. Coffee? Though it's a rare one when I have butter with it.
- ###### 11:17
  - One sad thing about this moment, is that if anything breaks and I won't be able to fix it myself - it's gone. I can't afford shit. And sure as hell I have too much "convenient things", it'll be painful to like live without them, instead of living not knowing I could have that convenience.
  - Security thing of the whole situation also not clear. I'm trying to be secure, but it's really vague field for me. So yeah... One bad email attachment and I'm done))
- ###### 10:10
  - Everything is good. Speed is there. Priorities though... But nah, I'm doing backups alongside with side-quests, so it's fine. I appreciate times like this. Also seems like idea to track all task I'm doing is contributing to this.
