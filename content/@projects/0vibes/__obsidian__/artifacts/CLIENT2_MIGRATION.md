# Client Migration Tracker (`packages/client` → `packages/client2`)

## 1) Purpose

This document is a **living migration tracker** for rewriting the client incrementally.
It is the canonical place to track:

- migration scope and strategy,
- architecture decisions,
- constraints/requirements/invariants,
- phase-by-phase progress,
- open questions and decision log.

> Migration style
> **Strangler pattern** (build `client2` in parallel, migrate by feature slices, then cut over and remove legacy `client`).

> Why?

1. I have poor knowledge of the existing client internals and want to incrementally learn and improve them.
2. The existing client has accumulated technical debt and architectural erosion that I want to avoid replicating.
3. Existing code of client was written mostly during prototyping phase, so it is not optimized for long-term maintainability or clarity.

---

## 2) Scope

### In scope

- Re-architect and rewrite client internals with long-term maintainability.
- Focus first on foundations (`lib + store + stores` equivalent layers), then feature slices.
- Run old and new clients in parallel against the same server for parity checks.

---

## 3) Non-Negotiable Constraints (from project constitution)

1. **Server-authoritative truth** must remain intact.
2. **Multi-client consistency** and convergence must hold.
3. **Reconnect + mid-stream resume** behavior must remain correct.
4. **Reactive UI** via snapshot/event sync model.
5. **Performance and efficient traffic** (no avoidable refetch loops).
6. **Cross-platform parity** (Windows/Linux/macOS).
7. **Execution target clarity** (worker target context must stay explicit).
8. **No DB migration effort** during deep development phase (breaking schema changes may require DB reset instruction).
9. **Long-term quality over MVP shortcuts**.

---

## 4) Rewrite Invariants (Client-Side)

These invariants must seems like good enough to have some reference but can be discussed and refined throughout migration:

1. `state/sync` (authoritative projection) is updated only via sync runtime (snapshots/events).
2. UI components do **not** issue raw protocol calls directly; they call feature/application actions.
3. UI-local state is isolated from authoritative state.
4. Scope sequencing guarantees (monotonic `seq`, gap handling, replay/snapshot fallback) are preserved.
5. Streaming state remains resumable and renderable after reconnect.
6. Mutating commands keep idempotency semantics (`commandId`).
7. Styling ownership boundaries stay clean:
   - primitives in shared UI,
   - patterns in shared patterns,
   - views/screens stay thin.

---

## 4.1) Client Persistence & Storage Policy (locked vision)

This section locks the persistence architecture decision for `client2`.
It should be treated as **stable default policy** unless an explicit future ADR overrides it.
Documentation on zustand persistence is at docs\zustand\reference\middlewares\persist.md

### Decision summary

1. **Single persistent storage system:** IndexedDB only.
2. **Backend direction:** started with `idb-keyval`; hardcut migration to **Dexie** completed in Phase **3.3.5**.
3. **Module boundary split (current):**
   - `core/db/*` owns Dexie DB/schema/errors/repositories,
   - `core/storage/*` is reserved for browser storage primitives only (`windowStorageClient`).
4. **No direct browser storage usage in feature/runtime code:** `localStorage` is forbidden. `sessionStorage` is allowed only through `core/storage/windowStorageClient` for per-window identity.
5. **Current persisted domain in 3.3.5:** layout sessions + maintenance checkpoint tables only.
6. **UI preferences persistence:** intentionally removed from active runtime path in current 3.3.5 slice (hydration gate remains, no persisted uiPreferences document).
7. **Authoritative data policy:** server-authoritative sync state is never persisted as local truth.

### Rationale

- The product is server-authoritative and primarily online-first; persisted data is only for local UI/session behavior.
- `idb-keyval` was valid for early bootstrap, but Phase 3 layout requirements needed indexed queries and deterministic cleanup.
- Dexie provides table/index semantics and removes key-merge/index-doc complexity.
- Architecture was simplified to concern-specific tables (no generic descriptor/envelope runtime).

### Current table model (3.3.5)

1. `layoutSessions`
   - identity: `&[userId+windowId]`
   - fields: `userId`, `windowId`, `workspaceId`, `layoutSchemaVersion`, `layout`, `createdAtMs`, `updatedAtMs`
   - indexes: `[userId+workspaceId+updatedAtMs]`, `updatedAtMs`
2. `maintenanceState`
   - stores cleanup checkpoint metadata (for 7-day cadence gating)

### Read/write behavior (current)

- Same window always upserts same `layoutSessions` row.
- Workspace switch in same window rewrites `workspaceId` on that row.
- Workspace listing uses `[userId+workspaceId+updatedAtMs]` query + reverse for DESC behavior.
- Strict corruption handling remains: log -> delete row -> throw.

### Reliability/maintenance policy (current)

- Cleanup runs startup-triggered and non-blocking.
- Cleanup cadence/checkpoint is maintained in DB (`maintenanceState`).
- Stale layout retention uses timestamp-based deletion via `updatedAtMs`.

### Historical note (superseded by 3.3.5 hardcut)

- Descriptor-based generic persisted docs (`PersistedDocDescriptor` + `{v,data}` envelopes) were used in earlier phase implementation.
- That model is no longer the active runtime persistence architecture after hardcut.

---

## 4.2) Design Tokens & Theming Policy (locked vision)

This section clarifies styling migration strategy for `client2`.

### Decision summary

1. **Do not inherit legacy theme/token system wholesale.**
2. **Phase #1 includes only a minimal token foundation** (core semantic tokens + essential sizing/spacing/radius/typography primitives).
3. **Token expansion is incremental and feature-driven** during component rewrites.
4. **Per-case token design is expected**: each migrated module can introduce/adjust semantic tokens as needed.
5. **Hard-coded palette utilities in feature/screens are discouraged**; prefer semantic token-backed classes.

### Practical interpretation

- We may temporarily reference old visual behavior for parity checks, but we do not copy legacy token architecture as a default.
- New components in `client2` should rely on semantic tokens that are intentionally designed for the new system.
- Token decisions should remain explicit and reviewable in migration phases.

---

## 4.3) Notification System Contracts (cross-cutting)

Notification planning and detailed scope logic are tracked in:

- [CLIENT2\_NOTIFICATION.md](CLIENT2_NOTIFICATION.md)

Migration-level contract notes (must remain aligned with that plan):

1. Notifications are event-based with explicit scope (`global/workspace/project/task/branch/subtask`) and lifecycle state (`new/seen/acknowledged/resolved`).
2. Connection lifecycle feedback is primarily a **global status-layer** concern (not per-tab repeated popups).
3. Attention markers (tab/branch/minimap) are scope-accurate and should not be auto-cleared by unrelated tab focus.
4. Notification history is global for the client window/session and must include source metadata.
5. Full notification UX is **not** part of Phase #1 package bootstrap; contracts are defined early, implementation lands in later phases.

---

## 4.4) Logging & Observability Policy (pragmatic mode, temporary)

To keep migration code readable and avoid noisy runtime files, `client2` currently uses a minimal logging strategy:

1. No persistent debug logs in normal code paths.
2. `info` logs are reserved for impactful lifecycle milestones (bootstrap start/result, runtime bridge attach/detach, runtime start/stop, hydration ready).
3. `warn` and `error` logs are mandatory for abnormal/failure conditions.
4. Log call sites should remain short, single-line, and inline.
5. Logs should use subsystem tags via logger scope (for example: `bootstrap/session`, `ws/runtime`, `sync/runtime`, `storage/client`).
6. Temporary focused debug logs are allowed for incident diagnosis, but should be removed after fix/verification.

This is intentionally a readability-first policy during migration velocity.
A richer structured logging pipeline may be introduced later if operational needs justify it.

---

## 4.5) Workspace Context & Navigation Contracts (Phase #3 planning lock)

This section locks architecture direction needed for upcoming shared-workspace support and shell UX evolution.

1. **User/session context is app-scoped.**
   - Auth identity, session lifecycle, and transport/runtime health remain global for the app window.

2. **Workspace context is tab-scoped (not app-scoped).**
   - The same authenticated user can have multiple workspace contexts open simultaneously in different tabs/panes.
   - This includes future scenarios like personal workspace in one tab and shared workspace in another.

3. **Sync subscription intent must follow tab context ownership.**
   - Workspace/project/task scope subscriptions are derived from active/open tab contexts.
   - Avoid introducing new architecture that assumes a single global `activeWorkspaceId` as authoritative navigation context.

4. **Navigation must be intent-driven and surface-agnostic.**
   - Navigation actions/contracts are stable regardless of presentation surface (side panel, modal, drawer, etc.).
   - UI surface choice is allowed to evolve without requiring state/runtime rewrites.

5. **Avoid navigation dead-ends.**
   - Entering project/task flows must preserve deterministic ways to return to project/workspace navigation.
   - Legacy “locked in selected project with no clear return path” behavior must not be reproduced.

---

## 5) Target Architecture (for `packages/client2/src`)

```text
src/
  app/                # composition root + global lifecycle gates/orchestration
  core/               # ws/http, sync runtime, config, errors, observability
  state/
    sync/             # server-authoritative projection only
    session/          # auth/connection/runtime status
    ui/               # local UI state (tabs/prefs/notifications)
  features/           # vertical slices (auth, project-list, workspace, task, chat, ...)
  shared/             # primitives, patterns, shared hooks/utils/types/styles
```

### Layer intent

- **app/**: bootstrapping, composition, and global lifecycle gates/orchestration.
- **core/**: feature-agnostic runtime internals.
- **state/**: explicit ownership boundaries for all state classes.
- **features/**: vertical product modules.
- **shared/**: reusable building blocks only.

---

## 6) Dependency Rules

1. `core/*` cannot depend on `features/*`.
2. `features/*` can depend on `core/*`, `state/*`, and `shared/*`.
3. `shared/*` must not depend on `features/*`.
4. `state/sync/*` remains protocol/domain projection layer, not UI behavior layer.
5. Avoid barrel files by default unless explicitly justified and documented.
6. Import policy in `client2`:
   - **same-module imports** use relative paths,
   - **cross-module imports** must use top-level aliases (`#app/*`, `#core/*`, `#state/*`, `#features/*`, `#shared/*`),
   - avoid deep `../../..` crossing between top-level modules.

---

## 7) Migration Strategy

1. Keep `packages/client` running as behavior oracle.
2. Build `packages/client2` in parallel.
3. Migrate by **feature/module slices**, not by arbitrary file movement.
4. Verify parity for each slice before moving to next.
5. Perform final cutover once core parity + quality gates are met.

---

## 8) Phase Tracker

| Phase | Name | Status | Goal |
|---|---|---|---|
| 1 | `client2` foundation package | Implemented | Create clean package baseline for incremental rewrite |
| 2 | Core runtime + state foundations | Implemented | Build `core/` + `state/` in task-bites (2.1–2.6), no feature migration yet |
| 3 | First vertical slices (auth/project/workspace shell) | In Progress | Deliver auth/project/workspace in task-bites (3.1–3.6) on top of Phase 2 |
| 3.3.5 | Storage backend uplift for layout sessions/history (`idb-keyval` → Dexie) | Implemented | Hardcut architecture completed (`core/db` + `layoutSessions`); verification + docs sync completed |

| 4 | Task/chat migration waves | Planned | Migrate high-complexity features safely |
| 5 | Cutover + legacy removal | Planned | Make `client2` primary and delete `client` |

---

## 9) Phase #1 — Create `packages/client2` foundation

## Objective

Create a new package named **`client2`** as a stable, long-term foundation for phased rewrite.

## Deliverables

1. New package directory: `packages/client2`.
2. Vite + React + TypeScript baseline wired for monorepo.
3. Independent dev port (parallel run with old client).
4. Base folder skeleton aligned to target architecture.
5. Minimal app shell confirming build + run pipeline works.
6. Initial docs/readme in `client2` explaining architecture intent.

## Suggested initial skeleton

```text
packages/client2/
  package.json
  tsconfig.json
  vite.config.ts
  index.html
  src/
    app/
    core/
    state/
      sync/
	  	reducers/
		selectors/
      session/
      ui/
    features/
    shared/
    main.tsx
    App.tsx
```

---

## 9.1) Phase #2 — Core runtime + state foundations (task-bites)

Phase #2 is intentionally split into focused implementation bites.
Each bite should be individually reviewable and mergeable.

### 2.1 Transport baseline (`core/ws` + `state/session` minimal)

**Status:** ✅ Implemented

Scope:

- WebSocket client lifecycle manager (connect/disconnect/reconnect),
- typed request/response correlation bus,
- connection status + health state in `state/session`.

Implemented in this slice:

- Added session runtime store contracts (`state/session`) with explicit auth/connection/health transitions.
- Implemented modular WS runtime (`wsRuntime`, `wsConnectionSession`, `wsHealthMonitor`, `wsReconnection`) with stale-attempt guards.
- Implemented async request bus (`wsRequestBus` + registry) with request/correlation IDs, timeout, abort support, deterministic pending cleanup.
- Added normalized async transport error taxonomy and command protocol layer (`commandClient`) for centralized `commandId` behavior.
- Preserved transport/store boundary via runtime bridges (no direct transport -> UI coupling).

Done when:

- `client2` can connect/disconnect deterministically,
- request/response correlation works with timeout handling,
- no UI component directly owns socket lifecycle.

### 2.2 Sync runtime skeleton (`core/sync`)

**Status:** ✅ Implemented

Scope:

- scope subscription contracts,
- snapshot/event intake pipeline,
- sequence/gap detection and fallback triggers.

Implemented in this slice:

- Added `core/sync/syncRuntime` with ref-counted desired scopes (`manual` + reserved `autoSubtask`).
- Implemented subscribe/unsubscribe orchestration, in-flight request tracking, and stale response protection.
- Added reconnect-aware behavior via transport snapshot integration (`ready` -> `resubscribeAll`).
- Added bounded buffering for events while awaiting snapshot, with overflow recovery.
- Added deterministic seq gating and gap recovery path (`resubscribe(scope)` on gap/error).

Done when:

- runtime can subscribe to a scope and process snapshot/events in order,
- gap path is explicit and testable,
- reconnect path does not violate sequencing invariants.

### 2.3 Authoritative projection store (`state/sync`)

**Status:** ✅ Implemented

Scope:

- base sync store structure,
- reducer contracts per scope class,
- selector layer for feature consumption.

Implemented in this slice:

- Implemented authoritative snapshot projection by scope (`workspace/project/task/branch`) with strict scope/snapshot compatibility checks.
- Added centralized deterministic ordering helpers and branch indexes (`toolUsesById`, `responseIndexById`).
- Implemented reducer extraction under `state/sync/reducers/*` and real event projection path in `syncStore.applyEvent`.
- Added replay fallback hardening when replay is requested without local baseline.
- Enforced scope lifecycle metadata transitions (`idle/awaitingSnapshot/replaying/live/error/notFound`) via sync runtime/store contracts.

Done when:

- authoritative projection updates only via sync runtime -> reducers,
- selectors are stable and reusable,
- no UI-local state leaks into `state/sync`.

### 2.4 Storage boundary + persistence policy (`core/storage` + `state/ui` seeds)

**Status:** ✅ Implemented

Scope:

- IndexedDB adapter (`idb-keyval`) behind `core/storage`,
- versioned envelope/migration helpers,
- first UI-local persisted document(s) (e.g. shell/layout seed).

Implemented in this slice:

- Added descriptor-driven storage boundary (`storageClient`) with versioned envelope pipeline: parse -> version -> migrate -> validate (+ write-back on migration/fallback).
- Added IndexedDB backend integration via `idb-keyval`.
- Implemented user-partitioned key policy and canonical key builders.
- Added persisted UI docs (`workspaceLayoutDoc`, `uiPreferencesDoc`) with strict/fallback policies.
- Added startup UI hydration barrier before runtime attach for first-paint-affecting docs.

Done when:

- IndexedDB-backed persistence is the default in `client2` through `core/storage`,
- persisted reads follow parse -> version -> migrate -> validate flow,
- fallback/reset behavior is deterministic and logged.

### 2.5 Error + observability baseline (`core/errors`, `core/observability`)

**Status:** ✅ Implemented

Scope:

- normalized client error types and mapping,
- structured logging baseline for ws/sync lifecycle,
- correlation context support for command/sync diagnostics.

Implemented in this slice:

- Added scoped client logger (`core/observability/logger`) and migrated runtime hotspots away from raw `console.*`.
- Added lifecycle-impact logging at bootstrap/runtime boundaries while keeping debug-noise low.
- Added normalized runtime error model (`RuntimeError`: `invariant | validation | state`) and replaced ad-hoc throws in runtime/storage/bootstrap paths.
- Aligned storage corruption handling with typed `StorageError` semantics.

Done when:

- transport/sync failures surface through consistent error contracts,
- logs are structured and actionable,
- debugging reconnect/gap behavior is practical.

### 2.6 Boundary enforcement rails (import + layering rules)

**Status:** ✅ Implemented

Scope:

- enforce import policy:
  - same top-level module -> relative imports,
  - cross top-level modules -> aliases,
- enforce layering constraints (especially `core` not depending on `features`).

Implemented in this slice:

- Added lint enforcement to block barrel-style re-exports by default.
- Kept composition-root ownership pattern (`app/runtime/runtimeServices`) for concrete singleton wiring.
- Added centralized runtime lifecycle bridge to enforce deterministic attach/detach ordering.
- Added storage maintenance/window identity groundwork under `core/storage` with explicit bounded responsibilities.

Done when:

- violations are caught during lint/review,
- boundary policy is documented and active,
- new code naturally follows module ownership rules.

### Phase #2 exit criteria

- ✅ Bites 2.1–2.6 are completed and integrated,
- ✅ `client2` runtime/state backbone is stable,
- ✅ Phase #3 can start feature-slice migration without refactoring foundations again.

---

## 9.2) Phase #3 — First vertical slices (task-bites)

Phase #3 proves the migration approach end-to-end on real product slices,
without entering full task/chat complexity yet.

### 3.1 Auth bootstrap + runtime gating

**Status:** ✅ Implemented

Scope:

- authenticated/unauthenticated bootstrap flow,
- app-level runtime gating based on auth phase.

Implemented in this slice:

- Added app-level auth orchestration under `app/auth/authController` for bootstrap/sign-in/sign-up/sign-out and WS auth-failure invalidation.
- Expanded `state/session` auth lifecycle phases to explicit transitions (`checking`, `authenticating`, `authenticated`, `signingOut`, `unauthenticated`).
- Added global `app/auth/AuthGate` to route unauthenticated users to `AuthView` and gate authenticated shell startup.
- Added `app/auth/AuthView` (sign-in/sign-up UI) wired to controller actions instead of direct store/protocol calls.
- Extended `core/http/sessionApi` with full auth HTTP surface (`login`, `signup`, `logout`) plus existing `getSession`/`mintWsTicket` and boundary validation.
- Centralized runtime auth invalidation by delegating WS auth failure handling from runtime bridge to app auth controller.
- Removed temporary debug-heavy App shell and kept only lifecycle essentials (auth bootstrap, UI hydration barrier, runtime attach gate).

Done when:

- ✅ auth bootstrap is deterministic,
- ✅ unauthorized state cleanly routes to auth UI,
- ✅ runtime starts only when allowed.

### 3.2 Workspace/project authoritative read model

**Status:** ✅ Implemented

Scope:

- workspace scope subscription orchestration for shell entry,
- project list rendering from authoritative sync state,
- architecture aligned to tab-scoped workspace context (future shared workspace readiness).

Implemented in this slice:

- Added authoritative workspace catalog selectors under `state/sync/selectors` (`workspaceSelectors`, `syncMetaSelectors`) for stable read-model consumption.
- Added feature-owned workspace scope subscription orchestration hook under `features/workspace` with explicit subscribe/unsubscribe + resubscribe contracts.
- Added read-first workspace shell/catalog components (`WorkspaceShell`, `WorkspaceHomeView`; initially introduced as `WorkspaceProjectCatalogView`) with sync-lifecycle-aware rendering (`loading`, `error`, `notFound`, `empty`, populated list).
- Composed workspace shell into authenticated+hydrated app ready path so catalog is now rendered from authoritative projection state.
- Kept boundary rules intact after refactor by removing `runtimeServices` aggregator and wiring singleton ownership at module boundaries; `syncRuntime` is composed/exported from `state/sync/syncRuntimeInstance`.

Done when:

- ✅ project catalog is driven by snapshot/events,
- ✅ reconnect preserves consistency,
- ✅ no client-derived authoritative shortcuts are introduced,
- ✅ no new coupling to single app-global workspace navigation context is introduced.

### 3.3 Project selection + workspace shell entry

**Status:** ✅ Implemented

Scope:

- select project -> enter workspace shell,
- shell-level state ownership boundaries,
- navigation contracts that are presentation-surface agnostic (side panel/modal/drawer ready).

Implemented in this slice so far:

- Renamed workspace entry read view to `WorkspaceHomeView` (replacing transitional naming `WorkspaceProjectCatalogView`).
- Renamed local catalog framing component from `CatalogShell` to `ProjectCatalogView` for clearer ownership semantics.
- Added project selection intent from `WorkspaceHomeView` list items.
- Added minimal `ProjectShell` placeholder (read-only, authoritative project projection display).
- Added shell-local project selection ownership in `WorkspaceShell` via local selected project reference (`workspaceId` + `projectId`) instead of introducing temporary app-global navigation state.
- Project selection now transitions from workspace home to project shell within the same shell context.

Completed in this slice:

- Implemented deterministic in-app return path from project workspace context back to `WorkspaceHomeView`.
- Preserved shell-local ownership for project selection/return intents without introducing app-global navigation state.
- Kept navigation contract direction presentation-surface agnostic for upcoming 3.4+ layout/navigation expansion.

Done when:

- ✅ selection and shell routing are stable,
- ✅ state ownership is explicit (`sync` vs `session` vs `ui`),
- ✅ deterministic in-app return path from project shell to workspace home is implemented,
- ✅ navigation contracts are aligned with presentation-surface-agnostic direction (side panel/modal/drawer ready).

### 3.3.5 Storage backend uplift for layout sessions/history (`idb-keyval` → Dexie)

**Status:** ✅ Implemented (hardcut architecture verified; docs sync completed)

Context / why this was inserted:

- During 3.4 implementation attempts, we validated that **per-project-only layout persistence conflicts with multi-project-in-parallel workspace tabs**.
- Brainstormed options showed real product needs for both:
  - per-window/session active layout restore,
  - optional restore from older layouts/session history.
- With `idb-keyval`, implementing cross-window session listing/history requires index-doc read/modify/write merge logic and revision handling that adds correctness complexity too early.
- We now have concrete need for table/index querying, so Dexie adoption is justified.

Research requirement for any LLM implementation session:

- Read **first**: [`docs/dexie/llms.txt`](./docs/dexie/llms.txt)
- Then review relevant docs under: [`docs/dexie/`](./docs/dexie/)
- Because Dexie docs are large, **use `explore` tool first** to navigate and summarize before opening individual files.

Scope:

- Introduce Dexie-backed persistence under `core/db` (parallel to `core/storage`).
- Keep `core/storage` focused on `windowStorageClient` only.
- Migrate layout/session persistence domain first (no broad rewrite of unrelated persistence domains in this bite).
- Define minimal schema/indexes for workspace layout sessions/history queries.
- Keep server-authoritative boundaries intact (local DB is UI/session persistence only).

Brainstormed options captured (decision context):

1. **Per-session/window only** active layout (auto restore, resets when session/window lifecycle is gone).
2. **Per-project only** layout (simple keying but incompatible with intended multi-project side-by-side usage).
3. **Global per-user persistent layout** (easy restore but undesirable when user wants clean starts).
4. **Hybrid (selected direction):**
   - active layout is window/session-scoped,
   - history/restore list is workspace-scoped for the user,
   - manual restore from history is explicit UX action.

Edge cases to cover in design/implementation:

- Two windows with different workspace layouts must coexist without overwriting each other.
- Reload in same window must restore active session layout deterministically.
- History ordering must be deterministic (`updatedAt DESC`).
- Duplicated/near-identical layouts are acceptable initially; dedupe is optional later.
- Retention/cleanup must be timestamp-based (`updatedAt`) and non-blocking.
- Corrupted layout payload must fallback/reset deterministically and remain observable via logs.

Done when:

- Dexie backend is wired under `core/db` (`database/schema/errors/repositories`).
- `layoutSessions` table powers window-scoped upsert and workspace-scoped listing queries without index-doc anti-patterns.
- Legacy descriptor/idb-keyval runtime path is fully retired from active code paths.
- Cross-window/session layout listing primitives required by 3.4 are available and tested manually.

### 3.4 Workspace tabbed shell baseline + layout persistence (tab-first authority)

**Status:** ✅ Implemented

Scope:

- convert workspace shell to tab-host architecture (post-auth always tabbed),
- define typed tab descriptor contracts as canonical navigation context authority,
- seed post-auth shell with a single `workspace` tab,
- support opening parallel workspace-scoped tabs (multi-workspace in same window),
- persist/restore FlexLayout model through `core/db` (`layoutSessions`) with strict validation and deterministic reset on corruption,
- introduce tab-scoped context provider/hooks for scene access ergonomics (descriptor remains source of truth),
- derive sync subscription intent from open-tab descriptor union (add/remove scopes by tab lifecycle),
- keep deterministic in-app return/navigation paths via descriptor-driven actions (no implicit global fallback).

Baseline tab descriptor kinds (initial):

- `workspace`: `{ kind: 'workspace', workspaceId }`
- `project`: `{ kind: 'project', workspaceId, projectId }`
- `task`: `{ kind: 'task', workspaceId, projectId, taskId }` (can be enabled later if not used in first increment)
- `branch`: `{ kind: 'branch', workspaceId, projectId, taskId, branchId }` (can be enabled later if not used in first increment)

### Post-3.4 continuity notes (tab-first shell)

- Layout persistence remains window-scoped (`userId + windowId`) and stores a full tabbed model snapshot.
- `layoutSchemaVersion` hardcut was bumped to `2` to invalidate pre-tab-descriptor rows.
- Hydration now requires at least one valid descriptor-backed workspace tab; invalid models are purged/reset deterministically.
- Scope subscriptions are now derived from open-tab descriptor union and reconciled at layout-host level.
- Shared-workspace listing is intentionally deferred; architecture already supports additive multi-workspace tabs when list source is introduced.

### 3.5 Task list shell (read-first)

**Status:** ✅ Implemented

Scope:

- task list in workspace on top of project/task scopes,
- read-oriented baseline only (no full task/chat migration yet).

Implemented in this slice:

- Added authoritative project/task selector modules for read-model consumption (`state/sync/selectors/projectSelectors.ts`, `state/sync/selectors/taskSelectors.ts`).
- Replaced `ProjectShell` placeholder with read-first authoritative task list rendering (sync lifecycle states + retry path + deterministic workspace return action).
- Added `TaskShell` as minimal read-only task metadata scene (task scope lifecycle-aware rendering, no mutations/chat).
- Wired same-tab project->task and task->project transitions via descriptor replacement in `WorkspaceTabbedLayout`.
- Kept subscription ownership descriptor-driven (`workspace/project/task` scopes derived from open-tab union), with explicit retry resubscribe hooks.

Done when:

- ✅ task list is stable and reactive,
- ✅ authoritative updates flow correctly into UI.

### 3.6 Reconnect/parity hardening for migrated slices

**Status:** ✅ Implemented

Scope:

- reconnect and in-flight state hardening for migrated slices (`auth`, `workspace`, `project`, `task-list`),
- reference-informed behavior verification using legacy client as a comparison oracle where useful,
- avoid strict behavior cloning when client2 architecture intentionally differs for long-term quality.

Implementation direction lock (3.6):

- Legacy client is a **reference**, not a strict parity target.
- Do **not** add global connection-status UI in this phase (planned with notification system).
- Prefer architecture-level resilience improvements over UI-level temporary indicators.

Manual verification matrix (3.6):

1. Auth/runtime lifecycle:
   - startup with valid session -> deterministic authenticated bootstrap + runtime attach,
   - startup unauthenticated -> deterministic auth gate behavior,
   - terminal WS auth failure while active -> deterministic transition to unauthenticated.

2. Reconnect behavior for migrated slices:
   - verify `workspace`, `project`, and `task` tab contexts under:
     - short disconnect,
     - longer disconnect,
     - server restart / replay miss (snapshot fallback path).
   - expected: no stuck loading loops, deterministic recovery to live/error/notFound states.

3. In-flight subscription safety:
   - disconnect during `sync:subscribe` in-flight,
   - reconnect while prior attempts are stale,
   - verify stale in-flight responses cannot mutate active scope state.

4. Tab-driven scope reconciliation:
   - open/replace/close workspace/project/task tabs in varying order,
   - verify descriptor-union subscription reconciliation remains stable and deterministic.

5. Persistence continuity under reconnect:
   - preserve tabbed layout session behavior across reload/disconnect scenarios,
   - verify reconnect does not corrupt/overwrite deterministic layout hydration flow.

Done when:

- manual verification matrix is executed and results are acceptable for Phase #3 scope,
- reconnect/in-flight behavior is accepted for migrated slices under current architecture,
- legacy comparison does not reveal critical regressions in intended behavior,
- Phase #4 (task/chat waves) can begin.

### 3.6 Verification Run Log (template)

Use this table during 3.6 execution. Mark each row with concrete outcome and brief evidence notes.

| Scenario | Expected behavior | Result (pass/fail) | Notes / date |
|---|---|---|---|
| Auth bootstrap (valid session) | Deterministic authenticated bootstrap; runtime attaches only after gate readiness | Pending | |
| Auth bootstrap (unauthenticated) | Deterministic auth-gate fallback; no unintended runtime attach | Pending | |
| WS auth failure while active | Deterministic transition to unauthenticated; runtime/session reset is clean | Pending | |
| Reconnect: short disconnect (workspace tab) | Scope recovers to live/error/notFound without stuck loading loop | Pending | |
| Reconnect: short disconnect (project tab) | Scope recovers to live/error/notFound without stuck loading loop | Pending | |
| Reconnect: short disconnect (task tab) | Scope recovers to live/error/notFound without stuck loading loop | Pending | |
| Reconnect: longer disconnect (workspace/project/task tabs) | Stable recovery behavior with no retry storms | Pending | |
| Server restart / replay miss path | Deterministic snapshot fallback; projection remains coherent | Pending | |
| In-flight subscribe interrupted by disconnect | Stale in-flight responses do not mutate active scope state | Pending | |
| Tab scope reconciliation stress (open/replace/close order changes) | Descriptor-union scope subscriptions remain deterministic and stable | Pending | |
| Reload + layout persistence continuity under reconnect | Layout hydration remains deterministic; reconnect does not corrupt persisted layout flow | Pending | |

### Phase #3 exit criteria

- Bites 3.1–3.6 plus 3.3.5 are completed,
- auth -> project list -> workspace shell -> task list flow is stable,
- layout/session persistence behavior is stable under reload + multi-window usage,
- architecture boundaries hold under real usage.

---

## 10) Decision Log

> Use this section for durable architecture decisions only.

- **D-001**: Rewrite will use parallel package strategy (`packages/client2`) instead of in-place refactor.
- **D-002**: Migration pattern is incremental strangler, feature-slice based.
- **D-003**: State architecture in `client2` is split into `state/sync`, `state/session`, `state/ui`.
- **D-004**: `client2` uses IndexedDB as the only persistent client storage mechanism.
- **D-005**: `idb-keyval` is selected as the initial IndexedDB backend.
- **D-006**: No direct `localStorage` usage is allowed in new `client2` code. `sessionStorage` is allowed only through `core/storage/windowStorageClient` for window identity.
- **D-007**: Zustand `persist` remains optional; if used later, it must integrate through approved client persistence boundaries (not direct browser APIs).
- **D-008**: `client2` will not inherit the legacy token/theme system wholesale; it starts with a minimal token foundation and expands tokens incrementally per migrated module.
- **D-009**: `client2` import conventions are locked: relative imports inside same top-level module, alias imports for cross-module references (`#app/*`, `#core/*`, `#state/*`, `#features/*`, `#shared/*`).
- **D-010**: (Superseded by 3.3.5 hardcut) Generic descriptor-based persisted document contracts are no longer the active runtime persistence model.
- **D-011**: Persisted DB records are user-partitioned by schema design; for layout sessions, identity is `userId + windowId` with `workspaceId` as query scope field.
- **D-012**: Startup hydration barrier remains before runtime attach; in current 3.3.5 slice it hydrates gate state without persisted uiPreferences docs.
- **D-013**: During migration, client2 logging uses pragmatic mode (no persistent debug, lifecycle-focused info, mandatory warn/error, short inline call sites).
- **D-014**: Client2 uses normalized runtime errors (`RuntimeError`) for invariant/validation/state failures instead of ad-hoc `throw new Error(...)` in runtime/storage/bootstrap paths.
- **D-015**: `sessionStorage` usage in `client2` is restricted to centralized window identity management via `core/storage/windowStorageClient`; it is not used as a generic persistence backend.
- **D-016**: Storage maintenance runs as a throttled background task with bounded cleanup scope and must never block startup hydration/runtime attach.
- **D-017**: Auth lifecycle orchestration in `client2` is app-owned (`app/auth/*` with global `AuthGate`), while protocol calls remain in `core/http/sessionApi` and state projection remains in `state/session`.
- **D-018**: Workspace navigation context in `client2` is tab-scoped; user/session/runtime identity remains app-scoped.
- **D-019**: Phase 3+ subscription orchestration must follow tab context ownership and avoid introducing new single global workspace navigation authority.
- **D-020**: Navigation contracts are intent-driven and UI-surface-agnostic so side panel/modal/drawer can change without refactoring state/runtime boundaries.
- **D-021**: `client2` runtime singleton wiring no longer uses an app-level `runtimeServices` aggregator; singletons are exported from subsystem modules, and `syncRuntime` composition/export is owned by `state/sync/syncRuntimeInstance` to preserve feature/app boundary hygiene.
- **D-022**: Phase 3.3 baseline project selection ownership is shell-local (`features/workspace/WorkspaceShell`) and intentionally avoids introducing temporary app-global navigation state before tab/layout architecture is finalized.
- **D-023**: Phase 3.3 introduces same-shell context transition (`WorkspaceHomeView` -> `ProjectShell`) with a minimal read-only project shell placeholder as the migration baseline.
- **D-024**: Deterministic in-app return navigation from `ProjectShell` is intentionally deferred to Phase 3.4+ navigation/layout integration; hard page reload is accepted as temporary development-time escape only.
- **D-025**: Dexie adoption is approved for `client2` storage backend uplift starting in Phase 3.3.5, triggered by workspace layout session/history query requirements.
- **D-026**: Dexie persistence lives under `core/db`; feature modules must not import Dexie directly.
- **D-027**: Workspace layout persistence direction is hybrid: active layout is session/window-scoped; history/restore catalog is user+workspace scoped.
- **D-028**: 3.3.5 hardcut moved Dexie implementation from `core/storage/db/*` to `core/db/*` to keep DB concerns isolated from browser storage primitives.
- **D-029**: `core/storage/*` is now reserved for window identity/sessionStorage boundary (`windowStorageClient`) and does not own IndexedDB persistence.
- **D-030**: `ProjectWorkspaceLayout` currently uses `layoutSessionRepository` directly for read/write and strict corruption purge flow (intentional simplification for current migration slice).
- **D-031**: UI preferences persistence document path was removed from active runtime in 3.3.5; hydration gate remains without persisted preference payloads.

---

## 11) Open Questions

- For first shell UX iteration in Phase 3.x, which primary navigation surface should ship first:
  - side panel (desktop-first),
  - modal/drawer launcher (contextual),
  - hybrid (responsive side panel + mobile drawer/modal)?
