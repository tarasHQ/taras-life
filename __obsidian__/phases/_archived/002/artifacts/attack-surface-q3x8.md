# Attack Surface — Phase 002 (critique of the post-initial-planning PLAN)

%%Scorched Earth Critique, Stage B1. Temporary self-reflective exploration.
Nested questions + possible explanations. NO answers, NO recommendations.
Target artifacts: `_plan_002.md` (current plan + Drafted Steps Recommendation)
+ `initial-reflection.md` (locked decisions C1–C16).
Prior critique (`attack-surface-7k2f.md`) already attacked the raw reflection;
all 10 points integrated. This pass attacks the PLAN as it now stands —
re-treading resolved points is out of scope.%%

---

## 1. Claims written as facts, verified only in step 01
- The plan's Exploration section asserts outcomes of step-01 verifications as already-true ("verify in 01", but phrased as facts).
    - Fresh repo audit found `Head.tsx` consuming `cfg.theme.cdnCaging`/`fontOrigin`/`typography.title` and calling BOTH `googleFontHref`/`googleFontSubsetHref` — is ALL of that inside the dormant Google block?
        - Possible explanation: yes, all gated behind `cdnCaching && fontOrigin === "googleFonts"` — then the plan is right.
        - Possible explanation: `typography.title` (or another key) leaks outside the dormant block → step 03's type/config deletion breaks compile or rendering, discovered mid-step instead of in 01.
    - `quartz.config.yaml` reportedly has NO `title` font entry, yet `typography.title` is read somewhere — where does the value come from, is the read path actually dead, or is the audit itself imprecise?
- If a "verified" claim in the plan is wrong, does anything in the step ordering catch it before it can do damage, or does the error surface at the worst possible time (mid-surgery)?

## 2. The final verification model's weakest link
- Real verification = "multiple independent LLM review runs over final CSS vs `public-legacy`" — semantic comparison of build OUTPUT.
    - The output is MINIFIED (Lightning CSS) — is semantic review of minified CSS actually reliable, or does minification destroy the structure a reviewer needs?
    - What is the false-negative rate of LLM review on silently-wrong-but-plausible CSS (wrong breakpoint literal, dropped custom property, wrong specificity after nesting conversion)?
    - A deterministic oracle ALREADY exists in the plan (sass-expanded capture of all 6 files, step 01) — is the plan using the strongest available check as primary, or as a side-note?
        - Possible explanation: source-level diff (converted CSS vs sass-expanded capture, modulo the intentional-delta list) is mechanical and catches transcription errors that any review of minified output would miss.
        - Possible explanation: the LLM review's real value is the intentional-delta LIST and "explained or not" accounting — a role the oracle cannot fill.
- Is "multiple independent runs" adding real reliability, or just cost, if all runs read the same minified artifacts?

## 3. Deployment policy during the phase
- Workers Builds deploys on every push; NO previews enabled.
    - Steps 02–04 are mid-surgery states. Does any step boundary guarantee the site is reader-safe BEFORE the push, or only after?
        - Possible explanation: `npm run check && npm run build` passing proves compilation, not rendering.
    - Is there an explicit rule for when pushes happen during this phase (after every step vs. hold until final review), or is it implicit/hope?
        - Possible explanation: step 02 is the risk-dominant step (C7 framing); pushing it straight to production readers with eyeball-only verification contradicts the plan's own risk framing.

## 4. Step 05 is a placeholder in an otherwise fully-scoped plan
- "Scoped when written" + pre-leaned "full removal of the create CLI path".
    - Is the create path entangled with anything else (`handleCreate()` arg plumbing, `plugin-data.js` fallback chains, watch-mode init, docs referencing `quartz create`)?
        - Possible explanation: removal scope is bigger than "delete 4 yamls + 2 functions" and gets discovered mid-step.
    - Does pre-leaning the decision ("lean: full removal") while deferring the scope create a bias where the scope is stretched to fit the decision?
- Would a 15-minute scoping read of `handlers.js`/`plugin-data.js` NOW make the plan honest about step 05's true size?

## 5. Per-variable grep acceptance criterion (C9)
- "Core stylesheet contains only consumed custom properties (grep-verified per-variable)".
    - How noisy is grep-based var-consumer verification here?
        - Possible explanation: dynamic DOM (micromorph, remark42 browser.ts, darkmode component) uses vars not greppable from source reliably.
        - Possible explanation: shorthand/var() chains make "consumed" ambiguous.
    - Is this a ceremony that produces a long pass/fail table for near-zero information, given ~60 orphan aliases are already slated for removal and the kept set is small (~13 vars)?
- What is the cheap version of this criterion that still catches the failure it's aimed at (shipping vars nobody reads)?

## 6. Orphan-alias deletion insurance
- ~60 Obsidian-compat aliases + 3 accent vars die in step 02/03.
    - Consumers were verified for the remark42 PLUGIN source — but were they verified in RENDERED artifacts (`public-legacy` HTML/JS/CSS) where a third-party or inline script could reference an alias?
        - Possible explanation: one grep of `public-legacy` for alias names is nearly free insurance against a missed consumer that only shows up at runtime.

## 7. Decision persistence timing (C15)
- All READMEs written ONCE at the end, "against the final picture".
    - Decisions made during steps 02–04 (conversion trade-offs, pruned selectors, dead-code findings) — where do they live between the decision moment and step 06?
        - Possible explanation: working memory of a step file's exploration notes; risk of decay/dropout before the docs step.
    - Is there a lightweight capture convention (one-line decision log per step) that makes step 06 mechanical instead of archaeological?

## 8. Claim drift between artifacts
- Prior artifacts describe `customStyles` as config-appended; the fresh audit found the emitter IMPORTS `custom.scss` directly and `configuration.customStyles` does not exist in the YAML.
    - Which mechanism is actually live, and does the step-01 flow map explicitly settle it before the loader-map replacement is designed against the wrong mental model?

## 9. The size of the phase
- (handled in the B2 response, not here)
