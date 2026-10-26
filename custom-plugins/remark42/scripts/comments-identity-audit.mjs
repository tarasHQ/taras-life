/**
 * Manual audit of the comment surface: frontmatter `id` values across `content/`
 * and the comment markup of the generated site.
 *
 * Runs only when invoked (`npm run check:comments` from the repo root) — it is not
 * part of `check`, the pre-push hook, CI, or the site build. Build-time validation
 * is O(1) per page by design (the component checks only its own `id`), so a
 * cross-page sweep on every build would add latency to catch mistakes that are rare
 * and cheap to fix when reported.
 *
 * It exists because two failures are otherwise silent:
 * - two notes sharing an `id` mix into one thread, and an id outside `[a-z0-9-]+`
 *   or written as a non-string opens a thread nobody can find again;
 * - a plugin that failed to load still produces a successful build and a page that
 *   looks fine, just without comments (the loader's import error is swallowed
 *   upstream), so the generated HTML is checked for the container and inline config.
 *
 * The validation rules are not re-implemented here: they are imported from
 * `../src/thread-identity.ts`, the same module the build-time component uses.
 *
 * Read-only. No network. Exit codes: 0 clean, 1 findings reported, 2 could not run
 * (missing directories, bad arguments).
 *
 * Usage:
 *   npm run check:comments
 *   tsx custom-plugins/remark42/scripts/comments-identity-audit.mjs --no-public
 *   tsx custom-plugins/remark42/scripts/comments-identity-audit.mjs --root <dir> --sample 50
 */
import { existsSync } from "node:fs"
import { readdir, readFile } from "node:fs/promises"
import { dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { parse as parseYaml } from "yaml"
import {
	buildThreadUrl,
	checkThreadId,
	findOptOutIssues,
	scanThreadIdIssues,
	THREAD_BASE_URL,
} from "../src/thread-identity.ts"

// === Local Constants ===============================================

/** Plugin root — the audit's own position inside the repository. */
const PLUGIN_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
/** Repository root, the default scope of both audited directories. */
const DEFAULT_ROOT = resolve(PLUGIN_ROOT, "..", "..")
/** Content directory name, relative to the repository root. */
const CONTENT_DIR_NAME = "content"
/** Build output directory name, relative to the repository root. */
const PUBLIC_DIR_NAME = "public"
/** Directories never scanned for content notes. */
const SKIPPED_DIRECTORY_NAMES = new Set([".obsidian", "node_modules"])
/** Extensions treated as content notes; `.excalidraw.md` matches `.md`. */
const CONTENT_EXTENSIONS = [".md", ".mdx"]
/** Default number of non-commentable pages sampled by the negative markup check. */
const DEFAULT_NEGATIVE_SAMPLE = 25
/** Marker every commentable page must carry in the generated HTML. */
const CONFIG_MARKER = 'id="remark42-config"'
/** Container markup every commentable page must carry in the generated HTML. */
const CONTAINER_MARKER = '<div id="remark42">'

/** Printed on any unusable invocation, so the fix is always in view. */
const USAGE = `Usage: tsx custom-plugins/remark42/scripts/comments-identity-audit.mjs [options]

  --root <dir>   Repository root to audit (default: this repository)
  --no-public    Audit frontmatter only; skip the generated-HTML checks
  --sample <n>   Non-commentable pages to sample in the HTML checks (default: ${DEFAULT_NEGATIVE_SAMPLE})
  --help         Print this message
`

// === Local Classes =================================================

/**
 * Collects everything the audit learned. State is held in one place so the
 * reporting functions stay pure with respect to their arguments and the exit code
 * is derived from a single `findings` list.
 */
class AuditReport {
	/** Human-readable problems; any entry makes the audit fail. */
	findings = []
	/** Non-fatal observations that qualify a "passed" verdict. */
	notes = []

	/** Record a passing check. */
	ok(message) {
		console.log(`ok: ${message}`)
	}

	/** Record an observation that narrows what the verdict covers. */
	note(message) {
		this.notes.push(message)
	}

	/** Record a problem; reported for every finding, so one run fixes everything. */
	fail(message) {
		this.findings.push(message)
	}
}

// === Entry Point ===================================================

const options = parseArguments(process.argv.slice(2))
if (options.help) {
	process.stdout.write(USAGE)
	process.exit(0)
}

const contentDir = join(options.root, CONTENT_DIR_NAME)
if (!existsSync(contentDir)) failUsage(`no content directory at ${contentDir}`)

const report = new AuditReport()
const notePaths = await listContentNotes(contentDir)
const pages = await readPages(contentDir, notePaths, report)
const commentablePages = pages.filter(isCommentable)

console.log("[remark42] comments identity audit")
console.log(`  content: ${contentDir}`)
console.log(`  notes:   ${pages.length} markdown file(s), ${commentablePages.length} commentable`)
for (const page of commentablePages) {
	console.log(`  thread:  ${page.relativePath} → ${buildThreadUrl(page.frontmatter.id.trim(), THREAD_BASE_URL)}`)
}

reportCheck(report, "id", scanThreadIdIssues(pages))
reportCheck(report, "comments", findOptOutIssues(pages))
await reportGeneratedHtml(report, pages, options)

for (const note of report.notes) console.log(`note: ${note}`)
if (report.findings.length > 0) {
	for (const finding of report.findings) console.error(`FAIL: ${finding}`)
	console.error(`\n[remark42] audit failed — ${report.findings.length} finding(s) to fix.`)
	process.exit(1)
}
console.log("[remark42] audit passed — every comment thread is uniquely and validly addressed.")
process.exit(0)

// === Local Functions ===============================================

/**
 * Parse the command line into a resolved options object. Unknown flags fail loudly
 * rather than being ignored: a silently dropped flag would report a clean audit
 * that never ran the check the reader asked for.
 */
function parseArguments(argv) {
	const parsed = { root: DEFAULT_ROOT, public: true, sample: DEFAULT_NEGATIVE_SAMPLE, help: false }

	for (let index = 0; index < argv.length; index++) {
		const argument = argv[index]
		if (argument === "--help" || argument === "-h") {
			parsed.help = true
			continue
		}
		if (argument === "--no-public") {
			parsed.public = false
			continue
		}
		if (argument === "--root" || argument === "--sample") {
			const raw = argv[++index]
			if (raw === undefined) failUsage(`${argument} needs a value`)
			if (argument === "--root") parsed.root = resolve(raw)
			else parsed.sample = parsePositiveInt(raw, "--sample")
			continue
		}
		failUsage(`unknown argument ${JSON.stringify(argument)}`)
	}

	if (!Number.isInteger(parsed.sample) || parsed.sample < 1) failUsage("--sample must be a positive integer")
	return parsed
}

/** Report an unusable invocation and exit with the environment-error code. */
function failUsage(message) {
	console.error(`[remark42] audit failed: ${message}`)
	process.stdout.write(USAGE)
	process.exit(2)
}

/** Strict positive-integer parse for numeric flags. */
function parsePositiveInt(value, flag) {
	const parsed = Number(value)
	if (!Number.isInteger(parsed) || parsed < 1) {
		failUsage(`${flag} must be a positive integer, got ${JSON.stringify(value)}`)
	}
	return parsed
}

/** Collect every content note under `dir` as repo-relative POSIX paths, sorted deterministically. */
async function listContentNotes(dir) {
	const found = []
	const pending = [dir]

	while (pending.length > 0) {
		const current = pending.pop()
		const entries = await readdir(current, { withFileTypes: true })
		for (const entry of entries) {
			if (entry.isDirectory()) {
				if (SKIPPED_DIRECTORY_NAMES.has(entry.name) || entry.name.startsWith(".")) continue
				pending.push(join(current, entry.name))
				continue
			}
			if (!entry.isFile()) continue
			if (!CONTENT_EXTENSIONS.some((extension) => entry.name.endsWith(extension))) continue
			found.push(join(current, entry.name))
		}
	}

	return found.sort(compareStrings)
}

/**
 * Read and parse every note's frontmatter into the shape the identity rules expect.
 * A note with malformed frontmatter cannot be judged, so it is reported as a
 * finding instead of being silently treated as comment-free.
 */
async function readPages(dir, files, report) {
	const pages = []
	const root = resolve(dir, "..")

	for (const file of files) {
		const relativePath = toPosix(relative(root, file))
		const frontmatter = extractFrontmatter(await readFile(file, "utf8"))
		if (frontmatter.kind === "malformed") {
			report.fail(`${relativePath}: frontmatter is not valid YAML — ${frontmatter.problem}`)
			pages.push({ relativePath, frontmatter: {} })
			continue
		}
		pages.push({ relativePath, frontmatter: frontmatter.value })
	}

	return pages
}

/**
 * Split the leading `---` block off a note and parse it as YAML. Only a block at the
 * very top of the file counts — a horizontal rule further down is content, and
 * mistaking it for metadata would invent ids that do not exist.
 */
function extractFrontmatter(text) {
	const withoutBom = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
	const lines = withoutBom.split(/\r?\n/)
	if (lines[0]?.trim() !== "---") return { kind: "parsed", value: {} }

	const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---")
	if (closingIndex === -1) return { kind: "malformed", problem: "the opening --- has no closing ---" }

	try {
		const value = parseYaml(lines.slice(1, closingIndex).join("\n"))
		if (value === null || value === undefined) return { kind: "parsed", value: {} }
		if (typeof value !== "object" || Array.isArray(value)) {
			return { kind: "malformed", problem: "the frontmatter block is not a mapping" }
		}
		return { kind: "parsed", value }
	} catch (error) {
		return { kind: "malformed", problem: error instanceof Error ? error.message : String(error) }
	}
}

/** A page is commentable when it opts in with a usable `id` and is not opted out. */
function isCommentable(page) {
	if (page.frontmatter["comments"] === false) return false
	return checkThreadId(page.frontmatter["id"]).kind === "valid"
}

/** Print one check's issues and record them as findings; silence of issues means it passed. */
function reportCheck(report, label, issues) {
	if (issues.length === 0) {
		report.ok(`${label} check passed`)
		return
	}
	console.log(`FAIL: ${label} check — ${issues.length} issue(s)`)
	for (const issue of issues) {
		for (const page of issue.pages) report.fail(`${page}: ${issue.problem}`)
	}
}

/**
 * Check the generated HTML of every commentable page for the container and the
 * inline config, and sample non-commentable pages to confirm they stayed clean.
 * Bounded by design — one read per commentable page plus a fixed-size sample — so
 * the cost does not grow with the size of the site.
 */
async function reportGeneratedHtml(report, pages, options) {
	if (!options.public) {
		report.note("generated-HTML checks skipped (--no-public)")
		return
	}
	const publicDir = join(options.root, PUBLIC_DIR_NAME)
	if (!existsSync(publicDir)) {
		report.note(`generated-HTML checks skipped: no build output at ${publicDir}`)
		return
	}

	let checked = 0
	for (const page of pages.filter(isCommentable)) {
		const html = await readGeneratedHtml(publicDir, page.relativePath, report)
		if (html === null) continue
		const missing = [CONFIG_MARKER, CONTAINER_MARKER].filter((marker) => !html.includes(marker))
		if (missing.length > 0) {
			report.fail(
				`${page.relativePath}: generated HTML is missing ${missing.join(" and ")} — the plugin did not render`,
			)
		}
		checked++
	}

	for (const page of pages.filter((candidate) => !isCommentable(candidate)).slice(0, options.sample)) {
		const html = await readGeneratedHtml(publicDir, page.relativePath, report)
		if (html === null) continue
		if (html.includes(CONFIG_MARKER)) {
			report.fail(`${page.relativePath}: generated HTML carries a comment config but the note has no usable id`)
		}
		checked++
	}

	report.ok(`generated-HTML check ran over ${checked} page(s)`)
}

/** Read a page's generated HTML, or null (recorded as a note) when the page was not emitted. */
async function readGeneratedHtml(publicDir, relativeContentPath, report) {
	const htmlPath = join(publicDir, toFileSystemPath(relativeContentPath.replace(/\.mdx?$/, ".html")))
	if (!existsSync(htmlPath)) {
		report.note(`${relativeContentPath}: no generated HTML (not published?) — markup not checked`)
		return null
	}
	return readFile(htmlPath, "utf8")
}

/** Convert a POSIX-relative path to the host separator for filesystem access. */
function toFileSystemPath(relativePath) {
	return relativePath.split("/").join(sep)
}

/** Normalise a host path to POSIX separators so reports are identical across platforms. */
function toPosix(path) {
	return path.split(sep).join("/")
}

/** Locale-independent ordering, so report order never depends on the machine. */
function compareStrings(a, b) {
	return a < b ? -1 : a > b ? 1 : 0
}
