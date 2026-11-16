# `_static/scripts`

## Tips

- `require()`, `path`, `app.vault.adapter.getBasePath()` - have issues on iOS. So avoid those in scripts.
- **Config at the top** - all configurable values should be at the top CFG const, so it's easy to configure scripts.
- **<> Tags Ban** - Don't use `<>` tags inside js comments (templater js), to mark some adjustable value it breaks markdown rendering after those tags in obsidian.
