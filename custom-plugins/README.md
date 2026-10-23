# Local plugins (`custom-plugins/`)

Local Quartz plugins live here and are wired in `quartz.config.yaml` with a local source
(`source: ./custom-plugins/<name>`). The loader symlinks them into `.quartz/plugins/<name>`
(`quartz/plugins/loader/gitLoader.ts`); the `package.json` `quartz` manifest and `exports`
entry points decide what gets registered.

The **normal flow** is documented in `docs/quartz/advanced/making plugins.md`,
`docs/quartz/advanced/creating components.md` and `docs/quartz/cli/plugin.md`. Everything
below is a place where this directory **deviates** from it. Each row is an issue to close,
not a preference.

## Invariant

A local plugin's TypeScript project must be **self-contained**:

- no file outside its own `src/` enters the `tsc` program;
- no ambient `@types` it does not declare itself.

Both are easy to break, and both break only in CI.

## Deviations from the normal plugin creation flow

| #   | Normal flow                                                                                              | Here                                                                                 | Why it hurts                                                                                                                                                                    | Fix                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `import { QuartzComponent } from "@quartz-community/types"`; importing Quartz core is explicitly forbidden | `remark42/src/index.tsx` imports `../../../quartz/components/types`                  | Drags host `.tsx` into the plugin program, so host builtins become the plugin's problem: `quartz/util/resources.tsx` imports Node `crypto` → `TS2591` on TypeScript 7.0.2, while root `npm run check` stays green | Phase 1: import from `@quartz-community/types` (published `QuartzComponent` has no `displayName` — drop that assignment)               |
| 2   | Plugin declares the `@types` it needs                                                                    | Nobody declares Node types; they arrive implicitly from the root `node_modules/@types` by ancestor lookup | TS 7 stopped resolving them for a nested project: plugin typecheck fails, root check passes, same lockfile                                                                       | `remark42/tsconfig.json` sets `types: ["node"]` + `typeRoots: ["../../node_modules/@types"]` — **temporary**. After #1: `types: []`     |
| 3   | Package declares `@quartz-community/types`, its build tool, and `preact` as peer                         | `remark42/package.json` has **no** dependencies, yet uses `esbuild` (`build.mjs`), `typescript` and `preact` from the root install | Root `npm ci` is silently load-bearing; a package that looks standalone is not                                                                                                   | Phase 2: root `workspaces: ["custom-plugins/*"]`, declare the deps                                                                     |
| 4   | `tsup`, bundling everything except singleton externals (`preact`, `vfile`, `unified`)                     | `build.mjs` (esbuild) plus a custom `remark42:browser` plugin, `packages: "external"`  | Same singleton policy, different tool; browser code is inlined as a string so the loader needs no runtime                                                                         | Keep — intentional, recorded so nobody "migrates" it blind                                                                            |
| 5   | `exports` with `types` targets                                                                           | `exports` string map, no `types` field, esbuild emits no `.d.ts`                      | `regeneratePluginIndex` looks for `dist/index.d.ts`, so the plugin exposes no type surface to the generated index                                                                 | Phase 3: emit declarations (`tsc --emitDeclarationOnly`) and add `types`                                                               |
| 6   | Docs show `category: ["component"]` and `defaultOptions`                                                  | Manifest uses `category: "component"` plus a `components` map                         | Code is the contract, not the docs: `config-loader.ts` reads `pkg.quartz`, `componentLoader.ts` resolves the `./components` subpath                                              | Follow the code; the docs are incomplete here                                                                                         |
| 7   | `quartz plugin add ./path` installs; `plugin install --latest` rebuilds (`npm install && npm run build`)   | The loader's **local** branch only symlinks — no install, no build                     | `dist/` must already exist, so root `prebuild` runs `build:local-plugins` first                                                                                                  | Documented via root `package.json`; do not remove `prebuild`                                                                          |

## Guards

Suggested CI steps next to the plugin typecheck (`!` = fail if found):

```bash
! grep -rn 'from "\.\./\.\./\.\./quartz' custom-plugins/*/src   # invariant: no host imports
! grep -rn 'from "node:\|from "crypto"' custom-plugins/*/src   # invariant: no host builtins
npm --prefix custom-plugins/remark42 run typecheck
```

Pitfall: `npm run typecheck` here resolves `tsc` from the **root** install. A stale
`node_modules` (merge without `npm ci`) happily typechecks with the previous compiler and
reports green. Check with
`npm --prefix custom-plugins/remark42 exec -- tsc --version`.

## Rollout

- **Phase 0 — done, temporary.** `remark42/tsconfig.json` sets `types`/`typeRoots` explicitly; unblocks `main` on TypeScript 7.
- **Phase 1.** Remove the `../../../quartz` import (rule 1), set `types: []`, declare deps, enable the guards.
- **Phase 2.** npm workspace so plugin dependencies are declared and installed for real.
- **Phase 3.** Declaration output plus the `types` field.

Plugin-specific commands live in `remark42/README.md`.
