/** Exercises the shipped theme scripts against the head metadata contract. */
import test from "node:test"
import assert from "node:assert/strict"
import { runInNewContext } from "node:vm"
import { themeColorInitScript, themeInitScript, themeToggleScript } from "./themeContract"

test("browser chrome follows the stored mode and every toggle, independently of the OS", () => {
	const makeMeta = (color: string, darkLow?: string) => {
		const attributes: Record<string, string> = { content: color, "data-color": color }
		if (darkLow) attributes["data-dark-low"] = darkLow
		return {
			attributes,
			getAttribute: (name: string) => attributes[name] ?? null,
			setAttribute: (name: string, value: string) => {
				attributes[name] = value
			},
		}
	}
	const light = makeMeta("#f0e7d7")
	const dark = makeMeta("#100e0b", "#1b1712")
	let mode = ""
	let click: ((event: unknown) => void) | undefined
	const events: string[] = []
	class FakeElement {
		closest() {
			return this
		}
	}
	class FakeEvent {
		detail: { theme: string }
		constructor(_name: string, options: { detail: { theme: string } }) {
			this.detail = options.detail
		}
	}
	const context = {
		document: {
			documentElement: {
				setAttribute: (_name: string, value: string) => {
					mode = value
				},
				getAttribute: () => mode,
			},
			querySelector: (selector: string) => (selector.includes('"light"') ? light : dark),
			addEventListener: (_name: string, listener: (event: unknown) => void) => {
				click = listener
			},
			dispatchEvent: (event: FakeEvent) => events.push(event.detail.theme),
		},
		localStorage: { getItem: () => "dark-low", setItem: () => {} },
		window: { matchMedia: () => ({ matches: false }) },
		Element: FakeElement,
		CustomEvent: FakeEvent,
	}
	runInNewContext(themeInitScript, context)
	runInNewContext(themeColorInitScript, context)
	runInNewContext(themeToggleScript, context)
	const assertColor = (color: string) => {
		assert.equal(light.attributes.content, color)
		assert.equal(dark.attributes.content, color)
	}
	assertColor("#1b1712")
	assert.ok(click)
	click({ target: new FakeElement() })
	assertColor("#f0e7d7")
	click({ target: new FakeElement() })
	assertColor("#100e0b")
	click({ target: new FakeElement() })
	assertColor("#1b1712")
	assert.deepEqual(events, ["light", "dark", "dark-low"])
})
