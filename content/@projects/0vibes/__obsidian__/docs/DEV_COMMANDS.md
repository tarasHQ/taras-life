# Core Commands

- `pnpm update -i -r` - for interactive selective package updates

## Dev & Runtime

- `pnpm dev` — Starts all packages in parallel with hot reload.
- `pnpm dev:nowatch` — Starts stack without backend auto-restart (preserves WS sessions during dogfooding).

## Typecheck & Watch

- `pnpm typecheck` — Single-pass whole-repo TypeScript build check.
- `pnpm typecheck:watch` — Whole-repo TS watcher; catches cross-package breaks in real-time (auto-runs on VS Code startup).

## Lint & Format

- `pnpm lint` — Verifies layer boundaries (`core` -> `app`), banned filenames (`types.ts`), and zero barrels.
- `pnpm lint:fix` — Runs ESLint and auto-fixes 64 `=` comments and syntax rules.
- `pnpm format` — Formats tabs, quotes, and whitespace across project files.
- `pnpm format:check` — Verifies formatting adheres to Prettier rules without modifying disk.
- `pnpm knip` — Scans for dead exports, unused dependencies, and orphaned files.

## Tests

- `pnpm test` — Interactive Vitest watcher for fast TDD feedback during active coding.
- `pnpm test:run` — Parallel single-pass run of all test suites across all packages.
- `pnpm test:coverage` — Generates V8 test coverage report.

## Extension

- `pnpm build:extension` — Bundles VSCode extension into `dist/extension.js` via esbuild.
- `pnpm deploy:extension` — Builds, packages (`.vsix`), and installs VSCode extension locally.

## Database

- `pnpm db:baseline` — Re-generates Drizzle SQLite schema baseline whenever DB tables change.

# Git

- `git push --force-with-lease` - just to create a habit to use force push with lease
