# Client2 Notifications Plan

## User vision (verbatim)

```text
1. I don't know about scope. Like for example
    - error happens during streaming in some task. I want to see notification in that task tab.
    - during my work disconnection happened. I want to see this notification in window scope. Not like repeated for every tab of flexlayou. But either in some main flexlayout container OR in top-containers outside of flexlayout.
    - notification about update and about disconnect - kinda different in how much explicit/clear/distracting they should be. For example, for disconnect notification I would like some additional effect like maybe red gradient border for window inside perimeter. And orange on connection attempt.
        - But also there's main popup location. Like maybe we don't even need popup for disconnect/reconnect. So maybe it's border effect only + log in history.
		- IMPORTANT. Sync replay state indication
			- When we're in replay state - also use same styling as for disconnect.
			- BUT add 1 second lag around this. So if replay happens super fast in like 10ms - it still can be visible to user(will be visible ~2010ms), so user would know that something happened, but it won't be disruptive. 
        - But we need popup for update (without border effect)
2. History.
    - Seems like notification history is useful thing. Like we should have button somewhere. that will open modal with notifications history. But i'm not sure on scope persistence of it. Maybe session only, to survive random page refreshes/reconnects.
    - So it means notifications should have maybe something like short text for popup, and then full text in notification history modal
    - And log button would be tough one a bit because we need to find location for it that won't conflict with flexlayout. Like it should be single button for history of all notifications from all windows.
    - And also since it's global history - we need to have source tracking. Like update notification came from system source (or just hide source), and streaming error notification came from task source (maybe like add short task title to source?)
4. Sound.
    - I wanted to have a feature for bluetooth headphones to warm-up connection before playing notification (because otherwise it might me swallowed during waking up of headphones from sleep state)
    - So I guess we either defer it or we need to think through sound middleware/service that can centralize logic like this. Like, for example, we run sound with 500ms warmup + delay for 500ms popup show up. 
5. Another scope nuance.
    - If error during LLM streaming happened in background tab - I want to visualize it somehow with tabs with "viewed" tracking.
    - For example, error during LLM streaming happened in background tab, that background tab in tab list will have maybe like notification dot that won't hide unless we view that error
    - But here's the thing. We have branches. We have subtasks. So such notification should be linked to stuff like this, so it can be visible on task's minimap? So just opening such tab won't mark notification as viewed unless we open that branch.
    - With subtasks it's a bit more complex because on error we may just re-run subtask remotely, without opening it, so I guess there also must be a way to reset such "notification" state remotely.
6. Another scope nuance
    - Approval notifications.
    - It's not clear to me that this should be linked to current notification system. Like from one perspective it's a bit confusing to wire tools with such global notification system.
    - From another perspective it seems like right long-term move because then we have centralized notification logic.
    - Another big nuance is that for approval I'll maybe would want ability for remote approval. Like we have background task. And tool called approval logic + notification. And I'm thinking about ability to approve through flexlayout tab. Like maybe hover mouse, small window with approve/decline shows up. BUT. Maybe it's not related to notifications at all. Like tab can have it's own checking logic (if viewed branch has approval pending, show this tab's ui on hover)
7. Another scope nuance.
    - Notification when background streaming done.
    - Again not clear about whether it should be included in global notification logic. Seems like right thing to do for centralization. And logic overlap.
```

---

## 1) Refined model

To avoid scope confusion and UX inconsistency, `client2` will use **three coordinated layers**:

1. **Global Status Layer** (stateful, non-spammy)
   - For connection lifecycle (`connected`, `reconnecting`, `disconnected`) and similar app-wide conditions.
   - Rendered once in app shell / top container (outside per-tab repetition).
   - Can include finite visual emphasis (e.g., perimeter accent) without persistent looping animation.

2. **Notification Center Layer** (event feed + history)
   - For discrete events (update available, streaming failed/completed in background, approval-required events).
   - Supports history modal, read/unread, and source metadata.
   - Session persistence by default.

3. **Context Attention Layer** (where action is needed)
   - Badges/dots/markers on tabs, task/branch, minimap, etc.
   - Visibility tied to precise scope target (task/branch/subtask), not merely “tab opened”.

This split enables centralized logic while preserving context-aware UX.

---

## 2) Scope and event contracts (global migration-level)

### Scope kinds

- `global`
- `workspace:{workspaceId}`
- `project:{projectId}`
- `task:{taskId}`
- `branch:{branchId}`
- `subtask:{taskId}`

### Event contract (conceptual)

```ts
NotificationEvent {
  id: string;
  type: string;                 // e.g. connection.disconnected, stream.error, update.available
  severity: 'info' | 'warning' | 'error' | 'success';
  scope: ScopeRef;
  sourceLabel?: string;         // e.g. System, Task "Refactor X"
  title: string;                // short popup/history title
  summary?: string;             // short body for toast
  details?: string;             // full details for history modal
  createdAt: number;
  actions?: NotificationAction[];
  channels: NotificationChannels;
  state: {
    seenAt?: number;
    acknowledgedAt?: number;
    resolvedAt?: number;
  };
  dedupeKey?: string;           // suppress duplicates/coalesce bursts
}
```

### Channel contract (per event policy)

- `status`: app-level status strip/chip
- `toast`: transient popup
- `history`: notification center list
- `badge`: tab/branch/minimap marker
- `sound`: optional audio signal
- `borderAccent`: finite visual border emphasis (non-looping)

---

## 3) Rules for key scenarios

1. **Disconnect/reconnect**
   - Primary channel: `status` (+ optional `borderAccent`).
   - Must not generate repeated per-tab toasts.
   - Should be recorded in `history` with coalescing.

2. **Update available**
   - `toast + history`.
   - Source can be `System` (or hidden if intentionally generic).

3. **Streaming error in background task/branch**
   - `history + badge`, optional `toast`.
   - Badge clear condition must be scope-accurate (branch/subtask aware).

4. **Streaming complete in background**
   - `history`, optional `toast/sound` via policy.

5. **Approval required**
   - Must emit global event for consistency (`history + badge`).
   - Context-specific quick actions may be rendered in tab/branch UI separately.

6. **Viewed semantics**
   - “Read” is tied to target scope/anchor (task/branch/subtask + optional item anchor).
   - Opening unrelated tab must not auto-clear branch-level alerts.
   - Remote/system resolution is allowed (e.g., subtask retried/resolved elsewhere).

---

## 4) Persistence and lifecycle policy

1. Notification history persistence target: **session-lifetime** (survives refresh/reconnect).
2. Storage backend in `client2`: via `core/storage` (IndexedDB-backed policy).
3. Lifecycle states:
   - `new` (unseen)
   - `seen` (user noticed)
   - `acknowledged` (explicitly handled/cleared)
   - `resolved` (no longer actionable)
4. Coalescing/dedup required for noisy streams (especially connection flaps).

---

## 5) Audio policy (deferred but designed)

A dedicated `NotificationAudioService` should own audio logic.

Phase-later behavior can include:

- optional warmup tick for sleeping BT devices,
- configurable delay before primary sound,
- per-event sound routing,
- graceful no-op under browser autoplay restrictions.

No mandatory audio implementation in foundation phase.

---

## 6) Implementation timing across migration phases

### Phase 1 (`client2` foundation)

- Define contracts + placeholders only.
- No full notification feature wiring.

### Phase 2 (core runtime + state foundations)

- Add notification domain/state skeleton (`state/ui/notifications`).
- Wire status layer for connection lifecycle at app shell level.

### Phase 3 (workspace shell + first slices)

- Add notification center modal/button in global shell.
- Add initial history feed and basic toasts.

### Phase 4 (task/chat waves)

- Add branch/task/subtask attention markers.
- Integrate streaming error/complete + approval-required events.

### Phase 5 (polish/cutover)

- Advanced quick actions, audio middleware, tuning/coalescing heuristics.

---

## 7) Open decisions

1. Exact retention cap for session history (count/time-based).
2. Final policy matrix for when background completion should toast/sound.
3. Whether approval quick-actions are part of Notification Center UI or task-tab hover UI first.
4. Exact visual treatment for border accents that remains finite and non-disruptive.

---

## 8) Decision seeds (to confirm later)

- **N-001 (proposed)**: Notifications are modeled as events with explicit scope and lifecycle state.
- **N-002 (proposed)**: Connection lifecycle is a status-layer concern first, not toast-first.
- **N-003 (proposed)**: History is global and session-persistent.
- **N-004 (proposed)**: Approval and background streaming notifications share central event backbone, with specialized context UI allowed.
- **N-005 (proposed)**: Audio is deferred; service boundary is introduced before behavior.
