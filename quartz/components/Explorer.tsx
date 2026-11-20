import { resolveRelative, simplifySlug } from "../util/path"
import { buildExplorerNavigation, type ExplorerNavigationEntry } from "./explorerNavigation"
import { explorerIcons, resolveExplorerIcon } from "./explorerIcons"
import type { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import explorerStyles from "./styles/explorer.css"

const Explorer: QuartzComponent = ({ allFiles, fileData, cfg, ctx }: QuartzComponentProps) => {
	const entries = buildExplorerNavigation(allFiles).map((entry) => ({ entry, icon: resolveExplorerIcon(entry.icon) }))
	const usedIcons = [...new Set(entries.flatMap(({ icon }) => (icon ? [icon] : [])))]
	const currentPath = fileData.relativePath

	return (
		<nav class="internal-explorer">
			<svg class="explorer-definitions" xmlns="http://www.w3.org/2000/svg">
				{usedIcons.map((icon) => (
					<symbol id={`tl-explorer-icon-${icon}`} viewBox="0 0 24 24">
						{explorerIcons[icon]}
					</symbol>
				))}
			</svg>
			<ul>
				{entries.map(({ entry, icon }) => (
					<li class={isCurrentEntry(entry, currentPath) ? "is-current" : undefined}>
						<a href={entryHref(entry, fileData.slug, cfg.baseUrl, ctx.argv.serve)}>
							<span class="explorer-icon-column">
								{icon && (
									<svg class="explorer-icon" viewBox="0 0 24 24">
										<use href={`#tl-explorer-icon-${icon}`} />
									</svg>
								)}
							</span>
							<span>{entry.label}</span>
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}

function isCurrentEntry(entry: ExplorerNavigationEntry, currentPath: string | undefined): boolean {
	if (!currentPath) return false
	if (entry.kind === "home") return currentPath.toLowerCase() === "index.md"
	// Entry discovery is case-insensitive, so the highlight must be too. The trailing
	// slash keeps `A` from matching `AB` regardless of case.
	return currentPath.toLowerCase().startsWith(`${entry.relativePath.split("/")[0].toLowerCase()}/`)
}

function entryHref(
	entry: ExplorerNavigationEntry,
	currentSlug: QuartzComponentProps["fileData"]["slug"],
	baseUrl: QuartzComponentProps["cfg"]["baseUrl"],
	serve: boolean,
): string {
	// The 404 page may be served at any URL depth, so its links cannot be relative.
	// Serve mode strips the configured base (pages are served from root), so the
	// target joins onto "/"; production joins onto the configured base's pathname.
	// This mirrors dispatcher.ts::emitPage's baseDir rule — if the rule changes,
	// both copies must change together (kept as duplication: a one-line rule
	// doesn't justify a shared helper).
	if (currentSlug === "404") {
		const base = serve ? "/" : new URL(`https://${baseUrl ?? "example.com"}`).pathname
		const target = simplifySlug(entry.slug).replace(/^\//, "")
		return `${base.replace(/\/$/, "")}/${target}`
	}
	return currentSlug ? resolveRelative(currentSlug, entry.slug) : ""
}

Explorer.css = explorerStyles
export default (() => Explorer) satisfies QuartzComponentConstructor
