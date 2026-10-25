/**
 * Lefthook pre-commit hook: README review prompter.
 *
 * Checks staged code changes, opens the affected module/submodule README
 * files in VS Code with `-n --wait`, and auto-stages any target README
 * files modified during the review.
 *
 * If additional README files were modified or created during the pause that
 * were not part of the initial target set, the hook aborts the commit
 * (`exit 1`) with a clear explanation so the developer can review and stage
 * them manually.
 *
 * Exclusions & protections:
 * - Staged README files do not trigger doc lookups.
 * - Any README file that is already staged in the commit will not be reopened.
 * - The root repository README.md is never auto-opened.
 * - Can be bypassed by setting `SKIP_README=1` or `CI=true`; lefthook also
 *   offers `LEFTHOOK=0` to skip the whole hook.
 *
 * Config side: enabled/disabled via the `readme-review` command in `lefthook.yml`.
 *
 * WHY?
 * - to keep READMEs up to date
 * - to increase retention of the codebase in memory by constantly making
 *   the developer read/write READMEs
 */

import { execSync, spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

// ================================================================
// Local Constants
// ================================================================

/** Bypass switch: set SKIP_README=1 (or run under CI) to make this a no-op. */
const BYPASS = process.env.SKIP_README === "1" || process.env.CI === "true"

// ================================================================
// Exported config & types — none (hook entrypoint script)
// ================================================================

// ================================================================
// Main Flow
// ================================================================

if (BYPASS) {
	process.exit(0)
}

try {
	// 1. Get list of staged files (Added, Copied, Modified, Renamed)
	const stagedFiles = execSync("git diff --cached --name-only --diff-filter=ACMR", { encoding: "utf8" })
		.trim()
		.split("\n")
		.map((file) => normalizePath(file.trim()))
		.filter(Boolean)

	if (stagedFiles.length === 0) process.exit(0)

	// Set of lowercase paths of all README files already staged in this commit
	const stagedReadmePaths = new Set(stagedFiles.filter(isReadmeFile).map((file) => file.toLowerCase()))

	const affectedReadmes = new Set()

	for (const file of stagedFiles) {
		// Staged READMEs should not trigger documentation review lookups
		if (isReadmeFile(file)) {
			continue
		}

		const dir = path.dirname(file)
		const parentDir = path.dirname(dir)

		// Check current module folder README
		const currentReadme = normalizePath(path.posix.join(dir, "README.md"))
		if (
			currentReadme !== "README.md" &&
			!stagedReadmePaths.has(currentReadme.toLowerCase()) &&
			fs.existsSync(currentReadme)
		) {
			affectedReadmes.add(currentReadme)
		}

		// Check parent module folder README (excluding repository root)
		if (parentDir && parentDir !== "." && parentDir !== dir) {
			const parentReadme = normalizePath(path.posix.join(parentDir, "README.md"))
			if (
				parentReadme !== "README.md" &&
				!stagedReadmePaths.has(parentReadme.toLowerCase()) &&
				fs.existsSync(parentReadme)
			) {
				affectedReadmes.add(parentReadme)
			}
		}
	}

	if (affectedReadmes.size > 0) {
		const readmeList = Array.from(affectedReadmes)

		console.log(
			"\x1b[33m%s\x1b[0m",
			"\n📝  Affected module READMEs detected. Opening in a dedicated VS Code window for review:",
		)
		for (const readme of readmeList) {
			console.log(`   • \x1b[36m${readme}\x1b[0m`)
		}
		console.log("\x1b[90m%s\x1b[0m", "   (Close the review window when finished to proceed with commit...)\n")

		// Open in a dedicated VS Code window and wait for it to be closed
		openInVsCodeAndWait(readmeList)

		// 2. Auto-stage any target README files that were edited/saved during review
		let stagedCount = 0
		const targetReadmeLowerSet = new Set(readmeList.map((r) => r.toLowerCase()))

		for (const readme of readmeList) {
			const status = execSync(`git status --porcelain "${readme}"`, { encoding: "utf8" }).trim()
			if (status) {
				execSync(`git add "${readme}"`)
				console.log(`   \x1b[32m✔ Auto-staged updated:\x1b[0m ${readme}`)
				stagedCount++
			}
		}

		// 3. Scan repository for any additional modified or newly created README files
		const extraModifiedReadmes = getUnstagedModifiedReadmes().filter(
			(r) => !targetReadmeLowerSet.has(r.toLowerCase()),
		)

		if (extraModifiedReadmes.length > 0) {
			console.error(
				"\x1b[31m%s\x1b[0m",
				"\n✖ Commit aborted: additional modified/untracked README files detected outside the review set:",
			)
			for (const extraReadme of extraModifiedReadmes) {
				console.error(`   • \x1b[33m${extraReadme}\x1b[0m`)
			}
			console.error(
				"\x1b[90m%s\x1b[0m\n",
				"Please stage the desired README changes (`git add <file>`) and run git commit again.",
			)
			process.exit(1)
		}

		if (stagedCount > 0) {
			console.log(`\n\x1b[32m✔ Staged ${stagedCount} updated README(s). Proceeding with commit.\x1b[0m\n`)
		} else {
			console.log("\x1b[90m✔ No README changes made. Proceeding with commit.\x1b[0m\n")
		}
	}
} catch (err) {
	// If an intentional abort (exit code 1) was triggered, propagate it
	if (err && typeof err.status === "number" && err.status !== 0) {
		process.exit(err.status)
	}
	// Any other failure must not silently block or silently pass: surface it
	// and fail the commit so the developer can decide.
	console.error("\x1b[31m%s\x1b[0m", `\n✖ README review hook crashed unexpectedly: ${err?.message ?? err}`)
	process.exit(1)
}

process.exit(0)

// ================================================================
// Local Functions
// ================================================================

/** Check if a file path is a README (case-insensitive). */
function isReadmeFile(filePath) {
	return path.basename(filePath).toLowerCase() === "readme.md"
}

/** Normalize a path to forward slashes without leading `./`. */
function normalizePath(filePath) {
	return path.posix.normalize(filePath.replace(/\\/g, "/")).replace(/^\.\//, "")
}

/**
 * Opens the list of files in a dedicated new VS Code window with `--wait`,
 * pausing execution until the review window / tabs are closed by the developer.
 */
function openInVsCodeAndWait(files) {
	try {
		const absolutePaths = files.map((file) => path.resolve(process.cwd(), file))
		const command = process.platform === "win32" ? "code.cmd" : "code"

		spawnSync(command, ["-n", "--wait", ...absolutePaths], {
			shell: true,
			stdio: "inherit",
			cwd: process.cwd(),
		})
	} catch {
		// Ignore if 'code' CLI is not in PATH or fails
	}
}

/** Scans the repository for all unstaged or untracked README.md files. */
function getUnstagedModifiedReadmes() {
	try {
		const statusOutput = execSync("git status --porcelain", { encoding: "utf8" }).trim()
		if (!statusOutput) return []

		const files = []
		for (const line of statusOutput.split("\n")) {
			const trimmed = line.trim()
			if (!trimmed) continue

			// Format: XY <file> or XY "<file>"
			const filePath = normalizePath(trimmed.slice(2).trim().replace(/^"|"$/g, ""))
			if (isReadmeFile(filePath) && filePath !== "README.md") {
				files.push(filePath)
			}
		}
		return files
	} catch {
		return []
	}
}
