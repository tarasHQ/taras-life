// Build the opt-in container and let Quartz distribute one shared browser bootstrap.
// No credentials or live comment content are included in the generated HTML.
import type { QuartzComponent, QuartzComponentConstructor } from "../../../quartz/components/types"
import browserScript from "remark42:browser"
import { findDuplicateCommentIds, getCommentId, getThreadUrl, normalizePublicUrl } from "./identity"
import type { CommentPage } from "./identity"

export interface Remark42Options {
	host: string
	siteId: string
	threadBaseUrl: string
}

/** Validate public settings once, rather than allowing a broken runtime URL fallback. */
function resolveOptions(options?: Remark42Options): Remark42Options {
	if (!options || typeof options.siteId !== "string" || !options.siteId.trim()) {
		throw new Error("[Remark42] Configure host, siteId, and threadBaseUrl in quartz.config.yaml")
	}
	return {
		host: normalizePublicUrl(options.host, "host"),
		siteId: options.siteId.trim(),
		threadBaseUrl: normalizePublicUrl(options.threadBaseUrl, "threadBaseUrl"),
	}
}

/** Stamp containers at build time; moving a note must not change its comment thread. */
export const Remark42: QuartzComponentConstructor<Remark42Options | undefined> = (options) => {
	const settings = resolveOptions(options)
	let checkedFiles: readonly CommentPage[] | undefined

	const Component: QuartzComponent = ({ fileData, allFiles }) => {
		// Quartz shares allFiles across renders and replaces it on a rebuild. Scan once
		// per array, avoiding both repeated warnings and stale cross-build ID caches.
		const pages = allFiles as CommentPage[] | undefined
		if (pages && pages !== checkedFiles) {
			checkedFiles = pages
			for (const duplicate of findDuplicateCommentIds(pages)) {
				console.warn(
					`[Remark42] Duplicate comment-id ${JSON.stringify(duplicate.id)} in ${duplicate.pages.join(", ")}. ` +
						"These notes will share one thread; assign unique IDs if that is not intended.",
				)
			}
		}

		const frontmatter = fileData.frontmatter as Record<string, unknown> | undefined
		if (frontmatter?.comments === false) return null
		const commentId = getCommentId(frontmatter?.["comment-id"])
		const threadUrl = getThreadUrl(commentId, settings.threadBaseUrl)
		if (!threadUrl) return null

		return (
			<section class="remark42-comments" aria-label="Comments">
				<h2>Comments</h2>
				<div
					id="remark42"
					data-comment-id={commentId}
					data-remark42-host={settings.host}
					data-remark42-site-id={settings.siteId}
					data-remark42-url={threadUrl}
					data-remark42-title={frontmatter?.title ?? fileData.slug ?? "Comments"}>
					<p role="status">Loading comments…</p>
				</div>
			</section>
		)
	}

	Component.displayName = "Remark42"
	Component.afterDOMLoaded = browserScript
	Component.css = ".remark42-comments { width: 100%; margin-top: 1rem; }"
	return Component
}
