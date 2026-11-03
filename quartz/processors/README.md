# quartz/processors/

## Why it exists?
- The three-stage content pipeline: everything authored in `content/` passes through here before any component or emitter sees it.

## What it does?
- Parse (markdown/HTML → mdast/hast, concurrent via worker threads), filter (drop pages), emit (run configured emitters → `public/`).

## Module Map
- `parse.ts` — markdown/HTML parsing; runs worker threads (concurrency clamped 1–4, chunks of 128). Its esbuild plugin stubs `.css` loads as empty text inside workers (`filter: /\.css$/`), alongside the `.inline.(ts|js)` text stub.
- `filter.ts` — applies configured filter plugins (`shouldPublish`) sequentially; verbose mode logs every dropped file.
- `emit.ts` — runs configured emitters in three phases: `ComponentResources` first (content-hashed asset filenames become available to pages), then `PageTypeDispatcher` (populates `ctx.virtualPages`), then all others concurrently with content extended by virtual pages; counts and reports emitter failures without aborting the build.

## Additional Info

### Entry Point
- `parse.ts` is where the build's content ingestion starts; read `emit.ts` second to see how output lands in `public/`.

### Decisions
- **`.css` worker stub**: workers can't load `.css` through esbuild normally, so the plugin stubs those loads as empty text — stylesheets are assembled once, in the main build, by the emitters. Must stay in sync with the `.css` text loader in `quartz/cli/handlers.js` and `index.d.ts`'s `declare module "*.css"` — the trio is the css-text invariant; changing one means checking the other two.

### Quirks & Nuances
- Worker-based parsing means module-level mutable state in transformers is a bug — content processing runs concurrently (same reason components can't hold module state).
- Emitter failures are counted, not fatal — a failed emitter warns at the end instead of aborting, so a broken plugin degrades output instead of killing the build.
- **Phased emit order is load-bearing**: ComponentResources must run before page rendering (hash-named asset URLs must exist before HTML referencing them), and PageTypeDispatcher before the rest (sitemap/RSS/contentIndex must include virtual pages). Reordering breaks both silently.