---
publish: true
created: 2026-10-22T08:13:49.601Z
modified: 2026-10-18T21:17:02.989Z
published: 2026-10-18T21:17:02.989Z
isIntegrated: true
---

## ABSTRACT

- ### Journaling
  - ==\[EXTRACT] Templates won't be necessary. They're burden. If you do manual day-by-day copy - you can easily improve and update them, instead of keeping source of truth in multiple places==
- ### Reflections
- ### Website

# ToDo Tomorrow

- ## ==EXTRACT== Inverter
  - Very noisy with connected second PC. Do the thing. Bypass of old bypass with buck dc-dc converter + DIODE. Shouldn't be that hard to do if it'll work as intended. Think about adding diode on the stock cooling logic (+), seems like it doesn't need one, but maybe it does... though where to place it then? Research.
  - It's just a major PIA to preserver stock cooling logic. Take dc dc buck converter. Use that 12V rail. And connect fans directly.
  - Desolder stock cables, + and - into heat shrink. So it'll be easy to revert.
  - On another hand there's high chance it's dc dc buck converter. Which means there'll be no PWM at fans input, and you can do your idea with separate supply + diodes to handle "no active cooling" scenario of default inverter logic, that will be powered through separate supply. And when default inverter logic kicks in - diodes will cut off that converter, so it won't interfere
- ## Obsidian publish
  - Figure out structure of the website
    - single-folder reflections probably
    - Current separation of the plan feels weak and premature, I don't have that much things to have categories for them. Simple flat structure will be easier now.
    - So that will be some kind of dashboard/homepage
    - With navigation into further topics either through sidebar OR links inside notes.
  - Styles
    - Colorful headers are helpful, reduce cognitive load
    - Reading mode has padding issues. So you might want to check them out too
  - Other
    - Don't revisit frontmatter ideas. Manual listing will be enough for the foreseeable future.
  - Private/Public
    - Should the project go public? I doubt it. Too much depends on it, I can't risk it. Maybe later, but definitely not today.
- ## Reflections, Plans, The Project.
  - Kinda touched on this in previous topic, but I would suggest to think about it more.
  - Like where reflections should be, usual `_reflections` folder or something else?
- ## Recordings
  - Workflow. Streamline.
    - For the first day or first days you may just take it easy. No you may not because you already have split recording set. So 15-20 minutes on finalization should be addressed today
    - Give yourself a few hours towards the evening to figure out proper script.
  - Youtube
    - Pick the account. Safe one. With 2fa.
    - Ignore thumbnail. Don't overthink this.
    - Name though - it's worth to think about.
    - Protected vs public? - public. Right away.

## SSOT

- Single source of truth on everything I wrote
- Long-term goal
- Extract journaling entries and reflections from nofap and into the obsidian. You'll review them and at the same time will establish SSOT, so further exploration of old ideas/reflections will be limited to the obsidian, instead of like looking in 3 different places

## About

- **WHYs**
  - Those, I mentioned in recent two reflections
  - You watch yourself, a fat, unattractive guy in an unattractive room, almost always quiet, just sitting in front of pc for like 90% of the time - but it allows you to connect that image with your inner perspective. Like there's a whole world in that guy, that is not perceived by the camera. It definitely adds more empathy towards myself and other people. Because it's insane how big is the difference.
- **Expectations**
  - Initial period of novelty, fear and excitement.
  - After it won't be emotionally charged anymore - that's when the usefulness of the experiment will be tested.
- **Rules**
  - No persona. No victim. No overdramatization.
  - Don't dress up.
  - Don't think about how to write in obsidian's which is being recorded.
  - Try to act as if the camera isn't there. Or as if no one will watch it (considering there's pretty high chance of that after initial curiosity of a few people)
  - You do you.
- **Cat's illness**
  - Can't do anything but wait...
- **How I record my life**
  - OBS. Tell about speed up and recording at 10fps, so 0.33x speed would be real time.

## Before sleep workflow

- Stop recording and instantly start new one
- **Figure out**
  - Preparation flow.
  - You need to combine multiple files, avoid unnecessary writings (preserve ssd resource)
  - Also you need to speed up files. Don't forget about +faststart flag for `ffmpeg` (for youtube)
  - check older conversation with grok. Use multithreading. Use ramdisk.
  - process all splits in parallel (especially audio), then merge them into a one file
- Next step would be youtube upload + journal entry
- **Figure out**
  - when to upload? (before sleep or after?)
  - new structure of journal
  - `Obsidian publish` changes
  - Website is the whole new project.
