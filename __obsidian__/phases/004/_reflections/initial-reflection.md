[← Phase 004](../_plan_004.md)

# Initial Reflection — Structure & Explorer

## Problem and direction

The existing Explorer exposes a broad file tree and carries behavior and configuration that are unnecessary for this site. As the vault grows, listing individual files or many nested sections in the sidebar would make it harder to navigate, especially on phones.

Use the vault's coherent structure as the single source of truth rather than maintaining shortcuts and exceptions in a separate navigation map. The Explorer provides a small map of top-level sections; section entry pages provide deeper navigation through generic Dataview listings. Quartz Syncer renders those queries to HTML before syncing to Quartz. Trust this existing behavior for the phase: no preparatory Syncer investigation or separate website navigation system is planned.

## Agreed decisions

- **Entry pages:** The root homepage is `index.md`. A folder's entry page is `_<folder-name>.md` within that folder, matched case-insensitively with every other character preserved. Create entry pages where needed as one structure-update step; specialized and visually refined pages are future work.
- **Explorer inclusion:** At build time, discover only matching entry pages in immediate subfolders of the content root. The Explorer is flat; nested entry pages and individual notes are reached through page content, not listed in the sidebar.
- **Labels and order:** Use an optional entry-page frontmatter title as the section label. If absent, use the filename without its extension and first underscore (e.g. `_@system.md` → `@system`, `__static.md` → `_static`). Sort section entries alphabetically, then show the homepage as `Home` at the bottom.
- **Icons:** An optional entry-page frontmatter icon selects a locally maintained SVG. Use a default SVG when no icon is specified. Keep a small collection of selected SVGs in the project rather than shipping a whole icon library; adding an infrequently changed icon may involve editing the project. Icon and title are presentation metadata, not navigation structure.
- **Delivery:** Bake the complete Explorer list, links, labels, and used icon definitions into each page's HTML. Define each used SVG once per page and reuse it by namespaced ID, with presentation in shared theme-aware CSS for light, dark, and dark-low modes. Maintain selected SVG sources locally; do not ship an entire icon library, fetch a separate Explorer or icon asset, or construct the list in browser JavaScript. This accepts repeated markup to avoid delayed menu or icon appearance from separate loads; measure output size and check SPA behavior rather than assuming savings. No icon-loading script or load animation is needed; browser code may still handle mobile interaction. Decorative icons should be hidden from screen readers when link text supplies their name.
- **Desktop:** The original direction is an always-visible Explorer without a heading that folds the entire component.
- **Mobile:** Place a compact floating Explorer button on the right. Leave room for future scroll-up and scroll-down buttons in the same vertical group, without implementing them now. Open the menu from the right and size it to its content rather than a fixed percentage or pixel width; keep it usable within the viewport.
- **Ownership:** Build a focused internal Explorer instead of adapting the community Explorer or carrying over its unnecessary configuration and potentially suboptimal solutions. The precise registration boundary is an implementation detail; build-time rendering alone does not require a separate plugin.
- **Simplicity:** No separately authored navigation map, naming or hierarchy overrides, or dedicated navigation-validation system. Optional title and icon affect presentation only. Introduce additional capabilities only if a real need arises.

## Open for later discussion

- Exact frontmatter field names, handling of an unrecognized icon name, and alphabetical comparison, including whether to sort by displayed title.
- Mobile dismissal, focus, scrolling and no-JavaScript behavior, and how the menu interacts with SPA navigation. Earlier notes suggest background blur and avoiding bottom `dvh` covers for iOS Safari; these preferences have not been reconfirmed. The old fixed half-screen width is superseded by content-based sizing.
- Whether to highlight the current page or section, and any state behavior.
- Exact component placement and registration in the existing Quartz loader. Discover using source-relative paths and link using actual published slugs; distinguish virtual pages as needed.

These are not locked decisions and should be resolved as needed when writing implementation steps.
