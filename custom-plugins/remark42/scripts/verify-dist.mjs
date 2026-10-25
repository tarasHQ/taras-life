/**
 * Freshness gate for the committed `dist/` output (decision D1's consistency check).
 *
 * Four checks, in order:
 *   1. Rebuild into a temp directory via `build.mjs`'s output override.
 *   2. Diff the fresh build against the committed `dist/` — fail on changed,
 *      missing or extra files (i.e. `src/` and `dist/` disagree).
 *   3. Assert every file under `dist/` is git-tracked, which catches a build
 *      that stops emitting a file.
 *   4. Assert `preact/jsx-runtime` resolves to the same realpath from the root
 *      package and from the plugin entry — `.npmrc`'s `legacy-peer-deps=true`
 *      makes `peerDependencies` inert, so the single-copy guarantee must be an
 *      explicit check, not a declaration.
 *
 * Dependency-free by design: it runs inside `npm run check` on every gate.
 *
 * Fix command on failure: `npm run build:plugins` (from the repo root).
 */
import { execFileSync } from "node:child_process"
import { createRequire } from "node:module"
import { existsSync, readdirSync, readFileSync, realpathSync, rmSync, statSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, relative } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const pluginRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const distDir = join(pluginRoot, "dist")
const rootDir = join(pluginRoot, "..", "..")

/** Recursively list files under `dir` as paths relative to it; [] when absent. */
function listFiles(dir) {
	if (!existsSync(dir)) return []
	const out = []
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry)
		if (statSync(full).isDirectory()) out.push(...listFiles(full).map((p) => join(entry, p)))
		else out.push(entry)
	}
	return out
}

// === Check 1: fresh build into a temp dir =========================

const tempDir = join(tmpdir(), `remark42-verify-${process.pid}`)
const problems = []
try {
	execFileSync(process.execPath, ["build.mjs", tempDir], { cwd: pluginRoot, stdio: "pipe" })

	// === Check 2: diff fresh output against committed dist/ =========

	const freshFiles = new Set(listFiles(tempDir))
	const committedFiles = new Set(listFiles(distDir))
	for (const file of freshFiles) {
		if (!committedFiles.has(file)) {
			problems.push(`missing from committed dist/: ${file}`)
			continue
		}
		if (!readFileSync(join(tempDir, file)).equals(readFileSync(join(distDir, file)))) {
			problems.push(`stale in committed dist/: ${file}`)
		}
	}
	for (const file of committedFiles) {
		if (!freshFiles.has(file)) problems.push(`no longer emitted but present in dist/: ${file}`)
	}

	// === Check 3: everything under dist/ is git-tracked =============

	const tracked = new Set(
		// Run inside dist/ so ls-files paths are relative to dist/ and match the
		// listings produced by listFiles() above.
		execFileSync("git", ["ls-files", "--", "."], { cwd: distDir, encoding: "utf8" }).split("\n").filter(Boolean),
	)
	for (const file of committedFiles) {
		if (!tracked.has(file)) problems.push(`not git-tracked: dist/${file}`)
	}
} finally {
	rmSync(tempDir, { recursive: true, force: true })
}

// === Check 4: exactly one preact copy =============================

try {
	const fromRoot = createRequire(pathToFileURL(join(rootDir, "package.json")))
	const fromPlugin = createRequire(pathToFileURL(join(distDir, "index.js")))
	const rootPreact = realpathSync(fromRoot.resolve("preact/jsx-runtime"))
	const pluginPreact = realpathSync(fromPlugin.resolve("preact/jsx-runtime"))
	if (rootPreact !== pluginPreact) {
		problems.push(`preact resolves to two copies:\n  root:   ${rootPreact}\n  plugin: ${pluginPreact}`)
	}
} catch (error) {
	problems.push(`preact single-copy check could not run: ${error.message}`)
}

// === Verdict ======================================================

if (problems.length > 0) {
	console.error("[remark42] verify:dist failed — dist/ is not the committed truth:")
	for (const problem of problems) console.error(`  ${problem}`)
	console.error("\nFix: run `npm run build:plugins` from the repo root, then commit the updated dist/.")
	process.exit(1)
}
console.log("[remark42] verify:dist passed — committed dist/ matches a fresh build")
