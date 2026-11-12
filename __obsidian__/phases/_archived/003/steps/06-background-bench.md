---
status: implemented
state: condensed
---

[← PLAN](../_plan_003.md)

## Description
The background bench compared gradient and grain treatments on the live site. The user chose a scrolling gradient and discarded grain; losing experiment CSS was removed.

## Implementation Summary
- **Baseline and mechanism** — The solid background moved from `body` to `html` to avoid hiding the experimental layer behind an opaque body. The original fixed pseudo-element was replaced by a scrolling wash after the user's verdict; the containing-block and progress-bar interactions were checked during implementation.
- **Scrolling gradient** — `body::before` is absolutely positioned against `body` and fades from a lighter top to a darker bottom over one viewport height. The bottom color continues as the solid `html` background, with per-mode endpoints in `theme.css`; `--light` remains unchanged.
- **Grain and banding** — The experimental SVG `feTurbulence` grain layer and its variables were removed after the user judged grain more likely to cause issues than improvements. The user observed no banding; grain's specific effect on banding was not established.
- **Mobile navigation** — The user separately resolved transparent-header overlap with an opaque compact header and menu background matching the solid page color.
- **Verification and open follow-up** — The user is satisfied with the background and reports `npm run check` green. Print CSS hides the wash and restores `--light`, but print behavior was not confirmed; the assistant did not run `npm test`.
- **Code review** — No step-specific review result was recorded at condensation; account for any subsequent review findings.

---
	