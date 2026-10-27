# MINIMAP

- Feels like should be purely additive thing, not like as chat dependency. So I’ll delay it.
  - RMB on any node on minimap, for additional functionality. (to like isolate branch or delete branch, etc.)
  - after many reflections - minimap will be message-responses block based. It’ll be a single node.
    - But then how to visualize branching? Simple, we just move lines from the same node. We don’t need like high details here.
  - Here’s one question though. Should we show whole map? Like we can have a branch, and then single nodes as portals to another branch.
    - I think that yes. Because that way we can not only select specific branch, but also auto scroll to selected node. And also we can see whole task structure.
    - Also we can hardcode zoom step, to avoid lots of scrolling
  - Also we should think about whether we need minimap as popup window VS on-hover. On phones popup is nicer
    - On PC hover is better UX. Though not sure. Maybe we can do both. On hover shows like top 1/4 of the chat view, while button opens it as popup
- for minimaps/sidenodes - bookmarking also.
  - Either through node OR by ability to bookmark-highlight/response and it'll visualize as node has a bookmark.
- Feature. Maybe `track navigation`? Like we open minimap, and have there forward/backward buttons to be able quickly move between visited branches.
- Feature. `Minimap as branch manager`, like rmb on branch's node to delete branch. Or we can `isolate` branch, so we detach it from parent and place in parallel with a separate context from the parent. Also RMB for bookmarking branch or nodes.
- Feature. `Node state visualization`, like if node ends on error - red node. If on success - blue/green one. Tools may be blue... Also node itself may contain number of requests, for example OR, probably better, be just 2-3 digit ID or 2-3 digit number
- Issue. If we branch from the same turn block - how to visualize? Answer - lines from the same node. We don't need like granularity to have sub-nodes or something. If we have branch from user message and llm response in the same block - then two lines go out from the same point.

# CHAT CONTENTS

- For markdown we can render outline on the top in special very compact block or something.
- Collapsible headers/lists?
- Editable/removable contents?
- User comments right in the response block?
  - Oh, that would be huge. Like you can highlight thing and write brief comment. That way LLM knows what you’re talking about. And you see your comments on LLM’s response. Nice.
- Attachments.

# TOOLS

- Renderers/functionality - defered. it’s too complex for this. It needs separate phase of planning/implementation.

\--- ABOVE SHOULD BE SEPARATE ---
\--- ABOVE SHOULD BE SEPARATE ---
\--- ABOVE SHOULD BE SEPARATE ---
\--- ABOVE SHOULD BE SEPARATE ---
\--- ABOVE SHOULD BE SEPARATE ---

## Turn-based layout

- `DESCRIPTION`: Flat and basic structure doesn't make sense. Conversation happens in turns. So turn-base layout should help with navigation (scroll), virtualization (easier since we can avoid calculating whole branch sizes/view position), and readability, since it'll be distinctly separated from other blocks.
  - Issue. With deleting stuff. Like if we have a block in the middle and delete user message from it. Or last LLM response (no-tools, meaning it's true logical response) Then we need to kinda animate merging with other blocks to keep this stuff deterministic and explicit to user about what is happened. Animation like will obviously tell user that we merged current block with next/previous one. So from now consider it as a single block. If on removal things just suddenly jump - it may be confusing.
  - Issue. If we delete user message - I guess we merge with top block if any. If there's 2 user message right after another - we still keep them in a single block. Only no tools proper response can finalize block. Though even then it's not clear because we may have tool to mark task completed, so logical "last response" can be a tool-like. But that's long term and we can adjust to that. Also errors/canceled requests doesn't break block either.

## Scroll - tightly linked with Turn-based layout

- `DESCRIPTION`: We avoid having flat scroll for the whole chat. Instead we do 2 navigation types. Usual scroll/swipe withing the turn block, with ability to push through sticky boundaries into another block (or without stickiness). And second is like vertical node map of the branch. Where each node represents turn-based block.
- Additional help with scroll through long messages can come from collapsing user messages by default. Collapsing LLM responses (whole/contents). Some menu/bar/geasture somewhere to like collapse everything besides user messages for the whole task (with ability to expand all as well).
- Feature. Scroll while hovering turn map on the side to easily scroll between turns instead of targeting cursor on specific node.
- Feature. Turn map can have 2 colors to represent nodes in view vs nodes not in view.

## Layout of responses/user messages

- User message aligned towards the right. Collapsed to like 5-6 lines by default. Expandable. Width in collapsed state no more than 50%-70%. Maybe it'll be worth to have like 80-90% in expanded state for long messages
  - How to collapse/expand? Either button on the left side of the message. Or some are with guide line within the message.
- LLM response - full width. Also collapsible, but it'll be different logic.

## Branching

- Brunching must be easy, from any point. Current idea is to have on the right side a button that moves with Y of the cursor. Then it's easy to like read very long response, and instead of scrolling up/down, one can just point at that button, and either menu pops up, or maybe single button expands into multiple ones. Though we need to figure out that for touch usage, especially on phones, since horizontal space is at premium there, and we can't allow so easily to just eat space on left/ride side of the view. Also can be approached through completely different logic, to just touch and hold on the message/response (though I don't prefer that really.)
- Branching can be done from either task or LLM response.
- Also editing user message should give us options on completion to either edit in current branch (if it's in history - remove further entities and then send edited message) or in a new branch.
- Branching navigation should be fast on PC. I don't know yet how, but one must be able to like have 20 branches, 17 old ones, and 3 new ones, and to be able to like switch between them with little to no friction. Hotkeys maybe. Or buttons.

## UI

- Issue is that it must be usable from phone screens to 4k TVs.  Or even in other cases, like on PC I can open two tasks side by side, and they should be readable. So we need horizontal density. And also I can open tasks one on top of another - so we need vertical density.
- Layout of side buttons is fine on PC, but problematic on phones. So we need to think it through. Check competition maybe. I think that it would be nice to maybe have something transparent? utilize also gestures (like on phones, using 1/3 left side of the screen to swipe - swipes between turn blocks, while 2/3 of center + right can be used for usual "scroll", that way we can avoid adding turns minimap on the sides.)
- \[BIG\_ISSUE]
- \[BIG\_ISSUE] you have 2x2 tabs layout. How side/bottom menu will work? Like is it per tab? Or per whole window? If per window - then how to link it to specific tab? Use last selected/active focused? Or like what?
- \[BIG\_ISSUE]

# Input Block & Control Block

- Separate components. Per-branch state.
- Control block includes selectors for config-model, mode, etc(in future).
  - Preferable to be always visible, so it's always explicit which config/mode is used in branch.
- Input block is text editor.
  - Would be good if it's hideable/collapsible. Also important to be able to open it full size in a new tab.
  - Adjustable height for in-tab position.
  - In tab view should be kinda "smart" about its presence. like if input box is empty - we don't need to see empty text editor eating away precious space. Maybe we need button to show/hide it. Or gesture. Or something.

## Issues

- message-response block
- What if we'll have one message right after another one?
- Or like a message, then request that was cancelled half-way, and then another message. Logically they belong in same "logical block".
  - I think we should compile such blocks based on pair of msg-response. If we have msg-msg, or msg-failed response-msg - then those count as single block still.
