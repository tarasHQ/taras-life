# quartz/components/

## Why it exists?
- Provides the reusable Preact building blocks and browser resources that turn generated content into site pages.

## What it does?
- Renders components to static HTML at build time; associated scripts and styles provide browser behavior without component hydration.

## Module Map
- `Head.tsx` — page metadata, icon links, and early theme initialization.
- `ThemeToggle.tsx` — theme-cycle button and its browser resources.
- `explorerNavigation.ts` — flat Explorer model built from processed page data.
- `Explorer.tsx`, `explorerIcons.tsx` — build-time Explorer links and trusted local SVG geometry.
- `LeftSidebarControls.tsx`, `scripts/leftSidebar.ts`, `styles/left-sidebar.css` — independent mobile sidebar presentation and lifecycle.
- `scripts/` — client behavior, including `themeContract.ts` and SPA navigation.
- `styles/` — component-specific CSS, including the toggle and popover styles.
- `frames/` — structural page frames; other component files render individual page elements.

## Additional Info

### Entry Point
- Layout construction in `quartz/plugins/loader/config-loader.ts` places core components, including the toggle. Read `Head.tsx` and `scripts/themeContract.ts` for theme initialization and switching.

### Decisions
- `themeContract.ts` owns the JavaScript contract for `light`, `dark`, and `dark-low`. A valid stored choice wins; otherwise the OS preference seeds the initial mode. Later OS changes do not overwrite the choice.
- `Head.tsx` inlines initialization before styles to avoid a theme flash. The toggle cycles the modes, persists the choice when possible, and dispatches the raw mode in the document's `themechange` event. Consumers with fewer modes must map it themselves.

### Explorer and sidebar
- `Explorer.tsx` renders the model from processed pages into one list per page, using published slugs for destinations and source folders for the current-section highlight. Only selected SVG definitions are included and reused within that page.
- Supported frontmatter selections are `stone`, `workflow`, `notebook`, `map`, `folder-closed`, and `house`. For example, `icon: stone` or `icon: house` selects an icon; a missing property defaults to `folder-closed`, while an invalid or unknown value shows no icon. Folder names do not select icons. To add an icon, add trusted 24×24 JSX geometry to `explorerIcons.tsx`; shared appearance belongs in `styles/explorer.css`.
- Left-slot components marked `leftSidebarRegion: top` stay in the title/Search/theme region; unmarked components belong to the navigation/widgets panel. Internal panel controls are separate, and all members of a left-side group must share a region. Widgets render once. The main-column header is unrelated, and Search stays outside the moving panel without browser-time relocation.
- Above 800px both regions form the desktop sidebar. At 800px and below, the top region is sticky while a separate floating toggle opens the sliding navigation/widgets panel.

### Quirks & Nuances
- Watch mode can leave unchanged pages with stale baked Explorer markup after entry additions/deletions or label, icon, and destination changes. Refreshing alone does not rebuild them: stop the watcher and run a fresh `npx quartz build --serve`, or run `npm run build`, then reload.
- Explorer section labels fall back to the filename without `.md` and the first underscore when the processed title is missing, empty, or exactly equal to the filename stem, even if explicitly authored.
- SPA navigation preserves the root theme attribute; the delegated document-level toggle listener survives replacement of the button. Do not reinitialize the theme on navigation.
- Keep the mode list, root-attribute CSS, toggle icon states, browser-chrome handling, `index.d.ts` event type, and event consumers in sync when adding a mode. Remark42 maps `dark-low` to its binary dark theme.
- `styles/popover.css` relies on the popover being appended under `body` so it inherits the site's type rhythm.
