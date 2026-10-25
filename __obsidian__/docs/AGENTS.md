## Overview

Personal blog built with **Quartz v5**, deployed to **Cloudflare Workers**.

- **Site generator**: Quartz v5 — **vendored source tree**, not a dependency. Lives in: `quartz/`.
- **Content**: Obsidian plugin syncs vault with repo's `content/`. Lives in: `content/`.
- **Config surface**: YAML plugin + layout config, bridged into the build. Lives in: `quartz.config.yaml`, `quartz.ts`.
- **Rendering**: Preact components, rendered to string at build time (no hydration). Lives in: `quartz/components/`.
- **Content pipeline**: unified → remark (mdast) → rehype (hast) → JSX. Lives in: `quartz/processors/`.
- **Styling / bundling**: SCSS compiled with esbuild + Lightning CSS. Lives in: `quartz/styles/`.
- **Hosting**: Cloudflare Workers, **assets-only** (no `main`, no bindings). Lives in: `wrangler.jsonc`.
- **Delivery**: Cloudflare **Workers Builds** on push → `npm run build` → `public/`. Lives in: `wrangler.jsonc`. NO PREVIEWS enabled. 
- **Comments**: Self-hosted Remark42 (external LXC) via a local Quartz plugin. Lives in: `custom-plugins/remark42/`.
- **Analytics**: Cloudflare Web Analytics, injected **at the edge** by a dashboard rule. Lives: ⚠️ outside this repo.
- **Runtime**: Node ≥ 22, npm ≥ 10.9.2, ESM + TypeScript. Lives in: `package.json`.

---

## 00. SSOT of links to additional project's .md files

- ##### Instructions
    - It's crucial to adhere to conditions of reading to avoid unnecessary context bloat.
    - Links of attached docs below are relative to `AGENTS.md`, path from repo's root would be `__obsidian__/docs/AGENTS.md`. Rule applies only to those few docs below, so they're repository-agnostic.
    - **Two link formats below mean two different things:**
        - `[NAME](file:///C:/...)` — an **absolute OS path** for the LLM. Strip the `file:///` prefix and read the remaining path (e.g. `C:/Users/.../NAME.md`) directly with the read tool. These files live in the Obsidian vault, outside the repo, but on the same machine and readable.
        - `[[...]]` — an **Obsidian internal link, for the user only** (clickable when the repo folder is opened/symlinked inside Obsidian). The LLM must never follow or resolve it.
- ##### [PLANNING.md](file:///C:/Users/Taras/Documents/obsidian-vault/_static/projects/PLANNING.md)
    - to be read only during planning phase or implementation of the steps. [[../../../../_static/projects/PLANNING|internal link for the user]] — user-only, LLM ignores it.
- ##### [DEV_RULES.md](./DEV_RULES.md)
    - to be read only before writing the code, there's no information that is helpful during planning phase.
- ##### [DEV_COMMANDS.md](./DEV_COMMANDS.md)
    - to be read only if LLM tinkers with tasks/commands/scripts

---

## 01. Tech Stack / Key Libraries, Plugins, Services
### 01.1. Overview
**Runtime & toolchain**
- **Runtime**: Node.js ≥ 22, ESM (`"type": "module"`). Notes: declared in `engines`; Workers Builds must satisfy it.
- **Language**: TypeScript. Notes: typechecked by `tsc --noEmit`, but **never compiled by tsc** — esbuild emits JS.
- **Package manager**: npm ≥ 10.9.2, committed `package-lock.json`. Notes: CI installs with `npm ci`; lockfile drift fails the build.
- **Bundler**: esbuild (+ `esbuild-sass-plugin`). Notes: bundles page JS and the local plugin's browser script.
- **CSS toolchain**: SCSS → Lightning CSS. Notes: compiled and minified at build time.
- **Quality gates**: Prettier, `tsx --test`, `tsc --noEmit`. Notes: `npm run check`, `npm test`.
- **Git hooks**: lefthook. Notes: `pre-push` runs types→format→tests→build fast-fail-first; `pre-commit` README-review ported but disabled (`skip: true` in `lefthook.yml`). Wired by root `prepare` → `lefthook install`; bypass with `LEFTHOOK=0`.

**Content & generation**
- **Authoring**: Markdown + YAML frontmatter, written in Obsidian. Notes: lives in `content/` (not vault). 
- **Content Sync**: `Quartz Syncer` obsidian plugin selectively syncs vault with `content/`
- **Generator**: Quartz v5 — **vendored source**, not a dependency. Notes: `quartz/`; upgrading is a merge.
- **Site config**: YAML plugin + layout config. Notes: `quartz.config.yaml` is SSOT for enabled plugins.
- **Content pipeline**: unified → `remark (mdast)` → `rehype (hast)` → JSX. Notes: all customisation enters as plugins/transformers.
- **SSR**: `Preact` + `preact-render-to-string`. Notes: output is static HTML — there is no hydration.
- **Client runtime**: `Preact` islands, SPA nav via `micromorph`. Notes: never re-render or call `window.location` manually.
- **Markdown dialect**: Obsidian-flavored + GitHub-flavored. Notes: `[wikilinks]()`, callouts, tags, block refs, Mermaid, GFM tables.
- **Code**: `Shiki (rehype-pretty-code)`. Notes: build time only; no math engine — the LaTeX plugin was removed.
- **Search**: `FlexSearch`. Notes: index built at compile time, queried in-browser.
- **Images**: `sharp`. Notes: resizing and OG image generation.
- **Fonts**: Google Fonts origin, CDN-cached. Notes: theme config.

**Delivery**
- **Build trigger**: Cloudflare **Workers Builds** on push. Notes: runs `build.command` from `wrangler.jsonc`.
- **Build output**: `public/` static files. Notes: gitignored, disposable.
- **Hosting**: Cloudflare Workers **static assets** — no `main`, no bindings. Notes: nothing executes at the edge.
- **Edge / DNS / TLS**: Cloudflare, custom domain `taras.life`. Notes: cert and DNS record dashboard-managed.
- **Analytics**: Cloudflare Web Analytics, injected by a domain rule. `RUM` disabled for the remark42 host.

### 01.2. Remark42 Comments
- #### Plugin `custom-plugins/remark42/`
	- **Content binding**: a post is commentable only if it carries an `id` in frontmatter — no `id`, no comments.
	- **Analytics caveat** (crucial on the free Cloudflare Worker plan): edge-injected web analytics ships `beacon.js` into Remark42's OAuth icons and breaks them; the workaround is a domain rule that disables `RUM` when the host equals Remark42's public host.
- #### Service
	- **Topology**: a standalone binary self-hosted on an LXC container, exposed to the internet through a Cloudflare Tunnel that arrives at Caddy; Caddy also rewires some headers, then reroutes locally.
	- **Process**: runs as a `systemd` service under `nobody:nogroup`, with `WorkingDirectory=/var/www/remark42`.
		- Unit: `/etc/systemd/system/remark42.service`
		- Config: `/etc/remark42.env`
		- Data: `/var/www/remark42/var` — the boltdb directory
	- **Backups**: handled by Proxmox `vzdumps`, daily and weekly, replicated offsite with `rsync`.
		- has internal backups (daily, 10 days) but those DO NOT backup images/avatars. So it's worth mentioning.
	- **Health**: `UptimeRobot` pings both `taras.life` and `https://comments.taras.life/api/v1/ping`. Comments are served under the blog domain, not the infrastructure host.
	- **OAuth**: Google and Github only, for now.
	- **Admin**: identified by the internal Remark42 id of the GitHub account.
	- **Notifications**: no SMTP, Telegram, or other transports.

### 01.3. Removed plugins

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
|                    |                                                                                                                                    |

---

## 02. Codebase Exploration & Documentation Guidelines

### 02.1 Submodule Documentation (README.md)
- Every logical module and package submodule should maintain a concise local `README.md` file.
- Some modules may not have `README.md` - then LLM must inform the dev to create one.
- When researching, planning, or preparing to modify a module, always read its local `README.md` first before reading individual code files.
- Local `README.md` files provide high-level design rationale, submodule structure, domain quirks, future features and controversial decisions that are not immediately obvious from code alone.
### 02.2 Reference Materials & Vendor Docs (docs/)
- External library documentation and architectural guidelines (e.g. remark42 or quartz itself) reside in the `docs/` directory.
- Due to the size of documentation files under `docs/`, avoid reading them entirely into context with direct read tools.
- Always use the `explore` tool with focused queries to extract specific sections from `docs/` without bloating the context window.
---

## 03. Knowledge & Planning 

### 03.1 Location & File structure
- `__obsidian__/` folder in the root of the project should contain all plans/reflections
- `__obsidian__/phases/999/` folder structure separates plans and reflections by phase number
- Name format for plan .md files: `DD-MM-YYYY - NAME.md` (e.g., `22-09-2026 - CHAT_VIEW.md`).
### 03.2 Flow of the planning
- First, discuss with the high level structure of the plan. When it's locked, write a skeleton that consists of X steps to achieve the goal of the plan.
- Second, go step-by-step through the plan, and enrich it with more detailed implementation tasks/invariants/decisions/etc.

## 99. Maintaining AGENTS.md

### 99.1 Purpose & Role
- AGENTS.md is the durable, high-level reference for Axon's architecture, philosophy, and system invariants.
- It is designed to be loaded into context during exploration, discussion, and high-level planning without consuming excessive token budget.
- It must remain low-churn and free of ephemeral implementation noise.
### 99.2 What Belongs Here
- High-level system philosophy and product vision.
- Key tech stack choices, runtime requirements, etc..
- High-level concepts.
- Architectural invariants .
- Codebase navigation rules (README.md conventions and docs/ exploration).
### 99.3 What Does NOT Belong Here
- Low-level coding style rules, JSDoc formatting, etc.
- File-by-file refactor notes, changelogs, and temporary migration diaries.
- Sprint task checklists, implementation roadmaps, and step-by-step feature guides.
- Fleeting bug workarounds or transient environment hacks.
### 99.4 Update Protocol
- Update this document only when a change alters system invariants, introduces new packages, modifies communication transports, or changes core architectural boundaries.
- When an invariant or boundary changes, update` AGENTS.md` in the same session to prevent architectural documentation drift.
- If an instruction or invariant in `AGENTS.md` conflicts with the codebase, resolve the contradiction immediately rather than allowing drift to accumulate.
