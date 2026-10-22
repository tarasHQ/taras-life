# Backups — design (LOCKED, implementation pending)

> Purpose: record the decided backup design and its implementation status so a future
> session can operate/verify without re-deriving. **Design locked; implementation COMPLETE
> except the test restore (declined by user — recorded as accepted gap).** Companion to
> `PLAN.md` (Phase 6) and `docs/REMARK42.md`.
> Working agreement applies: one change at a time, verify after each, rollback before every change.

## Decided architecture (locked)

```
Proxmox host (192.168.1.111) — always-on mini PC
├─ 1. vzdump job (existing job backup-540c66f0-ce04, retargeted/tuned):
│       all guests mode (no explicit VMID list), zstd, mode snapshot
│       → local storage (plaintext), retention keep-daily=2 + keep-weekly=1
│       (~25 GB local footprint; ~7 GB compressed per full pass)
│
├─ 2. remark42 LXC: built-in automatic backups — every 24h writes
│       backup-remark-YYYYMMDD.gz to var/backup, keeps last 10. NO extra timer,
│       NO host sweep (decision A). Avatars/images + live DB protected by vzdump.
│
├─ 3. sync (every 15–30 min, flock, idempotent, failure-tolerant):
│       rsync -a --ignore-existing --delete   local ──► CIFS mount
│       + sha256 manifest of uploaded files (kept on host ONLY)
│
└─ 5. SMB machine (Windows, 24/7 in theory, ~80% real uptime):
        second copy of everything; NOT a Proxmox storage — see "SMB access" below
```

### Decisions and rationale (compressed history)

| Decision                           | Choice                                                                     | Why (short)                                                                                                                                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Full vzdump vs file-level tiers    | **vzdump-only daily** + small remark42 dump layer                          | vzdump is a recovery tool; daily granularity for irreplaceable data comes from remark42 dumps, not images. "Both tiers for everything" was considered and deliberately simplified away.          |
| Archive size concern (200 GB fear) | Resolved by retention, not by fewer backups                                | 17 GB disk ≠ 17 GB archive (zstd ≈ 7 GB). 2 daily + 1 weekly ≈ 21–25 GB. 10-day retention was never needed.                                                                                      |
| Where archives live                | **Local primary, SMB secondary**                                           | Local-first means a failed SMB sync never fails the backup itself (graceful degradation). Also fastest restore path.                                                                             |
| Schedule coupling                  | **None.** Sync is periodic/idempotent (15–30 min), independent of job time | Changing job time (04:00 → 10:30) breaks nothing; sync catches up on its own schedule; SMB downtime = delayed copy, not failure.                                                                 |
| VMID list in job                   | **"All guests" mode**                                                      | Explicit `vmid` list (currently `100,101,102,110,111,118,122,123`) silently misses future guests. All-guests needs zero maintenance. Existing list is harmless but should be dropped.            |
| Encryption                         | **DROPPED (for now)**                                                      | See "Encryption decision" below.                                                                                                                                                                 |
| Restore from SMB                   | **Register share as Proxmox CIFS storage**                                 | Plaintext archives with intact `vzdump-*.tar.zst` names are indexed by Proxmox UI → one-click restore from either copy. (Earlier "don't register" advice was encryption-driven and is now void.) |
| Integrity                          | **sha256 manifest, host-only**                                             | Detects SMB-side corruption/bit-rot/tampering at restore-from-SMB time. Not anti-forgery (moot without encryption).                                                                              |
| Retention                          | local: keep-daily=2 + keep-weekly=1; SMB mirrors it via `--delete`         | Mirror semantics, no accumulation museum. User confirmed.                                                                                                                                        |
| remark42 frequency                 | 4h dumps, last 10 (remark's own MAX_BACKUP_FILES)                          | User chose 4h; hourly was considered and declined.                                                                                                                                               |
| Offsite tier                       | **Not now — accepted gap**                                                 | Same-house single point of failure accepted explicitly.                                                                                                                                          |

## Sync semantics (the part that answers "won't we copy everything every time?")

- `--ignore-existing` = **names-only compare**: copy only if the filename doesn't exist on SMB.
  Valid _because_ our archives are write-once with unique names
  (`vzdump-lxc-<vmid>-<date>_<time>.tar.zst`, timestamped remark42 dumps).
  No size/mtime/checksum inspection; unchanged sync costs seconds and transfers nothing.
- `--delete` = pruning propagates: when local retention removes an archive, the next sync
  removes it from SMB. SMB is a **mirror** of local, not an accumulator.
- **No staging directory, no re-encryption problem**: plaintext archives are stable bytes;
  this whole wrinkle existed only for age's randomized output and died with encryption.
- Failure modes, named:
    - Transfer interrupted → rsync writes temp file, renames on completion; missing name →
      re-delivered next cycle (self-healing in the missing-name direction).
    - File corrupted **in place** on SMB (present but bad) → names-only sync will _never_
      rewrite it. The manifest is what detects this; repair = delete on SMB, next cycle re-uploads.
    - Windows down > retention window (~3–4 days) → an archive can be pruned locally before
      it ever reached SMB → coverage hole. Accepted as a known property (80% uptime reality).

## remark42 layer details (CORRECTED against official docs: docs/remark42/docs/backup/)

- **Automatic backups already run inside remark42 with zero extra configuration:** every 24h
  it writes `backup-remark-YYYYMMDD.gz` to `${BACKUP_PATH}` (default `./var/backup`), keeping
  up to `${MAX_BACKUP_FILES}` (default 10). The daily consistent comment dump the design
  relied on already exists.
- **The `backup` subcommand is a user-facing export, NOT the full DB backup:** it produces
  `userbackup-{site}-{timestamp}.gz` and per docs requires `ADMIN_PASSWD` to be set on the
  server (it is not). The earlier plan of a 4h `remark42 backup` timer was WRONG about both
  scope and prerequisites and is ABANDONED. (This is why the manual dry run failed with
  "required flags --secret and --url not specified" — and that failure prompted the docs check.)
- **Auto-backup contents = comments only.** Avatars and images live in separate directories
  (`var/avatars`, `var/pictures` per docs' migration section) and are NOT in the .gz dumps.
  Full recovery = `remark42 restore -f <file.gz>` + restore avatars/images dirs from vzdump
  or sweep copies.
- **BoltDB live-file copying:** the docs don't bless it (only the migration section mentions
  transferring BoltDB files). Conservative rule stands: never copy the live DB file; rely on
  auto-dumps (comments) + vzdump snapshot mode (whole FS incl. DB, frozen at snapshot).
- **Restore caveat:** `remark42 restore -f <file.gz> -s <site>` REMOVES all existing comments
  before importing — destructive, run deliberately on an empty/failed install.
- Container owns dumping; host owns moving files (SSOT split: no SMB credentials in LXCs).
- `/etc/remark42.env` is NOT swept separately — it changes ~never and is already inside
  daily vzdump archives.
- **OPEN DECISION (user):** accept 24h comment-dump granularity (simplest; vzdump adds a
  frozen-DB copy at 04:00), or add a host sweep every 4h copying the latest auto-dump +
  avatars + images (finer granularity for images, not for comments — auto-dumps are 24h).
  Note: a 4h sweep does NOT produce 4h comment dumps; comment granularity stays 24h unless
  remark's auto-backup interval itself is configurable (not documented in what we read).

## Encryption decision (dropped — full reasoning preserved)

- vzdump has no native encryption (that's PBS) — hence age was planned in the sync step.
- age X25519 stanzas provide confidentiality only — unauthenticated ephemeral share means
  anyone knowing the recipient pubkey can forge a decryptable backup (silent poisoning vs
  loud deletion). Analysis was done and recorded here as context; it is **moot** while
  encryption is dropped.
- Why dropped: share is already credentialed (`pve-smb`); all sensitive content in archives
  is **rotatable** (CF token, remark42 SECRET, OAuth secrets) → compromise = rotate tokens,
  an annoying afternoon, not a disaster; encryption bought defense-in-depth for a
  low-probability recoverable event at the cost of: age key custody, staging dir,
  lost CIFS-storage UI indexing, forgery caveats.
- **KEPT despite dropping encryption:** the sha256 manifest (corruption detection).
- **ACCEPTED RISK (explicit):** compromise of the Windows box exposes plaintext backup
  contents → response is rotating CF_API_TOKEN, remark42 SECRET, OAuth secrets.
  Deletion by a valid share credential remains unaddressed (Windows-side shadow copies /
  second copy is the future fix, whenever it matters).
- **REVISIT TRIGGER:** if an offsite tier is ever added (rclone → cloud), encryption becomes
  **mandatory** there — a cloud bucket is a fundamentally different exposure than a
  credentialed LAN share. age (and the forgery discussion) comes back at that point.

## SMB access (SSOT)

- Credentials: dedicated `pve-smb` user (already created by user). Password never in docs/chat.
- SMB credentials live ONLY on the Proxmox host (CIFS storage config / mount credentials file,
  root-only). Containers never see them.
- Windows side: dedicated share folder, shared only to `pve-smb`. Not "public".
- Mount via Proxmox CIFS storage (preferred — gives UI restore) with `content: backups`.

## Secret locations (record as locations only, never values)

| Secret                          | Location                                                   |
| ------------------------------- | ---------------------------------------------------------- |
| pve-smb password                | Proxmox host only (CIFS storage config / credentials file) |
| CF_API_TOKEN                    | Caddy LXC systemd drop-in (existing, unchanged)            |
| remark42 SECRET + OAuth secrets | remark42 LXC `/etc/remark42.env` (existing, unchanged)     |
| sha256 manifest                 | Proxmox host only                                          |

## Guest inventory (VERIFIED via `pct list` / `qm list` / `pvesm status` on the host)

Documentation previously claimed only 4 guests (caddy, remark42, ha, adguard) — **stale**.
Verified reality: 7 LXCs + 1 VM, all running:

| VMID | Type    | Name        | Notes                                                                                                                             |
| ---- | ------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 100  | VM (qm) | haos        | 32 GB bootdisk; likely the bulk of backup archive size; vzdump is the only practical backup method for HAOS (immutable appliance) |
| 101  | LXC     | zigbee2mqtt | purpose not documented yet                                                                                                        |
| 102  | LXC     | mqtt        | MQTT broker presumably                                                                                                            |
| 110  | LXC     | tg-bot      | purpose not documented yet                                                                                                        |
| 111  | LXC     | remark42    | comments service, 192.168.1.11                                                                                                    |
| 118  | LXC     | 0vibes      | purpose not documented yet                                                                                                        |
| 122  | LXC     | caddy       | reverse proxy + cloudflared, 192.168.1.12                                                                                         |
| 123  | LXC     | adguard     | LAN DNS                                                                                                                           |

All-guests backup mode covers all of the above plus anything created later — no list maintenance.

`pvesm status`: `local` (dir) has ~78 GB available — ample for ~25 GB of plaintext archives.
Backups must target `local` (dir), not `local-lvm` — vzdump archives are files.

## Accepted gaps (explicit, reviewed)

1. **No offsite copy.** Fire/theft/lightning kills both copies. Small irreplaceable data
   (comment dumps, few MB) makes a future offsite tier trivial when decided.
2. ~~**Proxmox host itself not backed up.**~~ **CLOSED (host-config note written).** Host
   facts (network, storage, LVM layout, backup job, crontab customization, guests, repo
   state) from verified live host output.
   Remaining sub-gap: the vault/repo's own off-host backup status is unknown — if the repo
   is local-only, the host note is single-copy too. Also: single-disk host (no redundancy)
   makes the SMB copy the only disaster survivor.
3. **Deletion by valid share credential** (ransomware etc.) possible — Windows-side
   shadow copies / second copy is the eventual answer.
4. ~~Docs inventory gap:~~ **RESOLVED** — guest inventory verified and recorded above
   (7 LXCs + 1 VM; docs previously claimed only 4 guests).
5. **Restore drill not performed (user decision).** Archive streaming/integrity was tested
   successfully (step 7), but no full guest restore (new VMID + boot) was ever executed.
   If a real restore is ever needed, expect some friction; read-only archive check first:
   `zstd -dc <archive> | tar -tf - | head`. This gap is deliberately visible, not closed.

## Implementation progress (verified facts only)

- [x] **Step 3 — CIFS storage registered and verified (2025 session, user-confirmed output):**
      storage ID `lifepc-smb`, type cifs, status **active**. Content: Backup only;
      retention "keep all" left checked (correct — storage must never prune on its own;
      deletion on SMB is exclusively the rsync `--delete` mirror). Mount point:
      `/mnt/pve/lifepc-smb`. Windows side: share `pve-backups` granted only to `pve-smb`.
      Space on SMB: ~291 GB available (of ~487 GB total). Credentials stored by Proxmox
      in root-only storage config; value never recorded in docs.
- [x] **Step 4 — vzdump job retuned and verified (user-confirmed `jobs.cfg` output):**
      `all 1` (all-guests mode, no explicit VMID list), `compress zstd`, `mode snapshot`,
      `prune-backups keep-daily=2,keep-weekly=1`, storage `local`, schedule `04:00`.
      Matches the locked design exactly. Original settings recorded for rollback:
      schedule 04:00, zstd, snapshot, keep-last=2, vmid 100,101,102,110,111,118,122,123.
- [x] **Step 5 — RESOLVED as option A (user decision):** no remark42 timer, no host sweep.
      Comment-data protection comes from remark42's built-in 24h auto-dumps (kept in the
      container, last 10) PLUS the daily 04:00 vzdump archive (whole FS incl. BoltDB, frozen
      at snapshot). Worst-case comment loss window ≈ 24h — explicitly accepted.
      The planned `remark42 backup` timer was abandoned (wrong tool — see corrected section).
      Any `/etc/systemd/system/remark42-backup.service` created during the failed dry run
      must be REMOVED: `rm /etc/systemd/system/remark42-backup.service && systemctl daemon-reload`.
- [ ] Step 6 — host sync script + manifest + timer (SIMPLIFIED: vzdump archives only,
      no remark42 sweep — with option A the sync mirrors /var/lib/vzdump only).
- [x] **Step 6 — host sync implemented and VERIFIED (user-confirmed outputs):**
      `/usr/local/bin/pve-to-smb-sync.sh` + `pve-to-smb-sync.timer` (every 15 min) on the host.
      Corrections made during setup (recorded to avoid re-deriving): (a) local vzdump dir is
      `/var/lib/vz/dump/` (storage.cfg declares `path /var/lib/vz`, archives in its `dump/`
      subdir) — NOT `/var/lib/vzdump`; (b) destination is `/mnt/pve/lifepc-smb/dump/` (Proxmox
      creates `dump/` on backup storages and only indexes archives there — archives at share
      root are invisible to UI restore; initial mis-synced files were `mv`'d into place);
      (c) manifest glob is `*.zst` — VM archives are `.vma.zst`, an earlier `*.tar.zst` glob
      silently skipped haos (VM 100). Verified: full mirror on SMB, manifest lists 7 LXC + 1
      qemu archive, haos manual-run log ended successfully (2.06 GB, 00:00:50), share root clean.
      Note: that 13:36 manual run used the OLD retention (keep-last=2 per its log); the next
      scheduled 04:00 run is the first under keep-daily=2,keep-weekly=1 — check archive count
      after it.
- [x] **Cadence + guard tweak (post-implementation, user-requested):**
      sync timer changed `*:00/15` → `*:30` (hourly at :30, avoiding the 04:00 job window);
      script gained a pre-rsync guard: skip if `/run/lock/pve-manager/vzdump-backup-*.lck`
      exists (vzdump job mid-run) — protects against ever syncing a half-written archive.

- [x] **Step 7 — archive integrity test PASSED (user-executed, output verified):**
      `cd /tmp && zstd -dc /var/lib/vz/dump/vzdump-lxc-111-*.tar.zst | tar -tf - | head`
      streamed the remark42 (111) archive cleanly — zstd decompression + tar listing worked,
      LXC archive structure sane (pct.conf present, full filesystem tree). Covers the
      "archive streams and is extractable" level. NOT covered: full guest restore drill
      (restore under new VMID + boot) — remains available if ever wanted; and the equivalent
      streaming check against the SMB copy
- [ ] Step 8 — final doc status update (done alongside this entry; see status note below).

(Steps 1–2 superseded by the verified inventory above and the completed Windows share.)

## Implementation plan (next steps, one at a time, verify each)

1. Record VMID↔guest mapping (`pct list` / `qm list` on host) + free space check on `local`.
2. Windows side: create share folder, grant only `pve-smb`.
3. Proxmox side: add CIFS storage (pve-smb creds, `content: backups`), verify mount.
4. Retune existing vzdump job: all-guests, keep-daily=2 + keep-weekly=1, confirm
   zstd + snapshot mode (snapshot mode guarantees consistent BoltDB inside archives).
5. remark42 LXC: systemd timer for `remark42 backup` (4h); verify dumps appear.
6. Host: sync script (rsync --ignore-existing --delete, flock, warning-not-failure on
   unreachable SMB) + manifest update + timers (sync 15–30 min; sweep 4h).
7. **Verification: one test restore** — restore a guest from local AND decrypt-check
   (extract a file from) the SMB copy. A backup never restored is a hope, not a backup.
8. Update `PLAN.md` and `docs/REMARK42.md` status lines to "implemented + verified".

## Historical context (preserved from the earlier draft, superseded decisions)

- The original draft proposed two tiers: vzdump → Windows SMB (tier 1) + rclone crypt →
  Google Drive (tier 2). GDrive tier was never decided; SMB tier survived in modified form
  (local-primary, no encryption). rclone/B2/Wasabi/USB-rotation options remain documented
  candidates for any future offsite tier.
- Open questions from the original draft, now all answered: Windows 24/7 → ~80% real uptime,
  24/7 in theory; GDrive → deferred with the whole offsite tier; retention → 2d+1w confirmed.
