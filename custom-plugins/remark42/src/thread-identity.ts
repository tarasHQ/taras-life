/**
 * Thread identity — the frozen thread namespace, validation of the frontmatter
 * `id` key, and derivation of the Remark42 thread URL (phase 001, decision D4).
 *
 * Identity is content-owned data: the `id` key names the comment thread, and the
 * component trims and encodes its value but never rewrites it and never falls back
 * to the page URL (a fallback would orphan every existing comment on the next
 * rename). The thread URL format is frozen:
 * `${THREAD_BASE_URL}/${encodeURIComponent(id)}`.
 *
 * Policy, all answered here:
 * - an absent `id`, or a page opted out via `comments: false`, is simply not
 *   commentable — never an error, and the opted-out id is inert (unvalidated,
 *   excluded from duplicate detection);
 * - a present `id` that is not a string, is empty/whitespace-only, is a dot
 *   segment, or is outside `[a-z0-9-]+` is an issue — silent misconfiguration
 *   used to strand notes without comments;
 * - two commentable pages sharing one `id` is an issue, because two notes would
 *   silently mix into one comment thread;
 * - `comments` that is not a boolean, or an `id` on an opted-out page, is a
 *   contradiction in the author's intent.
 *
 * Consumers differ by when the check runs:
 * - the build-time component validates ONLY its own page's `id` and aborts the
 *   build on an invalid one — O(1) per page, so a large site pays nothing;
 * - cross-page checks (`scanThreadIdIssues`, `findOptOutIssues`) run in the
 *   manual `npm run check:comments` audit, never during a build.
 *
 * This module is pure — no DOM, no Node builtins — so both consumers can import
 * it: the plugin entry after esbuild bundles it, and the audit script under tsx.
 */

// === Local Constants ===============================================

/** Allowed id charset. No length rule — generation is tooling. */
const ID_PATTERN = /^[a-z0-9-]+$/

// === Exported Constants ============================================

/**
 * Frozen thread base — the URL namespace every comment thread lives under.
 * Remark42 keys threads by the page URL handed to the widget, so changing this
 * value silently orphans the entire comment history (D4). Treat any change as a
 * deliberate thread-migration event, never a casual edit.
 */
export const THREAD_BASE_URL = "https://taras.life/comments"

// === Exported Types ================================================

/**
 * Minimal structural view of a page the identity checks need. Host-provided page
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

/** One identity violation, ready for an aggregated failure or audit report. */
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
 * Collect every `id` violation over the published page set: invalid ids and
 * duplicate id groups. Results are sorted deterministically, because the page set
 * is unordered and the report must not depend on filesystem enumeration order.
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

/**
 * Collect contradictions between the two comment keys: a `comments` value that is
 * not a boolean (a quoted YAML `"false"` renders comments anyway, because the
 * component compares strictly against `false`), and an `id` that is set while the
 * page is opted out — one of the two keys is a leftover the author did not mean.
 * Audit-only: the build never inspects more than the current page.
 */
export function findOptOutIssues(pages: readonly CommentablePage[]): ThreadIdIssue[] {
	const issues: ThreadIdIssue[] = []

	for (const page of pages) {
		const frontmatter = asRecord(page.frontmatter)
		if (!frontmatter || !("comments" in frontmatter)) continue

		const source = describeSource(page)
		const comments = frontmatter["comments"]
		if (typeof comments !== "boolean") {
			issues.push({
				pages: [source],
				problem: `comments must be a boolean, got ${describe(comments)} — a quoted value is ignored by the component`,
			})
			continue
		}
		if (comments !== false) continue

		const check = checkThreadId(frontmatter["id"])
		if (check.kind !== "absent") {
			issues.push({
				pages: [source],
				problem: "id is set while comments: false opts the page out — remove one of the two keys",
			})
		}
	}

	return issues.sort(compareIssues)
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

/** Describe a non-string value's type for problem text. */
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
