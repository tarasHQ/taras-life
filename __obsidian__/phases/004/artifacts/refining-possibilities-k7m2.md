# Phase 004 — Refining possibilities

## Open exploration

- What is the Explorer's primary job: orient readers, provide a compact map, or replace broad file navigation?
  - How many levels should be visible at once as the vault grows?
  - Should the tree reflect directory structure exactly, recognized entry pages, or an authored conceptual structure?
  - How do readers find material that has no entry page?
- How should entry pages and the published structure relate?
  - Which folders deserve an entry page, and who decides?
  - What happens where a path has no recognized ancestor, a matching page is filtered, or names differ only in case?
  - How should source filenames, rendered slugs, display titles, and links relate?
  - Can renamed folders or entry pages break external links or saved Explorer state?
  - How should vault-private or unpublished pages affect generated lists?
- How should discovery and tree construction be owned?
  - Could the build use actual source paths and publish the resulting navigation as HTML or compact data?
  - What changes if discovery remains in the browser or is maintained explicitly?
  - How do generated pages, SPA navigation, incremental builds, and a missing homepage affect these choices?
- What does a generic Dataview listing mean across different folder shapes?
  - Should it list immediate files, descendant files, entry pages, or subfolders?
  - How are its own entry page, duplicates, private content, sorting, labels, and empty states handled?
  - What does Quartz Syncer actually emit, and when is that output refreshed?
  - Can examples be verified in Obsidian and on the published site before scaling the convention?
- How should navigation behave on desktop and mobile?
  - How are page links separated from expansion controls?
  - When should branches expand, and what is remembered across navigations and sessions?
  - How should a mobile panel open, close, trap or restore focus, handle escape, scrolling, and back navigation?
  - Are standard disclosure semantics sufficient without implementing a full ARIA tree widget?
  - How are active page and ancestor highlighted, including pages excluded from the Explorer?
- How can the design be tested and maintained?
  - Which properties need automated tests and which require browser and phone checks?
  - How should malformed conventions or ambiguous matches be surfaced?
  - Is a local component or a separately built plugin appropriate for the actual ownership and lifecycle?
  - How should visual detail, icons, and more specialized pages remain independent future work?

## Architectural possibilities

### [Architecture] Derive the Explorer from source entry pages at build time
**Description:** Treat published root and folder entry pages as navigation nodes and connect each to its nearest recognized ancestor.
**How To Do This:** Discover entries from source paths during generation; render links and hierarchy using the pages' actual published slugs.
**Benefit:** A small automatic navigation tree follows the existing vault convention without exposing all notes or requiring a separate manifest.
**Complexity:** Moderate; path matching, filtering, ambiguous names, incremental rebuilds, and link validity require care.
**Closed Advantageous Doors:**
- Fully independent navigation hierarchy without additional metadata.
- Browser-only reconfiguration without rebuilding.
**Description In Simpler Terms:** The build makes a menu automatically from specially named pages.

### [Architecture] Author the navigation map explicitly
**Description:** Declare the Explorer's nodes and relationships in a manifest or frontmatter rather than infer all relationships from folder names.
**How To Do This:** Maintain a small structured list of destinations and nesting, optionally validating destinations during the build.
**Benefit:** Navigation can reflect concepts instead of filesystem quirks and can stay compact even as entry pages multiply.
**Complexity:** Low to moderate technical complexity, plus continuing authoring and synchronization effort.
**Closed Advantageous Doors:**
- Zero-maintenance automatic discovery unless complemented by another mechanism.
- Renames automatically propagating without stable identifiers or tooling.
**Description In Simpler Terms:** You write the menu yourself instead of letting folder names choose it.

### [Architecture] Combine convention with selective overrides
**Description:** Derive a default tree from entry-page names while allowing explicit inclusion, exclusion, ordering, labels, or parent overrides.
**How To Do This:** Use naming as the default and define a narrow, documented metadata or configuration override contract.
**Benefit:** Most of the menu stays automatic while exceptional cases do not force vault restructuring.
**Complexity:** Moderate to high: rules need precedence, validation, and durable documentation.
**Closed Advantageous Doors:**
- A completely transparent one-rule inclusion model.
- A minimal implementation with no competing sources of truth.
**Description In Simpler Terms:** The menu builds itself, but you can change selected parts.

### [Content] Make folder entry pages the primary discovery surface
**Description:** Keep Explorer limited to landmarks and let generic entry pages expose the underlying content.
**How To Do This:** Define a Dataview listing convention, test its synced HTML, and create pages where the vault needs navigational hubs.
**Benefit:** Readers can explore large collections without turning the sidebar into a full file browser; the same hubs can serve Obsidian and the site.
**Complexity:** Moderate and partly outside this repository: query semantics, sync freshness, publication boundaries, and authoring effort must be verified.
**Closed Advantageous Doors:**
- One-click sidebar access to every note without adding another navigation feature.
- A website entirely independent of vault-rendered query output.
**Description In Simpler Terms:** The sidebar takes people to section homepages; those pages list the actual notes.

### [Content] Preserve separate vault and website navigation
**Description:** Build website navigation from published content while leaving vault-facing entry pages and Dataview optional or separately authored.
**How To Do This:** Generate site listings from published page metadata, or author site-only hubs, without depending on synced Dataview HTML.
**Benefit:** Website visibility and links can be controlled against actual published content, independently of Obsidian and Syncer rendering.
**Complexity:** Moderate to high; duplicates or separates authoring concerns and may require a Quartz generation feature.
**Closed Advantageous Doors:**
- One identical navigation experience authored once for both environments.
- Avoiding site-specific generation or duplicated content entirely.
**Description In Simpler Terms:** Obsidian and the website each get navigation designed for their own needs.

### [Accessibility] Use ordinary links and disclosure buttons
**Description:** Present a nested list with a separate page link and branch toggle rather than a specialized keyboard-controlled tree widget.
**How To Do This:** Use semantic navigation, links, and buttons with expanded state, and design mobile focus and dismissal behavior explicitly.
**Benefit:** Familiar browser interactions and simpler keyboard support reduce the risk of confusing or inaccessible controls.
**Complexity:** Moderate, especially for accessible mobile overlay behavior and SPA lifecycle management.
**Closed Advantageous Doors:**
- Desktop-app-style arrow-key tree interaction unless later implemented carefully.
- A single click target that simultaneously has unambiguous link and toggle behavior.
**Description In Simpler Terms:** The text opens the page, and a separate arrow opens its subpages.

### [Resilience] Treat navigation as build-validated content
**Description:** Specify how ambiguous, missing, filtered, renamed, or otherwise invalid entries are handled before publishing.
**How To Do This:** Validate matching and link targets at build or audit time and test representative paths and state transitions.
**Benefit:** Naming and publishing mistakes become visible instead of silently producing broken or misleading navigation.
**Complexity:** Moderate; strict failures need to be balanced against authoring convenience and existing pipeline behavior.
**Closed Advantageous Doors:**
- Completely silent best-effort behavior for malformed content if strict validation is chosen.
- Arbitrary naming without compatibility rules.
**Description In Simpler Terms:** Catch confusing menu entries before readers see them.

### [Implementation] Choose the component ownership and delivery boundary
**Description:** Choose between a focused in-repository component, a separate local plugin, adapting the community plugin, or static data plus a small interaction layer.
**How To Do This:** Compare integration points, packaging, rebuild lifecycle, accessibility and maintenance against the desired behavior.
**Benefit:** Ownership and maintenance cost become explicit rather than inheriting unnecessary configurability or packaging machinery.
**Complexity:** Varies from adapting existing code to maintaining a new independently packaged plugin; integration needs verification.
**Closed Advantageous Doors:**
- Easy community package upgrades if heavily forked or replaced.
- Independent distribution if implemented only as a tightly coupled local component.
**Description In Simpler Terms:** Decide whether to adjust the existing menu or own a smaller custom one, and where it lives.
