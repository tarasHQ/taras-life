/**
 * Thread identity — validation of the frontmatter `id` key and derivation of the
 * Remark42 thread URL (phase 001, decision D4).
 *
 * Identity is content-owned data: the `id` key names the comment thread, and the
 * component trims and encodes its value but never rewrites it and never falls back
 * to the page URL (a fallback would orphan every existing comment on the next
 * rename). The thread URL format is frozen:
 * `${threadBaseUrl}/${encodeURIComponent(id)}`.
 *
 * Policy, all answered here:
 * - an absent `id`, or a page opted out via `comments: false`, is simply not
 *   commentable — never an error, and the opted-out id is inert (unvalidated,
 *   excluded from duplicate detection);
 * - a present `id` that is not a string, is empty/whitespace-only, is a dot
 *   segment, or is outside `[a-z0-9-]+` is an issue for the aggregated build
 *   failure — silent misconfiguration used to strand notes without comments;
 * - two commentable pages sharing one `id` is an issue, because two notes would
 *   silently mix into one comment thread.
 */

// === Local Constants ===============================================

/** Allowed id charset, locked at step 04. No length rule — generation is tooling. */
const ID_PATTERN = /^[a-z0-9-]+$/

// === Exported Types ================================================

/**
 * Minimal structural view of a page the identity scan needs. Host-provided page
 * data is untrusted boundary input, so every field is `unknown` and narrowed by
 * runtime checks — never by assertions.
 */
export type CommentablePage = {
	frontmatter?: unknown
	relativePath?: unknown
	slug?: unknown
}

/** Classification of one page's `id` frontmatter value. */
export type ThreadIdCheck = { kind: "absent" } | { kind: "valid"; id: string } | { kind: "invalid"; problem: string }

/** One identity violation, ready for the aggregated build-failure message. */
export type ThreadIdIssue = {
	pages: string[]
	problem: string
}

// === Exported Functions ============================================

/** Classify an `id` frontmatter value without throwing — aggregation happens in the scan. */
export function checkThreadId(value: unknown): ThreadIdCheck {
	if (value === undefined) return { kind: "absent" }
	if (typeof value !== "string") {
		return { kind: "invalid", problem: `id must be a string, got ${describe(value)}` }
	}
	const id = value.trim()
	if (id.length === 0) return { kind: "invalid", problem: "id is empty or whitespace-only" }
	if (id === "." || id === "..") {
		return { kind: "invalid", problem: `id must not be the dot segment ${JSON.stringify(id)}` }
	}
	if (!ID_PATTERN.test(id)) {
		return { kind: "invalid", problem: `id must match [a-z0-9-]+, got ${JSON.stringify(value)}` }
	}
	return { kind: "valid", id }
}

/** Derive the frozen thread URL from a validated id and the frozen thread base. */
export function buildThreadUrl(id: string, threadBaseUrl: string): string {
	return `${threadBaseUrl}/${encodeURIComponent(id)}`
}

/**
 * Collect every identity violation over the published page set: invalid ids and
 * duplicate id groups. Results are sorted deterministically, because the build is
 * concurrent and the failure text must not depend on render order.
 */
export function scanThreadIdIssues(pages: readonly CommentablePage[]): ThreadIdIssue[] {
	const issues: ThreadIdIssue[] = []
	const pagesById = new Map<string, Set<string>>()

	for (const page of pages) {
		const frontmatter = asRecord(page.frontmatter)
		// Opted-out pages are fully exempt: their id is inert and renders nothing.
		if (!frontmatter || frontmatter["comments"] === false) continue

		const check = checkThreadId(frontmatter["id"])
		if (check.kind === "absent") continue

		const source = describeSource(page)
		if (check.kind === "invalid") {
			issues.push({ pages: [source], problem: check.problem })
			continue
		}
		const sources = pagesById.get(check.id) ?? new Set<string>()
		sources.add(source)
		pagesById.set(check.id, sources)
	}

	for (const [id, sources] of pagesById) {
		if (sources.size > 1) {
			issues.push({
				pages: [...sources],
				problem: `duplicate id ${JSON.stringify(id)} — these pages would silently share one comment thread`,
			})
		}
	}

	return issues.sort(compareIssues)
}

/** Format all identity issues into one aggregated build-failure message. */
export function formatThreadIdIssues(issues: readonly ThreadIdIssue[]): string {
	const lines = issues.map((issue) => `- ${issue.pages.join(", ")}: ${issue.problem}`)
	return `[Remark42] Comment identity errors — fix the frontmatter \`id\` key:\n${lines.join("\n")}`
}

// === Local Functions ===============================================

/** Narrow unknown host data to a string-keyed record; the runtime check justifies the assertion. */
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined
}

/** Name the offending page for error messages, falling back when no name exists. */
function describeSource(page: CommentablePage): string {
	const name =
		typeof page.relativePath === "string"
			? page.relativePath
			: typeof page.slug === "string"
				? page.slug
				: undefined
	return name ?? "unknown page"
}

/** Describe a non-string id value's type for the invalid-id problem text. */
function describe(value: unknown): string {
	if (value === null) return "null"
	if (Array.isArray(value)) return "array"
	return typeof value
}

/** Deterministic issue ordering: by page list, then by problem text. */
function compareIssues(a: ThreadIdIssue, b: ThreadIdIssue): number {
	const aSource = a.pages.join(", ")
	const bSource = b.pages.join(", ")
	if (aSource !== bSource) return aSource < bSource ? -1 : 1
	return a.problem < b.problem ? -1 : a.problem > b.problem ? 1 : 0
}
