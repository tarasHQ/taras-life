# Phase 004 — Scorched-earth critique exploration (temp, write-once)

## A2 — Steelman of the current direction (before attacking)

- **Delivery model**
  - Community Explorer builds its tree in the browser from `fetchData` (async, ~400-line inline script); its own `folderDefaultState`, `useSavedState`, and `order` options are emitted but ignored; localStorage is read/written unconditionally.
  - A build-time baked flat list is plain HTML: no index fetch, no client construction, immediate paint, links are real `<a>` elements.
  - `allFiles` + `slug` are already passed to every component at build time, so discovery is a simple filter — no new plugin plumbing strictly required.
  - Site-wide JS warning is correctly separated from Explorer; desktop Explorer-as-HTML incidentally works without JS.
- **Vault-as-SSOT**
  - No parallel navigation map to maintain; the folder structure is already maintained by virtue of existing.
  - The convention is mechanical and cheap to implement (~30 lines of matching logic).
- **Dataview entry pages**
  - Syncer renders queries to HTML before sync; zero Quartz-side query engine; user verified the mechanism works.
- **Icons**
  - Small local SVG set avoids shipping lucide entirely; in-page defs + `use` + shared CSS avoids per-icon attribute repetition and extra requests.
- **Process shape**
  - Deliberately underspecifying interaction details and resolving them during implementation+testing is honest scoping, not laziness — mobile dismissal/focus details are hard to fix on paper.
  - "Address issues found rather than adding speculative fixes in advance" is a healthy testing-first stance.

## B1 — Attack surface (questions/points only, no answers)

- Navigation model
  - Flat, immediate-subfolders-only: what happens to root-level loose files (`About.md`, `README.md`, test pages)? Unreachable from Explorer — is that intended or an accidental hole?
  - Is "one entry page per immediate subfolder" even true of the vault today? (Verification: zero entry pages exist yet; the phase creates them — for how many folders, and what does `@journal`'s listing look like given `01 Daily/`, `02 Weekly/`, `03 Monthly/`, `2026/`?)
  - Growth: earlier notes explicitly predicted 15→30 entries and proposed a collapsible list; the locked decision dropped folding with no replacement. Is a 30-line always-open flat list still the right shape on mobile (content-fitted panel that must fit the viewport)?
  - `Home` at the bottom: unusual placement; does it conflict with the page-title link that already exists in the left sidebar (priority 10)?
  - Orientation: no current-section highlight is "open" — but with flat Explorer + deep Dataview-listing navigation, how does a user know which section they're in? Breadcrumbs exist (`not-index` condition) — is that sufficient, or is active state actually load-bearing?
- Entry-page naming convention
  - `_static` folder → `__static.md` (double underscore). What does slugification do with leading underscores? Does the published URL look sane? Does Obsidian/Syncer handle it?
  - `_@journal.md`-style filenames: `@` + leading `_` in a filename — slug result unknown; also an awkward file to type/search in Obsidian.
  - Case-insensitive matching: does it create silent collisions (`_System.md` vs `_system.md`) on case-insensitive local filesystems vs case-sensitive CI? Which wins?
  - Renames: renaming a folder silently orphans its entry page (no more match) — nothing warns.
  - Does the convention collide with existing vault semantics (Obsidian Publish treats leading-underscore files as excluded; Templater/`_templater` patterns)?
- Dataview listings as navigation
  - **Publication boundary: Syncer renders Dataview inside Obsidian against the full vault.** Quartz filters (`_private`, `@projects/0vibes` ignored) are invisible to Dataview. Can generic recursive listings publish links/titles of private or excluded content?
  - Staleness: rendered HTML is frozen at sync time; a new note doesn't appear in its section listing until the user re-syncs — Explorer (build-time) and entry-page listings (sync-time) update on different clocks.
  - Link targets: does rendered Dataview HTML produce links that match Quartz slugs (spaces, `@`, nested folders)? "Verified it works" — verified for which query, which folder, which link shape?
  - Listing size: a generic recursive listing of `@system` or `@journal` could be hundreds of links — is that "deeper navigation" or a wall of text?
  - Do listings exclude utility files (`README.md`, `_reflections/*`, templates, plans) or list them?
- Build-time HTML in every page
  - Repeated markup: ~10–30 entries × anchor+icon ≈ a few KB per page — gzip across responses doesn't dedupe. Is the "no delayed menu" rationale strong enough to forgo a single cached asset? Magnitude unmeasured.
  - Incremental/watch builds: entry-page rename or icon change leaves every other page stale until full rebuild — dev-time confusion or real problem for Cloudflare full builds?
  - Does the Explorer render on every page type (404, tag pages, `bases`)? Page-type exclusions exist — is the Explorer included everywhere by default, and should it be?
- SVG approach
  - `use` + namespaced IDs: cost/benefit with ~10 mostly-distinct icons is near zero vs simply inlining each SVG; the defs block + ID references + shared CSS is strictly more machinery. What is actually being saved?
  - SPA morphing: `micromorph` patches `document.body` — do `<use href="#id">` references survive when the defs block and the referencing element patch independently? Duplicate-ID behavior if defs block is ever rendered twice (e.g. page-type edge cases)?
  - Unrecognized icon name: behavior unspecified — silently default? build warning? Nothing in the locked block.
- Desktop & mobile behavior
  - Desktop "always-visible, no folding heading": the left sidebar is shared with PageTitle + Search + ThemeToggle — how do 30 entries + search + theme toggle coexist at 1200px+? Overflow/scroll behavior unspecified.
  - Mobile floating button: reserved space for future up/down buttons — the group's placement/overlap with content, safe areas, and other future widgets is unspecified; content-fitted menu width for long section labels on narrow screens?
  - Modal vs disclosure undecided: focus trap, Escape, backdrop click, scroll lock, `aria-expanded`, `inert`/`aria-hidden` on background — each choice cascades; is deferring all of it to implementation realistic, or will it produce a rushed first pass?
  - SPA: menu state (open/closed) across navigation — close on navigate? Re-open? Repeated mobile use was explicitly listed as a test case — good, but is the lifecycle contract (addCleanup/nav) already decided?
- Validation / failure modes
  - No validation system locked — but zero diagnostics also means: typo'd entry filename = folder silently absent from Explorer; typo'd icon name = silent default; renamed folder = orphaned entry page. All three are silent. Is a single build-time warning pass "a dedicated validation system" or just normal error handling?
- Integration & fit
  - Component registration boundary "an implementation detail" — but the loader has two different paths (plugin entry vs CoreComponentPlacement); picking wrong means carrying plugin manifest machinery for nothing.
  - Community Explorer's styles: base.css reportedly already contains Explorer-specific mobile styling — removing the community plugin without cleaning those styles leaves dead CSS in the SSOT stylesheet.
  - README.md in content root: published? Its role vs `index.md` was questioned in parking notes and never resolved.
- Scope / size
  - Real work: discovery logic + component + icons + mobile interaction + ~12 entry pages with listings + icon plumbing + testing. Is this one phase or is entry-page migration a separate structure step?
  - The phase trusts "Syncer renders Dataview" on the user's prior verification — is one end-to-end trial on a single page an unfair "preparatory investigation project", or the minimum viable evidence?
