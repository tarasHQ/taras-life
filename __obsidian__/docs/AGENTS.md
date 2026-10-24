
Personal blog built with **Quartz v5**, deployed to **Cloudflare Workers**.
- Content lives in `content/`, Quartz engine in `quartz/`, config in `quartz.config.yaml`, deployment via `wrangler.jsonc`.

## 0. SSOT of links to additional project's .md files

- ##### Instructions
    - It's crucial to adhere to conditions of reading to avoid unnecessary context bloat.
    - Links are relative to `AGENTS.md`, path from repo's root would be `__obsidian__/docs/AGENTS.md`
- ##### [PLANNING.md](C:\Users\Taras\Documents\obsidian-vault\_static\projects\PLANNING.md)
    - to be read only during planning phase. [[../../../../_static/projects/PLANNING|internal link for the user]], llm shouldn't use it.
- ##### ./docs/DEV_RULES.md
    - to be read only before writing the code, there's no information that is helpful during planning phase.
- ##### ./DEV_COMMANDS.md
    - to be read only if LLM tinkers with tasks/commands/scripts
- ##### ./PHILOSOPHY.md
    - never read, it's too abstract for 99% of tasks at hand.
- ##### ../README.md
    - neve read, it's vault-related decisions that is rarely needed in an LLM task


## 2. Tech Stack & Key Libraries



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





## Remark42
Comments.
1. Self hosted as standalone binary on LXC. Accessed to internet through cloudflare tunnel at caddy + local reroute. 
	- caddy rewires some headers too.
2. Configuration `/etc/remark42.env`, 
	- `/etc/systemd/system/remark42.service`; runs as `nobody:nogroup`, `WorkingDirectory=/var/www/remark42`.
	- `/var/www/remark42/var` - boltdb dir
3. Done as systemd service
4. Backups. Handled by proxmox daily/weekly vzdumps with rsync offsite
5. Health - UptimeRobot, pings both taras.life and `https://comments.taras.life/api/v1/ping`
	- comments live under blog domain, not infra. 
6. Tied to the id in frontmatter. No id - no comments. 
7. (crucial for free worker on cloudflare) web analytics injects beacon.js into remark42 oauth icons, which breaks them. Workaround is to use rule configuration to disable RUM when host == the public host of the remark42
8. oauth apps, for now, only google and gmail
9. admin is identified by github account internal remark42 id
10. no smtp/telegram/others