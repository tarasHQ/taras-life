## Notes

- Proxmox host always-on mini PC (N100) + on like 3kWh battery.
- Caddy + AdGuard + Domain = local websites with https:// access (so no warnings/popups + some advantages for PWA apps)
- Structure of pve - each one in separate LXC + haos in vm. Feels simpler and more reliable in comparison with docker mega-lxc.
  - caddy, adguard, haos(+z2m and mqtt), telegram bot that parses blackout times, remark42 and "the project"'s test machine for unix compatibility.

## Reinstall notes

- Figure out proper networking rules. Don't use dhcp. use static IPs outside of the dhcp range.
- check cron
  - `@reboot (sleep 60 && echo "conservative" | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor)`— CPU frequency governor set to `conservative` at every boot (mini-PC fan/noise/heat choice)
  - `*/5 * * * * /root/ha_post_temp.sh` — script run every 5 minutes posts temperature data related to haos
- for caddy and https I was doing something with ACME on proxmox for both accounts and challenge plugins.
- `unattended-upgrades` on both caddy and remark42 lxcs
  - `bookworm-security` + cloudflare tunnel on caddy

## Backups

- backups
  - `vzdump` 2 daily + 1 weekly. All containers/vms. With zstd compression. Snapshot. Using smb to rsync mirror those on another pc in local net, `iniOnCalendar=*-*-* *:30:00` - hourly at X:30, so it won't accidentally interfere with backup job and also flexible in case I change backup time and forget about this job.
  - smb added persistently as cifs storage and is protected by specific user account with limited set of permissions.
  - TODO: Now I have 6 copies of my data. last 2 days + weekly on proxmox and mirrored on smb (another device). To have that 3 2 1 rule - I need to setup cloud sync and probably buy storage as well.
  - it is mirror - so it removes files on smb if they don't exists on pve

### Backup decisions

(to avoid re-discussing the same thing.)

| Decision                        | Choice                                                                     | Why (short)                                                                                                                                                                                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full vzdump vs file-level tiers | **vzdump-only daily** + small remark42 dump layer                          | it's PIA to setup backups per container/vm. Vzdump takes like 100x more space, but still it's 10gb at max in current state of things. 30gb of 2+1. So it's nothing but significantly reduces complexity and increases reliability.                                  |
| Where archives live             | **Local primary, SMB secondary**                                           | Local-first means a failed SMB sync never fails the backup itself (graceful degradation). Also fastest restore path.                                                                                                                                                |
| Schedule coupling               | **None.** Sync is periodic/idempotent (15–30 min), independent of job time | Changing job time (04:00 → 10:00) breaks nothing; sync catches up on its own schedule; SMB downtime = delayed copy, not failure.                                                                                                                                    |
| VMID list in job                | **"All guests" mode**                                                      | All. Just to not have any headache with keeping selected lxc synced and then forgetting to add new ones.                                                                                                                                                            |
| Encryption                      | **DROPPED (for now)**                                                      | Minor PIA to do proper sync of encrypted data. SMB is encrypted, so is proxmox. If people got their hands on those files - then I'll have much bigger problems. And on top of it - there's nothing important in those containers that can make the situation worse. |
| TODO Encryption                 | **TODO if cloud is added**                                                 | Different exposure. If that data will be backed up on cloud - I NEED encryption 100%.                                                                                                                                                                               |
| Restore from SMB                | **Register share as Proxmox CIFS storage**                                 | Plaintext archives with intact `vzdump-*.tar.zst` names are indexed by Proxmox UI → one-click restore from either copy. (Earlier "don't register" advice was encryption-driven and is now void.)                                                                    |
| Integrity                       | outdated - **sha256 manifest, host-only**<br>current - none                | Detects SMB-side corruption/bit-rot/tampering at restore-from-SMB time. Not anti-forgery (moot without encryption).<br>UPD. Was minor PIA to setup properly, so just deferred it.                                                                                   |
| Retention                       | local: keep-daily=2 + keep-weekly=1; SMB mirrors it via `--delete`         | Mirror semantics, no accumulation museum.                                                                                                                                                                                                                           |
| remark42 frequency              | 24h dumps, last 10 (remark's own MAX\_BACKUP\_FILES)                         | User chose 24h; hourly was considered and declined.                                                                                                                                                                                                                 |
| Offsite tier                    | **Not now — accepted gap**                                                 | Same-house single point of failure accepted explicitly.<br>But it would be nice to have cloud setup too. Not that hard as well.                                                                                                                                     |
