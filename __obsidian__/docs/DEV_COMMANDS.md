# Core Commands

- `npm ci` - install exact dependency tree from `package-lock.json`
- `npm run build` - build the site into `public/`; the `prebuild` lifecycle hook runs first (installs plugins + builds the local remark42 plugin)
- `npm test` - run the TypeScript suites through Node's test runner (`tsx --test`)
- `npx quartz <cmd>` - run any CLI command directly; `npx quartz --help` lists every command, `npx quartz <cmd> --help` lists its flags

## Dev & Runtime

- `npx quartz build --serve` - build, serve on :8080 and hot-reload over WS on :13001 (implies `--watch`)
- `npx quartz build --watch` - rebuild on content change without starting a server
- `npx quartz build --serve --port 3000 --wsPort 13002` - same preview on non-default ports
- `npx quartz build --serve --remoteDevHost <url>` - override the WS URL when previewing from another machine/container
- `npm run profile` - flamegraph a single-concurrency build via `0x` (not a dependency; installed on demand by `npx`)

## Quartz CLI (`npx quartz ...`)
(full description is at `/docs/quartz/cli/`)
- `npx quartz build` - build static HTML; 
- `npx quartz create` - initialize a site; 
- `npx quartz sync` - commit, pull and push the site via git; 
- `npx quartz restore` - recover the content folder from `.quartz-cache`
- `npx quartz upgrade` (alias `update`) - upgrade Quartz to the latest upstream version
- `npx quartz tui` - interactive plugin manager (requires `bun` and `npx quartz plugin add @quartz-community/tui`)

## Plugins

- `npx quartz plugin` - no subcommand: print installed plugin status and available updates
- `npx quartz plugin install [names..]` - install from lockfile (or from config with `--from-config`); `--latest` ignores pinned commits, `--clean` skips existing dirs, `--dry-run` reports only
- `npx quartz plugin add <repos..>` - add plugins from git/local/npm sources; `--name` (alias `--as`) renames, `--subdir` points at a repo subdirectory
- `npx quartz plugin remove <names..>` - uninstall plugins and update the lockfile
- `npx quartz plugin list` - list installed plugins with source, commit and status
- `npx quartz plugin enable <names..>` / `disable <names..>` - toggle plugins in `quartz.config.yaml`
- `npx quartz plugin config <name> [--set key=value]` - read or write a single plugin option
- `npx quartz plugin prune [--dry-run]` - drop installed plugins no longer referenced in config
- `npx quartz plugin restore|update|check|resolve` - deprecated hidden aliases mapping to `install --clean|--latest|--latest --dry-run|--from-config`
- `npm run build:local-plugins` - build `custom-plugins/remark42` (runs inside `prebuild`)

## Typecheck & Format

- `npm run check` - `tsc --noEmit` plus `prettier --check`
- `npm run format` - rewrite the repo with Prettier
- `npm --prefix custom-plugins/remark42 run typecheck` - typecheck the remark42 plugin (root `tsconfig.json` does not include it; CI runs this as a separate step)

## Tests

- `npm test` - root suites under `quartz/**/*.test.ts` (components, plugin loader, pageTypes, util)
- `npm --prefix custom-plugins/remark42 test` - typecheck + build + `node --test` on `shell/identity/runtime` fixtures

## Wrangler
- installed but not used for any commands nor configured to do so. Used only for schema autocomplete/valudation in `wrangler.jsonc`

## Git

- `git push --force-with-lease` - just to create a habit to use force push with lease
