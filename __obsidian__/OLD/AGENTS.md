# AGENTS.md

Personal blog built with **Quartz v5**, deployed to **Cloudflare Workers**.

- Content lives in `content/`, Quartz engine in `quartz/`, config in `quartz.config.yaml`, deployment via `wrangler.jsonc`.
- Comments are **self-hosted Remark42**, running at the author's home, exposed publicly via a **Cloudflare Tunnel** only.

→ For the Remark42 self-hosting setup, architecture, status and working agreements, see [REMARK42.md](REMARK42.md).

---

Cloudflare settings

webanalytics' beacon js script interfers with comments.taras.life icons, so I used rule configuration to disable RUM when host == comments.taras.life.

Uptime monitoring

UptimeRobot (free tier) monitors `taras.life` (keyword check on HTML) and
`https://comments.taras.life/api/v1/ping` (keyword `PONG`), 5-min interval, email alert.
Probes from the internet → each check exercises the full public path
(DNS → Cloudflare edge → tunnel → cloudflared → Caddy → remark42), not just the
remark42 process — a tunnel or Caddy failure also triggers the alert.
Verified once by `systemctl stop remark42` (down + up alerts received).

---

Links
C:\Users\Taras\Documents\obsidian-vault\_static\projects\PLANNING.md - SSOT document on planning.
