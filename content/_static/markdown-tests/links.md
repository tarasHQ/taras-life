---
publish: true
title: Callouts & Links
created: 2026-11-05T15:18:59.454Z
modified: 2026-11-05T15:19:15.633Z
published: 2026-11-05T15:19:15.633Z
id: md-tests-links
---

# Callouts & Links

The full callout matrix and every link variant the link-rework decision must cover. Back to the [index](./index.md).

## Callouts

> [!note]
> A plain note callout — the neutral default.

> [!abstract]
> An abstract callout, often used for summaries.

> [!info]
> An info callout.

> [!todo]
> A todo callout.

> [!tip]
> A tip callout, with `inline code` and **bold** inside to check inner styling.

> [!success]
> A success callout.

> [!question]
> A question callout — does the phrasing inside still read?

> [!warning]
> A warning callout, the first tier of urgency.

> [!danger]
> A danger callout, the loudest tier — its accent must stay readable in dark-low.

> [!bug]
> A bug callout.

> [!example]
> An example callout, with a list inside:
>
> - First example item
> - Second example item

> [!quote]
> A quote callout — a quotation with attribution styling potential.

### Foldable and nested

> [!warning]- Collapsed by default
> Folded callouts start closed; the header must invite the click.

> [!tip]+ Expanded by default
> Foldable but open, so the body is visible on load.

> [!info] Nested callouts
>
> > [!warning]
> > A warning inside an info — nesting must not blur the tiers.

## Links

Internal, relative, between test pages: [type specimen](./type.md) · [lists](./lists.md) · [code](./code.md) · [background sandbox](./bg.md) · [index](./index.md).

Wikilinks, which resolve against the whole content tree:

- To a test page: [[code|the code page]]
- To a real note: [[how-much-time-should-i-work|a real long note]]

External links, bare and titled:

- Bare autolink: https://github.com
- Titled: [Quartz documentation](https://quartz.jzhao.xyz/)
- With title attribute hover text: [Remark42](https://remark42.com/ "self-hosted comment engine")

Broken links, rendered as plain text without a destination — both forms must fail gracefully:

- Broken relative: [this page does not exist](./no-such-page.md)
- Broken wikilink: [[no-such-note-anywhere]]

Tags, inline: #visual-test #markdown — these exercise tag rendering and tag-link styling.

## Anchors and references

A heading to anchor to: [the callouts section](#Callouts) — heading anchors are part of the link matrix.

A footnote-style reference[^ref] from a previous page's pattern, local to this page.

[^ref]: Anchor and footnote targets must both survive the accent pass.
