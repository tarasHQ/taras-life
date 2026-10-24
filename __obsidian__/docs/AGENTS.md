## Overview

Personal blog built with **Quartz v5**, deployed to **Cloudflare Workers**.

| Layer              | Technology                                                             | Lives in                          |
| ------------------ | ---------------------------------------------------------------------- | --------------------------------- |
| Site generator     | Quartz v5 — **vendored source tree**, not a dependency                 | `quartz/`                         |
| Content            | Obsidian plugin syncs vault with repo's `content/`                     | `content/`                        |
| Config surface     | YAML plugin + layout config, bridged into the build                    | `quartz.config.yaml`, `quartz.ts` |
| Rendering          | Preact components, rendered to string at build time (no hydration)     | `quartz/components/`              |
| Content pipeline   | unified → remark (mdast) → rehype (hast) → JSX                         | `quartz/processors/`              |
| Styling / bundling | SCSS compiled with esbuild + Lightning CSS                             | `quartz/styles/`                  |
| Hosting            | Cloudflare Workers, **assets-only** (no `main`, no bindings)           | `wrangler.jsonc`                  |
| Delivery           | Cloudflare **Workers Builds** on push → `npm run build` → `public/`    | `wrangler.jsonc`                  |
| Comments           | Self-hosted Remark42 (external LXC) via a local Quartz plugin          | `custom-plugins/remark42/`        |
| Analytics          | Cloudflare Web Analytics, injected **at the edge** by a dashboard rule | ⚠️ outside this repo              |
| Runtime            | Node ≥ 22, npm ≥ 10.9.2, ESM + TypeScript                              | `package.json`                    |

## 0. SSOT of links to additional project's .md files

- ##### Instructions
    - It's crucial to adhere to conditions of reading to avoid unnecessary context bloat.
    - Links are relative to `AGENTS.md`, path from repo's root would be `__obsidian__/docs/AGENTS.md`
- ##### [PLANNING.md](file:///C:/Users/Taras/Documents/obsidian-vault/_static/projects/PLANNING.md)
    - to be read only during planning phase. [[../../../../_static/projects/PLANNING|internal link for the user]], llm shouldn't use neither link or proposed paths.
- ##### [DEV_RULES.md](./DEV_RULES.md)
    - to be read only before writing the code, there's no information that is helpful during planning phase.
- ##### [DEV_COMMANDS.md](./DEV_COMMANDS.md)
    - to be read only if LLM tinkers with tasks/commands/scripts

## 1. Tech Stack / Key Libraries, Plugins, Services

**Runtime & toolchain**

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Node.js ≥ 22, ESM (`"type": "module"`) | declared in `engines`; Workers Builds must satisfy it |
| Language | TypeScript | typechecked by `tsc --noEmit`, but **never compiled by tsc** — esbuild emits JS |
| Package manager | npm ≥ 10.9.2, committed `package-lock.json` | CI installs with `npm ci`; lockfile drift fails the build |
| Bundler | esbuild (+ `esbuild-sass-plugin`) | bundles page JS and the local plugin's browser script |
| CSS toolchain | SCSS → Lightning CSS | compiled and minified at build time |
| Quality gates | Prettier, `tsx --test`, `tsc --noEmit` | `npm run check`, `npm test` |
| Deploy CLI | `wrangler` (devDependency) | local preview/deploy; CI path is Workers Builds |

**Content & generation**

| Layer | Technology | Notes |
|---|---|---|
| Authoring | Markdown + YAML frontmatter, written in Obsidian | lives in `content/` |
| Generator | Quartz v5 — **vendored source**, not a dependency | `quartz/`; upgrading is a merge |
| Site config | YAML plugin + layout config | `quartz.config.yaml` is SSOT for enabled plugins |
| Content pipeline | unified → remark (mdast) → rehype (hast) → JSX | all customisation enters as plugins/transformers |
| SSR | Preact + `preact-render-to-string` | output is static HTML — there is no hydration |
| Client runtime | Preact islands, SPA nav via `micromorph` | never re-render or call `window.location` manually |
| Markdown dialect | Obsidian-flavored + GitHub-flavored | wikilinks, callouts, tags, block refs, Mermaid, GFM tables |
| Code | Shiki (`rehype-pretty-code`) | build time only; no math engine — the LaTeX plugin was removed |
| Search | FlexSearch | index built at compile time, queried in-browser |
| Images | `sharp` | resizing and OG image generation |
| Fonts | Google Fonts origin, CDN-cached | theme config |

**Delivery**

| Layer            | Technology                                                    | Notes                                                   |
| ---------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| Build trigger    | Cloudflare **Workers Builds** on push                         | runs `build.command` from `wrangler.jsonc`              |
| Build output     | `public/` static files                                        | gitignored, disposable                                  |
| Hosting          | Cloudflare Workers **static assets** — no `main`, no bindings | nothing executes at the edge                            |
| Edge / DNS / TLS | Cloudflare, custom domain `taras.life`                        | cert and DNS record dashboard-managed                   |
| Analytics        | Cloudflare Web Analytics, injected by a domain rule           | ⚠️ not in this repo; RUM disabled for the remark42 host |


### Remark42 Comments
- #### Plugin
	- `custom-plugins/remark42/`
- #### Service
	- Self hosted as standalone binary on LXC. Accessed to internet through cloudflare tunnel at caddy + local reroute. 
		- caddy rewires some headers too.
	- Configuration `/etc/remark42.env`, 
		- `/etc/systemd/system/remark42.service`; runs as `nobody:nogroup`, `WorkingDirectory=/var/www/remark42`.
		- `/var/www/remark42/var` - boltdb directory
	- Done as `systemd` service
	- Backups. Handled by `proxmox` daily/weekly `vzdumps` with `rsync` offsite
	- Health - `UptimeRobot`, pings both taras.life and `https://comments.taras.life/api/v1/ping`
		- comments live under blog domain, not infra. 
	- Tied to the `id` in frontmatter. No id - no comments. 
	- (crucial for free worker on cloudflare) web analytics injects beacon.js into remark42 oauth icons, which breaks them. Workaround is to use domain rule configurations to disable `RUM` when host == the public host of the remark42
	- `oauth` apps, for now, only google and gmail
	- admin is identified by github account internal remark42 id
	- no smtp/telegram/others

### Removed plugins

| Plugin             | Why removed                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `citations`        | No academic citations authored; citation parsing ran over every note for nothing.                                                  |
| `ox-hugo`          | Org-mode / Hugo export syntax -never authored here.                                                                                |
| `roam`             | Roam Research syntax (`{{[[TODO]]}}`, `{{embed}}`) never authored here.                                                            |
| `explicit-publish` | Nothing is filtered on site — the Obsidian sync layer decides what ships.                                                          |
| `stacked-pages`    | Sliding-pane link navigation not wanted.                                                                                           |
| `tag-list`         | No tags in use.                                                                                                                    |
| `tag-page`         | No tags in use; also drops `/tags/*` generation.                                                                                   |
| `folder-page`      | No folder landing pages planned; `/subfolder/` now 404s instead of listing.                                                        |
| `canvas-page`      | JSON Canvas unused — Excalidraw is preferred for drawings.                                                                         |
| `graph`            | Unused; loaded `d3@7` + `pixi.js@8` from jsDelivr on every page load, before any container check.                                  |
| `latex`            | No math; 11 MB plugin bundle (+19 MB sourcemap) parsed per build, plus a KaTeX CDN stylesheet and `copy-tex` script on every page. |
| `encrypted-pages`  | No password-gated notes; added a client-side decrypt hook + CSS site-wide.                                                         |
| `reader-mode`      | Site content is deliberately concise; toggle + CSS on every page for nothing.                                                      |
| `cname`            | GitHub Pages artifact; hosting is Cloudflare Workers static assets.                                                                |
| `comments`         | Giscus superseded by self-hosted Remark42 (entry was already `enabled: false`).                                                    |
| `remove-draft`     | No drafts authored; filtering is the sync layer's job.                                                                             |

All of the above declared an empty `quartz.dependencies` array, so each removal is a pure `quartz.config.yaml` + `package.json` change with no cross-plugin fallout. To restore one: `npm i @quartz-community/<name>` and re-add its `plugins:` block.

NOTE: `@quartz-community/note-properties` must NEVER be removed — it is the frontmatter parser (`remarkFrontmatter` + `gray-matter` → `file.data.frontmatter`), despite its docs describing it as a properties panel.

---


(from other project's agents file)
## 8. Codebase Exploration & Documentation Guidelines

### 8.1 Submodule Documentation (README.md)
- Every logical module and package submodule maintains a concise local `README.md` file.
- When researching, planning, or preparing to modify a module, always read its local `README.md` first before reading individual code files.
- Local `README.md` files provide high-level design rationale, submodule structure, domain quirks, future features and controversial decisions that are not immediately obvious from code alone.
- Some modules may not have `README.md` - then LLM must inform the dev to create one.
### 8.2 Reference Materials & Vendor Docs (docs/)
- External library documentation and architectural guidelines (e.g. remark42 or quartz itself) reside in the `docs/` directory.
- Due to the size of documentation files under `docs/`, avoid reading them entirely into context with direct read tools.
- Always use the `explore` tool with focused queries to extract specific sections from `docs/` without bloating the context window.
---

## 9. Knowledge & Planning 

### 9.1 Location & File structure
- `__obsidian__/` follder in the root of the project should contain all plans/reflections
- `__obsidian__/phases/999/` folder structure separates plans and reflections by phase number
- Name format for plan .md files: `DD-MM-YYYY - NAME.md` (e.g., `22-09-2026 - CHAT_VIEW.md`).
### 9.2 Flow of the planning
- First, discuss with the high level structure of the plan. When it's locked, write a skeleton that consists of X steps to achieve the goal of the plan.
- Second, go step-by-step through the plan, and enrich it with more detailed implementation tasks/invariants/decisions/etc.

## 10. Maintaining AGENTS.md

### 10.1 Purpose & Role
- AGENTS.md is the durable, high-level reference for Axon's architecture, philosophy, and system invariants.
- It is designed to be loaded into context during exploration, discussion, and high-level planning without consuming excessive token budget.
- It must remain low-churn and free of ephemeral implementation noise.
### 10.2 What Belongs Here
- High-level system philosophy and product vision.
- Key tech stack choices, runtime requirements, etc..
- High-level concepts.
- Architectural invariants .
- Codebase navigation rules (README.md conventions and docs/ exploration).
### 10.3 What Does NOT Belong Here
- Low-level coding style rules, JSDoc formatting, etc.
- File-by-file refactor notes, changelogs, and temporary migration diaries.
- Sprint task checklists, implementation roadmaps, and step-by-step feature guides.
- Fleeting bug workarounds or transient environment hacks.
### 10.4 Update Protocol
- Update this document only when a change alters system invariants, introduces new packages, modifies communication transports, or changes core architectural boundaries.
- When an invariant or boundary changes, update` AGENTS.md` in the same session to prevent architectural documentation drift.
- If an instruction or invariant in `AGENTS.md` conflicts with the codebase, resolve the contradiction immediately rather than allowing drift to accumulate.




