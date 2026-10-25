/**
 * Browser runtime for the Remark42 comments widget — the only part of the plugin
 * a visitor pays for (phase 001, step 06).
 *
 * Responsibilities:
 * - Ships site-wide as an `afterDOMLoaded` script string and stays a hard no-op
 *   on pages without a comments container: no gate observer, no watchdog timer,
 *   no network. The only unconditional cost is three `document`-level event
 *   subscriptions, which hold no DOM references.
 * - Loads Remark42's `embed.mjs` at most once per page load, gated by an
 *   IntersectionObserver (~600px rootMargin) so nothing is requested until the
 *   container nears the viewport (D5). The module auto-mounts on import; the
 *   gated import only ever happens with `#remark42` confirmed present, so the
 *   loader's "Can't find root node" throw is unreachable by construction.
 * - Owns `window.remark_config` deliberately: the per-page config is re-read
 *   from `script#remark42-config` on every navigation (inline scripts do not
 *   re-execute after micromorph patches the body) and written into the global
 *   before every mount — the loader's `createInstance` validates `site_id`
 *   against the global, not against its argument (v1.18.0 fixture).
 * - Keeps exactly one live widget instance: torn down on `prenav` (before
 *   micromorph patches the body) and remounted on `nav` through the persisted
 *   `window.REMARK42.createInstance` handle — a local call, never a re-download.
 * - Matches the widget's theme to `saved-theme` at every mount by injecting
 *   `theme` into the config copy handed to the loader — the iframe is then
 *   created with the correct `colorScheme` and query param, no flash — and
 *   follows `themechange` (dispatched on `document` by
 *   `@quartz-community/darkmode`; it does not fire on initial load) for the
 *   module's lifetime.
 * - Surfaces failure inside the container only: a watchdog replaces the
 *   placeholder with a failure note when the widget never reports `inited`,
 *   and an import rejection (offline/blocked) fails fast the same way. The
 *   failed instance is destroyed; there is no retry control — the reader
 *   reloads the page (locked at step 06).
 *
 * Reveal detection uses a MutationObserver on the container rather than
 * filtering cross-origin `message` events: the loader wipes every non-iframe
 * container child once the widget reports `inited`, so "only the iframe
 * remains" is a parent-side, DOM-only success signal with no fragile
 * `event.source` identity comparison.
 *
 * The file name is fixed by `build.mjs` (pass-1 entry point); like `index.tsx`
 * it is a build entry, not a barrel.
 */

// === Local Constants ===============================================

/** DOM id of the comments container — forced by the loader (step-05 contract). */
const CONTAINER_ID = "remark42"
/** DOM id of the inline config script the runtime re-reads on every navigation. */
const CONFIG_SCRIPT_ID = "remark42-config"
/** Viewport gate: start loading when the container is this close to the viewport (D5). */
const GATE_ROOT_MARGIN = "600px"
/** Watchdog budget per mount; the loader's own reveal fallback fires at 5s, so this must exceed it. */
const WATCHDOG_TIMEOUT_MS = 15_000
/** Reader-facing failure note; recovery is a page reload, by locked decision. */
const FAILURE_MESSAGE = "Comments could not be loaded. Reload the page to try again."

// === Local Classes =================================================

/**
 * Owns all mutable runtime state for one page load: the module import, the live
 * widget instance, the gate observer, the reveal watcher and the watchdog. One
 * instance exists per page load (the script body runs exactly once); all route
 * work arrives through the `nav`/`prenav` document events.
 */
class Remark42Runtime {
	/** In-flight or resolved first import — also the double-import guard. The module persists for the page's lifetime. */
	private load: Promise<unknown> | null = null
	/** Teardown handle of the currently live widget instance, or null when nothing is mounted. */
	private liveInstance: Remark42Instance | null = null
	/** Gate observer armed for the current container; null when not waiting on the viewport. */
	private gateObserver: IntersectionObserver | null = null
	/** Watchdog timer id for the current mount; null when not armed. */
	private watchdog: number | null = null
	/** MutationObserver watching the current container for the `inited` reveal; null when not armed. */
	private revealObserver: MutationObserver | null = null
	/** Monotonic mount generation — lets stale continuations of superseded mounts exit silently. */
	private generation = 0
	/** Resolves once the first import's auto-run has left its handles on the global (fixture: `REMARK42::ready`). */
	private autoRunReady: Promise<Remark42Global | null> | null = null

	/**
	 * `nav` handler — runs on the first load and on every SPA navigation.
	 * Re-derives everything from the current DOM; never trusts prior state.
	 */
	onNav(): void {
		this.reset()
		const container = document.getElementById(CONTAINER_ID)
		const configScript = document.getElementById(CONFIG_SCRIPT_ID)
		const config = configScript ? parseConfigFromDom(configScript) : null
		if (!container || !config) {
			// No comments on this route (absent `id`, 404, bases, excalidraw) — stay a no-op.
			return
		}
		// Every mount waits on the viewport gate, module cached or not: the module
		// download is a one-time cost, but each mount fetches iframe.html and the
		// thread data — that per-mount traffic is what D5 protects.
		this.armGate(container, config)
	}

	/** `prenav` handler — everything DOM-bound must die before micromorph patches the body. */
	onPrenav(): void {
		this.reset()
	}

	/** `themechange` handler — live for the module's lifetime; a no-op when nothing is mounted. */
	onThemeChange(theme: "light" | "dark"): void {
		this.liveInstance?.changeTheme(theme)
	}

	/**
	 * Mounts the widget into the given container with the given config.
	 * Idempotent: destroys any live instance first, so rapid navigation can
	 * never leak a second one. All failure paths degrade to the in-container
	 * failure note; the article is never touched.
	 */
	private async mount(container: HTMLElement, config: RemarkConfig): Promise<void> {
		const generation = ++this.generation
		this.destroyInstance()
		// We own this global: `createInstance` validates `site_id` against it, and
		// the first import's auto-run mounts from it. `theme` is injected into the
		// copy so the iframe is created with the correct `colorScheme` and query
		// param — no light flash on a dark site.
		const themedConfig: RemarkConfig = { ...config, theme: currentTheme() }
		setWindowRemarkConfig(themedConfig)
		// The watchdog covers the whole mount — import, deferred auto-run, reveal —
		// so it is armed before any await.
		this.armWatchdog(container, generation)

		// The URL must be computed, never a literal — esbuild's pass-1 bundling
		// must not try to resolve the external module (verified at task 06).
		const firstImport = this.load === null
		if (firstImport) {
			console.debug("[remark42] loading the embed module")
			const moduleUrl = `${config.host}/web/embed.mjs`
			this.load = import(moduleUrl)
		}
		try {
			await this.load
			if (generation !== this.generation) return // superseded mid-import; the newest mount owns the widget
			let remark42 = getRemark42Global()
			// On the first import the auto-run mounts from window.remark_config and
			// leaves its handles on the global — adopt them. If the module landed
			// mid-parse the auto-run deferred to DOMContentLoaded, so wait for its
			// `REMARK42::ready` signal instead of failing on absent handles.
			if (firstImport && !remark42?.destroy) {
				remark42 = await this.waitForAutoRun()
				if (generation !== this.generation) return
			}
			// Afterwards, mount explicitly through the persisted createInstance
			// handle (module code never re-executes).
			this.liveInstance = firstImport
				? adoptGlobalInstance(remark42)
				: (remark42?.createInstance(themedConfig) ?? null)
			if (!this.liveInstance) {
				throw new Error("Remark42 global is missing or malformed after import")
			}
			this.armRevealWatch(container, generation)
		} catch (error) {
			if (generation !== this.generation) return
			console.error("[remark42] mounting the widget failed:", error)
			this.destroyInstance()
			this.stopRevealWatch()
			showFailure(container)
		}
	}

	/**
	 * Arms the viewport gate for a container. Applies to every mount — cached
	 * module included — because the iframe's per-mount fetches (iframe.html,
	 * thread data) are the traffic D5 gates. The observer is created only here
	 * — a container is confirmed present — and disconnected once it fires the
	 * mount.
	 */
	private armGate(container: HTMLElement, config: RemarkConfig): void {
		this.gateObserver = new IntersectionObserver(
			(entries) => {
				// The observer always fires once up front with the current state —
				// for a far-below-viewport container that is isIntersecting: false.
				// Stay armed in that case: the real callback comes when the container
				// crosses the 600px margin. Disconnect only once we act on it.
				if (!entries.some((entry) => entry.isIntersecting)) return
				this.disconnectGate()
				void this.mount(container, config)
			},
			{ rootMargin: GATE_ROOT_MARGIN },
		)
		this.gateObserver.observe(container)
	}

	/** Tears down everything tied to the current DOM and invalidates in-flight mounts. */
	private reset(): void {
		this.generation++
		this.destroyInstance()
		this.stopRevealWatch()
		this.disconnectGate()
	}

	/** Waits for the first import's auto-run; resolves immediately if it already ran. */
	private waitForAutoRun(): Promise<Remark42Global | null> {
		const existing = getRemark42Global()
		if (existing?.destroy) return Promise.resolve(existing)
		this.autoRunReady ??= new Promise((resolve) => {
			window.addEventListener("REMARK42::ready", () => resolve(getRemark42Global()), { once: true })
		})
		return this.autoRunReady
	}

	/** Arms the watchdog for a fresh mount; covers import, deferred auto-run and reveal. */
	private armWatchdog(container: HTMLElement, generation: number): void {
		this.watchdog = window.setTimeout(() => {
			this.watchdog = null
			if (generation !== this.generation) return
			console.error(
				"[remark42] widget did not reveal within",
				WATCHDOG_TIMEOUT_MS,
				"ms — showing the failure note",
			)
			this.destroyInstance()
			this.stopRevealWatch()
			showFailure(container)
		}, WATCHDOG_TIMEOUT_MS)
	}

	/** Arms the reveal watcher for a mounted instance. */
	private armRevealWatch(container: HTMLElement, generation: number): void {
		this.revealObserver = new MutationObserver(() => {
			if (generation !== this.generation) {
				this.stopRevealWatch()
				return
			}
			if (widgetRevealed(container)) this.stopRevealWatch()
		})
		this.revealObserver.observe(container, { childList: true })
	}

	/** Clears the watchdog and the reveal watcher; safe to call when neither is armed. */
	private stopRevealWatch(): void {
		if (this.watchdog !== null) {
			window.clearTimeout(this.watchdog)
			this.watchdog = null
		}
		this.revealObserver?.disconnect()
		this.revealObserver = null
	}

	/** Disconnects the gate observer; safe to call when none is armed. */
	private disconnectGate(): void {
		this.gateObserver?.disconnect()
		this.gateObserver = null
	}

	/**
	 * Destroys the live widget instance, if any, and clears the loader's
	 * instance handles off the global so it only ever describes a live widget.
	 * Also catches an orphaned auto-run instance from an in-flight first mount
	 * whose continuation went stale: its handles sit on the global, unowned.
	 */
	private destroyInstance(): void {
		const instance = this.liveInstance
		this.liveInstance = null
		instance?.destroy()
		const remark42 = getRemark42Global()
		if (!instance && remark42?.destroy) remark42.destroy()
		if (remark42) {
			delete remark42.destroy
			delete remark42.changeTheme
		}
	}
}

// === Local Functions ===============================================

/**
 * Extracts and validates the fresh per-page config from the inline script's
 * text. The script body is `var remark_config = {…}` — JSON produced by the
 * build, so slicing the outer braces and parsing is exact, not heuristic.
 * Returns null on any malformed content; the caller treats that as "no
 * comments on this page" (a build-time guarantee makes this a guard, not a
 * expected path).
 */
function parseConfigFromDom(configScript: Element): RemarkConfig | null {
	const text = configScript.textContent ?? ""
	const start = text.indexOf("{")
	const end = text.lastIndexOf("}")
	if (start === -1 || end <= start) return null
	try {
		const parsed: unknown = JSON.parse(text.slice(start, end + 1))
		return isRemarkConfig(parsed) ? parsed : null
	} catch {
		return null
	}
}

/** Runtime shape check for the config coming out of the DOM. */
function isRemarkConfig(value: unknown): value is RemarkConfig {
	if (typeof value !== "object" || value === null) return false
	const record = value as Record<string, unknown>
	return (
		typeof record.host === "string" &&
		record.host.length > 0 &&
		typeof record.site_id === "string" &&
		record.site_id.length > 0
	)
}

/** Reads `window.REMARK42` with a runtime shape check — no blind casts. */
function getRemark42Global(): Remark42Global | null {
	// The double cast is the deliberate boundary: `window` carries no index
	// signature, and the runtime shape check below — not the cast — establishes
	// the value's shape.
	const candidate: unknown = (window as unknown as Record<string, unknown>)["REMARK42"]
	if (typeof candidate !== "object" || candidate === null) return null
	const record = candidate as Record<string, unknown>
	if (typeof record.createInstance !== "function") return null
	return candidate as Remark42Global
}

/** Writes the fresh per-page config into the global the loader reads. */
function setWindowRemarkConfig(config: RemarkConfig): void {
	// Same boundary as `getRemark42Global`: the write target is validated by
	// the consumer (`createInstance`'s own `site_id` check), not by this cast.
	;(window as unknown as Record<string, unknown>)["remark_config"] = config
}

/**
 * Adopts the handles the auto-run mount left on the global after the first
 * import. Both are always set by a successful `createInstance` (fixture);
 * null means an unexpected module state and is treated as a mount failure.
 */
function adoptGlobalInstance(remark42: Remark42Global | null): Remark42Instance | null {
	if (!remark42) return null
	if (typeof remark42.destroy !== "function" || typeof remark42.changeTheme !== "function") return null
	return { destroy: remark42.destroy, changeTheme: remark42.changeTheme }
}

/** Current site theme; `saved-theme` is set before after-DOM scripts run (darkmode's beforeDOMLoaded). */
function currentTheme(): "light" | "dark" {
	return document.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light"
}

/**
 * Success signal for the reveal watcher: the loader has reported `inited` —
 * it appended the iframe and wiped every non-iframe container child.
 */
function widgetRevealed(container: HTMLElement): boolean {
	const iframe = container.querySelector(":scope > iframe[data-remark42-iframe]")
	if (!iframe) return false
	for (const child of container.children) {
		if (child !== iframe) return false
	}
	return true
}

/**
 * Runtime guard for the `themechange` event: the darkmode package dispatches a
 * `CustomEvent<{ theme: "light" | "dark" }>` on `document`, but this module
 * deliberately does not rely on the types package's global augmentation, so
 * the listener sees a plain `Event`. The guard establishes the shape before
 * `detail` is read.
 */
function hasThemeDetail(event: Event): event is CustomEvent<{ theme: "light" | "dark" }> {
	const detail: unknown = (event as { detail?: unknown }).detail
	if (typeof detail !== "object" || detail === null) return false
	const theme = (detail as { theme?: unknown }).theme
	return theme === "light" || theme === "dark"
}

/** Replaces the container's content with the failure note; never touches anything outside it. */
function showFailure(container: HTMLElement): void {
	const note = document.createElement("p")
	note.setAttribute("role", "status")
	note.textContent = FAILURE_MESSAGE
	container.replaceChildren(note)
}

// === Local Types ===================================================

/** Shape of the inline `remark_config` object the component renders into `script#remark42-config`. */
type RemarkConfig = {
	host: string
	site_id: string
	[key: string]: unknown
}

/** The subset of `window.REMARK42` the runtime relies on (v1.18.0 fixture). */
type Remark42Global = {
	createInstance: (config: RemarkConfig) => Remark42Instance
	/** Present while an instance is live; the loader deletes both on its own destroy. */
	destroy?: () => void
	changeTheme?: (theme: string) => void
}

/** Handle for one live widget instance — returned by `createInstance`, adopted from the global after the auto-run. */
type Remark42Instance = {
	changeTheme: (theme: string) => void
	destroy: () => void
}

// === Entry Point ===================================================

const remark42Runtime = new Remark42Runtime()
document.addEventListener("nav", () => remark42Runtime.onNav())
document.addEventListener("prenav", () => remark42Runtime.onPrenav())
document.addEventListener("themechange", (event) => {
	// Not a theme event, or a theme value we do not recognise — ignore.
	if (hasThemeDetail(event)) remark42Runtime.onThemeChange(event.detail.theme)
})

export {}
