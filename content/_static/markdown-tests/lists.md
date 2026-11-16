---
publish: true
title: Lists & Indentation
created: 2026-11-05T15:18:59.037Z
modified: 2026-11-05T15:19:14.904Z
published: 2026-11-05T15:19:14.904Z
id: md-tests-lists
---

# Lists & Indentation

Ordered, unordered, task lists, and the deep indentation this site's real notes rely on. Back to the [index](./index.md).

## Unordered

- Top level item
  - Second level
    - Third level
      - Fourth level
        - Fifth level — the deepest nesting that must stay visually distinct
- Sibling of the top level, to check the return to shallow depth
- An item with `inline code` and **bold** mixed in
- An item with a [relative link](./type.md)

## Ordered

1. First step
   1. A sub-step of the first
      1. Deeper still
   2. Another sub-step
2. Second step
3. Third step, with a paragraph of body text under the marker to check how wrapped lines align with the number:
   This continuation line belongs to the third item and must align with the item's text, not dangle under the marker.

## Task lists

- [x] A completed task
- [ ] An open task
  - [x] A nested completed subtask
  - [ ] A nested open subtask
- [ ] A task with ==highlighted== emphasis on the important word

## Heavy indentation

The dense nesting style the site's real notes use — long time-stamped outlines with sub-bullets several levels deep. If the reading measure or indentation shrinks too aggressively, this is where text turns into a sliver.

- ###### 00:50
  - A thought at the first indent level, wrapped enough times to prove wrapping aligns under the bullet and not under the timestamp heading.
  - A second thought, with a nested reflection inside it:
    - The nested reflection, one level deeper, still legible.
- ###### 23:06
  - Short thought.
- ###### 21:01
  - A long thought that keeps going: when the indented column gets narrow, wrapped lines must not collapse into a vertical ribbon of two-word lines. This is the exact failure mode the 80ch measure exists to prevent, and this block is its stress test.
  - Another bullet at the same level, to compare rhythm between a long and a short entry.

## Structure soup

Deliberately awkward combinations that must not break layout:

- A list item containing a blockquote:
  > The quote inside the list, indented to the item's content.
- A list item containing a code block:
  ```css
  .nested-code-in-list { color: inherit; }
  ```
- A list item containing a nested list with a task list inside:
  - Nested level
    - [x] Task inside nested list
    - [ ] Another one
