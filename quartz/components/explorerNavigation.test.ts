/** Protects Explorer discovery and its handoff from Quartz's existing frontmatter parsing. */
import assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { NoteProperties } from "@quartz-community/note-properties"
import { parse } from "yaml"
import { createFileParser, createMdProcessor } from "../processors/parse"
import type { QuartzPluginsJson } from "../plugins/loader/types"
import type { QuartzTransformerPluginInstance } from "../plugins/types"
import type { QuartzPluginData } from "../plugins/vfile"
import type { BuildCtx } from "../util/ctx"
import { isFilePath, isFullSlug, slugifyFilePath } from "../util/path"
import { buildExplorerNavigation } from "./explorerNavigation"

test("discovers only the homepage and immediate-folder entries, preserving punctuation and filename case", () => {
	const files = [
		page("index.md"),
		page("@system/_@SYSTEM.MD"),
		page("_static/__static.md"),
		page("R&D!/_r&d!.md"),
		page("My Folder/_my folder.md"),
		page("@system/projects/_projects.md"),
		page("@system/index.md"),
		page("@system/ordinary.md"),
		page("@system/_system.md"),
		page("_@system.md"),
		page("404.md"),
		page("data.base"),
		{},
	]
	const entries = buildExplorerNavigation(files)
	assert.deepEqual(
		entries.map((entry) => entry.relativePath).sort(),
		["index.md", "@system/_@SYSTEM.MD", "_static/__static.md", "R&D!/_r&d!.md", "My Folder/_my folder.md"].sort(),
	)
	assert.deepEqual(
		entries
			.filter((entry) => entry.kind === "section")
			.map((entry) => entry.label)
			.sort(),
		["@SYSTEM", "_static", "r&d!", "my folder"].sort(),
	)
})

test("sorts by displayed title rather than source name, preserves published slugs, and places Home last", () => {
	const files = [
		page("A/_A.md", { title: "Zulu" }),
		page("index.md", { title: "First" }, "published-home"),
		page("Z/_Z.md", { title: "Alpha" }, "published/landing"),
		page("B/_B.md", { title: "_B" }),
	]
	const entries = buildExplorerNavigation(files)
	assert.deepEqual(
		entries.map(({ label, slug, kind }) => ({ label, slug, kind })),
		[
			{ label: "Alpha", slug: "published/landing", kind: "section" },
			{ label: "B", slug: files[3].slug, kind: "section" },
			{ label: "Zulu", slug: files[0].slug, kind: "section" },
			{ label: "Home", slug: "published-home", kind: "home" },
		],
	)
	assert.deepEqual(
		files.map((file) => file.frontmatter?.title),
		["Zulu", "First", "Alpha", "_B"],
	)
})

test("preserves a title that differs from the filename stem only by case", () => {
	const entries = buildExplorerNavigation([page("System/_System.md", { title: "_SYSTEM" })])
	assert.equal(entries[0].label, "_SYSTEM")
})

test("uses the filename fallback without frontmatter and breaks equal-label ties by source path", () => {
	const plain = page("Plain/_Plain.md")
	delete plain.frontmatter
	const entries = buildExplorerNavigation([
		page("Z/_Z.md", { title: "Shared" }),
		plain,
		page("A/_A.md", { title: "Shared" }),
	])
	assert.deepEqual(
		entries.map(({ relativePath, label }) => ({ relativePath, label })),
		[
			{ relativePath: "Plain/_Plain.md", label: "Plain" },
			{ relativePath: "A/_A.md", label: "Shared" },
			{ relativePath: "Z/_Z.md", label: "Shared" },
		],
	)
})

test("icon values never change inclusion and retain absent versus supplied unusable selections", () => {
	const entries = buildExplorerNavigation([
		page("Absent/_Absent.md"),
		page("Selected/_Selected.md", { title: "", icon: "settings" }),
		page("Null/_Null.md", { title: "", icon: null }),
		page("Unknown/_Unknown.md", { title: "", icon: "unrecognized" }),
		page("Invalid/_Invalid.md", { title: "", icon: false }),
	])
	assert.deepEqual(
		entries.map(({ label, icon }) => ({ label, icon })),
		[
			{ label: "Absent", icon: { supplied: false } },
			{ label: "Invalid", icon: { supplied: true, value: false } },
			{ label: "Null", icon: { supplied: true, value: null } },
			{ label: "Selected", icon: { supplied: true, value: "settings" } },
			{ label: "Unknown", icon: { supplied: true, value: "unrecognized" } },
		],
	)
})

test("uses Quartz's real parser and configured title fallback without provenance tracking", async (t) => {
	const config: QuartzPluginsJson = parse(
		await readFile(new URL("../../quartz.config.yaml", import.meta.url), "utf8"),
	)
	const configured = config.plugins.find((plugin) => plugin.source === "@quartz-community/note-properties")
	assert.ok(configured?.enabled, "The integration test must exercise the configured frontmatter transformer")

	const directory = (await mkdtemp(path.join(tmpdir(), "quartz-explorer-"))).replaceAll("\\", "/")
	t.after(() => rm(directory, { recursive: true, force: true }))
	const sources = [
		{ relativePath: "Missing/_Missing.md", markdown: "Body", title: "_Missing", label: "Missing" },
		{ relativePath: "Empty/_Empty.md", markdown: '---\ntitle: ""\n---\nBody', title: "_Empty", label: "Empty" },
		{
			relativePath: "Null/_Null.md",
			markdown: "---\ntitle: null\nicon: null\n---\nBody",
			title: "_Null",
			label: "Null",
		},
		{ relativePath: "Equal/_Equal.md", markdown: "---\ntitle: _Equal\n---\nBody", title: "_Equal", label: "Equal" },
		{
			relativePath: "Custom/_Custom.md",
			markdown: '---\ntitle: "System: notes"\nicon: settings\n---\nBody',
			title: "System: notes",
			label: "System: notes",
		},
		{ relativePath: "Number/_Number.md", markdown: "---\ntitle: 42\n---\nBody", title: "42", label: "42" },
	]
	const fps = await Promise.all(
		sources.map(async ({ relativePath, markdown }) => {
			const fp = `${directory}/${relativePath}`
			assert.ok(isFilePath(fp))
			await mkdir(path.dirname(fp), { recursive: true })
			await writeFile(fp, markdown)
			return fp
		}),
	)
	// The installed community transformer implements the same runtime hooks as the host,
	// but its published context types differ from this checkout's internal declarations.
	const transformer = NoteProperties(configured.options) as QuartzTransformerPluginInstance
	const ctx: BuildCtx = {
		buildId: "explorer-test",
		argv: { directory, output: directory, verbose: false, serve: false, watch: false, port: 0, wsPort: 0 },
		cfg: {
			configuration: {
				pageTitle: "Explorer test",
				enableSPA: false,
				enablePopovers: false,
				analytics: null,
				ignorePatterns: [],
				locale: "en-US",
			},
			plugins: { transformers: [transformer], filters: [], emitters: [] },
		},
		allSlugs: [],
		allFiles: fps,
		incremental: false,
		virtualPages: [],
	}
	const parsed = await createFileParser(ctx, fps)(createMdProcessor(ctx))
	assert.equal(parsed.length, sources.length)
	const entries = buildExplorerNavigation(parsed.map(([, file]) => file.data))
	for (const source of sources) {
		const file = parsed.find(([, file]) => file.data.relativePath === source.relativePath)?.[1]
		const entry = entries.find((entry) => entry.relativePath === source.relativePath)
		assert.ok(file)
		assert.ok(entry)
		assert.equal(file.data.frontmatter?.title, source.title)
		assert.equal(entry.label, source.label)
		assert.equal(entry.slug, file.data.slug)
	}
	assert.deepEqual(entries.find((entry) => entry.label === "Missing")?.icon, { supplied: false })
	assert.deepEqual(entries.find((entry) => entry.label === "Null")?.icon, { supplied: true, value: null })
	assert.deepEqual(entries.find((entry) => entry.label === "System: notes")?.icon, {
		supplied: true,
		value: "settings",
	})
})

/** Constructs processed-page fixtures while checking the branded source paths and explicit published slugs. */
function page(
	relativePath: string,
	frontmatter: { title: string; [key: string]: unknown } = { title: "" },
	publishedSlug?: string,
): QuartzPluginData {
	assert.ok(isFilePath(relativePath))
	const slug = publishedSlug ?? slugifyFilePath(relativePath)
	assert.ok(isFullSlug(slug))
	return { relativePath, slug, frontmatter }
}
