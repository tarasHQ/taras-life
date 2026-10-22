# Local Remark42 integration

Custom code for this website, separate from Quartz's own plugins and its disposable
`.quartz/plugins/` installation cache. This private package requires no npm
publication or separate repository.

## Status

The original shell was verified in local Quartz preview: a note with `comment-id`
showed the placeholder, and removing the ID hid it. The real widget implementation
is written and the user confirmed all 21 automated tests pass, including type-check
and build. **Actual browser verification is still pending.**

## How it works

1. The build-time component renders a container for an opted-in content note.
2. Quartz distributes a small shared browser bootstrap on all pages.
3. On `nav`, that bootstrap looks for the container. No container means no
   Remark42 download or request.
4. When present, it asynchronously loads the documented `/web/embed.mjs` module
   and creates an instance with the container's explicit thread URL.
5. `prenav` destroys the old instance. A generation check discards stale download
   continuations, even if navigation occurs before the module finishes loading.
6. Quartz's `themechange` event updates the widget theme. Theme is also read after
   loading, so changes during a slow download are respected.

The module's script tag persists across SPA navigation. A failed load displays an
error within the comments container, not in place of the article. Downloads time
out after 20 seconds and can retry on a later navigation or full page refresh.
No global `remark_config` is injected: the documented SPA API receives configuration
explicitly when creating each instance.

## Configuration and identity

The registered entry in `quartz.config.yaml` uses public settings only:

```yaml
- source: ./custom-plugins/remark42
  enabled: true
  options:
      host: https://comments.taras.life
      siteId: taras-life
      threadBaseUrl: https://taras.life/comments
  layout:
      position: afterBody
      priority: 20
```

Non-content layouts are excluded separately in `layout.byPageType`.

Add a permanent string ID to an ordinary note's existing frontmatter:

```yaml
comment-id: "a-stable-unique-id"
```

Its thread URL becomes `https://taras.life/comments/a-stable-unique-id`. It is an
identifier, not the current article address. Moving/renaming the note must preserve
its ID. Missing, non-string, empty, or URL dot-segment (`.` / `..`) IDs render no
widget; there is never a page-URL fallback. Surrounding whitespace is trimmed and
URL punctuation is encoded as one segment. `comments: false` is an additional
explicit opt-out.

`src/identity.ts` is the shared thread-URL helper for this embed and future counters.
The component scans published metadata once per array/rebuild and warns about
duplicate IDs: collisions share a thread. Private/filtered notes absent from that
metadata are not scanned. Redirects from synthetic thread URLs to current note
addresses are not implemented yet, so links in Remark42 RSS/notifications may lead
to synthetic URLs that do not resolve as article pages.

Counters and recent-comments UI are deferred. They will need their own container
rendering and initialization; simply adding a span does not enable those features.

## Verify locally

From the website repository root, with its usual dependencies installed:

```sh
npm --prefix custom-plugins/remark42 test
```

This type-checks source, builds with the host's esbuild, and runs component,
identity, and simulated browser lifecycle tests. Tests do not contact Remark42,
start OAuth, or create stored comments. No new dependencies are needed.

Build without checks:

```sh
npm --prefix custom-plugins/remark42 run build
```

After checks pass, restart the local preview:

```sh
npx quartz build --serve
```

The temporary `content/remark42-shell-test.md` now has the dedicated
`remark42-shell-test` ID enabled for browser testing. The real widget will contact the production
Remark42 endpoint, and any comments submitted from local preview are stored on
that server. Use a dedicated test ID, not an existing article's identity.

## Build and deployment

The local build injects the browser bundle as a resource string on the component;
it does not execute browser code in Node. Preact stays external to share the
host's runtime. Type-only imports reference the host's component interfaces.

Quartz links this local source but does not compile it during the website build.
From the repository root, use `npm run build`: its `prebuild` hook installs remote
plugins and runs `build:local-plugins`, which compiles Remark42 before Quartz.
A failed plugin build stops the sequence. Direct `npx quartz build` still bypasses
that npm hook, so compile this plugin separately first when using that command.

See the root [README](../../README.md#website-build-and-deployment) for the one-time
Cloudflare build-command setup and how to add more local plugins to the build.
The Workers deploy command remains `npx wrangler deploy`.

On this Windows machine, automatic symlink creation failed with EPERM. A manual
directory junction `.quartz/plugins/remark42` pointing to `custom-plugins/remark42`
resolved it without administrator builds. If the cache is removed, the junction
must be recreated. On systems that permit normal symlinks the loader creates its
own link.

## Rollback

Set `enabled: false` for this plugin in `quartz.config.yaml` and restart the preview
(or rebuild/redeploy if previously published). No running server configuration is
changed by the plugin. Disable the entry before removing its source directory.
The temporary test note can be deleted after verification.
