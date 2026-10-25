/**
 * Plugin build script — compiles the committed `dist/` output (decision D1).
 *
 * Two passes:
 *   1. `src/browser.ts`  → minified IIFE text, kept in memory (the browser bootstrap).
 *   2. `src/index.tsx`   → the node-side ESM entry Quartz loads, with a virtual module
 *      `remark42:browser` resolved to the pass-1 text as a string literal.
 *
 * The output directory can be overridden (argv[1] after script path, or env
 * `REMARK42_BUILD_OUT`) so `verify:dist` can build into a temp directory without
 * touching the working tree. esbuild is deterministic here, which is what makes the
 * freshness gate meaningful.
 *
 * Usage: `node build.mjs [outDir]`
 */
import { build } from "esbuild"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const pluginRoot = dirname(fileURLToPath(import.meta.url))
const outDir = process.argv[2] ?? process.env.REMARK42_BUILD_OUT ?? join(pluginRoot, "dist")

// === Pass 1: browser bootstrap ====================================

/** Bundle the bootstrap into minified IIFE text; it ships as a string, not a file. */
const browserResult = await build({
	absWorkingDir: pluginRoot,
	entryPoints: ["src/browser.ts"],
	bundle: true,
	platform: "browser",
	format: "iife",
	minify: true,
	write: false,
})
const browserScript = browserResult.outputFiles[0].text

// === Pass 2: node-side plugin entry ===============================

/** Resolves the virtual `remark42:browser` specifier to the pass-1 script text. */
const virtualBrowserModule = {
	name: "remark42-browser-virtual",
	setup(build) {
		build.onResolve({ filter: /^remark42:browser$/ }, (args) => ({
			path: args.path,
			namespace: "remark42-browser",
		}))
		build.onLoad({ filter: /.*/, namespace: "remark42-browser" }, () => ({
			// JSON.stringify produces a valid, fully escaped JS string literal.
			contents: `export default ${JSON.stringify(browserScript)}`,
			loader: "js",
		}))
	},
}

await build({
	absWorkingDir: pluginRoot,
	entryPoints: ["src/index.tsx"],
	outfile: join(outDir, "index.js"),
	bundle: true,
	platform: "node",
	format: "esm",
	// Keep preact (and everything else) external: the host supplies it at runtime,
	// and the single-copy guarantee is enforced by verify:dist, not by bundling.
	packages: "external",
	jsx: "automatic",
	jsxImportSource: "preact",
	plugins: [virtualBrowserModule],
})

// === Post-build assertions ========================================

/** Verify the browser script actually embedded and no node builtins leaked in. */
const emitted = await readFile(join(outDir, "index.js"), "utf8")
if (!emitted.includes("loading the embed module")) {
	throw new Error("[remark42] build.mjs: the browser script did not embed into dist/index.js")
}
if (/\bnode:[a-z]/.test(emitted)) {
	throw new Error("[remark42] build.mjs: dist/index.js contains a node: import")
}

await mkdir(outDir, { recursive: true })
await writeFile(join(outDir, "index.js"), emitted)
console.log(`[remark42] built dist/ (${outDir})`)
