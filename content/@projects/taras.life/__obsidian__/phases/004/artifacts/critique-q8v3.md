# Phase 004 — critique exploration

- Navigation model
  - Does matching only immediate folders make important root pages and deeper content invisible or needlessly distant?
  - Does a folder-name convention remain understandable across renames, case differences, Unicode, collisions and missing pages?
  - Is a top-level-only menu still useful when categories are uneven or grow beyond the screen?
  - Can users identify their current section and reach Home naturally?
- Entry pages and Dataview
  - Do generic recursive listings overwhelm readers, duplicate links, expose internal files or create circular navigation?
  - Do synced query results actually link to published routes and refresh when descendants change?
  - What is the minimum end-to-end evidence needed without turning Syncer investigation into a separate project?
  - What happens when a page is absent, unlisted or excluded, or a Dataview result is stale?
- Build-time output and integration
  - Which processed pages and virtual pages reach the component, and which publication policies apply?
  - Do renamed, added and deleted entries invalidate already-rendered pages during watch builds?
  - Does per-page scanning turn an otherwise small feature into quadratic work?
  - What are the real transfer, compression, storage and SPA-fetch costs of repeated markup?
  - Are links correct under nested slugs, base paths, virtual pages and a missing homepage?
- SVG and metadata
  - Do SVG definitions and references work after SPA morphing, with multiple Explorer instances or widgets, and across target browsers?
  - Do source attributes, viewBox and stroke properties remain valid when presentation is centralized?
  - Are unknown icons, invalid or duplicate titles, sorting, escaping and icon licensing addressed?
  - Would independent inline icons actually be simpler for a small icon set?
- Responsive interaction
  - Is content-fit width bounded for long labels, zoom, narrow screens and scrolling?
  - Is the panel modal or a disclosure, and which keyboard, focus, scroll-lock and dismissal obligations follow?
  - Does it work without JavaScript and during SPA navigation, back/forward, resize and repeated openings?
  - How do desktop sticky sidebars, mobile safe areas, other fixed controls and future widgets share space?
- Scope and maintainability
  - Which useful community behaviors are genuinely necessary without copying its dynamic tree, configurable callbacks or persistence?
  - Does omitting a navigation-validation system also omit basic diagnostics and smoke tests?
  - Is there enough specification and acceptance testing to keep the phase coherent without becoming a framework?
  - Is the phase too large or too small once real content migration and accessibility work are included?

## Provisional weakest points

### \[Navigation / Blind Spots] Flat discovery can hide the site

- **Steelman:** A small top-level list avoids an exploding tree and a separate map.
- **Attacking:** Root pages and sections without exactly named entry pages disappear; deep destinations can be many clicks away, and case collisions or renames can silently change inclusion. A folder taxonomy may not match reader tasks.
- **Recommending:** Keep the flat model provisionally but inventory reachable content, define missing/ambiguous entry behavior, and test representative journeys before locking it as sufficient.
- **Why better:** It preserves simplicity while making actual coverage observable.
- **Description In Simpler Terms:** A short menu helps only if people can actually find where they want to go from it.

### \[Navigation / Correctness] Dataview is an unverified navigation dependency

- **Steelman:** Existing synced Dataview queries avoid hand-maintained links and reuse the vault structure.
- **Attacking:** Query results can be too broad, stale, link excluded or unlisted content, and may not match published paths. No local evidence proves the whole author-to-browser chain.
- **Recommending:** Trial one representative query end-to-end, define bounded listing and publication/link rules, and verify reachability after changes.
- **Why better:** It validates the actual dependency without adopting a second navigation engine.
- **Description In Simpler Terms:** An automatically generated directory is only useful if its links are current, public and lead somewhere.

### \[Correctness / Maintainability] No validation can mean silent navigation failures

- **Steelman:** Avoiding a separate validation system reduces complexity and configuration.
- **Attacking:** Missing home, case-insensitive collisions, invalid metadata and omitted sections can silently produce broken or ambiguous navigation; slug collisions are warnings.
- **Recommending:** Add narrow diagnostics or focused tests at the discovery boundary, not a configurable validation framework; choose severity deliberately.
- **Why better:** Small checks make naming conventions enforceable without maintaining another map.
- **Description In Simpler Terms:** A simple naming rule still needs a way to tell you when a typo breaks it.

### \[Correctness / SPA] Build-time shared navigation conflicts with partial rebuilds

- **Steelman:** Static HTML avoids waiting for a client-side content index and works as ordinary markup.
- **Attacking:** The watch dispatcher emits changed regular pages, so a changed section entry may leave older pages with stale menu links, labels or icons until rebuilt. SPA morphing adds lifecycle and state concerns.
- **Recommending:** Verify full and incremental builds; document the watch limitation or add targeted invalidation only if needed. Use the existing nav/cleanup contract for interactions.
- **Why better:** It makes consistency explicit without automatically expanding the build architecture.
- **Description In Simpler Terms:** If the shared menu is copied into every page, changing the menu does not automatically update every old copy.

### \[Performance] Repeated markup and discovery have unmeasured costs

- **Steelman:** Repeating a small menu avoids requests and render delay, and compression helps each response.
- **Attacking:** Repeating bytes on every page and scanning all content per page can scale with both site size and page count; gzip does not deduplicate across responses. Actual magnitude is unknown.
- **Recommending:** Measure raw and compressed HTML and build timings with representative and larger content; choose the simplest build-pass caching only if worthwhile.
- **Why better:** It distinguishes a real problem from hypothetical optimization while preserving the immediate-render goal.
- **Description In Simpler Terms:** Copying a menu onto every page may be cheap or expensive; the answer depends on its actual size and how often the site builds.

### \[Maintainability / Compatibility] SVG reuse may be cleverer than needed

- **Steelman:** One definition per icon reduces repeated geometry, keeps icons local and uses shared theme CSS.
- **Attacking:** IDs, viewBox, use semantics, source-specific stroke/fill, SPA patching and duplicate render instances increase coupling; sharing saves little if icons are mostly unique. Invalid icon behavior is unspecified.
- **Recommending:** Compare reusable in-page symbols against direct inline SVG in actual output; define ID isolation, fallback/diagnostics, icon licensing and browser checks before choosing.
- **Why better:** It preserves instant rendering while selecting the simpler approach by evidence.
- **Description In Simpler Terms:** Reusing an icon stencil can save space, but it also creates extra references that must keep working.

### \[Accessibility / UX] The mobile menu is a shape without an interaction contract

- **Steelman:** A compact right-side, content-sized menu preserves reading space and reserves room for future controls.
- **Attacking:** Width, focus, keyboard dismissal, screen reader semantics, scroll, zoom, safe areas and no-JS behavior are undecided; large text or long lists can make the menu unusable. Fixed controls can overlap other widgets.
- **Recommending:** Choose an explicit modal or nonmodal disclosure model, set viewport bounds, specify keyboard/focus and navigation behavior, and test narrow screens and zoom before future-widget integration.
- **Why better:** It addresses real interaction obligations rather than inventing a shared widget framework.
- **Description In Simpler Terms:** A small menu still needs to be usable by keyboard and screen readers and fit on a small phone.

### \[UX / Maintainability] Desktop placement and active context are underspecified

- **Steelman:** Always-visible simple links make discovery immediate and avoid expandable tree complexity.
- **Attacking:** Long menus, sticky sidebars, tablet breakpoints and competing widgets can crowd content; no current-section context may leave users lost after deep navigation.
- **Recommending:** Define scrolling and overflow, choose a segment-aware active-section treatment if useful, and exercise real layouts with another placeholder widget rather than copying community tree behavior.
- **Why better:** It preserves a flat list while ensuring that it coexists with the page and remains orienting.
- **Description In Simpler Terms:** The menu should still make sense when it is long, other tools share the sidebar, and you are several pages deep.

### \[Scope] The size of the phase

The apparent small component hides content inventory, entry-page creation, synced listings, browser accessibility and rebuild verification; the actual size cannot be estimated responsibly without a content count and query trial. The phase may expand substantially if migration or broken publication links are widespread.

Keep the component and a representative navigation slice together, then either time-box the remaining entry-page migration or split broader content cleanup into a follow-on; alternatively keep it all in one phase with explicit completion criteria and a checkpoint after the end-to-end trial.
