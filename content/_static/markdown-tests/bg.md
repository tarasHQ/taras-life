---
publish: true
title: Background Sandbox
created: 2026-11-05T15:18:59.601Z
modified: 2026-11-05T15:19:16.400Z
published: 2026-11-05T15:19:16.400Z
id: md-tests-bg
---

# Background Sandbox

Sparse and tall on purpose — minimal chrome, maximum background area. Gradient and grain experiments are judged here; the tall-empty shape is what makes gradient banding observable. Back to the [index](./index.md).

---

A single sentence, alone in a large empty region.

---

Another single sentence, one viewport further down. Scroll slowly here — banding shows up in the transitions, not in any single frame.

---

A short paragraph in the middle distance. The background behind it should hold one continuous tone; any seam between the content column and the page edges is a failure.

---

More empty space follows. The fixed pseudo-element mechanism under test keeps the backdrop steady while content scrolls over it — this section exists to confirm that steadiness at speed.

---

A line with ==a highlight==, **bold**, and `inline code`, so text treatments can be judged against the background rather than against plain white or black.

---

Approaching the bottom. If a gradient exists, its terminal state should still carry enough contrast for this sentence to read comfortably.

---

End of the page. Whatever experiments were last enabled here, the verdict gets recorded and the losers deleted — this page stays as the empty canvas.
