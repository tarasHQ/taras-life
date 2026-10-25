## Frontend 

### Themes & Fonts
#### Excerpt from docs
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


## Backend

### config

|                 |                  |         | Kinda interesting, 200h is like a week or so. Too little. Maybe a month is better? Or even a year? It's low-threat anyway.<br>But also I'm not sure it work like that. Like if cookie is dead will it sign out the user automatically? |
| --------------- | ---------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| auth.ttl.cookie | AUTH_TTL_COOKIE  | `200h`  | TTL of the server-set auth cookie. Note it does not govern the cookie the frontend writes under `auth.send-jwt-header`, which is fixed at 200h                                                                                         |
|                 |                  |         |                                                                                                                                                                                                                                        |
|                 |                  |         | It should be enabled. So it's easy to comment. Spam is unlikely.                                                                                                                                                                       |
| auth.anon       | AUTH_ANON        | `false` | enable anonymous login                                                                                                                                                                                                                 |
|                 |                  |         |                                                                                                                                                                                                                                        |
|                 |                  |         | 10k chars is better for long-ish discussions... maybe?                                                                                                                                                                                 |
| max-comment     | MAX_COMMENT_SIZE | `2048`  | comment's size limit                                                                                                                                                                                                                   |
|                 |                  |         |                                                                                                                                                                                                                                        |
| anon-vote       | ANON_VOTE        | false   | (requires votes ip), but also ability to vote is kinda gimmick of registration. So why not to keep it behind signup.                                                                                                                   |
|                 |                  |         |                                                                                                                                                                                                                                        |
|                 |                  |         | should be an hour maybe? to make it more flexible?                                                                                                                                                                                     |
| edit-time       | EDIT_TIME        | `5m`    | edit window; set to `0` to disable comment editing and staged image cleanup                                                                                                                                                            |
|                 |                  |         |                                                                                                                                                                                                                                        |
|                 |                  |         |                                                                                                                                                                                                                                        |
|                 |                  |         | true                                                                                                                                                                                                                                   |
| admin-edit      | ADMIN_EDIT       | `false` | unlimited edit for admins                                                                                                                                                                                                              |
|                 |                  |         |                                                                                                                                                                                                                                        |
|                 |                  |         | true, why not?                                                                                                                                                                                                                         |
| emoji           | EMOJI            | `false` | enable emoji support                                                                                                                                                                                                                   |

### Oauth
- Would be nice to add all of them, or most.

### Notifications
yeah, to notify admin in the first place. HUGE. Because there's hundreds of pages, if user comments - hard to see where the comment happened. But with these notifications - it may help start discussion.

#### telegram channel for notifications would be nice as well
- not only for you, people can join too and follow discussions around the site (if there will be any)
- you can add concise link somewhere on top of the comments section to that channel.
