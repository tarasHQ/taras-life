# Remark42 loader regression fixture

`remark42-v1.18.0-embed.mjs` is the unmodified public loader captured from
`https://comments.taras.life/web/embed.mjs`, served by the recorded Remark42
v1.18.0 deployment. The diagnostic download lives at
`docs-external/remark42-live-embed.mjs`; the fixture is kept here so the local
plugin's tests are self-contained and do not depend on that diagnostic file.

Runtime tests execute the captured loader in a Node VM with simulated browser
objects. Creating fake scripts/iframes makes no network requests. This catches
bootstrap assumptions that a hand-written API mock would miss: configuration
must exist before evaluation, the first instance is automatic, and `node` is not
the container-selection mechanism in this deployed loader.

**Why this lives outside the `test/` directory:** Node's test-runner discovery
runs every `.js`/`.mjs` file inside any directory named `test` as if it were a
test file