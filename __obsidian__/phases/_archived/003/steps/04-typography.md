---
status: implemented
state: condensed
---

[← PLAN](../_plan_003.md)

## Description
Fixed the two latent typography bugs in `quartz/styles/base.css` first, then landed the baked type scale and the article reading measure on that sound footing: `html { font-size: 22px }` as the single rem anchor for the whole site, all `line-height` values unitless, the baked 1.125-ratio heading scale (`pond-insights.md` values verbatim), article-scoped `80ch` measure with no escape hatch, and `text-wrap: balance` on headings. Code review surfaced extra fixes folded in (body-level rhythm baseline, inline-code sizing, popover reset removal).

## Implementation Summary
- **Latent bugs fixed** — `html { font-size: 22px }` added as the one page-wide rem anchor (accepted blast radius on rem-sized chrome, verified by eyeballing); length-based line-heights converted to ratios: `p/li` `1.6rem → 1.6`, table children `2rem → 2`; grep confirmed no other length-based line-heights remain (`a.internal` 1.4 and code figure 1.6 were already ratios).
- **Body rhythm baseline** (review outcome) — `body { line-height: 1.6 }` added so containers without their own declaration (blockquotes, figcaptions) stop falling back to browser `normal`; `p/li/tbody` restate it explicitly.
- **Baked scale** — stock heading sizes replaced with the 1.125-ratio table verbatim (h1 2.027rem … h6 1.125rem, base 22px / ratio 1.125; comment links back to `__obsidian__/ideas/pond-insights.md`); deliberately not calc-derived — values get hand-tweaked by eye. The article-h1 2rem special case removed as subsumed by the scale.
- **Code sizing unified** (review outcome) — inline `code` at `0.85em` to match `pre > code`'s 0.85rem (pre sets no own font-size, both resolve against the 22px anchor; em keeps inline code proportional inside headings); duplicate `position: relative` in the code-figure rule dropped.
- **Reading measure** — `.center > article { max-width: 80ch; margin-inline: auto }`, article-scoped (grid track, `.center`, sidebars untouched), absolute with NO escape hatch per locked verdict; wide blocks (`pre`, `.table-container`, mermaid) verified to scroll internally inside the column.
- **`text-wrap: balance`** — merged into the shared heading rule (thead included, harmless no-op); body text keeps its existing `pretty`, not duplicated.
- **Popover fix** (review outcome) — `quartz/components/styles/popover.css`: dropped the `font-size: initial` / `line-height` resets entirely, so the popover (appended into `body` by the client script) inherits the 22px base + 1.6 rhythm instead of staying pinned at the browser's 16px default; correctness now depends on the popover always being a body descendant; `.popover h1` at 1.5rem remains an intentional non-scale value.
- **Verification** — rem-sized chrome eyeballed at the new anchor on test pages; wide-content scroll behavior confirmed on the code/tables page; `npm run check` / build green.
- **Open loop items (carry into step 05+)** — desktop grid center track (~850px) is narrower than 80ch at 22px base, so the measure only binds on wide/minimal frames — verify the active knob in devtools and tune the right one; checkbox/theme-toggle px sizes are proportionally smaller against 22px text — eyeball on the lists page; `balance` weighs a heading's SVG anchor link when breaking multi-line headings — one devtools glance; mobile anchor media-query (22px flat shipped) decided by living with a phone viewport.
