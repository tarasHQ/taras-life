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
 * Identity rules are step 04; final markup polish is step 05; the runtime (SPA
 * lifecycle, theme, error handling) is step 06.
 *
 * The component factory deliberately accepts no options and throws if Quartz ever
 * supplies any — configuration is code, so an options block in `quartz.config.yaml`
 * is a mistake to fail on, not an API to honour.
 */
import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"
import browserScript from "remark42:browser"

// === Exported Components ===========================================

/**
 * Builds the comments container component.
 *
 * Renders nothing for pages without an explicit `comment-id` or with `comments: false`,
 * so only opted-in notes pay for the markup.
 *
 * Hardcoded configuration — the SSOT. Edit the literals below, then rebuild the
 * plugin per the D1 workflow (explicit `npm run build` in this package, commit the
 * regenerated `dist/`, site rebuild to propagate):
 * - `host` / `site_id` — public host and site identifier of the self-hosted
 *   Remark42 instance (LXC, Cloudflare Tunnel → Caddy); `site_id` must match `SITE`
 *   in `/etc/remark42.env` on the host.
 * - thread URL base — frozen. Threads are keyed by the page URL handed to the
 *   widget (`url` param → Remark42's storage key), so changing it silently orphans
 *   the entire comment history. Treat any change as a D4-level event and migrate
 *   threads deliberately.
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

	const Component: QuartzComponent = ({ fileData }) => {
		const frontmatter = fileData.frontmatter
		if (!frontmatter || frontmatter.comments === false) return null

		// Identity is read raw at this stage; step 04 owns validation and normalisation.
		const commentId = frontmatter["comment-id"]
		if (typeof commentId !== "string" || commentId.length === 0) return null

		const remarkConfig = {
			host: "https://comments.taras.life",
			site_id: "taras-life",
			url: `https://taras.life/comments/${commentId}`,
			no_footer: true,
			custom_properties: {}, // filled at step 08 (visual polish)
			page_title: frontmatter.title ?? fileData.slug ?? "Comments",
		}

		return (
			<section class="remark42-comments" aria-label="Comments">
				<h2>Comments</h2>
				<script dangerouslySetInnerHTML={{ __html: `var remark_config = ${JSON.stringify(remarkConfig)}` }} />
				<div id="remark42">
					<p role="status">Loading comments…</p>
				</div>
				<script type="module" src={`${remarkConfig.host}/web/embed.mjs`} />
			</section>
		)
	}

	// Placeholder bootstrap until step 06 replaces it with the SPA-lifecycle runtime.
	// build.mjs asserts this string embeds, so it must stay until then.
	Component.afterDOMLoaded = browserScript
	Component.css = ".remark42-comments { width: 100%; margin-top: 1rem; }"
	return Component
}
