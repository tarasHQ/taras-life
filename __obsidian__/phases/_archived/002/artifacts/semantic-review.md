[← PLAN](../_plan_002.md)

# [C12] Multi-Run Semantic CSS Review — Verdicts (Step 06)

Final semantic review of the phase's CSS migration vs `public-legacy/` (pre-phase build output, reference — NOT a byte-diff baseline). Three independent LLM review runs, identical briefs, no cross-contamination; run #3 used a sharper method (full read of both minified aggregates for a true selector-level diff) to close a shared methodological gap of runs #1/#2 (targeted-search-only against single-line minified files).

**Convergence verdict: PASS (3/3 runs PASS-WITH-NOTES, zero discrepancies after triage).**

## Run 1 — targeted-search audit
- Verdict: PASS-WITH-NOTES.
- All ledger-authorized removals confirmed absent (math/katex/typst/MathJax per `dead-css-checklist.md`); 24 `@font-face` in custom.css; 9 palette + 4 font vars in theme.css.
- Alias-variable consumer check: **zero consumers** of any dropped alias (surface/text/interactive/base-scale/font-alias/nav/tag/misc/accent-HSL) across final sources.
- 15/15 `component-*.css` bundle names identical between `public-legacy/` and `public/` (content-hash names ⇒ identical content); both `static/resource-style-*.css` present in both trees.
- Note: could not certify exhaustive selector-by-selector equivalence from searches alone (minified single-line aggregates).

## Run 2 — targeted-search audit (independent)
- Verdict: PASS-WITH-NOTES.
- Same findings as run 1, independently derived: ledger-authorized removals confirmed; alias zero-consumers confirmed; bundle-name identity confirmed; `:is()` consolidation and shorthand-vs-expanded serialization classified as minifier artifacts.
- Same residual-uncertainty note re: exhaustive aggregate inventory.

## Run 3 — full-aggregate selector diff
- Verdict: PASS-WITH-NOTES. Read both aggregates fully; produced a real selector-level diff.
- **Legacy-only rules**: all math/katex/typst/MathJax selectors → INTENTIONALLY REMOVED (ledger). Everything else (`:is()` consolidations of `ul.overflow`/`ol.overflow`, heading-anchor lists, `.desktop-only`/`.mobile-only` rule splitting) → EXPLAINED DELTA (Sass flat expansion vs nested-source lowering; minifier grouping). No legacy-only callout or popover selectors.
- **Final-only rules**: all `:is()` consolidation counterparts + split rules of the above → EXPLAINED DELTA. No unexplained gains.
- Alias consumer check re-confirmed: zero references to dropped aliases in `quartz/styles/*.css` + `quartz/components/styles/*.css`.
- Aggregate size delta (28 KB vs 32 KB) consistent with the ledger-authorized removals.

## Cross-run explained deltas (accepted)
- `:is()` selector consolidation in built output (nested sources lower differently than Sass's flat expansion did).
- Double-paren media forms preserved verbatim in **sources**; built output may normalize serialization (semantically equivalent).
- Color serialization (`rgba(143,159,169,.15)` → `#8f9fa926`), rule grouping/ordering, hash churn on `index-*.css`.

## [C9] Acceptance checklist (06.5)
- ✅ Zero `.scss` files in repo (glob over workspace; live-code `scss` mentions are conversion-history comments in CSS headers only).
- ✅ Zero sass-related deps in lockfile + manifest: `sass`, `sass-embedded`, `esbuild-sass-plugin`, `@quartz-community/quartz-fonts`, `dart-sass` — all absent.
- ⚠️→✅ Core stylesheet consumed-only custom properties: initial run flagged `--titleFont` as defined-but-unconsumed. **Targeted re-verification confirmed zero consumers in live code** (the phase's own audit premise — page-title plugin consumes it — is stale in the current tree). **User decision: removed from `quartz/styles/theme.css`.** Parser (`quartz/util/theme.ts`) unaffected (reads `--headerFont`/`--bodyFont` + palette only; test fixture never had `--titleFont`). Gate `npm run check && npm test && npm run build` green post-removal. Remaining defined vars all consumed.
- ✅ Google Fonts machinery grep empty in live code (`googleFontHref|googleFontSubsetHref|processGoogleFonts|fontOrigin|cdnCaching|fonts.googleapis|fonts.gstatic`); only stale hit: `quartz/static/fonts/README.md` (pre-phase doc, rewritten in 06.1–06.3) + vendored `docs/` (out of scope).
- ✅ Templates/create-flow grep empty in live code (step-05 grep + this run agree); only stale hits: `__obsidian__/docs/DEV_COMMANDS.md` (`npx quartz create`) — user cleaned up manually; vendored `docs/` out of scope.

## Post-review code change ledger
- `--titleFont` removed from `quartz/styles/theme.css` (the only code change triggered by this review). Semantic delta: one unconsumed declaration; verified zero-consumer before removal; gate green after. Built `index-<hash>.css` name churns as expected (content-hash naming).

## Routed-out items (documented, no code change here)
- `quartz/static/fonts/README.md` — stale pre-phase content (`.scss` wiring, `fontOrigin`, variables.scss references) → replaced during README writing (06.1–06.3, manual).
