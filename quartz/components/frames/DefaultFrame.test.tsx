import assert from "node:assert/strict"
import test from "node:test"
import { render } from "preact-render-to-string"
import type { QuartzComponent, QuartzComponentProps } from "../types"
import { DefaultFrame } from "./DefaultFrame"
import type { PageFrameProps } from "./types"

function widget(name: string, region?: QuartzComponent["leftSidebarRegion"]): QuartzComponent {
	const component: QuartzComponent = (props) => <div data-widget={name}>{props.marker}</div>
	component.leftSidebarRegion = region
	return component
}

function frame(left: QuartzComponent[]): string {
	const body = widget("body")
	return render(
		DefaultFrame.render({
			// The frame forwards this fixture to stub widgets, which read only marker.
			componentData: { marker: "shared-props" } as unknown as QuartzComponentProps,
			head: body,
			header: [],
			beforeBody: [],
			pageBody: body,
			afterBody: [],
			left,
			right: [],
			footer: [],
		} satisfies PageFrameProps),
	)
}

test("partitions left widgets once and keeps controls outside both regions", () => {
	const html = frame([
		widget("title", "top"),
		widget("explorer"),
		widget("toolbar", "top"),
		widget("future"),
		widget("controls", "panel-controls"),
	])
	const top = html.match(/<div class="left-sidebar-top">(.*?)<\/div><div class="left-sidebar-panel">/s)
	assert.ok(top)
	assert.ok(top[1].includes('data-widget="title"'))
	assert.ok(top[1].includes('data-widget="toolbar"'))
	assert.ok(html.indexOf('data-widget="explorer"') < html.indexOf('data-widget="future"'))
	for (const name of ["title", "toolbar", "explorer", "future", "controls"]) {
		assert.equal(html.split(`data-widget="${name}"`).length - 1, 1)
	}
	assert.ok(html.includes('data-widget="controls">shared-props'))
})

test("empty, top-only, and panel-only layouts retain their intended structure", () => {
	assert.match(frame([]), /<div class="left sidebar"><\/div>/)
	const topOnly = frame([widget("title", "top"), widget("controls", "panel-controls")])
	assert.doesNotMatch(topOnly, /left-sidebar-panel|data-widget="controls"/)
	const panelOnly = frame([widget("panel"), widget("controls", "panel-controls")])
	assert.match(panelOnly, /left-sidebar-panel/)
	assert.match(panelOnly, /data-widget="controls"/)
})
