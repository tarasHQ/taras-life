# Refining Possibilities — raw exploration (stage B1)

Temporary brainstorm scratchpad for refining `initial-reflection.md` of phase 003 (visual identity).
Nested questions/points only — no answers, no finalizations.

## Theme / palette / 3 modes

- Is the 9-slot palette (`--light`, `--lightgray`, `--gray`, `--darkgray`, `--dark`, `--secondary`, `--tertiary`, `--highlight`, `--textHighlight`) enough to express three modes, or does dark-low need *new* slots (e.g. softer borders, dimmer code blocks)?
- What actually "softens" in dark-low: background lift only? Or also text contrast, border alpha, syntax colors, callout saturation?
- Should dark-low be a third `:root[saved-theme="dark-low"]` block, or a `data-contrast` attribute layered *on top of* dark (two orthogonal attributes)?
- If a third block is added, what happens to the OG-image parser (`quartz/util/theme.ts`) which hard-expects exactly `:root` and `:root[saved-theme="dark"]` — and its test that *fails* when the dark selector is missing?
- Can dark-low reuse the dark OG palette (map dark-low → dark) without touching the parser at all?
- The variable names are role-inverted (`--light` *is* the background, `--dark` is the text color). Is this the right moment to rename to surface/ink tokens — or does renaming close doors (upstream divergence, og-image contract, muscle memory)?
- Is a "systematic ramp" (derivable dark-low = same hues, lifted bg, softened contrast) better expressed as: hand-written third block, CSS `color-mix()` derived from dark, or generated at build time from a token file?
- `color-scheme` property: currently handled inside the darkmode package's CSS. Who owns `color-scheme` (scrollbars, form controls, native widgets) after the dep is removed?
- FOUC: the npm package script runs as a bundled component script — does the current setup already flash the wrong theme on load? Where should the attribute-setting script live for zero-flash (inline in `<head>` before first paint)?
- The OS-change listener semantics change (dark-low sticky, follow-OS only light↔dark): does "follow OS" remain a concept at all, or does an explicit user choice always win and OS only seeds the initial value?
- Cycle order `light → dark → dark-low → light` vs. a dropdown/segmented control vs. cycling-with-long-press: does a 3-state cycle still work as a single icon button (which icon represents dark-low)?
- `index.d.ts` types `themechange` detail as `{ theme: "light" | "dark" }` — union types need updating in lockstep with the component rewrite.
- Does anything else in the ecosystem assume binary? (search results, popover, graph view colors, mermaid themes?)

## Typography

- Base font size is currently *unset* (browser default 16px). Jumping to 22px base (pond-insights) is a ~38% jump — is the intent "22px body" or "1.375rem scale anchored somewhere"?
- Where should the scale anchor live: `html { font-size }` (changes *everything*, including component chrome, sidebars, explorer) vs. body/article-level sizing only?
- `line-height: 1.6rem` on p/li/tbody is unit-based — it does not scale with per-element font-size. Is this a latent bug to fix as step 0 before building the scale?
- The pond-insights scale (h1 2.027rem … p 1rem, ratio 1.125) conflicts with current reality (h1 1.75rem general / 2rem article-specific). Does the scale replace both, and does the article-h1 special case survive?
- Reading measure: no max-width exists today; center column is grid-driven (~880px+). Is a `ch`-based measure (~65ch) more robust than a fixed 750px across font-size changes?
- Mobile base: media-query base reduction vs. fluid `clamp()` typography — which fits a static-SSR no-hydration site better?
- Line-height should probably become unitless (~1.6) as part of the scale work — does anything depend on the rem value?
- Heading margins: do they get rebuilt as part of the scale (vertical rhythm) or stay ad-hoc?
- Hyphenation, `text-wrap: balance` for headings, `text-wrap: pretty` for paragraphs — cheap modern wins worth bundling into the typography step?
- Font preloading currently covers 400/600 normal + JetBrains Mono; does the scale introduce weights/styles that need preloading too (italics are already shipped)?

## Accent layers

- Reflection says "underline, never highlight whole link" — but current `.internal` links have a highlight *background* with padding. Does this mean removing the background pill for internal links? That changes the visual signature of wikilinks sitewide.
- Colorful headings: per-level color (h1..h6 each different) or per-section accent? How do the colors derive from the 3-mode ramps (do heading colors need per-mode variants, or do they stay constant across modes)?
- Obsidian's heading colors + "minimal config" colors: are those palettes tuned for *dark* backgrounds only? Do they survive on light mode without a light variant?
- Contrast: colored headings must clear WCAG against *three* backgrounds now — is there a check loop, or eyeballing?
- Selection styling currently mixes `--tertiary` at 60% with white-alpha — does it hold up in dark-low, or become invisible?
- Callouts, tags, code-inline: do they count as "accent layers" or are they explicitly out of scope for step 3?
- Turntrout.com/design reference: what exactly is borrowed — the idea (colored headings) or specific color values?

## Background bench

- Fixed (viewport-pinned) gradient vs. scrolling gradient vs. none: a fixed gradient on `body` requires `background-attachment: fixed` (mobile Safari quirks/perf) or a fixed pseudo-element — which approach is testable cheaply?
- Banding: gradient over large viewport heights in 8-bit color — does the test bench include banding-prone cases (dark bottom → lighter top is the classic banding case)?
- Grain: SVG `feTurbulence` inline data-URI vs. PNG tile vs. CSS-only noise — bundle-size and repaint cost of each?
- Do gradient/grain layers need per-mode variants (dark-low's lifted background changes the gradient endpoints)?
- Print styles: does a fixed background wreck `@media print` output?
- Is the background experiment orthogonal to the ramp work (can be reverted independently), or does it entangle with `--light` being the background token?

## Favicon

- Scope guard says "tab favicon + cheap apple-touch resize". But: no SVG favicon exists today, only `static/icon.png` wired in `Head.tsx` — is adding SVG (with per-mode `prefers-color-scheme` media inside the SVG) cheap or scope creep?
- `theme-color` meta for mobile browser chrome: is that favicon-adjacent or its own tiny item?
- AI-generated `[T]` icon: where does the source of truth live in-repo (static assets, or the generation prompt recorded in the phase)?

## Process / iteration loop

- Workers Builds has NO previews. "Live tweaking in browser" implies a local `quartz build --serve` loop — is that workflow established, or does step 1 need to include setting it up?
- Test pages named in the reflection: journal entry, long note, homepage. But `content/index.md` is still the *default Quartz placeholder* — is iterating against placeholder content meaningful, or should the test set be journal + long note + `markdown-test.md`?
- Should there be a side-by-side "before/after" capture habit (screenshots into phase artifacts) to make the iterate loop concrete?
- Breadcrumbs contradiction (marked [DISCARDED] in Capture but still enabled in config) is parked — but does the visual-identity phase *see* breadcrumbs on every page during iteration (visual noise in the test pages)?
- Sequencing: reflection already suggests "tweak palette values first (~30 min) then 3-mode architecture" — should step 1 be split into two steps in the plan?

## Out-of-scope guardrails

- Component chrome (sidebar, explorer, footer) styling consumes the same tokens — does a token refactor *force* touching chrome anyway?
- Dark mode images (dimming/brightness treatment) — excluded as "image treatment", but does the new dark palette make current images look broken?

---

# Stage B2 — Drafted possibilities (to be validated in stage C)

## 1. [PROPER LONG-TERM] Rename palette tokens to semantic surface/ink names before adding the 3rd mode
**Description** — The current 9 CSS slots use role-inverted, self-referential names: `--light` *is* the background color, `--dark` *is* the text color. Adding a third mode multiplies every mental-model error this causes.
**How To Do This** — In `theme.css`, rename slots once (e.g. `--light`→`--page`, `--dark`→`--ink`, `--darkgray`→`--ink-soft`, `--lightgray`→`--hairline`, keep accent names) and mechanical-rename all `var()` consumers across `quartz/styles/` + component CSS, in a single dedicated commit.
**Benefit** — The dark-low ramp becomes describable ("lift the page surface, soften the ink") instead of "make `--light` brighter and `--dark` dimmer", which reads as nonsense. Every future palette iteration, the background-experiment step, and any contributor conversation inherits sane names; the ramp design becomes systematic by construction.
**Complexity** — Low-to-medium. Pure mechanical rename, no behavior change; the og-image parser (`quartz/util/theme.ts`) is the only coupled consumer and it's in-repo (update keys + its test together). Risk is a missed consumer, mitigated by the build failing on unknown/missing variables only at visual level, so a grep sweep + build + visual spot-check suffices.
**Closed Advantageous Doors** —
- Keeping future copy-paste compatibility with upstream Quartz snippets/patches that use stock names.
- Zero-diff "palette value tweak only" commits during the browser iteration loop become harder to read in git history if names changed in the same phase.

## 2. [ARCHITECTURAL] Replace `@quartz-community/darkmode` with a local 3-mode component owning the full theme contract
**Description** — A single local component (~100 lines TS) becomes the sole owner of: attribute setting, localStorage persistence, cycle order (light → dark → dark-low → light), OS-preference seeding, and `themechange` dispatch — replacing the binary npm dep entirely.
**How To Do This** — New `quartz/components/ThemeToggle.tsx` (Preact, SSR-rendered button + inline before-paint script), register it in the components index, swap the layout entry in `quartz.config.yaml` from the package to the local component, extend `theme.css` with the third `:root[saved-theme="dark-low"]` block, update `syntax.css` selector, remark42 mapping, and `index.d.ts` union in the same step.
**Benefit** — Removes the only dependency whose behavior actively contradicts the design (OS listener overwriting stored choice; binary-only cycle). The theme contract — attribute values, storage key, change events — becomes in-repo, typed, and greppable instead of split between `node_modules` and four consumer files. This is the one genuinely architectural item in the phase and everything else lands on top of it.
**Complexity** — Medium. The component itself is small, but it is the phase's coordination point: 5 consumer files must change in lockstep. The trade is a one-time medium effort against permanently owning this behavior.
**Closed Advantageous Doors** —
- Automatic fixes/updates from the npm package (though the binary behavior is precisely what's unwanted).
- A hypothetical later "4th mode" via config flag of the package — but a local component makes a 4th mode *easier*, not harder.

## 3. [BLIND SPOT] Fix the latent typography bugs before building the scale on top of them
**Description** — Two pre-existing issues undermine any new type scale: (a) no base `font-size` is declared anywhere — body text is browser-default 16px, so the pond-insights "22px base" has no anchor; (b) `line-height: 1.6rem` on `p`/`li`/`tbody` is a *length*, not a ratio, so nested/other-size elements get a wrong 25.6px line box instead of 1.6× their own size (code blocks, small text, list items at other sizes are subtly broken today).
**How To Do This** — Before applying the scale: declare the base size (either `html { font-size }` for global scaling or article-scoped anchoring — a decision point), and convert all length-based `line-height` values to unitless ratios in the same commit.
**Benefit** — The scale lands on sound footing: every subsequent value (headings, measure, rhythm) is expressed against a known anchor and scales coherently. Without this, the new scale silently inherits the broken line-box behavior and the browser-iteration loop wastes time debugging symptoms.
**Complexity** — Low. Small CSS diff, but the `html`-vs-article anchor decision must be made consciously because it changes *all* rem-based component chrome (sidebars, explorer) — that blast radius is the real decision, not the code.
**Closed Advantageous Doors** —
- Keeping browser-default sizing for users who override their default font size via accessibility settings — anchoring on `html` is the standard solution, but article-scoped anchoring preserves slightly more user control.

## 4. [LOW EFFORT - HIGH REWARD] Reading measure via `ch`-based max-width + modern text-wrap properties
**Description** — No reading measure exists today: the center column runs to ~880px+ of grid space. Add an article-scoped `max-width` in `ch` units (~65ch) targeting the 50–75 chars/line goal, plus `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.
**How To Do This** — One scoped rule on the article content container (not `.center` itself, so sidebars/frames stay untouched), using `ch` rather than a fixed 750px so it self-adjusts when the base font size changes; ship the two `text-wrap` properties in the same rule set with graceful degradation.
**Benefit** — This is the single highest visual-impact-per-line-of-CSS change in the whole phase; combined with the type scale it defines "what a comfortable line of text looks like" far more than any color tweak. `ch` units make the measure *derived* rather than magic-numbered, matching the phase's systematic-ramp principle.
**Complexity** — Very low. One rule plus a check that popovers/embeds/tables that legitimately want full width aren't clipped (may need an escape-hatch class for wide content like tables/code).
**Closed Advantageous Doors** —
- A later "wide media/tables break out of the measure" composition pattern becomes a deliberate feature rather than default behavior — but that pattern is standard and cheap to add.

## 5. [BLIND SPOT] The internal-link highlight pill contradicts the stated link design — decide the link design language explicitly
**Description** — The reflection says "underline, never highlight whole link", but current CSS gives internal links a background-pill treatment (`--highlight` background, padding, radius) and *no* underline anywhere; external links are likewise un-underlined. Step 3's intent directly contradicts the shipped wikilink signature.
**How To Do This** — Make the link treatment an explicit design decision early in step 3: what remains for internal links (color-only? underline-only? underline + color?), whether the pill dies entirely, and how hover states differ — then implement across `base.css` in one pass rather than discovering the contradiction mid-iteration.
**Benefit** — Links are the most frequently rendered element on every page; flipping their treatment mid-iteration invalidates prior visual judgments (colors evaluated next to pills vs. next to underlines read differently). Deciding first keeps the iteration loop monotonic instead of oscillating.
**Complexity** — Low code-wise; the cost is a design decision. Removing the pill also touches the tag-link and broken-link variants, which need coherent fallbacks.
**Closed Advantageous Doors** —
- Keeping the pill as the internal-link signature (a defensible alternative: "pill for internal, underline for external") — accepting this point forecloses it; worth deciding consciously, not by accident.

## 6. [PERFORMANCE] Inline a zero-flash theme-init script as part of the 3-mode component work
**Description** — The current theme attribute is set by a bundled component script that runs after DOM ready; on a slow load or in a cold cache a dark-mode visitor can get a light flash. A ~10-line inline script in `<head>` (read storage → OS fallback → set `saved-theme` before first paint) eliminates the flash and becomes part of the new component's contract.
**How To Do This** — Emit the init script inline in the `Head` component (or the theme component's `beforeBody` position) during the step-2 component replacement; keep it in sync with the storage key and attribute values it reads.
**Benefit** — Theme flash is the most jarring possible first impression for a returning visitor — squarely within the phase's "what the eye registers before reading a word" scope, yet it's invisible in a happy-path screenshot and easy to forget entirely. Fixing it during the component rewrite costs almost nothing extra.
**Complexity** — Low. The main care point is duplication: the init script and the toggle component must agree on key names/values, best handled by keeping both tiny and colocating their constants.
**Closed Advantageous Doors** —
- None meaningful; the flash-free approach is strictly superior.

## 7. [LOW EFFORT - HIGH REWARD] `theme-color` meta + SVG favicon with per-mode media query, instead of PNG-only
**Description** — Today the favicon is a single `static/icon.png` and there is no `theme-color` meta. Two adjacent cheap wins: add `<meta name="theme-color">` per color mode (mobile browser chrome matches the ramp), and ship an SVG favicon that can even carry `prefers-color-scheme` media to swap its own colors, with PNG fallbacks where needed.
**How To Do This** — Extend `Head.tsx` (it already constructs the icon link) to emit the SVG link + per-mode theme-color metas derived from the same parsed theme data the OG pipeline uses; produce the SVG during the favicon step (step 5) but note the Head wiring now.
**Benefit** — The browser-chrome color is part of the visual identity the visitor sees before the page even paints, and it's the *cheapest* possible expression of the ramp outside the page. It extends the favicon step's scope by minutes, not hours, while staying inside the "no logo/OG expansion" guard.
**Complexity** — Very low. The only trap is keeping the meta values in sync with the ramp — deriving them from `parseThemeData` output makes the sync automatic.
**Closed Advantageous Doors** —
- A hand-tuned per-platform favicon pack (multiple PNG sizes, masks) — deferred anyway by the scope guard; this point doesn't make it harder later.

## 8. [PROPER LONG-TERM] Build the iteration infrastructure first: local serve loop, a corrected test-page set, and an automated 3-mode contrast check
**Description** — Two gaps in the reflection's iteration plan: (a) Cloudflare has NO previews, so the "live tweaking in browser" loop needs the local `quartz build --serve` workflow explicitly set up as infrastructure, and (b) the named test set includes "homepage", but `content/index.md` is still the default Quartz placeholder — iterating against placeholder text validates nothing. Additionally, colored headings × 3 modes × WCAG contrast is exactly the kind of multi-dimension check humans do badly — a tiny script can do it perfectly.
**How To Do This** — Step 0 of the plan: verify/establish the local serve workflow; replace "homepage" in the test set with `markdown-test.md` (headings, lists, callouts, buttons) alongside the journal entry and the long note; add a small contrast-audit script (parse ramp values, compute heading/link/selection contrast ratios per mode, fail below threshold) — companion to the existing `check:comments` audit pattern.
**Benefit** — Every subsequent step's quality depends on the iteration loop being real: fast local feedback on the right content. The contrast script converts "do the colors hold up?" from an eyeball judgment repeated across 3 modes × N element types into a one-command gate, and it keeps paying off in every later visual phase.
**Complexity** — Low individually (serve is one command; test-set swap is a note; the script is ~80 lines reusing the theme parser), but it must come *first* or each later step pays the friction tax.
**Closed Advantageous Doors** —
- None — this is pure enabling infrastructure.
