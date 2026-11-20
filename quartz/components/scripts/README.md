# quartz/components/scripts/

## Why it exists?
- Holds component-related **client-side scripts**: behavior intended to run in the visitor’s browser, separate from build-time HTML rendering.

## What it does?
- Adds browser behavior to generated pages, such as theme switching and navigation.

## Module Map
- `*.inline.ts` — browser-script entry points.
- Plain `.ts` — supporting modules, such as `themeContract.ts`.

## Additional Info

### Entry Point
- Components attach browser scripts through `beforeDOMLoaded` / `afterDOMLoaded`; `quartz/plugins/emitters/componentResources.ts` collects these and shared scripts.

### Quirks & Nuances
- The build converts `.inline.ts` imports into JavaScript text. “Inline” does **not** mean that the script is necessarily embedded directly in HTML.
