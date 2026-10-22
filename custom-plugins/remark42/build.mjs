// Reuse the host's esbuild: compile the browser lifecycle as text for Quartz,
// then bundle the server-side component and independently testable helpers.
import { build } from "esbuild"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(fileURLToPath(import.meta.url))
const browser = await build({
	absWorkingDir: root,
	entryPoints: ["src/browser.ts"],
	bundle: true,
	write: false,
	platform: "browser",
	format: "iife",
	target: "es2020",
	minify: true,
})
const browserScript = browser.outputFiles[0].text

await build({
	absWorkingDir: root,
	entryPoints: {
		index: "src/index.tsx",
		identity: "src/identity.ts",
		runtime: "src/runtime.ts",
	},
	outdir: "dist",
	bundle: true,
	packages: "external",
	platform: "node",
	format: "esm",
	target: "es2022",
	jsx: "automatic",
	jsxImportSource: "preact",
	logLevel: "info",
	plugins: [
		{
			name: "remark42-browser-script",
			// Keep browser code out of Node execution: Quartz needs it as a resource string.
			setup(build) {
				build.onResolve({ filter: /^remark42:browser$/ }, () => ({
					path: "remark42:browser",
					namespace: "remark42-browser-script",
				}))
				build.onLoad({ filter: /.*/, namespace: "remark42-browser-script" }, () => ({
					contents: `export default ${JSON.stringify(browserScript)}`,
					loader: "js",
				}))
			},
		},
	],
})
