# quartz/

## Why it exists?
- The Quartz v5 site generator, vendored and modified to fit this project's needs to have an "easy" way to publish obsidian vault.

## What it does?
- Parses content: unified → remark (mdast) → rehype (hast).
- Renders pages: Preact components to static HTML strings at build time, no hydration.
- Assembles resources: plugin pipeline → emitters write HTML + bundled CSS/JS to `public/`.
- Serves and watches in dev; builds in CI.

## Module Map
- `cli/` — CLI entry, esbuild context (incl. the `.css` text loader), serve/watch.
- `components/` — Preact components + their styles (incl. `styles/popover.css`).
- `plugins/` — the plugin system; `emitters/` assemble stylesheets and write output.
- `processors/` — mdast/hast transforms; worker build carries the `.css` stub contract.
- `styles/` — site CSS, palette/font SSOT.
- `static/` — served verbatim assets; `static/fonts/`.
- `util/` — shared helpers; `theme.ts` parses `styles/theme.css` at build time.
- `i18n/` — locale strings.
- Root siblings (outside this folder, consumed by it): root `quartz.ts` (config bridge, imports theme.css and injects ThemeData), root `index.d.ts` (`declare module "*.css"`).

## Additional Info

### Entry Point
- `bootstrap-cli.mjs` → `cli/` for the CLI; root `quartz.ts` for how config and theme data meet the build.

### Decisions
- Vendored fork, tracked deviation list (phase 002 removals) below — not all deviations are this phase's; some predate it.
- Went rogue away from upstream deliberately. To have more freedom, and also upstream updates very rarely anyways, I can integrate interesting changes manually.

### Removed from vendored code
- **SCSS toolchain** — Sass bought nothing authored here; plain CSS + explicit composition instead. Also I don't know it and have no reasons to learn it.
- **Theme generation machinery** (`joinStyles()` + config-driven palette) — palettes hardcoded in `styles/theme.css`, which is now the SSOT = streamlined styling workflow.
- **Google Fonts + `@quartz-community/quartz-fonts`** — fonts fully self-hosted.
- **CLI: Create-flow, templates, upgrade/sync/restore** — that scaffolding is/would be never used.
- **Plugins**: citations, ox-hugo, roam, explicit-publish, stacked-pages, tag-list, tag-page, folder-page, canvas-page, graph, latex, encrypted-pages, reader-mode, cname, comments (giscus), remove-draft.
