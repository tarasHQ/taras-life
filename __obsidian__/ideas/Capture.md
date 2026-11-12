# META

## NOT TO DO
- ###### ⛔Long Lists (Flat or Not) in Explorer %% fold %%
	- Explorer should contain only top-level things, because it's not suited to have like more than 50 entries. 
- ###### ⛔Long loading of pages %% fold %%
	- A lot of navigation is involved in these kind of websites. So pages should be light. 
	- Images probably should be loaded async + animation. 
- ###### ⛔Lots of 404s or "not implemented" pages %% fold %%
	- When I visiting such vault, it feels like the author doesn't care about my user experience of his website. 
- ###### ⛔Buggy on different scales/layouts %% fold %%
	- Some pages had table "getting out" from layout, other have awful reading experience on phones. Don't allow this on your website. Control and test.

## INSPIRATION
![[_attachments/Pasted image 20261029220112.png|215]]![[_attachments/Pasted image 20261029220348.png|336]]

![[_attachments/Pasted image 20261029215947.png|107]]![[_attachments/Pasted image 20261029184519.png|419]]
- ### Websites %% fold %%
	- https://oliverfalvai.com/Evergreen/Inspiring-gardens - collections
	- https://quartz.jzhao.xyz/showcase - collections
	- https://28mm.coffee/mostly-how-i-built-this-site
	- https://vaults.obsidian-community.com/ - collections. Checked all for quartz and publish. 
	- https://davidhurtado.ai/Home
	- [https://garden.sgenov.dev/](https://garden.sgenov.dev/How-Does-This-Blog-Work)
	- https://notes.dsebastien.net/50+Resources/55+Obsidian+Publish/README

## TIPS
- **Look at the website through the eyes of first-time visitor**
- **Make home page attractable (to be used in "digital gardens" collections)**

---
---

# UNPROCESSED

- ## UX
	- ###### [NOT SURE] Sticky headings %% fold %%
		- VSCode like. It's nice to see structure on top of the page with heading/-s current content is below.
		- But for longer pages it may be confusing. Or harder to implement. So not sure. 
		- For phones though?
		- Like it's easy to prototype but hard to do it properly. 
	- ##### Buttons
		- ###### Up/Down Floating Block %% fold %%
			- On bottom right. Scrolls up/down. Especially useful if you'll have that planned navigation on top of the page.
		- ###### Download .md or .pdf + copy .md + get link to page %% fold %%
			- Why not? Compact. If I want to debug something - easy. Download a page to put into LLM - good too. So yeah. Wouldn't hurt for sure. 
			- Location. Either top near title, or bottom. Check examples, see what fits it more. 
		- ###### [DISCARDED] Page on Github Link %% fold %%
			- Few reasons. One is that link must be to obsidian vault, not website. Which makes it much more complex (theoretically)
			- Another reason is that I'm not sure how to feel about theoretical PRs by others? Like it's not a collaborative project. I mean markdown notes. Website code may be used as template, but for notes... doesn't make sense. 
	- ###### [NOT SURE]Following Table of Contents %% fold %%
		- Experimental. May be distracting. 
		- Logic is that it's following Y coordinate of the cursor. To be like "near the mouse" to increase usability of it.
	- ###### [NOT SURE] Hide page load under fading animation %% fold %%
		- It may make website experience more smoother. But I have the feeling that it'll be hard to do properly.
			- Why? - if webpage loads instantly, animation will actually make navigation slower. But if page loads slowly, then what? you slowly fade out into nothingness, wait anyway, and then fade in after page loaded? 
			- So it's kinda not clear whether it'll make subjective smoothness of navigation better or worse.
		- I got this idea from some astro blogs, IIRC. There it was nice. Maybe I can find those and see how it's done in details?

- ## Pages & Contents
	- ##### Changelog %% fold %%
		- Paged (10-20 entries?) list of git commits to website? 
	- ##### Charts %% fold %%
		- Types
			- Weight loss
			- Subjective life progress
				* to remember that setbacks happen on upward tendency
				* to force into mindset "compare with yourself yesterday"
		* Logic
			* PIA. At best you have to make some transformer plugin that manually finds daily journals and parses it into SVG chart. 
			* Or you can use some lightweight charting library for minimal interactivity? 
	- ##### Created/Last updated/Commit %% fold %%
	  %% folded comment to check if it'll preserve it %%
		- **Description** %% fold %%
			- show created/last updated times to know how how old note and whether it's outdated
			- I would argue that it's worth to do at the obsidian stage. updated though would be a bit harder... 
		- **Opposition** %% fold %%
			- Drop both maybe? Or keep only last updated. That's what matters to make old notes more alive. 
		- ###### Git Sync %% fold %%
			- There was few websites with this. It was nice, where you can like see commit history on the note. The issue only is with the positioning. Like if you would need to restructure vault - then it may be PIA to preserve commits on the note. But maybe not. Just be aware of it.

- ## Plugins
	- ### Obsidian-quartz PRs %% fold %%
		- feat(compiler): publish assets linked from social image frontmatter properties
			- https://github.com/saberzero1/quartz-syncer/pull/150
		- feat: exclude private vault folders from publishing 
			- https://github.com/saberzero1/quartz-syncer/pull/147
		- feat: add optional Obsidian comment preservation 
			- https://github.com/saberzero1/quartz-syncer/pull/153
	- ### Quartz Plugins %% fold %%
		- https://github.com/tomoyanonymous/quartz-line-age - per-line git authoring. Can use it for example to have something much more minimalistic.
			- ![[_attachments/image.webp|310]]

---
---

# ARCHIVED

- ## LLMs
	- ###### LLMS.txt
	- ###### Ability to serve raw .md webpages
- 

---
---

# DISCARDED
- ###### Breadcrumbs %% fold %%
	- on top of notes, but the issue is that it may get broken without index folders. So navigation would be either through explorer or the page itself?
- 

---
---
