# Overview

## Role & Purpose

The `branch` domain is the conversation and execution engine of Axon.
It subscribes to the authoritative `branch:{branchId}` sync scope and renders the conversation history, streaming responses, reasoning traces, tool executions, and user prompt inputs.

Unlike a monolithic chat view, the branch domain is decoupled from high-level task/project state:

- It receives a single `branchId` and projects that branch's conversation.
- It can be embedded within `TaskView`, rendered side-by-side in split comparisons, or inlined inside subtask exploration drawers.

## Core Data Model: The "Turn Block"

A conversation branch is partitioned into discrete **Turn Blocks** rather than a flat, unstructured item list.

- **Turn Quantum**: `1 User/System Prompt (or consecutive prompts)` $\rightarrow$ `N Assistant Responses` (with nested `ToolUse`s).
- **Structure**:
  ```ts
  type TurnBlock = {
    id: string
    messages: Message[]
    responses: ResponseWithToolUses[]
    status: 'active' | 'completed' | 'error'
    createdAt: string
  }
  ```

---

# Key Architectural & UX Invariants

## 1. Separation of Control Panel vs Prompt Editor

The Control Panel and Prompt Editor have fundamentally different lifecycles and layout requirements and are strictly decoupled:

- **Branch Control Panel (Always Visible)**:
  - Displays the active configuration of the displayed branch (active LLM model, mode info, provider overrides, cumulative tokens, connection status).
  - Must remain visible regardless of whether the user is typing or reading, ensuring the user always knows what configuration is producing the current outputs.
- **Prompt Editor (Elastic & Detachable)**:
  - Focused strictly on text composition, draft persistence, attachments, and dispatching prompts.
  - Per-branch by default, embedded at the bottom of `BranchView`.
  - Can be popped out into a dedicated FlexLayout tab for long-form drafting.

## 2. In-Branch Editor vs Detachable "Pop-Out" Tab

To support both rapid conversational turns and deep multi-paragraph prompt crafting:

1. **Default In-Branch Mode**:
   - Resides directly within `BranchView`.
   - Starts in a minimal, lightweight resting state (e.g. 28-32px trigger line) when empty or unfocused to prevent eating screen estate in multi-pane splits.
   - Expands vertically on focus/typing while pushing the conversation feed upward (flex-column layout) so text being read is never covered.
2. **Detached / Pop-Out Tab Mode (Pro Mode)**:
   - Includes a trigger (`[⤢ Open as Tab]`) to pop the composer out into a dedicated FlexLayout tab descriptor (`{ kind: 'composer', taskId, branchId }`).
   - The detached tab remains pinned to the initially selected `branchId`.
   - Provides full-height markdown editing, attachment previews, and token meters for complex technical prompts.
   - Allows side-by-side editing: the prompt editor in one pane while reading/scrolling conversation history in another.

## 3. Layout Edge Cases & Architectural Solutions

Our layout design directly addresses the physical failure modes discovered during architecture exploration:

- **The 2x2 Grid Squeeze (The 12.5% Problem)**:
  - In a 4-quadrant layout, a static 150px input box steals 50% of the pane height, leaving only 12.5% total screen space for history.
  - _Solution_: Resting bar is ultra-compact (~30px); full height is preserved for history until the user explicitly focuses or pops out the tab.
- **The Ultra-Wide / 4K Monitor Paradox**:
  - Full-width textareas on 4K screens produce unreadably long lines, while centered fixed-width boxes leave 1000px+ of dead blank margins.
  - _Solution_: Allows side-gutter positioning (Conversation on left 65%, Composer on right 35%) with full vertical height for both.
- **Why Pure Scroll-Flow Was Rejected**:
  - Putting the input only at the very bottom of the document fails because users frequently formulate prompts while reading earlier paragraphs in the middle of a 2,000-word response. The editor must remain accessible from any scroll position.
- **Mobile Virtual Keyboard Protection**:
  - On mobile devices, virtual software keyboards consume ~50% of screen height and crush inline inputs.
  - _Solution_: Tapping the input on mobile surfaces a dedicated sheet aligned with `window.visualViewport`.
- **Strictly No Auto-Scroll Invariant**:
  - Conversation viewport uses 100% native user-controlled scrolling. No auto-scroll or forced scroll jump interrupts reading or prompt composition.

---

# Architecture & File Topology

```
packages/client2/src/domains/
├── branch/                                # Pure Conversation & Branch Engine
│   ├── README.md                          # Domain documentation & invariants
│   ├── BranchView.tsx                     # Main conversation canvas (composes panel, feed, prompt input)
│   │
│   ├── hooks/
│   │   ├── useBranch.ts                   # Authoritative store projection hook for branch:{branchId}
│   │   └── useBranchConversation.ts       # Coordinates branch state & memoizes TurnBlock[]
│   │
│   ├── helpers/
│   │   └── turnBlockBuilder.ts            # Pure chronological partitioning: (messages, responses) -> TurnBlock[]
│   │
│   └── components/
│       ├── TurnFeed.tsx                   # Native scrollable viewport for turn blocks (strictly no autoscroll)
│       ├── TurnBlockItem.tsx              # Turn container (prompts + assistant responses)
│       ├── UserMessageItem.tsx            # Prompt card (plain text, timestamps)
│       ├── AssistantResponseItem.tsx      # Memoized assistant card (model, thinking, tools, text)
│       ├── ThinkingBlock.tsx              # Always-expanded dimmed reasoning trace
│       ├── ToolSummaryItem.tsx            # Generic compact status pill for tool executions
│       ├── BranchControlPanel.tsx         # Always-visible branch live status & turn counter
│       └── PromptInputBar.tsx             # Elastic prompt input with Enter to send via chat:send RPC
│
└── task/                                  # Task Coordinator & Workspace Tabs
    ├── TaskView.tsx                       # Scene coordinator (mounts BranchView for active branch)
    ├── hooks/useTask.ts                   # Subscribes to task:{taskId}
    └── components/
        ├── TaskHeader.tsx                 # Top bar (title, branch dropdown, minimap trigger)
        └── TaskComposerTab.tsx            # Full-sized dockable FlexLayout composer tab
```

---

# Phased Implementation Roadmap

## Phase 1: Core Foundation (Basic & Functional) \[COMPLETED]

- **Goal**: Reliable, clean, unstyled baseline with zero animation overhead.
- **Delivered**:
  - `turnBlockBuilder.ts`: Pure helper partitioning linear messages and responses into `TurnBlock[]` with support for consecutive prompts and terminal completion resolution.
  - `useBranch.ts` & `useBranchConversation.ts`: Authoritative Zustand store projection hooks with zero state mirroring.
  - `ThinkingBlock.tsx`: Expanded, dimmer plain-text reasoning trace.
  - `ToolSummaryItem.tsx`: Generic compact status pill for tool executions (`streaming`, `pending`, `executing`, `completed`, `error`, `pending_approval`, `rejected`).
  - `UserMessageItem.tsx`: Prompt card with `whitespace-pre-wrap wrap-break-word` text formatting.
  - `AssistantResponseItem.tsx`: `React.memo` assistant response card embedding thinking, tools, text, and error banner.
  - `TurnBlockItem.tsx`: Memoized container for 1 turn block.
  - `TurnFeed.tsx`: Scrollable container with responsive paddings (`px-2 sm:px-4 py-3`, `gap-4 sm:gap-6`) and native user-controlled scrolling (strictly NO autoscroll).
  - `BranchControlPanel.tsx`: Compact top status header showing live connection phase and turn count.
  - `PromptInputBar.tsx`: Textarea input with `Enter` to submit, `Shift+Enter` for newlines, and `wsCommandClient.sendCommand('chat:send')`.
  - `BranchView.tsx`: Complete single-branch conversation canvas.
  - `TaskView.tsx`: Integrated to render `BranchView` for the active task branch.

## Phase 2: Density & Ergonomics

- **Goal**: High visual density suitable from small mobile screens to 4K displays.
- **Deliverables**:
  - `UserMessageItem` compact mode: collapses long prompts into a 1-3 line right-aligned pill with an expand toggle.
  - Top action controls: "Collapse all responses" / "Expand all responses".
  - Elastic `PromptInputBar` resting state vs focused state.
  - Responsive layout tokens (semantic colors, tight paddings for narrow tab splits).

## Phase 3: Macro Navigation Rail (Dual-Zone Scrolling)

- **Goal**: Fast navigation across long conversations without endless scrolling.
- **Deliverables**:
  - Left gutter `TurnRail` with numbered turn markers (`○ 1`, `○ 2`, ..., `● N`).
  - Hover tooltips showing prompt summary and turn status.
  - Dual-zone interaction: scrolling over the left rail snaps between turn blocks; scrolling in the center navigates content within the turn.

## Phase 4: Viewport-Aware Branching & Fast Switching

- **Goal**: Branch from anywhere without scrolling back to the top of long responses.
- **Deliverables**:
  - Persistent/floating gutter action dot in the visible viewport for branching/copying.
  - Keyboard shortcuts (`Alt+[`, `Alt+]`, `Alt+Up`) for fast branch switching.
  - Fork confirmation & branch creation triggers.

## Phase 5: Advanced Features & Content

- **Goal**: Rich technical workflow, full-sized editor tab, and multi-model collaboration.
- **Deliverables**:
  - `TaskComposerTab`: Dedicated full-sized FlexLayout composer tab pinned to branch.
  - In-chat Regex and structural search across markdown, tools, and collapsed reasoning.
  - Inline text selection & critique/annotation popup ("Thinking Dialogue").
  - Rich tool execution diff renderers (`read`, `write`, `edit`, `explore`).
  - Multi-LLM turn orchestration (sequential chain & parallel candidate responses).

---

# Performance & Memory Invariants

1. **Zero State Mirroring**:
   - Never copy Zustand sync data into local `useState` or run `useEffect` syncs.
   - All response text, thinking content, and tool statuses are read directly during render.

2. **Isolated Streaming Re-renders**:
   - `TurnBlockItem` and `AssistantResponseItem` are wrapped in `React.memo` with stable ID keys.
   - High-frequency token streaming (50-100 tokens/sec) re-renders only the active assistant leaf component; historical turns remain untouched.

3. **Structural Sharing in `turnBlockBuilder`**:
   - Memoized pure builder avoids reallocating historical `TurnBlock` objects on every streaming chunk.

4. **Scroll & Viewport Hygiene**:
   - Viewport is purely user-controlled without intrusive auto-scroll locks.
   - Native browser scroll keeps the compositor thread unblocked.

5. **Shallow DOM Footprint**:
   - Flat, semantic HTML structure without redundant nested `div` wrappers.
