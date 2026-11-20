import assert from "node:assert/strict"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"
import { h } from "preact"
import { render } from "preact-render-to-string"
import { fromHtml } from "hast-util-from-html"
import type { Element, Root } from "hast"
import type { QuartzPluginData } from "../plugins/vfile"
import { isFilePath, isFullSlug, resolveRelative, slugifyFilePath } from "../util/path"
import type { QuartzComponent, QuartzComponentProps } from "./types"

const bundle = await build({
	entryPoints: [fileURLToPath(new URL("./Explorer.tsx", import.meta.url))],
	bundle: true,
	write: false,
	platform: "node",
	format: "esm",
	jsx: "automatic",
	jsxImportSource: "preact",
	loader: { ".css": "text" },
})
const moduleUrl = `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].contents).toString("base64")}`
const Explorer: QuartzComponent = (await import(moduleUrl)).default()

function page(source: string, title = "", icon?: unknown, published?: string): QuartzPluginData {
	assert.ok(isFilePath(source))
	const slug = published ?? slugifyFilePath(source)
	assert.ok(isFullSlug(slug))
	return { relativePath: source, slug, frontmatter: { title, ...(icon === undefined ? {} : { icon }) } }
}

const files = [
	page("A/_A.md", "Alpha & <one>", undefined, "elsewhere/landing"),
	page("B/_B.md", "Beta"),
	page("C/_C.md", "Gamma", "stone"),
	page("D/_D.md", "Invalid", "bad"),
	page("A/deep/_deep.md"),
	page("index.md", "", "house"),
]

function output(current: QuartzPluginData, serve = false, baseUrl = "example.com/blog"): Root {
	const props = {
		allFiles: files,
		fileData: current,
		cfg: { baseUrl },
		ctx: { argv: { serve } },
	} as QuartzComponentProps
	return fromHtml(render(h(Explorer, props)), { fragment: true })
}

function elements(root: Root | Element, tag: string): Element[] {
	return root.children.flatMap((child) =>
		child.type === "element" ? [...(child.tagName === tag ? [child] : []), ...elements(child, tag)] : [],
	)
}

function text(node: Root | Element): string {
	return node.children
		.map((child) => (child.type === "text" ? child.value : child.type === "element" ? text(child) : ""))
		.join("")
}

test("renders one ordered list with published links, escaped labels, and only used icon definitions", () => {
	const current = page("A/nested/note.md")
	const tree = output(current)
	assert.equal(elements(tree, "ul").length, 1)
	const links = elements(tree, "a")
	assert.deepEqual(links.map(text), ["Alpha & <one>", "Beta", "Gamma", "Invalid", "Home"])
	assert.equal(links[0].properties.href, resolveRelative(current.slug!, files[0].slug!))
	assert.equal(links[4].properties.href, resolveRelative(current.slug!, files[5].slug!))
	const symbols = elements(tree, "symbol").map((node) => node.properties.id)
	assert.deepEqual(symbols, ["tl-explorer-icon-folder-closed", "tl-explorer-icon-stone", "tl-explorer-icon-house"])
	const references = elements(tree, "use").map((node) => node.properties.href)
	assert.equal(references.filter((href) => href === "#tl-explorer-icon-folder-closed").length, 2)
	assert.ok(references.every((href) => symbols.includes(String(href).slice(1))))
	assert.equal(elements(links[3], "svg").length, 0)
})

test("marks sections by source folder and Home only by root source identity", () => {
	for (const [current, expected] of [
		[page("A/_A.md"), "Alpha & <one>"],
		[page("A/deep/note.md"), "Alpha & <one>"],
		[page("A/view.base"), "Alpha & <one>"],
		// Discovery matches case-insensitively, so highlight must too — but
		// lowercase must not merge `A` into a differently-prefixed folder.
		[page("a/note.md"), "Alpha & <one>"],
		[page("AB/note.md"), ""],
		[page("index.md"), "Home"],
		[page("other.md"), ""],
		[{ slug: files[0].slug }, ""],
		[{ slug: "404" }, ""],
	] as [QuartzPluginData, string][]) {
		const active = elements(output(current), "li").filter((node) =>
			node.properties.className?.includes("is-current"),
		)
		assert.equal(active.length, expected ? 1 : 0)
		if (expected) assert.equal(text(active[0]), expected)
	}
})

test("404 links use the serve root or configured production base path", () => {
	const current = { slug: "404" } as QuartzPluginData
	const serveLinks = elements(output(current, true), "a")
	const productionLinks = elements(output(current), "a")
	assert.equal(serveLinks[0].properties.href, "/elsewhere/landing")
	assert.equal(serveLinks[4].properties.href, "/")
	assert.equal(productionLinks[0].properties.href, "/blog/elsewhere/landing")
	assert.equal(productionLinks[4].properties.href, "/blog/")
	assert.equal(elements(output(current, false, "example.com"), "a")[4].properties.href, "/")
})
