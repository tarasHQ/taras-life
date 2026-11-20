---
publish: true
created: 2026-11-16T13:03:56.367Z
modified: 2026-11-16T23:28:04.779Z
published: 2026-11-16T23:28:04.779Z
ctime: 2026-11-16 10:41
---

**Index Pages**
\- Create entry pages where needed as one step of this phase. Use a generic Dataview query to list files under each folder; specialized and visually refined pages are future work.
\- The root homepage is `index.md`. A folder's entry page is `_<folder-name>.md` inside the folder, matched case-insensitively while preserving all characters, e.g. `@system/_@system.md`. Quartz Syncer renders Dataview queries to HTML before syncing content to Quartz.
\- Should it replace readme.md? Maybe. It'll be overlapping a bit.
\- ok, let's take another example. You have system folder. it has like 4 subfolders. well, projects subfolder is big one. Schedule - single file. So, structure is combined. In this case I can also add projects folder for example.
\- Idea is that index.md for projects will contain list of projects + description + links to `_project.md` files. Which then contain navigation inside the project.
\- The idea is that whether you like need folders without no index.md. Even more. Whether you need explorer at all. Like home page can contain links to all "modules"
\- Nah, you need explorer. On phones especially.
\- But what if you have "home" button instead?
\- Without explorer the issue is that you'll have massive space on the left.
\- Ok, what other issues I listed. Well, not much. So yeah, I kinda doing something interesting. It's just uncomfortable in big vault to have explorer.
\- Temptations/projects/static/and so on can have entry pages. Explorer exposes entry pages rather than the full file tree; nested entry pages can form a hierarchy.
\- Create entry pages where needed. A journal calendar is a future widget idea.
\- Explorer.  That's an issue.
\- like it quickly becomes redundant. It can list homepage + submodules links. Minimalistic. Top level only. Takes some space so other elements won't be like out of their place. So how many lines? 13-15. Nice.
\- A matching folder entry page is recognized automatically and serves as the folder's Explorer link; the page can provide deeper navigation.

- ⭐**Explorer**
  - The issue is that it is buggy out of the box. Like it might be easier to clone source code and just heavily modify for my scenario.
  - Remove all junk. Don't make it open on full page. Half of it is enough with some BG blur. No bottom dvh covers for ios safari. button should be on the right probably. You planned to have up/down. in-between you have explorer button (on phones only, obviously).
  - simpler parsing logic. simpler styles. Like I really would like to rewrite it from scratch. There's a lot of configurability in it that I don't need and that will create headache in maintaining.
  - Discover the root `index.md` and folder entry pages matching `_<folder-name>.md` case-insensitively, with all folder-name characters included. Other files are excluded automatically. Descriptive entry-page names are easier to find in Obsidian and recognize in open tabs.
  - Collapse intermediate folders without entry pages: place a deeper entry page under its nearest recognized ancestor in Explorer.
  - Wait about projects. It's a submodule within a submodule. How to deal with it?  I mean projects within @system folder. . Projects as real projects - would have index that will... well... Like it won't hurt to list in explorer maybe those as well?
  - Like if the folder is too big - it gets its own underscore file. The issue though is that it may increase explorer size. Like it's 15 now. Then you add one more under systems - 16. Then you add 2 more under real projects. 18. Now - learning system will come some time soon. Temptations. Psychoanalysis. That stuff will grow as mad. So like in a few months you'll be at 30. Which means you won't really be able to have have it nicely inside an explorer. As non foldable list. So if you see that far - you might as well prepare for it.
  - Vault will grow
    - Wait about projects. It's a submodule within a submodule. How to deal with it?  I mean projects within @system folder. . Projects as real projects - would have index that will... well... Like it won't hurt to list in explorer maybe those as well?
    - Like if the folder is too big - it gets its own underscore file. The issue though is that it may increase explorer size. Like it's 15 now. Then you add one more under systems - 16. Then you add 2 more under real projects. 18. Now - learning system will come some time soon. Temptations. Psychoanalysis. That stuff will grow as mad. So like in a few months you'll be at 30. Which means you won't really be able to have have it nicely inside an explorer. As non foldable list. So if you see that far - you might as well prepare for it.
    - ⭐So what would you suggest? Hm. Well, collapsible list. Top row will have toolbar to collapse all/unfold all. maybe one/two more for some explorer settings. And that's it.
      - Key idea is to route all files through on-page dataview queries or something, so explorer won't have like 500 files, it'll be unusable with that amount. 15-30 entries - is perfect.
    - ⭐if you'll rewrite current explorer - remove explorer "heading" that folds it. It doesn't make any sense. Explorer meant to be always visible.
- So, is that is it? Structure stays kinda the same + I'll have to create a few underscore files for each submodule.
- Well, since I'm walking might as well think about in-file navigation.

---

Extracted from project

- ###### Icons & Colors for Files & Folders
  - Kinda duplicate obsidian idea. The thing is - it allows to have a bit more complex structure without requiring additional cognitive processing of that structure. Like it's easier to abstract it out.
  - But after above reflection - there would be no files/folders separation. Homepage will have it's own icon. `_static`, `@journal`, `@projects`, `@system` - will have their own distinct icons too (lucide?) and the rest will have same custom icon.

- ###### Exclude folders & Files
  - `@journals`
    - Too much files and folders. No sense in having explorer navigation. At all.
  - `@projects`
    - Same reasoning?
  - `README.md` - for github.
  - Above is outdated pre-reflection. Explorer won't exclude. It will include by the rules. And then everything else is automatically excluded.

---

## Locked decisions — Explorer rendering, icons & entry metadata

These decisions reflect the later discussion and supersede conflicting ideas in the earlier notes above.

- **Structure and discovery**
  - The vault's coherent folder structure is the navigation SSOT, avoiding shortcuts and exceptions that need separate maintenance. Build our own focused internal Explorer rather than copying or adapting the community Explorer's configurable tree; existing code is not automatically an optimal solution for this site's needs.
  - Discover the root homepage `index.md` and matching entry pages in **immediate subfolders of the content root only**. A folder's entry page is `_<folder-name>.md` inside that folder, matched case-insensitively while preserving all other characters.
  - Explorer is a flat list. Deeper entry pages and notes are reached through entry-page content, not shown in Explorer. Generic Dataview listings provide that deeper navigation; Quartz Syncer renders them to HTML before syncing, and the user has already verified this works. Trust this existing behavior; no preparatory Syncer work is planned.
  - Sort section entries alphabetically and put the root homepage at the bottom as `Home`. There is no separately authored navigation map, hierarchy override system, or dedicated navigation-validation system.
- **Labels and icons**
  - Reuse the existing parsed frontmatter title for the Explorer label. If it is missing, empty, or identical to the entry filename stem, remove the `.md` extension and the convention's first underscore: `_@system.md` → `@system`, `__static.md` → `_static`. An explicitly authored title equal to the stem receives the same fallback. This later implementation decision supersedes the authored-title provenance requirement: no additional parser, provenance hook, transformer changes, or separate metadata registry.
  - An entry page may provide an optional frontmatter icon selection. Maintain a small local collection of selected SVGs instead of shipping an entire icon library. Use the default SVG when no icon is specified.
  - Title and icon are presentation metadata only: neither changes entry-page inclusion or hierarchy.
- **Build-time HTML and SVG reuse**
  - Bake the complete Explorer list, links, labels, and icon definitions into each generated page's HTML. Do not fetch a separate Explorer data/HTML asset or a separate icon sprite to populate it; do not construct the list in browser JavaScript. The purpose is to avoid a separate load that could make the menu or its icons appear late, while accepting repeated page markup.
  - Define each used icon once per page in an in-page SVG definitions block and reference it by ID where it appears. Reuse the default icon definition across entries that select it. Namespace IDs to avoid collisions with future widgets.
  - Keep icon styling in shared CSS rather than repeating presentation attributes on every icon. Use theme-aware colors, such as `currentColor` where appropriate, so icons work with light, dark, and dark-low modes. SVG geometry still lives in the page's icon definitions.
  - SVG source files can be maintained locally and their selected contents embedded during the build. No icon-load animation or icon-loading script is needed. Browser code may still be needed for mobile menu interaction. Decorative icons should be hidden from screen readers when adjacent link text supplies the name.
  - Match entry-page names using existing source-relative page paths; generate links from actual published Quartz slugs rather than guessing URLs from filenames. Do not add speculative virtual-page tracking; current generated 404 and `.base` page paths do not match the convention.
  - The full Explorer markup and its selected icon definitions are repeated in each page response. Reuse saves most when multiple entries share an icon; check browser/SPA behavior through practical browsing after implementation.
- **Desktop, mobile, and future widgets**
  - The original desktop direction is an always-visible Explorer, without an Explorer heading that folds the entire component.
  - Use a compact floating Explorer button on the right, leaving room for future scroll-up/down buttons in a vertical group; do not implement those buttons now. The menu opens from the right and fits its content rather than a fixed percentage or pixel width, while remaining usable within the viewport.
  - Explorer owns its own markup and interaction, not the entire sidebar. Other widgets can use their own build-time or browser-side data and must handle their own SPA lifecycle and state.
  - Choose suitable mobile interaction and accessibility details during implementation, then refine them based on testing. A no-JavaScript Explorer fallback is not required; a site-wide JavaScript warning is a separate project idea.
  - Highlight the entry for the current page's top-level section, including when viewing that entry itself; highlight `Home` on the homepage. Verify the result through SPA navigation; a client-side active-state hook is not locked in.
  - After implementation, ask the user to browse the Explorer and check navigation, back/forward, repeated mobile menu use, and relevant edge cases. Address issues found rather than adding speculative fixes in advance.
- **Integration and verification**
  - Implement as an internal Quartz component using existing layout/resource mechanisms, without a separate Explorer package or plugin build process.
  - Accept existing watch-mode partial rebuild behavior: unchanged pages can retain stale baked Explorer markup after entry additions, changes, or deletions. Document the limitation and full-rebuild remedy in the relevant local README rather than adding invalidation machinery.
  - Keep tests focused on meaningful behavior, avoiding low-value or speculative tests. Create needed generic entry pages through the appropriate vault-authoring workflow; don't assume edits to synced `content/` update the vault.
- **Still open**
  - Title and icon come from existing parsed frontmatter. Later decisions fix sorting by displayed label, default icons only for absent selections, and no icon for unrecognized or unusable selections; title provenance is deliberately not distinguished.
  - Mobile dismissal, focus, scrolling, and the precise internal component registration boundary.
  - Earlier notes suggest background blur and avoiding bottom `dvh` covers for iOS Safari; these visual/compatibility preferences have not been reconfirmed. The earlier fixed half-screen width is superseded by content-based sizing.
