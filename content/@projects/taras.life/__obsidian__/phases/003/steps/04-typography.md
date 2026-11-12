---
publish: true
created: 2026-11-05T12:00:13.522Z
modified: 2026-11-05T12:00:26.395Z
published: 2026-11-05T12:00:26.395Z
status: ready
state: full
---

[← PLAN](../_plan_003.md)

## Description

Rebuild the reading experience's typographic footing in `base.css`: **fix the latent bugs first**, then land the baked type scale and the article reading measure on top of that sound footing.

Two pre-existing bugs undermine any new scale (from the refinement pass, validated):

1. **No base `font-size` anywhere** (incl. `popover.css`) — body text is browser-default 16px, so the "22px base" has no anchor. Locked verdict 9: one page-wide knob anchored at **html level**; rem-sized chrome is verified during the normal iteration loop, no A/B ritual.
2. **`line-height: 1.6rem`** on `p`/`li`/`tbody` is a _length_, not a ratio — nested/smaller elements (code, small text) get a wrong fixed 25.6px line box instead of 1.6× their own size. Table children use `2rem`. Converted to unitless in the same commit.

Order matters: bugs first, scale second — the scale must not inherit broken line-box behavior, and the iteration loop must not waste time debugging symptoms.

## High-Level

### List of related files or folders

- `quartz/styles/base.css` — the entire surface of this step: anchor, unitless line-heights, baked scale table, article measure, `text-wrap: balance` on headings.
- `quartz/styles/popover.css` — read-only context: validated to have no `font-size` of its own; verify after the anchor lands that popovers scale coherently with rem.
- `__obsidian__/ideas/pond-insights.md` — the type-scale source (base 22px, ratio 1.125 minor second, h1 2.027rem … p 1rem) and its rationale.
- Judging surfaces: step 01 test pages (type specimen + lists pages especially) + real pages (journal entry, long note) on the local serve loop.

### Intended outcome

- `html { font-size: 22px }` anchors everything; every rem-based size (content and component chrome alike) derives from one knob.
- All `line-height` values on text elements are unitless ratios; no rem/px line-heights remain.
- Heading sizes follow the baked 1.125-ratio table; the current ad-hoc values (1.75rem general h1 / 2rem article h1) are replaced by the scale — the article-h1 special case is subsumed by it.
- Article content is capped at `max-width: 80ch` with no escape hatch — wide blocks (`pre`, `.table-container`) scroll internally (already the case, validated).
- Headings use `text-wrap: balance` (paragraphs already have `pretty` — validated fact, nothing to add there).
- Scale + measure are iterated on the test pages; what "a comfortable line of text" means is judged against real content, not decided in the abstract.

### Local invariants

- **Baked rem table** (locked HOW verdict 7): typescale.com-style values verbatim in the heading rules, no `--base`/`--ratio` calc derivation. A comment links back to `pond-insights.md` for the ratio rationale. Rationale: values will be hand-tweaked by eye anyway; a formula would be a second thing to keep in sync.
- **80ch absolute, NO escape hatch** (locked HOW verdict 8): no `:has()` auto-widening, no frontmatter flag, no frame switching. An escape hatch may be added later only if living with it proves bad.
- **Measure is article-scoped**: attaches to the article content container, not `.center` itself — sidebars/frames/grid track stay untouched.
- **Anchor is html-level**: blast radius on rem-sized chrome (6rem paddings etc.) is accepted by verdict 9 and verified by eyeballing during this step's loop, not by special-casing.
- **Mobile media query on the anchor is a loop item, not a shipped default**: start at 22px flat; if the phone experience says oversized, one media-query line scales everything down proportionally. Decided by living with it, consistent with the phase's working style.
- `text-wrap: pretty` already exists on text elements — do not duplicate it.
- DEV\_RULES do not apply to `quartz/` CSS, but their styling rule (universal UI: usable from small phones to 4K, reactive to size changes) is the acceptance lens for the measure/anchor work.

### Should NOT be done in this step

- No heading/link/selection colors — typography defines _sizes and rhythm_; colors are step 05's concern (judged against this step's settled scale).
- No vertical-rhythm overhaul beyond what the scale naturally carries (heading margins may be touched where the scale demands it, but no redesign).
- No font-family/preload changes (fonts were settled in phase 002; italics already shipped).
- No component-chrome sizing redesign — rem-sized chrome is _verified_, not restyled.
- No hyphenation experiments (not locked, not requested — park if it comes up in the loop).

---

## Tasks

- [ ] **Baseline read** of `base.css` typography-relevant rules (html/body, headings, p/li/tbody, article/center containers) — record what exists before changing it.
- [ ] **Fix latent bugs**: add `html { font-size: 22px }`; convert `line-height: 1.6rem` → `1.6` on p/li and `2rem` on table children → unitless equivalent; grep for any other length-based line-height in `quartz/styles/`.
- [ ] **Bake the scale table**: replace stock heading sizes with the 1.125-ratio values from pond-insights; verify h1–h6, code, small text all derive coherently from the anchor.
- [ ] **Add the measure**: article-scoped `max-width: 80ch; margin-inline: auto`; verify mobile (measure may exceed narrow viewports — should degrade to full width naturally), and that the grid's auto center column + `calc(1200px + 300px)` page cap don't fight it.
- [ ] **Add `text-wrap: balance`** to heading rules.
- [ ] **Verify rem-sized chrome** after the anchor: sidebars, explorer, footer, popovers, breadcrumbs — eyeball on test pages for anything that broke visually at 22px base (accepted blast radius, but catch outright breakage).
- [ ] **Wide-content check**: on the code/tables test page, confirm wide `pre`/tables/mermaid scroll internally inside the 80ch column and nothing overflows the viewport.
- [ ] **Iterate on the loop**: judge scale + measure against the type-specimen, lists, and real pages; tune values by eye; decide the mobile-anchor question by actually looking at a phone viewport; record anything that rises above value-noise in the plan's Exploration notes.
