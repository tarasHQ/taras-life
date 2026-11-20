---
publish: true
created: 2026-11-16T22:34:22.041Z
modified: 2026-11-17T17:30:57.892Z
published: 2026-11-17T17:30:57.892Z
status: implemented
state: condensed
---

[← PLAN](../_plan_004.md)

## Description

Implemented and verified the build-time navigation model for the internal Explorer using existing processed page data. Rendering and registration are outside this step.

## Implementation Summary

- **Navigation model** — `quartz/components/explorerNavigation.ts` returns a fresh list without mutating its input. It discovers root `index.md` and immediate-subfolder `_<folder-name>.md` entries case-insensitively, preserving punctuation, and excludes deeper entries and ordinary notes.
- **Labels and destinations** — Entries retain their actual published slugs and source paths. Section labels use the processed title unless missing, empty, or exactly equal to the filename stem, in which case the filename without `.md` and its first underscore is used; this also applies to explicitly authored stem-equal titles.
- **Ordering and icons** — Sections sort by displayed label using English collation, with source paths breaking ties; Home is labeled `Home` and placed last. Icon metadata preserves the distinction between an absent selection and any supplied value without affecting inclusion.
- **Tests and review** — `quartz/components/explorerNavigation.test.ts` covers discovery, ordering, slugs, icons, title cases, and integration with Quartz's real parser and configured frontmatter transformer. Review found no production-code defects; its agreed case-difference test was added.
- **Verification** — After the review change, the user provided successful output for formatting, the six focused tests, `npm run check`, all 178 project tests, and `npm run build`. The assistant did not run these commands.
- **Documentation and handoff** — `quartz/components/README.md` records the model and title exception. Step 02 must document the accepted watch-mode stale-markup limitation and full-rebuild remedy; practical browser verification belongs to Step 03.

---
