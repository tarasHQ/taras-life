/**
 * Single owner of the JS-side theme contract: storage key, the
 * `documentElement` attribute, the three-mode cycle, the OS-seed rule, the
 * zero-flash inline init and the toggle's client behaviour. Both consumers
 * build from these exports — `Head.tsx` inlines `themeInitScript` into
 * `<head>` (pre-paint: component scripts ship as an external bundle and are
 * not guaranteed to run before first paint), and `ThemeToggle.tsx` registers
 * `themeToggleScript` as its `beforeDOMLoaded` behaviour — so no contract
 * literal is duplicated anywhere else.
 *
 * NOTE: this file deliberately does NOT match the `*.inline.ts` naming — the
 * build's inline-script loader (quartz/cli/handlers.js) turns `*.inline.(ts|js)`
 * files into bare script strings and strips their exports, so a real module
 * with named exports must keep a plain `.ts` name.
 *
 * Locked semantics:
 * - The stored choice always wins. The OS preference (`prefers-color-scheme`)
 *   only seeds the initial value when nothing valid is stored, and there is
 *   deliberately no persistent OS listener — an OS change never overwrites
 *   the reader's explicit choice.
 * - `themechange` (dispatched on `document` on every change) carries the raw
 *   mode; binary consumers narrow it themselves (e.g. the remark42 runtime
 *   maps `dark-low` → `dark`).
 * - The click listener is registered exactly once, at `document` level
 *   (event delegation): micromorph replaces the button node on SPA
 *   navigation, and document-level listeners survive the patch.
 * - micromorph patches only `<body>`, so the attribute on `<html>` persists
 *   across navigation — no re-init on `nav` anywhere.
 */

// === Local Constants ===============================================

/**
 * localStorage key — deliberately reused from the replaced darkmode package,
 * so existing visitors' stored choices migrate for free.
 */
export const THEME_STORAGE_KEY = "theme"

/** Attribute on `documentElement` that selects the palette blocks in styles/theme.css. */
export const THEME_ATTRIBUTE = "saved-theme"

/** Full mode cycle in click order: light → dark → dark-low → light. */
export const THEME_MODES = ["light", "dark", "dark-low"]

/** Shared browser-side refinement; keeping both media tags preserves the static fallback. */
const applyThemeColor = `function applyThemeColor(mode) {
  var light = document.querySelector('meta[data-theme-color="light"]');
  var dark = document.querySelector('meta[data-theme-color="dark"]');
  if (!light || !dark) return;
  var color = mode === "light" ? light.getAttribute("data-color")
    : mode === "dark-low" ? dark.getAttribute("data-dark-low") : dark.getAttribute("data-color");
  if (!color) return;
  light.setAttribute("content", color);
  dark.setAttribute("content", color);
}`

// === Exported Scripts ==============================================

/**
 * Zero-flash init, inlined into `<head>` before any stylesheet applies:
 * restores the stored choice, or seeds from the OS preference when nothing
 * valid is stored, then sets the attribute — all before first paint.
 * Best-effort by design: every storage/media access is guarded so a failure
 * degrades to the light palette, never to a broken page.
 */
export const themeInitScript = `(function () {
  try {
    var modes = ${JSON.stringify(THEME_MODES)};
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var attr = ${JSON.stringify(THEME_ATTRIBUTE)};
    var stored = null;
    try { stored = localStorage.getItem(key); } catch (e) {}
    if (stored && modes.indexOf(stored) === -1) stored = null;
    var mode = stored;
    if (!mode) {
      try { mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
      catch (e) { mode = "light"; }
    }
    document.documentElement.setAttribute(attr, mode);
  } catch (e) {}
})();`

/** Refines the static browser-chrome defaults after their meta elements have been parsed. */
export const themeColorInitScript = `(function () {
  ${applyThemeColor}
  applyThemeColor(document.documentElement.getAttribute(${JSON.stringify(THEME_ATTRIBUTE)}));
})();`

/**
 * Toggle behaviour, registered once per page load via `ThemeToggle`
 * `beforeDOMLoaded`: one delegated click listener cycles the attribute
 * through the mode list, persists the choice, and dispatches `themechange`
 * with the raw mode.
 */
export const themeToggleScript = `(function () {
  var modes = ${JSON.stringify(THEME_MODES)};
  var attr = ${JSON.stringify(THEME_ATTRIBUTE)};
  var key = ${JSON.stringify(THEME_STORAGE_KEY)};
  ${applyThemeColor}
  var readMode = function () {
    var mode = document.documentElement.getAttribute(attr);
    return modes.indexOf(mode) === -1 ? "light" : mode;
  };
  var applyMode = function (mode) {
    document.documentElement.setAttribute(attr, mode);
    applyThemeColor(mode);
    try { localStorage.setItem(key, mode); } catch (e) {}
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: mode } }));
  };
  document.addEventListener("click", function (event) {
    var toggle = event.target instanceof Element ? event.target.closest(".theme-toggle") : null;
    if (!toggle) return;
    var current = readMode();
    applyMode(modes[(modes.indexOf(current) + 1) % modes.length]);
  });
})();`
