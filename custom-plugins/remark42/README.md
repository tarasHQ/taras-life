# Remark42 README

1. Frontmatter - those that have a valid `a-z,0-9,-` id and either don't have `comments` or it's `true` 
	- if id is not valid - build fails loudly. So those rare mistakes won't accumulate.
2. Valid id? - injects into notes's html section wrapper, script and div with id `remark42`. 
	- Script is needed to avoid calling server on pages without comments (at all or in view), despite recommended suggestion from docs to attach `embed.mjs` on every page.
3. Deployed - scripts handles theming/config but also loading based on viewport. If comments few hundred px away - it won't load them. So no unnecessary server traffic. But when user interested in comments - they'll get loaded as he scrolls to that section. 

- `npm run build:plugins` to compile plugins
- `npm run check:comments` - duplication, `comments`/`id` frontmatter contradictions and spot check on generated html. Manual script to not increase time on each build for no good reason.

- Configuration is hardcoded in in `src/index.tsx`. Nothing in `quartz.config.yaml` to avoid bloat of parsing/validation/etc.
- Threads are keyed by `https://taras.life/comments/<id>` changing `THREAD_BASE_URL` or `id` values silently orphans the entire comment history
- 404 page carries "universal" comments thread for reporting broken links.













---

RAW Features Below

---
### Code
- Check logic can be integrated into build. With caching allFiles to speed it up. But that needs separate building flows, so that check won't re-run on GH or CF, so it's not worth to do right now. 


### Frontend 
Anything besides `custom_properties` is PIA. 
So don't go beyond there. 


#### Themes & Fonts
##### Excerpt from docs
To match the widget's font to your site's, set `remark_config.custom_properties['--font-family']`  
to the font your site uses. You don't need to modify or rebuild Remark42 itself to do this:

```js
var remark_config = {
	host: "REMARK_URL",
	site_id: "YOUR_SITE_ID",
	custom_properties: {
		"--font-family": "Georgia, serif",
	},
}
```

The widget reads this once, when it loads. Changing it after the widget is already showing has no  
effect until the page is reloaded.

**Note:** `custom_properties` technically accepts any CSS custom property the widget's stylesheets  
define (see `custom-properties.css`), not only `--font-family`. Only `--font-family` is supported,  
though — `--font-size`, for example, isn't wired to anything: most components hardcode their own  
font-size instead of reading a variable, so setting it has no visible effect. Even a property that  
does work today isn't guaranteed to keep working, or keep meaning the same thing, in a future  
version. Treat anything beyond `--font-family` as unsupported and best-effort, not a documented API.

**Note:** `__colors__` is an older name for the same option. It still works, kept as an alias, but  
use `custom_properties` for anything new.


### Backend

#### config
* **`auth.ttl.cookie` / `AUTH_TTL_COOKIE**`
* **Default / Value:** `200h`
* **Description:** TTL of the server-set auth cookie. Note it does not govern the cookie the frontend writes under `auth.send-jwt-header`, which is fixed at 200h.
* **Notes:** Kinda interesting, 200h is like a week or so. Too little. Maybe a month is better? Or even a year? It's low-threat anyway. But also I'm not sure it works like that. Like if cookie is dead will it sign out the user automatically?


* **`auth.anon` / `AUTH_ANON**`
* **Default / Value:** `false`
* **Description:** Enable anonymous login.
* **Notes:** It should be enabled. So it's easy to comment. Spam is unlikely.


* **`max-comment` / `MAX_COMMENT_SIZE**`
* **Default / Value:** `2048`
* **Description:** Comment's size limit.
* **Notes:** 10k chars is better for long-ish discussions... maybe?


* **`anon-vote` / `ANON_VOTE**`
* **Default / Value:** `false`
* **Description:** (Requires votes IP), but also ability to vote is kinda gimmick of registration. So why not keep it behind signup.


* **`edit-time` / `EDIT_TIME**`
* **Default / Value:** `5m`
* **Description:** Edit window; set to `0` to disable comment editing and staged image cleanup.
* **Notes:** Should be an hour maybe? To make it more flexible?


* **`admin-edit` / `ADMIN_EDIT**`
* **Default / Value:** `false`
* **Description:** Unlimited edit for admins.
* **Notes:** True.


* **`emoji` / `EMOJI**`
* **Default / Value:** `false`
* **Description:** Enable emoji support.
* **Notes:** True, why not?

### Oauth
- Would be nice to add all of them, or most.

### Notifications
yeah, to notify admin in the first place. HUGE. Because there's hundreds of pages, if user comments - hard to see where the comment happened. But with these notifications - it may help start discussion.

#### telegram channel for notifications would be nice as well
- not only for you, people can join too and follow discussions around the site (if there will be any)
- you can add concise link somewhere on top of the comments section to that channel.

---

### Security
There's some more stuff that can be done. You know a few. 
Also read --trusted-proxies in docs, it has some interesting nuance with headers. 
Just don't forget about it. 
You can't do much, but that doesn't meant your comments server must stand there with bare ass to all "threats".
