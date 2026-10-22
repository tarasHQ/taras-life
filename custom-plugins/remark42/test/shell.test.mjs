// Exercise the compiled component and its manifest, without contacting Remark42.
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { renderToString } from "preact-render-to-string"
import { fromHtml } from "hast-util-from-html"
import { visit } from "unist-util-visit"
import * as components from "../dist/index.js"

const options = {
	host: "https://comments.taras.life",
	siteId: "taras-life",
	threadBaseUrl: "https://taras.life/comments",
}

/** Render metadata only; no browser bootstrap runs in Node. */
function renderContainer(frontmatter) {
	const Component = components.Remark42(options)
	return renderToString(Component({ fileData: { frontmatter, slug: "a-movable-note" }, allFiles: [] }))
}

/** Inspect browser-parsed attributes instead of prescribing one entity encoding. */
function htmlElements(html) {
	const elements = []
	visit(fromHtml(html, { fragment: true }), "element", (node) => {
		elements.push(node)
	})
	return elements
}

test("the manifest declares the component exported by its compiled entry point", async () => {
	const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"))
	assert.equal(manifest.quartz.name, "remark42")
	assert.equal(manifest.quartz.category, "component")
	assert.equal(manifest.exports["./components"], "./dist/index.js")
	assert.equal(typeof components.Remark42, "function")
	assert.deepEqual(Object.keys(manifest.quartz.components), ["Remark42"])
})

test("missing or invalid comment-id values render nothing, never a page-URL fallback", () => {
	for (const frontmatter of [
		undefined,
		{},
		{ "comment-id": "" },
		{ "comment-id": "   " },
		{ "comment-id": 42 },
		{ "comment-id": true },
	]) {
		assert.equal(renderContainer(frontmatter), "")
	}
})

test("comments: false suppresses a widget even when an ID exists", () => {
	assert.equal(renderContainer({ "comment-id": "example-note", comments: false }), "")
})

test("an opted-in page carries public configuration and the stable thread URL", () => {
	const html = renderContainer({ "comment-id": " example-note ", title: "Example" })
	const container = htmlElements(html).find((node) => node.properties.id === "remark42")
	assert.ok(container)
	assert.equal(container.properties.dataCommentId, "example-note")
	assert.equal(container.properties.dataRemark42Host, options.host)
	assert.equal(container.properties.dataRemark42SiteId, options.siteId)
	assert.equal(container.properties.dataRemark42Url, "https://taras.life/comments/example-note")
	assert.equal(container.properties.dataRemark42Title, "Example")
	assert.ok(html.includes("Loading comments"))
	assert.ok(!html.includes("<script"))
	assert.ok(!html.includes("<iframe"))
})

test("frontmatter stays attribute data, not executable HTML", () => {
	const id = '<script>alert("test")</script>'
	const elements = htmlElements(renderContainer({ "comment-id": id }))
	assert.deepEqual(
		elements.map((node) => node.tagName),
		["section", "h2", "div", "p"],
	)
	const container = elements.find((node) => node.properties.id === "remark42")
	assert.equal(container.properties.dataCommentId, id)
	assert.equal(container.properties.dataRemark42Url, `https://taras.life/comments/${encodeURIComponent(id)}`)
})

test("the component supplies one shared browser bootstrap and requires explicit settings", () => {
	const Component = components.Remark42(options)
	assert.equal(typeof Component.afterDOMLoaded, "string")
	assert.ok(Component.afterDOMLoaded.length > 0)
	assert.throws(() => components.Remark42(), /Configure host, siteId, and threadBaseUrl/)
})

test("duplicate IDs warn once per metadata array and are checked again on a rebuild", (t) => {
	const warning = t.mock.method(console, "warn", () => {})
	const Component = components.Remark42(options)
	const allFiles = [
		{ relativePath: "a.md", frontmatter: { "comment-id": "shared" } },
		{ relativePath: "b.md", frontmatter: { "comment-id": "shared" } },
	]
	const props = { fileData: allFiles[0], allFiles }
	Component(props)
	Component(props)
	assert.equal(warning.mock.callCount(), 1)
	assert.match(warning.mock.calls[0].arguments[0], /a\.md, b\.md/)
	Component({ ...props, allFiles: [...allFiles] })
	assert.equal(warning.mock.callCount(), 2)
})
