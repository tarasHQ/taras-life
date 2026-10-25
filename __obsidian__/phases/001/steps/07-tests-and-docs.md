---
status: waiting
state: high-level
reviewedAtStep: "01"
---

[← PLAN](../_plan_001.md)

## Description
Makes the rewrite defensible long-term: tests that fail when a locked decision regresses, a plugin README that is the single source of truth, and removal of the stale planning artifacts the README replaces.

## High-Level

### Intended outcome
- Tests cover the decisions that would otherwise rot silently: no-container no-op, single-instance lifecycle, viewport gating, thread-URL construction, id validation, options validation, container markup.
- Tests are authored fresh against the new contract rather than migrated mechanically from the old suite. Source-level unit tests may use the existing TypeScript runner, but package-loading/render smoke tests also exercise the compiled exports that Quartz actually loads. Verify the generated-output consistency gate from step 02 so passing tests cannot conceal stale committed `dist/`.
- A plugin README that answers, without reading code: what this is, the frontmatter contract, the option table, the loading behaviour, how and when to build the plugin and commit `dist/`, why ordinary site generation only consumes built output, how to verify locally, how to upgrade Remark42 (re-capture the fixture), and how to roll back. Include verified Workers Builds requirements/settings carried from step 02; step 01 was superseded and supplies no verification evidence.
- Stale artifacts removed where present: `custom-plugins/remark42-old/` in full (only after the new plugin is verified), `PLAN.md`, `REMARK42.md`, the shell test note.
- Other documentation describing the old arrangement is corrected where present; add concise navigation from the root README if needed rather than assuming build/deployment sections already exist. Verify the `.prettierignore` treatment keeps the captured fixture byte-identical and generated `dist/` is not independently reformatted.
- `AGENTS.md` matches reality: `id` as the comment key, explicit plugin compilation with committed `dist/` consumed by site builds, and the scope freeze.

### Local invariants
- Tests never touch the network. Source-level tests may run directly, but compiled-package smoke tests use freshly built output; testing and consistency-checking may compile the plugin even though ordinary site generation does not.
- Keep manual live-fixture comparisons separate from automated tests. Use the runtime findings from step 06 to review or refresh the fixture deliberately, retain capture provenance, and document recapture on Remark42 upgrades. An optional network baseline is not a test prerequisite.
- They run under the repo's existing runner, so "green" means the same thing everywhere.
- Documenting Remark42 is a link, not a copy — the vendored docs stay the reference.

### Should NOT be done in this step
- Visual polish (step 08).
- Any new behaviour or feature.
- Re-deciding anything already locked in the plan.

## Discussion & Reflections

1. **Test file shape.** The old suite is deleted with the plugin rather than migrated, so this is a fresh choice.
   - (a) Test only built output — exercises distribution, but makes focused source tests less convenient.
   - (b) Use `.ts` source-level unit tests under the existing runner, plus compiled-package smoke tests for exports and component rendering.
   - (c) Test only source — convenient, but misses packaging and stale-output failures.
   - **Recommend (b)**, with an explicit prerequisite build for compiled-package tests and a separate consistency gate for committed output.

2. **Is the plugin suite part of root `npm test`?**
   - (a) Stays separate via `npm --prefix … test`.
   - (b) Included in root `test`, so the repo's green means the plugin is green.
   - (c) CI-only.
   - **Recommend (b)** — otherwise a broken plugin is "green".

3. **What happens to the old planning artifacts.**
   - (a) Delete `PLAN.md` and `REMARK42.md` now — their own header says they are safe to delete once this plan is executed.
   - (b) Move them into `artifacts/` and delete at phase close.
   - (c) Keep them.
   - **Recommend (a).**

4. **How far the `AGENTS.md` update goes.**
   - (a) Only the Remark42 section.
   - (b) Remark42 section plus the explicit-build/committed-output packaging boundary.
   - (c) Leave `AGENTS.md` alone.
   - **Recommend (b)** — both are architectural invariants now, and section 99 exists precisely to prevent drift.

_Reflection:_ (optional — compact notes from the user)
