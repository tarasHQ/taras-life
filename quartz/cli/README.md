# quartz/cli/

## Why it exists?
- The build/dev driver: esbuild context, serve/watch, preview server. Stripped to what this project actually runs.

## What it does?
- `build` command end-to-end: esbuild context (incl. the `.css` text loader), incremental rebuild, hot reload, preview server, watch globs.
- Plugin management (`plugin add/install/remove/enable/disable/config/list/status/prune/resolve`) with the `quartz.lock.json` lockfile.

## Module Map
- `args.js` — shared CLI args + build command options (output, serve/watch, port, bundle info).
- `constants.js` — build cache path, build entry point, package version.
- `handlers.js` — `handleBuild`: esbuild context (`.css` loaded as text), rebuild/serve/hot-reload, watch globs (`**/*.ts(x)`, `**/*.css`, `quartz/cli/*.js`, `quartz/static/**/*`, `package.json`, `quartz.config.yaml`).
- `helpers.js` — `symlinkOrCopySync` (dir symlink with Windows junction/copy fallback).
- `helpers.test.js` — tests for the symlink helper.
- `plugin-data.js` — plugin config + `quartz.lock.json` read/write, plugin source parsing/naming, lockfile-name override resolution.
- `plugin-git-handlers.js` — all `plugin *` command handlers, incl. plugin builds and generated plugin-index handling.

## Additional Info

### Entry Point
- Commands are registered in root `quartz/bootstrap-cli.mjs` (not here); handlers live in this folder — `handleBuild` in `handlers.js`, `plugin *` in `plugin-git-handlers.js`.

### Decisions
- Deliberately removed flows I will never use (templates, create/upgrade/update/sync/restore). Just reducing amount of code to maintain.

### Quirks & Nuances
- `restore`/`sync` strings still appear in this folder — they belong to plugin-install mechanics (lockfile restore, `--clean` path), not to the removed CLI commands of the same names.