/**
 * Remark42 plugin entry — the build-time component registered with Quartz as `remark42`.
 *
 * Configuration is code : there is no options block, no
 * config file and no transport mapping. The component renders Remark42's documented
 * integration verbatim (see `docs/remark42/docs/configuration/frontend/_index.md`) —
 * an inline `remark_config` object with the values written once right here, the
 * `#remark42` container div, and no loader tag. The DOM is the only transport: the
 * browser runtime (`./browser.ts`) reads the fresh config off the script block on
 * SPA navigation, because inline scripts do not re-execute after micromorph patches
 * the body.
 *
 * Identity validation is deliberately page-local:
 * the component validates only its own `id` and aborts the build when it is
 * invalid, so per-page cost is O(1) and a 10k-note site pays nothing for checks it
 * does not need. Cross-page checks — duplicate ids, `comments` contradictions —
 * belong to the manual `npm run check:comments` audit (`scripts/comments-identity-audit.mjs`),
 * which imports the same rules from `./thread-identity`.
 *
 * Markup contract :
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
 *   once the gate fires.
 *
 * The component factory deliberately accepts no options and throws if Quartz ever
 * supplies any — configuration is code, so an options block in `quartz.config.yaml`
 * is a mistake to fail on, not an API to honour.
 */
import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "@quartz-community/types"
import browserScript from "remark42:browser"
import { buildThreadUrl, checkThreadId, THREAD_BASE_URL } from "./thread-identity"

// === Exported Components ===========================================

/**
 * Builds the comments container component.
 *
 * Renders nothing for pages without an explicit `id` or with `comments: false`, so
 * only opted-in notes pay for the markup. An invalid `id` on the current page
 * aborts the build, naming the page — a silently stranded note is the failure mode
 * this prevents.
 *
 * Hardcoded configuration — the SSOT. Edit the literals below, then rebuild the
 * plugin per the D1 workflow (explicit `npm run build` in this package, commit the
 * regenerated `dist/`, site rebuild to propagate):
 * - `host` / `site_id` — public host and site identifier of the self-hosted
 *   Remark42 instance (LXC, Cloudflare Tunnel → Caddy); `site_id` must match `SITE`
 *   in `/etc/remark42.env` on the host.
 * - `THREAD_BASE_URL` (`./thread-identity`) — frozen. Threads are keyed by the page
 *   URL handed to the widget, so changing it silently orphans the entire comment
 *   history. Treat any change as a D4-level event and migrate threads deliberately.
 * - `url` and `page_title` are per-page derivations, not configuration.
 * - `theme` and `components` are reserved for theme synchronization,
 *   embed-only loading contract; loader-control fields (`__colors__`, `styles`,
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

	const Component: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
		const frontmatter = asRecord(fileData.frontmatter)
		if (!frontmatter || frontmatter["comments"] === false) return null

		const check = checkThreadId(frontmatter["id"])
		if (check.kind === "absent") return null
		// Fail loud on the current page only. Cross-page checks run in the audit, so
		// this stays O(1) and the build never depends on render order or build size.
		if (check.kind === "invalid") {
			throw new Error(`[Remark42] ${describePage(fileData)}: ${check.problem}`)
		}

		const remarkConfig = {
			host: "https://comments.taras.life",
			site_id: "taras-life",
			url: buildThreadUrl(check.id, THREAD_BASE_URL),
			no_footer: true,
			custom_properties: {}, // filled at visual polish
			page_title: asTitle(frontmatter["title"]) ?? asString(fileData.slug) ?? "Comments",
		}

		return (
			<section class="remark42-comments" aria-label="Comments">
				<h2>Comments</h2>
				{/* Stable id per the markup contract: runtime re-reads this
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
				{/* No embed.mjs tag here — the browser runtime loads the module behind the
				    viewport gate (see the markup contract in the header). */}
			</section>
		)
	}

	Component.afterDOMLoaded = browserScript
	Component.css = ".remark42-comments { width: 100%; margin-top: 1rem; }"
	return Component
}

// === Local Functions ===============================================

/** Narrow host-provided frontmatter to a string-keyed record; the runtime check justifies the assertion. */
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined
}

/** Narrow a value to a non-empty string, or undefined. */
function asString(value: unknown): string | undefined {
	return typeof value === "string" && value.length > 0 ? value : undefined
}

/** Page title for the widget's per-thread metadata; blank titles are ignored. */
function asTitle(value: unknown): string | undefined {
	return asString(typeof value === "string" ? value.trim() : undefined)
}

/** Name the offending page in a build failure, preferring the source path over the slug. */
function describePage(fileData: QuartzComponentProps["fileData"]): string {
	return asString(fileData["relativePath"]) ?? asString(fileData["slug"]) ?? "unknown page"
}
