## Vault's HOWs and WHYs

## Settings

- ### Appearance
  - showing title of note as h1 header at the top
    - Disabled in CSS snippet by default. But shows up for some files (like \_reflections/).

## Plugins

- ### `JSEngine`
  - for Meta Bind scripts, it only supports this one.
- ### `CustomJS`
  - for dataview.js helper scripts (allows to keep note files lean)
  - major feature is hot-reload of scripts on changes (debounced for a few seconds)
- ### `Iconic`
  - some CSS styles depends on overridden selectors this plugin does.
- `Git`
  - For automatic backups
  - Only main PC uses git. Because it has symlinks and full situation for the sync.
- `Code Block Fold`
  - I'm often navigate in the file using arrows, this plugin prevents unfolding metabind button's codeblocks.
