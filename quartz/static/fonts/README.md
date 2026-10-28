# Self-hosted fonts

Font files served for this site. Committed to the repo — builds are hermetic,
no network fetch at build or runtime, fully OFL-compliant (see `OFL.txt`).

## IMPORTANT
- Fonts are cached, configured in _headers file. Font's name doesn't change if I replace it with
  other version, which means that caching won't fetch new version. 

## Nuances

- Cyrillic-ext subsets were fetched for JetBrains Mono but **deleted** as
  unnecessary; re-fetch if content ever needs them.
- All faces are shipped at weights **400/600 only** (no 700/800): headings,
  `strong` and callout titles are pinned to 600 site-wide. Registering a
  weight that has no file on disk causes a silent fallback to `system-ui`
  while devtools still shows the correct family name — this bit us once.
- Atkinson ships **no cyrillic** at all. Source Sans Pro cyrillic subsets
  cover that gap: they are registered in `quartz/styles/custom.scss` under the
  family name `"Atkinson Hyperlegible Next"` with a cyrillic `unicode-range`,
  so body text resolves per-glyph (latin → Atkinson, cyrillic → SSP) while
  `--bodyFont` stays a single family.
- Mono italic faces are kept deliberately: inline code is sometimes used as a
  text-formatting tool and may render italic.

## Exploration

POIs when working on fonts:

- `quartz/styles/custom.scss` — all `@font-face` rules (the `face` mixin)
  plus the headings weight-600 override; the only place font families/files
  are declared.
- `quartz/components/Head.tsx` — `fontPreloads` array; preload list for
  critical faces (must reference existing files).
- `quartz.config.yaml` — `theme.typography` maps header/body/code to family
  names; `theme.fontOrigin: local`.
- `quartz/styles/variables.scss` — `$semiBoldWeight` (600) used by the
  headings override, `strong`, links, callouts.
- `quartz/styles/base.scss` — vendored; headings rule (`h1-h6, thead`) sets
  `font-weight: revert` (overridden in custom.scss) and applies
  `var(--headerFont)`.
- `quartz/plugins/emitters/componentResources.ts` — inlines custom.scss into
  the core stylesheet (custom.scss sits outside `@layer quartz-base`, so it
  always wins).
- `quartz/static/_headers` — `Cache-Control: immutable` for `/static/fonts/*`;
  same-name file swaps won't reach visitors until expiry.
- `quartz/util/theme.ts` — builds `--headerFont` / `--bodyFont` CSS variables
  with a system fallback stack; also the unused Google Fonts pipeline
  (`fontOrigin: googleFonts` path).
- `quartz/styles/callouts.scss` — callout titles use `$semiBoldWeight`;
  another consumer of the 600 weight.

## How the files are wired

1. Quartz's `Static` emitter copies `quartz/static/` → `<output>/static/`,
   so these files are served at `/static/fonts/*.woff2`.
2. `@font-face` rules live in `quartz/styles/custom.scss` and are **inlined
   into the core stylesheet** — there is no external font stylesheet, so SPA
   navigation (which removes/re-adds non-persisted `<head>` nodes) can never
   destroy `@font-face` rules or re-trigger font loads.
3. `quartz.config.yaml` uses `theme.fontOrigin: local` — the built-in font
   pipeline loads nothing; `theme.typography` only names the families for the
   CSS variables. The `@quartz-community/quartz-fonts` plugin is NOT used
   (it downloads at build time with no browser UA, which forces legacy
   full-coverage TTF instead of subset woff2).


## Licensing

All three families are SIL Open Font License 1.1. Copyright headers for each
family plus the full OFL text are in `OFL.txt`, which ships alongside the
font files as the license requires.
