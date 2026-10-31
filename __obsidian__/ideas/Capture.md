
## Meta-reflection about the format
- Don't use strict order of headers. one-level features get h6, while 3 level features get h3. (+you have additional level of depth through **bold text headings**)

## Inspiration
![[_attachments/Pasted image 20261029220112.png|215]]![[_attachments/Pasted image 20261029220348.png|336]]

![[_attachments/Pasted image 20261029215947.png|107]]![[_attachments/Pasted image 20261029184519.png|419]]
- ### Websites
	- https://oliverfalvai.com/Evergreen/Inspiring-gardens - collections
	- https://quartz.jzhao.xyz/showcase - collections
	- https://28mm.coffee/mostly-how-i-built-this-site
	- https://vaults.obsidian-community.com/ - collections. Checked all for quartz and publish. 
	- https://davidhurtado.ai/Home
	- [https://garden.sgenov.dev/](https://garden.sgenov.dev/How-Does-This-Blog-Work)
	- https://notes.dsebastien.net/50+Resources/55+Obsidian+Publish/README

## To NOT Do
- ###### ⛔Long Lists (Flat or Not) in Explorer
	- Explorer should contain only top-level things, because it's not suited to have like more than 50 entries. 
- ###### ⛔Long loading of pages
	- A lot of navigation is involved in these kind of websites. So pages should be light. 
	- Images probably should be loaded async + animation. 
- ###### ⛔Lots of 404s or "not implemented" pages
	- When I visiting such vault, it feels like the author doesn't care about my user experience of his website. 
- ###### ⛔Buggy on different scales/layouts
	- Some pages had table "getting out" from layout, other have awful reading experience on phones. Don't allow this on your website. Control and test.
## General / Meta
- **Look at the website through the eyes of first-time visitor**
- **Make home page attractable (to be used in "digital gardens" collections)**
- 

--- 

## Comments
- ###### Match website style
- ###### Anon Login %% fold %%
	- To make it NOT less secure - you would have to read docs and do some additional work around this.
	- But it's definitely worth it if those comments is what will give you fuel and meaning to go on. 
- ##### Notifications
	- ###### Telegram channel %% fold %%
		- Comment comes in - bot writes it there. You notified. If people want to like follow social activity on the website (if there will be any), then they can subscribe to that telegram channel as well. 
	- ###### TG Bot %% fold %%
		- For channel AND user notifications (if latter is possible)
	- ###### Email %% fold %%
		- That's a bit more complex. Having email subscription for replies could be huge. Much more easier to use than telegram. Statistically. 
		- But there's a lot of issues about WHO sends those emails, how to not get flagged as spam, how to store those securely, so even admins can't read them through website or something. 
- ###### Oauth %% fold %%
	- Add all other ones. Including Yandex (should work theoretically). 
- Read plugin's readme for more. (with some overlap)
---

## Other
- ###### `README.md` %% fold %%
	- What should be there? That's the question. You placed life-thing/reasoning on this. 
	- But what if it should send on SSOT page on website. And readme itself should contain technical github-related notes? 
	- For quartz - how to install and run. 
		- And how to set it up. 
	- For obsidian - the same probably, but it's just kinda plug-n-play though. 

---

## DEV
- ###### Private config properties %% fold %%
	- Make your remark42 config url private. It's not a secret to see the address, and it's protected(rejected) but to just not confuse people? Though it may be PIA. Cuz you theoretically need to configure variables in github AND cloudflare. So it's like 2-3 sources of truth. On another hand, do you need those locally, since localhost origin banned as well, and also on github, since you just build to test/check that it builds. 
		- it's just unclear. If I will build locally and worker will only run it - then it's easier, I guess? I don't know. 

## Refactor
- ###### SCSS - Remove it %% fold %%
	- I didn't really understood any good reason to use it
- ###### Theming Logic %% fold %%
	- Discuss its use, because it seems to me it's just redundant code since I'm not like want to use themes neither now nor later
- ###### Remove CLI entirely %% fold %%
	- `bootstrap-cli.mjs` + `quartz/cli/*` → thin `scripts/build.mjs` (esbuild transpile + run `build.ts`)
	- Kills: `create`/`upgrade`/`restore`/`sync`/`plugin *` commands, `cli/templates/*.yaml`, `plugin-git-handlers.js`, `plugin-data.js`
	- Kills deps: `yargs`, `@clack/prompts`, `serve-handler`, `ws`, `ansi-truncate`, maybe `isomorphic-git`/`@napi-rs/simple-git` (check git-date source first)
	- OPEN: keep `--serve` (port ~100 lines to `scripts/serve.mjs`) or drop preview entirely?
- ###### Remove 30 unused i18n locales %% fold %%
	- Keep `en-US` + `definition.ts` only; external plugins don't import `quartz/i18n` (verified)
- ###### Remove verified-dead code files %% fold %%
	- `quartz/util/emoji.ts` (og-image bundles its own emoji util)
	- `quartz/components/PageList.tsx` (no importer; recent-notes has its own)
	- `quartz/components/frames/FullWidthFrame.tsx` (only `minimal` + `default` used)
- ###### Remove dead npm deps %% fold %%
	- `@quartz-community/recent-notes` (disabled in config)
	- `@quartz-themes/core` + `@quartz-themes/default` (disabled)
- ###### Remove `emojimap.json` (15 MB) %% fold %%
	- ⚠️ `og-image` bundled code reads it by filesystem path — move file, build, verify OG images before deleting
- ###### Config pruning (mermaid & co) %% fold %%
	- `mermaid: false` for now (content has zero mermaid; toggle injects inline script + styles on EVERY page). Reversible — I plan to use mermaid later
	- Same check: `enableYouTubeEmbed`, `enableVideoEmbed` if never embed
- ###### Optional: drop workerpool %% fold %%
	- `workerpool` + `bootstrap-worker.mjs` + worker transpile = parallelism overhead for a tiny content folder; parse inline instead
- ###### Optional: drop `--watch`/serve deps %% fold %%
	- `chokidar` used by both CLI watch and `build.ts` incremental watcher — only removable if watch mode is abandoned too
- ###### Decisions persistence system (README.md per submodule) %% fold %%
	- Every logical module keeps a local `README.md` with design rationale, quirks, "why removed X but not Y"
	- So external users of the repo don't have to guess
	- Already an AGENTS.md convention (§02.1) — audit existing modules, create missing ones
- ###### Remove unused/redundant styles %% fold %%
	- After SCSS→CSS migration: audit base/callouts/popover for styles of removed plugins (e.g. things tied to dropped features)
- ###### Google Fonts code removal %% fold %%
	- Font-loading logic in `componentResources.ts` (theme typography → generated CSS path) dies together with theming generation
	- `fontOrigin: local`, `cdnCaching: false` config keys become meaningless — prune
	- Keep `quartz/static/fonts/` woff2 files (self-hosted is correct); optionally prune Source Sans Pro if no Cyrillic content
- ###### Theming generation removal %% fold %%
	- `cfg.colors` → generated theme CSS in `componentResources.ts` → Sass maps in `variables.scss`: break the chain
	- Hardcode palette as CSS custom properties; keep dark/light toggle from `@quartz-community/darkmode` working
	- Prune `theme:` block from `quartz.config.yaml`
	- ⚠️ Only *design decision* in the phase (rest is mechanical) — touches vendored emitter
- ###### Remove dead second sassPlugin instance %% fold %%
	- `filter: /\.inline\.scss$/` instance has no consumer even today
	- Whole `esbuild-sass-plugin` dep goes with SCSS→CSS migration anyway
	- ⚠️ Order: styles pass BEFORE CLI removal, so the lean esbuild config is what gets ported into `build.mjs`
- ###### Keep load-bearing for future features — do NOT remove %% fold %%
	- `content-page`, `explorer`, `bases-page` (index pages / explorer depth ideas)
	- mermaid capability in OFM (only toggle off, don't strip code)
	- `@quartz-community/table-of-contents`, `backlinks` (UX ideas build on them)

---

## UX
- ###### [NOT SURE] Sticky headings %% fold %%
	- VSCode like. It's nice to see structure on top of the page with heading/-s current content is below.
	- But for longer pages it may be confusing. Or harder to implement. So not sure. 
	- For phones though?
	- Like it's easy to prototype but hard to do it properly. 
- ###### [DISCARDED] Breadcrumbs %% fold %%
	- on top of notes, but the issue is that it may get broken without index folders. So navigation would be either through explorer or the page itself?
- ##### Buttons
	- ###### Up/Down Floating Block %% fold %%
		- On bottom right. Scrolls up/down. Especially useful if you'll have that planned navigation on top of the page.
	- ###### Download .md or .pdf + copy .md + get link to page %% fold %%
		- Why not? Compact. If I want to debug something - easy. Download a page to put into LLM - good too. So yeah. Wouldn't hurt for sure. 
		- Location. Either top near title, or bottom. Check examples, see what fits it more. 
	- ###### [DISCARDED] Dim Website %% fold %%
		- Themes probably will be useless work. But to be able to dim website even further, for like reading before sleep - may be interesting. But is it. It's kinda intended on phones. Don't see much sense in it honestly. 
		- The issue is that it may involve theming logic, which will bloat code/styling. And there's little of cases where it's useful and can't be fixed by changing brightness. Maybe later worth to revisit.
	- ###### [DISCARDED] Page on Github Link %% fold %%
		- Few reasons. One is that link must be to obsidian vault, not website. Which makes it much more complex (theoretically)
		- Another reason is that I'm not sure how to feel about theoretical PRs by others? Like it's not a collaborative project. I mean markdown notes. Website code may be used as template, but for notes... doesn't make sense. 
- ###### Following Table of Contents %% fold %%
	- Experimental. May be distracting. 
	- Logic is that it's following Y coordinate of the cursor. To be like "near the mouse" to increase usability of it.
- ##### Collapsible list and headings
	- ###### `%% fold %%` Parsing %% fold %%
		- to preserve collapsed states and also to NOT have those markers
	- ###### Folding logic %% fold %%
		- create one. there's none. Since the plugin you will use foldings a lot, which means without them - there will be huge walls of text on website. Which is suboptimal, obviously.
- ###### [NOT SURE] Hide page load under fading animation %% fold %%
	- It may make website experience more smoother. But I have the feeling that it'll be hard to do properly.
		- Why? - if webpage loads instantly, animation will actually make navigation slower. But if page loads slowly, then what? you slowly fade out into nothingness, wait anyway, and then fade in after page loaded? 
		- So it's kinda not clear whether it'll make subjective smoothness of navigation better or worse.
	- I got this idea from some astro blogs, IIRC. There it was nice. Maybe I can find those and see how it's done in details?
---

## Pages & Contents %% fold %%
- ### Doing Now
	- Why?
		- To connect the website with living human being. You read all those other website and they felt like footprint of dead people. While this "doing now" logic will allow to kinda unconsciously give the website more meaning. 
	- ##### Spotify
		- Sync Options
			- `last.fm`
			- `nowplaying.site`
	- ##### TickTick Schedule
		- ###### Cron on worker
			- fetches once per 5 minutes, stores at `KV`(or right away to baking), does baked-in snippet as asset, so it can be read without limits? 
		- ###### Scheduling database? (LONG TERM)
			- you had an idea to show on the side view ticktick schedule, during viewing journal entries. 
			- what if worker uses r2 or something, and saves each viewed day? so not only you can view "doing now", but also have cached data for all journaling entries? 
	- ##### 1-minute WebP/Gif Snippets
		- Logic
			- Use comments infrastructure. 
			- Python script that fetches last recording and with ffmpeg extracts like 1/10 keyframes. Then either single webp OR gif, to have the picture like moving a bit.
			- Cached with ttl 1-2 minutes.
			- Worker fetches. OR you do that through website, but not good though, unnecessary traffic. While worker will allow to centralize asset requests.
- ##### Changelog
	- Paged (10-20 entries?) list of git commits to website? 
- ##### Charts
	- Types
		- Weight loss
		- Subjective life progress
			* to remember that setbacks happen on upward tendency
			* to force into mindset "compare with yourself yesterday"
	* Logic
		* PIA. At best you have to make some transformer plugin that manually finds daily journals and parses it into SVG chart. 
		* Or you can use some lightweight charting library for minimal interactivity? 
- ###### Decisions
	- List of decisions and rationale 
	- For you to remember.
	- Examples
		- Why excalidraw over obsidian? 
		- Why this structure of other ones?
		- Maybe it's worth to have it in system? So it's in one place?
		- For readers to understand.
- ##### Explorer
	- ###### Limit depth of the explorer?
		- Issue
			- You will have pages with lots files. It's super inconvenient to explore them through "explorer". It's narrow and free space is limited.
		- Solution?
			- #1 - 1-2 levels of depth + index pages. 
				- con is that index page would be a single page under that folder, so if you don't have 2 levels of depth - then it doesn't make sense to have 1 level. 
			- #2 - use folder-pages
				- makes sense with 1 level depth, looses sense with 2 and more levels. 
		- Discussion
			- It's basically about how much you want to use indexes idea. 
			- Like if - a lot, then explorer could be supplemental, and then it's easier.
			- if not much - then explorer is main navigation tool, and it's a bit complex. 
	- ###### Exclude folders & Files
		- `@journals`
			- Too much files and folders. No sense in having explorer navigation. At all. 
		- `@projects`
			- Same reasoning?
		- `README.md` - for github.
- #### Index Pages
	- Issues
		- Explorer, navigation, ux.
	- Solution
		- Example. System index page. Has cards linking to each sub-system folder. you don't have to list collapse/unfold explorer. Everything is on the page to explore and explorer is basically like top-level navigation.
			- I like this. Very much. Low friction. And fits into my need for reducing cognitive complexity of structures I use.
- ##### Created/Last updated
	- Description
		- show created/last updated times to know how how old note and whether it's outdated
		- I would argue that it's worth to do at the obsidian stage. updated though would be a bit harder... 
	- Opposition
		- Drop both maybe? Or keep only last updated. That's what matters to make old notes more alive. 
	- ###### Git Sync
		- There was few websites with this. It was nice, where you can like see commit history on the note. The issue only is with the positioning. Like if you would need to restructure vault - then it may be PIA to preserve commits on the note. But maybe not. Just be aware of it.
- ###### Mermaid Diagrams
	- I plan on using them. Later. 
	- `pele` package was recommended on one website (with ref link though).
		- You need fast and lightweight one. 
		- You need to be able to zoom and pan
	- OR you can consider SVG approach on build time. And cover under image viewer feature.

---

## Styles
- ##### Background
	- ###### Gradient %% fold %%
		- dark at the bottom. lighter at the top. 
		- minimal changes but without banding though. 
	- ###### Grain %% fold %%
		- just curious, in visions it looks nice
	- ###### Color %% fold %%
		- brown-ish, golden-ish, dark.
- ###### Icons & Colors for Files & Folders %% fold %%
	- Kinda duplicate obsidian idea. The thing is - it allows to have a bit more complex structure without requiring additional cognitive processing of that structure. Like it's easier to abstract it out.
- ###### Colorful Headings %% fold %%
	- Use colors from obsidian + extract those from "minimal's config" to separate css snippet
- ###### Links %% fold %%
	- Underline. Never highlight whole link.
- ###### Content Width %% fold %%
	- there was this rule... some amount of characters per line. Copy from obsidian theme.

---

## LLMs
- ###### LLMS.txt
- ###### Ability to serve raw .md webpages

---

## Optimization
 
- ##### Caching
	- ###### Cache static images %% fold %%
		- Like OG or favicon?  
		- I'm not sure about ALL images, but I can do 8bits of hash suffix to their name. They're unlikely to change too, especially with the same name. It's just if I overuse it - it may be hundreds of megabytes of cached data. On another hand, I don't really overuse images, and on top of webp compression - 100 images would take like 10 megabytes of cache, which is negligible. 

- #### Images
	- ##### Favicon/OpenGraph/Logo
		- ###### Favicon %% fold %%
			- Website-style colored [T] icon? as first letter in url?
		- ###### OpenGraph %% fold %%
			- No idea whatsoever. 
		- ###### Logo %% fold %%
			- Also not sure. Do website first, and then fit logo under styling
			- You can use that Dore's painting + LLM to have some variations? 
	- ##### Image Viewer %% fold %%
		- Scroll to zoom in/out into mouse position on the image.
	- ###### Convert to webp %% fold %%
		- During build time
			- What you see in obsidian is not what you get in website
			- But this requires different building processes, to avoid conversion in worker/github.
		- Obsidian workflow hygiene (RECOMMENDED)
			- You establish low-friction workflows to insert processed images in obsidian, so building stays cheap. (100 images on high quality webp (lossless) can take minutes)
			- You have apps like `squoosh.app` or others. Or you can write quick app in python/ahk based on clipboard buffer. You make a screenshot. Press hotkey. And get notification that clipboard was updated and you have optimized webp image in there.
				- Another hotkey would do the same but with GUI sliders/preview. 
	- ##### Async loading
		- ###### Loading %% fold %%
			- Notes
				- Issue isn't as much about the size (until it's extreme, which it won't be), but about the response delays. Like current page with only 4 images for inspiration would probably be 200-300kb optimized. Which takes some time for cloudflare. I don't know how it works, but in my tests there's is significant difference. 
				- So I guess it's the way. Load text + baked in blur at first, and then separate request will update async images after.
			- Logic
				- transformer adds` loading="lazy"` + `decoding="async"` attributes. 
				- but also probably should be "smart". If image is likely to be in a viewport on load - then maybe it should load instantly unless it's like 100kb+ in size, then it's async too? 
				- Also transformer plugin would need to add height/width attributes, so loading won't shift layout. 
				- uses `img`'s `complete` to not run the whole flow for image that is already loaded. 
		- ###### Animating %% fold %%
			- **blurred** placeholder, extremely cheap, prevents image "pop up" out of nowhere %% fold %%
				- which means we would have to create that blurred image in the first place, maybe even bake into the page? Those can be like really small and cheap, so it won't be an issue at all.
			- fade-in from blurred to original.

- ##### SEO
	- ###### Worth to research %% fold %%
		- Just placeholder. I need to have at least basics set up. Do proper research. And make sure it's all good.


