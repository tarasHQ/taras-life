# Single-Binary Bundling (Node-land)

> Status: IDEA — not started, no code touched.
> Origin: "Is it worth rewriting `packages/server` in Rust?" → deployment topology → single-binary distribution.
> Related: AGENTS.md §2 (stack), §5 (topology), §7.5 (worker boundary).

---

## 1. Motivation

- Users should not need Node.js/pnpm installed to run Axon components.
  - **Worker is the pressing case**: it runs on arbitrary target machines (PCs, laptops) and today requires Node ≥24 + tsx + ripgrep on PATH.
  - **Server** runs on a controlled 24/7 host — Docker/OCI is an acceptable interim "single unit".
- Secondary: ripgrep as an external system dependency (resolver + install-UX exists, but bundling removes the failure mode entirely).
- Current state fact: there is **no production deployment story at all** — server serves only API routes + `/health` (`packages/server/src/http/server.ts`), client `dist/` is served by nothing, no Dockerfile/proxy config in repo. Single-binary packaging = _designing_ the story, not migrating it.

---

## 2. Conclusion (TL;DR)

1. **Rust full rewrite: ruled out for now.** No measured performance driver (no profiling exists in repo), workload is IO-bound, and the shared-contract coupling tax (~120 server files importing `packages/shared`) lands at max protocol volatility. Rust stays parked as a narrow future option (worker seam + static linking + embedded ripgrep) only if memory/scale/embedding drivers appear. See §9.
2. **Bun is the best ergonomics, not the best risk fit.** It is a runtime _reimplementation_; the "99% compatible" tail (streams/timers/fs/worker edge behaviors, native addon loading) conflicts with `Explicit Failure & Determinism` and `Cross-Platform Parity`. Bun becomes legitimate only _after_ the de-native pass (§5), as an A/B candidate — not as the default bet.
3. **Preferred path: real-Node packaging** — `@yao-pkg/pkg` primary (batteries included, auto native-addon handling), official **Node SEA** as the zero-magic alternative (more plumbing). Sequenced **worker-first** because the worker has zero native dependencies.

---

## 3. Key Finding: Two Binaries, Two Risk Profiles

Packaging risk in Node-land concentrates almost entirely in **native addons (`.node` files)**. Verified inventory:

- `packages/server` natives (server-only): `better-sqlite3`, `argon2`, `sharp` (+ libvips platform DLLs).
- `packages/worker`: `ws`, `dotenv`, `isbinaryfile`, `uuid`, `shared` — **zero native code** → packable today by anything at near-zero behavioral risk.

Consequence: **the binary users most need (worker on arbitrary machines) is also the safest one to build.** The server can stay Docker/pnpm until binary packaging is proven.

### Today's runtime topology

```
USER MACHINES                          SERVER MACHINE (24/7)
┌────────────────┐ ┌───────────────┐   ┌─────────────────────────────────┐
│ Browser tab     │ │ VSCode host    │WS │ Node ≥24 + pnpm + repo           │
│ (client2 JS)    │◄┤ (extension.js) ├┴─►│ ┌─────────────────────────────┐ │
└────────────────┘ └───────────────┘   │ │ server  (tsx, Node)          │ │
┌────────────────┐                     │ │  · better-sqlite3 / argon2   │ │
│ worker          │◄───────────────────┼─│  · sharp (libvips DLLs)      │ │
│ (tsx, Node ≥24) │  ws: commands      │ └─────────────────────────────┘ │
└────────────────┘                     │ + ripgrep + OS dialog tools     │
                                       └─────────────────────────────────┘
client source ──vite build──► dist/  (served by nothing today)
```

### Target topology (Node-land)

```
SERVER MACHINE                          TARGET MACHINE(S)
┌─────────────────────────────┐        ┌────────────────────────┐
│ axon-server binary OR Docker │        │ axon-worker binary      │
│  · HTTP + WS                 │        │  · file ops, dialogs    │
│  · SQLite (in-process)       │◄──ws──►│  · ripgrep: embedded    │
│  · client dist/ as assets,   │        │    asset → ~/.axon/bin  │
│    served by the server      │        │    (existing fallback)  │
└─────────────────────────────┘        └────────────────────────┘
Browser tab → http://host:PORT — no install
VSCode: .vsix — runs on VSCode's own host (unchanged, already Node-free for users)
```

---

## 4. Packaging Options Compared

| Tool | What you ship | Runtime fidelity | Cross-compile | Native addons | Verdict for Axon |
|---|---|---|---|---|---|
| **@yao-pkg/pkg** | **Stock Node binary** + bundled JS; assets extracted at first run | ✅ It _is_ Node | ✅ Via prebuilt base binaries per target | ✅ Automatic (snapshot → extract → load) | **Primary choice.** Actively maintained fork; classic use case is exactly our addon set. ⚠️ original `vercel/pkg` is archived — do not use |
| **Node SEA (official)** | Stock Node binary + injected blob (`postject`) | ✅ Real Node | ⚠️ DIY CI matrix | ⚠️ Ship as SEA `assets`, extract to real file yourself (dlopen needs a real path) | Zero-magic alternative; most plumbing; CJS entry (modern `require(esm)` mitigates); macOS notarization DIY |
| **Deno `deno compile`** | Deno binary | ⚠️ Reimplementation (npm-compat) | ✅ Limited targets | ⚠️ N-API supported, less battle-tested | Adds second runtime + lockfile for marginal gain over yao-pkg here |
| **Bun `bun build --compile`** | Bun binary | ⚠️ Reimplementation | ✅ Best-in-class, one command | ✅ Embedded + auto-extracted | Best DX; risk = reimplementation tail. Re-evaluate as A/B _after_ de-native pass |

Principle tie-in: `Explicit Failure & Determinism` + `Cross-Platform Parity` favor shipping **real Node** over adopting a second runtime's behavior surface — especially for the component whose job is being the deterministic state authority. Bun's risk is not "will it start" but "will some stream/fs edge case behave 0.5% differently under load, on one platform, three months from now."

---

## 5. De-Native Pass — the lever that makes packaging boring

Goal: remove native `.node` dependencies from the server so that **any** packer (incl. SEA with zero assets, and Bun) becomes low-risk. Also removes the native-addon rebuild matrix as a maintenance burden on its own merits.

1. **`better-sqlite3` → `node:sqlite`** (built into Node ≥24; synchronous API; `@types/node@26.6.2` already ships `sqlite.d.ts`).
   - ⚠️ **UNVERIFIED**: whether installed `drizzle-orm@0.45.2` exposes a `node:sqlite` driver. Vendored docs (`docs/drizzle/references/`) cover only `better-sqlite3` / libsql / bun-sqlite. 5-minute check: does the `drizzle-orm/node-sqlite` export exist at our pinned version? If not → this swap is off the table at this pin.
2. **`argon2` → `hash-wasm`** (pure WASM argon2). Slower per hash; irrelevant at login/signup frequency. One less `.node` file.
3. **`sharp`** — the stubborn one (libvips). Options:
   - Keep it: yao-pkg extracts it fine (classic pkg use case), or
   - Replace with WASM codecs (`@jsquash/*`) **if** thumbnails are the only consumer — decide by measuring thumbnail workload first.
4. **ripgrep**: use `@vscode/ripgrep` prebuilt binaries, self-provision into `~/.axon/bin` on first run. The server resolver already checks that path as fallback #3 (`packages/server/src/utils/ripgrep.ts`: `RIPGREP_PATH` → `PATH` → `~/.axon/bin/rg`) — **no resolver changes needed**; existing error UX covers provisioning failure.

After (1)–(3): server is pure JS + WASM → SEA needs zero assets, yao-pkg becomes trivial, and **Bun's remaining risk surface shrinks to pure-JS behavior**, which is testable by running the existing vitest suite inside the packed binary.

---

## 6. Recommended Sequence (skeleton)

1. **Spike (~1 day)**: pack the worker (SEA and Bun, compare) and the server (`@yao-pkg/pkg`). Run acceptance criteria from §7.
2. **Decision gate A**: if _worker binary + Docker server_ covers the actual distribution need → stop; ship the worker binary only. (Likely outcome — user-facing win at ~zero risk.)
3. If the server binary is wanted: **de-native pass first** (starting with the drizzle/`node:sqlite` verification), then choose the packer with spike data in hand.
4. Optional: A/B Bun vs real-Node builds in CI after de-nativing.

---

## 7. Spike Acceptance Criteria

- Full `vitest` suite green **inside** the packed artifacts.
- better-sqlite3 writes persist across restart; sharp produces thumbnails; argon2 verify works; WS sync + tool-call chunk streaming behave identically.
- Cold start time + binary size measured (expect ~80–110MB for Node-based builds; similar for Bun).
- CI matrix: Windows / Linux / macOS × x64 / arm64.
- **Signing/notarization budgeted**: macOS Gatekeeper + Windows SmartScreen are real per-platform costs for _any_ single-binary distribution (including Rust). Not an afterthought.

---

## 8. Unverified / Version-Sensitive Claims

Everything below must be replaced by spike measurements — statuses drift fast and were not web-verified at writing time:

- Bun + `sharp` current compatibility status.
- `@yao-pkg/pkg` support for the newest Node 24.x line.
- Node SEA ESM specifics on Node 24.
- Deno 2 native addon maturity.
- `drizzle-orm@0.45.2` `node:sqlite` driver existence (see §5.1).

---

## 9. Why Rust Stays Parked (compact record)

- Workload is **IO-bound**: wall-clock dominated by LLM network streams + SQLite; Rust can't accelerate remote latency.
- Heavy natives are **already native** (`sharp`→libvips, `better-sqlite3`→C) — a rewrite re-wraps the same C libraries.
- **Shared-contract tax**: ~115–120 server files import `packages/shared` (types, consts, sync protocol, RPC guards, error codes). Rust ⇒ either duplicated contracts (blind seam, drift) or a permanent codegen subsystem — at maximum protocol volatility (worker protocol is mid-"Phase 6").
- Event-loop hazards are localized and cheaper to fix in-place: sync Brotli ≤50MB blobs (`storage/store.ts`), blurhash, diff generation, ripgrep output parsing (~37K files / 120–160ms documented in `utils/ripgrep.ts`) → `worker_threads` / async IO.
- Remaining Rust case (parked, not dead): **worker seam only** — narrow contract (`shared/src/worker.ts`), single static binary, embedded ripgrep as a _library_ — and only after that protocol stabilizes and if memory/scale/embedding drivers materialize.
