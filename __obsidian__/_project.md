# Project "taras.life"

## YOUR reasons to work on it

- Website is the public face of your project. If it's bad - people will leave this idea long before they read a single page about it on the website
- It's nice to be a part of community. If you want to create one - you must be smart about it, without this project OR this flow of planning - you'll be doing rushed and poor decisions that definitely won't help anyone.


## Docs

```dataview
TABLE WITHOUT ID
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/_reflections")), (f) => f.link) AS "Reflections",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/ideas")), (f) => f.link) AS "Ideas",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/artifacts")), (f) => f.link) AS "Artifacts"
FROM ""
WHERE startswith(file.folder, this.file.folder + "/") AND file.path != this.file.path
SORT file.name ASC
GROUP BY true
```


## Phases

### Phase 002 - Removing SCSS, Theming, Fonts plugin [open](./phases/002/_plan_002.md)
Native CSS has many features where SCSS were pioneering. So doesn't make any sense to support things I have 0 experience with. 
Theming and fonts just overlap scss, so they will go in this phase too.

### Phase 001 - Remark42 plugin rewrite [done](phases/_archived/001/_plan_001.md)
Remark42 plugin rewritten from scratch as a self-contained compiled package (`custom-plugins/remark42/`), shipped and documented. Deferred to future work: visual polish


