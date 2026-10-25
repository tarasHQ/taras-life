/**
 * Import guard for the plugin's runtime sources.
 *
 * Fails when anything under `src/` imports:
 *   - Quartz host modules (`quartz/...`) or anything escaping `src/` — the plugin
 *     must depend only on its declared dependencies and `@quartz-community/types`;
 *   - Node builtins, both `node:*` and bare names — the emitted code runs in the
 *     browser bootstrap path and the entry must stay browser/node-clean.
 *
 * Scoped to `src/` only: `build.mjs` and `scripts/` legitimately use Node builtins.
 * Deliberately a Node script rather than a `grep` pipeline — npm runs scripts through
 * `cmd.exe` on Windows, so a grep-based guard is a portability bug.
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src")

/** Bare Node builtins that must never appear as import specifiers in `src/`. */
const forbiddenBareBuiltins = new Set(["fs", "path", "url", "crypto", "os", "process", "child_process"])

/** Collect every file under `dir` as an absolute path. */
function walkFiles(dir) {
	const out = []
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry)
		if (statSync(full).isDirectory()) out.push(...walkFiles(full))
		else out.push(full)
	}
	return out
}

/** Extract import/export-from specifiers with their 1-based line numbers. */
function extractSpecifiers(code) {
	const specs = []
	const patterns = [
		/\bfrom\s*["']([^"']+)["']/g, // import ... from "x" / export ... from "x"
		/\bimport\s*["']([^"']+)["']/g, // bare side-effect import
		/\bimport\s*\(\s*["']([^"']+)["']/g, // dynamic import
	]
	for (const pattern of patterns) {
		for (const match of code.matchAll(pattern)) {
			const line = code.slice(0, match.index).split("\n").length
			specs.push({ spec: match[1], line })
		}
	}
	return specs
}

const violations = []
for (const file of walkFiles(srcDir)) {
	const code = readFileSync(file, "utf8")
	for (const { spec, line } of extractSpecifiers(code)) {
		if (
			spec === "quartz" ||
			spec.startsWith("quartz/") ||
			spec.startsWith("../quartz") ||
			spec.startsWith("../../quartz")
		) {
			violations.push(`${file}:${line} imports host module "${spec}" — use @quartz-community/types`)
			continue
		}
		if (spec.startsWith("node:")) {
			violations.push(`${file}:${line} imports Node builtin "${spec}"`)
			continue
		}
		if (forbiddenBareBuiltins.has(spec)) {
			violations.push(`${file}:${line} imports Node builtin "${spec}"`)
			continue
		}
		if (spec.startsWith(".")) {
			const resolved = resolve(dirname(file), spec)
			const relToSrc = relative(srcDir, resolved)
			if (relToSrc.startsWith("..")) {
				violations.push(`${file}:${line} imports "${spec}" which escapes src/`)
			}
		}
	}
}

if (violations.length > 0) {
	console.error("[remark42] import guard failed:")
	for (const violation of violations) console.error(`  ${violation}`)
	process.exit(1)
}
console.log("[remark42] import guard passed")
