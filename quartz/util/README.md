# quartz/util/

## Why it exists?
- Shared low-level helpers consumed across the build; vendored upstream, mostly untouched.

## What it does?
- Path/file handling, logging, JSX helpers, globbing, and build-time theming extraction (`theme.ts`).

## Module Map
- `theme.ts` — parses `styles/theme.css` text into `ThemeData` for `og-image` and browser chrome; fail-loud on structural drift. Pure (CSS text passed in by caller) so tsx tests can run it.
- `theme.test.ts` — pins the parser's fail-loud behaviour + a real-SSOT drift guard asserting actual `theme.css` values. Also pins the 2-palette contract: extra `saved-theme` blocks (e.g. `dark-low`) must never add a palette or leak values/comments into the parsed pair.
- everything else (`path.ts`, `fileTrie.ts`, `glob.ts`, `log.ts`, `jsx.tsx`, `resources.tsx`, …) — vendored upstream helpers.

## Additional Info

### Decisions
- **theme.ts was rewritten**: it was the theme generator (`joinStyles()` etc.) — machinery died with config-driven theming; what remained is a pure parser of the stylesheet, because `@quartz-community/og-image` still reads `cfg.theme` unguarded.

### Quirks & Nuances
- The parser reads the 9 palette vars and `--headerFont`/`--bodyFont` for OG images, plus `--bg-grad-bottom` in all three modes for browser chrome. Other variables (e.g. `--codeFont`) are CSS-only.
