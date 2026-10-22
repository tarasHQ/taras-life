// Remark42 v1.18's embed module reads remark_config immediately, automatically
// creates the first widget at #remark42, and only then emits REMARK42::ready.
// Keep this bootstrap handshake separate from explicit mounts on later SPA routes.

export type Remark42Theme = "light" | "dark"

export interface Remark42Instance {
	destroy(): void
}

export interface Remark42Config {
	host: string
	site_id: string
	url: string
	page_title: string
	theme: Remark42Theme
}

export interface Remark42Api {
	createInstance(config: Remark42Config): Remark42Instance
	changeTheme?(theme: Remark42Theme): void
	destroy?(): void
}

export type Remark42Window = Pick<
	Window,
	"addEventListener" | "removeEventListener" | "setTimeout" | "clearTimeout"
> & {
	remark_config?: Remark42Config
	REMARK42?: Remark42Api
}

interface PendingBootstrap {
	clearTimer(): void
}

/** Install one lifecycle for initial loading, subsequent routes, and theme changes. */
export function installRemark42(browser: Remark42Window, doc: Document): () => void {
	let instance: Remark42Instance | undefined
	let activeNode: HTMLElement | undefined
	let parkingNode: HTMLElement | undefined
	let pending: PendingBootstrap | undefined
	let disposed = false

	/** Read Quartz's current theme, including changes made while the module downloads. */
	function currentTheme(): Remark42Theme {
		return doc.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light"
	}

	/** Remove only our temporary bootstrap container, never a content-page container. */
	function removeParkingNode(): void {
		parkingNode?.remove()
		parkingNode = undefined
	}

	/** An already requested module cannot reliably be cancelled by removing its tag.
	 * Give its mandatory automatic mount a hidden target when no opted-in page exists.
	 * The ready handler immediately destroys that instance and removes this target.
	 */
	function ensureParkingNode(): void {
		if (doc.getElementById("remark42")) return
		parkingNode = doc.createElement("div")
		parkingNode.id = "remark42"
		parkingNode.hidden = true
		parkingNode.setAttribute("aria-hidden", "true")
		parkingNode.dataset.remark42Bootstrap = ""
		doc.body.appendChild(parkingNode)
	}

	/** Destroy before Quartz changes the page; capture each instance, not a mutable API method. */
	function clearCurrent(): void {
		activeNode = undefined
		const previous = instance
		instance = undefined
		try {
			previous?.destroy()
		} catch (error) {
			console.warn("[Remark42] Could not clean up the previous widget", error)
		}
	}

	/** Isolate failures to the active comments container, leaving article/router behavior intact. */
	function showFailure(error: unknown): void {
		if (disposed) return
		if (activeNode?.isConnected && doc.getElementById("remark42") === activeNode) {
			activeNode.textContent = "Comments could not be loaded. Please refresh the page to try again."
		}
		console.error("[Remark42] Widget initialization failed", error)
	}

	/** Set all globals synchronously before either module evaluation or createInstance. */
	function configure(node: HTMLElement): boolean {
		const { remark42Host: host, remark42SiteId: siteId, remark42Url: url } = node.dataset
		if (!host || !siteId || !url) return false
		browser.remark_config = {
			host,
			site_id: siteId,
			url,
			page_title: node.dataset.remark42Title ?? doc.title,
			theme: currentTheme(),
		}
		return true
	}

	/** Start the single automatic bootstrap; route changes update its global config in place. */
	function startBootstrap(host: string): void {
		const script = doc.createElement("script")
		script.type = "module"
		script.async = true
		script.src = `${host}/web/embed.mjs`
		script.dataset.persist = ""
		script.dataset.remark42Loader = ""
		let finished = false
		let timer: number | undefined

		/** A slow module may still execute later, so timeout is a UI warning, not cancellation. */
		function clearTimer(): void {
			if (timer !== undefined) browser.clearTimeout(timer)
			timer = undefined
		}

		/** Adopt the loader's first instance instead of calling createInstance a second time. */
		function finish(error?: Error): void {
			if (finished) return
			finished = true
			clearTimer()
			browser.removeEventListener("REMARK42::ready", onReady)
			script.removeEventListener("load", onLoaded)
			script.removeEventListener("error", onError)
			pending = undefined

			if (error) {
				script.remove()
				removeParkingNode()
				showFailure(error)
				return
			}

			const api = browser.REMARK42
			const destroyAutomatic = api?.destroy
			if (typeof api?.createInstance !== "function" || typeof destroyAutomatic !== "function") {
				script.remove()
				removeParkingNode()
				showFailure(new Error("Remark42 did not expose its automatic widget instance"))
				return
			}

			// Capture the automatic destroy function now. The global method changes on
			// later mounts, and must not cause cleanup to destroy a newer instance.
			const automatic = { destroy: () => destroyAutomatic.call(api) }
			if (!disposed && activeNode?.isConnected && doc.getElementById("remark42") === activeNode) {
				instance = automatic
			} else {
				try {
					automatic.destroy()
				} catch (cleanupError) {
					if (!disposed) console.warn("[Remark42] Could not discard bootstrap widget", cleanupError)
				}
			}
			removeParkingNode()
		}

		/** v1.18 dispatches ready only after its automatic createInstance has completed. */
		function onReady(): void {
			finish()
		}

		/** A module loaded during parsing may wait for DOMContentLoaded before bootstrapping. */
		function onLoaded(): void {
			if (doc.readyState === "loading" && typeof browser.REMARK42?.destroy !== "function") return
			finish()
		}

		/** A failed network/module fetch cannot bootstrap, so its temporary target is removable. */
		function onError(): void {
			finish(new Error("Could not download the Remark42 module"))
		}

		pending = { clearTimer }
		browser.addEventListener("REMARK42::ready", onReady)
		script.addEventListener("load", onLoaded)
		script.addEventListener("error", onError)
		timer = browser.setTimeout(() => {
			timer = undefined
			showFailure(new Error("Remark42 loading timed out; refresh the page to retry"))
			// Keep the one-shot handlers and target: removing a module tag does not
			// guarantee cancellation, and a late bootstrap still needs safe cleanup.
		}, 20_000)
		doc.head.appendChild(script)
	}

	/** Route updates are synchronous: module evaluation sees the current page's config/root. */
	function onNavigation(): void {
		if (disposed) return
		clearCurrent()
		removeParkingNode()
		const node = doc.getElementById("remark42")
		if (!node || !configure(node)) {
			if (pending) ensureParkingNode()
			return
		}
		activeNode = node

		// The first module evaluation will initialize this current node automatically.
		if (pending) return
		const api = browser.REMARK42
		if (typeof api?.createInstance === "function") {
			try {
				instance = api.createInstance(browser.remark_config!)
			} catch (error) {
				showFailure(error)
			}
		} else {
			startBootstrap(browser.remark_config!.host)
		}
	}

	/** Update pending global config as well as a widget that is already mounted. */
	function onThemeChange(): void {
		const theme = currentTheme()
		if (browser.remark_config) browser.remark_config.theme = theme
		if (!instance) return
		try {
			browser.REMARK42?.changeTheme?.(theme)
		} catch (error) {
			console.warn("[Remark42] Could not update the widget theme", error)
		}
	}

	doc.addEventListener("prenav", clearCurrent)
	doc.addEventListener("nav", onNavigation)
	doc.addEventListener("themechange", onThemeChange)

	/** Stop routing immediately; a pending automatic bootstrap is discarded when it finishes. */
	return () => {
		disposed = true
		clearCurrent()
		doc.removeEventListener("prenav", clearCurrent)
		doc.removeEventListener("nav", onNavigation)
		doc.removeEventListener("themechange", onThemeChange)
		if (pending) {
			pending.clearTimer()
			ensureParkingNode()
		} else {
			removeParkingNode()
		}
	}
}
