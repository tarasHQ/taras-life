# Remark42 — self-hosted comments: context

Concise context so new tasks don't need to re-derive it. Master progress is tracked in `__obsidian__/PLAN.md`; the roadmap below is a summary.

**Separation of concerns:** Quartz/plugin details are in "Quartz embed". All hosting, server configuration, OAuth, Caddy, tunnel, update-policy and recovery notes are gathered in **"Server reference — current configuration and operations" at the bottom of this file**. Secrets must never be copied into this document.

## Quartz embed (findings from repo exploration)

- Blog: **Quartz v5 on Cloudflare Workers**, public domain **taras.life**. The embed works in production (user-confirmed).
- Quartz v5 here has **no `quartz/layouts/`**; pages are assembled by plugins/components. Content body = `ContentBody` from `@quartz-community/content-page`.
- `afterBody` is a real layout slot, rendered by `quartz/components/frames/DefaultFrame.tsx` after the content `<hr>` inside `.page-footer`.
- Per-page-type placement is supported via `layout.byPageType` in `quartz.config.yaml` → attach comments to **content pages only**.
- Community `@quartz-community/comments` is **giscus-only** (no generic/remark42 provider). Our maintained local source is **`custom-plugins/remark42/`**, separate from Quartz's `.quartz/plugins/` installation cache. The loader links local sources into that cache; do not maintain the cache as source.
- **Implemented design:** a component renders the container automatically on content pages; a shared browser script fills it asynchronously. **Strict identity:** frontmatter `comment-id` is the only thread key; no ID means no widget, with no page-URL fallback. Thread URL: `https://taras.life/comments/<comment-id>`, computed by one helper for future embeds/counters. `comments: false` is an additional opt-out. Host/site ID come from plugin options. Counters/recent-comments UI are deferred.
- **Shell verified:** registered at `afterBody`; excluded from folder/tag/404/canvas/bases/Excalidraw layouts. The original five shell checks passed. Temporary `content/remark42-shell-test.md` showed the placeholder with an ID and hid it after ID removal. This records the shell-stage check; inspect the temporary note before assuming its current frontmatter. The real widget, thread-URL helper, duplicate-ID warning, SPA lifecycle and theme sync are implemented; all 21 expanded automated tests passed (user-confirmed).
- **Local build:** `npm --prefix custom-plugins/remark42 test` type-checks, builds with the host's existing esbuild, and runs component, thread-identity and simulated browser-lifecycle tests. Preview: `npx quartz build --serve` (reads `content`). No separate npm publication is needed. Deployment is verified: prebuild → `build:local-plugins` → Quartz build, so the local plugin is built before Quartz. Repo-wide sweep `npx tsx --test` from the root also passed.
- **Test fixture:** runtime tests execute a verbatim capture of the Remark42 v1.18.0 loader (`remark42-v1.18.0-embed.mjs`) from `custom-plugins/remark42/fixtures/`. It lives **outside any `test/` directory** deliberately: Node's test runner executes every `.mjs` file inside a `test/` directory, and this browser script would fail under Node (no `window`/`document`). `custom-plugins/remark42/fixtures/` is in `.prettierignore` so the capture stays byte-identical to upstream. **On every Remark42 upgrade: re-capture `https://comments.taras.life/web/embed.mjs`, rerun plugin tests and browser checks** (full rules in `custom-plugins/remark42/fixtures/README.md`). Removing the demo site registration did not remove this loader asset.
- **Windows:** automatic symlink creation failed with EPERM. A manually created directory junction `.quartz/plugins/remark42` → `custom-plugins/remark42` resolved it; subsequent preview built without plugin warnings. No administrator build or Windows-wide setting change was needed.
- **SPA lifecycle:** research covered `docs-external/docs/configuration/frontend/spa.md` and Quartz resource/router code. Component browser scripts are shared globally; `nav` fires on initial load and navigation, and cleanup runs before body updates. Implementation uses `prenav` to destroy instances, `nav` to initialize, and a generation check to reject stale async mounts. The installed theme plugin emits `themechange`, which the widget listens to. A persistent module script loads only when a container exists; timeout/download failures are isolated to the comments container.
- **Browser verification passed:** widget loading, navigation, theme and login verified, including production on Cloudflare Workers and first real comments (user-confirmed).
- **Deferred:** counters/recent-comments UI and optional `/comments/<id>` → current note URL redirects for RSS/last-comments links. With the current server allowlist, localhost preview is not an allowed embedding origin; future local widget testing needs a deliberate, verified allowlist adjustment. Do not assume an untested localhost entry format works.

## Roadmap / status

### Completed

- [x] Dedicated Remark42 LXC, native binary v1.18.0, systemd unit and private env file; service/ping verified.
- [x] Caddy routing and real DNS-01 certificate for `comments.taras.life`.
- [x] Cloudflare Tunnel created, configured, DNS-routed and running under systemd.
- [x] Caddy switched to the Cloudflare visitor-IP header; temporary AdGuard rewrite removed; IP chain verified via access logs.
- [x] OAuth: GitHub + Google configured and verified; Google consent screen published to production.
- [x] **Quartz embed complete:** 21 automated checks passed; browser, login and production deployment verified.
- [x] Public DNS check: all six internal `.prox.bar` hostnames return NXDOMAIN from 1.1.1.1 (user-confirmed).
- [x] Admin selection uses `ADMIN_SHARED_ID`; `ADMIN_SHARED_EMAIL=` is empty (user-confirmed).
- [x] `ALLOWED_HOSTS=taras.life` configured; response verified as `frame-ancestors taras.life;`.
- [x] Demo site registration removed: `SITE=taras-life`; `/web/embed.mjs` remains available.
- [x] Unattended updates configured and dry-run verified on both LXCs: Debian security on both, plus cloudflared on the Caddy box; automatic reboots disabled. Caddy remains held and blacklisted.
- [x] Caddy LXC Debian package backlog manually upgraded after taking snapshot `pre-debian-upgrade`; package audit clean, Caddy/cloudflared active, hold preserved and public ping returned `pong`. Caddy itself was not upgraded.
- [x] qdrant/tabby/metamcp/open-webui LXCs removed from Proxmox as no longer useful (user-confirmed).

### Remaining / deferred

- [x] **Backups: implemented and verified** (full design in `__obsidian__/backup.md`).
      Remark42-relevant summary: comment data protected by remark42's built-in 24h auto-dumps
      (`var/backup`, last 10) PLUS daily vzdump (whole FS incl. BoltDB frozen at snapshot,
      plus avatars/images) — worst-case comment loss window ≈ 24h, accepted. The `remark42
    backup` subcommand is a user-data export needing `ADMIN_PASSWD` — NOT used.
      `/etc/remark42.env` is inside daily vzdump archives. Restore uses `remark42 restore -f
    <file.gz> -s <site>`, which DELETES existing comments first (destructive — run on a
      clean install).
- [ ] Optional: point Remark42 LXC DNS at AdGuard.
- [ ] Migrate internal prox.bar hostnames to taras.life subdomains; prox.bar is not being renewed. Actual expiry date and migration status were not rechecked in this session.
- [ ] Later: deliberate manual Caddy update procedure that preserves the Cloudflare DNS module. No Caddy update/rebuild planned now.
- First scheduled real unattended-upgrades run has not yet been observed; current verification covers effective settings, repository matching and dry runs.
- Anonymous comments, admin/user notifications and remaining website/profile email-visibility questions are deferred discussions in the master plan.

## Working agreements (how to work with the user)

- User is rusty with Linux/Unix: **explain concepts before commands**.
- **ONE change at a time**, verify state (`systemctl status` etc.) before restarting anything, and provide a rollback/escape hatch before every change. Prefer `systemctl reload` over `restart` when supported; run `caddy validate` before any Caddy reload with the required environment available.
- Proxmox access is sacred — a past bad Caddy restart briefly locked the user out. Always retain direct access: `https://192.168.1.111:8006`.
- **NEVER paste secrets** (Cloudflare token, Remark42 SECRET, OAuth client secrets, tunnel credentials or future backup tokens) into chats or tracking docs. Secret locations are listed in the server reference, not their values.
- User appreciates honest admission of mistakes, evidence-based diagnosis and structured second-LLM cross-checks for tricky issues.
- **Verify plans against recorded facts.** Do not propose checks against removed logs or infer current infrastructure state; ask when uncertain. Clearly distinguish verified settings from installation details or outcomes that were not recorded.
- Project tracking docs live in `__obsidian__/docs/` and `__obsidian__/PLAN.md`; backup discussion lives in `__obsidian__/backup.md`. Repo-root copies were intentionally removed. Keep these sources accurate without creating duplicate tracking files.

## Server reference — current configuration and operations

This section is the server-side reference. It describes the verified configuration, not a ready-to-paste replacement for any complete server file.

### Architecture and access

```text
PUBLIC COMMENTS (including visitors on the LAN):
  comments.taras.life
    → Cloudflare Tunnel
    → cloudflared on Caddy LXC (192.168.1.12)
    → Caddy at https://127.0.0.1:443
    → Remark42 LXC at http://192.168.1.11:8080

LAN-ONLY SERVICES:
  Browser → AdGuard hostname rewrite → Caddy (192.168.1.12) → internal service
  Certificates: Let's Encrypt via Cloudflare DNS-01; no inbound ports required

RECOVERY — BYPASS CADDY:
  Proxmox: https://192.168.1.111:8006
```

- Blog origin: `https://taras.life`; comments endpoint: `https://comments.taras.life`.
- **URL decision:** comments live under the blog's domain, not the infra domain. `REMARK_URL` appears in comment data, OAuth callbacks and the embed, so it belongs to the longest-lived domain.
- Proxmox host is the always-on mini PC with approximately 10h battery. Remark42 and Caddy run in separate LXCs.
- Internal services (`pve`, `ha`, `adguard`) are **LAN-only**. Public checks against 1.1.1.1 returned NXDOMAIN for the internal `.prox.bar` names. AdGuard answers on the LAN do not establish public DNS state.
- The Caddy box uses router DNS `192.168.1.254`; LAN browsers use AdGuard.
- There is **no AdGuard rewrite for `comments.taras.life`**. The temporary testing rewrite was removed, so LAN visitors also use the tunnel and receive a uniform visitor-IP path.
- Router 443 port-forward: **none exists**, according to the recorded external check. Nothing to close; DNS-01 certificate renewal requires no inbound ports.
- The site's VPN exits at home (VPN exit IP = home IP). VPN-based request tests are not independent outside-vantage tests. This does not invalidate external-resolver DNS results or the recorded header-chain verification.

### Remark42 installation and files

- **LXC:** `192.168.1.11`, Debian 12, unprivileged, nesting **OFF**. Native binary by design; no Docker. The IP was reused after a previous LXC on it was deleted; its obsolete Caddyfile block was removed. The minimal template needed curl installed first.
- **Binary:** `/usr/local/bin/remark42`, official `linux-amd64` release from https://github.com/umputun/remark42/releases. Last verified version: **v1.18.0**, also visible in the `App-Version` response header.
- **Configuration:** `/etc/remark42.env`, root-only, mode `600`.
- **Service:** `/etc/systemd/system/remark42.service`; runs as `nobody:nogroup`, `WorkingDirectory=/var/www/remark42`.
- **Persistent application data:** `/var/www/remark42/var` — BoltDB, Remark42 auto-backups, avatars and pictures. This is the primary irreplaceable-data backup target. Configuration and credential recovery also matter; do not interpret this as permission to discard server secrets/configuration without a recovery plan.
- **Binary updates remain manual:** download and verify an appropriate release, retain the old binary for rollback, replace it and restart Remark42 after checking service state. Apt/unattended-upgrades do not update this binary.
- **Every Remark42 upgrade also requires** re-capturing the embed loader fixture and rerunning plugin tests/browser checks (see Quartz section and fixture README).

### Current Remark42 environment and admin selection

Non-secret reference values; the admin-ID placeholder is not a literal env value:

```dotenv
SITE=taras-life
ALLOWED_HOSTS=taras.life
TRUSTED_PROXY=192.168.1.12
REMARK_URL=https://comments.taras.life
ADMIN_SHARED_ID=<configured provider-prefixed user ID>
ADMIN_SHARED_EMAIL=
```

- **Admin selection is ID-based.** `ADMIN_SHARED_ID` is already set in the real env file (user-confirmed). Its exact current value is not reproduced here rather than inferring it from the earlier fallback proposal. `ADMIN_SHARED_EMAIL` is **empty**, not the old personal email address.
- Clearing the admin email removes email-based admin selection from this setting. It does **not** establish that OAuth never supplies an email or that every website/profile email-visibility concern has been resolved; those are separate questions.
- `SECRET` is required to sign login JWTs: generated with `openssl rand -hex 32`, stored only in the private env file. Never display it or copy the whole env file into chat.
- **Allowed host verified:** response CSP includes `frame-ancestors taras.life;`. The apex host is allowed; subdomains, localhost and arbitrary preview origins are **not automatically included**. CSP framing restrictions are browser-enforced, not API authentication or anti-spam protection.
- **Demo registration removed:** `SITE` contains only `taras-life`, not `remark`. This disables the registered demo site; it does not delete its stored test comments, necessarily remove the static demo HTML, or remove all `/web` assets. `/web/embed.mjs` was verified still available, so the loader-fixture capture URL is unchanged.
- `TRUSTED_PROXY` identifies the Caddy peer from which Remark42 accepts forwarded client-IP headers. Remark42's recorded header preference is `X-Real-IP` → `CF-Connecting-IP` → `X-Forwarded-For`.
- Env-file changes require a Remark42 restart to take effect. Check service state and establish rollback before editing/restarting; do not restart just to inspect settings.

### OAuth — Google + GitHub

Both providers are configured and verified working. Blog login and real comments were also verified during Phase 5.

| Provider | Callback                                           | Notes                                                              |
| -------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| GitHub   | `https://comments.taras.life/auth/github/callback` | OAuth app client ID/secret stored in the private env file          |
| Google   | `https://comments.taras.life/auth/google/callback` | Consent screen published to production; basic email/profile scopes |

- Google production publication avoids the testing-mode 7-day refresh-token expiry; basic email/profile scopes did not require verification in the recorded setup.
- OAuth secrets remain only in `/etc/remark42.env`; never paste them into docs or chat.
- Admin ID is provider-specific; do not assume another provider's login gets admin privileges merely because an account email matches. Admin-by-email is intentionally empty.
- SMTP/email login, anonymous comments and admin/user notification configuration have not been enabled as part of this work; discuss separately according to the plan.

### Caddy installation, routing and certificates

- **Host:** separate Debian 12 LXC, `192.168.1.12`.
- **Verified packaging:** native apt/dpkg-managed `caddy` package, version **2.10.2** at the update-policy check. Configured package source: Cloudsmith stable repository at `https://dl.cloudsmith.io/public/caddy/stable/deb/debian`.
- **Required module:** the running setup supports Cloudflare DNS-01 (`dns.providers.cloudflare`). **The exact custom-binary/module build and installation procedure is not recorded here.** An apt package record does not prove that a stock package binary includes this module; do not assume a normal package replacement preserves it.
- **Updates deliberately deferred:** `apt-mark showhold` lists `caddy`; unattended-upgrades additionally blacklists `^caddy$`. No Caddy package update or binary rebuild was performed during this maintenance. A future manual-update procedure must preserve the DNS module and establish rollback first.
- Caddy routes `comments.taras.life` to `192.168.1.11:8080`.
- Its comments block uses DNS-01: `tls { dns cloudflare {env.CF_API_TOKEN} }`. Recorded token zone scope covers both prox.bar and taras.life.
- Visitor-IP forwarding: `header_up X-Real-IP {http.request.header.CF-Connecting-IP}`. The recorded end-to-end log test showed the real visitor IP (193.30.245.11 in the VPN test) in `Cf-Connecting-Ip`, with `remote_ip=127.0.0.1` for cloudflared.
- **Comments access log:** `/var/log/caddy/comments.log`, owned by `caddy:caddy`. It contains visitor IPs; restrict access to the service and authorized administrators. Earlier fix replaced a stale root-owned empty file and corrected directory ownership. The orphaned 31 MB log file was deleted.
- Cloudflare API token lives in `/etc/systemd/system/caddy.service.d/override.conf`, as `Environment=CF_API_TOKEN=...`; Caddyfile references `{env.CF_API_TOKEN}`. Do not read/paste the override into chat.
- Caddy validation needs its required environment. A plain interactive-shell validation may not inherit the token from the systemd drop-in. For local diagnostics, the recorded extraction command is `TOKEN=$(grep -oP 'CF_API_TOKEN=\K.*' /etc/systemd/system/caddy.service.d/override.conf)`; never print/share that variable, and never paste a command with its expanded value. Share only sanitized diagnostic responses.
- Before any deliberate configuration reload: check current service state, validate with the required environment available, then prefer **reload**, not restart. Keep direct Proxmox access available throughout.

### Cloudflare Tunnel (cloudflared)

- Installed through the Cloudflare apt repository `https://pkg.cloudflare.com/cloudflared`. Last verified package version during setup: **2026.10.1**.
- Repository metadata: `origin=cloudflared`, `label=cloudflared`, `site=pkg.cloudflare.com`, codename `any`. It is now **explicitly allowed** by unattended-upgrades; apt installation alone would not grant that permission.
- Tunnel: `comments`, ID `9f7fbe1a-4ee0-4579-b0a4-d85eb30c5643`.
- Config: `/etc/cloudflared/config.yml`; credentials: `/etc/cloudflared/credentials.json`.
- Ingress: `comments.taras.life` → `https://127.0.0.1:443`, with `originRequest.originServerName: comments.taras.life` so SNI selects the correct Caddy block; catch-all 404.
- DNS: CNAME `comments.taras.life` → `9f7fbe1a-4ee0-4579-b0a4-d85eb30c5643.cfargotunnel.com`.
- Account-level login credential: `/root/.cloudflared/cert.pem`, used for operations such as `tunnel route dns`.
- `cloudflared.service` starts on boot and restarts on crash.
- Recorded benign warnings: ICMP proxy disabled (`ping_group_range`) and QUIC UDP receive-buffer size.

### Automatic apt updates — verified policy

Both LXCs have `unattended-upgrades` installed. Effective periodic settings:

```text
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

The apt daily timers were scheduled. Local policy lives in **`/etc/apt/apt.conf.d/99-local-unattended-upgrades` on each host**; it clears inherited origin allowlists rather than appending to Debian's broader default.

| Setting                    | Remark42 LXC                 | Caddy LXC                                        |
| -------------------------- | ---------------------------- | ------------------------------------------------ |
| Debian security repository | Allowed: `bookworm-security` | Allowed: `bookworm-security`                     |
| cloudflared repository     | Not present/allowed          | Explicitly allowed                               |
| Caddy upgrades             | N/A                          | Held + explicitly blacklisted                    |
| Other third-party origins  | Not allowed                  | Not allowed, including configured Tailscale repo |
| Automatic machine reboot   | Explicitly `false`           | Explicitly `false`                               |
| Remark42 binary            | Manual                       | N/A                                              |

Exact policy on the **Caddy LXC**:

```text
// Limit automatic updates to Debian security and cloudflared.
// Keep Caddy upgrades and machine reboots under manual control.
#clear Unattended-Upgrade::Allowed-Origins;
#clear Unattended-Upgrade::Origins-Pattern;

Unattended-Upgrade::Origins-Pattern {
    "origin=Debian,codename=${distro_codename}-security,label=Debian-Security";
    "origin=cloudflared,label=cloudflared,site=pkg.cloudflare.com";
};

Unattended-Upgrade::Package-Blacklist {
    "^caddy$";
};

Unattended-Upgrade::Automatic-Reboot "false";
```

The **Remark42 LXC** uses the same allowlist reset, Debian security entry and explicit no-reboot setting, but has neither the Cloudflare entry nor the Caddy blacklist block.

Operational notes:

- `Origins-Pattern` is a **list**. Use a brace-delimited list as above, or append with `Unattended-Upgrade::Origins-Pattern:: "...";`. A scalar assignment without the final `::` is not the correct way to append a repository.
- Repository availability and matching were verified with `apt-cache policy`; effective settings were checked with `apt-config dump`; dry runs passed on both hosts. The first scheduled real run has **not yet been observed**.
- Routine simulation: `unattended-upgrade --dry-run`. Add `--debug` only when diagnosing; it may print hundreds of repository-filtering/resolver messages. Dry-run text such as `All upgrades installed` describes the simulation, not real package installation. Negative pins shown during that run are not permanent system-wide apt preferences.
- Logs are under `/var/log/unattended-upgrades/`. Do not infer success solely from a timer or service existing; inspect actual run results when checking operation.
- The warning about missing `powermgmt-base` is not a setup failure. Host battery policy would be a separate decision; do not install power-management tooling in these LXCs just to silence it.
- **No automatic reboot does not mean no service restart.** Package maintainer scripts/restart tooling can restart services, and cloudflared updates may briefly interrupt the tunnel. A Caddy package hold does not guarantee zero interruption from unrelated system maintenance.
- LXCs share the Proxmox host kernel. Updating/rebooting a container does not independently update the host's running kernel. `linux-libc-dev` is a development-headers package, not a new bootable LXC kernel.
- **Security-only automation is not complete OS maintenance.** Fixes can be incorporated into Debian's main repository through point releases. Periodically review normal Debian updates; do not assume every pending main-repository update is merely cosmetic.
- Tailscale's repository was found on the Caddy box but not added to this unattended policy. This does not audit or configure any independent application self-update mechanism.

### Manual maintenance, verification and rollback

- A manual Caddy-LXC Debian upgrade was simulated: **94 packages**, zero new packages and zero removals. The list included libc, PAM, systemd, OpenSSH, OpenSSL and other system packages; **not Caddy**.
- Before upgrading, the user created Proxmox LXC snapshot **`pre-debian-upgrade`**. The real upgrade was performed with Caddy held and without `autoremove`.
- Post-upgrade user evidence: `dpkg --audit` produced no output; Caddy and cloudflared were active; `apt-mark showhold` still listed Caddy; `https://comments.taras.life/api/v1/ping` returned `pong`.
- The snapshot was retained at the end of the session. Its later deletion/retention has not been confirmed. It is a local rollback point, **not an independent/offsite backup**.
- Restore route: direct Proxmox IP → Caddy LXC → restore the snapshot. Restoring interrupts that container and discards its post-snapshot changes; it does not restore or roll back the separate Remark42 LXC or Proxmox host.
- Future upgrades: inspect service state, secure console access and a suitable rollback point, simulate with `apt-get -s upgrade`, then review before any real upgrade. The held Caddy package must stay excluded. Unexpected errors, replacement-config prompts or service-restart questions should be reviewed rather than answered blindly.
- The upgrade suggested autoremoving `iptables`, `libip6tc2`, `libnetfilter-conntrack3` and `libnfnetlink0`. **They were not deliberately removed in this work**; review networking implications separately before any `autoremove`.
- Healthy service checks do not prove every long-running process has loaded every newly installed library. Do not infer either that a reboot is mandatory or that further maintenance can never be needed solely from `systemctl is-active`.

Useful non-secret checks (run only on the relevant host; no restart required):

```bash
# Confirm the Caddy package hold on the Caddy LXC.
apt-mark showhold

# Review scheduled apt tasks and simulate unattended upgrades.
systemctl list-timers --all --no-pager apt-daily.timer apt-daily-upgrade.timer
unattended-upgrade --dry-run

# After package maintenance, check package consistency and Caddy/tunnel health.
dpkg --audit
systemctl is-active caddy cloudflared
curl -fsS https://comments.taras.life/api/v1/ping
printf '\n'
```

### Backups and remaining infrastructure work

- **Backups: implemented and verified.** See `__obsidian__/backup.md` for the full design, corrections and status. Irreplaceable Remark42 data is protected by remark42's built-in daily auto-dumps plus daily vzdump to local storage, mirrored to CIFS storage `lifepc-smb` (Windows, share `pve-backups`, user `pve-smb`). Encryption deliberately dropped for the LAN SMB tier (rotatable secrets, credentialed share; revisit trigger = any future offsite/cloud tier). Archive streaming test passed; full restore drill not performed (recorded gap).
- **Domain migration remains unverified/deferred:** prox.bar is not being renewed. Migrate internal services to taras.life subdomains with **direct, non-wildcard AdGuard rewrites** (for example `pve.taras.life → 192.168.1.12`), then update Caddy blocks one service at a time with validation and reload. DNS-01 can issue replacement certificates without public service records or inbound ports. Recheck the actual expiry date instead of reusing the old relative "~1 month" estimate.
- Optional Remark42 LXC DNS migration to AdGuard has not been performed here.
