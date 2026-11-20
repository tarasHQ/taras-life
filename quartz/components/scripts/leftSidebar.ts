/** Installs one page's mobile sidebar behavior and returns its cleanup. */
export function setupLeftSidebar(doc: Document = document, view: Window = window): () => void {
	const button = doc.querySelector<HTMLButtonElement>(".left-sidebar-toggle")
	const sidebar = button?.closest<HTMLElement>(".left.sidebar")
	const panel = sidebar?.querySelector(".left-sidebar-panel")
	if (!button || !sidebar || !panel) return () => {}

	// 800px breakpoint: keep in sync with quartz/styles/base.css (mobile grid)
	// and quartz/components/styles/left-sidebar.css (all panel behavior).
	const mobile = view.matchMedia("(max-width: 800px)")
	const close = () => sidebar.classList.remove("is-mobile-open")
	const reset = () => {
		close()
		sidebar.classList.remove("has-mobile-transition")
	}
	const toggle = () => {
		if (mobile.matches) {
			sidebar.classList.add("has-mobile-transition")
			sidebar.classList.toggle("is-mobile-open")
		}
	}
	const onKey = (event: KeyboardEvent) => {
		if (event.key === "Escape" && !sidebar.querySelector(".search-container.active")) close()
	}
	const onWidth = () => {
		if (!mobile.matches) reset()
	}
	reset()
	button.addEventListener("click", toggle)
	doc.addEventListener("keydown", onKey, true)
	doc.addEventListener("prenav", reset)
	mobile.addEventListener("change", onWidth)
	return () => {
		reset()
		button.removeEventListener("click", toggle)
		doc.removeEventListener("keydown", onKey, true)
		doc.removeEventListener("prenav", reset)
		mobile.removeEventListener("change", onWidth)
	}
}
