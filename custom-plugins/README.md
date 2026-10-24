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

--- 


## Open design questions for the rewrite

**Status: not implemented.** Everything in this section describes *possible* future
behaviour, not current behaviour. It was captured after tracing how Quartz resolves
this plugin during a build, and it exists so the rewrite does not have to re-derive it.
Treat the sections above as the source of truth until these questions are answered.

### Why this is worth rewriting rather than patching

`npx quartz build` silently skips the plugin's compilation. Tracing the build gives
this chain:

```text
npx quartz build
  └─ loadQuartzConfig()
      └─ installPlugin("./custom-plugins/remark42")      gitLoader.ts, local branch
          ├─ linkLocalPlugin() → .quartz/plugins/remark42   symlink (junction on Windows)
          └─ return                                        ← never builds
      └─ getPluginEntryPoint()
          └─ package.json exports["."] → ./dist/index.js    missing on a clean checkout
             fallbacks: dist/index.{js,mjs}, index.{js,ts}, src/index.{js,ts}
             note: no .tsx candidate — the real entry is src/index.tsx
      └─ dynamic import() fails
      └─ componentLoader catches it and reports only:
         'Plugin "remark42" declares components but failed to load them'
```

The loader does contain a build helper (`buildInstalledPlugin`) that the *git*
installation path calls and the *local* path returns before reaching. So the gap is
an unconnected code path, not a missing feature.

`dist/` exists for two independent reasons, and each is removable on its own:

1. **Node cannot import `.tsx`.** Plugins are dynamically imported at runtime,
   *after* Quartz's own esbuild bundle is produced, so they are never part of that
   bundle and never pass through its `.inline.ts` loader. JSX is unrepresentable
   for a runtime import without a transform.
2. **The browser bootstrap must exist as a string constant.** `build.mjs` bundles
   `src/browser.ts` into an IIFE and injects it through the `remark42:browser`
   virtual module, because `afterDOMLoaded` takes a string. Quartz's own
   `.inline.ts` convention does not apply to external plugins.

Reason 2 may not apply at all: the bootstrap currently has **no npm imports** — it
dynamically imports `/web/embed.mjs` from the Remark42 origin at runtime. Nothing in
it requires bundling except the author's choice to use it.

### Options

The rewrite should make every invocation path behave identically — `npm run build`,
`npx quartz build`, `npm run build -- --serve`, and the Cloudflare build command. That
is the acceptance criterion; the current `prebuild` split fails it.

- **No build step (preferred if the bootstrap stays dependency-free).** Author the
  browser code as a single self-contained module exporting a template-literal string,
  imported directly by the component; write the component in `h()` so the entry can
  be `src/index.ts`, which `getPluginEntryPoint` already tries. `dist/`, `prebuild`,
  and `build:local-plugins` all disappear, and resolution can no longer fail.
- **Keep `dist/`, wire the loader.** Compile as today, but have the local branch of
  `installPlugin` build it, so no `prebuild` is required. Build **unconditionally**:
  the current hook always rebuilds, so a "build only when `dist/` is missing" guard
  would silently ship a stale bundle after an edit — strictly worse than the current
  loud failure. Cost is roughly esbuild startup per build.
  Do not reuse `buildInstalledPlugin` verbatim: it runs `npm install --ignore-scripts`
  and `npm prune --omit=dev` inside the plugin directory, which this package does not
  need (it declares no dependencies and resolves `esbuild` from the host) and which
  would leave a lockfile in a source directory.
- **npm workspace + `prepare`.** Declare the package as a workspace so it resolves as
  an npm source and skips the local-link path entirely, with `"prepare": "node build.mjs"`
  building it during `npm install`. Attractive on Windows, where the symlink path is
  fragile — but it changes `source:` in `quartz.config.yaml` from a path to a package
  name, and it is unverified whether `quartz plugin install` would then try to fetch
  that name from the registry.

Vendored patches to `quartz/` are acceptable here; upstream merge conflicts are
resolved manually. That removes friction from the loader option and leaves the choice
to be made on merit.

### Open questions

1. **Does the browser bootstrap stay dependency-free?** If shared utilities,
   bundling, or minification are wanted later, reason 2 becomes real and `dist/`
   must stay. This decides whether the esbuild step is needed at all.
2. **JSX or `h()` for the component?** The only remaining thing forcing `dist/` to
   exist. `h()` costs readability on a small component; JSX costs the build step.
3. **If `dist/` stays: unconditional build, or a staleness check** (mtime or hash of
   `src/` against `dist/`)? Unconditional is simpler and matches today's semantics.
4. **Does `isDistGitignored` read the plugin's own `.gitignore` or the repository
   root's?** `dist/` is now ignored at the repository root, which appears to make
   `hasPrebuiltDist` permanently false. That is harmless if the plugin is always
   built, but it disqualifies any "commit `dist/`" option and changes which CLI
   branch runs.
5. **Windows linking: prefer junction over copying?** `linkLocalPlugin` degrades
   symlink → junction → `fs.cpSync`. A copied snapshot is a silent drift generator
   for a plugin under active development: the build writes `dist/` inside the copy,
   so nothing looks stale while nothing is new. Junction needs no administrator
   rights for a local directory on the same volume, so failing loudly would be
   preferable to copying. This also removes the manual junction step documented above.
6. **Do npm-sourced plugins need `quartz plugin install` at all?** The loader imports
   them as `import(spec.name)` from `node_modules`, so installation may be lockfile
   bookkeeping only. If so, `prebuild`'s first half is redundant and only the Remark42
   step was ever load-bearing.
7. **Does the rewrite also cover counters and recent-comments?** Both are deferred
   above and would add containers that must not become the trigger for the widget
   itself; the bootstrap's "no container, no request" rule needs to survive that.
8. **Is the failure message fixed in the same pass?** `componentLoader` swallows the
   underlying import error and reports only that components failed to load. Any future
   resolution failure will present identically, so surfacing the real error is worth
   doing regardless of which option wins.


---

Near this file is also outdated `./PLAN.md`. The reason for its existence is to know more information about how "bad implementation" of the plugin was executed.

The same logic applie for `./REMARK42.md` which is kinda too plan/reflection/whatever.

Both files should NOT be edited. And are safe to be deleted once current plan above will be executed.
--- 

Additional TODOs at rewrite:
- Change comment-id to simply id, so maybe it can be used by other things as well. 