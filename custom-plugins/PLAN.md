# Remark42 — master plan

> Track progress here. Details, facts and working agreements live in `__obsidian__/docs/REMARK42.md`.
> Rule of engagement: **one step at a time, verify after each, rollback noted before every change.**

## Phase 1 — Remark42 service (LAN only) — ✅ DONE

- [x] LXC created: Debian 12, unprivileged, nesting OFF, IP `192.168.1.11`
- [x] Binary installed → `/usr/local/bin/remark42` (running v1.18.0), smoke test passed (`/api/v1/ping`)
- [x] Port 8080 free check, data dir `/var/www/remark42` (owner `nobody:nogroup`)
- [x] `/etc/remark42.env` written (chmod 600). Current settings:
      `REMARK_URL=https://comments.taras.life` · `SITE=taras-life` · `ALLOWED_HOSTS=taras.life` ·
      `TRUSTED_PROXY=192.168.1.12` · `ADMIN_SHARED_ID` configured · `ADMIN_SHARED_EMAIL=` (empty).
      `SECRET` is generated and stored only in the env file. See `docs/REMARK42.md` →
      "Server reference — current configuration and operations" for the current server setup.
- [x] `/etc/systemd/system/remark42.service` created (docs template, no inline comments), daemon-reload
- [x] `enable` + `start`, status green, ping OK

## Phase 2 — Caddy block — ✅ DONE

- [x] `comments.taras.life` block added to Caddyfile (DNS-01 tls pattern, `reverse_proxy 192.168.1.11:8080`)
- [x] `caddy validate` before every reload; env var present (checked) — reload (not restart) used throughout
- [x] LAN test via temporary AdGuard rewrite → pong through Caddy with real LE cert
- [x] Access log `/var/log/caddy/comments.log` added later (log dir ownership fix: `caddy:caddy`);
      old stale root-owned 0-byte file replaced; deleted open-webui.log orphan (31MB)
- [x] Temporary AdGuard rewrite removed after tunnel went live

## Phase 3 — OAuth apps — ✅ DONE (GitHub + Google)

- [x] GitHub OAuth app: callback `https://comments.taras.life/auth/github/callback`,
      CID/CSEC in `/etc/remark42.env`, login verified, test comments posted on demo page
- [x] Google OAuth (Cloud Console): JS origin + redirect `https://comments.taras.life/auth/google/callback`,
      consent screen **published to production** (testing mode would expire tokens after 7 days),
      login verified, test comments posted
- [ ] Later/optional: email login (needs SMTP), Telegram, others

## Phase 4 — Cloudflare Tunnel — ✅ DONE

- [x] `cloudflared` installed via Cloudflare apt repo (explicitly allowed in unattended-upgrades during Phase 6);
      `tunnel login` (taras.life zone), `tunnel create comments` (ID `9f7fbe1a-4ee0-4579-b0a4-d85eb30c5643`)
- [x] `/etc/cloudflared/config.yml`: ingress `comments.taras.life` → `https://127.0.0.1:443`
      with `originRequest.originServerName: comments.taras.life`; validated; run as systemd service
- [x] `tunnel route dns comments comments.taras.life` (CNAME created)
- [x] External test: pong through tunnel (note: via VPN that exits at home — header-chain verification valid,
      but not a true outside-vantage test)
- [x] Caddy block: `header_up X-Real-IP {http.request.header.CF-Connecting-IP}` (live);
      **IP chain verified end-to-end** via Caddy access log (real visitor IP in `Cf-Connecting-Ip`,
      `remote_ip` = 127.0.0.1 = cloudflared)
- [x] Public DNS check for internal hostnames (`.prox.bar`):
      **all checked names return NXDOMAIN from external resolver 1.1.1.1 (user-confirmed)** —
      no public records exist, nothing leaked, nothing to delete. Note: LAN `nslookup <host>` without a resolver argument
      goes to AdGuard and answers from rewrites (proves nothing about public state); the external
      resolver must be named explicitly. DNS-lookup validity is not affected by the home-exiting VPN.
- Router 443 port-forward: **none exists** (verified externally — connection refused on home WAN:443).
  Nothing to close. Cert renewal keeps working (DNS-01, no inbound ports).

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

## Phase 6 — Hygiene & ops — 🔄 IN PROGRESS

### Completed

- [x] `ALLOWED_HOSTS=taras.life` set and verified in the response CSP:
      `frame-ancestors taras.life;`. This allows the apex blog host, not subdomains or localhost automatically.
- [x] Demo site registration removed: `SITE=taras-life` (no `remark` site).
      `/web/embed.mjs` remains available; the loader-fixture capture procedure is unchanged.
      Removing the registration does not delete stored demo comments or remove all static `/web` assets.
- [x] Admin selection uses `ADMIN_SHARED_ID`; `ADMIN_SHARED_EMAIL=` is empty (user-confirmed).
      OAuth providers remain Google + GitHub.
- [x] `unattended-upgrades` configured on **both** the Remark42 LXC and Caddy box:
      daily package-list refresh and upgrades enabled; automatic reboots explicitly disabled.
      Effective configuration and dry runs verified. First scheduled real run has not yet been observed. - Remark42 LXC: Debian `bookworm-security` repository only. - Caddy box: Debian `bookworm-security` + verified `cloudflared` repository only. - Caddy package remains **held and explicitly blacklisted**; no Caddy update/rebuild was performed. - Tailscale and other third-party origins are not allowed by this unattended-upgrades policy. - Remark42 native binary remains manually updated (baseline v1.18.0). - Security-only automation does not replace periodic manual Debian maintenance; fixes can be
      incorporated into the main repository through point releases. Package upgrades may restart
      services even with automatic machine reboots disabled.
- [x] Caddy LXC's Debian package backlog manually upgraded after taking snapshot `pre-debian-upgrade`.
      The simulation proposed 94 upgrades, no new packages, and no removals; Caddy itself was excluded.
      Post-upgrade: `dpkg --audit` clean, Caddy + cloudflared active, Caddy hold preserved,
      public comments ping returned `pong`. Snapshot is a rollback point, not a backup system.
- [x] qdrant/tabby/metamcp/open-webui LXCs removed from Proxmox as no longer useful
      (user-confirmed); supersedes the earlier Qdrant/API-key follow-up item.
- [x] Update `docs/REMARK42.md` roadmap and separate the server reference from Quartz/embed details.

### Remaining / deferred

- [x] **Backups: implemented and verified.** Full design, corrections and status in
      `__obsidian__/backup.md`. Summary: daily vzdump all-guests → local storage
      (keep-daily=2 + keep-weekly=1, zstd, snapshot mode), rsync `--ignore-existing --delete`
      mirror every 15 min to CIFS storage `lifepc-smb` (no encryption — accepted risk
      recorded; sha256 manifest host-side), archive integrity test passed (remark42 archive
      streams cleanly). remark42 comment data: built-in 24h auto-dumps + daily vzdump
      (worst-case loss window ≈ 24h, accepted). Remaining gaps recorded there: no offsite
      copy, host config note TODO, no full restore drill.
- [ ] (Optional) point Remark42 LXC `resolv.conf` at AdGuard like the rest of the LAN.
- [ ] (Later) migrate internal hostnames from non-renewed prox.bar to taras.life subdomains with
      direct AdGuard rewrites; rename Caddyfile blocks; certs re-issue automatically via DNS-01.
      Actual expiry date and migration status were not rechecked in this session.
- [ ] (Later, not part of this work) establish a deliberate manual Caddy update procedure that
      preserves the Cloudflare DNS module. Leave Caddy held for now.

---

Added by user DISCUSS AFTER phase 6 is completed.

1. I don't want to expose my email in remark config and website — admin env selection now uses
   `ADMIN_SHARED_ID` with `ADMIN_SHARED_EMAIL=` empty. Any remaining website/profile email-visibility
   concerns are still a separate discussion; do not assume this change proves all email is hidden.
2. I want to have anon comments
3. How to get notified about comments? (as admin)
4. How to get notified about comments? (as user)
