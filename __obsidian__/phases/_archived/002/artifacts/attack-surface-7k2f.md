# Attack Surface — Phase 002 (SCSS→CSS, theming flattening, Google Fonts removal)

%%Scorched Earth Critique, Stage B1. Temporary self-reflective exploration.
Nested questions + possible explanations. NO answers, NO recommendations.
Target artifacts: initial-reflection.md (phase 002 raw + LLM refinement).
All 10 derived critique points were accepted by user — see reflection's
"Critique integration" section; this artifact is kept as provenance.%%

---

## 1. The `css-text` pipeline blind spot
- The build imports `.scss` via `sassPlugin { type: "css-text" }` — styles arrive in JS as **strings**, then get concatenated into the core stylesheet by `componentResources.ts`.
    - What happens when the plugin is removed and imports become `import "./base.css"`?
        - Does stock esbuild return CSS *text* to the importing JS module, or does it emit a separate `.css` chunk and return a link/URL?
            - Possible explanation: esbuild's native CSS handling produces chunked CSS output, not inline strings — the whole "assemble one core stylesheet" architecture may silently break.
        - Is a replacement loader (`loader: { ".css": "text" }`) or an import attribute (`with { type: "text" }`) needed?
            - Possible explanation: the reflection planned "remove both sassPlugin instances" without planning what replaces the string-import mechanism.
        - Does the `.inline.scss` → `css` second instance exist precisely because some consumer needed real CSS chunking, not text?
            - Possible explanation: it's dead today (no matching files), but its presence hints at an intended mechanism nobody audited.
- Does `cssImports: true` flag carry meaning beyond Sass (relative `@import` resolution in plain CSS)?
    - Possible explanation: native CSS `@import` handling differs; post-conversion stylesheets that relied on Sass `@use` merging need explicit merge strategy.

## 2. Consumers of `cfg.theme` beyond `joinStyles`
- Reflection locks removal of `theme.colors` / `theme.typography` from YAML + `Theme`/`ColorScheme` types.
    - Who else reads `cfg.theme.typography` or `cfg.theme.colors`?
        - `googleFontHref` / `joinStyles` are known — but are there others (OG image generation? RSS/JSON feed templates? sitemap? Head.tsx beyond the Google block? component code reading font vars indirectly via config?)
            - Possible explanation: a consumer was missed and tsc --noEmit catches it late (good) — or a dynamic/stringly-typed access slips through (bad).
    - Does the `--titleFont` variable have any consumer at all?
        - Exploration found none. The reflection plans to hardcode "4 font vars" — one of them may be dead weight being faithfully preserved.
            - Possible explanation: titleFont was consumed by something removed earlier (latex/graph?) and survived as an orphan.

## 3. Dead-CSS audit: effort vs reward vs risk
- One-time manual audit of rendered HTML vs stylesheets.
    - What is the actual reward? Byte savings from pruning unused selectors are tiny for a static blog.
    - What is the risk? micromorph SPA nav + dynamic DOM (search, popovers, theme toggle, mermaid?, callout collapse) styles things that never appear in statically-rendered HTML snapshots.
        - Possible explanation: static-HTML-vs-CSS diffing systematically flags *live* selectors as dead — the audit methodology itself is biased toward false positives.
    - The reflection says "don't prune aggressively" — then what exactly does the audit buy?
        - Possible explanation: the audit's real value is knowledge, not deletion; but it's sequenced as a pruning prerequisite.
- Is auditing "removed plugins' CSS leftovers" actually distinct from reading base.scss once?

## 4. Step 02 monolith
- One step = 6 file conversions + palette hardcoding + dead-CSS pruning + mixin expansion + map inlining.
    - If the site renders subtly wrong after step 02, which change caused it?
        - Possible explanation: bisectability was traded for "touch each file once" — a reasonable trade, but the verification plan (visual smoke) may be too weak to detect subtle regressions (e.g. a font-weight shift, a collapsed-callout style).
    - Does "every step ends with `npm run check && npm run build`" actually exercise the visual layer at all?
        - Possible explanation: no automated CSS snapshot/diff exists, so step-level verification is human-eyeball only.
- Is there a cheap mechanical safety net being ignored?
    - Possible explanation: diffing `public/` CSS output between pre/post-step commits would turn "visual smoke" into byte-level review.

## 5. Templates surgery (4 yaml files)
- `quartz/cli/templates/*.yaml` set `fontOrigin: googleFonts` — the site never runs `quartz create`.
    - What is the reward of editing vendored templates?
        - Possible explanation: consistency / preventing future confusion. Possibly near-zero practical value.
    - What is the risk of *not* touching them?
        - Possible explanation: none, for a fork that never invokes the CLI scaffolder.
    - What is the risk of touching them?
        - Possible explanation: schema removal must stay in sync with 4 template files + config — more surface for drift, in a vendored tree with no tests over templates.

## 6. Sequencing coherence
- Locked constraint: "`joinStyles()` dies only after CSS carries static vars" → static vars land in step 02, joinStyles dies in step 03. OK.
    - But in step 02, `joinStyles` still runs and generates variables — do hardcoded `:root` vars collide/duplicate with generated ones for one step's duration?
        - Possible explanation: duplicated custom properties with identical values are harmless in CSS; but identical names with *drifted* values (e.g. someone tweaks YAML colors) would silently shadow — for exactly one commit, acceptable or not?
- "Dead-CSS audit precedes conversion" — step 01 produces findings; step 02 applies them.
    - Is the hand-off artifact specified (where do audit results live so step 02 consumes them deterministically)?
        - Possible explanation: `_exploration.md` or the step file; unstated.

## 7. Claim accuracy in the reflection
- "transitive `sass`/`sass-embedded` (1.104.1) drop from lockfile" — package.json doesn't list them directly (verified transitive). Minor, but:
    - Was the version number verified or assumed?
- "6 `.scss` files" — verified correct. "one mixin" — verified correct. Good.
- `@use "sass:color"` in callouts.scss is imported but unused — verified. Fine.

## 8. Overall ROI of the phase
- The site is a personal blog; the wins are: fewer deps, no Sass, smaller CSS, simpler vendored tree.
    - What breaks if this phase never happens?
        - Possible explanation: nothing breaks; this is pure hygiene. Is the execution risk (visual regressions across a theming rewrite) worth it for a blog with readers?
    - Counter-consideration: is "hygiene with near-zero behavioral change" precisely the kind of change that is *safest* to do, precisely because output should be near-identical?
        - Possible explanation: if output-identity is the goal, it should be verified mechanically, not visually — see 4.

## 9. Decision persistence coverage
- READMEs planned: `quartz/styles/README.md` minimum.
    - Decisions also land in `quartz/util/` (theme.ts gutting), `quartz/cli/` (handlers), `quartz/plugins/emitters/` (componentResources), `package.json`.
        - Should each landing site carry a note, or is a single styles/README + AGENTS.md table enough?
            - Possible explanation: precedent exists only for `static/fonts/` and remark42 — is the convention actually defined anywhere (AGENTS.md 02.1 says "every logical module"), meaning util/cli/emitters may *already* be non-compliant before this phase?

---

## Meta-level (added in discussion, after user pushed back on missing meta-attack)
- The phase's driver is cognitive load / SSOT for styling (user-confirmed), not "Sass is redundant" — the plan should state the real driver.
- Theming flattening = risk-dominant piece: CSS fails silently (no build error), consumers are reader-visible (darkmode, syntax.scss, Remark42). Verification effort must be allocated there disproportionately.
- "100% a good thing" is unfalsifiable; replace with "output provably identical except reviewed intentional deltas" via byte-diff against a frozen baseline.
- Opportunity cost question (what else is queued) — user implicitly answered by proceeding.
- Steelman of the whole phase: vendored tree is the codebase now; dead machinery is a recurring tax on every future interaction (human or LLM); deletion makes questions permanently unaskable.
