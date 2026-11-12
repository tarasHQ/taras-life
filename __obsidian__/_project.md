# Project "taras.life"


## Docs

```dataview
TABLE WITHOUT ID
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/_reflections")), (f) => f.link) AS "Reflections",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/ideas")), (f) => f.link) AS "Ideas",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/artifacts")), (f) => f.link) AS "Artifacts"
FROM ""
WHERE startswith(file.folder, this.file.folder + "/") AND file.path != this.file.path
SORT file.name ASC
GROUP BY true
```

## Phases

- ### Polishing
	- #### IDEAS
		- ###### Scroll Restoration %% fold %%
			 - **Refs**: `C:/Users/Taras/Dev/_other/TurnTrout.com-main/__obsidian__/artifacts/the-pond-design.md` (§"Solution: Preempt the page paint", quotes; links historical `quartz/static/scripts/instantScrollRestoration.js`, absent from snapshot) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/quartz/components/scripts/spa.inline.ts` (current SPA router — no save/restore)
			- **Problem**: back/refresh restores scroll before images reserve space → restored offset drifts as layout grows; browser-native `scrollRestoration` is unreliable+racy on static sites.
			- **Solution shape**: inline pre-paint script (NOT external, NOT `beforeDOMLoaded` — must run before first frame); sets `history.scrollRestoration = "manual"` to stop native restoration fighting; reads stored position from multiple stores (`history.state` / `sessionStorage` / `localStorage` — different nav paths populate different ones).
			- **rAF loop**: instead of one-shot restore, adjusts position each frame for ~3s to absorb late-loading content growth below restore point, imperceptibly.
			- **Key insight — user vs layout-shift disambiguation**: script can't tell user scroll from layout shift by deltas; instead treats causes as disjoint: `wheel`/`touchstart`/`pointerdown`/`keydown` listeners, `passive: true` + `once: true`, set `userInteracted` → cancel adjustment loop. Layout shifts cannot emit input events.
			- **SPA interplay**: with micromorph SPA nav, back/forward = `popstate` → `navigate(isBack)` which doesn't scroll (body patched in place, scroll preserved naturally) → restoration script only matters on full page loads (first visit, refresh, external back); safe to always run (no-op when nothing stored).
			- **Port note for our repo**: inline via `additionalHead` in Head.tsx; complements image aspect-ratio feature (that one shrinks the 3s correction need).
		- ###### Private config properties %% fold %%
			- Make your remark42 config url private. It's not a secret to see the address, and it's protected(rejected) but to just not confuse people? Though it may be PIA. Cuz you theoretically need to configure variables in github AND cloudflare. So it's like 2-3 sources of truth. On another hand, do you need those locally, since localhost origin banned as well, and also on github, since you just build to test/check that it builds. 
				- it's just unclear. If I will build locally and worker will only run it - then it's easier, I guess? I don't know. 
		- ###### SEO - Worth to research %% fold %%
			- Just placeholder. I need to have at least basics set up. Do proper research. And make sure it's all good.
- ### Doing Now
	- #### IDEAS %% fold %%
		- Why? %% fold %%
			- To connect the website with living human being. You read all those other website and they felt like footprint of dead people. While this "doing now" logic will allow to kinda unconsciously give the website more meaning. 
		- ##### Fetching latest journaling log %% fold %%
			- Without git. Probably obsidian cli on proxmox OR utilizing SMB syncing somehow? Like proxmox host only syncs from smb to specific lxc (to have single point of access. While other lxc provides endpoint for worker, or something. )
			- It's actually beneficial for you too. To have more quality time logs. Where you reflect more. 
		- ##### Spotify %% fold %%
			- Sync Options
				- `last.fm`
				- `nowplaying.site`
		- ##### TickTick Schedule
			- ###### Cron on worker %% fold %%
				- fetches once per 5 minutes, stores at `KV`(or right away to baking), does baked-in snippet as asset, so it can be read without limits? 
			- ###### Scheduling database? (LONG TERM) %% fold %%
				- you had an idea to show on the side view ticktick schedule, during viewing journal entries. 
				- what if worker uses r2 or something, and saves each viewed day? so not only you can view "doing now", but also have cached data for all journaling entries? 
		- ##### 1-minute WebP/Gif Snippets %% fold %%
			- Logic
				- Use comments infrastructure. 
				- Python script that fetches last recording and with ffmpeg extracts like 1/10 keyframes. Then either single webp OR gif, to have the picture like moving a bit.
				- Cached with ttl 1-2 minutes.
				- Worker fetches. OR you do that through website, but not good though, unnecessary traffic. While worker will allow to centralize asset requests.
				- If there's no update at expected timestamp (+-5 seconds) - don't keep last image. Have placeholder instead. (if something explicit gets on camera and you shut down the recording? )
- ### Remark42
	- #### IDEAS
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
		- Prelcalc size of comments block to avoid layout jumping?
- ### Optimization
	- #### IDEAS
		- ###### FetchPriority %% fold %%
			- Minor tweak on core stylesheets to have priority in download queue.
		- ###### Cache static images %% fold %%
			- Like OG or favicon?  
			- I'm not sure about ALL images, but I can do 8bits of hash suffix to their name. They're unlikely to change too, especially with the same name. It's just if I overuse it - it may be hundreds of megabytes of cached data. On another hand, I don't really overuse images, and on top of webp compression - 100 images would take like 10 megabytes of cache, which is negligible. 
		- #### Images
			- ##### Favicon/OpenGraph/Logo
				- ###### OpenGraph %% fold %%
					- No idea whatsoever. 
				- ###### Logo %% fold %%
					- Also not sure. Do website first, and then fit logo under styling
					- You can use that Dore's painting + LLM to have some variations? 
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
			- ###### Images pre-sizing for layout stability %% fold %%
				- **Refs**: `C:/Users/Taras/Dev/_other/TurnTrout.com-main/__obsidian__/artifacts/the-pond-design.md` (source of the quote + design rationale) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/package.json` (sharp dependency, unused by any such transformer in snapshot) · `C:/Users/Taras/Dev/_other/TurnTrout.com-main/quartz/plugins/` (transformer wiring point, implementation absent in snapshot)
				- **Goal**: eliminate CLS (Cumulative Layout Shift) — images loading async otherwise reflow the page once their dimensions become known.
				- **Mechanism**: browsers derive implicit `aspect-ratio` from explicit `width`/`height` attributes on `<img>` and reserve the box before any bytes download; CSS still controls rendered size, attributes only communicate the ratio. Derived height = rendered width ÷ ratio.
				- **Implementation**: build-time transformer walks hast for `<img>` (and similar embeds), reads intrinsic dimensions of the asset (sharp's metadata read — cheap, no full decode), writes `width`/`height` attributes before HTML emission. "Linked assets" phrasing covers remote URLs too (needs build-time fetch).
				- **Status in snapshot**: NOT implemented (aspirational, from `the-pond-design.md`); `sharp` is in `package.json` but unused by any such transformer. Live site likely has it.
				- **Pair-with guardrails**: `loading="lazy"` + `decoding="async"` on offscreen images.
				- **Port note for our repo**: natural fit = rehype transformer visiting `img` nodes + sharp metadata; nothing CSS-side needed.
- ### Refactor
	- #### IDEAS
		- ###### Mermaid Diagrams %% fold %%
			- I plan on using them. Later. 
			- `pele` package was recommended on one website (with ref link though).
				- You need fast and lightweight one. 
				- You need to be able to zoom and pan
			- OR you can consider SVG approach on build time. And cover under image viewer feature.
		- ###### Image Viewer %% fold %%
			- Scroll to zoom in/out into mouse position on the image.
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
		- ###### Remove `emojimap.json` (15 MB) %% fold %%
			- ⚠️ `og-image` bundled code reads it by filesystem path — move file, build, verify OG images before deleting
		- ###### Remove unused/redundant styles %% fold %%
			- After SCSS→CSS migration: audit base/callouts/popover for styles of removed plugins (e.g. things tied to dropped features)

- ---
- 
- ### 01 Basics
	- #### IDEAS %% fold %%
		- ##### Collapsible list and headings
			- ###### `%% fold %%` Parsing %% fold %%
				- to preserve collapsed states and also to NOT have those markers
			- ###### Folding logic %% fold %%
				- create one. there's none. Since the plugin you will use foldings a lot, which means without them - there will be huge walls of text on website. Which is suboptimal, obviously.
		- ##### Structure
			- ###### Decisions %% fold %%
				- List of decisions and rationale 
				- For you to remember.
				- Examples
					- Why excalidraw over obsidian? 
					- Why this structure of other ones?
					- Maybe it's worth to have it in system? So it's in one place?
						- For readers to understand.
			- ###### Index Pages %% fold %%
				- Issues
					- Explorer, navigation, ux.
				- Solution
					- Example. System index page. Has cards linking to each sub-system folder. you don't have to list collapse/unfold explorer. Everything is on the page to explore and explorer is basically like top-level navigation.
						- I like this. Very much. Low friction. And fits into my need for reducing cognitive complexity of structures I use.
		- ##### Explorer
			- ###### Limit depth of the explorer? %% fold %%
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
			- ###### Exclude folders & Files %% fold %%
				- `@journals`
					- Too much files and folders. No sense in having explorer navigation. At all. 
				- `@projects`
					- Same reasoning?
				- `README.md` - for github.
			- ###### Icons & Colors for Files & Folders %% fold %%
				- Kinda duplicate obsidian idea. The thing is - it allows to have a bit more complex structure without requiring additional cognitive processing of that structure. Like it's easier to abstract it out.
	- #### ~~Phase 003 - Visual Identity [done](./phases/_archived/003/_plan_003.md)
	  Palette and three modes, typography, accents, background, favicon, and published visual test pages.
	- #### ~~Phase 002 - Removing SCSS, Theming, Fonts plugin [done](./phases/_archived/002/_plan_002.md) 
	  SCSS → plain CSS, static theming (theme.css SSOT), generation machinery + Google Fonts + quartz-fonts out, CLI create/git-flow out, README set + AGENTS.md aligned, semantic review.
	- #### ~~Phase 001 - Remark42 plugin rewrite [done](phases/_archived/001/_plan_001.md)
	  Remark42 plugin rewritten from scratch as a self-contained compiled package (`custom-plugins/remark42/`), shipped and documented. Deferred to future work: visual polish


