# quartz/util/

## Why it exists?
- Shared low-level helpers consumed across the build; vendored upstream, mostly untouched.

## What it does?
- Path/file handling, logging, JSX helpers, globbing, and build-time theming extraction (`theme.ts`).

## Module Map
- `theme.ts` — parses `styles/theme.css` text into `ThemeData` for `og-image`; fail-loud on structural drift. Pure (CSS text passed in by caller) so tsx tests can run it.
- `theme.test.ts` — pins the parser's fail-loud behaviour + a real-SSOT drift guard asserting actual `theme.css` values.
- everything else (`path.ts`, `fileTrie.ts`, `glob.ts`, `log.ts`, `jsx.tsx`, `resources.tsx`, …) — vendored upstream helpers.

## Additional Info

### Decisions
- **theme.ts was rewritten**: it was the theme generator (`joinStyles()` etc.) — machinery died with config-driven theming; what remained is a pure parser of the stylesheet, because `@quartz-community/og-image` still reads `cfg.theme` unguarded.

### Quirks & Nuances
- The parser reads only the 9 palette vars + `--headerFont`/`--bodyFont` — other `theme.css` variables (e.g. `--codeFont`) are CSS-only and invisible to it.
