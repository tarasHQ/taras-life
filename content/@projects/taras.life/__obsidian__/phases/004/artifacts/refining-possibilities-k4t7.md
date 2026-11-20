# Refining Possibilities — Phase 004 (Structure & Explorer)

## Scope & Boundaries

- Where exactly does this phase end?
  - Explorer component only? Explorer + entry pages? Explorer + entry pages + homepage hub redesign?
  - Is the "structure update" (entry pages) a separate phase that just happens to pair well, or truly one unit?
  - Should Dataview-rendered listing styling be part of this phase, or raw/default for now ("focused vault-structure update" wording suggests raw)?
- What does "custom Explorer" actually mean here?
  - Full rewrite from scratch (parking notes lean this way) vs heavy fork of the package vs thin wrapper configuring the package?
  - If rewrite: is the reference snapshot (`explorer-main`) a base to strip down, or only a reference to learn failure modes from?
- Is the existing npm dependency (`@quartz-community/explorer@1.0.4`) removed in this phase, or replaced only after the new one ships?
- Does "no goal to support upstream mergeability" free us to inline the Explorer directly into `quartz/components/`, or should the local-package precedent (`custom-plugins/remark42`) be followed for isolation?

## Data Source & Rendering Strategy

- Where is the file tree computed?
  - Build time (SSR the whole tree into HTML — zero client computation, no content-index fetch needed)?
  - Client side from the content index (`fetchData`) like upstream?
  - Hybrid: SSR initial render + client re-render on SPA nav?
- How does each option interact with micromorph SPA nav?
  - Upstream re-renders on `nav` event with a generation counter to avoid stale async renders — is any of that needed if the tree is static HTML?
  - Active-page highlighting: recompute client-side per navigation, or accept stale highlight until full load?
- What data does the build even have?
  - Does the emitter/component pipeline have access to the full list of slugs at build time (like content-index does)?
  - If yes, is client-side `fetchData` ever needed at all?
- Build-time tree vs privacy:
  - if the whole tree is SSR'd, excluded files must be excluded at build time with certainty — no client-side filtering chance. Is that acceptable for `_private`?

## Inclusion / Exclusion Rules

- The rule is "include homepage + matching folder entry pages, exclude everything else." Open questions:
  - Case-insensitive matching: `_<folder-name>.md` — does `@journal` map to `_@journal.md`? Does `@` count as a "character preserved"?
  - What about the root `index.md` vs a hypothetical `_index.md`?
- Which folders must NOT get entry pages (parking notes mention `@journal`, maybe `@projects`)?
  - But the newer note says "explorer won't exclude; it includes by rules and everything else is auto-excluded." Which wins: explicit exclusion lists or pure inclusion rules?
- Hazardous folders discovered in `content/`:
  - `@projects/taras.life/__obsidian__/` — the project's own planning vault is synced into published content. Should it even be public? Does the Explorer make this worse by making everything navigable?
  - `_private/` — one file, name screams "not public." Does unlisted-pages plugin already handle this, or is entry-page logic the first line of defense?
- README.md files exist in several folders — are they synced content or repo metadata? Do they become pages and clutter listings?
- Nested entry pages (`_@system/_@projects.md` style hierarchy) — supported by the tree builder or flattened?
- What happens to a file whose parent folder has no entry page anywhere up the chain — orphaned, dropped, or attached to nearest recognized ancestor (the "collapse intermediate folders" idea)?

## Depth, Growth & Collapse Behavior

- Parking notes project growth from ~15 to 30+ entries within months. Implications:
  - Non-foldable flat list becomes unusable — is foldability now a hard requirement rather than nice-to-have?
  - Toolbar: collapse-all / expand-all / settings — which buttons actually earn their place?
- Removing the upstream "Explorer heading that folds it" — the component then needs its own visual anchor. What is it?
- Collapse state semantics:
  - Per-folder persisted state (localStorage) vs always-collapsed default vs always-expanded?
  - Should ancestors of the current page auto-open (upstream does this) — and should that override saved collapsed state?
- Maximum display depth: show full tree or only N levels with deeper levels reachable via entry pages ("route all files through on-page dataview queries")?

## Mobile UX

- Parking notes describe: half-screen drawer, background blur, no bottom dvh cover on iOS Safari, button on the right, between up/down buttons.
- Is the Explorer a slide-over drawer on mobile (like upstream) or a normal in-flow sidebar section?
- How does the toggle button relate to the toolbar group (Search, ThemeToggle)? New button component? Part of the drawer?
- Body scroll locking while drawer is open — upstream had a horizontal-scroll bug here; how to avoid repeating it?
- Desktop: always visible (per "explorer meant to be always visible") — is the drawer entirely a mobile-only concern?

## Styling & Theming

- Three-mode theme system (light/dark/dark-low) — drawer blur, borders, active states must read palette vars only, no hard-coded colors?
- File/folder icons:
  - Distinct icons for homepage, `_static`, `@journal`, `@projects`, `@system`, uniform icon for the rest (parking idea). Lucide? Inline SVG? Build-time or CSS mask?
- Active page highlight, hover states, indent guides — how much polish in this phase vs deferred?
- Interplay with `base.css` responsive grid (sidebar becomes horizontal row at 800px) — does Explorer styling live in component CSS or base.css?

## Entry Pages & Dataview Listings

- Generic Dataview query per entry page — but does Quartz Syncer actually render Dataview to HTML before sync (plan asserts it; content shows no `.html` artifacts; is this verified)?
- If Dataview rendering is unreliable, what's the fallback: manual lists, a build-time Quartz transformer that renders listings, or a custom listing component?
- What does the generic query show: file names only? folder-relative paths? descriptions from frontmatter (the `_static` idea of parsing descriptions)?
- Homepage `index.md` as top-level hub — is its redesign in scope or later?
- Overlap question from parking: should folder entry pages replace README.md files?
- Frontmatter/properties of entry pages: do they need to be excluded from commentable posts (`id` rules), unlisted, or specially styled?

## Packaging & Code Organization

- Three placement options for the new Explorer:
  - `quartz/components/` inline (rogue repo, simplest wiring, touches core tree)
  - `custom-plugins/<name>/` package with manifest + committed `dist/` (remark42 precedent; build:plugins flow; verify:dist enforcement)
  - keep npm package, just reconfigure
- If local package: does it need the full ceremony (own build.mjs, committed dist, audit scripts) or is that remark42-specific baggage?
- Script bundling: `afterDOMLoaded` string contract — how do we develop/debug an inline script inside that contract?
- Tests: phase has `tsx --test` and CI gates — does the new component get tests (tree-building logic is very testable) unlike remark42's "no test suite" policy?

## Upstream Quirks To Avoid (from reference snapshot)

- `useSavedState` option ignored by the inline script (state always saved) — keep or kill the option?
- `folderDefaultState` emitted to DOM but unused as fallback (hard-coded collapsed) — decide one behavior.
- Click-handler JSON parsing without catch (crash on corrupt localStorage) vs load-time parsing with catch.
- Permalink placement quirk (file with permalink stays in file-path folder).
- Mobile absolute-positioning horizontal-scroll bug.
- Scroll position persistence via sessionStorage (`explorerScrollTop`) — keep this nicety?
- 29 locale files — repo keeps only `en-US` + definition; don't import the i18n machinery at all?

## Performance & Scale

- Content index size on the client vs SSR'd tree size — which is cheaper at 50–500 files?
- Trie rebuild on every SPA nav vs once per full load vs never (static HTML).
- Does a build-time tree even scale to `@journal`'s date-heavy structure, or should journals be pruned from the tree regardless?

## Interplay With Other Planned Work

- Scroll restoration idea (phase ideas) — explorer drawer state vs page scroll, any conflicts?
- "Recently opened" widget, calendar widget — do they share the left sidebar space budget? Does Explorer's height need to shrink to leave room?
- Breadcrumbs component already exists before-body — does the "back/home buttons" idea from parking duplicate it?
- In-page navigation idea — overlaps with entry-page hierarchy; keep out of scope?

## Sequencing & Risk

- Which first: structure update (entry pages) or Explorer component? Entry pages define the inclusion data the Explorer consumes.
- Risk: entry pages created now (generic Dataview) may need rework when specialized pages arrive — is throwaway acceptable?
- Verification: how is the new Explorer tested without previews (Workers Builds deploys straight to prod on push)? Local `--serve`? Keep or port the preview server (it's a refactor idea to remove CLI — does this phase need it first)?
- Does this phase need a decision on `@journal`/`@projects` visibility _before_ the Explorer ships, since the Explorer makes structure public and navigable?

---

## High-Level Possibilities

### \[ARCHITECTURAL] Build-time static tree — Explorer rendered fully server-side

**Description** — Compute the entire Explorer tree at build time and emit it as static HTML inside the component, instead of building the trie client-side from the fetched content index.
**How To Do This** — In the component's build step, access the full list of slugs/files (the same data the content-index emitter consumes), apply inclusion rules (homepage + `_<folder>.md` entry pages), build the trie, and render nested lists via Preact. Client script then only handles collapse toggles, active-page highlight, and persistence.
**Benefit** — Removes the client-side `fetchData` dependency and the whole stale-render/generation-counter machinery from upstream; first paint shows a complete tree with no loading flicker; inclusion rules are enforced with build-time certainty (important for privacy); SPA nav needs no re-render of the tree at all, only an active-class update.
**Complexity** — Moderate. Requires confirming that component/emitter context exposes the file list at build time in this rogue Quartz version; slightly larger HTML per page (tree duplicated on every page unless amortized by caching/compression).
**Closed Advantageous Doors** — Loses the ability to change the tree client-side without a rebuild (e.g. runtime-added pages in dev preview behave like prod); any future "live" Explorer features (search-within-explorer, dynamic sorting) become harder.

### \[ARCHITECTURAL] New Explorer lives as a local package (`custom-plugins/`), following the remark42 precedent

**Description** — Implement the custom Explorer as a self-contained local plugin package with manifest-registered component and committed `dist/`, rather than inlining it into `quartz/components/`.
**How To Do This** — Create `custom-plugins/explorer/` with `src/index.tsx` + browser script, a `build.mjs` (possibly simplified from remark42's), register it in `quartz.config.yaml` with a `left` placement, remove `@quartz-community/explorer` from dependencies.
**Benefit** — Clear ownership boundary consistent with the one local plugin already shipped; keeps the rogue-but-organized structure; the compile-once/commit-`dist/` flow already has CI enforcement (`verify:dist`) so no new machinery is needed.
**Complexity** — Low-moderate: the packaging pattern is proven in-repo; cost is mostly discipline (run `npm run build:plugins` after every source edit) and deciding how much of remark42's build ceremony to trim.
**Closed Advantageous Doors** — Harder to share private component state with core components (everything goes through props/config); a future upstream re-adopt of Explorer would mean removing the package rather than flipping config.

### \[BLIND SPOT] Content visibility audit must precede Explorer

**Description** — The Explorer makes the vault structure publicly navigable, so decide the public/private boundary before it ships: `@projects/taras.life/__obsidian__/` (your entire planning vault — including this phase's files) and `_private/` are currently synced into `content/`.
**How To Do This** — Decide per-top-level-folder: publish, entry-page-only (files exist but not listed), or unlisted/excluded entirely. Check how `@quartz-community/unlisted-pages` (already enabled) interacts; wire exclusions into the Explorer's inclusion rules as a data filter, not CSS hiding.
**Benefit** — Prevents shipping a beautiful navigator for content you didn't intend to publish; avoids the embarrassing case of the Explorer linking to its own planning notes.
**Complexity** — Low in code, high in decision-making. The Explorer-side implementation is a predicate function; the syncer/exclusion side may need config changes outside this phase's scope if unlisted-pages doesn't cover it.
**Closed Advantageous Doors** — Hard exclusion of e.g. `@journal` closes the door on a future "journal calendar" widget consuming that data via the Explorer tree (it could still consume the content index directly).

### \[BLIND SPOT] Verify the Dataview → Syncer → Quartz pipeline before designing entry pages around it

**Description** — The plan asserts Quartz Syncer renders Dataview queries to HTML before sync, but exploration found no rendered-HTML artifacts in `content/` and no repo-side processor for them. The entire "generic Dataview listing" strategy rests on an unverified assumption.
**How To Do This** — Empirically test: create one entry page with a Dataview query, run the syncer, inspect what lands in `content/` and how it flows through remark/rehype (dangerous-HTML is allowed through, which is promising). If it fails, fall back to a build-time listing transformer or manual lists for this phase.
**Benefit** — Avoids building entry pages on a pipeline that silently renders nothing (empty listing pages), and avoids discovering this after N entry pages exist.
**Complexity** — Low: one test cycle. If it fails, the fallback (build-time transformer) is moderate work but well-scoped.
**Closed Advantageous Doors** — Committing heavily to Dataview-rendered HTML makes entry pages depend on Obsidian plugin behavior at sync time; a build-time transformer approach closes the door on rich in-vault preview of those listings (Obsidian would show code, not rendered lists).

### \[LOW EFFORT - HIGH REWARD] Rewrite-from-scratch as deliberate stripping, keeping only needed behavior

**Description** — Treat the reference snapshot as a bug list, not a code base: rewrite the Explorer minimal (~a few hundred lines total), keeping only: static tree, collapse toggle, localStorage persistence, active highlight, mobile drawer.
**How To Do This** — Start from a blank component; consult `explorer-main` only for its failure modes (useSavedState ignored, folderDefaultState unused, uncaught JSON.parse, mobile horizontal scroll, permalink placement quirk). No i18n machinery, no filter/map/sort callback surface, no OverflowList.
**Benefit** — Directly resolves the parking-note frustration ("a lot of configurability that I don't need"); the saved-state option confusion disappears because there's one behavior; code size and maintenance drop dramatically.
**Complexity** — Low once the tree data source is decided; the risk is underestimating the mobile drawer CSS, which is where the upstream complexity actually lives.
**Closed Advantageous Doors** — No callback/sort/filter surface closes the door on fine-grained per-folder customization later (can be re-added, but as new design, not config).

### \[PROPER LONG-TERM] Foldability + collapsible-toolbar is a growth requirement, not polish

**Description** — The vault is projected to reach 30+ top-level entry pages; a permanently-expanded flat list breaks before the year ends. Design collapse semantics now: default state, per-folder persisted state, auto-open ancestors of the current page.
**How To Do This** — Persist `{ path, collapsed }` records in localStorage (upstream's key shape is fine), auto-open the active path on nav, add a small toolbar with collapse-all/expand-all (skip "settings" until a second setting exists).
**Benefit** — The Explorer stays usable as the vault grows; avoids a painful retrofit of persistence semantics after users (you) have muscle memory of an always-open tree.
**Complexity** — Low-moderate: persistence is simple JSON; the care points are the auto-open-override interaction and uncaught-parse hardening.
**Closed Advantageous Doors** — Per-folder persisted state locks in the mental model "folders remember"; a future "smart auto-collapse by recency" design would fight it.

### \[UX] Mobile drawer with explicit scroll-lock, rebuilt without upstream's bugs

**Description** — Mobile: half-screen slide-over drawer, backdrop blur, toggle button on the right (between up/down controls per parking notes), no iOS bottom dvh hacks, body scroll locked while open.
**How To Do This** — CSS-only drawer (transform + fixed overlay), `overflow: hidden` on a scroll-lock class applied to `documentElement`/`body` while open, test the 800px breakpoint boundary already defined in `base.css`; place the toggle in the existing toolbar group.
**Benefit** — Mobile navigation was called out as the main reason Explorer must exist at all; getting the drawer right in one pass avoids re-touching this fragile CSS repeatedly.
**Complexity** — Moderate — this is the most CSS-heavy part of the phase and the historic source of upstream bugs (horizontal scroll widening).
**Closed Advantageous Doors** — A half-screen drawer (not full-height) closes the door on displaying many entries at once on mobile; fine if paired with collapse, cramped if the tree grows beyond ~30 visible rows.

### \[PERFORMANCE] Active-page highlight via a tiny nav hook, no trie re-render

**Description** — On SPA navigation, don't rebuild the tree like upstream; just move the `active` class (and auto-open the new path) in the already-present static DOM.
**How To Do This** — Subscribe to the SPA `nav` event, compare new slug to the current `[data-path]` node, swap classes, and open ancestor folders; a few dozen lines replacing upstream's ~15KB inline script's re-render path.
**Benefit** — Cheaper navigations, no flicker, no stale-render race conditions, and the DOM-morphing via micromorph stays trivial since the tree rarely changes.
**Complexity** — Low; the main care point is micromorph morphing the tree HTML between pages (it should be identical across pages, making the diff a no-op).
**Closed Advantageous Doors** — Without client trie, features needing runtime file knowledge (e.g. "recently opened" markers inside the tree) can't hang off the Explorer's own data; they'd consume the content index separately.

### \[PROPER LONG-TERM] Ship tree-logic tests where remark42 has none

**Description** — Unlike the remark42 plugin's no-test-suite policy, the Explorer's inclusion rules and tree building are pure functions — ideal for `tsx --test`, and CI already runs them.
**How To Do This** — Extract `applyInclusionRules(files)` and `buildTree(files)` as pure modules; write table-driven tests for case-insensitive `_@system.md` matching, orphan-collapsing behavior, `@journal`-style exclusions, and permalink edge cases.
**Benefit** — The inclusion/exclusion rules are exactly the kind of subtle logic that silently breaks when a new folder type appears (e.g. `_private`, `__obsidian__`); tests make future structure changes safe and self-documenting.
**Complexity** — Low if the logic is extracted as pure functions from the start; painful if embedded in the component (would require refactoring first).
**Closed Advantageous Doors** — None of significance; pure-function extraction is refactor-friendly.

### \[LOW EFFORT - HIGH REWARD] Icons-per-known-folder as a data map, not a system

**Description** — The parking idea of distinct icons for `_static`, `@journal`, `@projects`, `@system` + homepage, uniform icon for the rest, is best as a simple slug→icon lookup map, not an icon-selection framework.
**How To Do This** — Inline a handful of Lucide SVG paths (or CSS masks) in the component, keyed by slug segment; unknown folders fall through to the default icon. No runtime icon library dependency.
**Benefit** — Delivers the "easier to abstract structure" cognitive benefit from parking notes for near-zero cost and zero new dependencies; scales trivially by adding map entries.
**Complexity** — Very low. Only decision is build-time inline SVG vs CSS mask (CSS mask keeps the component cleaner; inline SVG allows currentColor theming).
**Closed Advantageous Doors** — A hand-maintained map doesn't auto-extend to new folders (they get the default icon until mapped) — acceptable, but closes the door on per-file-type icons without redesign.
