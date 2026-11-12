# quartz/components/

## Why it exists?
- Provides the reusable Preact building blocks and browser resources that turn generated content into site pages.

## What it does?
- Renders components to static HTML at build time; associated scripts and styles provide browser behavior without component hydration.

## Module Map
- `Head.tsx` — page metadata, icon links, and early theme initialization.
- `ThemeToggle.tsx` — theme-cycle button and its browser resources.
- `scripts/` — client behavior, including `themeContract.ts` and SPA navigation.
- `styles/` — component-specific CSS, including the toggle and popover styles.
- `frames/` — structural page frames; other component files render individual page elements.

## Additional Info

### Entry Point
- Layout construction in `quartz/plugins/loader/config-loader.ts` places core components, including the toggle. Read `Head.tsx` and `scripts/themeContract.ts` for theme initialization and switching.

### Decisions
- `themeContract.ts` owns the JavaScript contract for `light`, `dark`, and `dark-low`. A valid stored choice wins; otherwise the OS preference seeds the initial mode. Later OS changes do not overwrite the choice.
- `Head.tsx` inlines initialization before styles to avoid a theme flash. The toggle cycles the modes, persists the choice when possible, and dispatches the raw mode in the document's `themechange` event. Consumers with fewer modes must map it themselves.

### Quirks & Nuances
- SPA navigation preserves the root theme attribute; the delegated document-level toggle listener survives replacement of the button. Do not reinitialize the theme on navigation.
- Keep the mode list, root-attribute CSS, toggle icon states, browser-chrome handling, `index.d.ts` event type, and event consumers in sync when adding a mode. Remark42 maps `dark-low` to its binary dark theme.
- `styles/popover.css` relies on the popover being appended under `body` so it inherits the site's type rhythm.
