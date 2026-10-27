# Developer Notes

**\[TEMPORARY] No DB migration**

- Project currently is in deep development phase and DB migration is not needed. Just explicitly tell to developer to delete DB files because of new braking changes.

\================================================================

## Coding Constitution

1. Code Quality & Craftsmanship
   - Always apply best long-term engineering practices; quick-and-dirty fixes and temporary hacks are strictly forbidden.
   - Code must be clear, well-structured, and self-documenting. Prioritize long-term maintainability over clever or concise one-liners.
2. Robustness & Defensive Programming
   - Handle errors explicitly at every boundary (network, file I/O, user input, external process execution).
   - Never swallow exceptions silently. Avoid brittle implicit assumptions about runtime state or data shapes.
   - Validate external and cross-boundary data using schema validation before processing.
3. Performance & Resource Hygiene
   - Write code that respects system resources: clean up event listeners, WebSocket subscriptions, timers, and file handles.
   - For example, in UI code, prevent redundant re-renders and unnecessary state mirroring. In backend code, avoid unbounded memory growth and unindexed queries.
4. Structured Logging & Observability
   - Place informative, structured logs at critical boundaries (RPC dispatches, sync state transitions, worker communication, process spawns). Avoid logging every minor steps.
   - Logs should provide actionable debugging context without polluting the console with redundant noise.
5. Pragmatic, Value-Driven Testing
   - Tests exist solely to reduce risk and protect non-trivial invariants over time — high test count/coverage is not a goal.
   - Never write tests that merely verify trivial getters, mirror obvious implementation details, or duplicate type checker guarantees.
   - Tests are code with ongoing maintenance cost. Redundant, brittle, or low-value tests should be refactored or deleted.
   - Do not write tests prematurely for volatile or newly introduced functionality before its design is settled, completed, and approved.
   - Propose new tests only when there is clear value: regression risks, complex algorithmic logic, or hard-to-verify edge cases.

\================================================================

## Module Documentation Writing (`README.md`)

### Description

- High level described in `AGENTS.md`
- Dev must manually update `README.md` after changes (if needed). LLM must encourage dev to do so.
- Purpose is to:
  - Reduce cognitive load on revisiting the module by providing high-level overview
  - Improve memory retention of codebase by forcing him to manually write and maintain `README.md`
  - Store nuances/quirks/minor todos
  - Explain controversial decisions

### Template \[TODO]

- If user asks LLM to write it - LLM must only write template.

### Notes

- Keep concerns separated, avoid parent `README.md` going in details of submodules (it's the job for submodule's `README.md`)
- Write `README.md`as if next time you'll come back to its code will be in a month.
- Avoid using LLM for writing it, it's purpose is to be `for you - by you`. Better understanding and memory retention.

\================================================================

## TypeScript

- Don't use interfaces, always prefere types
- Use classes over file-modules for stateful logic.
- Create separate singleton `*Instance.ts` file only when composition is needed.

\================================================================

## Naming Conventions (Axon Standard)

### 1. Never use standalone generic names. Prefix with domain or use a concrete noun:

- `types.ts` -> `wsTypes.ts`, `layoutTypes.ts` or `runtime.ts` -> `wsRuntime.ts` or `utils.ts` / `helpers.ts` -> `layoutUtils.ts`, `pathResolution.ts`

### 2. The file name must match its primary exported symbol:

- `export class AttachmentRepository` -> `AttachmentRepository.ts`
- `export const wsRuntime = ...` -> `wsRuntime.ts`

### 3. Module Entrypoints & Prefixes

- Publicly imported entities (`layoutStorage.ts`): prefixes make their origin immediately clear at call sites without checking import headers (e.g. `layoutStorage` vs ambiguous `storage`).

\================================================================

## Documentation & JSDoc Standards

### 1. Mandatory JSDoc Docstrings (`/** ... */`)

Every exported or local declaration must have a docstring comment:

- File header describing purpose & responsibilities.
- Top-level functions & React components (`function Card()`, `const Card = () =>`).
- Top-level classes & class methods (public, private, static).
- Types, interfaces, and enums (`type WsSnapshot = ...`, `interface TaskProps { ... }`).
- _Exemption:_ Plain constants/primitives (`const logger`, `const MAX_RETRIES = 5`) and inline closures (`items.map(...)`) do not require JSDoc.

### 2. JSDoc format

- If a JSDoc description consists of a single statement/sentence, it must be on one line: `/** Resolves default workspace ID. */`.

### 3. No JSDoc Tags in TypeScript (@param, @returns, @type)

- In `.ts` and `.tsx` files (but not `js`/`mjs`), JSDoc tags (`@param`, `@returns`, `@type`, `@typedef`, etc.) are forbidden.

\================================================================

## Imports Order & Hygiene

- Group order (blank line between): `3rd-party` → `shared/*` → `#aliases/*` → `../` (parent) → `./` (sibling) → `./sub/*` (child). Alphabetically sorted by path.
- Path rules: Intra-module uses relative (`./`, `../`); Cross-module uses `#alias/*`; Self-aliasing is forbidden (`#core/ws` inside `core/ws`).
- Zero barrels & dead exports:`index.ts` & `export *` forbidden → direct file imports only. Export only what is immediately consumed, don't export "just in case"

\================================================================

## File Anatomy & Structure

- Section layout order:
  1. `/** File doc header */`
  2. `Imports block`
  3. `Local consts / let`
  4. `Exported config & types`
  5. `Exported classes, functions & components` (Public API)
  6. `Local classes`
  7. `// Local Functions` (private helpers & subcomponents)
  8. `// Local Types` (private types & local prop interfaces)
- Each section is separated by `// ===...`
- Class singleton pattern is exception, where local class has to be on top of exported const.

\================================================================

## Tailwind

- Hardcoded raw color palette classes (`bg-zinc-800`, `text-slate-500`, `border-gray-300`) are forbidden unless explicitly prototyping. Use semantic design tokens (`bg-background`, `text-foreground`, etc.)
- Custom CSS utility recipes declared under `@layer utilities` in `styles/index.css` must use the `u-` prefix (e.g. `.u-bg-surface-elevated-highlight`) to prevent collisions with upstream Tailwind utilities.
- Use canoical class names `p-[16px]` -> `p-4`, `break-words` -> `wrap-break-words`, `flex-shrink-0` -> `shrink-0`, `flex-grow` -> `grow`, etc.

\================================================================

## Styling

### Variant Promotion Policy

- One-off primitive style -> create a variant in the shared primitive.
- Reused style -> reuse existing variant; do not duplicate styling in feature files.

### Other

- Avoid infinite animations because of chrome bug in composition timing that causes youtube to stutter (possibly other playes)
  - But one can do an illusion of it, e.g. duration 6 seconds, animation happens in 0-10% keyframes 10%-100% do nothing. Tested, works.
- Do not write accessibility-related code (no aria-\* attributes, roles, or a11y scaffolding).
  - I'll add it when it'll be requested, properly with understanding what's needed, instead of half-assing it now.
- UI must be usable from small phone screens up to 4K displays (“universal UI”).
- UI must be reactive to size changes (tab can be widden up or narrowed down, stretched or shrinked), so layout must adapt to this.

\================================================================

## React

### Docs References

- `docs/react/bulletproof/docs` — React app best practices.
- `docs/react/You-Might-Not-Need-an-Effect.md` — Read only through the `explore` tool due to file size.

### Common issues

- useEffect is ONLY for external synchronization (WebSockets, DOM, browser APIs, timers). Never use it to sync React state with other React state.
- Never call setState synchronously in an effect body (causes cascading renders).
- Derive values during render instead of mirroring props or state into useState + useEffect.
- Handle user interactions in event handlers (mutations, notifications, navigation), not in useEffect watching state flags.
- Reset local state using the key prop (`<Component key={id} />`) instead of clearing state in useEffect.
- No nested renderX() helper functions inside components; extract a subcomponent or inline in JSX.

\================================================================
