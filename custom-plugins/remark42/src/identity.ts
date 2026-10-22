// Thread identity belongs to frontmatter, never to a note's current filename or URL.
// Future counter components must use this same URL helper as the embed.

export interface CommentPage {
	slug?: string
	relativePath?: string
	frontmatter?: Record<string, unknown>
}

export interface DuplicateCommentId {
	id: string
	pages: string[]
}

/** Reject missing IDs and URL dot-segments rather than inventing a fallback identity. */
export function getCommentId(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined
	const id = value.trim()
	return id && id !== "." && id !== ".." ? id : undefined
}

/** Keep configuration URLs explicit and prevent credentials/query strings in public markup. */
export function normalizePublicUrl(value: string, label: string): string {
	let url: URL
	try {
		url = new URL(value)
	} catch {
		throw new Error(`[Remark42] ${label} must be an absolute HTTP(S) URL`)
	}
	if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
		throw new Error(`[Remark42] ${label} must be HTTP(S), without credentials, query or fragment`)
	}
	return url.href.replace(/\/+$/, "")
}

/** Encode the ID as one segment under the configured, permanent thread namespace. */
export function getThreadUrl(value: unknown, threadBaseUrl: string): string | undefined {
	const id = getCommentId(value)
	if (!id) return undefined
	return `${normalizePublicUrl(threadBaseUrl, "threadBaseUrl")}/${encodeURIComponent(id)}`
}

/** Report collisions among published metadata without repeatedly counting the same source file. */
export function findDuplicateCommentIds(pages: readonly CommentPage[]): DuplicateCommentId[] {
	const identities = new Map<string, Set<string>>()
	for (const page of pages) {
		const id = getCommentId(page.frontmatter?.["comment-id"])
		if (!id) continue
		const name = page.relativePath ?? page.slug
		if (!name) continue
		const sources = identities.get(id) ?? new Set<string>()
		sources.add(name)
		identities.set(id, sources)
	}
	return [...identities]
		.filter(([, sources]) => sources.size > 1)
		.map(([id, sources]) => ({ id, pages: [...sources] }))
}
