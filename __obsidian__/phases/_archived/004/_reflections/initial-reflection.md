[← Phase 004](../_plan_004.md)

# Initial Reflection — Structure & Explorer

## Problem and direction

The existing Explorer exposes a broad file tree and carries behavior and configuration that are unnecessary for this site. As the vault grows, listing individual files or many nested sections in the sidebar would make it harder to navigate, especially on phones.

Use the vault's coherent structure as the single source of truth rather than maintaining shortcuts and exceptions in a separate navigation map. The Explorer provides a small map of top-level sections; section entry pages provide deeper navigation through generic Dataview listings. Quartz Syncer renders those queries to HTML before syncing to Quartz; the user has already verified this works. Trust this existing behavior for the phase: no preparatory Syncer investigation or separate website navigation system is planned.

## Agreed decisions

- **Entry pages:** The root homepage is `index.md`. A folder's entry page is `_<folder-name>.md` within that folder, matched case-insensitively with every other character preserved. Create entry pages where needed as one structure-update step; specialized and visually refined pages are future work.
- **Explorer inclusion:** At build time, discover only matching entry pages in immediate subfolders of the content root. The Explorer is flat; nested entry pages and individual notes are reached through page content, not listed in the sidebar.
- **Labels and order:** Reuse the existing processed frontmatter title. If missing, empty, or identical to the entry filename stem, use the filename without its extension and first underscore (e.g. `_@system.md` → `@system`, `__static.md` → `_static`). An explicitly authored title equal to the stem follows the same fallback; later implementation discussion deliberately dropped provenance detection and additional parsing. Sort by displayed label, then show the homepage as `Home` at the bottom.
- **Icons:** An optional entry-page frontmatter icon selects a locally maintained SVG. Use a default SVG when no icon is specified. Keep a small collection of selected SVGs in the project rather than shipping a whole icon library; adding an infrequently changed icon may involve editing the project. Icon and title are presentation metadata, not navigation structure.
- **Delivery:** Bake the complete Explorer list, links, labels, and used icon definitions into each page's HTML. Define each used SVG once per page and reuse it by namespaced ID, with presentation in shared theme-aware CSS for light, dark, and dark-low modes. Maintain selected SVG sources locally; do not ship an entire icon library, fetch a separate Explorer or icon asset, or construct the list in browser JavaScript. This accepts repeated markup to avoid delayed menu or icon appearance from separate loads; check SPA behavior through practical browsing after implementation. No icon-loading script or load animation is needed; browser code may still handle mobile interaction. Decorative icons should be hidden from screen readers when link text supplies their name.
- **Desktop:** The original direction is an always-visible Explorer without a heading that folds the entire component.
- **Mobile:** Place a compact floating Explorer button on the right. Leave room for future scroll-up and scroll-down buttons in the same vertical group, without implementing them now. Open the menu from the right and size it to its content rather than a fixed percentage or pixel width; keep it usable within the viewport. Choose suitable interaction and accessibility details during implementation, then refine them based on testing. A no-JavaScript Explorer fallback is not required; a site-wide JavaScript warning is a separate project idea.
- **Ownership:** Build a focused internal Quartz component instead of adapting the community Explorer or introducing a separate plugin package and build process. Use the existing layout and resource mechanisms.
- **Current location:** Highlight the entry for the current page's top-level section, including when viewing that entry itself. Highlight `Home` on the homepage.
- **Watch rebuilds:** Accept that unchanged pages can retain stale baked Explorer markup after entry additions, changes, or deletions in watch mode. Document the limitation and full-rebuild remedy in the relevant local README; do not add invalidation machinery for it.
- **Simplicity:** No separately authored navigation map, naming or hierarchy overrides, or dedicated navigation-validation system. Match existing source-relative page paths and use actual slugs without speculative virtual-page tracking. Optional title and icon affect presentation only. Introduce additional capabilities only if a real need arises; keep tests focused on meaningful behavior.

## Open for later discussion

- Later decisions fix existing parsed title/icon metadata as the presentation source, sorting by displayed label, and no icon for unrecognized or unusable selections; only absent selections receive the default.
- Mobile dismissal, focus, scrolling, and SPA interaction: choose a suitable implementation and refine it based on testing. After implementation, ask the user to browse the Explorer and check navigation, back/forward, repeated mobile menu use, and relevant edge cases. Earlier notes suggest background blur and avoiding bottom `dvh` covers for iOS Safari; these preferences have not been reconfirmed. The old fixed half-screen width is superseded by content-based sizing.
- Exact component placement in the existing Quartz loader and SPA implementation of the agreed current-section highlight.
- The later title simplification supersedes authored-title provenance: reuse processed metadata and accept the stem-equal exception rather than adding parsing or transformer machinery.
- Which entry pages are needed and where to author them in the vault workflow; do not assume edits to synced `content/` update the vault.

These are not locked decisions and should be resolved as needed when writing implementation steps.
