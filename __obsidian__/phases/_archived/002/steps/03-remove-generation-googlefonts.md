---
status: implemented
state: full
---

[← PLAN](../_plan_002.md)

## Description
%%What this step is about, in 2-4 sentences%%
Removes the build-time theme generation machinery and the entire Google Fonts side of the font system. Safe only because step 02's C6 check proved the hardcoded `:root` blocks carry everything consumers need — from this step on, static CSS is the sole source of theme variables. The invariant being encoded: **this site never fetches fonts from the network, ever.**

## High-Level

### List of related files or folders
%%which are useful for context%%
- `quartz/util/theme.ts` — dies almost entirely: `joinStyles()`, `googleFontHref()`, `googleFontSubsetHref()`, `processGoogleFonts()`, `GoogleFontFile`, types `Theme`, `ColorScheme`, `ThemeKey`, `FontSpecification`, `getFontSpecificationName()` (verify remaining consumers before deciding), non-exported `hexToHsl`. What may remain: only what still has importers.
- `quartz/plugins/emitters/componentResources.ts` — loses the `joinStyles(...)` call (core stylesheet = `@layer quartz-base { googleFonts removal + globalCss + theme/syntax/callouts/base fragment order }` — composition becomes a plain join of the remaining strings; the fragment order established by step 02's review split is a cascade invariant and must survive), loses the `fontOrigin === "googleFonts"` fetch/download branch entirely.
- `quartz/components/Head.tsx` — loses the dormant Google block (`cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts"`, preconnects + stylesheet links). Local font preloads (Atkinson 400/600, JetBrains Mono 400) STAY untouched.
- `quartz/cfg.ts` — `GlobalConfiguration.theme: Theme` typing; theme becomes optional/removed — decide shape (see 03.4).
- `quartz.config.yaml` — `configuration.theme` block deleted (colors, typography, fontOrigin: local, cdnCaching: false); adjacent comment about `custom.scss` font-face rules updated to reference `custom.css`.
- `quartz/plugins/quartz-plugins.schema.json` — remove `configuration.theme` requirement + theme property definitions. Mechanically free (schema only feeds YAML-language-server `$schema`; nothing validates at build/runtime).
- Step 01 artifact (consumer audit) — the three-line confirmation backing this step's safety.

### Intended outcome
- No build-time theme generation anywhere; `:root` blocks in `base.css` are the SSOT.
- Zero network font fetching code paths (`googleFontHref|googleFontSubsetHref|processGoogleFonts|fontOrigin|cdnCaching` grep = empty, C9 partial).
- Build green: `npm run check && npm run build`.

### Local invariants
%%(if any)%%
- **Local font stack untouched**: 24 woff2 in `quartz/static/fonts/`, `@font-face` rules in `custom.css`, 3 preloads in `Head.tsx`, `_headers` cache rule.
- **`@layer quartz-base` composition preserved**: the emitter wraps the fragment join in the layer; `custom.css` stays outside.
- **Remark42/darkmode/syntax.scss dark rules**: untouched anywhere (coupled only via the `saved-theme` attribute, which stays).
- **Templates (`quartz/cli/templates/*.yaml`)**: still carry `fontOrigin: googleFonts` etc. — deliberately untouched (deleted wholesale in step 05).

### Should NOT be done in this step
- No sassPlugin/dep removal (step 04). No template/CLI edits (step 05). No READMEs (step 06).
- Never reintroduce a second palette source or hardcode assembly variables that only the dead generated block provided — `theme.css` is the SSOT; anything missing must be surfaced, not silently patched.

---

## Tasks
> [!note] Implementation deviation (03.4) — `theme` survives as build-time-only `ThemeData`
> Full removal of the `theme` field was blocked: `@quartz-community/og-image` (enabled) reads `cfg.theme` **unguarded** at build time (`theme.typography.header/body` + `theme.colors[colorScheme]`, no fallback). User ruling: no second palette source, CSS is the SSOT. Resolution: `theme` deleted from `quartz.config.yaml` + schema entirely; `GlobalConfiguration` keeps an optional build-time-only `ThemeData`, injected in `quartz.ts` via `parseThemeData()` — the rewritten `quartz/util/theme.ts` is a pure parser of `theme.css` (light/dark `:root` palettes + `--headerFont`/`--bodyFont` families), throwing loudly on structural drift; og-image untouched, palette exists only in `theme.css`.
> Caveats: og-image itself fetches Google font TTFs at build time by family name (cached) — pre-existing upstream behaviour, out of scope for the "site never fetches fonts" invariant. `theme.ts` is deliberately **pure** — it takes the CSS text as an argument; the `.css` import lives in `quartz.ts` because the tsx test runner cannot load `.css` imports (`quartz/util/theme.test.ts` pins the fail-loud guards + real-SSOT values).

- [x] 03.1 — Google Fonts fetch branch removed — The `fontOrigin === "googleFonts"` path (stylesheet + title-subset fetch, `processGoogleFonts()`, per-font download loop, `Failed to fetch font` error path) deleted from `componentResources.ts`; the local branch is now the only path.
- [x] 03.2 — `joinStyles()` call replaced — Core stylesheet assembled as `[...globalCss, themeStyles, syntaxStyles, calloutStyles, baseStyles].join("\n\n")` inside the unchanged `@layer quartz-base` wrapper (`customStyles` still outside); the order delta (globalCss now precedes the four fragments) verified harmless (popover.css declares no `:root`/vars) and recorded in the emitter's invariant comment. This is the moment the hardcoded palette in `theme.css` became the live SSOT.
- [x] 03.3 — Dormant Google block removed from `Head.tsx` — Preconnects + both stylesheet links out; local woff2 preloads untouched; dead `cdnjs.cloudflare.com` preconnect also removed (mermaid verified bundled locally).
- [x] 03.4 — `theme.ts` gutted, `cfg.ts` shaped — All Google/generation functions, `GoogleFontFile`, `hexToHsl`, and the `Theme`/`ColorScheme`/`ThemeKey`/`FontSpecification` types deleted after the importer grep; `cfg.ts` keeps `theme` as an optional build-time-only `ThemeData` (og-image constraint — see deviation note).
- [x] 03.5 — Config + schema surgery — `configuration.theme` deleted from `quartz.config.yaml` (adjacent font comment → `custom.css`) and from `quartz-plugins.schema.json` (property defs + `required` refs).
- [x] 03.6 — Gate green — `npm run check && npm run build` pass; grep `googleFontHref|googleFontSubsetHref|processGoogleFonts|fontOrigin|cdnCaching` empty over `quartz/` + config/schema except template yamls (die in 05).

### Review outcomes (code-review flow, all locked in)
- Parser hardened (fail-loud, never fail-silent): comment-blind parsing (commented-out palette lines can't be parsed as live values), whitespace-tolerant selector regexes, implicit contracts documented (first quoted family = what og-image resolves files by; fonts read from light block only).
- Palette contract single-touch: `ColorScheme` type + getters collapsed into `Palette = Record<(typeof COLOR_VARS)[number], string>` derived from the one `COLOR_VARS` list; renamed `ColorScheme` → `Palette` (old name collides with upstream's "light|dark" discriminator meaning).
- Test coverage added (`theme.test.ts`, node:test): 5 fixture cases (happy path, missing var names the var, commented-out decoy ignored, missing selector throws, unquoted font throws) + 1 real-SSOT guard reading `../styles/theme.css` from disk.
- Cascade-order delta documented: `globalCss` precedes the four fragments (old `joinStyles` order had theme first) — verified harmless (popover.css declares no `:root`/vars), recorded in the emitter's invariant comment; theme.css header wording fixed to match ("opens the fragment sequence", not "imported FIRST").
- Dead `cdnjs.cloudflare.com` preconnect removed from `Head.tsx` (nothing on the site loads from cdnjs; mermaid verified bundled locally). Stale `(e.g. theme CSS)` example in the emitter's extractedInlineResources comment corrected.
- Rejected during review: TS-as-SSOT codegen direction (contradicts the CSS-is-SSOT ruling, recreates the generation machinery this phase removes).
