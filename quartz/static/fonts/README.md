# quartz/static/fonts/

## Why it exists?
- Keeps the site's typography hermetic: fonts are committed here and served verbatim — no network fetch at build or runtime, no external font CDN, fully OFL-compliant.

## What it does?
- Holds the woff2 files for all three families (Atkinson Hyperlegible Next, Source Sans Pro cyrillic subsets, JetBrains Mono) plus `OFL.txt` licensing and the per-file copyright headers.
- The fonts are picked up by the `Static` emitter (`quartz/static/` → `<output>/static/`) and declared by `@font-face` rules in `quartz/styles/custom.css`, which are inlined into the core stylesheet.

## Module Map
- `*.woff2` — the subset faces themselves; latin/cyrillic subsets per family, weights 400/600 only.
- `OFL.txt` — SIL Open Font License 1.1 text, ships alongside the files as the license requires.

## Additional Info

### Entry Point
- Start at `quartz/styles/custom.css` — the only place font families/files are declared — then `quartz/styles/theme.css` for the `--headerFont` / `--bodyFont` / `--codeFont` stacks.

### Decisions
- Fonts fully self-hosted: the built-in font pipeline (`theme.fontOrigin`, `@quartz-community/quartz-fonts` plugin, Google Fonts) is removed — nothing downloads or generates fonts at build time.
- Source Sans Pro cyrillic subsets are registered under the family name `"Atkinson Hyperlegible Next"` with a cyrillic `unicode-range`, because Atkinson ships no cyrillic at all. Body text resolves per-glyph (latin → Atkinson, cyrillic → SSP) while `--bodyFont` stays a single family.
- Mono italic faces are kept deliberately: inline code is sometimes used as a text-formatting tool and may render italic.

### Quirks & Nuances
- Faces are cached via `quartz/static/_headers` (`Cache-Control: immutable` for `/static/fonts/*`); replacing a font file under the same name won't reach visitors until cache expiry.
- Registering a weight that has no file on disk causes a silent fallback to `system-ui` while devtools still shows the correct family name — this bit us once. Only 400/600 exist; headings, `strong` and callout titles are pinned to 600 site-wide.
- Cyrillic-ext subsets for JetBrains Mono were fetched once and **deleted** as unnecessary; re-fetch if content ever needs them.
- Head.tsx's `fontPreloads` array lists the critical faces and must reference existing files.
