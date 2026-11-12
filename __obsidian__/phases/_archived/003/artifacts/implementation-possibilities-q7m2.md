---
ctime: 2026-11-05
%%Temporary scratchpad for the initial-planning flow of phase 003. Deleted/integrated when the flow completes.%%
---

# Implementation possibilities — phase 003 (initial planning)

%%Scope note: decisions locked in the refinement pass (Route A, 80ch, token naming, OG contract, rejections) are NOT re-brainstormed here. Open surface only: plan framing, step shaping, and the visual-test folder design block. Format for B1: nested questions/points, no answers.%%

## A. Plan framing (title / goals / visions)

- What is this phase really about, in one sentence?
	- "Everything registered before reading a word" — but is the goal *identity* or *comfort*?
- Title candidates (working title currently "Visual Identity" in `_project.md`):
	- Visual Identity / First Impression / Pre-Reading Layer / Look & Feel Foundations / Visual Groundwork
	- Does the title need to cover the favicon (last step) or only the "look"?
- What are completion goals that are *verifiable* rather than vibes?
	- Is "looks good to me" a goal or a vision?
	- Should goals map 1:1 onto steps, or be outcome-level (e.g. "a visitor's first 5 seconds are pleasant in all 3 modes")?
	- Should "visual test pages exist and are used for every decision" be a goal itself (it's the iteration infrastructure)?
- Visions:
	- Success pull: opening the live site and feeling "this is *mine*"; future phases inherit a visual base instead of fighting one.
	- Failure push: the site still looks like stock Quartz; every later phase bakes genericness deeper.
	- Any sharper/failure-specific vision? (e.g. "a year from now I still haven't replaced the toggle because it's good")

## B. Steps shaping

- Granularity: reflection sketched 5 steps, refinement added a step 0-ish (iteration infra). Is the phase 5, 6, or 7 steps?
	- Merge background bench into palette step (fewer steps, faster momentum) or keep separate (it's a distinct decision: keep-vs-drop)?
- Order questions:
	- Test pages *before* palette work (locked direction: infrastructure first) — how strict? Palette value tweaking could even precede test pages for instant momentum?
	- Favicon strictly last (locked) — but its cheap extensions (theme-color meta, SVG favicon, dead-plugin drop) were merged into it; does that make it bigger than "last small step"?
- Which items need their own planning blocks during step-writing (per locked decisions)?
	- visual-test folder (locked: yes, dedicated block)
	- toggle placement (brief explore of Flex assembly vs sidebar JSX during step-writing)
	- remark42 normalization side (normalize at dispatch vs widen guard — decide in step-writing)
- Does the ramp *live-iteration loop* belong to the palette step, or is it a meta-loop spanning several steps (typography, accents, background all iterate on the same pages)?
- Do the two latent typography bug fixes (base font-size anchor, `line-height: 1.6rem`) get their own sub-checklist inside the typography step?
- Which step owns `index.d.ts` union update and the favicon-plugin-drop decision — toggle step, favicon step, or spread?

## C. Visual-test folder design (dedicated planning block)

- Placement & naming
	- `content/` root vs a prefixed folder (`content/@dev/visual-tests/`? `content/_sandbox/`?)
	- Does the `@`-prefix convention (used by `@journal`) matter to build/explorer behavior?
	- Does an underscore-prefix mean anything to Quartz/obsidian (draft-style conventions)?
- Visibility on the live site
	- Should test pages be excluded from: page build, explorer, search index, sitemap, OG images, RSS (if any)?
	- Contradiction to resolve: if excluded from the *build*, they can't be previewed via the serve loop (serve renders built output) → visual iteration dies. So exclusion from *build* may be wrong; exclusion from *navigation/discovery* may be right?
	- Is "visible if you know the URL, unlisted everywhere else" acceptable? Or partial exclusion (explorer only)?
	- Risk if NOT excluded: ships to production, violates the "no 404s / no unfinished pages" rule from Capture.md; also pollutes search.
- Editing workflow
	- Quartz Syncer syncs vault → `content/`: do test pages need to live *in the vault* to be comfortably edited in Obsidian? Which folders does the syncer touch?
	- If they live in `content/` only: user edits in an IDE, loses Obsidian preview/callout rendering. Acceptable trade-off?
	- Could a junction/shortcut make them live in both without duplication?
- Page inventory (candidates — granularity decisions pending)
	- Lists ×3 types (bulleted / numbered / checklist) — one page or three?
	- Indentations & nesting depth (heavy indentation is why 80ch was chosen)
	- Headings in vs out of lists
	- Codeblocks: shiki themed blocks, inline code, very long lines (overflow behavior)
	- Mermaid (needs theming check — does it follow the theme attribute at all?)
	- Callouts (all Obsidian types; folded? nested?)
	- Tables: simple + wide (tests the 80ch wide-content escape hatch)
	- Links: internal / external / broken / tag — also the accent step's subject; shared page?
	- Type specimen page (h1…h6 / p / small scale demo) — is this the typography step's main test page?
	- Background/gradient/grain test page
	- Selection styling (could fold into another page)
- One page per concern vs grouped pages? How many pages is too many to keep updated?
- File naming convention; is an index page inside the folder worth it if the folder is unlisted?
- Fate of existing test pages (`markdown-test.md`, journal entry, how-much-time note): keep as-is, delete, or fold into the new folder?
- Do test pages need frontmatter (ids? comments: false? draft markers?) to behave well?

## D. Palette / 3-mode step internal order

- Momentum path: tweak existing palette values first (~30 min visible win), then 3-mode component — or component first so every tweak is immediately testable in 3 modes?
- One commit per mode addition vs one big swap (delete darkmode dep + add component + ramp in a single change)?
- What is the *end condition* of the live-tweak loop (it's open-ended by design — when is it "good enough to move on")?
- Is dark-low derived systematically from the dark ramp (locked direction) — does that imply defining the ramp as values + a derivation rule in a comment?

## E. Distilled possibilities list (B2)

%%Points below are the most (reasonable, high-level, radical, architectural) possibilities distilled from sections A–D above. Numbered for the user's response template.%%

1. **[BETTER LONG-TERM] Plan framing = "First Impression", goals verifiable-per-step.**
	- Description: Title the plan around its organizing principle ("First Impression" / "Visual Groundwork") rather than the generic "Visual Identity", and phrase completion goals as per-step verifiable outcomes rather than vibe statements.
	- How To Do This: Fill the plan's Goals section with one goal per planned step (palette+modes, typography, accents, background, favicon, iteration infra), each with a concrete "done" signal; keep "feels mine" in the Visions block instead.
	- Benefit: prevents the plan from drifting into endless aesthetic polish (the known failure mode of visual phases); every step has an exit condition; success/failure visions keep emotional pull without fuzzy goals.
	- Complexity: pure planning, no code; ~an hour of thought.
	- Closed Advantageous Doors: locks step inventory early — merging/splitting steps later means re-editing goals (minor, manageable).
	- Description In Simpler Terms: make each goal something you can objectively point at and say "yes, done", so the phase can actually end instead of dragging on.

2. **[STREAMLINED STRUCTURE] Iteration infrastructure as step 01, palette+modes as step 02, keep bench separate.**
	- Description: Adopt the 6-step inventory: (01) visual-test folder, (02) palette + 3-mode toggle, (03) typography, (04) accents, (05) background bench, (06) favicon — background stays its own step because keep-vs-drop is a real decision, while palette+modes stay merged (they're one coherent change).
	- How To Do This: Shape the drafted steps recommendation accordingly; order strictly by dependency: test pages before anything visual is judged on them.
	- Benefit: matches the locked "infrastructure first" decision; keeps momentum (each step ends with something visible); background experiments stay isolated so dropping them costs nothing.
	- Complexity: no extra work vs alternatives — it's a grouping decision only.
	- Closed Advantageous Doors: fixing palette values *before* building the 3-mode component (the fast-momentum alternative) becomes awkward — the tweak loop would run in binary mode first.
	- Description In Simpler Terms: six small steps in strict order; the step that makes pages to look at comes first, the toggle+colors step comes second, experiments that might be thrown away sit alone near the end.

3. **[BLIND SPOT / EDGE CASE] Visual-test folder lives in `content/` but is discovery-excluded, not build-excluded.**
	- Description: The test pages must ship in the build (otherwise the serve loop can't render them and visual iteration dies) but must be excluded from discovery surfaces: explorer, search index, and (if cheap) sitemap/RSS.
	- How To Do This: Explore the explorer/search plugin config surface during step-writing (both are config-driven plugins); possibly a frontmatter flag or config filter; verify with a quick local build that pages remain reachable by direct URL.
	- Benefit: resolves the core contradiction of the test-folder design (must be buildable yet shouldn't pollute the public site); a known-URL preview folder is a permanent QA asset for all future visual work.
	- Complexity: low-to-medium; likely config-only, but search-index exclusion needs verification (may require a small transformer/filter if the search plugin lacks config).
	- Closed Advantageous Doors: putting tests in a non-content folder (e.g. `__obsidian__`) would close the door on editing them with Obsidian preview (callouts/mermaid render correctly there) — that's the door being deliberately kept open by this choice.
	- Description In Simpler Terms: the test pages must actually build so you can look at them locally, but hide them from the navigation and search so a random visitor never stumbles onto them.

4. **[AVOID UNNECESSARY FILES] Consolidate test pages into ~4–5 pages by concern, not 10+ micro-pages.**
	- Description: Group the test inventory into a small set of pages with clear ownership per step: (a) typography specimen (scale, headings in/out of lists), (b) lists & indentation (3 list types + nesting), (c) code & diagrams (codeblocks, mermaid, tables incl. wide overflow), (d) callouts & links (all callout types, link variants), (e) background/sandbox (gradient/grain experiments, selection).
	- How To Do This: One folder, one index page linking the set; each page owned by the step that judges it; existing pages (`markdown-test.md`, journal entry, how-much-time note) remain as *real-content* iteration anchors alongside, unmodified.
	- Benefit: keeps the folder maintainable (10+ micro-pages rot fast), gives each step a canonical "the page I iterate on", and preserves real-page checks (locked: iterate on real pages too, not just synthetic ones).
	- Complexity: pure content authoring; trivial.
	- Closed Advantageous Doors: none significant; micro-page granularity could later be split out of grouped pages if ever needed.
	- Description In Simpler Terms: a handful of well-organized demo pages, each with a clear job, instead of a pile of tiny ones nobody updates.

5. **[HIGH-REWARD PREEMPTIVE] Park a "test pages hygiene" invariant in the plan's Persistent Storage.**
	- Description: Record in the plan that test pages: carry `comments: false` (and no `id`), are not linked from any real page, and get updated (not bypassed) when a step changes visual behavior — otherwise they silently rot and lose their QA value.
	- How To Do This: A few bullets in the plan's Persistent Storage section + enforcement note in the relevant steps.
	- Benefit: the folder stays trustworthy for the whole phase (and future ones); avoids the remark42 identity trap (a test page with an `id` but no real thread would ship a dead comment widget).
	- Complexity: trivial; just documentation discipline.
	- Closed Advantageous Doors: none.
	- Description In Simpler Terms: write down the rules for the test pages so future-you (and the LLM) don't accidentally break or forget them.

6. **[MISSED BLIND SPOT] Decide the favicon plugin's fate explicitly in step 02, not step 06.**
	- Description: The candidate drop of `@quartz-community/favicon` (dead generated `favicon.ico`, unreferenced by `Head.tsx`) should be pulled forward into the toggle step, because that step already edits `quartz.config.yaml` (deleting the darkmode entry) — batching the two config removals avoids touching plugin config twice.
	- How To Do This: Add to step 02: delete `@quartz-community/darkmode` AND `@quartz-community/favicon` entries in one edit; verify build + no orphan references.
	- Benefit: one config-touch instead of two; the favicon step then stays small and pure (design + assets + meta).
	- Complexity: trivial — the plugin is already validated as unreferenced.
	- Closed Advantageous Doors: none; if the drop somehow proves wrong, re-adding a config entry is a one-liner.
	- Description In Simpler Terms: since step 02 already opens the plugin config to remove the old dark mode, remove the useless favicon plugin right there instead of coming back later.

7. **[RADICAL-ish] Own the whole theme contract in one file, not spread.**
	- Description: Consider concentrating the 3-mode contract (attribute name, storage key, cycle order, `themechange` details, OS-seed semantics, zero-flash inline init) in one module (e.g. `quartz/components/ThemeToggle.tsx` + a tiny colocated constants module) so remark42 and Head.tsx both import from it rather than re-declaring strings.
	- How To Do This: Toggle component exports constants + a `dispatchThemeChange()` helper (which normalizes dark-low→"dark" for the widget-facing event, resolving the remark42 guard question in favor of normalizing at the dispatch side); `Head.tsx` inline script inlines the same constants via a build-time import or a documented copy-with-checklist.
	- Benefit: the contract has exactly one SSOT; the remark42 normalization decision lands in one obvious place; future modes (if ever) are a one-place change.
	- Complexity: moderate — the Head.tsx inlining needs either an esbuild feature or a documented "keep in sync" comment; explore which during step-writing.
	- Closed Advantageous Doors: widens the remark42 guard instead (the alternative) would couple remark42 plugin code to a 3rd mode forever — closing the door to later renaming/replacing modes cleanly.
	- Description In Simpler Terms: put all theme-related rules and names in one place that everything reads from, so nothing drifts apart.

8. **[REDUCED LINES] Make dark-low a *derivation*, not a hand-tuned third ramp.**
	- Description: Instead of authoring a third full `:root[saved-theme="dark-low"]` block by hand-tweaking ~20 values, define dark-low's override block as a minimal diff over the dark block (background lifted, contrast softened) — only the vars that actually differ.
	- How To Do This: In `theme.css`, the dark-low block overrides only `--light`, `--lightgray`, `--gray`, `--darkgray`, `--dark` (the text ramp) and reuses the dark block's chromatic values via a comment-stated derivation rule; syntax.css selector extension stays as locked.
	- Benefit: honors the locked "systematic ramp" forcing function; smaller CSS surface; the OG parser's 2-palette contract stays trivially true.
	- Complexity: low; pure CSS authoring choice.
	- Closed Advantageous Doors: a fully independent third ramp would allow dark-low to diverge chromatically later (e.g. its own accent tints) — closing the door to cheap divergence if the experiment ever wants it.
	- Description In Simpler Terms: don't write a whole third color scheme from scratch; write just the few values that differ from dark mode and let the rest be inherited.

9. **[OTHER — EDGE CASE] Typography step must include an explicit rem-anchor test, not just a decision.**
	- Description: Choosing where the base font-size lives (html-level vs article-scoped) has a blast radius on *every* rem-sized component chrome (sidebar, explorer, popovers, footer). The step should verify both options against the visual-test pages + real pages before locking, not reason about it abstractly.
	- How To Do This: In step-writing, bake "A/B the anchor placement on the serve loop before committing" into the checklist; capture the chosen anchor in the plan's Persistent Storage once locked.
	- Benefit: the locked "blast radius on component chrome" concern gets empirical grounding; prevents a week-later discovery that popovers shrank.
	- Complexity: low; it's an iteration-loop activity inside an already-planned step.
	- Closed Advantageous Doors: html-level anchoring would make `1rem`-based type scale values (from pond-insights) land at intended px everywhere at once — article-scoped would close that door; the A/B decides with eyes, not vibes.
	- Description In Simpler Terms: before committing to where the font-size knob lives, actually flip it both ways in the browser and look at every part of the site, not just the article text.

10. **[BETTER LONG-TERM] Close the phase with a written "visual identity" doc artifact.**
	- Description: The final step (or a sub-item of it) writes a short design-decisions artifact into `artifacts/` (palette ramp + derivation rule, type scale, measure, accent rules, background verdict, favicon) so future phases inherit decisions, not archaeology.
	- How To Do This: One markdown artifact authored during 99-end from the plan's persistent storage + final CSS state.
	- Benefit: the "future phases inherit a visual base" vision becomes literal; Capture.md's component-chrome follow-up phase starts from a doc, not from git log.
	- Complexity: trivial authoring at phase end.
	- Closed Advantageous Doors: none.
	- Description In Simpler Terms: at the end, write down what was decided and why, so the next phase doesn't have to dig through code to figure out the rules.


- Favicon plugin drop (`@quartz-community/favicon`): locked as *candidate*; when is the trigger pulled — during toggle step (config already open) or favicon step?
- theme-color meta per mode: derived from the theme parser at build time — is that a favicon-step item or a Head/component item?
- Zero-flash inline init: colocated constants with the toggle — does that create a build-time inlining dependency worth noting in step-writing?
- Anything in Capture.md still unpicked that belongs to *this* phase's scope (icons for files/folders? content width already covered? gradient/grain covered?) vs. must be parked explicitly in the plan to prevent drift.