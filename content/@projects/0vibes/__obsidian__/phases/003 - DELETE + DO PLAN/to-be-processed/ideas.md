Minimap
\- Scroll to node. If you click on parent branch - should it select it as well or only move to it? I think that moving-only is better, and to select one must click on grayed out inactive elements?

==HUGE ONE==. Since we abandon scroll - I should think about adopting cm6 editor for rendering read-only blocks.
\- Compare to streamdown features. See if one can do them as well. Since we don't need scroll - I don't need to have like lighter rendering blocks. But see for yourself. Test performance. Compare.
\- Like that's the issue Obsidian has. And in your case it'll be completely fixed because you won't have like 10 such huge blocks at the same time. But test for that. Like for 10-20 such blocks. To see if it's safe on edge cases as well. Performance must be high. Ram usage low.
\- `editing` - major feature is ability to utilize CM6 for editing on-site.
\- But then it's only if you want to edit in the block. If you want to reuse input box - then it's not really a major feature.
\- https://codemirror.net/examples/readonly/
\- another scroll feature
\- use kinda like rectangle scrollbar over those nodes on side, to show current location BUT also to enable smooth ease out scrolling. So like on mouse we can scroll much more smoothly instead of jaggy unsmoothed input.

- Streamdown
  - With all those features it feels to me now as unnecessary heavy.
    - Compare package size
  - I forgot about using CM6 - only. But in case you won't - this might be useful. Maybe react-markdown would be better.
- Content sticky headings.
  - If we do CM6 for editing/reading - than maybe it'll be worth it to integrate as single "module" in there? Would be so cool.
    - But must consider phones, where input area is pretty limited (probably should disable this feature)
    - Also hide it if editor isn't scrollable, to not waste any space
  - Get inspired by vscode's approach.

---

## Brainstorm

codemirror - individual per each tab
input block - make as compact as possible
alt + hover - poe2 like tooltip system with descriptions on each element
tools - maybe remove collapsing stuff and use modals (collapsing is inconvenient, you lose your navigation in the task)

move to streamdown for partial markdown rendering + shiki
buttons with hidden actions must have distinct style uniformiti from the other buttons without any hidden actions (like swipe, RMB, MMB, mouse wheel side clicks)
