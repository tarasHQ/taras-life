import type { ExplorerNavigationEntry } from "./explorerNavigation"

// Geometry supplied from Lucide icons; presentation is owned by explorer.css.
export const explorerIcons = {
	stone: (
		<>
			<path d="M11.264 2.205A4 4 0 0 0 6.42 4.211l-4 8a4 4 0 0 0 1.359 5.117l6 4a4 4 0 0 0 4.438 0l6-4a4 4 0 0 0 1.576-4.592l-2-6a4 4 0 0 0-2.53-2.53z" />
			<path d="M11.99 22 14 12l7.822 3.184" />
			<path d="M14 12 8.47 2.302" />
		</>
	),
	workflow: (
		<>
			<rect width="8" height="8" x="3" y="3" rx="2" />
			<path d="M7 11v4a2 2 0 0 0 2 2h4" />
			<rect width="8" height="8" x="13" y="13" rx="2" />
		</>
	),
	notebook: (
		<>
			<path d="M2 6h4" />
			<path d="M2 10h4" />
			<path d="M2 14h4" />
			<path d="M2 18h4" />
			<rect width="16" height="20" x="4" y="2" rx="2" />
			<path d="M16 2v20" />
		</>
	),
	map: (
		<>
			<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
			<path d="M15 5.764v15" />
			<path d="M9 3.236v15" />
		</>
	),
	"folder-closed": (
		<>
			<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
			<path d="M2 10h20" />
		</>
	),
	house: (
		<>
			<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
			<path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
		</>
	),
}

export type ExplorerIconKey = keyof typeof explorerIcons

/** Resolves exact trusted keys, distinguishing missing metadata from invalid selections. */
export function resolveExplorerIcon(icon: ExplorerNavigationEntry["icon"]): ExplorerIconKey | undefined {
	if (!icon.supplied) return "folder-closed"
	if (typeof icon.value === "string" && Object.hasOwn(explorerIcons, icon.value)) {
		return icon.value as ExplorerIconKey
	}
	return undefined
}
