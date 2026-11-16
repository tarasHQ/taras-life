---
ctime: 2026-11-14 23:48
isIntegrated: false
---

%%[[_static/templater/[T]reflections|Link To Template]]%%

###### Meta-reflection (On completion)
%%Awareness to avoid repeating friction or to improve what works%%
%%issues/friction/inconvenience. Also sometimes I reflect on high cost-low reward topic/issue. I need to be aware of those.%%
- 
---
## Remember
- If reflection is successful - act upon it right away. 
	- Use advantage of the brain filled with relative knowledge. It's easily compensates cognitive exhaustion.
- Highlight insights in the reflection. 

---

## Problems & Goals
%% To prevent drift from the initial target and ending the reflection without answering on what it was about%%
- Seems like structure of the vault/website + navigation is the next thing that needs to be done. So I'll focus on it. 
- Issues?
- Index pages. Where they're needed and where not? Should I use dataview or have some custom emitter or something for the website?
- Explorer. Rewrite. Yay or nay? 
	- To support custom features and go away from some frustrating bugs
- Top level structure. What is shown in explorer vs what's accessible through in-page navigation?
- in-page navigation. How? Worth it?
- Homepage. 
	- First bad draft. Probably can/should be thought through separately

---

## Raw
%%Free-form reflection with no rules%% 
- Ok. So, main point is the structure. 
- **Do I need to use index pages?**
	- Yes. Because I have reflections, journaling, deeply nested folders (e.g. projects).
	- Index pages would allow to unfold all of that on single page.
- Now, the issue is about journaling - how to unfold it. Imagine 100 entries. It'll be pretty long list. Having custom calendar on sidebar would be interesting The issue with the mobile though. What issue? like if you do explorer or index page - it'll be the same logic, where you have to open side menu and choose a date. Or go back to index page. Having calendar, on another hand. Like it's not for the current phase, but it establishes structure for journaling. 
- ⭐**CALENDAR** (for the next phases)
	- sidebar on pc(widget), top bar on mobile (button + modal with the same widget)
	- But how to figure out all types of intervals. Daily can be on dates, weekly can be on side row with weeks numbers, monthly on month name and quarterly? well, month can have Q1 near it + year. So everything will be accessible. 
		- I'm not sure I'll do all of those but it's better to be prepared and stay flexible
- So calendar completely covers navigation for journaling. It's convenient in obsidian, and so it'll be on the website too.
- Else? 
- ⭐**Bookmarks widget**
	- Separate idea. But kinda like calendar. Can be on the right or left. Saves to local storage. Why not? Like if you want to have project bookmarked. The only issue though is links getting broken if I change something. So yeah... But it's worth to extract to archive of ideas and implement later. 
- **Index Pages**
	- This stiff must be parsed automatically. For example, you have `_static` folder. Inside of it you create `index.md` or `_index.md` which will cover the structure of the folder. And dataview queries will dynamically list contents. 
	- Should it replace readme.md? Maybe. It'll be overlapping a bit. 
	- ok, let's take another example. You have system folder. it has like 4 subfolders. well, projects subfolder is big one. Schedule - single file. So, structure is combined. In this case I can also add projects folder for example. 
		- Idea is that index.md for projects will contain list of projects + description + links to `_project.md` files. Which then contain navigation inside the project. 
	- The idea is that whether you like need folders without no index.md. Even more. Whether you need explorer at all. Like home page can contain links to all "modules"
	- Nah, you need explorer. On phones especially. 
	- But what if you have "home" button instead? 
	- Without explorer the issue is that you'll have massive space on the left. 
	- Ok, what other issues I listed. Well, not much. So yeah, I kinda doing something interesting. It's just uncomfortable in big vault to have explorer. 
	- Look. temptations/projects/static/and so on. All have index.md as entry point. Explorable structure of the website is top-level only. That's set. So you have homepage as top-level file. That contains well, homepage. 
	- ⭐Oh, new idea for another module. History or biography or something where you can write down your past. Name doesn't matter. Past AND present maybe? Or I would say future too. Like SSOT on your current situation. with context and highest level visions/plans. can be beneficial. Potentially
	- Ok. So. here's the deal. index.md in each submodule. journaling gets calendar. 
	- Explorer.  That's an issue. 
		- like it quickly becomes redundant. It can list homepage + submodules links. Minimalistic. Top level only. Takes some space so other elements won't be like out of their place. So how many lines? 13-15. Nice. 
	- ⭐`_index.md` automatically recognized, if folder contains it - folder in explorer becomes file-like link to this file. Which then will take navigation through in-page elements. I'll develop later. Not important for now. If flde
- ⭐**Explorer**
	- The issue is that it is buggy out of the box. Like it might be easier to clone source code and just heavily modify for my scenario.
	- Remove all junk. Don't make it open on full page. Half of it is enough with some BG blur. No bottom dvh covers for ios safari. button should be on the right probably. You planned to have up/down. in-between you have explorer button (on phones only, obviously).
	- simpler parsing logic. simpler styles. Like I really would like to rewrite it from scratch. There's a lot of configurability in it that I don't need and that will create headache in maintaining. 
	- Like parsing is simple as hell. list `/_index.md` and `/folder-name/_index.md` that is all. I would even go further to have some compatibility with obsidian.  Main file can be `_index.md` but for submodules - I would parse second level files starting with `_`, so instead of having a bunch of index files -  I can have easily searchable files in obsidian like `/Temptations/_temptations.md` also when tab is open - I can see what it is. 
	- Wait about projects. It's a submodule within a submodule. How to deal with it?  I mean projects within @system folder. . Projects as real projects - would have index that will... well... Like it won't hurt to list in explorer maybe those as well? 
	- Like if the folder is too big - it gets its own underscore file. The issue though is that it may increase explorer size. Like it's 15 now. Then you add one more under systems - 16. Then you add 2 more under real projects. 18. Now - learning system will come some time soon. Temptations. Psychoanalysis. That stuff will grow as mad. So like in a few months you'll be at 30. Which means you won't really be able to have have it nicely inside an explorer. As non foldable list. So if you see that far - you might as well prepare for it. 
	- Vault will grow
		- Wait about projects. It's a submodule within a submodule. How to deal with it?  I mean projects within @system folder. . Projects as real projects - would have index that will... well... Like it won't hurt to list in explorer maybe those as well? 
		- Like if the folder is too big - it gets its own underscore file. The issue though is that it may increase explorer size. Like it's 15 now. Then you add one more under systems - 16. Then you add 2 more under real projects. 18. Now - learning system will come some time soon. Temptations. Psychoanalysis. That stuff will grow as mad. So like in a few months you'll be at 30. Which means you won't really be able to have have it nicely inside an explorer. As non foldable list. So if you see that far - you might as well prepare for it. 
		- ⭐So what would you suggest? Hm. Well, collapsible list. Top row will have toolbar to collapse all/unfold all. maybe one/two more for some explorer settings. And that's it. 
			- Key idea is to route all files through on-page dataview queries or something, so explorer won't have like 500 files, it'll be unusable with that amount. 15-30 entries - is perfect. 
		- ⭐if you'll rewrite current explorer - remove explorer "heading" that folds it. It doesn't make any sense. Explorer meant to be always visible. 
- So, is that is it? Structure stays kinda the same + I'll have to create a few underscore files for each submodule. 
- Well, since I'm walking might as well think about in-file navigation. 
- **In-page navigation**
	- here's the thing. Do I need this in obsidian? I would say no. Like it'll be PIA to do. Though I won't say it's impossible, but no. 
	- So, this thing would be website only.
	- Ok, recently opened pages can play bigger role here. 
	- But here's the thing I see. Top of the page navigational block. You established pages with underscore to be entry points. So, it means that every file should have a page with underscore. as parent. For example. `Temptations/_reflections/test-reflection.md` - will have automatic backlink to `../_temptations.md` Now. Question whether it should be automatic OR done by the widget or something.
	- Like some of those will have that backlink for pure ease of use inside obsidian. Then. It'll be duplicated You can create custom html + js code through dataview that will open parent folder, seek for the underscore parent and place back button. with id, so it can be styled on the website as well. 
	- But here's edge case.
	- `@system/projects/shared/flows/flow.md` while shared folder won't have index. Well, it's easily covered by looking one folder above. Like it's not an issue at all. You just go up until you find underscore file. 
	- You can have up to 3 buttons. 
		- excluding on homepage index. 
		- so 1st level indexes can have back to home. 2nd level - back to home or back to 1st level. And third level is the same. 
		- 3rd level will cover... or not. No. projects are `/projects/taras.life/__obsidian__/_project.md` which means that projects have subprojects, and it's actually 4 levels deep to `_project.md`, and it shouldn't go further into phases for `_plan_xxx.md` it'll be covered by the project.md.
		- so, you would have homepage at `_index.md`, then `_projects.md` then `_taras.life.md` then `_project.md` That's what I'm talking about. Potentially will be even more
		- ⭐But we need exclusions here, so I can avoid processing phases. 
		- ⭐I would lock in 2 buttons. Back up one level or go to home. Pages will load fast, most of them will be cached. So it'll be fine on both phones and PCs. Styling would be an issue though, but I'll figure something out. 
			- Either look for inspiration/examples OR copy like windows explorer. 
- ⭐`_static`
	- maybe for scripts and other files it'll parse description from top-level comment and/or frontmatter? Because in case of static (and maybe some other files) - it'll be pretty tedious to write all scripts manually into index.md. And dataview flat list will be suboptimal as well, because who knows what each script/template does. Brief description for each one would be helpful. And automatic parsing from frontmatter or top-comment will make it automatic.
- ⭐**Recently opened**
	- Another widget idea. Can be under explorer on both pc and mobile. 
	- OR can be done somewhere at the top of the page as tabs.
	- Like another powerful navigation tool to not get lost. 
	- Saved into local storage? Last 20 pages? 

## PLAN LOW LEVEL TOO
Puer wants to stop when he's high. Bring him to the ground. 
- Do I think that I was grounded enough? Yes. Some ideas are long-term, and I don't care about details. For the code - it's with LLM. But for thinking through edge cases and branches of design - I did a good job. I hope. So tomorrow I'll wake up - extract ideas - create a phase and start working. It'll basically will be mainly explorer rewrite. Seems like on-page navigation through `dataviewjs` script will allow me to automate this feature without writing parsing/emitting/etc. plugins for quartz, which will be more time consuming and error-prone. 