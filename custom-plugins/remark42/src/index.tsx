/**
 * Remark42 plugin entry — the build-time component registered with Quartz as `remark42`.
 *
 * Configuration is code (D2′, phase 001 step 03): there is no options block, no
 * config file and no transport mapping. The component renders Remark42's documented
 * integration verbatim (see `docs/remark42/docs/configuration/frontend/_index.md`) —
 * an inline `remark_config` object with the values written once right here, the
 * `#remark42` container div, and Remark42's own `embed.mjs` loader tag. The DOM is
 * the only transport: the step-06 runtime reads the fresh config off the patched
 * script block on SPA navigation, because inline scripts do not re-execute after
 * micromorph patches the body.
 *
 * Identity validation and thread-URL derivation live in `./thread-identity` (step
 * 04); the runtime (SPA lifecycle, theme, error handling) is step 06.
 *
 * Markup contract (locked at step 05 — what the step-06 runtime may assume):
 * - `<section class="remark42-comments">` wraps everything and renders only on
 *   opted-in pages (frontmatter `id` present, no `comments: false`).
 * - `div#remark42` — the id is forced by Remark42's loader: `createInstance`
 *   hardcodes `document.getElementById("remark42")` and takes no element
 *   argument, so any other id would break every (re)mount, SPA included.
 * - `script#remark42-config` — the inline `var remark_config` block carries a
 *   stable id so the runtime can re-read the fresh config text after SPA
 *   navigation (inline scripts do not re-execute once micromorph patches body).
 * - The container's `Loading comments…` paragraph is informational; the loader
 *   removes every non-iframe container child once the widget reports `inited`,
 *   so the paragraph is transient by design.
 * - There is deliberately NO `embed.mjs` script tag in this markup. The docs'
 *   eager module tag would fetch Remark42 on every page load, violating D5
 *   (zero traffic until the container nears the viewport); the browser runtime
 *   in `./browser.ts` is the sole loader — it dynamic-`import()`s the module
 *   once the gate fires. (Step-05 deviation, recorded in the step-06 record.)
 *
 * The component factory deliberately accepts no options and throws if Quartz ever
 * supplies any — configuration is code, so an options block in `quartz.config.yaml`
 * is a mistake to fail on, not an API to honour.
 */
import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"
import browserScript from "remark42:browser"
import { buildThreadUrl, checkThreadId, formatThreadIdIssues, scanThreadIdIssues } from "./thread-identity"

// === Local Constants ===============================================

/**
 * Frozen thread base — the URL namespace every comment thread lives under.
 * Remark42 keys threads by the page URL handed to the widget, so changing this
 * value silently orphans the entire comment history (D4). Treat any change as a
 * deliberate thread-migration event, never a casual edit.
 */
const THREAD_BASE_URL = "https://taras.life/comments"

// === Exported Components ===========================================

/**
 * Builds the comments container component.
 *
 * Renders nothing for pages without an explicit `id` or with `comments: false`,
 * so only opted-in notes pay for the markup. Any present `id` is validated by
 * `thread-identity.ts`: an invalid or duplicated id aborts the build, naming the
 * offending note — a silently stranded note is the failure mode this prevents.
 *
 * Hardcoded configuration — the SSOT. Edit the literals below, then rebuild the
 * plugin per the D1 workflow (explicit `npm run build` in this package, commit the
 * regenerated `dist/`, site rebuild to propagate):
 * - `host` / `site_id` — public host and site identifier of the self-hosted
 *   Remark42 instance (LXC, Cloudflare Tunnel → Caddy); `site_id` must match `SITE`
 *   in `/etc/remark42.env` on the host.
 * - `THREAD_BASE_URL` below — frozen. Threads are keyed by the page URL handed to
 *   the widget (`url` param → Remark42's storage key), so changing it silently
 *   orphans the entire comment history. Treat any change as a D4-level event and
 *   migrate threads deliberately.
 * - `url` and `page_title` are per-page derivations, not configuration.
 * - `theme` and `components` are reserved for step 06 (theme synchronization,
 *   embed-only loading contract); loader-control fields (`__colors__`, `styles`,
 *   `onReveal`) are consumed before query serialization and are not config keys.
 */
export const Remark42: QuartzComponentConstructor<Record<string, unknown> | undefined> = (opts) => {
	// Configuration is code (D2′): any supplied options block is a misconfiguration.
	if (opts !== undefined) {
		throw new Error(
			"[Remark42] The plugin is not configurable via YAML options — " +
				"configuration is hardcoded in custom-plugins/remark42/src/index.tsx; edit it and rebuild the plugin.",
		)
	}

	const Component: QuartzComponent = ({ fileData, allFiles }) => {
		const frontmatter = fileData.frontmatter
		if (!frontmatter || frontmatter.comments === false) return null

		// Fail loud on every identity violation across the published set in a single
		// aggregated throw. Re-scanned per render rather than cached: module-level
		// state is forbidden under the concurrent build-time rendering rule, and the
		// first throw ends the build anyway. A page carrying a bad id renders itself,
		// so its own scan is guaranteed to flag it.
		const issues = scanThreadIdIssues(allFiles ?? [])
		if (issues.length > 0) throw new Error(formatThreadIdIssues(issues))

		const check = checkThreadId(frontmatter["id"])
		// Absent id → no container. An invalid own id cannot reach this line: the
		// scan above already threw for it, since this page is part of allFiles.
		if (check.kind !== "valid") return null

		const remarkConfig = {
			host: "https://comments.taras.life",
			site_id: "taras-life",
			url: buildThreadUrl(check.id, THREAD_BASE_URL),
			no_footer: true,
			custom_properties: {}, // filled at step 08 (visual polish)
			page_title: frontmatter.title ?? fileData.slug ?? "Comments",
		}

		return (
			<section class="remark42-comments" aria-label="Comments">
				<h2>Comments</h2>
				{/* Stable id per the markup contract: the step-06 runtime re-reads this
				    block's text on SPA navigation, because inline scripts do not
				    re-execute after micromorph patches the body. */}
				<script
					id="remark42-config"
					dangerouslySetInnerHTML={{ __html: `var remark_config = ${JSON.stringify(remarkConfig)}` }}
				/>
				{/* Id forced by the loader (see the markup contract in the header). The
				    paragraph is informational; the loader clears non-iframe children
				    once the widget reports `inited`. */}
				<div id="remark42">
					<p role="status">Loading comments…</p>
				</div>
				{/* No embed.mjs tag here — the browser runtime loades the module behind the
				    viewport gate (see the markup contract in the header). */}
			</section>
		)
	}

	// Placeholder bootstrap until step 06 replaces it with the SPA-lifecycle runtime.
	// build.mjs asserts this string embeds, so it must stay until then.
	Component.afterDOMLoaded = browserScript
	Component.css = ".remark42-comments { width: 100%; margin-top: 1rem; }"
	return Component
}
