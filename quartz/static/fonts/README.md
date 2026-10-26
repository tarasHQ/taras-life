# Self-hosted fonts

Font files served for this site. Committed to the repo — builds are hermetic,
no network fetch at build or runtime, fully OFL-compliant (see `OFL.txt`).

## Inventory

| Family | Role | Subsets | Weights |
| --- | --- | --- | --- |
| Atkinson Hyperlegible Next | body (latin/latin-ext) | latin, latin-ext | 400, 800 (+italics) |
| Source Sans Pro | body cyrillic (aliased under Atkinson) | cyrillic | 400, 700 (+italics) |
| JetBrains Mono | code | latin, latin-ext, cyrillic | 400, 800 (+italics) |
| Playfair Display | headers | latin, latin-ext, cyrillic | 400, 800 (+italics) |

- Cyrillic-ext subsets were fetched for JetBrains Mono and Playfair but
  **deleted** as unnecessary; re-fetch if content ever needs them.
- Atkinson ships **no cyrillic** at all. Source Sans Pro cyrillic subsets
  cover that gap: they are registered in `quartz/styles/custom.scss` under the
  family name `"Atkinson Hyperlegible Next"` with a cyrillic `unicode-range`,
  so body text resolves per-glyph (latin → Atkinson, cyrillic → SSP) while
  `--bodyFont` stays a single family. SSP axes are 400/700 (not 800), so
  cyrillic bold renders at 700.
- Mono italic faces are kept deliberately: inline code is sometimes used as a
  text-formatting tool and may render italic.

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

All four families are SIL Open Font License 1.1. Copyright headers for each
family plus the full OFL text are in `OFL.txt`, which ships alongside the
font files as the license requires.
