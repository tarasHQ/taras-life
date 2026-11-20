---
status: implemented
state: condensed
---

[← PLAN](../_plan_004.md)

## Outcome

Replaced the community Explorer with an internal build-time component using the Step 01 navigation model. It renders a single flat list with published destinations, source-based current-section highlighting, and only the selected local SVG definitions. Missing icon metadata defaults to `folder-closed`; invalid selections have no icon. Sidebar-free frames and explicitly cleared left slots do not render Explorer or sidebar controls.

The default frame keeps the complete desktop sidebar. At 800px and below, the title and Search/theme toolbar remain in a sticky top bar, while a floating button opens the separate, full-viewport navigation/widgets panel. Explicit left-region metadata keeps top controls outside the moving panel; ordinary widgets default to the panel and each widget renders once. The panel is non-modal, and Search retains its own behavior. The component README documents the icon choices and the accepted watch-mode stale-markup limitation.

## Refinements

- The panel and backdrop animate over 0.15 seconds after a mobile menu interaction; crossing from desktop to mobile does not intentionally animate the panel away. The user reported the menu animation worked after a hard reload cleared the cached resources.
- Closing Search from a scrolled mobile page caused an upward jump. Testing identified an interaction between Search returning focus to its button and the mobile scroll padding. A Search-button-specific scroll margin cancels that offset while retaining the general padding. The user confirmed the targeted rule removed the jump and the button remained usable, and subsequently reported the project change checked.

## Verification

- Before the later animation and Search refinements, the user reported `npm run check`, `npm test`, and `npm run build` green; command output was not supplied. Automated checks have not been reported again for the later changes.
- Generated homepage and 404 HTML were inspected: each had one Explorer list, matching icon definitions/references, one toggle, and the title/Search/theme widgets. The 404 Home link was `/`. A generated sidebar-free or explicitly cleared-left page was not inspected.
- The user reported the mobile button and menu work. The Search scroll-jump experiment and project change were checked as described above. No detailed outcomes were reported for the other Search smoke checks; automated checks and markup inspection do not establish browser behavior.

## Step 03 handoff

- Author the needed vault entry pages and icon selections, then verify the synced output.
- Review desktop/tablet layout and mobile sticky bar, full-viewport panel coverage, animation, blur, long-panel scrolling, safe areas and browser chrome. Exercise resize, navigation/back/forward, three themes, icons after repeated SPA navigation, missing entries, and 404 links.
- In a default frame with an explicitly cleared left slot, check mobile layout for gaps, implicit grid tracks, and horizontal overflow. Also verify sidebar-free frames do not render Explorer or controls.
- Check Search via its top-bar button and Ctrl/Cmd+K with the panel closed and open. Verify overlay stacking, Escape ordering and panel state, result navigation, and dismissal from a scrolled page without a jump; test on relevant phones/browsers. Do not treat the successful scroll-offset check as proof of the other interactions.
- Scroll-aware header behavior, the main-column header slot, calendar, and extra floating buttons remain deferred.
