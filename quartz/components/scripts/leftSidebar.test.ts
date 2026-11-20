import assert from "node:assert/strict"
import test from "node:test"
import { setupLeftSidebar } from "./leftSidebar"

class Classes {
	private values = new Set<string>()
	add(name: string) {
		this.values.add(name)
	}
	remove(name: string) {
		this.values.delete(name)
	}
	contains(name: string) {
		return this.values.has(name)
	}
	toggle(name: string) {
		this.contains(name) ? this.remove(name) : this.add(name)
	}
}

function fixture() {
	const doc = new EventTarget()
	const button = new EventTarget()
	const media = new EventTarget() as EventTarget & { matches: boolean }
	media.matches = true
	const classes = new Classes()
	let searchActive = false
	let panelPresent = true
	const sidebar = {
		classList: classes,
		querySelector: (selector: string) =>
			selector === ".left-sidebar-panel" ? (panelPresent ? {} : null) : searchActive ? {} : null,
	}
	const control = Object.assign(button, { closest: () => sidebar })
	let controlPresent = true
	const documentStub = Object.assign(doc, { querySelector: () => (controlPresent ? control : null) })
	const view = { matchMedia: () => media }
	return {
		doc,
		button,
		media,
		classes,
		search(value: boolean) {
			searchActive = value
		},
		panel(value: boolean) {
			panelPresent = value
		},
		control(value: boolean) {
			controlPresent = value
		},
		setup: () => setupLeftSidebar(documentStub as unknown as Document, view as unknown as Window),
	}
}

function escape(doc: EventTarget) {
	const event = new Event("keydown")
	Object.defineProperty(event, "key", { value: "Escape" })
	doc.dispatchEvent(event)
}

test("toggle, Search Escape ordering, navigation, width changes, and cleanup", () => {
	const f = fixture()
	const cleanup = f.setup()
	assert.equal(f.classes.contains("has-mobile-transition"), false)
	f.button.dispatchEvent(new Event("click"))
	assert.equal(f.classes.contains("is-mobile-open"), true)
	assert.equal(f.classes.contains("has-mobile-transition"), true)
	f.search(true)
	f.doc.addEventListener("keydown", () => f.search(false), { once: true })
	escape(f.doc)
	assert.equal(f.classes.contains("is-mobile-open"), true)
	escape(f.doc)
	assert.equal(f.classes.contains("is-mobile-open"), false)
	assert.equal(f.classes.contains("has-mobile-transition"), true)
	f.button.dispatchEvent(new Event("click"))
	f.doc.dispatchEvent(new Event("prenav"))
	assert.equal(f.classes.contains("is-mobile-open"), false)
	assert.equal(f.classes.contains("has-mobile-transition"), false)
	f.button.dispatchEvent(new Event("click"))
	f.media.matches = false
	f.media.dispatchEvent(new Event("change"))
	assert.equal(f.classes.contains("is-mobile-open"), false)
	assert.equal(f.classes.contains("has-mobile-transition"), false)
	f.button.dispatchEvent(new Event("click"))
	assert.equal(f.classes.contains("is-mobile-open"), false)
	assert.equal(f.classes.contains("has-mobile-transition"), false)
	f.media.matches = true
	f.media.dispatchEvent(new Event("change"))
	assert.equal(f.classes.contains("has-mobile-transition"), false)
	f.button.dispatchEvent(new Event("click"))
	cleanup()
	assert.equal(f.classes.contains("is-mobile-open"), false)
	assert.equal(f.classes.contains("has-mobile-transition"), false)
	f.button.dispatchEvent(new Event("click"))
	assert.equal(f.classes.contains("is-mobile-open"), false)
	const again = f.setup()
	f.button.dispatchEvent(new Event("click"))
	assert.equal(f.classes.contains("is-mobile-open"), true)
	f.button.dispatchEvent(new Event("click"))
	assert.equal(f.classes.contains("is-mobile-open"), false)
	again()
})

test("missing controls or panel are safe no-ops", () => {
	const f = fixture()
	f.control(false)
	f.setup()()
	f.control(true)
	f.panel(false)
	f.setup()()
	f.button.dispatchEvent(new Event("click"))
	assert.equal(f.classes.contains("is-mobile-open"), false)
})
