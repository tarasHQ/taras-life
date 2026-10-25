# Remark42 — master plan - old plan of how currant plugin was written (removed unrelative stuff.)



## Phase 1 — Remark42 service (LAN only) — ✅ DONE

## Phase 2 — Caddy block — ✅ DONE


## Phase 3 — OAuth apps — ✅ DONE (GitHub + Google)


## Phase 4 — Cloudflare Tunnel — ✅ DONE

## Phase 5 — Quartz embed (in repo) — ✅ DONE

- [x] Repo explored. Findings (details in `docs/REMARK42.md` → "Quartz embed"):
      `afterBody` slot exists (rendered by `DefaultFrame.tsx` in `.page-footer`);
      per-page-type placement via `layout.byPageType` → attach to **content pages only**;
      community `@quartz-community/comments` is **giscus-only** → write local plugin
      with source under `custom-plugins/remark42/` (separate from Quartz's install cache).
      Blog public domain: **taras.life** (known).
- [x] Read Remark42 SPA/frontend docs and Quartz navigation/resource code. Component browser scripts
      are shared globally; `nav` covers initial load and navigation; cleanup runs before body updates.
      Lifecycle handling is implemented and browser-verified: `prenav` cleanup, `nav` initialization,
      stale asynchronous mount protection, and theme synchronization.
- [x] Local plugin shell created in `custom-plugins/remark42/`, registered in `quartz.config.yaml`.
      Build uses the host's esbuild; shell checks pass (5 tests). No separate npm publishing needed.
- [x] Windows local-plugin link issue resolved with a directory junction:
      `.quartz/plugins/remark42` → `custom-plugins/remark42` (no administrator build required).
- [x] Local preview verified with `npx quartz build --serve` (input directory: `content`).
      Temporary `content/remark42-shell-test.md` showed the placeholder with `comment-id`;
      removing the ID hid it. This records the shell-stage check, not the temporary note's current frontmatter.
- [x] Real widget code written: opt-in container, public YAML settings, async documented SPA loader,
      navigation cleanup/stale-mount guard, theme sync and isolated loading errors. All 21 automated
      tests pass (including type-check/build). Counters/recent-comments UI remain future additions.
- [x] **Comment identity design (implemented; automated checks pass):** - `comment-id` in note frontmatter = the ONLY key to comment threads - embed `url: https://taras.life/comments/<comment-id>` (officially supported: `url` is
      "used as unique identificator for comments thread" per docs) - **strict mode: no `comment-id` → no comment widget at all** (no silent fallback to page URL —
      that would silently orphan comments after a note move) - compute the synthetic URL in ONE helper so `embed` and `counter` widgets stay consistent
- [x] Duplicate-`comment-id` warning implemented (one scan per published metadata array/rebuild);
      automated checks pass.
- [x] Test fixture relocated: captured v1.18.0 loader moved from `custom-plugins/remark42/test/fixtures/`
      to `custom-plugins/remark42/fixtures/` (outside `test/` so Node's test runner no longer executes it
      as a failing test during repo-wide `tsx --test` sweeps). `.prettierignore` excludes the fixture dir
      so the capture stays byte-identical to upstream. Both plugin tests and repo-wide sweep green.
      **Rule: re-capture the fixture on every Remark42 upgrade** (see `custom-plugins/remark42/fixtures/README.md`).
- [ ] Optional later: redirect `/comments/<id>` → current note URL (fixes RSS/last-comments links)
- [x] **Browser verification PASSED (user-confirmed):** widget renders on a content page, login works
      from the blog, and the whole embed **works in production on Cloudflare Workers** — the deployment
      path (prebuild → `build:local-plugins` → quartz build) exercised successfully on the real site.
      First real comments = final sanity check passed.