---
publish: true
created: 2026-11-05T11:59:17.784Z
modified: 2026-11-05T11:59:40.271Z
published: 2026-11-05T11:59:40.271Z
status: ready
state: full
---

[← PLAN](../_plan_003.md)

## Description

Replace `@quartz-community/darkmode` with a **local core `ThemeToggle` component + colocated contract module** that owns the entire JS-side theme contract: attribute, storage, 3-mode cycle, OS-seeding, `themechange` dispatch, and the zero-flash inline init.

This is the phase's only architectural change and its one multi-file lockstep step. Everything here lands in one reviewable unit because the consumers must change together: a toggle emitting `"dark-low"` before its consumers accept it = silently dropped events; consumers widened before the toggle exists = dead code. The palette blocks are already in place from step 02 (inert-first sequencing), so this step only flips the switch.

Old dep contract being re-owned (validated facts, from the dep's dist):

- localStorage key `theme`, attribute `saved-theme` on `documentElement`, binary light↔dark cycle.
- OS-preference listener that **overwrites** the stored choice live (behavior we are deliberately dropping).
- Dispatches `themechange` on `document` with `detail: { theme }`.
- Bundled CSS owns `color-scheme: dark/light` + toggle-icon switching (silent-breakage risk if forgotten — re-owned here).

## High-Level

### List of related files or folders

- **Created:** `quartz/components/ThemeToggle.tsx` (+ colocated contract module, e.g. `quartz/components/styles/toggle/` — placement following existing component+styles colocation conventions found during implementation).
- **Modified:**
  - `quartz/components/Head.tsx` — inline zero-flash init via `<script dangerouslySetInnerHTML>`; imports contract constants at build time (inline precedent: `quartz/components/pages/404.tsx`).
  - `quartz/plugins/loader/config-loader.ts` — `loadQuartzLayout` imports `ThemeToggle` into the `left` position at the toolbar priority (exact precedent: how `Head` is assigned today).
  - `quartz.config.yaml` — delete `@quartz-community/darkmode` **and** `@quartz-community/favicon` entries (both dead after this step; single config-touch — folded decision). NO toggle entry (loader-owned placement).
  - `index.d.ts` — `themechange` union → `"light" | "dark" | "dark-low"` (raw payload).
  - `custom-plugins/remark42/src/browser.ts` — guard widened then narrowed internally; see tasks. **User code — DEV\_RULES apply in full.**
  - `quartz/styles/theme.css` — `color-scheme` declarations added to the three mode blocks (re-owned from the dep's CSS; touches step 02's file, acceptable exception: same-SSOT concern).
  - `__obsidian__/docs/DEV_RULES.md` — §Rendering Model 4 aligned (see tasks).
- **Deleted:** nothing in-repo except config entries; the dep itself leaves via `npm uninstall @quartz-community/darkmode` (its `dist/components/index.js` remains useful as reference until removed).
- **Reference only:** `node_modules/@quartz-community/darkmode/dist/components/index.js` — the contract being re-owned.

### Intended outcome

- Clicking the toggle cycles `light → dark → dark-low → light` (dark-low as extension of dark, not peer of light); choice persists across visits via the **reused key `theme`** → existing visitors' stored choices migrate for free.
- OS preference seeds the **initial** value only (no stored choice → seed from `prefers-color-scheme`; stored choice always wins; no persistent OS listener — replaces the dep's overwrite-on-OS-change).
- **Zero-flash**: `saved-theme` is set before first paint by an inline `<head>` script, not an external `prescript.js` (validated: component `beforeDOMLoaded` strings ship external and are not guaranteed pre-paint).
- `themechange` dispatches the **RAW mode** (locked HOW verdict 2) — the event becomes a reliable styling hook; remark42 narrows internally.
- micromorph nav requires no re-init (validated: micromorph patches only `<body>`; `<html saved-theme>` and head persist).
- remark42 widget follows dark-low (mapped to dark) without any comment-section flash or dropped events.
- Mermaid dark-low behavior **checked and recorded** (locked verdict 5: proper handling likely a later change).

### Local invariants

- **One owner of the JS contract**: the colocated module exports storage key, attribute name, mode list, cycle order, OS-seed rule, and the inline-init snippet; `Head.tsx` builds the script from imported constants — no duplicated literals anywhere.
- **`themechange` payload = raw mode**, single field `detail.theme`; no second normalized field (rejected option (b) — two fields commit every future consumer to extra contract).
- **Toggle placement = loader insertion (a′)** (locked HOW verdict 3): `loadQuartzLayout` assignment, not YAML (registry isn't seeded with core components — verified), not frame JSX (DefaultFrame stays purely structural).
- **`color-scheme` ownership moves to `theme.css` blocks** (`:root` → `light`, dark block → `dark`, dark-low → `dark`); icon-switching CSS is colocated with the toggle component.
- **Icon: morphing SVG first** (user decision); if it fights back or becomes a headache — fall back to multiple per-mode inline SVGs swapped by attribute selectors. Fallback needs no re-discussion.
- **remark42 narrowing**: `hasThemeDetail` guard accepts all three modes, then narrows dark-low → `"dark"` **inside** the plugin before `changeTheme` — the raw event stays honest, the widget stays binary.
- **DEV\_RULES surface split**: `quartz/` code is exempt from DEV\_RULES; `custom-plugins/remark42/src/browser.ts` and `index.d.ts` are user code — erasable syntax only, `type` over `interface`, explicit return types on exported functions, JSDoc on exported declarations, no `any`/`as`-narrowing (guard narrowing must be a real type guard or validated check, not a blind cast).
- Mobile: `.sidebar.left` becomes a horizontal row — toggle ordering eyeballed there during the loop.

### Should NOT be done in this step

- No accent-tier variables or rules (step 05), no typography (step 04), no background (step 06), no favicon/theme-color meta work (step 07) — even though the toggle will eventually JS-refine those, step 07 wires that.
- No ramp value tuning beyond what step 02 left (values are the loop's business).
- No OG-image parser changes — 2-palette contract is pinned by test, parser untouched.
- No new `themechange` consumers — only the existing remark42 consumer is adapted.
- No breadcrumbs/other config cleanup — the two plugin-entry deletions are the entire config surface.

---

## Tasks

- [ ] **Explore the exact insertion anatomy**: read `config-loader.ts` `loadQuartzLayout` (how `Head` is imported/assigned to `left` at toolbar priority) and the old dep's dist component for the precise contract details (exact storage/attribute handling, event construction) — write the contract module against what's verified, not memory.
- [ ] **Write the contract module**: constants + cycle logic + OS-seed rule + inline-init snippet string. Decide and document (doc comment) the OS-seed semantics: seed only when no stored choice; no persistent listener.
- [ ] **Write `ThemeToggle.tsx`**: build-time Preact button (no browser APIs in the component body — build-time-only rendering model); client behavior registered as the toggle's script (cycle + dispatch + icon state); morphing SVG icon first, multiple-icons fallback if painful.
- [ ] **Wire the inline init into `Head.tsx`**: template-literal script from imported constants, `<script dangerouslySetInnerHTML>` (404.tsx precedent); verify pre-paint execution in the built output (inspect built `index.html`, not just source).
- [ ] **Insert via loader**: `loadQuartzLayout` assigns `ThemeToggle` to `left` at toolbar priority (Head precedent).
- [ ] **Update `index.d.ts`**: union → `"light" | "dark" | "dark-low"`.
- [ ] **remark42 adaptation** (DEV\_RULES apply): widen `hasThemeDetail` to accept all three values; narrow internally to `"light" | "dark"` (dark-low → `"dark"`) before `changeTheme`; real type guard, no `as`. Then `npm run build:plugins` and **commit `dist/`** (freshness enforced by `verify:dist` in `npm run check`).
- [ ] **Config cleanup**: delete `@quartz-community/darkmode` + `@quartz-community/favicon` entries from `quartz.config.yaml`; `npm uninstall` the darkmode dep; confirm the favicon plugin's root `favicon.ico` output is referenced by nothing (validated) — and that `static/icon.png` (what `Head.tsx` actually links) still ships.
- [ ] **Re-own the CSS**: add `color-scheme` to the three `theme.css` blocks; move icon-switching CSS into the toggle component's colocated styles; verify scrollbars/form-controls/native widgets render correctly in all three modes.
- [ ] **Align `__obsidian__/docs/DEV_RULES.md` §Rendering Model 4**: themechange union is now 3-value raw; attribute/storage owned by the local ThemeToggle (not "the darkmode component"); the "never write that attribute" guidance retargeted to the new owner.
- [ ] **Mermaid dark-low check** (locked verdict 5): on the step 01 code/tables/mermaid test page with dark-low active, record what theme mermaid renders (expected: light `"base"` since it matches only exact `"dark"`); record the observation in the plan's Exploration notes.
- [ ] **Verify the whole flow end-to-end**: fresh visit (OS-seeded), stored-choice migration from old dep key, zero flash on hard reload in all three modes, cycle order, `themechange` received by remark42 in all three modes, SPA nav keeps the attribute, `npm run check` + `npm test` green, build clean.
