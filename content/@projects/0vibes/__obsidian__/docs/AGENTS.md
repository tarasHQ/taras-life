# AGENTS.md — Axon Project Reference

## Project Constitution

### Modularity & Decomposition

## 00. Obsidian And Docs

- ##### Instructions
  - It's crucial to adhere to conditions of reading to avoid unnecessary context bloat.
  - Links of attached docs below are relative to `AGENTS.md`, path from repo's root would be `__obsidian__/docs/AGENTS.md`. Rule applies only to those few docs below, so they're repository-agnostic.
  - `__obsidian__/` folder is a **SYMLINK** (junction) target. Link to this `__obsidian__/` target is in my obsidian-vault (there's many junctions like this one with the same name but in different locations)
    - I'm using obsidian to significantly improve my ability to work manually with markdown files.
  - **Two link formats below mean two different things:**
    - `[NAME](file:///C:/...)` — an **absolute OS path** for the LLM. Strip the `file:///` prefix and read the remaining path directly with the read tool. These files live in the Obsidian vault, outside the repo, but on the same machine and readable.
    - `[[...]]` — an **Obsidian internal link, for the user only** (clickable when the repo folder is opened/symlinked inside Obsidian). The LLM must never follow or resolve it.
- ##### [PLANNING.md](file:///C:/Users/Taras/Documents/obsidian-vault/_static/projects/PLANNING.md)
  - to be read only during planning phase or implementation of the steps. [[../../../../_static/projects/PLANNING|internal link for the user]] — user-only, LLM ignores it.
- ##### [DEV\_RULES.md](__obsidian__/docs/DEV_RULES.md)
  - to be read only before writing the code, there's no information that is helpful during planning phase.
- ##### [DEV\_COMMANDS.md](__obsidian__/docs/DEV_COMMANDS.md)
  - to be read only if LLM tinkers with tasks/commands/scripts

---

## 1. Project Philosophy

- `Problem`
  - AI industry is focused on agentic flows that increasingly remove human from the loop through temptations to delegate everything including thinking, inconveniet interface to be actively present in the loop, absence of important features, etc.
- `This project's purpose`
  - Restrict temptations to delegate critical/creative thinking
  - Give tools and functionality to make human-driven development fun again
  - Use LLM to make humans better, instead of phasing them out into nothingness
  - Make use of LLM as cheap as possible
- `Summary`
  - This project doesn't deny high usefulness of LLMs, but prioritizes improving quality of thought of human race, instead of maximizing profits. It's achieved by turning upside down current model of AI products, as result - it's convenient to be in the loop, and inconveniet to delegate.
- Much more on this topic is in `PHILOSOPHY.md`

---

## 2. Tech Stack & Key Libraries

### Project-Wide Foundations

- Runtime: `Node.js` (`>=24.0.0`, `ESM`) executed via `tsx`
- Monorepo Management: `pnpm` (`>=12.0.0`) workspaces
- Language: `TypeScript`
- Code Quality & Linting: `Prettier`, `Knip`, `ESLint` (3rd party plugins + custom rules)
- Testing Suite: `Vitest` with `v8` coverage
- Git Hooks: `Husky`

### Server (packages/server)

- Transport: raw `ws` (`WebSocket` server) and `Node` native `HTTP` (`busboy` for multipart upload, `compression`)
- Persistence & ORM: `better-sqlite3` with `drizzle-orm` (and `drizzle-kit`)
- Authentication & Security: `argon2` password hashing, `ipaddr.js` IP checking
- Media & Attachments: `sharp` (image resizing and WebP conversion), `blurhash`
- File & Diff Utilities: `chokidar` (file watching), `diff` (unified diff generation), `isbinaryfile`, `fuzzysort`
- Config & Parsing: `smol-toml`, `dotenv`
- LLM Provider SDK: `openai` (`OpenAI`-compatible endpoints)
- Validation: `zod`

### Legacy Client (packages/client) \[MVP STATE]

- Framework & Tooling: `React 19` + `Vite 8` (`@vitejs/plugin-react`)
- Workspace Layout: `flexlayout-react` (tabbed dockable panels)
- State Management: `zustand` with `immer`
- Code Editor & Autocomplete: `CodeMirror 6` (`@codemirror/*`, `@lezer/*`)
- Diff Visualization: `@pierre/diffs`
- Markdown & Streaming: `streamdown`, `@streamdown/code`, `react-markdown`, `remark-gfm`, `remark-breaks`
- Graph & Flow Visualization: `@xyflow/react`
- Icons: `lucide-react`
- Styling: `Tailwind CSS v4` (`@tailwindcss/vite`) + `class-variance-authority` (`cva`) + `clsx` + `tailwind-merge` + `tw-animate-css`

### New Client (packages/client2) \[WIP]

- Framework & Tooling: `React 19` + `Vite 8` (`@vitejs/plugin-react`)
- Workspace Layout: `flexlayout-react` (tabbed dockable panels)
- State Management: `zustand`
- Local Database: `IndexedDB` via `dexie`
- Forms & Validation: `react-hook-form` with `@hookform/resolvers` and `zod`
- Password Security: `@zxcvbn-ts` and `zxcvbn`
- Animations & Gestures: `motion` (`motion/react`)
- Markdown Rendering: `react-markdown` (client2 maybe will be on `streamdown`)
- Styling: `Tailwind CSS v4` (`@tailwindcss/vite`) + `class-variance-authority` (`cva`) + `clsx`

### Execution Worker (packages/worker)

- Runtime: `Node.js` + `tsx`
- Transport: `ws` client (connects to server control plane)

### VSCode Extension (packages/extension-vscode)

- Platform & Build: `VSCode Extension API`, bundled via `esbuild`, packaged via `vsce`
- Transport: `ws` client authenticated via `Personal Access Tokens` (`PAT`)
- Secret Management: `VSCode SecretStorage API`

---

## 3. External & System Prerequisites

### Engine Requirements

- `Node.js`: `>=24.0.0` (ESM native, subpath imports support)
- `pnpm`: `>=12.0.0` (workspace manager)

### Search Tooling (`ripgrep`)

- Required system dependency for file enumeration and fast search (`list`, `glob`, `grep` tools).
- Windows: `winget install BurntSushi.ripgrep.MSVC`
- Linux: `apt install ripgrep` (or distribution package manager)
- macOS: `brew install ripgrep`

### Native Folder & File Picker GUI

- Windows: `.NET Framework` (standard on Windows 10/11) — required for modern folder picker dialog via `PowerShell` COM interop. Falls back to legacy dialog if unavailable.
- Linux: `zenity` (GTK) or `kdialog` (Qt) — required for native folder picker. Install via system package manager if missing.
- macOS: Built-in `osascript` — no additional packages required.

### Network & Environment Gotchas

- VPN browser/system: Exclude server IP to prevent network issues.
- Windows Hyper-V / WinNAT: Hyper-V or WinNAT dynamic port reservations can randomly block application ports. If port binding fails, whitelist application ports or restart the WinNAT service (`net stop winnat && net start winnat`).

---

## 4. Architectural Principles & Non-Negotiables

- `Long-Term Architecture Over Quick Hacks`: Prioritize robust, durable design over temporary shortcuts. Throwaway MVP patterns are forbidden in active packages.
- `High performance & Memory Efficiency`: Spending some additional time and energy on (planning or) optimizing performance and memory usage is highly recommended.
- `Strict Modularity & Boundary Isolation`: Keep packages and their modules (with sub-modules) deeply decomposed. Never allow execution concerns to leak across package boundaries.
- `Explicit Failure & Determinism`: Operations must fail fast and deterministically. Never introduce silent fallbacks or ambiguous error swallowing.
- `Pragmatic Testing`: Propose and write tests only where they protect high-risk logic, complex algorithms, or core invariants. Avoid tests that lock in volatile, early-stage code.
- `Cross-Platform Parity`: All features must function identically across Windows, Linux, and macOS. Never rely on platform-exclusive patterns without proper cross-platform abstractions.
- `Flexibility and Modularity`: I repeat this one. Codebase must be cleanly isolated and modularized. It's crucial to keep the codebase flexible for long-term improvements.

---

## 5. Package Topology & Responsibilities

For context-efficient per-package anatomy, subpath imports, and module breakdowns, consult the local top-level `README.md` in each package directory (e.g. `packages/server/src/README.md`, you can blindly compile path to read file without checking if it exists - it does)

### Packages Overview

- `packages/server`: Core backend application. Owns the single source of truth in SQLite, runs the LLM orchestration loop, handles user authentication and sessions, manages worker connections, and syncs state to connected clients.
- `packages/client2`: New React frontend (active development target). Renders synced state from the server as a pure projection with zero authoritative domain computation.
- `packages/client`: Legacy MVP React frontend. Maintained purely as a functional baseline for feature parity verification during migration to `client2`.
- `packages/worker`: Headless execution runner. Connects to the server from target machines to execute filesystem operations (`read`, `write`, `edit`), ripgrep searches (`list`, `glob`, `grep`), and native OS folder picker dialogs.
- `packages/extension-vscode`: Purely reactive VSCode bridge. Receives requests from the server to open files or render diffs for user review; does not make domain decisions.
- `packages/shared`: Shared domain contracts. Contains universal `zod` schemas, TypeScript types, sync protocols, and error definitions imported by all other packages.

### Package Boundaries & Communication

All clients (`browsers`, `workers`, `VSCode`) communicate with the server over `WebSocket` for real-time bidirectional messaging, using `HTTP` endpoints for authentication, session cookies, one-time ticket minting, and attachment transfers.

- `Client2 / Client`: Receives state sync snapshots/events; sends user commands (chat prompts, settings, branch navigation).
- `VSCode Extension`: Receives server requests to open files and display code diffs; returns user approval or rejection.
- `Shared`: Pure dependency package. Contains schemas, contracts, and types shared across all components.
- `Worker`: Receives filesystem and search tasks from the server and returns raw output.

---

## 6. Conversation & Execution Model

### Core Domain Entities

- `Workspace`: Root multi-tenant container for access control (RBAC/ACL), projects, and members.
- `Project`: Represents a distinct codebase/project folder. Each project requires an active execution worker binding (`executionWorkerId`) where all filesystem, git, and search tools execute.
- `Task`: A task/chat/conversation session. Tasks can be top-level or hierarchical child subtasks (`parentTaskId`) spawned by agentic tools (e.g. `explore`).
- `Branch`: A path in the conversation tree. Each task starts with a main branch and can spawn child branches via forks.
- `Message`: Deliberately restricted to `user` and `system` roles. Contains prompt text and references to task attachments. Assistant outputs and tool interactions are never stored as messages.
- `Response`: Represents a single LLM output cycle within a branch. Owns the generated assistant text, thinking/reasoning blocks, token usage statistics, UI state, and sequential tool calls.
- `Tool Use`: A structured tool invocation within a response. Tracks tool arguments, execution status (`streaming`, `pending`, `pending_approval`, `executing`, `completed`, `error`, `rejected`), execution results, and optional subtask links.
- `Task Run`: The execution lifecycle coordinator for a branch \[probably needs renaming when I'll work near it]. Manages multi-turn loops, tool orchestration pauses, approvals, and child run dependencies.

### Conversation Tree & Fork Mechanics

- `Tree Topology`: Branches form a strict tree (each branch has at most one `parentBranchId`).
- `Fork References`: A child branch forks from either a specific `forkFromResponseId` or `forkFromUserMessageId`.
- `Context Assembly`: When compiling conversation history for the LLM, Axon walks the ancestral branch chain from root to leaf, including ancestor messages and responses up to each branch's respective fork cutoff timestamp.

### Execution Turn & Tool Lifecycle

1. `User Input`: A user message (with optional attachments) is committed to the active branch, and a Task Run is enqueued.
2. `Context Compilation`: System prompt, ancestral branch history, and active branch messages/responses are chronologically interleaved into canonical LLM turns.
3. `Provider Streaming`: The LLM streams output. Generated text and thinking blocks stream to subscribers, while tool call chunks are ingested into streaming Tool Use records.
4. `Tool Orchestration`:
   - Read-only tools execute automatically.
   - Mutating tools (write, edit) pause in `pending_approval` state until the user approves or rejects them.
   - Batch-capable tools expand into indexed sub-items sharing the same source tool call.
5. `Worker Dispatch`: The server routes tool execution to the project's assigned worker via `executionService`. If the worker is offline, execution fails immediately with a deterministic error.
6. `Subtask Delegation`: Complex tools like `explore` spawn a child Task and child Task Run. The parent tool use pauses in `pending_subtask` until the child run finishes and reports back its final response.
7. `Continuation`: Tool results are committed, and the orchestrator triggers the next LLM turn until the model completes its task without further tool calls.

---

## 7. Core Architecture & System Boundaries

### 7.1 Server Authority & Client Projection

- `Single Source of Truth`: The server SQLite database is the sole authority for domain state, transactions, and sequence ordering.
- `Pure Projections`: Clients (client2) maintain zero local domain truth. They render synced state projections and keep only transient UI state.
- `Multi-Client Consistency`: Multiple clients subscribe to the same scopes and converge to identical state.

### 7.2 Dual-Transport Split: HTTP vs WebSocket

- `HTTP Transport`:
  - `Token Management`: Personal Access Token (PAT) creation, listing, and revocation.
  - `WebSocket Ticket Minting`: Short-lived, single-use ticket issuance (`POST /api/auth/ws-ticket`).
  - `Binary & File Payloads`: Multipart attachment uploads, raw blob streaming, image thumbnail downloads, and worker-to-server attachment transfers.
  - `Authentication & Sessions`: Password login/signup, session lookup, cookie management, logout.
- `WebSocket Transport`:
  - `Connection Handshake`: Authenticated via single-use ticket in `auth:connect`.
  - `RPC & Commands`: User prompts, task operations, branch creation/navigation, tool approvals.
  - `Real-time State Sync`: Scope subscriptions, snapshot delivery, replay streams, and live event broadcasts.
  - `Subsystem Control`: Worker command dispatch/results and IDE extension bridge commands.

### 7.3 Reactive Replayable Sync Protocol

- `Canonical Scopes`:
  - `workspace:{workspaceId}`: Workspace project catalog and project lifecycles.
  - `project:{projectId}`: Project metadata and top-level tasks.
  - `task:{taskId}`: Task metadata, all branches, and minimap graph items.
  - `branch:{branchId}`: Branch data, messages, responses, streaming deltas, and tool uses.
- `Monotonic Sequence Numbers`: Every scope maintains an independent, strictly increasing sequence number (`seq`). Snapshots capture state at sequence `N`; all events with `seq > N` represent incremental deltas.
- `Replay with Snapshot Fallback`: gap/missed events recovery, with fallback to a fresh authoritative snapshot.
- `Catch-Up Race Protection`: During subscription initialization, events arriving between snapshot cutoff and socket delivery are buffered, preventing race conditions before marking the subscription live.

### 7.4 Authentication & Authorization (AuthN/AuthZ)

- `Authentication Layers`:
  - `Browser`: Server-side opaque sessions stored in HttpOnly cookies with double-submit CSRF protection.
  - `Machine / CLI / IDE`: Personal Access Tokens (PATs) passed via Authorization headers.
  - `WebSocket Upgrade`: All sockets (client, worker, IDE) authenticate by minting a short-lived, single-use ticket over HTTP, atomically consumed during the `auth:connect` handshake.
- `Role-Based Access Control (RBAC) & ACLs`:
  - Global Roles: `admin`, `user`, `pending`.
  - Resource ACLs: Scoped at `workspace` (`owner`, `editor`, `viewer`), `project` (`manager`, `editor`, `viewer`), and `task` (`manager`, `editor`, `viewer`).
  - Inheritance: Workspace roles establish baseline roles for enclosed projects and tasks unless elevated by explicit resource grants. Branch access inherits directly from the parent task.
- `Revocation & Epochs`: Session or PAT revocations immediately disconnect associated WebSockets. Permission changes bump the user's authorization epoch, invalidating cached decisions and evicting stale subscriptions.

### 7.5 Worker Execution & Isolation Boundary

- `Project-to-Worker Pinning`: Every project is bound to an `executionWorkerId`. All filesystem reads/writes, ripgrep searches, git operations, and local dialogs run strictly on that assigned worker.
- `Fail-Fast Isolation`:
  - All project-bound operations route through `executionService`.
  - If the assigned worker is offline or disconnected, execution fails immediately with a deterministic error. There is no silent server-local fallback.
  - The tool registry dynamically suppresses project-bound tools when the target worker is unavailable.
- `Split-Transport File Operations`: Path-bound file attachment reads execute on the worker; the worker then uploads the resulting file stream to the server over HTTP using a short-lived, single-use upload ticket.

---

## 8. Codebase Exploration & Documentation Guidelines

### 8.1 Submodule Documentation (README.md)

- Every logical module and package submodule maintains a concise local `README.md` file.
- When researching, planning, or preparing to modify a module, always read its local `README.md` first before reading individual code files.
- Local `README.md` files provide high-level design rationale, submodule structure, domain quirks, future features and controversial decisions that are not immediately obvious from code alone.
- Some modules may not have `README.md` - then LLM must inform the dev to create one.

### 8.2 Reference Materials & Vendor Docs (docs/)

- External library documentation and architectural guidelines (e.g. React best practices, most of 3rd party key packages docs, OpenAI SDK references) reside in the `docs/` directory.
- Due to the size of documentation files under `docs/`, avoid reading them entirely into context with direct read tools.
- Always use the `explore` tool with focused queries to extract specific sections from `docs/` without bloating the context window.

---

## 9. Knowledge & Planning

### 9.1 Location & File structure

- **obsidian**/ follder in the root of the project should contain all plans/reflections
- **obsidian**/phases/999/ folder structure separates plans and reflections by phase number
- Name format for plan .md files: `DD-MM-YYYY - NAME.md` (e.g., `22-09-2026 - CHAT_VIEW.md`).

### 9.2 Flow of the planning

- First, discuss with the high level structure of the plan. When it's locked, write a skeleton that consists of X steps to achieve the goal of the plan.
- Second, go step-by-step through the plan, and enrich it with more detailed implementation tasks/invariants/decisions/etc.

---

## 10. Maintaining AGENTS.md

### 10.1 Purpose & Role

- AGENTS.md is the durable, high-level reference for Axon's architecture, philosophy, and system invariants.
- It is designed to be loaded into context during exploration, discussion, and high-level planning without consuming excessive token budget.
- It must remain low-churn and free of ephemeral implementation noise.

### 10.2 What Belongs Here

- High-level system philosophy and product vision.
- Key tech stack choices, runtime requirements, and OS prerequisites.
- Monorepo package topology and package boundaries.
- High-level domain concepts (Workspace, Project, Task, Branch, Message, Response, Tool Use).
- Architectural invariants (server authority, sync protocol, worker execution boundaries, auth models).
- Codebase navigation rules (README.md conventions and docs/ exploration).

### 10.3 What Does NOT Belong Here

- Low-level coding style rules, JSDoc formatting, and React hook rules (these belong in `DEV_RULES.md`).
- File-by-file refactor notes, changelogs, and temporary migration diaries.
- Sprint task checklists, implementation roadmaps, and step-by-step feature guides.
- Detailed database schemas, exhaustive SQL queries, or individual function signatures (code and local READMEs are self-documenting).
- Fleeting bug workarounds or transient environment hacks.

### 10.4 Update Protocol

- Update this document only when a change alters system invariants, introduces new packages, modifies communication transports, or changes core architectural boundaries.
- When an invariant or boundary changes, update` AGENTS.md` in the same session to prevent architectural documentation drift.
- If an instruction or invariant in `AGENTS.md` conflicts with the codebase, resolve the contradiction immediately rather than allowing drift to accumulate.
