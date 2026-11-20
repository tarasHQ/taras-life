# quartz/plugins/loader/

## Why it exists?
- Connects the YAML plugin configuration to Quartz's plugin and page-layout construction.

## What it does?
- Loads enabled plugins and resolves their components into ordered layout slots, including per-page-type overrides.

## Module Map
- `config-loader.ts` — plugin loading, core component placement, grouping, and layout construction.
- `types.ts` — plugin and layout configuration contracts.
- `componentLoader.ts`, `frameLoader.ts`, `gitLoader.ts` — package loading and registration.

## Additional Info

### Entry Point
- `loadQuartzConfig()` and `loadQuartzLayout()` in `config-loader.ts`.

### Decisions
- ThemeToggle, Explorer, and the mobile sidebar controls are core placements in the same priority and grouping pipeline as plugin widgets. Page-type layouts are rebuilt with these placements; an explicit empty position clears that slot afterward.
- A left-slot declaration can set `leftSidebarRegion: top` for stationary controls; omission means panel content. Panel controls are an internal classification. A left-side Flex group must contain only one region, so its wrapper retains the correct placement and resources.

### Quirks & Nuances
- The default frame interprets the left-region metadata; sidebar-free frames do not render that slot. See `quartz/components/README.md` for the sidebar and Explorer behavior.
