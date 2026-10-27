# OpenAI OAuth (Server Flow) — Log Token Only Plan

## Goal

Implement a **minimal server-side OAuth flow** for OpenAI that completes auth code exchange and then **logs the access token** using the server logger.

After that, token management is manual:

1. Copy token from server logs
2. Paste into env as `OPENAI_OAUTH_TOKEN`
3. Use it from provider config (`oauthToken` field)

---

## Hard Constraints (as requested)

- **No DB changes**
- **No provider credential store abstraction**
- **No versioning fields or migration prep scaffolding**
- **No automatic token persistence by server**
- Keep implementation integrated into current flow

---

## Scope

### In scope

- Server OAuth authorize route
- Server OAuth callback route
- In-memory pending OAuth transaction state (TTL-based)
- Token exchange with provider token endpoint
- Server logging of token on successful callback
- Minimal config support to consume `OPENAI_OAUTH_TOKEN`

### Out of scope

- DB persistence of OAuth tokens
- Refresh-token lifecycle automation
- OAuth connection UI management/state pages
- Cross-restart recovery for in-flight OAuth state

---

## High-Level Flow

1. User opens authorize endpoint on server.
2. Server generates `state` (+ PKCE if required), stores pending state in memory.
3. Server redirects browser to OpenAI authorization URL.
4. OpenAI redirects back to server callback with `code` + `state`.
5. Server validates state, exchanges code for token.
6. Server logs token with standard logger.
7. Server returns simple HTML success page.
8. Developer manually copies token into env:
   - `OPENAI_OAUTH_TOKEN=...`

---

## Server Route Plan

## 1) Authorize route

**Route:** `GET /api/auth/providers/openai-oauth/oauth/authorize`

Responsibilities:

- Require authenticated request (existing auth middleware path)
- Build callback URL
- Generate random `state`
- Generate PKCE verifier/challenge if needed
- Store pending transaction in memory with expiration (e.g. 5 min)
- Redirect (302) to OpenAI auth URL

Failure handling:

- Missing auth -> existing auth error behavior
- Missing required OAuth config -> 400/500 with clear message

---

## 2) Callback route

**Route:** `GET /api/auth/providers/openai-oauth/oauth/callback`

Responsibilities:

- Validate query params (`code`, `state`)
- Resolve pending state from in-memory map
- Reject if missing/expired/mismatch
- Exchange code for token at OpenAI token endpoint
- Log token via standard logger (**full token**, as requested)
- Remove pending state entry
- Return simple HTML (success/failure)

Failure handling:

- Invalid/missing/expired state -> 400
- Provider returned error -> mapped 400/502
- Token exchange failure -> 502

---

## In-Memory Pending State

Use module-local `Map<string, PendingOAuthTxn>`:

- `state: string`
- `createdAt: number`
- `expiresAt: number`
- `providerId: 'openai-oauth'`
- `codeVerifier?: string`
- optional request context fields if needed for traceability

Cleanup policy:

- Remove entry on success
- Remove entry on fail when appropriate
- Opportunistic stale-entry cleanup on route hits

---

## Provider Config / Env Plan

## Env

Add variable in `.env.example`:

- `OPENAI_OAUTH_TOKEN=your-openai-oauth-token`

> Note: runtime env is loaded from `~/.axon/.env` in current server config system.

## Config loader

Extend provider config shape to allow:

- `oauthToken?: string`

Resolve env placeholders in `oauthToken` same way as `apiKey`.

## Runtime usage

Use a dedicated provider module (`openai-oauth`) for oauth/subscription path:

- `openai-oauth` expects `oauthToken` and uses it as bearer auth.
- Existing `openai` API-key provider path stays untouched.

This keeps future subscription-specific behavior isolated in a separate provider.

---

## Logging Requirement

On successful callback token exchange, log with server logger in a clearly searchable line, for example:

- `OpenAI OAuth token acquired` + token value

This is intentionally temporary for local/dev workflow.

---

## Security Note (accepted tradeoff)

This plan intentionally logs sensitive token material to server logs for speed during local development. This must be removed before deployment.

---

## Acceptance Criteria

1. Hitting authorize route opens OpenAI consent/login flow.
2. Callback succeeds and server logs obtained OAuth token.
3. User can paste token into env as `OPENAI_OAUTH_TOKEN`.
4. Provider config supports `oauthToken` and `openai-oauth` runtime can use it.
5. No DB changes introduced.
6. No new abstraction/store layers introduced.

---

## Related Files (relative paths)

Use this list as the minimal file map to proceed without re-scanning the whole repo.

### A) HTTP routing + middleware (OAuth endpoints integration)

- `packages/server/src/http/server.ts`\
  Main HTTP dispatcher; where OAuth route matching should be wired.
- `packages/server/src/http/routes/auth.ts`\
  Existing auth route style/patterns (request parsing, cookie/csrf handling style).
- `packages/server/src/http/middleware/auth.ts`\
  Authentication boundary for non-auth routes.
- `packages/server/src/http/middleware/trustedOrigin.ts`\
  Trusted-origin policy behavior for mutating endpoints.
- `packages/server/src/http/middleware/csrf.ts`\
  CSRF behavior; useful for deciding callback/authorize boundary rules.
- `packages/server/src/http/helpers.ts` _(if needed during implementation)_\
  Shared HTTP response helpers (`sendHttpError`, success envelopes).

### B) Authorization boundary (workspace-level permission checks)

- `packages/server/src/http/authz.ts`\
  HTTP-level authz helper (`authorizeHttpOrSendError`).
- `packages/server/src/authz/contracts.ts`\
  Existing action vocabulary (`WorkspaceAction`, etc.).
- `packages/server/src/authz/service.ts`\
  Authorization decision flow.
- `packages/server/src/authz/helpers/policy.ts`\
  Role/action capability map if action mapping needs adjustment.

### C) Env/config loading for manual token path

- `.env.example`\
  Add `OPENAI_OAUTH_TOKEN` example variable.
- `packages/server/src/config.ts`\
  Confirms env source behavior (`~/.axon/.env`) and config loading lifecycle.

### D) Provider config schema + resolution

- `packages/shared/src/providers.ts`\
  Shared `ProviderConfig` type; add `oauthToken?: string`.
- `packages/server/src/providers/configs/loader.ts`\
  Zod schema + variable resolution (`{{VAR}}`) for provider fields.
- `packages/server/src/providers/store.ts`\
  Loaded config access (`getConfig`, reload flow).

### E) Runtime request path (where oauthToken will be consumed)

- `packages/server/src/providers/modules/openai-oauth.ts`\
  Dedicated OAuth/subscription provider module entrypoint.
- `packages/server/src/providers/modules/openai.ts`\
  Existing API-key provider module (kept separate/unchanged by design).
- `packages/server/src/providers/protocols/openai-chat.ts`\
  OpenAI SDK client construction/auth headers.
- `packages/server/src/providers/registry.ts`\
  Provider module selection by config.
- `packages/server/src/agentic/loop/agenticTurn.ts`\
  End-to-end runtime path from selected config to provider sendRequest.

### F) (Optional) WS config list surface (if UI needs to reflect auth mode later)

- `packages/server/src/ws/handlers/configs.ts`\
  Non-sensitive config list payload to clients.
- `packages/shared/src/ws/rpc.ts`\
  RPC type catalog if new WS calls are ever added.

---

## Next Implementation Step

Implement routes + in-memory state + token exchange first, then wire `oauthToken` config support and runtime precedence.
