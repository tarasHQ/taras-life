# Phase 004 Step 01 — Review exploration

- Title provenance
  - Where can the configured legacy transformer’s authored-versus-fallback distinction be preserved without modifying the installed package?
  - How do its YAML parser, text transforms, normalization, and worker execution constrain that mechanism?
  - What would a focused integration test need to demonstrate?
- Component data
  - How do real source-relative paths, actual published slugs, and arbitrary icon metadata reach `allFiles`?
  - What do generated paths imply for the agreed convention-only discovery boundary?
- Model contract
  - What must Step 01 specify for Home, label sorting, icon selection, and malformed or absent metadata to support Step 02?
  - Is the planned contract sufficient for section highlighting without introducing rendering logic?
- Scope and sequencing
  - Does title handling preserve existing unrelated frontmatter behavior and leave the community Explorer functional?
  - Does the test scope cover meaningful behavior without building speculative infrastructure?
  - Are watch invalidation and validation systems excluded consistently?
- Documentation
  - Which document statements conflict with current code or later locked decisions, and which are merely historical?

## Provisional review possibilities

### \[IMPLEMENTABILITY] Specify a feasible provenance integration seam

**Description:** The step requires provenance but leaves the parser integration mechanism open despite the installed plugin discarding it. It is worth investigating whether an existing interception point avoids a second independently maintained YAML parser.
**How To Do This:** Trace the installed transformer and project loader for a local, worker-safe pre-fallback capture; document a viable seam if justified.
**Benefit:** A concrete starting point could make the step more self-contained while retaining the existing transformer’s behavior.
**Complexity:** Depends on the available parsing interfaces and whether additional dependencies or local registration are necessary.
**Closed Advantageous Doors:**

- Prescribing one mechanism too strongly could exclude a simpler verified alternative.
  **Description In Simpler Terms:** Decide where to retain the missing bit of information before it disappears, without rebuilding the entire frontmatter pipeline.

### \[CORRECTNESS] Preserve icon absence separately from unusable selections

**Description:** The renderer has different behavior for absent and unusable icon selections, so collapsing them into one optional string may lose needed information.
**How To Do This:** Verify the actual parsed metadata for missing and explicit invalid values, and specify the smallest model contract that preserves the distinction.
**Benefit:** The later renderer can apply the agreed default-versus-no-icon behavior without changing inclusion rules.
**Complexity:** Potentially small, depending on frontmatter data representation.
**Closed Advantageous Doors:**

- A tightly specified model representation could unnecessarily constrain the renderer.
  **Description In Simpler Terms:** The later menu must know whether no icon was requested or an invalid one was requested.

### \[BOUNDARY] Make current-section inputs explicit

**Description:** Step 02 must highlight the current top-level section even on deeper pages, which may require information beyond the selected entry's label and slug.
**How To Do This:** Trace the current page data and retained entry paths; specify any missing model input only if the existing contract cannot support it.
**Benefit:** Ensures a clean handoff without prematurely implementing active-state UI.
**Complexity:** Likely small if current `fileData` and retained source paths suffice.
**Closed Advantageous Doors:**

- Moving active-state calculations into Step 01 could entangle the model with rendering.
  **Description In Simpler Terms:** Check that the later menu has enough information to know which section the reader is in.

### \[TESTS] Specify realistic configured-transformer integration

**Description:** The plan asks for real transformer-path testing, which can accidentally become a test of invented fixture data or require unnecessary full-site builds.
**How To Do This:** Identify the smallest real parsing sequence covering title provenance and metadata while retaining targeted pure model tests.
**Benefit:** Verifies the actual bug-prone boundary without broad speculative test machinery.
**Complexity:** Depends on how easily the configured plugin and processor are instantiated in tests.
**Closed Advantageous Doors:**

- A narrow harness might miss unrelated full-build configuration drift unless it uses the actual configuration.
  **Description In Simpler Terms:** Test the real title-processing handoff, not just a made-up result, while keeping tests small.

### \[MODEL CONTRACT] Clarify homepage discovery and missing homepage behavior

**Description:** The step says to discover `index.md` and place Home last, but does not explicitly say what happens if the page is absent or filtered.
**How To Do This:** Verify the actual project content and pipeline; if a gap matters, specify behavior that does not invent a navigation-validation system.
**Benefit:** Avoids assuming a URL exists when it does not, and helps the model stay tied to published page data.
**Complexity:** Small if absence simply leaves Home out; product expectations may need discussion.
**Closed Advantageous Doors:**

- Explicitly allowing a missing homepage could mask an authoring error if the product requires one.
  **Description In Simpler Terms:** Decide whether to show Home if Quartz has no actual homepage to link to.

### \[MINOR ISSUES] Documentation and module alignment

**Description:** Some source paths, local README conventions, and historic open-question text may need clarification, but only where they affect implementation.
**How To Do This:** Verify references and distinguish superseded notes from durable decisions; keep any documentation fix narrowly scoped.
**Benefit:** Reduces confusion without copying step-level details into the high-level phase plan.
**Complexity:** Low.
**Closed Advantageous Doors:**

- Updating historical notes unnecessarily could obscure their original context.
  **Description In Simpler Terms:** Fix misleading breadcrumbs, not every old note.
