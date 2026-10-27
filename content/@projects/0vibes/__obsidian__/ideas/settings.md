# Centralized Settings Plan (discussion dump)

## Purpose

This file captures only what was discussed in our conversation about implementing a centralized settings system in Axon, so it can be reused as standalone context in future conversations.

---

## Initial problem statement (from discussion)

You raised these uncertainties:

1. Storage model uncertainty:
   - Separate DB table for settings
   - vs a single JSON field
   - vs separate fields + memory cache

2. Performance uncertainty:
   - Cache settings in memory to avoid constant DB I/O + JSON parsing
   - vs keep it simple with DB reads

3. UI uncertainty:
   - Whether to use `react-hook-form`
   - Whether it auto-generates forms from JSON
   - vs just building reusable manual form components

4. Architecture concern:
   - Want clean settings access in code

---

## What we found in current codebase (as discussed)

1. There is no centralized settings system/table currently.
2. Existing config-like persistence already uses JSON in some places:
   - `tasks.modeConfigOverrides` (JSON)
   - `responses.uiState` (JSON)
   - `tool_uses.uiState` (JSON)
3. The project already has a strong server-authoritative sync pattern:
   - idempotent mutating commands (`commandId`)
   - transactional write + outbox emission
   - snapshot + ordered event replay/resume
4. On frontend, forms are currently manual React state; `react-hook-form` is not present.

---

## Recommendation direction discussed

### 1) Storage shape

Recommended direction discussed:

- Use a **dedicated centralized settings table**.
- Store settings in a **JSON blob per scope row**.
- Avoid per-setting DB columns as the default approach.
- Avoid mixing settings directly into unrelated entity tables as the default approach.

Rationale discussed:

- Better modularity for centralized settings.
- Less schema churn when adding/removing settings.
- Fits current server-authoritative + replayable architecture.

Also discussed:

- If specific keys become heavily query-critical, they can later be promoted to dedicated columns.

---

### 2) Caching

Caching conclusion discussed:

- Start without complex server cache (or keep cache very light).
- Current stack (SQLite + current usage) can typically start with direct DB reads + parse.
- Add cache later only if profiling/real behavior shows need.
- If cache is added, invalidation complexity must be treated carefully.

---

### 3) Sync/invariants integration

Discussed that settings should follow the same authoritative flow as other mutable domain state:

- Mutations are idempotent commands.
- DB change + outbox event in same transaction.
- Snapshots include settings state.
- Replay/resume carries settings updates.

Reason discussed:

- Preserve reconnect correctness.
- Preserve multi-client convergence.
- Preserve ordering guarantees.

---

### 4) Server code access architecture

Discussed clean access pattern:

- Central typed settings definitions (keys/defaults/validation).
- Repository for persistence operations.
- Service layer for normalize/validate/default/patch behavior.

Goal discussed:

- Keep raw JSON handling out of random call sites.

---

## react-hook-form discussion outcome

Clarification discussed:

- `react-hook-form` does **not** auto-generate forms from JSON by itself.
- It helps with form state/validation ergonomics.
- Auto-generated schema-driven forms require additional renderer logic.

Decision direction discussed for current state:

- Manual reusable components are valid and likely sufficient now.
- `react-hook-form` can be introduced later if forms become large/nested/highly dynamic.

---

## Migration/evolution discussion (important)

Question discussed:

- Is Drizzle migration approach easier than JSON parsing/validation/recreation when settings evolve?

Answer discussed:

- Drizzle migrations are easier for **DB structure changes**.
- But they do not remove the need for **settings evolution logic**.

### What was discussed for JSON settings evolution

1. **Adding a setting**
   - Missing key in old JSON should get default via normalize/validate logic.
   - Optional lazy write-back can persist normalized shape.

2. **Removing a setting**
   - Deprecated/unknown key in old JSON should be ignored/stripped by normalization.
   - Optional cleanup can happen on subsequent writes.

3. **Breaking shape changes**
   - Use versioned migration logic in app layer (e.g., normalize old shape to new).

Also explicitly discussed in project context:

- During current deep development phase, for breaking DB changes it is acceptable to instruct deleting DB files.

---

## Practical conclusion discussed

- Column-per-setting can feel easier when settings are very few and very stable.
- For a centralized system expected to evolve, the discussed direction was:
  - centralized table
  - JSON-based payload
  - strong runtime normalization/validation/defaulting
  - same server-authoritative transactional sync guarantees already used elsewhere.

---

## Scope note

This document intentionally contains only what was discussed in this conversation, without adding new design content beyond that discussion.
