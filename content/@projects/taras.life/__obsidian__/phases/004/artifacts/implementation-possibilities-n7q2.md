# Phase 004 — Implementation Possibilities

## Exploratory questions

- How can source-backed entry pages be selected from published content without admitting synthetic virtual pages or maintaining a navigation map?
  - Which existing build-time boundary exposes filtered source data and actual published slugs together?
  - How should partial rebuilds update the list across pages?
- What information about explicitly authored titles and arbitrary icon metadata reaches components after the configured frontmatter plugin runs?
  - How can a filename-derived fallback stay faithful to the convention?
  - What should happen for unknown icon names and unusual metadata values?
  - What comparison makes alphabetical ordering clear and reproducible?
- How can the internal component participate in existing layout and resource collection without adopting a separately packaged community plugin?
  - Which obsolete community dependency, configuration and CSS are tied to its removal?
- How can selected local SVG geometry become one namespaced definition per used icon per page?
  - How can IDs, SVG inheritance and SPA replacement behave consistently without an extra fetch?
  - How should selected icon sources and licenses be maintained?
- How can the mobile menu occupy only the space it needs while staying usable on narrow screens and with long labels?
  - What semantics, dismissal, focus and scrolling behavior are suitable to test?
  - How should its control coexist with future floating buttons without owning the sidebar?
- Is exact-page or top-level-section highlighting useful, and what should its behavior be across SPA navigation?
- What entry pages are actually needed in the source vault, and how should generic Dataview listings expose deeper material without creating an additional navigation map?
  - How can authorship and sync ownership be respected without assuming that repository content is the source of truth?
- What focused automated checks would protect discovery, metadata, slugs, static markup and icons without creating a dedicated navigation-validation system?
  - What browser checks remain necessary for mobile, themes, SVG references and SPA navigation?
- Which work should remain deferred so that high-level planning does not prematurely dictate implementation details?

## Draft possibilities

### \[DISCOVERY] Source-backed published entries

- **Description:** Derive the Explorer from published source pages, excluding generated lookalikes. Match original source-relative paths and retain each page's published slug.
- **How To Do This:** Identify an existing source-only build boundary or correlate page data with trusted source identity; verify full and incremental builds. Keep navigation structure implicit in paths.
- **Benefit:** The menu follows actual publishable content and avoids incorrect links or virtual entries masquerading as authored files.
- **Complexity:** Moderate: component data currently combines source and virtual pages, and incremental rebuild behavior needs inspection.
- **Closed Advantageous Doors:**
  - Automatically including virtual sections would require a later deliberate change.
- **Description In Simpler Terms:** List real entry files that will actually be published, and link to the URLs Quartz really emits.

### \[METADATA] Predictable presentation defaults

- **Description:** Specify title and icon field handling, unknown icon behavior, and deterministic alphabetical sorting without allowing metadata to decide inclusion.
- **How To Do This:** Verify the configured frontmatter transformer, then select explicit fallback and comparison rules compatible with the documented naming convention.
- **Benefit:** Authors can anticipate menu labels, ordering, and icon behavior without maintaining navigation configuration.
- **Complexity:** Low to moderate; depends on whether upstream metadata preserves authored-versus-generated title information.
- **Closed Advantageous Doors:**
  - A chosen sort and fallback policy may require a deliberate compatibility change later.
- **Description In Simpler Terms:** Make labels, ordering, and missing or unrecognized icons behave consistently.

### \[INTEGRATION] Internal component in the existing layout

- **Description:** Register a focused internal component in the existing Quartz layout rather than maintaining a separate Explorer package.
- **How To Do This:** Use an established internal registration path, attach component resources, remove obsolete community configuration and dependency where appropriate, and check responsive sidebar styles.
- **Benefit:** One owner for the site's small navigation component, without carrying configurable tree machinery or its build packaging.
- **Complexity:** Moderate; the configuration loader and dependency cleanup need coordinated changes.
- **Closed Advantageous Doors:**
  - Independent reuse or separate release of the Explorer would become less convenient than a packaged plugin.
- **Description In Simpler Terms:** Make the menu part of this site instead of installing a general-purpose tree menu.

### \[ICONS] Local SVG definitions with page-scoped reuse

- **Description:** Maintain only selected icon geometry and define each used icon once inside each page, with namespaced references and shared theme-aware styling.
- **How To Do This:** Choose a locally maintainable geometry representation supported by the current build; test references, default reuse, theme inheritance, and applicable licenses.
- **Benefit:** Icons arrive with the page and repeated default icons share geometry without an additional network request or library shipment.
- **Complexity:** Moderate, especially around SVG inheritance and browser/SPA behavior.
- **Closed Advantageous Doors:**
  - Swapping in a whole icon library or updating all icons externally is less automatic.
- **Description In Simpler Terms:** Put the small set of pictures the menu uses directly in the page, sharing repeated ones.

### \[MOBILE] Accessible content-sized right-side menu

- **Description:** Retain the desktop list and add a compact right-side mobile trigger and content-sized menu constrained by the viewport.
- **How To Do This:** Choose a suitable menu interaction pattern, integrate with the SPA lifecycle, reserve space for future controls, and refine keyboard, focus, scrolling and dismissal through practical tests.
- **Benefit:** Mobile readers can navigate without a permanent full-width tree, while long labels and small screens remain usable.
- **Complexity:** Moderate; keyboard behavior, safe areas, viewport limits and SPA cleanup require attention.
- **Closed Advantageous Doors:**
  - A full-screen or fixed-width drawer would be less natural without revisiting the locked size direction.
- **Description In Simpler Terms:** A small button opens a right-hand menu that fits its contents but never becomes unusable on a phone.

### \[STATE] Deliberate current-location indication

- **Description:** Choose between exact-page highlighting, top-level section highlighting, or no highlighting, without assuming a client-side hook is required.
- **How To Do This:** Compare the useful location semantics and available slugs, then verify the chosen behavior through SPA and browser history navigation.
- **Benefit:** A deliberately chosen indicator can orient readers without creating misleading navigation state.
- **Complexity:** Low to moderate depending on the selected semantics and SPA behavior.
- **Closed Advantageous Doors:**
  - A visual convention for exact pages or sections may bias readers' expectations if changed later.
- **Description In Simpler Terms:** Decide whether the menu should mark where the reader is and, if so, what counts as their location.

### \[CONTENT] Vault-owned generic entry pages

- **Description:** Create the necessary entry pages at the appropriate source of truth, using generic Dataview navigation for deeper content.
- **How To Do This:** Inventory intended public sections and vault ownership with the user, create matching entry pages where needed, and use the already verified Syncer workflow rather than building another navigation system.
- **Benefit:** The menu and deeper browsing grow naturally with the vault while respecting sync ownership and avoiding duplicated navigation maps.
- **Complexity:** Variable with the number of sections and access to the actual vault; the current repository inventory does not prove which pages should be created.
- **Closed Advantageous Doors:**
  - Generic listings postpone curated, visually refined per-section landing pages.
- **Description In Simpler Terms:** Add simple landing pages in the vault so each section can list its contents automatically.

### \[VERIFICATION] Focused build and browser checks

- **Description:** Test the small navigation contract and complement it with practical browser checks, rather than introducing a separate validation subsystem.
- **How To Do This:** Exercise real versus synthetic inputs, naming, metadata, slugs, sorting, static SVG/markup and rebuild integration; check mobile, themes, history and repeated SPA interaction by browsing.
- **Benefit:** Important regressions become visible early while browser-only behavior is checked where it actually runs.
- **Complexity:** Moderate; some integration fixtures may be needed for configured upstream metadata and virtual pages.
- **Closed Advantageous Doors:**
  - A comprehensive dedicated navigation auditing framework is deferred unless a real need emerges.
- **Description In Simpler Terms:** Automatically check what can be checked reliably and try the actual menu in browsers for the rest.
