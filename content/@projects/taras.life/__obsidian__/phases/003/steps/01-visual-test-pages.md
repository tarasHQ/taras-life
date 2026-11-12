---
publish: true
created: 2026-11-05T11:55:44.314Z
modified: 2026-11-05T11:57:08.935Z
published: 2026-11-05T11:57:08.935Z
status: ready
state: full
---

[← PLAN](../_plan_003.md)

## Description

Create the **visual test-page set** — the iteration infrastructure every later step of this phase judges its decisions against.

Without a real rendering surface, every visual choice (palette, type scale, accents, background) would be judged in a vacuum against placeholder pages — the exact failure vision this phase exists to avoid. This step builds that surface: a folder of grouped test pages living in the **vault**, reaching the site through the normal Obsidian syncer, **intentionally published** so decisions are verified on production too, not just locally.

Locked context (from initial-reflection verdicts 3, 4, 6):

- Test pages are **listed/published** (checked on production), NOT `unlisted` — reversed from the original proposal. No exclusion work at all.
- **~5 grouped pages + an index**, not one mega page.
- Pages **carry comments**: `id` frontmatter on each (the old "no id" hygiene rule is dead).

## High-Level

### List of related files or folders

- **Created (in vault, NOT in repo):** `C:/Users/Taras/Documents/obsidian-vault/_static/markdown-tests/` — grouped test pages + index. Reaches the repo as `content/_static/markdown-tests/` via the Quartz Syncer plugin.
- Context (existing iteration surfaces named in the plan):
  - `content/markdown-test.md` — pre-existing kitchen-sink page; stays as-is, test set supplements it.
  - `content/@journal/01 Daily/2026/10-October/October 30th Fri.md` — real journal entry (real-content judging).
  - `content/Productivity/_reflections/how-much-time-should-i-work.md` — real long note (reading-measure judging).
- Tooling (outside repo, no changes needed): Quartz Syncer Obsidian plugin (vault↔`content/` sync), remark42 self-hosted widget (comments appear only if `id` is present).

### Intended outcome

- Index + 5 grouped test pages exist in the vault folder, synced into `content/_static/markdown-tests/`, built by the site, and **listed on production** (normal explorer/sitemap paths — nothing excludes them).
- Comments widget renders on the test pages (proving the `id` frontmatter works as intended).
- Local serve loop verified working — it's the day-to-day judging surface for steps 02–07 (validated fact: it already works and is tested; this step only confirms it, no construction).
- The set covers every markdown construct the later steps will restyle, so a single page load is enough to judge a change.

### Local invariants

- **Relative links only** between test pages (Obsidian relative-links setting → identical Quartz parsing; locked verdict 4). No absolute/vault-absolute links inside the set.
- **Every test page's frontmatter carries a stable, meaningful `id`** (e.g. `md-tests-type`). The remark42 thread URL is frozen as `https://taras.life/comments/<id>` — changing an id later orphans its threads, so pick slugs to keep, not placeholders.
- **No `comments: false`**, no `unlisted: true` anywhere in the set.
- Pages are authored **only** in the vault folder; `content/` copies arrive via the syncer and are never hand-edited (syncer would clobber them).
- **Content-only step** — no styles, components, or config are touched.

### Should NOT be done in this step

- No CSS/theme/component/config changes — visual judging starts in step 02, on top of this surface.
- No unlisting/exclusion machinery (explicitly reversed decision).
- No breadcrumbs contradiction fix (`[DISCARDED]` in Capture.md yet still enabled in config) — parked, not this phase; it just shows up as visual noise during iteration.
- No favicon/logo/OG thinking — favicon is strictly last (step 07) and its scope guard stays.

---

## Tasks

- [ ] **Create the vault folder** `C:/Users/Taras/Documents/obsidian-vault/_static/markdown-tests/` and the **index page** (`index.md`) linking to all five pages with relative links.
- [ ] **Page — Type specimen** (`id: md-tests-type`): all heading levels h1–h6, headings inside lists and outside, paragraphs of varying length, bold/italic/strikethrough/highlight, blockquote, horizontal rule, footnotes.
- [ ] **Page — Lists & indentation** (`id: md-tests-lists`): ordered, unordered, deeply nested, task lists; indentation-heavy content blocks (the user's heavy-indentation style is the reason the measure is 80ch, not 65ch — this page must represent it).
- [ ] **Page — Code, tables & mermaid** (`id: md-tests-code`): inline code, fenced code in several languages (syntax-highlighting-heavy for dark/dark-low judging), a **wide table** (the future 80ch no-escape-hatch scroll test — `pre`/`.table-container` already scroll internally), a mermaid diagram. Note: this page is the designated surface for the **mermaid dark-low edge-case check** (locked verdict 5 — recorded in step 03, judged on this page).
- [ ] **Page — Callouts & links** (`id: md-tests-links`): all callout variants (note, warning, tip, danger, quote…), internal links, external links, broken links, tag links, wikilinks — the full matrix step 05's link-rework decision must cover.
- [ ] **Page — Background sandbox** (`id: md-tests-bg`): a sparse, tall page — minimal chrome, maximum background area. Later steps 05–06 hang gradient/grain experiments off it; the tall-empty shape is what makes gradient banding observable.
- [ ] **Frontmatter check on every page**: stable `id`, no `comments: false`, no `unlisted: true`.
- [ ] **Run the syncer**; verify `content/_static/markdown-tests/` appears in the repo with all pages.
- [ ] **Verify the local serve loop** still renders the set (confirm-only — the loop is a validated fact).
- [ ] **Push and verify production**: pages listed and reachable on `taras.life`, comments widget loads on at least one test page, SPA navigation between test pages works.
