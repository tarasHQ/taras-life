# Developer Notes

## Applicability
1. DOES NOT APPLY TO `quartz/` AND OTHER `quartz`-RELATED CODE. 
2. Applies only to user code.
3. These rules state the target state. Existing code is not a precedent — code that violates a rule is brought into line, never cited to argue the rule away.

================================================================

## Coding Constitution

1. Code Quality & Craftsmanship
	- Always apply best long-term engineering practices; quick-and-dirty fixes and temporary hacks are strictly forbidden.
	- Code must be clear, well-structured, and self-documenting. Prioritize long-term maintainability over clever or concise one-liners.
2. Robustness & Defensive Programming
	- Handle errors explicitly at every boundary (network, file I/O, user input, external process execution).
	- Never swallow exceptions silently. Avoid brittle implicit assumptions about runtime state or data shapes.
	- Validate external and cross-boundary data using schema validation before processing.
3. Performance & Resource Hygiene
	- Write code that respects system resources: clean up event listeners, subscriptions, timers, and file handles.
4. Structured Logging & Observability
	- Place informative, structured logs at critical boundaries. Avoid logging every minor step.
	- Logs should provide actionable debugging context without polluting the console with redundant noise.
5. Pragmatic, Value-Driven Testing
	- Tests exist solely to reduce risk and protect non-trivial invariants over time — high test count/coverage is not a goal.
	- Never write tests that merely verify trivial getters, mirror obvious implementation details, or duplicate type checker guarantees.
	- Tests are code with ongoing maintenance cost. Redundant, brittle, or low-value tests should be refactored or deleted.
	- Do not write tests prematurely for volatile or newly introduced functionality before its design is settled, completed, and approved.
	- Propose new tests only when there is clear value: regression risks, complex algorithmic logic, or hard-to-verify edge cases.

================================================================

## Module Documentation Writing (`README.md`)

### Description
- High level described in `AGENTS.md`
- Dev must manually update `README.md` after changes (if needed). LLM must encourage dev to do so. 
- Purpose is to:
	- Reduce cognitive load on revisiting the module by providing high-level overview
	- Improve memory retention of codebase by forcing him to manually write and maintain `README.md`
	- Store nuances/quirks/minor todos
	- Explain controversial decisions

### Template [TODO]
- If user asks LLM to write it - LLM must only write template.

### Notes
- Keep concerns separated, avoid parent `README.md` going in details of submodules (it's the job for submodule's `README.md`)
- Write `README.md` as if next time you'll come back to its code will be in a month.
- Avoid using LLM for writing it, it's purpose is to be `for you - by you`. Better understanding and memory retention. 

================================================================

## TypeScript

### 1. `type` over `interface`
- `interface` declarations are forbidden. Use `type`, including for object shapes.
- Nothing here relies on declaration merging or module augmentation, and `type` also expresses unions, intersections, and conditional types, so a second declarator for the same job buys nothing.

### 2. Erasable syntax only
- No `enum`, no `namespace`, no constructor parameter properties — nothing that has to *emit* code in order to work.
- Reason: a plugin entry resolved as `src/index.ts` is imported by Node with no build step in front of it. Only erasable syntax survives type stripping; the rest fails at **import** time, not at typecheck time — so `tsc --noEmit` stays green while the build breaks.
- Type-only imports must be written `import type`. A plain `import` carrying only types becomes a runtime import of a module with no runtime exports once stripped.
- Erasable replacements: `enum` → union of string literals (`type Remark42Theme = "light" | "dark"`), `namespace` → a module.

### 3. No `any`; `as` is not a narrowing tool
- `any` is forbidden.
- `as` is allowed only where a runtime check has already established the shape, never to silence the compiler. Narrow with type guards or with schema validation at boundaries.

### 4. Explicit return types on exported functions
- Every exported function and public method declares its return type. Inference is for internals, where the reader is already inside the function body.
- A plugin module's exported surface is one level deep, so these annotations *are* its contract.

### 5. Classes for stateful logic
- Logic that holds state across calls is a class. Module-level mutable `let` shared between free functions is forbidden.
- "State" means anything outliving a single call: an instance handle, a generation counter, an in-flight request, a timer, a subscription.
- The class is named after its responsibility, and its file is named after the class (Naming §2).
- Purely functional helpers stay free functions — a fieldless class is a namespace in disguise.

================================================================

## Naming Conventions

### 1. Never use standalone generic names. Prefix with domain or use a concrete noun.
- No generic `utils.ts`, `helpers.ts`, `types.ts`, `manager.ts`. Name the file after what it holds.

### 2. The file name must match its primary exported symbol.
- One primary export → the file carries its name. A cohesive group of helpers → the file carries the concern, not the mechanism.

### 3. Module Entrypoints & Prefixes
- Publicly imported entities should carry their origin in the name, so call sites are unambiguous without checking import headers.

================================================================

## Documentation & JSDoc Standards

### 1. Mandatory JSDoc Docstrings (`/** ... */`)
Every exported or local declaration must have a docstring comment:
- File header describing purpose & responsibilities.
- Top-level functions & components.
- Top-level classes & class methods (public, private, static).
- Types and enums.
- *Exemption:* Plain constants/primitives (`const logger`, `const MAX_RETRIES = 5`) and inline closures (`items.map(...)`) do not require JSDoc.

### 2. JSDoc format
- If a JSDoc description consists of a single statement/sentence, it must be on one line.

### 3. No JSDoc Tags in TypeScript (@param, @returns, @type)
- In `.ts` and `.tsx` files (but not `js`/`mjs`), JSDoc tags (`@param`, `@returns`, `@type`, `@typedef`, etc.) are forbidden.

================================================================

## Imports & Exports Hygiene
- Zero barrels & dead exports: `export *` and re-export-only `index.ts` files are forbidden → direct file imports only. Export only what is immediately consumed, don't export "just in case".
	- Exception: a plugin's `index` entrypoint is required by the loader, not a barrel.
- A local plugin never imports host source (`../../../quartz/**`) — take types from `@quartz-community/types`.

================================================================

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

================================================================

## Rendering Model

### 1. Components are build-time only
- A component is a pure function of its props, executed once in Node during the build. Its output is an HTML string. There is no hydration and no second execution in the browser.
- `window`, `document`, `localStorage`, observers, timers, and event listeners are forbidden at module scope and inside the component body. Needing one means the work belongs in a client script, not in the component.
- The build is concurrent: no module-level mutable state, and no assumptions about render order across pages.

### 2. Client behaviour is a script string, executed once per page load
- Client code is registered as `beforeDOMLoaded` (before `<body>` exists) or `afterDOMLoaded` (after it is parsed) and shipped as a string.
- Each script runs once per full page load, in its own scope. It is **not** re-executed on SPA navigation — after the first route change the DOM it was written against no longer exists.
- Identical script strings registered by several components are deduplicated, so a shared bootstrap may be registered wherever it is needed and still ships once.
- Consequence: all route-dependent work must be driven by the `nav` event. "The script ran, so the DOM is mine" is true exactly once.

### 3. Subscribe once, tear down per navigation
Verified order per navigation: `prenav` dispatched → cleanup callbacks flushed → `micromorph` patches `<body>` → `<head>` patched → `nav` dispatched.
- Listeners on `document` survive navigation. Register them exactly once, at script top level — never inside a `nav` handler.
- Anything holding a DOM reference (element listeners, observers, mounted widget instances) must be released before the body is patched: either `window.addCleanup(fn)` or a `prenav` handler. Micromorph replaces nodes; a handler on a replaced node is dropped silently while its closure keeps everything it captured alive.
- `window.addCleanup` is a no-op when SPA is disabled, so never make correctness depend on it running — with SPA off, the full page load does that job.
- Setup must be idempotent and teardown must tolerate "nothing is mounted yet": `nav` fires on every route, including the first one.

### 4. Only three events actually fire
- `nav` (`detail.url`), `prenav`, and `themechange` (`detail.theme`) are dispatched by code present in this checkout.
- Before subscribing to a custom event, confirm something dispatches it — today only these three do. `readermodechange` and `render` are declared and even listened to, but nothing emits them.
- `themechange` does not fire on initial load. Read the current value from `document.documentElement.getAttribute("saved-theme")` (`"light" | "dark"`) and only then subscribe for changes. Never write that attribute: the darkmode component owns it, together with the `theme` key in `localStorage`.

### 5. Never navigate by hand
- No `window.location` assignment, no `history.pushState`, no manual re-render. For programmatic navigation use `window.spaNavigate(url)`, which exists in both modes and degrades to a full page load when SPA is off.

================================================================

## Styling
- UI must be usable from small phone screens up to 4K displays (“universal UI”).
- UI must be reactive to size changes (tab can be widened or narrowed, stretched or shrunk), so layout must adapt to this.

================================================================

## Accessibility
- Don't add a11y scaffolding on your own initiative — no new `aria-*`, `role`, focus management, or live-region announcements beyond what a feature needs to function.
- Don't remove pre-existing a11y attributes from vendored or carried-over markup; they are load-bearing for someone.
- Prefer native semantics (`<button>`, `<nav>`, `<a>`) over hand-rolled ARIA.
