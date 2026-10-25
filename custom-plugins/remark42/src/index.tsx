/**
 * Remark42 plugin entry — the build-time component registered with Quartz as `remark42`.
 *
 * This is the step-02 scaffold: it reproduces the currently deployed DOM contract
 * byte-for-byte so generated HTML does not change while the rewrite is in flight.
 * Deliberately minimal — no option validation (step 03), no identity rules (step 04),
 * no final markup (step 05). The browser runtime is a placeholder (step 06 owns it).
 */
import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"
import browserScript from "remark42:browser"

/** Plugin options as declared in `quartz.config.yaml`. Validated in step 03, not here. */
export type Remark42Options = {
	host: string
	siteId: string
	threadBaseUrl: string
}

// === Exported Components ==========================================

/**
 * Builds the comments container component.
 *
 * Renders nothing for pages without an explicit `comment-id` or with `comments: false`,
 * so only opted-in notes pay for the markup.
 */
export const Remark42: QuartzComponentConstructor<Remark42Options | undefined> = (options) => {
	// Presence guard only — this satisfies the `undefined` branch of the constructor type.
	// Real options validation (defaults, fail-the-build semantics) lands in step 03.
	if (!options) {
		throw new Error("[Remark42] Missing options block in quartz.config.yaml")
	}
	const { host, siteId, threadBaseUrl } = options

	const Component: QuartzComponent = ({ fileData }) => {
		const frontmatter = fileData.frontmatter
		if (!frontmatter || frontmatter.comments === false) return null

		// Identity is read raw at this stage; step 04 owns validation and normalisation.
		const commentId = frontmatter["comment-id"]
		if (typeof commentId !== "string" || commentId.length === 0) return null

		const threadUrl = `${threadBaseUrl}/${commentId}`

		return (
			<section class="remark42-comments" aria-label="Comments">
				<h2>Comments</h2>
				<div
					id="remark42"
					data-comment-id={commentId}
					data-remark42-host={host}
					data-remark42-site-id={siteId}
					data-remark42-url={threadUrl}
					data-remark42-title={frontmatter.title ?? fileData.slug ?? "Comments"}>
					<p role="status">Loading comments…</p>
				</div>
			</section>
		)
	}

	Component.afterDOMLoaded = browserScript
	Component.css = ".remark42-comments { width: 100%; margin-top: 1rem; }"
	return Component
}
