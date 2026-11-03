# quartz/styles/

## Why it exists?
- Single place where the site's visual identity lives: palette, fonts, syntax highlighting, callouts, and base layout — as hand-authored plain CSS, readable without any preprocessing.
- Exists in this shape because the SCSS toolchain (Quartz's default) was removed, since I went rogue.

## What it does?
- Defines the site palette and font stacks as CSS custom properties (`theme.css`), consumed by every other stylesheet and by build-time theming.
- Styles everything the content pipeline emits: Shiki code blocks (`syntax.css`), callouts (`callouts.css`), page layout/typography/tables/embeds (`base.css`).
- Declares all self-hosted font faces (`custom.css`) and pins heading weight over the base layer.

### File semantics
- `theme.css` — palettes (light + dark via `:root[saved-theme="dark"]`) + font stacks. **SSOT**: edit colors/fonts only here.
- `syntax.css` — Shiki light/dark rules (small; no custom properties of its own).
- `callouts.css` — callout container/content/title rules + per-type icon custom properties.
- `base.css` — layout, typography, tables, media, embeds, progress bar; the dissolved Sass variables/breakpoints/grid live here as literals.
- `custom.css` — 24 `@font-face` blocks (Atkinson, Source Sans Pro Cyrillic fallback under the Atkinson name, JetBrains Mono subsets) + the unlayered heading/`thead` weight-600 pin.

## Module Map
- `theme.css` — palette + font SSOT; also parsed at build time (see Decisions).
- `syntax.css` — Shiki code highlighting, verbatim from legacy.
- `callouts.css` — callout styling incl. icon property indirection.
- `base.css` — the bulk (~600 lines); layout/typography, literal breakpoints + grid.
- `custom.css` — font faces + heading pin; sits outside the cascade layer.
- Sibling, not child: `quartz/components/styles/popover.css` — documents itself in the components module; listed here only because it shares the consumer set of theme vars.

## Additional Info

### Entry Point
- Read `theme.css` first, then `base.css` for layout, then `componentResources.ts` to see how the files become one stylesheet.

### Decisions
- **Theming SSOT driver**: `quartz.config.yaml` holds no palette. `quartz.ts` imports this folder's `theme.css`, `quartz/util/theme.ts` parses it at build time into `ThemeData` (for `og-image`), injected in-memory. Consequence: structural edits to `theme.css` (renamed/removed selectors, unquoted font stacks) fail the build loudly via the parser and its test (`quartz/util/theme.test.ts` pins real values on purpose).

### Quirks & Nuances
- Double-paren media forms (`@media all and ((max-width: 800px))`) are preserved verbatim on purpose — Sass emitted them pre-phase and the conversion copied it 1:1. Do not "fix" them; the built output may normalize them (harmless).
- `--light`/`--dark` are *palette slot names*, not scheme values — `--dark` is a foreground color.
- Cascade arrangement (enforced outside this folder):
	- Assembly order is **argument order** in `quartz/plugins/emitters/componentResources.ts`: theme → syntax → callouts → base, wrapped in `@layer quartz-base`.
	- `custom.css` is appended **outside** the layer — it always wins.
