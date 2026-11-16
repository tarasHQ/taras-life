# code-review-k3f9 — Step 05 Accent Layers (temporary, write-once)

Scope: `quartz/styles/theme.css` (accent-tier vars across mode blocks), `quartz/styles/base.css`
(heading ladder application, link design language, `::selection`). Baseline: archived oracle
`__obsidian__/phases/_archived/002/artifacts/oracle/base.expanded.css`.

## Cascade & mode correctness
- Which `:root` blocks actually match `documentElement` when `saved-theme="dark-low"`?
- Do CSS custom properties "carry over" from the dark block to the dark-low block in any way?
- Where do `--heading-1..6` resolve in dark-low — dark values or light `:root` values?
- Is the dark-low block comment's claim ("accent heading ladder shared with dark verbatim")
  describing CSS reality or intent?
- Why does dark-low re-declare the four chromatic vars verbatim — is that pattern load-bearing?
- Does anything (test, build script) assert dark-low's variable completeness? Could a missing
  var there ever be caught automatically?
- Does the real-file SSOT test in `theme.test.ts` parse the dark-low block at all?

## Heading ladder application
- Cascade: shared heading rule sets `color: var(--dark)`; scale table sets `color: var(--heading-N)`
  — does the later element rule always win? Any specificity trap?
- `thead` intentionally unaccented — confirmed anywhere?
- Does the unlayered `custom.css` `font-weight: 600` pin interact with the new per-level colors?
- Popover clones headings (`.popover h1 { font-size: 1.5rem }`) — do popped headings now carry
  accent colors too, and is that coherent?
- Page-title `h1` in the header chrome — accent color there too; intended?
- Anchor links (`a[role="anchor"]`, `color: inherit`) — fully inherit the ladder; anything else
  they inherit that they shouldn't (underline, weight)?

## Link language
- `a` is an element selector — blast radius: explorer, breadcrumbs, recent notes, footer,
  graph, backlinks chrome. Which component stylesheets override at higher specificity, which
  surfaces silently take underline + 600 + `--secondary`?
- Does component CSS load before `base.css` in the assembly (cascade outcome for chrome)?
- `.internal.broken` declares `transition: opacity 0.2s ease` — shorthand replace or additive?
  What happens to the base `color` transition on hover?
- Base hover changes both `color` and `text-decoration-color` — but transition lists only
  `color`; does the underline snap?
- `line-height: 1.4` on `.internal` — why does it still exist after pill death; is it dead
  plumbing kept alive?
- Pill removal completeness: any surviving rule anywhere styling `a.internal` with background
  / padding / radius, or a surviving `:has(> img)` exception?
- External links wrapping images — decoration behavior on replaced content; exception removal
  verified on real rendering?
- `a[role="anchor"]` inherits the full language (weight 600, underline) — intended affordance
  or noise when it appears on heading hover?
- `--highlight` consumers after pill death — who still uses it (code highlighting lines/chars)?
  Any orphaned var?

## Selection
- Single translucent rule composes over code chips, headings, links in all three modes?
- `color: inherit` vs old `color: var(--darkgray)` — any surface where inheriting is worse?
- `color-mix` baseline — already used pre-phase (old selection rule), so no new support floor?

## Integration & invariants
- `componentResources.ts` untouched — hybrid organization invariant held?
- og-image 2-palette contract — additive `--heading-*` vars invisible to the parser, confirmed?
- Test pages are the judging surface — is the iterate task still open (unchecked) with any
  findings that should rise above value-noise?

## Comments / docs accuracy
- theme.css dark-low block comment: stray indentation on one line; factual claims accurate?
- base.css banner comments — do they match the shipped rules exactly?
- Any leftover doc/comment references to the pill elsewhere in the repo?


---

# Drafted review points

### [BUG] dark-low resolves the heading ladder from the LIGHT `:root` block, not dark
**Description** — CSS custom properties do not cascade between sibling selector blocks: `[saved-theme="dark-low"]` does not inherit anything from `[saved-theme="dark"]`, only from the plain `:root`. dark-low's block never re-declares `--heading-1..6`, so in dark-low mode the headings resolve to the **light** block's dark, desaturated multi-hue values on a `#26211c` background — likely too dark, and definitively NOT what the dark-low block comment claims ("shared with dark verbatim").
**How To Do This** — Add the six `--heading-N` declarations (the dark block's values) to the `:root[saved-theme="dark-low"]` block, or change the comment to state the truth. The chromatic-four pattern dark-low follows (`--secondary` etc. re-declared verbatim) is the established convention for exactly this reason.
**Benefit** — Fixes a real rendering bug in one of the three modes the step explicitly commits to; aligns code with its own documentation; removes a silent trap for future palette edits.
**Complexity** — Trivial: six lines in one block (or one comment line). No cascade risk; values already exist in the dark block.
**Closed Advantageous Doors** — none; this only unblocks honest per-mode tuning (dark-low could later diverge from dark).
**Description In Simpler Terms** — The dim-reading mode picks up the light mode's heading colors because of how CSS variable scoping works, not the dark mode's — the opposite of what the comment promises. Six lines of copy-paste fix it.

### [BUG] `.internal.broken` transition overrides the base link's `color` transition
**Description** — `.internal.broken` declares `transition: opacity 0.2s ease`, which is a shorthand that fully replaces the inherited `transition: color 0.2s ease` on `a`. On hover, broken links still get `color: var(--tertiary)` from the base hover rule, but that color change now snaps instantly while other links animate.
**How To Do This** — Declare the transition as `transition: color 0.2s ease, opacity 0.2s ease` (or use `transition-property` longhand) so both properties animate consistently with the base language.
**Benefit** — Hover behavior becomes uniform across the whole link matrix; the design language stays coherent instead of having a special-case snap.
**Complexity** — One-line change; zero risk.
**Closed Advantageous Doors** — none.
**Description In Simpler Terms** — A fine-print CSS rule accidentally cancels the smooth color-change animation for broken links, so they flick instead of fading like every other link. One line restores it.

### [SMELL] `line-height: 1.4` on `.internal` is dead plumbing surviving pill death
**Description** — The pill needed a line-height to keep its rounded background from colliding with line boxes; with the background gone, `1.4` on internal links (below the site's 1.6 rhythm) now does nothing good — it makes internal links' line boxes visibly tighter than surrounding prose in the same paragraph, which a dashed underline actually makes noticeable.
**How To Do This** — Remove `line-height: 1.4` from `.internal` (grep the archived oracle's rationale first to confirm nothing else depended on it).
**Benefit** — Internal link text aligns on the same rhythm as surrounding prose; one less rule to explain; the link block reads purely as the decided language.
**Complexity** — One-line removal; verify on the callouts-&-links test page.
**Closed Advantageous Doors** — none.
**Description In Simpler Terms** — An old rule that existed only to support the deleted pill box was left behind; it now slightly squishes internal links' line spacing for no reason. Deleting it is safe.

### [EDGE-CASE] Underline on links wrapping images is now unhandled
**Description** — The old `:has(> img)` exception (strip pill chrome from image-links) was removed with the pill — correctly — but the new language adds `text-decoration: underline` to ALL links, including ones wrapping images, where an underline draws under the image box and looks like a stray line.
**How To Do This** — Verify on real rendering (image-heavy page / image-embed inside a link). If confirmed, add a targeted exception, e.g. `a:has(> img) { text-decoration: none }` scoped narrowly, or accept it after eyeballing.
**Benefit** — Prevents a visible artifact on a real surface (image embeds are common in Obsidian content).
**Complexity** — Small: verify first, one rule if needed.
**Closed Advantageous Doors** — A narrow `:has(> img)` exception would slightly complicate the "one rule, no exceptions" narrative — but scoped to decoration, not pill chrome.
**Description In Simpler Terms** — Links around pictures used to get an exemption from the old box styling; the rewrite deleted the exemption and now also underlines pictures, which may look odd. Check on a real page before deciding.

### [PERF/ARCHITECTURE] `::selection` with `color: inherit` vs inheriting through headings/links — verify the win, document the compose
**Description** — `color: inherit` on `::selection` is the right call over the old fixed `--darkgray`, but its behavior on top of translucent backgrounds over *link text* (which itself has an underline and `--secondary` color) should be verified once on a test page; also confirm no UA quirk on Windows high-contrast mode (a known `::selection` pitfall).
**How To Do This** — One devtools pass on the type-specimen + links pages in all three modes; no code change expected unless a real artifact shows up.
**Benefit** — Confidence that the "single rule covers all three modes" claim is empirically true, not just theoretically; the iterate-on-loop task is still open, this fits it.
**Complexity** — Verification-only.
**Closed Advantageous Doors** — none.
**Description In Simpler Terms** — The new selection highlight is theoretically correct in all three themes; this asks for one quick look to confirm it's also correct in practice where text is already colored or underlined.

### [ARCHITECTURE] `a { font-weight: 600 }` element-selector blast radius
**Description** — The rework consolidated `font-weight: 600` + `color: var(--secondary)` on the bare `a` element selector; every anchor in chrome (explorer, breadcrumbs, graph, footer, recent notes, TOC) inherits the underline language unless a component stylesheet overrides with higher specificity — and chrome stylesheets in the assembly may load before `base.css`, losing ties.
**How To Do This** — Sweep the visible chrome in all three modes against the language (probably fine — but enumerate which surfaces deviate and whether that deviation is deliberate).
**Benefit** — The link language is either site-wide-and-coherent or consciously scoped; ambiguity here is exactly what "decided explicitly" was meant to kill.
**Complexity** — Verification-only unless a real conflict surfaces.
**Closed Advantageous Doors** — none.
**Description In Simpler Terms** — Because the new style targets ALL links at once, it also hits menu/sidebar/footer links; a walk-through of every page region checks whether that's what we want everywhere.

### [SMELL] `--heading-1..6` are comment-declared "starting values" but have no retune affordance
**Description** — The step deliberately ships temporary multi-hue plumbing with an eyeball pass pending, but nothing records WHERE the final values must live once settled (per-mode blocks, and whether dark-low gets its own ladder) — the iterate task is unchecked and untracked for this decision.
**How To Do This** — Either land the eyeball pass verdict in the step file's iterate task, or leave an explicit open-loop note naming the decision point (settle in place vs. per-mode divergence).
**Benefit** — Prevents the "temporary values" from silently becoming permanent — the exact failure mode the comment warns against.
**Complexity** — A few sentences in the step file.
**Closed Advantageous Doors** — Recording a verdict early could pre-empt the living-with-it iteration this phase explicitly values.
**Description In Simpler Terms** — The colors are placeholders by design, but nothing notes when/how they get replaced with final ones — a one-line reminder stops them fossilizing.

### [BUG-CANDIDATE] dark-low block comment has a corrupted indentation line
**Description** — In `theme.css`'s dark-low banner, one continuation line starts with a tab-then-space sequence (`	 * --dark —`) inconsistent with the rest of the comment block — cosmetic, but this is the OG-contract comment, a load-bearing doc.
**How To Do This** — Normalize the comment's leading whitespace to match its sibling lines.
**Benefit** — Cosmetic hygiene on an SSOT banner comment; zero risk.
**Complexity** — Trivial.
**Closed Advantageous Doors** — none.
**Description In Simpler Terms** — One line in an important explanatory comment is indented slightly wrong — fix the typing slip.

### [MINOR] Assorted small issues
- `a.internal .broken` nesting uses `&.broken` inside `&.internal` inside `a` — correct, but confirm compiled output matches intent (esbuild nesting downleveling).
- `text-decoration-thickness: 1.5px` is an absolute px value on a rem-anchored site (step 04 lesson: px vs rem proportions) — check it doesn't look anemic at 22px base.
- The link banner comment says "thickness 1.5px, offset 0.15em" — matches code, good; verify no drift after any of the above changes.
- Verify no leftover references to the pill in any other stylesheet/comment (grep for `internal` + `highlight` background usage).
