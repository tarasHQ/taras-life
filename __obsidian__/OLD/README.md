# Quartz v5

> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.

🔗 Read the documentation and get started: https://quartz.jzhao.xyz/

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

## Website build and deployment

After installing dependencies with `npm ci`, build this website from the repository
root:

```sh
npm run build
```

npm automatically runs `prebuild` first. The complete sequence is:

```text
Install remote plugins from quartz.lock.json
  -> Compile local plugins
  -> Build the Quartz website into public/
```

The commands are chained so a failed plugin installation or compilation stops the
build instead of deploying a website with missing components. Extra Quartz build
arguments can be passed through, for example `npm run build -- --serve`.

### Adding a local plugin

Register and enable the plugin in `quartz.config.yaml`. If it needs compilation,
add its build command to `build:local-plugins` in the root `package.json`, using
`&&` between commands. For example:

```json
"build:local-plugins": "npm --prefix custom-plugins/remark42 run build && npm --prefix custom-plugins/another-plugin run build"
```

Keep prerequisite plugins first if build order matters. New local plugins must
have their required dependencies installed and expose the build command used here;
this step does not install a separate dependency tree for them. Remote plugins
continue to use Quartz's normal plugin configuration and lockfile workflow.

### Cloudflare Workers

Set the Cloudflare build command once to:

```sh
git fetch --unshallow && npm run build
```

The fetch prefix preserves the existing shallow-clone handling for git-based
content dates. It is intended for Cloudflare's shallow checkout; use `npm run build`
directly in an already complete local clone.

Keep the deploy command as `npx wrangler deploy`. Cloudflare already installs the
root dependencies before the build. Future local-plugin build changes belong in
`package.json`, not in the Cloudflare dashboard. Commit the source changes, not
the plugins' generated `dist/` directories.

To roll back this build integration, restore the previous Cloudflare build command
and the previous root npm scripts. No Remark42 server configuration is affected.

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/jackyzha0">
    <img src="https://cdn.jsdelivr.net/gh/jackyzha0/jackyzha0/sponsorkit/sponsors.svg" />
  </a>
</p>
