---
status: waiting
state: high-level
reviewedAtStep: ""
---

[← PLAN](../_plan_001.md)

## Description
Defines the only way the site is allowed to configure the plugin, and makes misconfiguration impossible to ignore. It closes the option surface to a handful of validated keys with a single escape hatch, and puts the defaults in the manifest so the site config only states what differs.

## High-Level

### Intended outcome
- A closed surface: `host`, `siteId`, `threadBaseUrl`, `no_footer` (default `true`), `custom_properties` (default `{}`), plus `config` merged last.
- A deliberately broken option stops the build with a message naming the key, the expected type and where it came from — a mechanism that has been *verified* to abort, not assumed to.
- Passthrough values stay scalar, because they are URL-encoded into the iframe `src`.
- `quartz.config.yaml` reads at a glance: no option is present that merely restates a default.

### Local invariants
- `host` is always explicit and absolute. The module's hardcoded fallback (`https://comments.taras.life`) must never be the reason comments work.
- Validation runs once per build, not per rendered page.
- `no_footer` and `custom_properties` are passed through unchanged into the embed configuration.
- Unknown keys inside `config` are allowed — they are for Remark42's future options — and must not shadow curated keys.

### Should NOT be done in this step
- New Remark42 features of any kind.
- Styling or theme work.
- Frontmatter / identity changes (step 04).
- Runtime loading logic (step 06).

## Discussion & Reflections

1. **The fail mechanism.** Quartz catches plugin instantiation errors and continues, so "throw and hope" is not a plan.
   - (a) `console.error` plus a visible message on the page — always visible locally, but a broken deploy can still ship.
   - (b) Throw at module import time — earliest possible, but some loader paths catch import errors.
   - (c) Throw inside the component factory, which runs while the layout is built — likely uncaught, but later.
   - **Recommend:** break one option on purpose, observe all three, then keep the earliest throw that really aborts `quartz build`. Report back if none does.

2. **Where defaults live.**
   - (a) Manifest `defaultOptions` only — SSOT, but the plugin breaks if a default is missing there.
   - (b) Code constants only — works standalone, but the surface is invisible from YAML.
   - (c) Both — two places to keep in sync.
   - **Recommend (a)**, plus a startup assertion that every curated key has a default.

3. **Typo detection inside the passthrough.**
   - (a) Accept anything — flexible, typos are silently ignored by Remark42.
   - (b) Warn on passthrough keys that resemble curated ones.
   - (c) Maintain an allowlist of documented Remark42 keys and warn on anything outside it — safer, but rots as Remark42 evolves.
   - **Recommend (b).**

4. **Is `threadBaseUrl` an option at all?**
   - (a) Explicit option — portable, and the frozen-URL invariant is visible.
   - (b) Derived from the site's `baseUrl` — less config, couples the plugin to site identity.
   - (c) No option, always the current site URL — breaks the frozen-URL invariant if the domain ever changes.
   - **Recommend (a).**

_Reflection:_ (optional — compact notes from the user)
