import type { QuartzComponent, QuartzComponentConstructor } from "./types"
import styles from "./styles/left-sidebar.css"
// The build's inline-script loader supplies this browser entry as text.
// @ts-ignore
import script from "./scripts/left-sidebar.inline"

const LeftSidebarControls: QuartzComponent = () => (
	<>
		<div class="left-sidebar-backdrop" />
		<div class="left-sidebar-controls">
			<button type="button" class="left-sidebar-toggle" aria-label="Toggle navigation">
				<svg class="left-sidebar-menu-icon" viewBox="0 0 24 24">
					<path d="M4 6h16M4 12h16M4 18h16" />
				</svg>
				<svg class="left-sidebar-close-icon" viewBox="0 0 24 24">
					<path d="M5 5l14 14M19 5 5 19" />
				</svg>
			</button>
		</div>
	</>
)

LeftSidebarControls.css = styles
LeftSidebarControls.afterDOMLoaded = script
export default (() => LeftSidebarControls) satisfies QuartzComponentConstructor
