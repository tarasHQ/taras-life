import { setupLeftSidebar } from "./leftSidebar"

document.addEventListener("nav", () => {
	window.addCleanup(setupLeftSidebar())
})
