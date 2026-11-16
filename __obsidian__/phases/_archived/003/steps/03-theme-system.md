---
status: implemented
state: condensed
---

[← PLAN](../_plan_003.md)

## Description
Replaced `@quartz-community/darkmode` with a local core `ThemeToggle` component + colocated contract module owning the entire JS-side theme contract: reused `theme` storage key (existing visitors migrate for free), `saved-theme` attribute, 3-mode cycle `light → dark → dark-low`, OS seeds the initial value only, RAW-mode `themechange` dispatch, and the zero-flash inline init. The phase's only architectural change, landed as one lockstep reviewable unit (toggle + consumers together).

## Implementation Summary
- **Contract module** — `quartz/components/scripts/themeContract.ts` is the single owner: exports `THEME_STORAGE_KEY`, `THEME_ATTRIBUTE`, `THEME_MODES`, `themeInitScript`, `themeToggleScript`; no duplicated literals anywhere.
- **Component** — `quartz/components/ThemeToggle.tsx`, build-time Preact button; cycle + dispatch + icon state live in its client script. Morphing SVG icon worked on the first approach — multi-icon fallback never needed; icon CSS in `quartz/components/styles/theme-toggle.css`.
- **Zero-flash init** — `Head.tsx` inlines `themeInitScript` via `<script dangerouslySetInnerHTML>` (404.tsx precedent); pre-paint execution verified in the built `index.html`, not just source.
- **Loader insertion** — `loadQuartzLayout` assigns ThemeToggle to `left`, priority 30, toolbar group (Head precedent; not YAML, not frame JSX).
- **`index.d.ts`** — `themechange` union widened to the raw `"light" | "dark" | "dark-low"`; carries the SSOT pointer to `THEME_MODES` and the landmine warning: never import `@quartz-community/types/globals` (its stale global augmentation hard-fails with TS2717).
- **remark42 adaptation** — `hasThemeDetail` guard widened to all three modes, narrowed internally by `toRemarkTheme` (dark-low → `"dark"`) before `changeTheme`; real type guard, no `as`. Code review exposed a mount-time bug: `currentTheme()` read the theme binary and mapped dark-low → light on every widget mount — fixed with validated `readSiteThemeMode()`; `npm run build:plugins` + `dist/` committed.
- **Config cleanup** — darkmode AND favicon entries deleted per plan; excalidraw additionally removed (review amendment: zero content usage); `npm uninstall` for all three. The removals exposed `github-slugger` as an undeclared optional peer of `@quartz-community/utils` — now a declared root dep (`^2.0.0`); post-mortem in the plan.
- **CSS re-ownership** — `color-scheme` declared in all three `theme.css` mode blocks (`:root` → light, dark block → dark, dark-low → dark); native widgets/scrollbars verified across modes.
- **DEV_RULES §Rendering Model 4** — alignment dropped by user decision: no theme-contract content belongs in DEV_RULES.
- **Mermaid dark-low check** — recorded in the plan's Exploration notes: mermaid re-inits per `themechange` with a binary theme match + live CSS-variable derivation; dark-low renders light `"base"` with dark-low's palette — coherent, no broken diagrams; proper dark theming deferred.
- **End-to-end verification** — fresh visit OS-seeded, old-key migration, zero flash on hard reload in all three modes, cycle order, remark42 receives all three modes, SPA nav preserves the attribute; `npm run check` + `npm test` green after all fixes.
