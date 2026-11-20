/** Builds a flat Explorer model from processed pages without changing Quartz's parsing or published paths. */
import type { QuartzPluginData } from "../plugins/vfile"
import type { FilePath, FullSlug } from "../util/path"

/** Keeps source identity and presentation metadata separate from the page's published destination. */
export type ExplorerNavigationEntry = {
	kind: "home" | "section"
	relativePath: FilePath
	slug: FullSlug
	label: string
	/** An unusable selection must remain distinct from an absent selection, which receives the default icon. */
	icon: { supplied: false } | { supplied: true; value: unknown }
}

/** Discovers conventional top-level entries, orders their displayed labels, and places Home last. */
export function buildExplorerNavigation(allFiles: readonly QuartzPluginData[]): ExplorerNavigationEntry[] {
	const entries: ExplorerNavigationEntry[] = []

	for (const file of allFiles) {
		const { relativePath, slug, frontmatter } = file
		if (!relativePath || !slug) continue

		const segments = relativePath.split("/")
		const filename = segments[segments.length - 1]
		const isHome = relativePath.toLowerCase() === "index.md"
		const isSection =
			segments.length === 2 && segments[0] !== "" && filename.toLowerCase() === `_${segments[0]}.md`.toLowerCase()
		if (!isHome && !isSection) continue

		const stem = filename.slice(0, -3)
		const title = frontmatter?.title
		// Quartz has already filled missing titles with the stem. Deliberately treat an
		// identical authored title the same way rather than adding provenance tracking.
		const label = isHome ? "Home" : title && title !== stem ? title : stem.slice(1)

		entries.push({
			kind: isHome ? "home" : "section",
			relativePath,
			slug,
			label,
			icon: Object.hasOwn(frontmatter ?? {}, "icon")
				? { supplied: true, value: frontmatter?.icon }
				: { supplied: false },
		})
	}

	return entries.sort(compareExplorerEntries)
}

/** Uses explicit English collation for reproducible labels, with source paths breaking equal-label ties. */
function compareExplorerEntries(left: ExplorerNavigationEntry, right: ExplorerNavigationEntry): number {
	if (left.kind !== right.kind) return left.kind === "home" ? 1 : -1
	return left.label.localeCompare(right.label, "en") || left.relativePath.localeCompare(right.relativePath, "en")
}
