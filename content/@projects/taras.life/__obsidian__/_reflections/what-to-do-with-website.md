---
publish: true
created: 2026-11-06T08:25:32.797Z
modified: 2026-10-31T22:54:07.522Z
published: 2026-10-31T22:54:07.522Z
ctime: 2026-10-29 13:58
isIntegrated: false
---

###### Meta-reflection (On completion)

-

---

## Remember

- If reflection is successful - act upon it right away.
  - Use advantage of the brain filled with relative knowledge. It's easily compensates cognitive exhaustion.
- Highlight insights in the reflection.

---

## Problems & Goals

- Specify initial set of things to do. Like to make it actually usable.
- At least:
  - selective parsing of code blocks (buttons, journals block, not parsed dataview even maybe? etc.)
  - journals - plugin is good for YOU. But you must figure out how to make low-friction you + website solution
    - there must be some duplicated navigation going on, between notes, instead of current one
    - index pages for journaling

---

## Raw

- I don't know why I'm so down right now.
- These flows... where they lead me?
- I don't know what to do.
- Though reflecting like that is interesting.
- Why flows threw me into this tstate?
- What am I missing?
- It genuinely feels like a good thing. I need structure.
- Maybe it's because I'm kinda in limbo project-wise? LIke I don't know what to do. I have some things. But it feels like 5% out of 100.
- And also everything is slow as hell too.
- Fucking hell. What do I do?
- Timeframe.
- If 1 day no more has enough meaning.
- Can 1 hour have enough meaning?
- Just think about website. What you want to do? And do it.
- What's necessary
- What's not

---

- It's just I don't feel like it makes sense to do what I planned. All those index pages. Who the hell would read all that stuff?  You're alone in this
- Well, that's complex talking. You're alone, but it's a choice. You went into the hell and closed the doors from the inside.
- Is this the day when everything crumble?

---

- You don't know how to do website - inspiration. Take it. Find it. You have links Here's yours solution

---

# Brainstorming

- ### Attitude&#x20;
  - **Look at the website through the eyes of first-time visitor**
- ### TODO
  - **favicon/logo**&#x20;
    - - webp too?
  - **Hide README.md** from root of website, it's for github only.
  - **Fade In Out during loading** - may decrease visual comprehension of loading time
  - **Colorful headers**&#x20;
    - - synced with obsidian styles (manually or automatically)
  - **History of visited pages probably above the outline** - like when you move through lots of pages - it can be an issue to backtrack. and that list of recent pages might be helpful&#x20;
    - it can get a bit further with top portion of the note saving as "tabs", with ability to close
      - like it shouldn't be "real tabs", just links to visited pages, where you can switch between them.
- ### Do I need it?
  - **`pele` for mermaid diagrams** &#x20;
    - - faster, better, [nicer](https://pele.run/), though it was a ref link, so maybe not?)&#x20;
        - open in full screen?
  - **dim button**&#x20;
    - background gets black - everything else gets dimmed? read at night or maybe like secondary theme?
  - **Sticky headings**&#x20;
    - vscode like. I'm not sure they would be useful though. But maybe?
- ### Good
  - **I really liked idea of spoilers from nofap forum**&#x20;
    - - can I integrate it both into obsidian AND website?
  - **Download .md/pdf button**&#x20;
    - - and maybe a link to page on github repo? though it may be PIA to do
  - **Table of Contents**&#x20;
    - Follow mouse? Centered by mouse location? Could be convenient in theory.
  - **Scroll Up/Down/Home buttons**
  - **"Attractable" first page?**&#x20;
    - I don't know, some image maybe? Or graphics? Something.
  - **LLMs support**&#x20;
    - I'm not using it right now, but maybe later?
    - `llms.txt` - is it still a thing, there's probably other things like that too.
    - every note to have its own `.md` original for LLMs
  - **Doing Now (listening/doing)**&#x20;
    - - idea is to give some sort of connection between website and me. So it's not like "archive", but it shows what I'm doing. What I'm listening. Stuff like that. Like there's a real human behind all of that. It's kinda unique too.
    - Can connect ticktick schedule? &#x20;
      - cron trigger on worker + workers kv (1000 writes limit, so do it once per 5 minutes?)
        - then either endpoint OR generate "baked" static snippet and serve that (endpoint faster/easier?)
          - baked allows to avoid kv free tier limits (and probably kv completely), you just read, and then bake and serve. on next read - do it again.
    - Spotify? (seems like can be powered by lastfm)
    - That's a bit far reach, but you also can serve image of recording on per-minute basis towards this block. Safely.
      - You run python script through scheduler or whatever. it gets last recording, uses ffmpeg to extract last keyframe. shares it through smb. and server on proxmox copies it and serves.
        - cached TTL of 1-2 minutes. Webp optimization. You can use comments flow for making it more secure. and as result it's even more "connected". Because like people can see what you're listening, what is your schedule AND what you're actually doing in real-time. Without all the headache and issues of streaming. Website also gets additional minor reasons to visit.
      - even more - you may serve gif instead of webp. last hour? But that's may be too much. Timelapse detaches from that feeling I'm looking for in here.
  - **Domain navigation block at the top (breadcrumbs)**
  - **Journaling**&#x20;
    - Shouldn't be in explorer at all (ideally). Like there must be path to navigate in this through pages.
    - Home has a link to index. Note has a link to index. One page kinda covers all journals.
  - **Notes: Updated/Created**&#x20;
    - two dates.
    - **Git History On Notes** - show on hover. commit hash(link to repo too?), date and +/- lines, words.
      - AND/OR a link to gh commits history
  - #### Contents&#x20;
    - **Website decisions** - to be useful, you can list why something was added or removed.
    - **Obsidian decisions** - the same. Up-to-date descriptions
  - **Image Viewer**&#x20;
    - to like open in full screen, zoom, pan
  - **Styles**&#x20;
    - Links - underline only. Different styles for internal and external links.
- ### Bad
  - **Flat lists with lots of files and no idea what type it is**&#x20;
    - some reusable icons - reflection? note? canvas? base?
    - structure and order.
      - maybe you keep in explorer only top level? Beyond 1-2 levels - you use internal page/based navigation + indexes?
  - **Buggy on different zoom scales OR layouts (phone/tablet/tv)**&#x20;
    - Just to keep checking all of them.
    - font size on 100% should be whatever it's supposed to be (16px?)
  - **Limited max width**&#x20;
    - There was this guide. 30 words or something to be readable? DO NOT DO FULL WIDTH
  -
