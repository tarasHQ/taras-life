# quartz/plugins/emitters/

## Why it exists?
- Emitters are the pipeline's output stage: they turn processed content into the files that land in `public/`.

## What it does?
- Writes HTML pages, static assets, bundled component scripts/styles, and the aggregated site stylesheet.

## Module Map
- `componentResources.ts` — assembles the core stylesheet: plain fragment join of theme → syntax → callouts → base inside `@layer quartz-base`, with custom.css appended outside the layer so it always wins; then Lightning CSS minifies. Also bundles component CSS/JS (content-hash filenames). Runs first in the emit phases (see `processors/emit.ts`).
- `static.ts` — copies Quartz's static files into the output's `static/` directory, with Cloudflare config files emitted at the root.
- `assets.ts` — copies non-Markdown content assets to the output directory.
- `helpers.ts` — shared output-file `write` helper.
- `index.ts` — vendored re-export barrel (`Assets`, `Static`, `ComponentResources`) kept for the plugin loader; not a pattern to extend.

## Additional Info

### Entry Point
- `componentResources.ts` for anything stylesheet-related; the assembly order there is the cascade contract with `styles/`.

### Decisions
- 

### Quirks & Nuances
- Output filenames are content-hash based (`index-<hash>.css`) — hash churn between builds is expected noise, not a regression signal.
- Minification only: Lightning CSS `transform()` does not inline/bundle imports — each fragment is already a standalone file.